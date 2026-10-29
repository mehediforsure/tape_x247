import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";
import { renderToStaticMarkup } from "react-dom/server";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

// Exercise the actual server modules with fixture queries, without credentials or a running server.
// Compile TS/TSX in memory so its output can be checked with React's server renderer.
function loadSource(file, overrides = {}, errors = []) {
  const modules = new Map();
  function load(filename) {
    if (modules.has(filename)) return modules.get(filename).exports;
    const module = { exports: {} };
    modules.set(filename, module);
    const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    });
    function localRequire(name) {
      if (Object.hasOwn(overrides, name)) return overrides[name];
      if (name.startsWith("@/") || name.startsWith(".")) {
        const stem = name.startsWith("@/") ? path.join(root, "src", name.slice(2)) : path.resolve(path.dirname(filename), name);
        const resolved = [".ts", ".tsx", "/index.ts", "/index.tsx"].map(ext => stem + ext).find(existsSync);
        if (resolved) return load(resolved);
      }
      return require(name);
    }
    vm.runInNewContext(`(function(require, module, exports) { ${outputText}\n})`, {
      console: { ...console, error: (...args) => errors.push(args) }, AbortSignal, URL,
    }, { filename })(localRequire, module, module.exports);
    return module.exports;
  }
  return load(path.join(root, file));
}

function queryFixture(rows) {
  const calls = [];
  const builder = {
    select(value) { calls.push(["select", value]); return this; },
    eq(column, value) { calls.push(["eq", column, value]); return this; },
    order(column, options) { calls.push(["order", column, options]); return this; },
    abortSignal(signal) { assert.equal(signal.aborted, false); return Promise.resolve({ data: rows, error: null }); },
  };
  const queries = loadSource("src/lib/content/queries.ts", {
    "@/utils/supabase/public": { createPublicClient: () => ({ from: () => builder }) },
  });
  return { queries, calls };
}

const artist = {
  slug: "artist", name: "Artist", status: "published", featured: false,
  bio: null, source_note: null, catalogue_no: null, based_in: null, cities: null,
  countries: { name: "Bangladesh" }, active_from: null, active_to: null,
  image_url: null, release_artists: [],
};
const release = {
  id: "release", slug: "release", title: "Release", status: "published",
  release_date: null, format: null, labels: null, tracks: [], cover_url: null,
};

test("only published releases appear, and artists without visible releases remain", async () => {
  const { queries, calls } = queryFixture([{ ...artist, release_artists: [
    { releases: { ...release, status: "draft" } }, { releases: null },
  ] }]);
  const artists = await queries.getArtists();
  assert.equal(artists.length, 1);
  assert.equal(artists[0].releases.length, 0);
  assert.ok(calls.some(c => c[0] === "eq" && c[1] === "status" && c[2] === "published"));
  assert.ok(calls.some(c => c[0] === "eq" && c[1] === "release_artists.releases.status" && c[2] === "published"));
  assert.ok(!calls.find(c => c[0] === "select")[1].includes("!inner"));
  assert.equal((await queryFixture(null).queries.getArtists()).length, 0);
});

test("undocumented metadata stays unknown and nonstandard formats are preserved", async () => {
  const { queries } = queryFixture([{ ...artist, release_artists: [
    { releases: release },
    { releases: { ...release, id: "other", slug: "other", format: " MiniDisc " } },
  ] }]);
  const [mapped] = await queries.getArtists();
  assert.equal(mapped.active, null);
  assert.equal(mapped.code, undefined);
  const unknown = mapped.releases.find(r => r.slug === "release");
  assert.equal(unknown.year, null);
  assert.equal(unknown.format, null);
  assert.equal(unknown.label, null);
  assert.equal(unknown.type, null);
  assert.equal(mapped.releases.find(r => r.slug === "other").format, "MiniDisc");
});

test("documented years, formats and tracks on every side survive mapping", async () => {
  const { queries } = queryFixture([{ ...artist, active_from: 2010, active_to: 2020, release_artists: [
    { releases: { ...release, release_date: "2026-10-20", format: " VINYL ", labels: { name: "An imprint" }, tracks: [
      { title: "Fourth side", position: 1, side: "Side D" },
      { title: "Second track", position: 2, side: "a" },
      { title: "First track", position: 1, side: " A " },
    ] } },
  ] }]);
  const [mapped] = await queries.getArtists();
  assert.equal(mapped.active, "2010 to 2020");
  const [disc] = mapped.releases;
  assert.equal(disc.year, 2026);
  assert.equal(disc.releaseDate, "2026-10-20");
  assert.equal(disc.format, "Vinyl");
  assert.equal(disc.label, "An imprint");
  assert.deepEqual(Array.from(disc.sideA), ["First track", "Second track"]);
  assert.equal(disc.extraSides[0].side, "D");
  assert.equal(disc.extraSides[0].tracks[0], "Fourth side");
  const [openEnded] = await queryFixture([{ ...artist, active_from: 2010 }]).queries.getArtists();
  assert.equal(openEnded.active, "From 2010");
});

test("homepage releases sort across artists by full date, with undated releases last", async () => {
  const { queries } = queryFixture([
    { ...artist, slug: "a", release_artists: [{ releases: { ...release, slug: "old", release_date: "2026-01-01" } }] },
    { ...artist, slug: "z", featured: true, release_artists: [
      { releases: { ...release, slug: "undated" } },
      { releases: { ...release, slug: "new", release_date: "2026-10-01" } },
    ] },
  ]);
  const page = loadSource("src/app/page.tsx", { "@/lib/content/queries": queries });
  const element = await page.default();
  assert.deepEqual(Array.from(element.props.releases, r => r.slug), ["z-new", "a-old", "z-undated"]);
  assert.equal(element.props.spotlight.slug, "z");
  const noFeatured = loadSource("src/app/page.tsx", { "@/lib/content/queries": queryFixture([artist]).queries });
  assert.equal((await noFeatured.default()).props.spotlight, undefined);
});

test("release catalog preserves uncredited releases and combines published artist credits", () => {
  const { buildReleaseCatalog, releaseAnchor, releaseHref } = loadSource("src/lib/content/catalog.ts");
  const records = [
    { slug: "unknown", title: "Undated", release_date: null, format: null, cover_url: null, labels: null },
    { slug: "shared", title: "Shared", release_date: "2026-10-01", format: "digital", cover_url: null, labels: [{ name: "Label" }] },
  ];
  const catalog = buildReleaseCatalog(records, [
    { slug: "b", name: "B", releases: [{ slug: "shared", title: "Shared" }] },
    { slug: "a", name: "A", releases: [{ slug: "shared", title: "Shared" }] },
  ]);
  assert.deepEqual(Array.from(catalog, record => record.slug), ["shared", "unknown"]);
  assert.deepEqual(Array.from(catalog[0].artists, credit => credit.name), ["A", "B"]);
  assert.equal(catalog[0].label, "Label");
  assert.equal(catalog[1].artists.length, 0);
  const unusual = { title: "A title / with spaces" };
  assert.equal(decodeURIComponent(releaseHref("a", unusual).split("#")[1]), releaseAnchor(unusual));
});

test("release links accept web URLs and reject executable or malformed URLs", async () => {
  const { queries } = queryFixture([{ ...artist, source_note: "Documented source", release_artists: [{ releases: {
    ...release, links: [
      { platform: "bandcamp", url: "https://example.com/album" },
      { url: "javascript:alert(1)" }, { url: "data:text/html,test" },
      { url: "not a URL" }, null,
    ],
  } }] }]);
  const [mapped] = await queries.getArtists();
  assert.equal(mapped.sourceNote, "Documented source");
  assert.equal(mapped.releases[0].links.length, 1);
  assert.equal(mapped.releases[0].links[0].url, "https://example.com/album");
});

test("catalog browsing combines filters, reports no matches, and clears all selections", () => {
  const releases = [
    { slug: "one", title: "First Record", release_date: "2026-10-01", format: "digital", label: null, cover_url: null, artists: [{ name: "Alpha", slug: "alpha", href: "/featured/artists/alpha#release-one" }] },
    { slug: "two", title: "Second Record", release_date: "2025-01-01", format: "cassette", label: null, cover_url: null, artists: [] },
  ];
  function browserWithState(state) {
    let index = 0;
    const updates = [];
    const browser = loadSource("src/components/CatalogBrowser.tsx", {
      react: { ...require("react"), useState: () => {
        const slot = index++;
        return [state[slot], value => updates.push([slot, value])];
      } },
    });
    return { browser: browser.default, updates };
  }
  const matching = browserWithState(["alpha", "", "2026", "digital"]);
  const element = matching.browser({ releases, kind: "releases" });
  const html = renderToStaticMarkup(element);
  assert.ok(html.includes("First Record"));
  assert.ok(!html.includes("Second Record"));
  assert.ok(html.includes("1 of 2 records"));
  element.props.children[1].props.children[1].props.onClick();
  assert.deepEqual(matching.updates, [[0, ""], [1, ""], [2, ""], [3, ""]]);
  const missing = browserWithState(["alpha", "", "2025", "digital"]);
  assert.ok(renderToStaticMarkup(missing.browser({ releases, kind: "releases" })).includes("No records match your filters"));
  const artists = [
    { ...artist, slug: "a", name: "Alpha", location: "Dhaka", country: "Bangladesh", tags: [], summary: "" },
    { ...artist, slug: "b", name: "Beta", location: "Delhi", country: "India", tags: [], summary: "" },
  ];
  const country = browserWithState(["", "Bangladesh", "", ""]);
  const artistHtml = renderToStaticMarkup(country.browser({ artists, kind: "artists" }));
  assert.ok(artistHtml.includes("Alpha"));
  assert.ok(!artistHtml.includes("Beta"));
  assert.ok(artistHtml.includes("1 of 2 records"));
});

test("homepage outage keeps local stories and hides unavailable counts", async () => {
  const { queries } = queryFixture([]);
  const errors = [];
  const page = loadSource("src/app/page.tsx", { "@/lib/content/queries": {
    ...queries, getArtists: async () => { throw new Error("Fixture outage"); },
  } }, errors);
  const html = renderToStaticMarkup(await page.default());
  assert.ok(html.includes("Archive records are temporarily unavailable"));
  const stories = queries.getArticles();
  for (const story of stories) assert.ok(html.includes(`/editorial/${story.slug}`));
  assert.ok(!html.includes("No published releases yet"));
  assert.ok(!html.includes("00 records"));
  assert.equal(errors.length, 1);
});

test("article bodies survive outages, and stories without mentions skip the query", async () => {
  const { queries } = queryFixture([]);
  let calls = 0;
  const errors = [];
  const article = loadSource("src/components/editorial/Article.tsx", { "@/lib/content/queries": {
    ...queries, getArtists: async () => { calls++; throw new Error("Fixture outage"); },
  } }, errors);
  const dispatches = loadSource("src/content/demo.ts").dispatches;
  await article.default({ lead: dispatches[1] });
  assert.equal(calls, 0);
  const html = renderToStaticMarkup(await article.default({ lead: dispatches[0] }));
  assert.equal(calls, 1);
  for (const paragraph of dispatches[0].body) {
    const expected = renderToStaticMarkup(require("react").createElement("p", null, paragraph));
    assert.ok(html.includes(expected), "Article paragraphs remain available during an archive outage");
  }
  assert.ok(html.includes("Related artist records are temporarily unavailable"));
  assert.equal(errors.length, 1);
});

test("error retry requests fresh server content and resets the boundary", () => {
  const calls = [];
  const boundary = loadSource("src/app/error.tsx", {
    "next/navigation": { useRouter: () => ({ refresh: () => calls.push("refresh") }) },
    react: { ...require("react"), useTransition: () => [false, callback => callback()] },
  });
  const element = boundary.default({ reset: () => calls.push("reset") });
  const button = element.props.children[2].props.children[0];
  assert.equal(button.type, "button");
  button.props.onClick();
  assert.deepEqual(calls, ["refresh", "reset"]);
});

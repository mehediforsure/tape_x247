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
      console: { ...console, error: (...args) => errors.push(args) }, AbortSignal,
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

test("homepage outage keeps local stories and hides unavailable counts", async () => {
  const { queries } = queryFixture([]);
  const errors = [];
  const page = loadSource("src/app/page.tsx", { "@/lib/content/queries": {
    ...queries, getArtists: async () => { throw new Error("Fixture outage"); },
  } }, errors);
  const html = renderToStaticMarkup(await page.default());
  assert.ok(html.includes("Releases are temporarily unavailable"));
  assert.ok(html.includes("rooftop tape swap"));
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
  assert.ok(html.includes("The stairwell smelled"));
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

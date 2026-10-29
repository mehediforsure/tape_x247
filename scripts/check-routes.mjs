import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";

const port = 4317;
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
let output = "";
server.stdout.on("data", chunk => output += chunk);
server.stderr.on("data", chunk => output += chunk);
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error(output);
    try { ready = (await fetch(origin)).ok; } catch {}
    if (ready) break;
    await delay(200);
  }
  assert.ok(ready, `Production server did not start: ${output}`);
  const paths = ["/", "/featured", "/featured/artists", "/featured/artists/shoummo-saha", "/editorial", "/editorial/dhaka-electronic-underground-builds-its-own-room", "/editorial/from-bedroom-sessions-to-the-booth", "/discover", ...["bangladesh", "india", "nepal", "pakistan", "sri-lanka"].map(c => `/discover/${c}`), ...["collectives", "labels", "releases", "venues", "events", "platforms", "people", "sources"].map(c => `/featured/${c}`), "/about", "/learn"];
  const links = new Set();
  const releaseLinks = new Set();
  for (const path of paths) {
    const response = await fetch(origin + path, { redirect: "manual" });
    assert.equal(response.status, 200, path);
    const html = await response.text();
    for (const match of html.matchAll(/href="(\/featured\/artists\/[^"#]+#release-[^"]+)"/g)) releaseLinks.add(match[1]);
    assert.ok(html.includes("tape_x247"), `${path} contains site shell`);
    for (const match of html.matchAll(/href="(\/[^"#?]*)"/g)) {
      if (!match[1].startsWith("/_next/")) links.add(match[1]);
    }
  }
  for (const path of links) assert.equal((await fetch(origin + path)).status, 200, `Internal link: ${path}`);
  for (const href of releaseLinks) {
    const [path, fragment] = href.split("#");
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, `Release destination: ${path}`);
    assert.ok((await response.text()).includes(`id="${decodeURIComponent(fragment)}"`), `Release anchor exists: ${href}`);
  }
  assert.ok(releaseLinks.size > 0, "Published releases provide direct discography links");
  for (const slug of ["shoummo-saha"]) {
    const response = await fetch(`${origin}/archive/${slug}`, { redirect: "manual" });
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), `/featured/artists/${slug}`);
  }
  for (const path of ["/missing", "/featured/artists/missing", "/editorial/missing", "/discover/missing", "/featured/unknown"]) assert.equal((await fetch(origin + path)).status, 404, path);
  console.log(`Passed: ${paths.length} pages, ${links.size} internal links, ${releaseLinks.size} release anchors, 1 redirect and 5 missing routes.`);
} finally {
  server.kill();
  if (server.exitCode === null) await once(server, "exit");
}

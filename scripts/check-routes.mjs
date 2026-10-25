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
  const paths = ["/", "/archive", "/archive/artists", "/archive/artists/shoumma-saha", "/archive/artists/mehedi-h", "/magazine", "/magazine/rooftop-tape-swap", "/magazine/label-archive-stub", "/magazine/oral-history-stub", "/scenes", ...["bangladesh", "india", "nepal", "pakistan", "sri-lanka"].map(c => `/scenes/${c}`), ...["collectives", "labels", "releases", "venues", "events", "platforms", "people", "sources"].map(c => `/archive/${c}`), "/about", "/learn"];
  const links = new Set();
  for (const path of paths) {
    const response = await fetch(origin + path, { redirect: "manual" });
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.ok(html.includes("tape_x247"), `${path} contains site shell`);
    for (const match of html.matchAll(/href="(\/[^"#?]*)"/g)) {
      if (!match[1].startsWith("/_next/")) links.add(match[1]);
    }
  }
  for (const path of links) assert.equal((await fetch(origin + path)).status, 200, `Internal link: ${path}`);
  for (const slug of ["shoumma-saha", "mehedi-h"]) {
    const response = await fetch(`${origin}/archive/${slug}`, { redirect: "manual" });
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), `/archive/artists/${slug}`);
  }
  for (const path of ["/missing", "/archive/artists/missing", "/magazine/missing", "/scenes/missing", "/archive/unknown"]) assert.equal((await fetch(origin + path)).status, 404, path);
  console.log(`Passed: ${paths.length} pages, ${links.size} internal links, 2 redirects and 5 missing routes.`);
} finally {
  server.kill();
  if (server.exitCode === null) await once(server, "exit");
}

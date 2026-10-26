// Run from the project root:  node scripts/check-supabase.mjs
// Reads .env.local (falls back to the shell env) and talks to Supabase exactly
// like the browser/Next server would. Prints a pass/fail line per check.
import { readFileSync, existsSync } from "node:fs";

function loadEnvFile(path) {
  if (!existsSync(path)) return false;
  for (const raw of readFileSync(path, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i < 0) continue;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!(k in process.env)) process.env[k] = v;
  }
  return true;
}

const ok = (m) => console.log("  PASS  " + m);
const bad = (m) => { console.log("  FAIL  " + m); process.exitCode = 1; };

console.log("tape_x247 · Supabase connectivity check\n");

const found = loadEnvFile(".env.local");
found ? ok(".env.local found") : bad(".env.local NOT found (only .env.local.backup? copy it to .env.local)");

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const key = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "").trim();

if (!url) bad("NEXT_PUBLIC_SUPABASE_URL is empty/missing"); else ok("NEXT_PUBLIC_SUPABASE_URL is set");
if (!key) bad("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is empty/missing"); else ok("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is set");
if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !key)
  bad("Found NEXT_PUBLIC_SUPABASE_ANON_KEY — this project reads ..._PUBLISHABLE_KEY. Rename it.");
if (!url || !key) process.exit(1);

if (!/^https:\/\/[a-z0-9]+\.supabase\.co\/?$/.test(url)) bad("URL should look like https://<ref>.supabase.co (no /rest/v1 suffix)");
if (key.startsWith("sb_secret_") || key.includes("service_role")) bad("That is a SECRET key. Use the publishable key in NEXT_PUBLIC_*");

const base = url.replace(/\/$/, "");
// sb_publishable_ keys are not JWTs: send them ONLY in the `apikey` header.
const headers = { apikey: key };

async function get(path) {
  const res = await fetch(base + "/rest/v1/" + path, { headers });
  const text = await res.text();
  let body; try { body = JSON.parse(text); } catch { body = text; }
  return { status: res.status, body };
}

try {
  const a = await get("artists?select=slug,name,status&order=catalogue_no");
  if (a.status !== 200) bad(`artists -> HTTP ${a.status}: ${JSON.stringify(a.body)}`);
  else if (!Array.isArray(a.body) || a.body.length === 0)
    bad("artists -> 200 but 0 rows. RLS is hiding them (rows must have status='published') or the table is empty.");
  else ok(`artists -> ${a.body.length} rows: ${a.body.map((r) => r.slug).join(", ")}`);

  const e = await get(
    "artists?select=slug,city:cities(name),country:countries(slug),links(platform),release_artists(release:releases(slug,tracks(id)))&limit=1",
  );
  if (e.status !== 200) bad(`embedded query -> HTTP ${e.status}: ${JSON.stringify(e.body)}`);
  else ok("embedded joins (cities, countries, links, releases, tracks) resolve");
} catch (err) {
  bad("network error reaching Supabase: " + (err?.cause?.code ?? err?.message ?? err));
}
console.log(process.exitCode ? "\nSomething above failed — fix the first FAIL line first." : "\nAll good: Supabase is reachable and returns data.");

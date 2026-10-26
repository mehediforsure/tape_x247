# v2 milestone status

Reviewed on 2026-10-26. The Git tag is `v2`; `package.json` remains at `0.1.0`.

## Working baseline

- Public Supabase artist profiles, discographies, labels and release collections.
- Canonical Featured, Editorial and Discover URLs with redirects from the previous section names.
- Explicit publication filters for artists and releases, including nested discographies.
- Homepage release ordering by full date, a database-selected artist spotlight and truthful missing metadata.
- Homepage and editorial outage handling, archive retry UI and regression checks.
- A compressed background with the original PNG retained.

The archive requires the configured Supabase project and its existing schema and policies. Copy `.env.example` to `.env.local` and supply the project URL and public publishable key before building. Environment files and local backups stay outside Git.

## Remaining dependency findings

`npm audit --json` on 2026-10-26 reports five affected packages: one high and four moderate, with no critical findings.

| Package | Reported severity | Dependency path |
| --- | --- | --- |
| `postcss` | High | Nested under `next` |
| `next` | Moderate | Direct runtime dependency, affected through PostCSS |
| `postcss-selector-parser` | Moderate | Tailwind/PostCSS dependency tree |
| `postcss-nested` | Moderate | Tailwind dependency tree |
| `tailwindcss` | Moderate | Direct development dependency, affected through transitive packages |

The findings include [PostCSS source-map file disclosure](https://github.com/advisories/GHSA-6g55-p6wh-862q), its [incomplete fix](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp), and [selector-parser CPU exhaustion](https://github.com/advisories/GHSA-rj75-hqrm-r3gf). The audit alone does not establish exploitability in this application. npm proposes major Next.js and Tailwind upgrades; dependency remediation and compatibility testing remain separate work. No forced dependency upgrade was applied for this milestone.

## Remaining product and content work

| Area | Current limit |
| --- | --- |
| Editorial | One mock dispatch and two publicly accessible planning stubs; no CMS or published-story workflow. |
| Empty collections | Collectives, events, venues, platforms, people and sources show fixed empty-state pages without data queries. |
| Learning | Live Field Guide remains a coming-later page. |
| Audio | Homepage preview is an embed placeholder; no player is connected. |
| Search and discovery | No search, genre/city/mood filters, maps or relationship browsing; Discover lists five hardcoded countries. Artist genre tags are not loaded. |
| Evidence | Provenance is hardcoded as `claimed`; profiles still display the publishing instruction. Fact-level sources and editorial verification are unfinished. |
| Contact and contributions | The `info@tape_x247.com` address needs replacement with a verified contact address. Submissions are mail links without a review workflow. |
| Artwork | Editorial images use fallback blocks; failed external image URLs have no load-error fallback. |
| Record details | Labels and releases have collection listings without their own detail routes. |
| Metadata and indexing | No dedicated artist metadata, social sharing images, sitemap or robots file. |
| Database reproducibility | Schema, RLS policies and migrations are not checked into the repository. Public visibility policies have not been audited here. |
| Code cleanup | An unused alternative artist adapter and compatibility module remain. The footer has empty/commented content; three JPEG assets have no current source references. |
| Verification gaps | Route checks depend on the published `shoummo-saha` record. No lint command or interactive browser coverage is configured. |

The Firefox hydration warning with `data-new-gr-c-s-check-loaded` and `data-gr-ext-installed` was left unchanged at the user's request because it occurs with Grammarly installed.

## Verification

Run `npm run typecheck`, `npm run check:content`, `npm run build`, and then `npm run check:routes`.

- TypeScript: passed with no diagnostics.
- Content regression checks: seven passed, including simulated archive outages and release visibility.
- Production build: passed.
- Production route checks: 24 pages, 27 internal links, one redirect and five missing routes passed.
- Public archive query: publication-filtered reads succeeded against the configured project.
- Interactive browser verification: unavailable in this agent session.

The audit findings and unfinished features remain open work; the Git tag records this prototype's source state.

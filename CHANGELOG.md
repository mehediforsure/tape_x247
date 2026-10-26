# tape_x247 change log

## 2026-10-26 — Prepare GitHub v2 milestone

- Label this source milestone with Git tag `v2`, retaining package version `0.1.0` as requested.
- Added `docs/v2-status.md` with the remaining content, product, database and verification work, plus the current dependency audit: one high and four moderate affected packages. Major dependency upgrades remain deferred.
- Updated `README.md` with the milestone status and corrected the obsolete reference to a removed nested prototype folder.
- Updated `.gitignore` to keep `.bak` and dated `.bak-*` snapshots local. Environment files, credentials, generated output and logs remain excluded.
- Removed trailing whitespace in `src/app/about/page.tsx` and `src/components/Footer.tsx` so the milestone patch passes Git's whitespace check.
- Verification: TypeScript and seven content checks passed; production build and route checks passed for 24 pages, 27 internal links, one redirect and five missing routes. The release-file scan found no matching private-key, secret-token or JWT literals; `.env.example` contains empty public credential fields. The current branch matches `origin/master` before the milestone commit.

## 2026-10-26 — Fix five priority reliability, accuracy and performance issues

1. **Archive outage handling:** `src/app/page.tsx`, `src/components/HomeView.tsx`, and `src/components/editorial/Article.tsx` preserve local editorial content when artist queries fail. Unavailable counts are omitted instead of displayed as zero; articles without mentions skip the database. Artist requests time out after eight seconds in `src/lib/content/queries.ts`. Added `src/app/error.tsx` with a refresh/retry action. `src/app/magazine/[slug]/page.tsx` now revalidates optional related-artist records every 60 seconds so a temporary failure does not leave that section absent indefinitely.
2. **Publication filtering:** `src/lib/content/queries.ts` explicitly filters nested releases to `published` and excludes nonpublished rows during mapping. Outer joins preserve artists with no visible releases. No database policies or records were changed.
3. **Accurate missing metadata:** `src/lib/content/queries.ts` and `src/types/demo.ts` preserve unknown dates, formats, labels, activity years and catalogue numbers. Unrecognized documented formats are retained. Updated `src/components/HomeView.tsx`, `src/components/ArtistRow.tsx`, and `src/app/archive/artists/[slug]/page.tsx` to render these states without fabricated values; unmarked tracks use a neutral heading unless a sided format or additional sides are documented.
4. **Homepage selection:** `src/app/page.tsx` sorts releases across artists by full release date, with unknown dates last and stable identifiers for ties. The spotlight uses the existing database `featured` flag and is omitted when no artist is flagged. `src/lib/content/queries.ts` preserves release identifiers/dates, sorts discographies, and puts undated entries last in the standalone release query.
5. **Background delivery:** `src/app/globals.css` now serves `public/background.webp`, encoded at the original 4000 × 2250 resolution with quality 90. Download size falls from 10,878,829 to 882,578 bytes (91.9% smaller). The source PNG is preserved.

- Added seven credential-free regression checks in `scripts/check-content.mjs` and the `check:content` script in `package.json`. Updated `README.md` and `docs/architecture.md` with verification commands and the new behavior.
- Verification: TypeScript and all seven content checks passed. The publication-filtered query succeeded against live public data (four artists, eleven releases). The production build passed; route checks passed for 24 pages, 27 internal links, one redirect and five missing routes. Original and optimized background files were visually inspected. Interactive browser verification was unavailable in this session.

## 2026-10-26 — Restore development styles after production builds

- Fixed the dev server serving plain HTML because its stylesheet returned 404 after a production build replaced shared output.
- Development now uses `.next-dev`; production builds and route checks keep `.next`. Added the development directory to TypeScript inputs and Git ignores.
- Verification: homepage and stylesheet return 200; browser rendering shows the theme restored with no console errors.

## 2026-10-26 — Connect homepage artwork and archive collections

- Homepage artwork and portraits use database image URLs; absent images show a neutral artwork placeholder. Release links point to their actual artist.
- Empty archives retain editorial, Discover, and contribution sections with an explicit empty state. Artists without releases can still appear in the spotlight.
- Labels and Releases list published database records and handle empty tables; Featured shows their real counts. All three pages revalidate every 60 seconds.
- Verification: TypeScript and production build passed; route checks passed for 24 pages, 27 internal links, one redirect, and five missing routes. Live database pages returned 200; component fixtures confirmed empty-archive rendering, image URLs, and the release-owner link.

## 2026-10-26 — Correct artist identity and remove retired demo record

- Corrected Shoummo Saha’s name and slug in demo content, article mentions, redirects, documentation, and route checks.
- Removed the retired demo artist, their releases, article reference, and route expectations.

## 2026-10-26 — Supabase-backed artist data and source-review fixes

### Implemented

- Artist data (artists, releases, tracks, labels, links, countries) is read from Supabase through `src/lib/content/queries.ts`. Reads use a cookie-free public client (`src/utils/supabase/public.ts`) so `generateStaticParams` and revalidation work outside a request. The cookie-based client (`src/utils/supabase/server.ts`) is reserved for authentication.
- Data functions are async and every call site awaits them (home, Featured, Discover, country, artist index, artist profile, ArtistIndex, Article). Pages that read artists revalidate every 60 seconds.
- Added `src/utils/supabase/env.ts` (a clear error naming any missing variable). `src/middleware.ts` does nothing unless `SUPABASE_AUTH_ENABLED=true`, and never throws.
- Source-review fixes in `queries.ts`: published artists without visible releases are no longer dropped, so their profiles and country counts remain; every record is `claimed` because publication status is not verification; tracks on every side are kept (sides beyond A/B go in `extraSides`); `active_from` and `active_to` are numbers; lowercase format values (`digital`, `vinyl`) map correctly, including a new `Vinyl` format; country pages match the artist's country record instead of the last word of the location; one database read per render.
- The artist profile page renders extra sides and shows an empty state when an artist has no published releases.

### Verification

- `tsc --noEmit` reported 0 errors.
- The mapping was exercised against database-shaped fixtures covering: artists without releases, a release hidden by row-level security, sides A to D with mixed spelling, a diaspora artist, integer active years, and calls made outside a request.
- Not run: `npm run build`, `npm run check:routes`, dependency audit, browser check. Terminal startup failed in the review environment.

### Proposed, not implemented

- Add a verification field to the database so provenance can reflect evidence.

## 2026-10-25 — Rename public sections

- Renamed the public navigation labels and canonical URLs: Archive → Featured, Magazine → Editorial, and Scenes → Discover.
- Added compatibility redirects from the former section URLs and rewrites behind the new canonical URLs so existing links continue to work.
- Updated internal links, route checks, and architecture documentation to use the new public names.

## 2026-10-24 — Replace generated texture with background image

- Replaced the grain and dust pseudo-elements in `src/app/globals.css` with a single fixed `body::before` using `/background.png` as a centered, cover-sized background.
- Kept page content above the texture layer with `body > * { position: relative; z-index: 1; }`.
- Verification: `npm run typecheck` and `npm run build` passed.


This file records changes to the project. Add a dated entry for each future change, describing what changed, the affected files or sections, and how it was verified. Keep proposed ideas separate from implemented behavior.

## 2026-10-24 — Current frontend and functionality baseline

This entry documents the application as it exists today. It establishes the starting point for future changes; it does not introduce a redesign.

### Frontend

- Cassette/zine-inspired grayscale theme: charcoal background, white text, muted secondary text, white labels, and thin borders.
- A fixed `/background.png` texture sits behind the page content.
- Inter display headings, IBM Plex Sans body text, IBM Plex Mono metadata, and Special Elite stamps are loaded using `next/font/google`.
- A centered content area uses responsive spacing and grids. Navigation wraps on smaller screens; multi-column layouts stack as screen width decreases.
- Shared header with the tape_x247 wordmark and Archive, Magazine, Scenes, Learn, and About links.
- Archive, artist, and scene pages display demo record counts; the header does not display a global counter.
- Shared footer identifies records and articles as placeholder content.
- Keyboard focus outlines, a skip-to-content link, semantic headings, and a labeled navigation region provide basic accessibility support.
- The interface currently emphasizes text, bordered panels, and metadata. Artwork grids, a photographic lead feature, and a redesigned magazine front page have not been implemented.

### Pages and working functions

| Section | Current behavior |
| --- | --- |
| Home (`/`) | Project introduction, links to Archive/Magazine/Scenes, and a featured demo dispatch selected as the first article with body content. |
| Magazine (`/magazine`) | Lists demo articles with draft/stub labels and displays the planned editorial format names. These labels are not interactive filters. |
| Article (`/magazine/[slug]`) | Displays headline, deck, byline, filing information, paragraphs, optional pull quote, mentioned artists, and links to other demo articles. Empty stubs show a planning message. |
| Archive (`/archive`) | Links to nine record categories: artists, collectives, labels, releases, venues, events, platforms, people, and sources. |
| Artist index (`/archive/artists`) | Lists demo artists with catalogue numbers, locations, summaries, genre tags, and profile links. |
| Artist profile (`/archive/artists/[slug]`) | Displays biography, location, active years, provenance status, discography, release formats/labels, and tracklists. Digital releases use a Tracks heading. Related articles link to their individual article routes. |
| Other archive categories | Working category pages with empty-state messages; no independent records have been populated. |
| Scenes (`/scenes`) | Links to Bangladesh, India, Nepal, Pakistan, and Sri Lanka. |
| Country (`/scenes/[country]`) | Matches demo artists by the country at the end of their location text. Countries without artists show an empty-state message. This is a basic country grouping, not a map or full scene graph. |
| About (`/about`) | Explains the archive/zine purpose and the demo status. |
| Learn (`/learn`) | Shows a coming-later introduction to Live Field Guide. The interactive guide is not integrated. |
| Redirects | The original artist URL under `/archive/[slug]` permanently redirects to `/featured/artists/[slug]`. |
| Missing content | Unknown artists, articles, countries, and routes return a 404 page with an archive link. |

### Content and application structure

- Root-level Next.js App Router application using React, TypeScript, and Tailwind CSS.
- `src/app/` holds routes, the shared layout, global styles, and the not-found page.
- `src/components/` holds shared frontend and article components.
- `src/content/demo.ts` contains one placeholder artist, two releases embedded in their profiles, one draft article, and two article stubs.
- `src/content/taxonomy.ts` contains archive categories and country groupings.
- `src/lib/content/queries.ts` provides local content lookup functions. There is no external data connection behind them yet.
- `src/types/content.ts` establishes types for future multilingual names, sources, contributor credits, provenance, and entity relationships. This is a modeling foundation, not a working database.
- The maintained root app is the only application source; obsolete prototype exports were removed before the first repository commit.
- The Notion export is preserved at `reference/notion-v1-demo.md`. It contains one research page, not the linked child pages or CSV database records. Its embedded suggestions and historical claims were not treated as implementation instructions or verified records.

### Not implemented yet

- Database, CMS, Notion synchronization, editing interface, accounts, or submissions.
- Search, interactive genre/city/mood filters, maps, timelines, or issue browsing.
- Audio playback, guest mixes, streaming, or Live Field Guide lessons.
- Independent release detail pages and populated label/event/venue/platform/source records.
- A publication workflow that hides drafts; this local demo deliberately exposes labeled drafts and stubs.
- Fact-level source verification and a complete multilingual archive/search system.

### Design research status

Reference sites in `codex.md`: Bandcamp Daily, Mixmag Asia, Resident Advisor, and The Wire. Their readable content hierarchy was reviewed. Ideas discussed include a strong masthead, a dominant lead story, compact dispatch lists, release-artwork grids, a scene index, editorial series, and numbered issues.

These ideas have not been applied to the frontend. Exact visual details were not verified because browser access was unavailable.

### Verification and development

Previously completed during app organization:

- Production build passed.
- TypeScript check passed.
- Route checks passed for 25 pages, 25 internal links, two redirects, and five missing routes.
- Dev homepage subsequently returned HTTP 200 at `http://127.0.0.1:3000`.
- Browser visual verification was unavailable.

Commands from the project root:

```powershell
npm.cmd run dev
npm.cmd run typecheck
npm.cmd run build
npm.cmd run check:routes
```

The route check uses a temporary production server and requires a completed build. The initial dependency audit reported five inherited advisories (four moderate, one high); these have not been resolved as part of file organization.

### This change

- Added `CHANGELOG.md` with the current frontend, functionality, limitations, research status, and previous verification results.
- Documentation only; no application behavior changed and no build or runtime tests were rerun for this entry.

## 2026-10-24 — Apply edited styles to the active app

- Diagnosed edits that had previously been made to a prototype path outside the maintained root app.
- Applied the user's edited CSS and font layout to `src/app/globals.css` and `src/app/layout.tsx`.
- Removed duplicate font imports and the undefined `ThemeShell` wrapper from the active layout while retaining the skip-to-content link.
- Updated root `tailwind.config.ts` to use the new grayscale CSS colour variables, added the `muted` colour alias, and registered mono/stamp fonts. Existing `dim` classes use the muted variable.
- The active interface now uses Inter headings, IBM Plex Sans body text, IBM Plex Mono labels, Special Elite stamps, grayscale accents, and grain/dust texture layers.
- Consolidated the maintained app under `src/`; future app edits belong there.
- Verification: TypeScript passed; restarted the dev server to reload Tailwind configuration; homepage and stylesheet return HTTP 200, with the new palette and grain texture present in served CSS.

## 2026-10-24 — Integrate new homepage components

- Integrated the new `HomeView.tsx` and `Stories.tsx` into active `src/components/`.
- Connected `src/app/page.tsx` to the components using existing demo articles and country groups, including artist counts and an empty-content fallback.
- Added the missing `CoverArt.tsx` dependency with deterministic grayscale SVG placeholders marked DEMO ART; no release artwork is implied.
- The homepage now displays a lead story, side stories, latest feed and country scene index, with working article and scene links.
- Used an h1 for the lead headline and changed the unsupported issue wording to More stories. Retained draft/stub labels.
- Kept shared navigation/footer in the maintained app. Future component edits belong in `src/components/`.
- Verification: TypeScript passed; dev homepage returned HTTP 200 with the new sections, demo artwork and one h1; linked demo article and Bangladesh scene returned HTTP 200. Visual browser QA was not performed.

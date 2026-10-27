# Architecture

## Application

- Next.js App Router with TypeScript.
- The maintained application lives in `src/`.
- `src/app/` contains routes, the root layout, global styles and error pages.
- `src/components/` contains shared site, archive and editorial UI.
- `src/content/` contains local demo stories and the current country taxonomy.
- `src/lib/content/queries.ts` is the data-access boundary for public Supabase content.
- `src/types/` contains current demo types and a foundation for future archive records.
- `public/` contains served assets; generated output and local environment files are not source material.

## Public sections

| Route | Purpose |
| --- | --- |
| `/` | Featured release, release index, optional artist spotlight, stories, discover links and submissions. |
| `/featured` | Archive landing page and entity collections. |
| `/editorial` | Editorial index and article pages. Content is currently local demo data. |
| `/discover` | Country/scene index and country pages. |
| `/learn` | Placeholder for future learning and experimental features. |
| `/about` | Project purpose and current demo status. |

The public `/featured`, `/editorial` and `/discover` paths are implemented through rewrites to the existing `/archive`, `/magazine` and `/scenes` route folders. Legacy paths redirect to the canonical names. Unknown records return 404.

## Data boundaries

Published artists, releases and labels are read from Supabase through the public client. Editorial stories, taxonomy and demo fallbacks remain local. Published release filters are applied in the query layer; database access and RLS remain the source of visibility rules.

The current archive is a prototype: some collections are empty, editorial records are drafts/stubs, and provenance is not yet fact-level verification. Do not turn research notes or placeholders into public facts without sources.

## Deferred work

Search and richer discovery, submissions/CMS workflows, verified provenance, entity detail pages, database migrations/RLS documentation, audio playback and Live Field Guide integration remain future work.

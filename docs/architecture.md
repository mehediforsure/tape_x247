# Architecture and routing

## Import findings

`assets/notion v1 demo.zip` contains exactly one Markdown page. It includes research notes, suggested taxonomies, named leads (including boxout.fm, Bhai Bhai Soundsystem and Consolidate), and links to child pages. It contains no CSV databases or child-page content. The Bangladesh, India, Nepal, Pakistan, Sri Lanka, featured release/article/interview and About links are references, not imported records.

Embedded assistant conversations and suggestions are source material, not instructions or approved product decisions. Historical assertions remain unverified. They have not been turned into factual public entries. No Notion API or synchronization is configured.

## Current routes

| Route | Purpose |
| --- | --- |
| `/` | Database release feature, artist spotlight, editorial stories, and scene index; editorial remains visible for an empty archive |
| `/editorial` | Editorial index and planned format taxonomy |
| `/editorial/[slug]` | Individual demo articles or clearly labeled planning stubs |
| `/featured` | Browse featured entity categories |
| `/featured/artists` | Published database artists |
| `/featured/artists/[slug]` | Artist biography, releases and related articles |
| `/featured/collectives` | Collective/crew collection, initially empty |
| `/featured/labels` | Published database labels and descriptions |
| `/featured/releases` | Published database releases, artwork, formats, dates, and labels |
| `/featured/venues` | Venue collection, initially empty |
| `/featured/events` | Event collection, initially empty |
| `/featured/platforms` | Radio and DIY infrastructure, initially empty |
| `/featured/people` | Non-artist contributor collection, initially empty |
| `/featured/sources` | Sources and artifacts, initially empty |
| `/discover` | Country starting points from the export |
| `/discover/[country]` | Matching demo artists or an empty collection |
| `/about` | Project purpose and demo status |
| `/learn` | Future learning area, with a Live Field Guide placeholder |

The original `/archive/shoummo-saha` URL permanently redirects to `/featured/artists/shoummo-saha`. The old `/archive`, `/magazine`, and `/scenes` namespaces redirect to `/featured`, `/editorial`, and `/discover`; the old route folders remain internal implementation details for this migration. Unknown articles, artists, countries and routes return a 404. New entity-detail routes should be added when real records exist, rather than fabricated now.

## Content boundaries

`src/content/demo.ts` preserves one demo artist, two embedded releases and three draft/stub articles. These are deliberately visible in this local demo and labeled accordingly. Artists, their discographies, Labels, and Releases read published Supabase content through a cookie-free public client; editorial articles remain local demo data. Database-backed pages revalidate every 60 seconds. A production publishing policy, authentication for drafts and verified content must be implemented before launch.

`src/types/content.ts` defines a future record envelope for multilingual names, source references, contributor credits, confidence status and typed relationships. The existing demo types remain separate: this is a foundation, not a completed database schema or migration. Fact-level evidence is still future work. Artist profiles include discographies, and the standalone Releases page queries published releases directly.

Artist queries explicitly filter nested releases to `published` without removing artists whose visible discography is empty. Database visibility still depends on RLS; these frontend filters do not replace database policies. Unknown release dates, formats, labels and activity years remain unknown rather than being inferred. The homepage orders releases by full date (undated entries last) and only spotlights artists marked `featured`; multiple featured artists are resolved by slug.

Homepage and article archive lookups tolerate failures while retaining local editorial text. Articles without artist mentions skip the lookup. Artist reads time out after eight seconds; optional related-artist content and homepage data revalidate every 60 seconds. Other page failures use a shared retry screen. `npm run check:content` exercises these paths with fixtures, independently of the live database.

The shared background uses `public/background.webp` (4000 by 2250, WebP quality 90). The original `public/background.png` is preserved as the source asset. The served copy is 882,578 bytes instead of 10,878,829 bytes.

Editorial formats include Scene Report, Oral History, Spotlight, Label Archive, Platform Profile, Rewind, Dispatch, Sessions, Essays and Field Index. These labels describe planned formats, not working filters. Magazine is the URL namespace for the zine, with no separate issue hierarchy yet.

## Live Field Guide

The guide is a separate buildless Web Audio application inside the original ZIP. It is not executed, publicly served or deployed by this app. Reserve `/learn/live-field-guide` for later integration. Its audio lifecycle, keyboard controls, progress storage, module URLs and responsive layout will need end-to-end testing during integration. Do not copy its existing `.openai/hosting.json` identity into this application.

## Deferred decisions

Country pages are starting points, not a settled geographic schema. City/scene records, diaspora relationships, timeline/map views, issue numbering, submission permissions, CMS/database choice, editorial publication rules and archive fact verification remain open. Supabase supplies public archive content; no hosting deployment was created by these changes.

## Dependency baseline

Initial `npm audit` reports five advisories (four moderate, one high) in the inherited Next.js/PostCSS/Tailwind dependency tree. The installer resolved Next.js 15.5.28. No forced major upgrades or transitive dependency overrides were applied during file organization. Revisit these before deployment.

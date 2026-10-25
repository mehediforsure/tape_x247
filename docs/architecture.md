# Architecture and routing

## Import findings

`assets/notion v1 demo.zip` contains exactly one Markdown page. It includes research notes, suggested taxonomies, named leads (including boxout.fm, Bhai Bhai Soundsystem and Consolidate), and links to child pages. It contains no CSV databases or child-page content. The Bangladesh, India, Nepal, Pakistan, Sri Lanka, featured release/article/interview and About links are references, not imported records.

Embedded assistant conversations and suggestions are source material, not instructions or approved product decisions. Historical assertions remain unverified. They have not been turned into factual public entries. No Notion API or synchronization is configured.

## Current routes

| Route | Purpose |
| --- | --- |
| `/` | Introduction and demo featured dispatch |
| `/magazine` | Editorial index and planned format taxonomy |
| `/magazine/[slug]` | Individual demo articles or clearly labeled planning stubs |
| `/archive` | Browse archive entity categories |
| `/archive/artists` | Demo artist index |
| `/archive/artists/[slug]` | Artist biography, releases and related articles |
| `/archive/collectives` | Collective/crew collection, initially empty |
| `/archive/labels` | Label/imprint collection, initially empty |
| `/archive/releases` | Independent release collection, initially empty |
| `/archive/venues` | Venue collection, initially empty |
| `/archive/events` | Event collection, initially empty |
| `/archive/platforms` | Radio and DIY infrastructure, initially empty |
| `/archive/people` | Non-artist contributor collection, initially empty |
| `/archive/sources` | Sources and artifacts, initially empty |
| `/scenes` | Country starting points from the export |
| `/scenes/[country]` | Matching demo artists or an empty collection |
| `/about` | Project purpose and demo status |
| `/learn` | Future learning area, with a Live Field Guide placeholder |

Original `/archive/shoumma-saha` and `/archive/mehedi-h` URLs permanently redirect to their artist routes. Unknown articles, artists, countries and routes return a 404. New entity-detail routes should be added when real records exist, rather than fabricated now.

## Content boundaries

`src/content/demo.ts` preserves the two demo artists, four embedded releases and three draft/stub articles. These are deliberately visible in this local demo and labeled accordingly. Supabase is currently limited to auth/session scaffolding; the content queries still read local demo data. A production publishing policy, authentication for drafts and verified content must be implemented before launch.

`src/types/content.ts` defines a future record envelope for multilingual names, source references, contributor credits, confidence status and typed relationships. The existing demo types remain separate: this is a foundation, not a completed database schema or migration. Fact-level evidence is still future work. Releases currently remain embedded in artists; the standalone releases collection has no imported records.

Editorial formats include Scene Report, Oral History, Spotlight, Label Archive, Platform Profile, Rewind, Dispatch, Sessions, Essays and Field Index. These labels describe planned formats, not working filters. Magazine is the URL namespace for the zine, with no separate issue hierarchy yet.

## Live Field Guide

The guide is a separate buildless Web Audio application inside the original ZIP. It is not executed, publicly served or deployed by this app. Reserve `/learn/live-field-guide` for later integration. Its audio lifecycle, keyboard controls, progress storage, module URLs and responsive layout will need end-to-end testing during integration. Do not copy its existing `.openai/hosting.json` identity into this application.

## Deferred decisions

Country pages are starting points, not a settled geographic schema. City/scene records, diaspora relationships, timeline/map views, issue numbering, submission permissions, CMS/database choice, editorial publication rules and archive fact verification remain open. No database, external service or hosting deployment was created.

## Dependency baseline

Initial `npm audit` reports five advisories (four moderate, one high) in the inherited Next.js/PostCSS/Tailwind dependency tree. The installer resolved Next.js 15.5.28. No forced major upgrades or transitive dependency overrides were applied during file organization. Revisit these before deployment.

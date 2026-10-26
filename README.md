<<<<<<< HEAD
=======
# tape_x247

A South Asian electronic music zine and living archive. This workspace now runs as a Next.js App Router application from the repository root.

## Version 2 milestone

The second Git milestone is tagged `v2`; the package version remains `0.1.0`. This is a working prototype with a public Supabase archive and local draft editorial content. See [v2 status and remaining work](docs/v2-status.md) for the current limits and dependency audit results.
>>>>>>> 480f2e322514e3a7fbcb982ef968ce52ceba5d7c

## Run

Node.js 20.9 or newer and npm are required.

```sh
npm install
npm run dev
```

On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.

```sh
npm run typecheck
npm run check:content
npm run build
npm run check:routes
npm start
<<<<<<< HEAD
```
=======
```

The original Google fonts are loaded through `next/font`; the first production build needs network access to Google Fonts.

`check:content` runs credential-free regression checks for archive outages, publication filtering, missing metadata, and homepage ordering. `check:routes` requires a successful production build and reads the configured public database.

## Structure

- `src/app/`: Next.js routes, shared root layout, CSS, and not-found page.
- `src/components/`: shared site and editorial components.
- `src/content/`: demo content and archive/geography taxonomy.
- `src/types/`: current demo types and a foundation for future archive records.
- `src/lib/content/`: data access functions; future CMS/database adapters belong behind these functions.
- `public/`: assets intended to be served by Next.js. Research exports do not belong here.
- `docs/`: architecture, routing and import notes.
- Original prototype exports have been removed; only the maintained `src/` application remains.
- Copy `.env.example` to `.env.local` and provide the Supabase project URL and publishable key for local development.

Only the root application in `src/` is maintained. Local backup files, environment files, and generated build output are excluded from Git.

See [architecture](docs/architecture.md) for routes, content boundaries, and deferred decisions.
>>>>>>> 480f2e322514e3a7fbcb982ef968ce52ceba5d7c

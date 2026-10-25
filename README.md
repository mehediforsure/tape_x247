# tape_x247

A South Asian electronic music zine and living archive. This workspace now runs as a Next.js App Router application from the repository root.

## Run

Node.js 20.9 or newer and npm are required.

```sh
npm install
npm run dev
```

On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.

```sh
npm run typecheck
npm run build
npm run check:routes
npm start
```

The original Google fonts are loaded through `next/font`; the first production build needs network access to Google Fonts.

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

Only the root application is maintained. The nested original prototype under `files/` is reference material.

See [architecture](docs/architecture.md) for routes, content boundaries, and deferred decisions.

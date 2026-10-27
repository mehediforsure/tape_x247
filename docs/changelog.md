## 2026-10-27

- Updated `docs/architecture.md` to briefly reflect the current Next.js structure, public routes, Supabase/local content boundaries and deferred work.
- Kept `Overview.md` unchanged.
- Verification: reviewed the current `src/` route tree, `next.config.ts`, query layer and shared homepage components.

## Homepage
The homepage currently contains:

## Header
tape_x247 logo linking home
## Navigations: Featured, Editorial, Discover, Learn, About
Defined in Header.tsx and NavLinks.tsx
## “Start here”
Shows the newest published release from Supabase
## Cover artwork
## Release format and year
## Release title
## Artist and city
## “Audio preview — Embed slot · coming soon”
## “Explore the artist →” button
If no published releases are available, it instead shows “A zine. A living archive.” with an archive/unavailability message.

## “New on tape_x247”
Grid of all published releases
Cover artwork
Artist and city
Release title
Format and year
## “See all →” link
## “Artist spotlight”
Only appears when an artist is marked as featured
Artist image or generated cover art
Artist name
Location
Summary/bio
## “Read the profile →” link
## “Stories”
Currently populated from the local demo editorial data:

“Four speakers, one extension cord: notes from a rooftop tape swap”
Dispatch
October 2026
Draft status
## “Label Archive: the first ten tape imprints”
Label Archive
Stub status
“Oral History: dubbing culture before the internet”
Oral History
Stub status
These records are in demo.ts. The homepage links to “All editorial →”.

## “Discover”
Shows five scene/country links:

Bangladesh
India
Nepal
Pakistan
Sri Lanka
Each displays a live record count when archive data is available.

## “Keep the archive alive”
Heading: “Know something we missed?”
Copy inviting submissions about artists, labels, spaces, releases, or tapes
“Submit a lead →” email link to info@tape_x247.com
## Footer
Currently mostly empty
The visible text is: “tape_x247 · records on 24/7”
Defined in Footer.tsx
## 2026-10-27

- Updated `src/components/HomeView.tsx` homepage hero presentation:
  - Reduced the featured cover artwork to 85% width while preserving its 4:3 ratio.
  - Enlarged the “Start here” label.
  - Made the cover artwork link to the featured release in the artist discography; a dedicated release-detail route is not currently implemented.
  - Renamed the CTA to “Explore more artists →” and linked it to `/featured/artists`.
- Verification: checked the live homepage DOM and confirmed the updated copy, CTA destination, and release-link structure.

## 2026-10-27

- Reduced the shared `.wrap` content width in `src/app/globals.css` from `max-w-6xl` (1,152px) to `max-w-[980px]` (approximately 85%).
- Verification: confirmed the homepage wrapper uses the narrower max width and retains horizontal padding.

## 2026-10-27

- Tightened the homepage hero grid gap in `src/components/HomeView.tsx` from `lg:gap-14` to `lg:gap-8`, moving the release metadata and CTA closer to the artwork on large screens.
- Verification: confirmed the live hero text block moved 24px closer to the cover artwork.

## 2026-10-27

- Limited the homepage “New on tape_x247” section to five releases.
- Changed the release grid to five columns at all breakpoints and reduced card metadata/title sizing so all five releases remain on one row on desktop and mobile.
- Verification: checked the live homepage at desktop and mobile widths.

## 2026-10-27

- Renamed the homepage “Stories” section to “Editorials” and updated its accessible section label.
- Increased shared kicker letter spacing from `0.08em` to `0.132em`, a 65% increase, covering the requested labels and record counts.
- Verification: confirmed the updated heading and computed letter spacing on the live homepage.

## 2026-10-27

- Replaced the footer `tape_x247` text with `public/logos-fonts/line 01.png`.
- Kept `records on 24/7` underneath the logo with the existing kicker styling.
- Verification: confirmed the live footer renders the logo and subtitle in the requested order.

## 2026-10-27

- Replaced the footer logo asset with `public/logos-fonts/line 01 - Copy.png`.
- Verification: confirmed the new footer asset loads on the live homepage with “records on 24/7” underneath.

## 2026-10-27

- Enlarged the footer “records on 24/7” text to `text-sm`.
- Constrained the subtitle to the logo width and right-aligned it to the logo’s right edge.
- Verification: confirmed the live footer subtitle alignment and rendered size.

## 2026-10-27

- Reduced the footer logo to 64% of its previous height by scaling its width from 192px to 123px.
- Kept “records on 24/7” at 14px and increased its letter spacing to `0.2em`.
- Preserved right-edge alignment between the logo and subtitle, keeping the subtitle on one line.
- Verification: confirmed the live logo height, subtitle font size, letter spacing, and alignment.

## 2026-10-27

- Layered `public/logos-fonts/footer logo.png` in front of the scaled `line 01 - Copy.png` footer wordmark.
- Kept the existing logo footprint and subtitle alignment unchanged.
- Verification: confirmed both logo assets load in the live footer.

## 2026-10-27

- Repositioned `footer logo.png` before the horizontal `line 01 - Copy.png` wordmark in a single aligned row, matching the supplied reference layout.
- Kept “records on 24/7” beneath the combined logo row.
- Verification: confirmed both assets load and render side-by-side on the live footer.


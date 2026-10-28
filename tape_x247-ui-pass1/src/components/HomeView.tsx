import Link from "next/link";
import CoverArt from "@/components/CoverArt";
import type { Story } from "@/components/Stories";
import { SITE, mailto } from "@/lib/site";

export type Scene = { name: string; slug: string; count?: number };
export type ReleaseCard = { slug: string; artistSlug: string; coverUrl?: string; artist: string; city: string; title: string; year: number | null; format: string | null };
export type ArtistSpotlight = { slug: string; name: string; location: string; imageUrl?: string; summary: string };

const sectionLink = "kicker underline decoration-rule underline-offset-4 hover:decoration-paper";

function StoryRow({ story }: { story: Story }) {
  return (
    <li className="rule-t last:border-b">
      <Link href={story.href} className="grid gap-2 py-5 no-underline hover:no-underline md:grid-cols-[10rem_1fr_auto] md:items-baseline md:gap-6">
        <p className="kicker">{story.kicker}{story.status ? ` · ${story.status}` : ""}</p>
        <h3 className="font-display text-xl font-semibold leading-tight tracking-tight decoration-1 underline-offset-4 hover:underline">{story.title}</h3>
        <p className="text-sm text-muted md:text-right">{story.date ?? "Read the record"}</p>
      </Link>
    </li>
  );
}

function sceneCount(count?: number) {
  if (count === undefined) return "";
  if (count === 0) return "Soon";
  return `${String(count).padStart(2, "0")} ${count === 1 ? "record" : "records"}`;
}

export default function HomeView({ lead, side, scenes, releases, spotlight, archiveUnavailable = false }: {
  lead?: Story;
  side: Story[];
  scenes: Scene[];
  releases: ReleaseCard[];
  spotlight?: ArtistSpotlight;
  archiveUnavailable?: boolean;
}) {
  const stories = lead ? [lead, ...side] : side;
  const featuredRelease = releases[0];
  const strip = releases.slice(0, 5);

  return (
    <div className="wrap py-10 sm:py-16">
      {featuredRelease ? (
        <section aria-labelledby="start-here" className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-12">
          <div>
            <p className="kicker">Start here</p>
            <Link
              href={`/featured/artists/${featuredRelease.artistSlug}`}
              aria-label={`${featuredRelease.title} by ${featuredRelease.artist}`}
              className="mt-4 block w-full max-w-[26rem]"
            >
              <CoverArt seed={featuredRelease.slug} imageSrc={featuredRelease.coverUrl} eager className="aspect-square w-full" />
            </Link>
          </div>
          <div className="flex flex-col justify-end pb-1">
            <p className="kicker">{["Release", featuredRelease.format, featuredRelease.year].filter(Boolean).join(" · ")}</p>
            <h1 id="start-here" className="headline-xl mt-3">{featuredRelease.title}</h1>
            <p className="mt-4 max-w-prose text-lg text-muted">{featuredRelease.artist} · {featuredRelease.city}</p>
            <Link href="/featured/artists" className="btn mt-8 w-fit py-2.5">Explore more artists</Link>
          </div>
        </section>
      ) : (
        <section>
          <h1 className="headline-xl max-w-3xl">{SITE.tagline}.</h1>
          <p className="mt-4 text-muted">
            {archiveUnavailable
              ? "Releases are temporarily unavailable. Explore the stories below and try again shortly."
              : "No published releases yet. Explore the stories below."}
          </p>
        </section>
      )}

      {strip.length > 0 ? (
        <section aria-labelledby="new-on-tape" className="mt-20 sm:mt-28">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 id="new-on-tape" className="headline-md">New on tape_x247</h2>
            <Link href="/featured/releases" className={sectionLink}>See all</Link>
          </div>
          {/* Phones: swipe strip that bleeds to the screen edge. sm and up: five-up grid. */}
          <ul className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0">
            {strip.map((release) => (
              <li key={release.slug} className="w-[42%] shrink-0 snap-start sm:w-auto">
                <Link href={`/featured/artists/${release.artistSlug}`} className="block min-w-0 no-underline hover:no-underline">
                  <CoverArt seed={release.slug} imageSrc={release.coverUrl} className="aspect-square w-full" />
                  <div className="mt-2 space-y-1">
                    <p className="kicker truncate text-[10px]">● {release.artist} · {release.city}</p>
                    <h3 className="line-clamp-2 font-display text-sm font-semibold leading-tight tracking-tight">{release.title}</h3>
                    <p className="truncate text-xs text-muted">{[release.format, release.year].filter(Boolean).join(" · ") || "Details to come"}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {spotlight ? (
        <section aria-labelledby="artist-spotlight" className="mt-20 border-t border-rule pt-10 sm:mt-28 sm:pt-12">
          <p className="kicker">Artist spotlight</p>
          <div className="mt-5 grid gap-8 md:grid-cols-[14rem_1fr] md:items-start md:gap-10">
            <CoverArt seed={spotlight.slug} imageSrc={spotlight.imageUrl} className="aspect-square w-full max-w-sm" />
            <div>
              <h2 id="artist-spotlight" className="headline-md text-3xl">{spotlight.name}</h2>
              <p className="mt-2 kicker">{spotlight.location}</p>
              {spotlight.summary ? <p className="mt-5 max-w-prose text-lg leading-relaxed text-muted">{spotlight.summary}</p> : null}
              <Link href={`/featured/artists/${spotlight.slug}`} className="btn mt-6 w-fit py-2.5">Read the profile</Link>
            </div>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="editorials" className="mt-20 sm:mt-28">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 id="editorials" className="headline-md">Editorial</h2>
          <Link href="/editorial" className={sectionLink}>All editorial</Link>
        </div>
        <ul>{stories.map((story) => <StoryRow key={story.href} story={story} />)}</ul>
      </section>

      <section aria-labelledby="discover" className="mt-20 sm:mt-28">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 id="discover" className="headline-md">Discover by country</h2>
          <Link href="/discover" className={sectionLink}>Explore all</Link>
        </div>
        <ul className="border-b border-rule">
          {scenes.map((scene) => (
            <li key={scene.slug} className="rule-t">
              <Link href={`/discover/${scene.slug}`} className="group flex items-baseline justify-between gap-4 py-4 no-underline hover:no-underline">
                <span className="font-display text-xl font-semibold tracking-tight group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{scene.name}</span>
                <span className="kicker">{sceneCount(scene.count)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="contribute" className="mt-20 border-t border-rule pt-10 sm:mt-28 sm:pt-12">
        <p className="kicker">Contribute</p>
        <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 id="contribute" className="headline-md text-3xl">Know something we missed?</h2>
            <p className="mt-3 max-w-prose text-muted">Tell us about an artist, label, space, release or tape worth keeping on record.</p>
          </div>
          <a href={mailto("Submission for tape_x247")} className="btn w-fit py-2.5">Submit a lead</a>
        </div>
      </section>
    </div>
  );
}

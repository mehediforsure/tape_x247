import Link from "next/link";
import CoverArt from "@/components/CoverArt";
import type { Story } from "@/components/Stories";

export type Scene = { name: string; slug: string; count?: number };
export type ReleaseCard = { slug: string; artistSlug: string; coverUrl?: string; artist: string; city: string; title: string; year: number | null; format: string | null };
export type ArtistSpotlight = { slug: string; name: string; location: string; imageUrl?: string; summary: string };

const homepageVideos = [
  { title: "Boiler Room live set", href: "https://youtu.be/r_niEkkh30E?si=N-xSPv_1gffg_8i2&t=945" },
  { title: "Boiler Room artist session" },
  { title: "Bedroom live electronic set" },
  { title: "Hardware and modular session" },
];

const homepageEvents = [
  "Upcoming electronic event",
  "Club night announcement",
  "Live electronic showcase",
];

function StoryRow({ story }: { story: Story }) {
  return (
    <li className="rule-t last:border-b">
      <Link href={story.href} className="grid gap-2 py-5 no-underline hover:no-underline md:grid-cols-[10rem_1fr_auto] md:items-baseline md:gap-6">
        <p className="kicker">{story.kicker}{story.status ? ` · ${story.status}` : ""}</p>
        <h3 className="story-title text-xl leading-tight tracking-tight decoration-1 underline-offset-4 hover:underline">{story.title}</h3>
        <p className="text-sm text-muted md:text-right">{story.date ?? "Read the record"}</p>
      </Link>
    </li>
  );
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

  return (
    <div className="wrap py-12 sm:py-16">
      {featuredRelease ? <section aria-labelledby="start-here" className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:gap-8">
        <div>
          <p className="kicker text-base">Start here</p>
          <Link href={`/featured/artists/${featuredRelease.artistSlug}`} aria-label={`View ${featuredRelease.title} release in the artist discography`} className="block w-[85%]">
            <CoverArt seed={featuredRelease.slug} imageSrc={featuredRelease.coverUrl} className="mt-4 aspect-[4/3] w-full" />
          </Link>
        </div>
        <div className="flex flex-col justify-end pb-1">
          <p className="kicker">{["Release", featuredRelease.format, featuredRelease.year].filter(Boolean).join(" · ")}</p>
          <h1 id="start-here" className="headline-xl mt-3">{featuredRelease.title}</h1>
          <p className="mt-4 max-w-prose text-lg text-muted">{featuredRelease.artist} · {featuredRelease.city}</p>
          <div className="mt-8 border-y border-rule py-4 text-sm text-muted"><div className="flex items-center justify-between gap-4"><span>Audio preview</span><span>Embed slot · coming soon</span></div></div>
          <Link href="/featured/artists" className="btn mt-6 w-fit">Explore more artists →</Link>
        </div>
      </section> : <section><h1 className="headline-xl">A zine. A living archive.</h1><p className="mt-4 text-muted">{archiveUnavailable ? "Archive records are temporarily unavailable. Explore the stories below and try again shortly." : "No published releases yet. Explore the stories and scenes below."}</p></section>}

      <section aria-labelledby="new-on-tape" className="mt-24 sm:mt-32">
        <div className="mb-6 flex items-baseline justify-between gap-4"><h2 id="new-on-tape" className="headline-md">New on tape_x247</h2><Link href="/featured/releases" className="kicker no-underline hover:underline">See all →</Link></div>
        <div className="index-head" aria-hidden="true"><span>No.</span><span>Release / Artist</span><span className="index-meta">Format / Year</span><span aria-hidden="true">&#8599;</span></div>
        <ol className="index-list">{releases.slice(0, 5).map((release, index) => <li key={release.slug}><Link href={`/featured/artists/${release.artistSlug}`} className="index-row"><span className="index-number">{String(index + 1).padStart(2, "0")}</span><div className="index-identity"><CoverArt seed={release.slug} imageSrc={release.coverUrl} className="aspect-square" /><div><h3 className="index-title">{release.title}</h3><p className="index-meta mt-2">{release.artist} / {release.city}</p></div></div><p className="index-meta">{[release.format, release.year].filter(Boolean).join(" / ") || "Not documented"}</p><span className="index-arrow" aria-hidden="true">&#8599;</span></Link></li>)}</ol>
      </section>

      {spotlight ? <section aria-labelledby="artist-spotlight" className="mt-24 border-t border-rule pt-10 sm:mt-32 sm:pt-12">
        <p className="kicker">Artist spotlight</p>
        <div className="mt-5 grid gap-8 md:grid-cols-[14rem_1fr] md:items-start md:gap-10"><CoverArt seed={spotlight.slug} imageSrc={spotlight.imageUrl} className="aspect-square w-full" /><div><h2 id="artist-spotlight" className="headline-md text-3xl">{spotlight.name}</h2><p className="mt-2 kicker">{spotlight.location}</p><p className="mt-5 max-w-prose text-lg leading-relaxed text-muted">{spotlight.summary}</p><Link href={`/featured/artists/${spotlight.slug}`} className="mt-6 inline-block text-sm">Read the profile →</Link></div></div>
      </section> : null}

      <section aria-labelledby="editorials" className="mt-24 sm:mt-32"><div className="mb-4 flex items-baseline justify-between gap-4"><h2 id="editorials" className="headline-md">Editorials</h2><Link href="/editorial" className="kicker no-underline hover:underline">All editorial →</Link></div><ul>{stories.map((story) => <StoryRow key={story.href} story={story} />)}</ul></section>

<section aria-labelledby="discover" className="mt-24 sm:mt-32"><div className="mb-5 flex items-baseline justify-between gap-4"><h2 id="discover" className="headline-md">Discover</h2><Link href="/discover" className="kicker no-underline hover:underline">Explore all →</Link></div><div className="grid grid-cols-4 gap-2 sm:gap-3">{homepageVideos.map((video) => { const card = <><div className="flex aspect-video items-center justify-center border border-rule bg-paper/[0.04]"><span className="font-display text-lg">▶</span></div><h3 className="mt-2 line-clamp-2 font-display text-[11px] font-semibold leading-tight tracking-tight">{video.title}</h3></>; return video.href ? <a key={video.title} href={video.href} target="_blank" rel="noreferrer" className="group block no-underline hover:no-underline">{card}</a> : <div key={video.title}>{card}</div>; })}</div><div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">{homepageEvents.map((event) => <div key={event} className="border border-rule p-2 sm:p-3"><div className="flex aspect-[4/3] items-center justify-center bg-paper/[0.04]"><span className="kicker text-[9px]">Event placeholder</span></div><h3 className="mt-2 line-clamp-2 font-display text-[11px] font-semibold leading-tight tracking-tight">{event}</h3></div>)}</div></section>

      <section aria-labelledby="contribute" className="mt-24 border-t border-rule pt-10 sm:mt-32 sm:pt-12"><p className="kicker">Keep the archive alive</p><div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><h2 id="contribute" className="headline-md text-3xl">Know something we missed?</h2><p className="mt-3 max-w-prose text-muted">Tell us about an artist, label, space, release or tape worth keeping in the record.</p></div><a href="mailto:info@tape_x247.com?subject=Submission%20for%20tape_x247" className="btn w-fit">Submit a lead →</a></div></section>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import CoverArt from "@/components/CoverArt";
import type { Story } from "@/components/Stories";

export type Scene = { name: string; slug: string; count?: number };
export type ReleaseCard = { slug: string; artistSlug: string; href: string; coverUrl?: string; artist: string; city: string; title: string; year: number | null; type: "Single" | "EP" | "Album" | null; format: string | null };
export type ArtistSpotlight = { slug: string; name: string; location: string; imageUrl?: string; summary: string };

const homepageVideos = [
  { title: "Boiler Room live set", href: "https://youtu.be/r_niEkkh30E?si=N-xSPv_1gffg_8i2&t=945" },
  { title: "Boiler Room artist session" },
  { title: "Bedroom live electronic set" },
  { title: "Hardware and modular session" },
];

const homepageEvents = [
  {
    title: "‘Notun Shobdo’: Opening the doors to electronic music",
    href: "https://www.thedailystar.net/culture/entertainment/news/notun-shobdo-opening-the-doors-electronic-music-4213206",
    imageSrc: "https://www.thedailystar.net/sites/default/files/styles/social_share/public/2026-07/IMG_2257.JPG",
  },
  {
    title: "Dhaka’s Electronic Music Scene",
    href: "https://ra.co/events/541944",
    imageSrc: "https://norient.com/sites/norient.com/files/khan_dhakas-electronic-music-scene_imtiaz-nasir.jpg",
  },
  {
    title: "The Mixmag Lab debuts in Dhaka with powerhouse line-up on June 13",
    href: "https://mixmag.asia/read/the-mixmag-lab-dhaka-bangladesh-debut-be-here-now-bhai-bhai-productions-june-13-events",
    imageSrc: "https://mixmag.asia/assets/uploads/images/_facebook/lab-dhaka-kead-image-2025.jpg",
  },
];

function StoryRow({ story, imageSrc }: { story: Story; imageSrc?: string }) {
  return (
    <li className="rule-t last:border-b">
      <Link href={story.href} className={`grid gap-2 py-5 no-underline hover:no-underline md:items-baseline md:gap-6 ${story.kicker ? "md:grid-cols-[10rem_1fr_auto]" : "md:grid-cols-[1fr_auto]"}`}>
        {story.kicker ? <p className="kicker">{story.kicker}</p> : null}
        <div className="flex items-center gap-4">
          {imageSrc ? <Image src={imageSrc} alt="" width={96} height={64} sizes="(max-width: 767px) 80px, 96px" className="h-14 w-20 shrink-0 object-cover md:h-16 md:w-24" /> : null}
          <h3 className="story-title text-xl leading-tight tracking-tight decoration-1 underline-offset-4 hover:underline">{story.title}</h3>
        </div>
        <p className="text-sm text-muted md:text-right">{story.date ?? "Read the record"}</p>
      </Link>
    </li>
  );
}

export default function HomeView({ lead, side, scenes, releases, initialReleaseIndex = 0, spotlight, archiveUnavailable = false }: {
  lead?: Story;
  side: Story[];
  scenes: Scene[];
  releases: ReleaseCard[];
  initialReleaseIndex?: number;
  spotlight?: ArtistSpotlight;
  archiveUnavailable?: boolean;
}) {
  const stories = lead ? [lead, ...side] : side;
  const [featuredReleaseIndex, setFeaturedReleaseIndex] = useState(initialReleaseIndex);
  const [isChangingRelease, setIsChangingRelease] = useState(false);
  const [mediaConsent, setMediaConsent] = useState(false);
  const featuredRelease = releases[featuredReleaseIndex];

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("tape-cookie-consent-v1") ?? "null") as { media?: unknown } | null;
      setMediaConsent(stored?.media === true);
    } catch {}
    const onConsent = (event: Event) => setMediaConsent((event as CustomEvent<boolean>).detail === true);
    window.addEventListener("tape:media-consent", onConsent);
    return () => window.removeEventListener("tape:media-consent", onConsent);
  }, []);

  useEffect(() => {
    if (releases.length < 2) return;

    let changeTimeout: ReturnType<typeof setTimeout> | undefined;
    const interval = setInterval(() => {
      setIsChangingRelease(true);
      changeTimeout = setTimeout(() => {
        setFeaturedReleaseIndex((current) => (current + 1) % releases.length);
        setIsChangingRelease(false);
      }, 400);
    }, 30_000);

    return () => {
      clearInterval(interval);
      if (changeTimeout) clearTimeout(changeTimeout);
    };
  }, [releases.length]);

  return (
    <div className="wrap py-12 sm:py-16">
{featuredRelease ? <section aria-labelledby="start-here" className={`home-featured-release grid grid-cols-2 gap-4 text-left transition-opacity duration-500 motion-reduce:transition-none lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:gap-8 lg:text-left ${isChangingRelease ? "opacity-0" : "opacity-100"}`}>
<div className="order-2 w-full max-lg:col-start-2 max-lg:row-start-1 lg:order-1">
<p className="mx-0 w-full text-left font-normal text-base uppercase tracking-[0.08em] max-lg:justify-self-start lg:mx-0 lg:font-semibold lg:text-lg">START HERE</p>
          <Link href={featuredRelease.href} aria-label={`View ${featuredRelease.title} release in the artist discography`} className="mx-auto block w-[85%] lg:mx-0">
<CoverArt seed={featuredRelease.slug} imageSrc={featuredRelease.coverUrl} eager className="mt-8 aspect-[4/3] w-full" />
          </Link>
        </div>
<div className="order-1 flex w-full flex-col items-start justify-end pb-1 text-left max-lg:contents lg:order-2 lg:mx-0 lg:w-auto">
<p className="kicker max-lg:col-start-1 max-lg:row-start-2">{[featuredRelease.type, featuredRelease.year].filter(Boolean).join(" · ")}</p>
<h1 id="start-here" className="headline-xl mt-3 max-md:text-xl max-lg:col-start-1 max-lg:row-start-1">{featuredRelease.title}</h1>
<p className="mt-4 max-w-prose text-lg text-muted max-md:text-sm max-lg:col-start-1 max-lg:row-start-3 lg:mx-0 lg:mr-auto"><span className="featured-artist-name">{featuredRelease.artist}</span><span className="featured-artist-divider"> · </span><span className="featured-artist-location">{featuredRelease.city}</span></p>
<Link href="/featured/artists" className="btn mx-0 mt-6 min-h-12 w-fit px-6 py-3 text-base font-bold max-lg:col-span-2 max-lg:row-start-4 lg:mx-0">Explore more artists →</Link>
        </div>
      </section> : <section><h1 className="headline-xl">A zine. A living archive.</h1><p className="mt-4 text-muted">{archiveUnavailable ? "Archive records are temporarily unavailable. Explore the stories below and try again shortly." : "No published releases yet. Explore the stories and scenes below."}</p></section>}

      <section aria-labelledby="new-on-tape" className="mt-24 sm:mt-32">
        <div className="mb-6 flex items-baseline justify-between gap-4"><h2 id="new-on-tape" className="headline-md">Latest releases</h2><Link href="/featured/releases" className="kicker no-underline hover:underline">See all →</Link></div>
        <div className="index-head" aria-hidden="true"><span>No.</span><span>Release / Artist</span><span className="index-meta">Format / Year</span><span aria-hidden="true">&#8599;</span></div>
        <ol className="index-list">{releases.slice(0, 5).map((release, index) => <li key={release.slug}><Link href={release.href} className="index-row"><span className="index-number">{String(index + 1).padStart(2, "0")}</span><div className="index-identity"><CoverArt seed={release.slug} imageSrc={release.coverUrl} className="aspect-square" /><div><h3 className="index-title">{release.title}</h3><p className="index-meta mt-2">{release.artist} / {release.city}</p></div></div><p className="index-meta">{[release.format, release.year].filter(Boolean).join(" / ") || "Not documented"}</p><span className="index-arrow" aria-hidden="true">&#8599;</span></Link></li>)}</ol>
      </section>

      {spotlight ? <section aria-labelledby="artist-spotlight" className="mt-24 border-t border-rule pt-10 sm:mt-32 sm:pt-12">
        <p className="kicker">Artist spotlight</p>
        <div className="mt-5 grid gap-8 md:grid-cols-[14rem_1fr] md:items-start md:gap-10"><CoverArt seed={spotlight.slug} imageSrc={spotlight.imageUrl} className="aspect-square w-full" /><div><h2 id="artist-spotlight" className="headline-md text-3xl">{spotlight.name}</h2><p className="mt-2 kicker">{spotlight.location}</p><p className="mt-5 max-w-prose text-lg leading-relaxed text-muted">{spotlight.summary}</p><Link href={`/featured/artists/${spotlight.slug}`} className="mt-6 inline-block text-sm">Read the profile →</Link></div></div>
      </section> : null}

      <section aria-labelledby="editorials" className="mt-24 sm:mt-32"><div className="mb-4 flex items-baseline justify-between gap-4"><h2 id="editorials" className="headline-md">Editorials</h2><Link href="/editorial" className="kicker no-underline hover:underline">All editorial →</Link></div><ul>{stories.map((story, index) => <StoryRow key={story.href} story={story} imageSrc={index === 0 ? "/color01.jpg" : index === 1 ? "/color02.png" : undefined} />)}</ul></section>

<section aria-labelledby="discover" className="mt-24 sm:mt-32"><div className="mb-5 flex items-baseline justify-between gap-4"><h2 id="discover" className="headline-md">Discover</h2><Link href="/discover" className="kicker no-underline hover:underline">Explore all →</Link></div><div className="grid grid-cols-4 gap-2 sm:gap-3">{homepageVideos.map((video) => { const card = <><div className="flex aspect-video items-center justify-center border border-rule bg-paper/[0.04]"><span className="font-display text-lg">▶</span></div><h3 className="mt-2 line-clamp-2 font-display text-[11px] font-semibold leading-tight tracking-tight">{video.title}</h3></>; return video.href ? <a key={video.title} href={video.href} target="_blank" rel="noreferrer" className="group block no-underline hover:no-underline">{card}</a> : <div key={video.title}>{card}</div>; })}</div><div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">{homepageEvents.map((event) => { const mediaImage = mediaConsent ? event.imageSrc : undefined; const card = <><div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-paper/[0.04]">{mediaImage ? <img src={mediaImage} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" /> : <span className="kicker text-[9px]">{mediaConsent ? "Event placeholder" : "Enable media cookies to view"}</span>}</div><h3 className="mt-2 line-clamp-2 font-display text-[11px] font-semibold leading-tight tracking-tight">{event.title}</h3></>; return event.href ? <a key={event.title} href={event.href} target="_blank" rel="noreferrer" className="group block border border-rule p-2 no-underline hover:no-underline sm:p-3">{card}</a> : <div key={event.title} className="border border-rule p-2 sm:p-3">{card}</div>; })}</div></section>

      <section aria-labelledby="contribute" className="mt-24 border-t border-rule pt-10 sm:mt-32 sm:pt-12"><p className="kicker">Keep the archive alive</p><div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><h2 id="contribute" className="headline-md text-3xl">Know something we missed?</h2><p className="mt-3 max-w-prose text-muted">Tell us about an artist, label, space, release or tape worth keeping in the record.</p></div><a href="mailto:info@tape_x247.com?subject=Submission%20for%20tape_x247" className="btn w-fit">Submit a lead →</a></div></section>
    </div>
  );
}

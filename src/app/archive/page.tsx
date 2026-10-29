import Link from "next/link";
import CoverArt from "@/components/CoverArt";
import ReleaseRow from "@/components/ReleaseRow";
import { archiveCategories } from "@/content/taxonomy";
import { getArtists, getLabels, getReleases } from "@/lib/content/queries";
import { buildReleaseCatalog, selectSpotlight } from "@/lib/content/catalog";

export const metadata = { title: "Featured | tape_x247", description: "Discover artists, independent releases and labels from South Asia and its diaspora." };
export const revalidate = 60;

export default async function ArchivePage() {
  const [artists, labels, records] = await Promise.all([getArtists(), getLabels(), getReleases()]);
  const releases = buildReleaseCatalog(records, artists);
  const spotlight = selectSpotlight(artists);
  const counts: Record<string, number> = { artists: artists.length, labels: labels.length, releases: releases.length };
  const active = archiveCategories.filter(category => category.slug in counts);
  const developing = archiveCategories.filter(category => !(category.slug in counts));

  return <div className="wrap py-10">
    <p className="kicker">People / Sounds / Connections</p>
    <h1 className="page-title mt-4">Featured</h1>
    <p className="mt-4 max-w-prose text-lg text-muted">Independent sounds from South Asia and its diaspora. Meet the artists, explore their records and follow the connections.</p>
    {spotlight ? <section aria-labelledby="featured-artist" className="mt-10 grid gap-6 border-y border-rule py-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center md:gap-10">
      <Link href={`/featured/artists/${spotlight.slug}`} aria-label={`Explore ${spotlight.name}`}><CoverArt seed={spotlight.slug} imageSrc={spotlight.imageUrl} eager className="aspect-square w-full" /></Link>
      <div><p className="kicker">Artist spotlight</p><h2 id="featured-artist" className="headline-xl mt-4">{spotlight.name}</h2><p className="kicker mt-3">{spotlight.location}</p>{spotlight.summary ? <p className="mt-5 max-w-prose whitespace-pre-line text-lg leading-relaxed text-muted">{spotlight.summary}</p> : null}<Link href={`/featured/artists/${spotlight.slug}`} className="btn mt-6 inline-block">Explore the artist →</Link></div>
    </section> : null}
    <section aria-labelledby="latest-releases" className="mt-12">
      <div className="flex flex-wrap items-baseline justify-between gap-4"><h2 id="latest-releases" className="headline-md">Latest releases</h2><Link href="/featured/releases" className="kicker">Browse all releases →</Link></div>
      <p className="mt-3 text-sm text-muted">From the collection, ordered by release date.</p>
      {releases.length ? <><div className="index-head mt-6" aria-hidden="true"><span>No.</span><span>Release / Artist</span><span className="index-meta">Year / Format / Label</span><span /></div><ol className="index-list">{releases.slice(0, 4).map((release, index) => <ReleaseRow key={release.slug} release={release} index={index} />)}</ol></> : <p className="mt-6 text-muted">No published releases yet. Explore the artists as the collection grows.</p>}
    </section>
    <section aria-labelledby="browse-collection" className="mt-12">
      <h2 id="browse-collection" className="headline-md">Browse the collection</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">{active.map((category, index) => <Link key={category.slug} href={`/featured/${category.slug}`} className="group flex min-h-52 flex-col justify-between border border-rule p-5 no-underline transition-colors hover:bg-paper/[0.04] hover:no-underline"><div className="flex items-start justify-between gap-4"><span className="index-number">{String(index + 1).padStart(2, "0")}</span><span aria-hidden="true">↗</span></div><div className="mt-8"><h3 className="index-title">{category.title}</h3><p className="mt-2 text-sm text-muted">{category.description}</p></div><p className="index-meta mt-6">{counts[category.slug]} records</p></Link>)}</div>
    </section>
    <section aria-labelledby="developing-collections" className="mt-10 border-y border-rule py-6"><h2 id="developing-collections" className="kicker">Collections in development</h2><p className="mt-3 max-w-prose text-sm text-muted">We’re building a wider record of the people and places behind the music.</p><ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">{developing.map(category => <li key={category.slug}><Link className="text-sm" href={`/featured/${category.slug}`}>{category.title}</Link></li>)}</ul></section>
    <section aria-labelledby="contribute-featured" className="mt-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><h2 id="contribute-featured" className="headline-md">Help the collection grow.</h2><p className="mt-3 max-w-prose text-muted">Know an artist, release or source we should document? Send a lead or a correction.</p></div><a className="btn w-fit shrink-0" href="mailto:info@tape_x247.com?subject=Submission%20for%20tape_x247">Submit a lead →</a></section>
  </div>;
}

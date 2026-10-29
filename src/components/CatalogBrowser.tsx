"use client";

import { useState } from "react";
import ArtistRow from "@/components/ArtistRow";
import ReleaseRow from "@/components/ReleaseRow";
import type { Artist } from "@/types/demo";
import type { CatalogRelease } from "@/lib/content/catalog";

export type BrowseArtist = Pick<Artist, "slug" | "name" | "summary" | "imageUrl" | "location" | "country" | "tags">;
const fieldClass = "mt-2 min-h-12 w-full border border-rule bg-oxide px-3 py-2 text-base text-paper";

export default function CatalogBrowser({ artists = [], releases = [], kind }: {
  artists?: BrowseArtist[];
  releases?: CatalogRelease[];
  kind: "artists" | "releases";
}) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [year, setYear] = useState("");
  const [format, setFormat] = useState("");
  const query = search.trim().toLocaleLowerCase();
  const countries = [...new Set(artists.map(artist => artist.country).filter((value): value is string => !!value))].sort();
  const years = [...new Set(releases.map(release => release.release_date?.slice(0, 4)).filter((value): value is string => !!value))].sort().reverse();
  const formats = [...new Set(releases.map(release => release.format).filter((value): value is string => !!value))].sort();
  const visibleArtists = artists.filter(artist => (!country || artist.country === country) && `${artist.name} ${artist.location}`.toLocaleLowerCase().includes(query));
  const visibleReleases = releases.filter(release => (!year || release.release_date?.startsWith(year)) && (!format || release.format === format) && `${release.title} ${release.artists.map(artist => artist.name).join(" ")} ${release.label ?? ""}`.toLocaleLowerCase().includes(query));
  const count = kind === "artists" ? visibleArtists.length : visibleReleases.length;
  const total = kind === "artists" ? artists.length : releases.length;
  const filtered = !!(search || country || year || format);

  return <>
    <div className="mt-8 grid gap-4 border-y border-rule py-5 sm:grid-cols-2 lg:grid-cols-4">
      <label className="text-sm sm:col-span-2">Search {kind}<input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder={kind === "artists" ? "Artist name or location" : "Release, artist or label"} className={fieldClass} /></label>
      {kind === "artists" ? <label className="text-sm">Country<select className={fieldClass} value={country} onChange={event => setCountry(event.target.value)}><option value="">All countries</option>{countries.map(value => <option key={value}>{value}</option>)}</select></label> : <>
        <label className="text-sm">Year<select className={fieldClass} value={year} onChange={event => setYear(event.target.value)}><option value="">All years</option>{years.map(value => <option key={value}>{value}</option>)}</select></label>
        <label className="text-sm">Format<select className={fieldClass} value={format} onChange={event => setFormat(event.target.value)}><option value="">All formats</option>{formats.map(value => <option key={value}>{value}</option>)}</select></label>
      </>}
    </div>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p role="status" className="kicker">{count} of {total} records</p>{filtered ? <button type="button" className="min-h-11 text-sm underline underline-offset-4" onClick={() => { setSearch(""); setCountry(""); setYear(""); setFormat(""); }}>Clear filters</button> : null}</div>
    {count > 0 ? <><div className="index-head mt-6" aria-hidden="true"><span>No.</span><span>{kind === "artists" ? "Artist" : "Release / Artist"}</span><span className="index-meta">{kind === "artists" ? "Location" : "Year / Format / Label"}</span><span /></div><ul className="index-list">{kind === "artists" ? visibleArtists.map((artist, index) => <ArtistRow key={artist.slug} a={artist} index={index} />) : visibleReleases.map((release, index) => <ReleaseRow key={release.slug} release={release} index={index} />)}</ul></> : <p className="my-10 text-muted">{total === 0 ? `No published ${kind} yet. Check back as the collection grows.` : "No records match your filters. Try another search or clear the filters."}</p>}
  </>;
}

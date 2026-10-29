import Link from "next/link";
import CoverArt from "@/components/CoverArt";
import type { CatalogRelease } from "@/lib/content/catalog";

export default function ReleaseRow({ release, index }: { release: CatalogRelease; index: number }) {
  const content = <>
    <span className="index-number">{String(index + 1).padStart(2, "0")}</span>
    <div className="index-identity"><CoverArt seed={release.slug} imageSrc={release.cover_url ?? undefined} className="aspect-square" /><div><h3 className="index-title">{release.title}</h3><p className="index-meta mt-2">{release.artists.map(artist => artist.name).join(" / ") || "Artist not documented"}</p></div></div>
    <p className="index-meta">{[release.release_date?.slice(0, 4), release.format, release.label].filter(Boolean).join(" / ") || "Details not documented"}</p>
    {release.artists.length > 0 ? <span className="index-arrow" aria-hidden="true">↗</span> : null}
  </>;
  return <li>{release.artists[0] ? <Link href={release.artists[0].href} className="index-row">{content}</Link> : <div className="index-row">{content}</div>}</li>;
}

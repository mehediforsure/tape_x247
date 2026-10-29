import Link from "next/link";
import CoverArt from "@/components/CoverArt";
import type { Artist } from "@/types/demo";

export default function ArtistRow({ a, index }: { a: Pick<Artist, "slug" | "name" | "summary" | "imageUrl" | "location" | "tags">; index: number }) {
  return <li><Link href={`/featured/artists/${a.slug}`} className="index-row">
    <span className="index-number">{String(index + 1).padStart(2, "0")}</span>
    <div className="index-identity"><CoverArt seed={a.slug} imageSrc={a.imageUrl} className="aspect-square" /><div><h2 className="index-title">{a.name}</h2><p className="mt-2 text-sm text-muted">{a.summary}</p></div></div>
    <p className="index-meta">&#9679; {a.location}<span className="mt-2 block">{a.tags.join(" / ")}</span></p>
    <span className="index-arrow" aria-hidden="true">&#8599;</span>
  </Link></li>;
}

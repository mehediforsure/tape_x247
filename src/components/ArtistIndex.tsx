import Link from "next/link";
import { getArtists } from "@/lib/content/queries";
import CatalogBrowser from "@/components/CatalogBrowser";

export default async function ArtistIndex() {
  const artists = await getArtists();
  const entries = artists.map(({ slug, name, summary, imageUrl, location, country, tags }) => ({ slug, name, summary, imageUrl, location, country, tags }));
  return <div className="wrap py-10">
    <Link href="/featured" className="kicker">← Featured</Link>
    <h1 className="page-title mt-6">Artists</h1>
    <p className="mt-4 max-w-prose text-lg text-muted">Artists, producers and DJs. Find a familiar name or explore a different scene.</p>
    <CatalogBrowser kind="artists" artists={entries} />
  </div>;
}

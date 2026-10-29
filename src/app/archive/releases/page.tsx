import Link from "next/link";
import CatalogBrowser from "@/components/CatalogBrowser";
import { getArtists, getReleases } from "@/lib/content/queries";
import { buildReleaseCatalog } from "@/lib/content/catalog";

export const metadata = { title: "Releases | tape_x247", description: "Explore releases from the tape_x247 collection by artist, year and format." };
export const revalidate = 60;

export default async function ReleasesPage() {
  const [records, artists] = await Promise.all([getReleases(), getArtists()]);
  const releases = buildReleaseCatalog(records, artists);
  return <div className="wrap py-10">
    <Link href="/featured" className="kicker">← Featured</Link>
    <h1 className="page-title mt-6">Releases</h1>
    <p className="mt-4 max-w-prose text-lg text-muted">Cassettes, CD-Rs, vinyl and digital releases, ordered by release date. Open a record to explore its artist’s discography.</p>
    <CatalogBrowser kind="releases" releases={releases} />
  </div>;
}

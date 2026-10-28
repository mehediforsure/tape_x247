import Link from "next/link";
import { archiveCategories } from "@/content/taxonomy";
import { getArtists, getLabels, getReleases } from "@/lib/content/queries";

export const metadata = { title: "Featured | tape_x247" };

// Re-fetch from Supabase at most once a minute (otherwise the build-time snapshot is served forever).
export const revalidate = 60;

export default async function ArchivePage() {
  const [artists, labels, releases] = await Promise.all([getArtists(), getLabels(), getReleases()]);
  const counts: Record<string, number> = { artists: artists.length, labels: labels.length, releases: releases.length };
  return (
    <div className="wrap py-10">
      <h1 className="page-title">Featured</h1>
      <p className="mt-4 max-w-prose text-lg text-muted">
        A growing index of people, releases, spaces and sources. Browse by record type.
      </p>

      <div className="index-head mt-10" aria-hidden="true"><span>No.</span><span>Collection</span><span className="index-meta">Records</span><span aria-hidden="true">&#8599;</span></div>
      <ol className="index-list">
        {archiveCategories.map((c, index) => (
          <li key={c.slug}>
            <Link href={`/featured/${c.slug}`} className="index-row">
              <span className="index-number">{String(index + 1).padStart(2, "0")}</span>
              <div><h2 className="index-title">{c.title}</h2><p className="mt-2 text-sm text-muted">{c.description}</p></div>
              <p className="index-meta">&#9679; {c.slug in counts ? `${String(counts[c.slug]).padStart(2, "0")} records` : "No records yet"}</p>
              <span className="index-arrow" aria-hidden="true">&#8599;</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

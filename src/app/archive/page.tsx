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

      <ul className="mt-10 border-b border-rule">
        {archiveCategories.map((c) => (
          <li key={c.slug} className="rule-t">
            <Link
              href={`/featured/${c.slug}`}
              className="grid gap-1 py-5 no-underline hover:no-underline sm:grid-cols-[1fr_1fr_8rem] sm:items-baseline sm:gap-6"
            >
              <h2 className="font-display text-2xl font-bold tracking-tight decoration-1 underline-offset-4 hover:underline">
                {c.title}
              </h2>
              <p className="text-muted">{c.description}</p>
              <p className="kicker sm:text-right">
                {c.slug in counts
                  ? `${String(counts[c.slug]).padStart(2, "0")} records`
                  : "No records yet"}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

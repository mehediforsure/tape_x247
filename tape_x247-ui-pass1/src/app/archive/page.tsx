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
        {archiveCategories.map((c) => {
          const count = counts[c.slug] ?? 0;
          return (
          <li key={c.slug} className="rule-t">
            <Link
              href={`/featured/${c.slug}`}
              className={`group grid gap-1 py-5 no-underline hover:no-underline sm:grid-cols-[1fr_1fr_9rem] sm:items-baseline sm:gap-6 ${count === 0 ? "opacity-60 hover:opacity-100" : ""}`}
            >
              <h2 className="font-display text-2xl font-bold tracking-tight decoration-1 underline-offset-4 group-hover:underline">
                {c.title}
              </h2>
              <p className="text-muted">{c.description}</p>
              <p className="kicker sm:text-right">
                {count > 0 ? `${String(count).padStart(2, "0")} ${count === 1 ? "record" : "records"}` : "No records yet"}
              </p>
            </Link>
          </li>
          );
        })}
      </ul>
    </div>
  );
}

import Link from "next/link";
import { archiveCategories } from "@/content/taxonomy";
import { getArtists } from "@/lib/content/queries";

export const metadata = { title: "Archive | tape_x247" };

export default function ArchivePage() {
  const artistCount = getArtists().length;
  return (
    <div className="wrap py-10">
      <h1 className="page-title">Archive</h1>
      <p className="mt-4 max-w-prose text-lg text-muted">
        A growing index of people, releases, spaces and sources. Browse by record type.
      </p>

      <ul className="mt-10 border-b border-rule">
        {archiveCategories.map((c) => (
          <li key={c.slug} className="rule-t">
            <Link
              href={`/archive/${c.slug}`}
              className="grid gap-1 py-5 no-underline hover:no-underline sm:grid-cols-[1fr_1fr_8rem] sm:items-baseline sm:gap-6"
            >
              <h2 className="font-display text-2xl font-bold tracking-tight decoration-1 underline-offset-4 hover:underline">
                {c.title}
              </h2>
              <p className="text-muted">{c.description}</p>
              <p className="kicker sm:text-right">
                {c.slug === "artists"
                  ? `${String(artistCount).padStart(2, "0")} records`
                  : "No records yet"}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

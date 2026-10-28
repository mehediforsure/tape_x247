import Link from "next/link";
import { countries } from "@/content/taxonomy";
import { getArtists } from "@/lib/content/queries";
import type { Artist } from "@/types/demo";

export const metadata = { title: "Discover | tape_x247" };

// Re-fetch from Supabase at most once a minute.
export const revalidate = 60;

const inCountry = (artist: Artist, name: string) =>
  artist.country === name || artist.location.split(",").at(-1)?.trim() === name;

export default async function DiscoverPage() {
  let artists: Artist[] = [];
  let unavailable = false;
  try {
    artists = await getArtists();
  } catch (error) {
    console.error("[discover] Artist records are unavailable:", error);
    unavailable = true;
  }

  return (
    <div className="wrap py-10">
      <h1 className="page-title">Discover</h1>
      <p className="mt-4 max-w-prose text-lg text-muted">
        Start with a country and follow the music from there.
      </p>
      {unavailable ? (
        <p className="mt-6 text-sm text-muted">Counts are temporarily unavailable.</p>
      ) : null}

      <ul className="mt-10 border-b border-rule">
        {countries.map((c) => {
          const count = unavailable ? undefined : artists.filter((a) => inCountry(a, c.name)).length;
          return (
            <li key={c.slug} className="rule-t">
              <Link
                href={`/discover/${c.slug}`}
                className={`group flex items-baseline justify-between gap-4 py-5 no-underline hover:no-underline ${count === 0 ? "opacity-60 hover:opacity-100" : ""}`}
              >
                <h2 className="font-display text-2xl font-bold tracking-tight decoration-1 underline-offset-4 group-hover:underline">{c.name}</h2>
                <p className="kicker">
                  {count === undefined ? "" : count === 0 ? "No records yet" : `${String(count).padStart(2, "0")} ${count === 1 ? "record" : "records"}`}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

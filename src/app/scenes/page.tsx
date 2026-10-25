import Link from "next/link";
import { countries } from "@/content/taxonomy";
import { getArtistsByCountry } from "@/lib/content/queries";

export const metadata = { title: "Scenes | tape_x247" };

export default function ScenesPage() {
  return (
    <div className="wrap py-10">
      <h1 className="page-title">Scenes</h1>
      <p className="mt-4 max-w-prose text-lg text-muted">
        Starting points for exploring South Asian electronic music.
      </p>
      <ul className="mt-10 border-b border-rule">
        {countries.map((c) => {
          const count = getArtistsByCountry(c.name).length;
          return (
            <li key={c.slug} className="rule-t">
              <Link
                href={`/scenes/${c.slug}`}
                className="flex items-baseline justify-between py-4 no-underline hover:no-underline"
              >
                <span className="font-display text-3xl font-bold tracking-tight decoration-1 underline-offset-4 hover:underline sm:text-5xl">
                  {c.name}
                </span>
                <span className="kicker">{String(count).padStart(2, "0")} records</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

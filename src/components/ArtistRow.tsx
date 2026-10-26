import Link from "next/link";
import CoverArt from "@/components/CoverArt";
import type { Artist } from "@/types/demo";

export default function ArtistRow({ a }: { a: Artist }) {
  return (
    <li className="rule-t">
      <Link
        href={`/featured/artists/${a.slug}`}
        className="grid grid-cols-[5rem_1fr] gap-5 py-5 no-underline hover:no-underline sm:grid-cols-[8rem_1fr]"
      >
        <CoverArt seed={a.slug} label={a.code} imageSrc={a.imageUrl} className="aspect-square w-full" />
        <div className="space-y-2">
          <p className="kicker">
            <b>{a.code ?? "Artist"}</b> · {a.location}
          </p>
          <h2 className="headline-md text-2xl decoration-1 underline-offset-4 hover:underline">
            {a.name}
          </h2>
          <p className="max-w-prose text-muted">{a.summary}</p>
          <p className="flex flex-wrap gap-2">
            {a.tags.map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </p>
        </div>
      </Link>
    </li>
  );
}

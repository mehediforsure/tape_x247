import Link from "next/link";
import { notFound } from "next/navigation";
import CoverArt from "@/components/CoverArt";
import Tracklist from "@/components/Tracklist";
import { getArtists, getArtist, getArtistArticles } from "@/lib/content/queries";
import { toStory } from "@/lib/content/stories";
import { FeedRow } from "@/components/Stories";

export function generateStaticParams() {
  return getArtists().map((a) => ({ slug: a.slug }));
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = getArtist(slug);
  if (!artist) notFound();

  const appearsIn = getArtistArticles(artist.slug).map(toStory);
  const facts: [string, string][] = [
    ["Based in", artist.location],
    ["Active", artist.active],
    ["Provenance", `${artist.provenance}: replace before publishing`],
  ];

  return (
    <div className="wrap py-10">
      <Link href="/archive/artists" className="kicker">← Artists</Link>

      <section className="mt-6 grid gap-10 md:grid-cols-[5fr_7fr] md:gap-12">
        <CoverArt seed={artist.slug} label={artist.code} className="aspect-square w-full" />
        <div>
          <p className="kicker"><b>{artist.code}</b> · Artist</p>
          <h1 className="page-title mt-2">{artist.name}</h1>
          <p className="mt-4 flex flex-wrap gap-2">
            {artist.tags.map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </p>
          <dl className="mt-8 text-sm">
            {facts.map(([k, v]) => (
              <div
                key={k}
                className="grid grid-cols-[7rem_1fr] gap-3 border-t border-rule py-2 last:border-b"
              >
                <dt className="text-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mt-12 max-w-prose">
        <h2 className="kicker mb-3">Bio</h2>
        <p className="prose-body">{artist.bio}</p>
      </section>

      <section className="mt-14">
        <h2 className="headline-md mb-4">Discography</h2>
        <div className="border-b border-rule">
          {artist.releases.map((r) => (
            <article
              key={r.title}
              className="grid gap-6 border-t border-rule py-8 md:grid-cols-[12rem_1fr] md:gap-8"
            >
              <CoverArt seed={`${artist.slug}-${r.title}`} label={r.title} className="aspect-square w-full" />
              <div>
                <p className="kicker">{r.year} · {r.format} · {r.label}</p>
                <h3 className="font-display mt-1 text-2xl font-bold tracking-tight">{r.title}</h3>
                <div className="mt-5 grid gap-6 sm:grid-cols-2">
                  <Tracklist
                    heading={r.format === "Digital" ? "Tracks" : "Side A"}
                    tracks={r.sideA}
                  />
                  {r.sideB && (
                    <Tracklist heading="Side B" tracks={r.sideB} start={r.sideA.length + 1} />
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {appearsIn.length > 0 && (
        <section className="mt-14">
          <h2 className="headline-md mb-4">Appears in</h2>
          <ul className="border-b border-rule">
            {appearsIn.map((s) => (
              <FeedRow key={s.href} s={s} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

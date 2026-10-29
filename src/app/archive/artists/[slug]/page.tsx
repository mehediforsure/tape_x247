import type { Metadata } from "next";
import ArrowUpRight from "@/components/ArrowUpRight";
import Link from "next/link";
import { notFound } from "next/navigation";
import CoverArt from "@/components/CoverArt";
import Tracklist from "@/components/Tracklist";
import { getArtists, getArtist, getArtistArticles } from "@/lib/content/queries";
import { toStory } from "@/lib/content/stories";
import { FeedRow } from "@/components/Stories";
import { releaseAnchor } from "@/lib/content/catalog";

// Re-fetch from Supabase at most once a minute.
export const revalidate = 60;

export async function generateStaticParams() {
  return (await getArtists()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const artist = await getArtist((await params).slug);
  if (!artist) return { title: "tape_x247" };
  return { title: `${artist.name} | tape_x247`, ...(artist.summary ? { description: artist.summary } : {}) };
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = await getArtist(slug);
  if (!artist) notFound();

  const appearsIn = getArtistArticles(artist.slug).map(toStory);
  const facts: [string, string][] = [
    ["Based in", artist.location],
    ["Active", artist.active ?? "Years not documented"],
    ["Verification", "Not independently verified"],
  ];

  return (
    <div className="wrap py-10">
      <Link href="/featured/artists" className="kicker">← Artists</Link>

      <section className="mt-6 grid gap-10 md:grid-cols-[5fr_7fr] md:gap-12">
        <CoverArt seed={artist.slug} label={artist.code} imageSrc={artist.imageUrl} sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 979px) 42vw, 372px" className="aspect-square w-full" />
        <div>
          <p className="kicker">{artist.code && <><b>{artist.code}</b> · </>}Artist</p>
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
        <p className="prose-body whitespace-pre-line">{artist.bio || "A biography has not been documented yet."}</p>
      </section>

      {artist.sourceNote ? <section className="mt-8 max-w-prose"><h2 className="kicker mb-3">Source notes</h2><p className="prose-body whitespace-pre-line">{artist.sourceNote}</p></section> : null}

      <section className="mt-14">
        <h2 className="headline-md mb-4">Discography</h2>
        {artist.releases.length === 0 && (
          <p className="max-w-prose text-muted">No releases have been published for this artist yet.</p>
        )}
        <div className="border-b border-rule">
          {artist.releases.map((r) => (
            <article
              id={releaseAnchor(r)}
              key={r.id ?? r.slug ?? r.title}
              className="grid scroll-mt-28 gap-6 border-t border-rule py-8 md:grid-cols-[12rem_1fr] md:gap-8"
            >
              <CoverArt seed={`${artist.slug}-${r.title}`} label={r.title} imageSrc={r.coverUrl} sizes="(max-width: 767px) calc(100vw - 40px), 192px" className="aspect-square w-full" />
              <div>
                <p className="kicker">{[r.year, r.format, r.label].filter(Boolean).join(" · ") || "Release details not documented"}</p>
                <h3 className="font-display mt-1 text-2xl font-bold tracking-tight">{r.title}</h3>
                {r.links?.length ? <ul className="mt-4 flex flex-wrap gap-4">{r.links.map((link, index) => <li key={`${link.url}-${index}`}><a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-block py-2 text-sm capitalize">Open on {link.label} <ArrowUpRight /><span className="sr-only"> (opens in a new tab)</span></a></li>)}</ul> : null}
                <div className="mt-5 grid gap-6 sm:grid-cols-2">
                  <Tracklist
                    heading={r.sideB || r.extraSides?.length || r.format === "Cassette" || r.format === "Vinyl" ? "Side A" : "Tracks"}
                    tracks={r.sideA}
                  />
                  {r.sideB && (
                    <Tracklist heading="Side B" tracks={r.sideB} start={r.sideA.length + 1} />
                  )}
                  {r.extraSides?.map((s, i) => (
                    <Tracklist
                      key={s.side}
                      heading={`Side ${s.side}`}
                      tracks={s.tracks}
                      start={
                        r.sideA.length +
                        (r.sideB?.length ?? 0) +
                        (r.extraSides ?? []).slice(0, i).reduce((n, x) => n + x.tracks.length, 0) +
                        1
                      }
                    />
                  ))}
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

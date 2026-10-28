import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Crumb from "@/components/Crumb";
import CoverArt from "@/components/CoverArt";
import Tracklist from "@/components/Tracklist";
import { getArtists, getArtist, getArtistArticles } from "@/lib/content/queries";
import { toStory } from "@/lib/content/stories";
import { FeedRow } from "@/components/Stories";

// Re-fetch from Supabase at most once a minute.
export const revalidate = 60;

export async function generateStaticParams() {
  return (await getArtists()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const artist = await getArtist(slug);
    if (!artist) return { title: "Artist not found | tape_x247" };
    const description = artist.summary || `${artist.name}, ${artist.location}.`;
    return {
      title: `${artist.name} | tape_x247`,
      description,
      openGraph: { title: artist.name, description, images: artist.imageUrl ? [artist.imageUrl] : undefined },
    };
  } catch {
    return { title: "Artist | tape_x247" };
  }
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
  // Only show facts that exist. The provenance note is an editor-only reminder, so it stays out of production.
  const facts: [string, string][] = [["Based in", artist.location]];
  if (artist.active) facts.push(["Active", artist.active]);
  if (process.env.NODE_ENV !== "production") facts.push(["Provenance", `${artist.provenance}: replace before publishing`]);

  return (
    <div className="wrap py-10">
      <Crumb trail={[{ href: "/featured", label: "Featured" }, { href: "/featured/artists", label: "Artists" }]} />

      <section className="mt-6 grid gap-10 md:grid-cols-[5fr_7fr] md:gap-12">
        <CoverArt seed={artist.slug} label={artist.code} imageSrc={artist.imageUrl} eager className="aspect-square w-full" />
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

      {artist.bio ? (
        <section className="mt-12 max-w-prose">
          <h2 className="kicker mb-3">Bio</h2>
          <p className="prose-body">{artist.bio}</p>
        </section>
      ) : null}

      <section className="mt-14">
        <h2 className="headline-md mb-4">Discography</h2>
        {artist.releases.length === 0 && (
          <p className="max-w-prose text-muted">No releases have been published for this artist yet.</p>
        )}
        <div className="border-b border-rule">
          {artist.releases.map((r) => (
            <article
              key={r.id ?? r.slug ?? r.title}
              className="grid gap-6 border-t border-rule py-8 md:grid-cols-[12rem_1fr] md:gap-8"
            >
              <CoverArt seed={`${artist.slug}-${r.title}`} label={r.title} imageSrc={r.coverUrl} className="aspect-square w-full" />
              <div>
                <p className="kicker">{[r.year, r.format, r.label].filter(Boolean).join(" · ") || "Release details not documented"}</p>
                <h3 className="font-display mt-1 text-2xl font-bold tracking-tight">{r.title}</h3>
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

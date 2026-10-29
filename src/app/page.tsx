import HomeView from "@/components/HomeView";
import { countries } from "@/content/taxonomy";
import { getArticles, getArtists } from "@/lib/content/queries";
import { toStory } from "@/lib/content/stories";
import type { Artist } from "@/types/demo";
import { releaseHref, selectSpotlight } from "@/lib/content/catalog";

// Keep the homepage fast for returning visitors while refreshing archive data regularly.
export const revalidate = 60;

export default async function HomePage() {
  const articles = getArticles();
  const stories = articles.map(toStory);
  const featuredIndex = articles.findIndex(a => a.body.length > 0);
  const lead = stories[featuredIndex < 0 ? 0 : featuredIndex];

  const side = stories.filter(s => s.href !== lead?.href);
  let artists: Artist[] = [];
  let archiveUnavailable = false;
  try {
    artists = await getArtists();
  } catch (error) {
    console.error("[homepage] Archive content is unavailable:", error);
    archiveUnavailable = true;
  }
  const releases = artists.flatMap((artist) =>
    artist.releases.map((release) => ({
      slug: `${artist.slug}-${release.slug ?? release.id ?? release.title}`,
      artist: artist.name,
      artistSlug: artist.slug,
      href: releaseHref(artist.slug, release),
      coverUrl: release.coverUrl,
      city: artist.location.split(",")[0]?.trim() ?? artist.location,
      title: release.title,
      year: release.year,
      type: release.type,
      releaseDate: release.releaseDate,
      format: release.format,
    })),
  ).sort((a, b) => (b.releaseDate ?? "").localeCompare(a.releaseDate ?? "") || a.slug.localeCompare(b.slug));
  // Only an explicitly featured artist is a spotlight. Break ties by a stable identifier.
  const randomReleaseIndex = releases.length > 1 ? Math.floor(Math.random() * releases.length) : 0;
  const spotlight = selectSpotlight(artists);
  const scenes = countries.map(c => ({
    ...c,
    count: archiveUnavailable ? undefined : artists.filter(artist =>
      artist.country === c.name || artist.location.split(",").at(-1)?.trim() === c.name,
    ).length,
  }));

  return <HomeView lead={lead} side={side} scenes={scenes} releases={releases} initialReleaseIndex={randomReleaseIndex} spotlight={spotlight} archiveUnavailable={archiveUnavailable} />;
}

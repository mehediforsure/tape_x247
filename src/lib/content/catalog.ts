import type { Artist, Release } from "@/types/demo";

export function releaseAnchor(release: Pick<Release, "slug" | "id" | "title">) {
  return `release-${release.slug ?? release.id ?? release.title}`;
}

export function releaseHref(artistSlug: string, release: Pick<Release, "slug" | "id" | "title">) {
  return `/featured/artists/${artistSlug}#${encodeURIComponent(releaseAnchor(release))}`;
}

export function selectSpotlight(artists: Artist[]) {
  return artists.filter(artist => artist.featured).sort((a, b) => a.slug.localeCompare(b.slug))[0];
}

export type CatalogRelease = {
  slug: string;
  title: string;
  release_date: string | null;
  format: string | null;
  cover_url: string | null;
  label: string | null;
  artists: { name: string; slug: string; href: string }[];
};

type ReleaseRecord = Omit<CatalogRelease, "artists" | "label"> & {
  labels: { name: string } | { name: string }[] | null;
};

export function buildReleaseCatalog(records: ReleaseRecord[], artists: Artist[]): CatalogRelease[] {
  const credits = new Map<string, CatalogRelease["artists"]>();
  for (const artist of artists) {
    for (const release of artist.releases) {
      if (!release.slug) continue;
      const entries = credits.get(release.slug) ?? [];
      if (!entries.some(entry => entry.slug === artist.slug)) {
        entries.push({ name: artist.name, slug: artist.slug, href: releaseHref(artist.slug, release) });
      }
      credits.set(release.slug, entries);
    }
  }
  return records.map(record => ({
    slug: record.slug,
    title: record.title,
    release_date: record.release_date,
    format: record.format,
    cover_url: record.cover_url,
    label: (Array.isArray(record.labels) ? record.labels[0] : record.labels)?.name ?? null,
    artists: (credits.get(record.slug) ?? []).sort((a, b) => a.slug.localeCompare(b.slug)),
  })).sort((a, b) => (b.release_date ?? "").localeCompare(a.release_date ?? "") || a.slug.localeCompare(b.slug));
}

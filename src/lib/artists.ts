import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/utils/supabase/env";

/**
 * Read-only data layer for the public archive.
 *
 * Uses a cookie-less client: public content does not depend on a user session,
 * so pages can be cached/revalidated. Row Level Security still applies — the
 * `anon` role only sees rows with status = 'published' (artists, releases).
 */
function getPublicClient() {
  const { url, key } = getSupabaseEnv();
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export type LinkRecord = { platform: string; url: string; embedUrl: string | null };

export type TrackRecord = {
  id: string;
  title: string;
  position: number | null;
  side: string | null;
  durationSeconds: number | null;
};

export type ReleaseRecord = {
  id: string;
  slug: string;
  title: string;
  releaseDate: string | null;
  format: string | null;
  coverUrl: string | null;
  description: string | null;
  label: { slug: string; name: string } | null;
  tracks: TrackRecord[];
  links: LinkRecord[];
};

export type ArtistRecord = {
  id: string;
  slug: string;
  catalogueNo: string | null;
  name: string;
  bio: string | null;
  imageUrl: string | null;
  featured: boolean;
  isDiaspora: boolean;
  activeFrom: number | null;
  activeTo: number | null;
  sourceNote: string | null;
  basedIn: string | null;
  city: string | null;
  country: { slug: string; name: string } | null;
  /** "Dhaka, Bangladesh" — falls back to based_in for diaspora artists. */
  location: string;
  links: LinkRecord[];
  releases: ReleaseRecord[];
};

// ---- raw PostgREST row shapes -------------------------------------------------
type RawLink = { platform: string; url: string; embed_url: string | null };
type RawTrack = {
  id: string;
  title: string;
  position: number | null;
  side: string | null;
  duration_seconds: number | null;
};
type RawRelease = {
  id: string;
  slug: string;
  title: string;
  release_date: string | null;
  format: string | null;
  cover_url: string | null;
  description: string | null;
  label: { slug: string; name: string } | null;
  tracks: RawTrack[] | null;
  links: RawLink[] | null;
};
type RawArtist = {
  id: string;
  slug: string;
  catalogue_no: string | null;
  name: string;
  bio: string | null;
  image_url: string | null;
  featured: boolean | null;
  is_diaspora: boolean | null;
  active_from: number | null;
  active_to: number | null;
  source_note: string | null;
  based_in: string | null;
  city: { name: string } | null;
  country: { slug: string; name: string } | null;
  links: RawLink[] | null;
  release_artists: { release: RawRelease | null }[] | null;
};

// `links` is embedded twice (artist links, release links); both FKs are
// unambiguous because each embed sits under a different parent table.
const ARTIST_SELECT = `
  id, slug, catalogue_no, name, bio, image_url, featured, is_diaspora,
  active_from, active_to, source_note, based_in,
  city:cities(name),
  country:countries(slug, name),
  links(platform, url, embed_url),
  release_artists(
    release:releases(
      id, slug, title, release_date, format, cover_url, description,
      label:labels(slug, name),
      tracks(id, title, position, side, duration_seconds),
      links(platform, url, embed_url)
    )
  )
`;

const mapLink = (l: RawLink): LinkRecord => ({
  platform: l.platform,
  url: l.url,
  embedUrl: l.embed_url,
});

function mapArtist(row: RawArtist): ArtistRecord {
  const releases: ReleaseRecord[] = (row.release_artists ?? [])
    .map((ra) => ra.release)
    .filter((r): r is RawRelease => r !== null) // unpublished releases are hidden by RLS
    .map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      releaseDate: r.release_date,
      format: r.format,
      coverUrl: r.cover_url,
      description: r.description,
      label: r.label,
      links: (r.links ?? []).map(mapLink),
      tracks: [...(r.tracks ?? [])]
        .sort(
          (a, b) =>
            (a.side ?? "").localeCompare(b.side ?? "") ||
            (a.position ?? 0) - (b.position ?? 0),
        )
        .map((t) => ({
          id: t.id,
          title: t.title,
          position: t.position,
          side: t.side,
          durationSeconds: t.duration_seconds,
        })),
    }))
    .sort((a, b) => (b.releaseDate ?? "").localeCompare(a.releaseDate ?? ""));

  const city = row.city?.name ?? null;
  const country = row.country ?? null;
  const location =
    [city, country?.name].filter(Boolean).join(", ") || row.based_in || "Location unknown";

  return {
    id: row.id,
    slug: row.slug,
    catalogueNo: row.catalogue_no,
    name: row.name,
    bio: row.bio,
    imageUrl: row.image_url,
    featured: row.featured ?? false,
    isDiaspora: row.is_diaspora ?? false,
    activeFrom: row.active_from,
    activeTo: row.active_to,
    sourceNote: row.source_note,
    basedIn: row.based_in,
    city,
    country,
    location,
    links: (row.links ?? []).map(mapLink),
    releases,
  };
}

/** All published artists, ordered by catalogue number. Throws on failure. */
export async function getArtists(): Promise<ArtistRecord[]> {
  const { data, error } = await getPublicClient()
    .from("artists")
    .select(ARTIST_SELECT)
    .order("catalogue_no", { ascending: true });

  if (error) {
    throw new Error(`Supabase getArtists failed: ${error.message} (${error.code ?? "no code"})`);
  }
  return ((data ?? []) as unknown as RawArtist[]).map(mapArtist);
}

/** One published artist by slug, or null if it does not exist / is not published. */
export async function getArtistBySlug(slug: string): Promise<ArtistRecord | null> {
  const { data, error } = await getPublicClient()
    .from("artists")
    .select(ARTIST_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Supabase getArtistBySlug("${slug}") failed: ${error.message} (${error.code ?? "no code"})`,
    );
  }
  return data ? mapArtist(data as unknown as RawArtist) : null;
}

/** Published artists for a country slug such as "bangladesh" or "sri-lanka". */
export async function getArtistsByCountry(countrySlug: string): Promise<ArtistRecord[]> {
  const all = await getArtists();
  return all.filter((a) => a.country?.slug === countrySlug);
}

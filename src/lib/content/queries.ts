import { dispatches } from "@/content/demo";
import { cache } from "react";
import { createPublicClient } from "@/utils/supabase/public";
import type { Artist, Release } from "@/types/demo";

type Relation<T> = T | T[] | null;

type TrackRow = {
  title: string;
  position: number | null;
  side: string | null;
};

type ReleaseRow = {
  id: string;
  slug: string;
  title: string;
  status: string;
  release_date: string | null;
  format: string | null;
  cover_url: string | null;
  labels: Relation<{ name: string }>;
  tracks: TrackRow[] | null;
  links: unknown[] | null;
};

type ArtistRow = {
  slug: string;
  name: string;
  bio: string | null;
  is_diaspora: boolean | null;
  image_url: string | null;
  active_from: number | null;
  active_to: number | null;
  source_note: string | null;
  catalogue_no: string | null;
  featured: boolean | null;
  based_in: string | null;
  status: string;
  cities: Relation<{ name: string }>;
  countries: Relation<{ name: string }>;
  release_artists: Array<{ releases: Relation<ReleaseRow> }> | null;
};

function one<T>(value: Relation<T>): T | null {
  return Array.isArray(value) ? value[0] ?? null : value;
}

function activeLabel(row: ArtistRow) {
  if (row.active_from == null) return row.active_to == null ? null : `Until ${row.active_to}`;
  return row.active_to == null ? `From ${row.active_from}` : `${row.active_from} to ${row.active_to}`;
}

const FORMATS: Record<string, Release["format"]> = {
  cassette: "Cassette",
  "cd-r": "CD-R",
  digital: "Digital",
  vinyl: "Vinyl",
};

// "a", " B ", "Side C" -> "A", "B", "C"
const normalizeSide = (side: string | null) => (side ?? "").trim().replace(/^side\s+/i, "").toUpperCase();

function mapRelease(row: ReleaseRow): Release {
  const tracks = [...(row.tracks ?? [])].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  // Group by side so nothing is dropped: untagged tracks go on A; C, D, ... are kept in extraSides.
  const bySide = new Map<string, string[]>();
  for (const track of tracks) {
    const side = normalizeSide(track.side) || "A";
    bySide.set(side, [...(bySide.get(side) ?? []), track.title]);
  }
  const sideA = bySide.get("A") ?? [];
  const sideB = bySide.get("B") ?? [];
  const extraSides = [...bySide.entries()]
    .filter(([side]) => side !== "A" && side !== "B")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([side, titles]) => ({ side, tracks: titles }));
  const rawFormat = row.format?.trim();
  const format = rawFormat ? FORMATS[rawFormat.toLowerCase()] ?? rawFormat : null;
  const year = row.release_date ? Number(row.release_date.slice(0, 4)) : null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    releaseDate: row.release_date,
    year: year != null && Number.isInteger(year) && year > 0 ? year : null,
    format,
    label: one(row.labels)?.name?.trim() || null,
    sideA,
    ...(sideB.length > 0 ? { sideB } : {}),
    ...(extraSides.length > 0 ? { extraSides } : {}),
    coverUrl: row.cover_url ?? undefined,
  };
}

function mapArtist(row: ArtistRow): Artist {
  const city = one(row.cities)?.name;
  const country = one(row.countries)?.name;
  const location = row.based_in || [city, country].filter(Boolean).join(", ") || "Unknown location";
  const releases = (row.release_artists ?? [])
    .map((entry) => one(entry.releases))
    .filter((release): release is ReleaseRow => release?.status === "published")
    .map(mapRelease)
    .sort((a, b) => (b.releaseDate ?? "").localeCompare(a.releaseDate ?? "") || (a.slug ?? "").localeCompare(b.slug ?? ""));

  return {
    slug: row.slug,
    code: row.catalogue_no?.trim() || undefined,
    name: row.name,
    location,
    country,
    active: activeLabel(row),
    featured: row.featured === true,
    tags: [],
    summary: row.bio ?? row.source_note ?? "",
    bio: row.bio ?? "",
    // Publishing is an editorial decision, not evidence. The database has no verification field yet,
    // so every record stays "claimed" until one exists.
    provenance: "claimed",
    imageUrl: row.image_url ?? undefined,
    releases,
  };
}

const artistSelect = "*,cities(name),countries(name),release_artists(releases(*,labels(name),tracks(*),links(*)))";

const getPublishedArtistRows = cache(async () => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("artists")
    .select(artistSelect)
    .eq("status", "published")
    // Keep the outer joins: published artists with no published releases still belong in the archive.
    .eq("release_artists.releases.status", "published")
    .order("name")
    .abortSignal(AbortSignal.timeout(8000));
  if (error) throw new Error(`Unable to read published artists: ${error.message}`);
  return ((data ?? []) as ArtistRow[]).map(mapArtist);
});

export const getArtists = async () => getPublishedArtistRows();
export const getArtist = async (slug: string) => (await getPublishedArtistRows()).find((artist) => artist.slug === slug);
// Matches on the artist's country record (so a diaspora artist based in Singapore still counts for Sri Lanka).
const inCountry = (artist: Artist, country: string) =>
  artist.country === country || artist.location.split(",").at(-1)?.trim() === country;

export const getArtistsByCountry = async (country: string) =>
  (await getPublishedArtistRows()).filter((artist) => inCountry(artist, country));

export type CountryRecord = { slug: string; name: string; count: number };

export async function getCountries(): Promise<CountryRecord[]> {
  const supabase = createPublicClient();
  const { data: viewData, error: viewError } = await supabase.from("country_counts").select("slug,name,records").order("name");
  if (!viewError && viewData?.length) {
    return viewData.map((row) => ({ slug: row.slug, name: row.name, count: Number(row.records ?? 0) }));
  }

  const { data, error } = await supabase.from("countries").select("slug,name").order("name");
  if (error) throw new Error(`Unable to read countries: ${error.message}`);
  const artists = await getPublishedArtistRows();
  return (data ?? []).map((country) => ({
    slug: country.slug,
    name: country.name,
    count: artists.filter((artist) => inCountry(artist, country.name)).length,
  }));
}

export type LabelRecord = { slug: string; name: string; description: string };
export async function getLabels(): Promise<LabelRecord[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("labels").select("slug,name,description").eq("status", "published").order("name");
  if (error) throw new Error(`Unable to read labels: ${error.message}`);
  return data ?? [];
}

export async function getReleases() {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("releases").select("slug,title,release_date,format,cover_url,labels(name)").eq("status", "published").order("release_date", { ascending: false, nullsFirst: false });
  if (error) throw new Error(`Unable to read releases: ${error.message}`);
  return data ?? [];
}

// Editorial content remains on the local demo dataset until the stories table is populated.
export const getArticles = () => dispatches;
export const getArticle = (slug: string) => dispatches.find(d => d.slug === slug);
export const getArtistArticles = (slug: string) => dispatches.filter(d => d.mentions.includes(slug));

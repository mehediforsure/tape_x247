import type { Provenance } from "@/types/content";
export type { Provenance } from "@/types/content";

export type Release = {
  id?: string;
  slug?: string;
  title: string;
  releaseDate?: string | null;
  year: number | null;
  format: string | null;
  type: "Single" | "EP" | "Album";
  label: string | null;
  sideA: string[];
  sideB?: string[];
  extraSides?: { side: string; tracks: string[] }[]; // sides beyond A/B (e.g. C, D on a double LP)
  coverUrl?: string;
};

export type Artist = {
  slug: string;
  code?: string; // catalogue number, when documented
  name: string;
  location: string;
  country?: string; // country name from the database, used for scene/country pages
  active: string | null;
  featured?: boolean;
  tags: string[];
  summary: string;
  bio: string;
  provenance: Provenance;
  imageUrl?: string;
  releases: Release[];
};

export type Dispatch = {
  slug: string;
  title: string;
  deck: string;
  byline: string;
  filed: string;
  pull: string;
  body: string[];
  mentions: string[]; // artist slugs
  imageSrc: string;
};

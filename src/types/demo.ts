import type { Provenance } from "@/types/content";
export type { Provenance } from "@/types/content";

export type Release = {
  title: string;
  year: number;
  format: "Cassette" | "CD-R" | "Digital";
  label: string;
  sideA: string[];
  sideB?: string[];
};

export type Artist = {
  slug: string;
  code: string; // catalogue number
  name: string;
  location: string;
  active: string;
  tags: string[];
  summary: string;
  bio: string;
  provenance: Provenance;
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
  status: "draft" | "stub";
};

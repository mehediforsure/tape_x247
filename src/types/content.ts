export type EntityType = "artists" | "collectives" | "labels" | "releases" | "venues" | "events" | "platforms" | "people" | "sources";
export type Provenance = "confirmed" | "claimed" | "disputed" | "placeholder";
export type EntityReference = { type: EntityType; slug: string };
export type SourceReference = { title: string; url?: string; contributor?: string };

// Shared foundation for future records; research notes are not verified entities.
export type ArchiveRecord = {
  slug: string;
  type: EntityType;
  name: string;
  alternateNames: { name: string; language?: string; script?: string }[];
  country?: string;
  city?: string;
  tags: string[];
  provenance: Provenance;
  sources: SourceReference[];
  contributorCredits: string[];
  related: EntityReference[];
};

export const editorialFormats = ["Scene Report", "Oral History", "Spotlight", "Label Archive", "Platform Profile", "Rewind", "Dispatch", "Sessions", "Essays", "Field Index"] as const;
export type EditorialFormat = (typeof editorialFormats)[number];

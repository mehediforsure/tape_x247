import type { EntityType } from "@/types/content";

export const archiveCategories: { slug: EntityType; title: string; description: string }[] = [
  { slug: "artists", title: "Artists", description: "Artists, producers, DJs and their discographies." },
  { slug: "collectives", title: "Collectives & crews", description: "People making and organizing together." },
  { slug: "labels", title: "Labels & imprints", description: "Independent catalogues and tape imprints." },
  { slug: "releases", title: "Releases", description: "Cassettes, CD-Rs, vinyl and digital releases." },
  { slug: "venues", title: "Venues & spaces", description: "The spaces that hold a scene." },
  { slug: "events", title: "Events & series", description: "Parties, festivals and recurring gatherings." },
  { slug: "platforms", title: "Platforms", description: "Radio, distribution and DIY infrastructure." },
  { slug: "people", title: "People", description: "Writers, engineers, promoters and other contributors." },
  { slug: "sources", title: "Sources & artifacts", description: "Flyers, scans, interviews and archival evidence." },
];

// These five country groupings are present in the supplied export.
export const countries = [
  { slug: "bangladesh", name: "Bangladesh" },
  { slug: "india", name: "India" },
  { slug: "nepal", name: "Nepal" },
  { slug: "pakistan", name: "Pakistan" },
  { slug: "sri-lanka", name: "Sri Lanka" },
];

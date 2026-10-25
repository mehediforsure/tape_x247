// Placeholder content preserved from the supplied prototype.
import type { Artist, Dispatch } from "@/types/demo";

export const artists: Artist[] = [
  {
    slug: "shoumma-saha",
    code: "TX-0001",
    name: "Shoumma Saha",
    location: "Dhaka, Bangladesh",
    active: "Placeholder: 2019 to present",
    tags: ["ambient", "field recording", "modular"],
    summary: "Slow, tape-saturated pieces built from the sounds of the city.",
    bio: "Dhaka-based electronic artist working between ambient texture and field recording. Pieces are built from monsoon rain, rickshaw bells and tea-stall chatter, then layered over modular drones and run through a worn cassette deck for warmth.",
    provenance: "placeholder",
    releases: [
      {
        title: "Rain on Tin",
        year: 2022,
        format: "Cassette",
        label: "Placeholder Tapes",
        sideA: ["Monsoon Intro", "Tin Roof", "Tea Stall Loop"],
        sideB: ["Bell Study", "Low Tide", "Static Lullaby"],
      },
      {
        title: "Slow Signal",
        year: 2024,
        format: "Digital",
        label: "Self-released",
        sideA: ["Carrier", "Dial Drift", "Repeater"],
      },
    ],
  },
  {
    slug: "mehedi-h",
    code: "TX-0002",
    name: "Mehedi H.",
    location: "Dhaka, Bangladesh",
    active: "Placeholder: 2020 to present",
    tags: ["experimental", "bass", "glitch"],
    summary: "Broken-up club rhythms and low-end pressure, mixed on a budget.",
    bio: "Dhaka-based producer and audio engineer working in glitch, bass music and club-leaning experimental. Tracks lean on chopped vocals, heavy sub frequencies and deliberately crunchy low-bitrate textures.",
    provenance: "placeholder",
    releases: [
      {
        title: "Bitrate Prayer",
        year: 2023,
        format: "CD-R",
        label: "Placeholder Tapes",
        sideA: ["128 kbps", "Buffer", "Artifact Choir"],
        sideB: ["Packet Loss", "Sub Offering"],
      },
      {
        title: "Load Shedding Riddim",
        year: 2024,
        format: "Digital",
        label: "Self-released",
        sideA: ["Generator Dub", "Candle Mode", "Power Returns"],
      },
    ],
  },
];

export const dispatches: Dispatch[] = [
  {
    slug: "rooftop-tape-swap",
    title: "Four speakers, one extension cord: notes from a rooftop tape swap",
    deck: "A mock dispatch about how a small, informal crowd in Dhaka trades cassettes, CD-Rs and half-finished tracks.",
    byline: "tape_x247 desk (placeholder)",
    filed: "October 2026",
    pull: "Nobody called it a scene. They just kept bringing more tapes.",
    body: [
      "The stairwell smelled of fried onions and the roof door was held open with a brick. By the time the sun went orange, someone had run an extension cord across three floors and wired up four mismatched speakers.",
      "The rules were never written down. You bring something to trade, you play it for whoever is near, and you leave with something you did not arrive with. A dubbed C60 changed hands before the first track finished.",
      "Between sets the talk turned to formats. Cassettes are cheap to duplicate and forgiving of bad masters, which suits people who mix on laptop speakers and master at home. CD-Rs travel well in a backpack. Links die; a tape on a shelf does not.",
      "Near the end, a producer pressed a hand-labeled tape into a stranger’s palm and said only that side B was the better side. That small exchange is the kind of thing an archive should be built to hold on to.",
    ],
    mentions: ["shoumma-saha", "mehedi-h"],
    status: "draft",
  },
  {
    slug: "label-archive-stub",
    title: "Label Archive: the first ten tape imprints",
    deck: "Stub. A discography-first look at small cassette imprints.",
    byline: "TBD",
    filed: "Not filed",
    pull: "",
    body: [],
    mentions: [],
    status: "stub",
  },
  {
    slug: "oral-history-stub",
    title: "Oral History: dubbing culture before the internet",
    deck: "Stub. Interviews and transcripts about duplication and trading.",
    byline: "TBD",
    filed: "Not filed",
    pull: "",
    body: [],
    mentions: [],
    status: "stub",
  },
];

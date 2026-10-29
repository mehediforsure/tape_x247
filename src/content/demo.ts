// Placeholder content preserved from the supplied prototype.
import type { Artist, Dispatch } from "@/types/demo";

export const artists: Artist[] = [
  {
    slug: "shoummo-saha",
    code: "TX-0001",
    name: "Shoummo Saha",
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
];

export const dispatches: Dispatch[] = [
  {
    slug: "dhaka-electronic-underground-builds-its-own-room",
    title: "Dhaka’s electronic underground is building a room of its own",
    deck: "Across rooftops, studios and temporary dancefloors, a new generation is turning scattered experiments into a culture that can sustain itself.",
    byline: "tape_x247 editorial",
    filed: "October 2026",
    pull: "The scene is not waiting for a permanent venue. It is learning how to make a room wherever the music can be heard properly.",
    body: [
      "On a humid Friday night, the dancefloor is assembled rather than opened. A borrowed system arrives in pieces, cables are taped along the walls and the final soundcheck ends only minutes before the first selector begins. There is no illuminated booth and no fixed programme on the door. What holds the room together is a shared conviction that electronic music in Dhaka deserves more than an occasional novelty slot.",
      "For years, the city’s producers and DJs have worked in parallel: making tracks in bedrooms, trading unfinished mixes online and gathering wherever a sympathetic venue could be found. Those separate routes are beginning to cross. Small listening sessions now lead to club nights; a DJ set becomes an introduction to a producer; a workshop becomes a record passed from one laptop to another.",
      "The sound is deliberately difficult to reduce to a single genre. Broken percussion sits beside house, bass pressure gives way to ambient passages, and familiar pop fragments appear only long enough to be transformed. That range reflects a scene discovering its vocabulary in public rather than importing a finished identity from elsewhere.",
      "The larger challenge is infrastructure. Reliable rooms, patient sound engineers and fair artist fees matter as much as enthusiasm. Each independently organised night becomes a practical lesson in how to book, promote and care for a crowd. The work can be invisible, but it is what allows a run of isolated events to become a lasting musical ecosystem.",
      "What is forming is still fluid, and that may be its strength. Without a single gatekeeper, artists can move between live performance, DJing, visual work and self-released music. The city’s electronic underground is not waiting for permission or a perfect venue. It is building the conditions it needs, one temporary room at a time.",
    ],
    mentions: ["shoummo-saha"],
    imageSrc: "/color01.jpg",
  },
  {
    slug: "from-bedroom-sessions-to-the-booth",
    title: "From bedroom sessions to the booth: how Dhaka’s producers are finding a public",
    deck: "The distance between making a track and finding its first audience is shrinking as artists create their own platforms for live electronic music.",
    byline: "tape_x247 editorial",
    filed: "October 2026",
    pull: "A local scene becomes visible when artists can hear one another loudly, regularly and in front of a crowd.",
    body: [
      "Most electronic records begin in private: a loop tested after midnight, a field recording cut into rhythm, a bass line adjusted through headphones because the neighbours are asleep. In Dhaka, that private process has often been separated from public performance by a shortage of stages prepared for electronic music on its own terms.",
      "That gap is narrowing. Producers are carrying works in progress into intimate sessions, hybrid live sets and carefully programmed club nights. The change is more significant than a busier calendar. Hearing unfinished music through a full system reveals details that a bedroom mix can hide, while the immediate response of a crowd can redirect an arrangement before it is ever released.",
      "These nights also make collaboration easier. Visual artists meet musicians, experienced selectors share line-ups with first-time performers, and people who arrived as listeners begin asking how the music was made. A scene grows through those practical exchanges, not only through headline events.",
      "International platforms can bring valuable attention, but the long-term measure of success is local continuity: another night, another release and another artist with space to take a risk. The strongest programmes connect those scales without treating Dhaka as a temporary backdrop. They place visiting names in conversation with the people already shaping the city’s sound.",
      "For producers, the booth is becoming more than the end point of a track. It is a testing ground, a meeting place and a way to imagine an audience that did not seem reachable from the bedroom. Every well-run session makes that audience a little easier to find again.",
    ],
    mentions: [],
    imageSrc: "/color02.png",
  },
];

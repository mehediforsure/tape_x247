"use client";

import { useEffect } from "react";

type DiscoverVideo = {
  id: string;
  title: string;
  start?: number;
};

const DISCOVER_VIDEOS: DiscoverVideo[] = [
  { id: "r_niEkkh30E", title: "Boiler Room live set", start: 945 },
  { id: "Rt13UzKJ5to", title: "Boiler Room artist session" },
  { id: "yGa2Ta685ys", title: "Bedroom live electronic set" },
  { id: "cCpHiWwA2Rg", title: "Hardware and modular session" },
];

const DISCOVER_ONLY_VIDEOS: DiscoverVideo[] = [
  { id: "V6-4ZobcgTk", title: "Dhaka live electronic session" },
  { id: "s6erFwsRmpo", title: "Electronic music video" },
];

const DISCOVER_EVENTS = [
  "https://ra.co/events/2460485",
  "https://ra.co/events/2460485",
  "https://allevents.in/dhaka/all",
];

const EVENT_IMAGES = [
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=900&q=80",
];

function playerMarkup(id: string, title: string, start?: number) {
  const startQuery = start ? `&start=${start}` : "";

  return `
    <iframe
      src="https://www.youtube.com/embed/${id}?rel=0&autoplay=1${startQuery}"
      title="${title}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  `;
}

function embedMarkup(id: string, title: string, start?: number) {
  return `
    <span class="youtube-frame">
      <button class="youtube-preview" type="button" aria-label="Play ${title}">
        <img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy" />
      </button>
    </span>
    <span class="youtube-card-title">${title}</span>
  `;
}

function eventMarkup(url: string, image: string) {
  return `
    <a href="${url}" target="_blank" rel="noreferrer" class="group block no-underline hover:no-underline">
      <div class="aspect-[4/3] overflow-hidden bg-paper/[0.04] transition-opacity group-hover:opacity-80">
        <img src="${image}" alt="" loading="lazy" class="h-full w-full object-cover" />
      </div>
      <span class="font-display text-lg font-bold tracking-tight decoration-1 underline-offset-4 group-hover:underline sm:text-xl">Event update</span>
      <span class="kicker mt-2 block">View on Resident Advisor or AllEvents</span>
    </a>
  `;
}

export default function YouTubeEmbeds() {
  useEffect(() => {
    const section =
      window.location.pathname === "/discover"
        ? document.querySelector<HTMLElement>("main section")
        : document.querySelector<HTMLElement>(
            'section[aria-labelledby="discover"]',
          );
    const cards = section?.querySelector<HTMLElement>(":scope > .grid")?.children;

    if (!cards) return;

    const videos =
      window.location.pathname === "/discover"
        ? [...DISCOVER_VIDEOS, ...DISCOVER_ONLY_VIDEOS]
        : DISCOVER_VIDEOS;

    videos.forEach(({ id, title, start }, index) => {
      const card = cards[index] as HTMLElement | undefined;
      if (!card || card.dataset.embedReady === "true") return;

      card.dataset.embedReady = "true";
      card.classList.add("youtube-card");
      card.innerHTML = embedMarkup(id, title, start);
      card.querySelector<HTMLButtonElement>(".youtube-preview")?.addEventListener(
        "click",
        () => {
          const frame = card.querySelector<HTMLElement>(".youtube-frame");
          if (frame) frame.innerHTML = playerMarkup(id, title, start);
        },
        { once: true },
      );
    });

    if (window.location.pathname === "/discover") {
      const eventSection = document.querySelectorAll<HTMLElement>("main section")[1];
      const eventCards = eventSection?.querySelector<HTMLElement>(":scope > .grid")?.children;

      DISCOVER_EVENTS.forEach((url, index) => {
        const card = eventCards?.[index] as HTMLElement | undefined;
        if (card) card.innerHTML = eventMarkup(url, EVENT_IMAGES[index]);
      });

      if (eventCards) {
        Array.from(eventCards)
          .slice(DISCOVER_EVENTS.length)
          .forEach((card) => card.remove());
      }
    }
  }, []);

  return null;
}

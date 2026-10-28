"use client";

import { useEffect } from "react";

const DISCOVER_VIDEOS = [
  { id: "r_niEkkh30E", title: "Boiler Room live set", start: 945 },
  { id: "Rt13UzKJ5to", title: "Boiler Room artist session" },
  { id: "yGa2Ta685ys", title: "Bedroom live electronic set" },
  { id: "cCpHiWwA2Rg", title: "Hardware and modular session" },
];

function embedMarkup(id: string, title: string, start?: number) {
  const startQuery = start ? `&start=${start}` : "";

  return `
    <span class="youtube-frame">
      <iframe
        src="https://www.youtube.com/embed/${id}?rel=0${startQuery}"
        title="${title}"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </span>
    <span class="youtube-card-title">▶ ${title}</span>
  `;
}

export default function YouTubeEmbeds() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>(
      'section[aria-labelledby="discover"]',
    );
    const cards = section?.querySelector<HTMLElement>(":scope > .grid")?.children;

    if (!cards) return;

    DISCOVER_VIDEOS.forEach(({ id, title, start }, index) => {
      const card = cards[index] as HTMLElement | undefined;
      if (!card || card.dataset.embedReady === "true") return;

      card.dataset.embedReady = "true";
      card.classList.add("youtube-card");
      card.innerHTML = embedMarkup(id, title, start);
    });
  }, []);

  return null;
}

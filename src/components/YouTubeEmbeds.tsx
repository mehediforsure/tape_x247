"use client";

import { useState } from "react";
import { useMediaConsent } from "@/components/useMediaConsent";
import { discoverVideos } from "@/content/discover-videos";

export default function YouTubeEmbeds({ expanded = false }: { expanded?: boolean }) {
  return <>{discoverVideos.slice(0, expanded ? 6 : 4).map(video => <YouTubeVideo key={video.id} {...video} />)}</>;
}

function YouTubeVideo({ id, title, start }: { id: string; title: string; start?: number }) {
  const consent = useMediaConsent();
  const [playing, setPlaying] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const watchUrl = `https://www.youtube.com/watch?v=${id}${start ? `&t=${start}` : ""}`;
  return <div className="youtube-card border border-rule">
    <div className="youtube-frame relative">
      {consent && playing ? <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1${start ? `&start=${start}` : ""}`}
        title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
      /> : <button type="button" className="youtube-preview relative" aria-label={consent ? `Play ${title}` : `Enable media to play ${title}`} onClick={() => {
        if (consent) setPlaying(true);
        else window.dispatchEvent(new Event("tape:open-media-preferences"));
      }}>
        {consent && !imageFailed ? <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" onError={() => setImageFailed(true)} /> : null}
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/20 p-1 text-white">
          <span aria-hidden="true">&#9654;</span>
          {!consent ? <span className="text-[10px] sm:text-xs">Enable media</span> : null}
        </span>
      </button>}
    </div>
    {consent && playing ? <a href={watchUrl} target="_blank" rel="noreferrer" className="block p-2 text-xs">Playback trouble? Watch on YouTube &#8599;</a> : null}
  </div>;
}

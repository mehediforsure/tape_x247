"use client";
import { useMediaConsent } from "@/components/useMediaConsent";
export default function DiscoverEventImage({ src }: { src: string }) {
  const allowed = useMediaConsent();
  return <div className="aspect-[4/3] overflow-hidden bg-paper/[0.04]">{allowed ? <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" /> : <span className="sr-only">Enable media cookies to view</span>}</div>;
}

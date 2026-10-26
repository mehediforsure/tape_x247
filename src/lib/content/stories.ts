import type { Story } from "@/components/Stories";
import { editorialFormats } from "@/types/content";
import type { Dispatch } from "@/types/demo";

// Uses the format named before the colon in a title ("Oral History: ...").
// Anything without one is treated as a plain Dispatch.
export function kickerFor(d: Dispatch): string {
  const prefix = d.title.split(":")[0]?.trim();
  return editorialFormats.find(f => f === prefix) ?? "Dispatch";
}

export function toStory(d: Dispatch): Story {
  return {
    href: `/editorial/${d.slug}`,
    kicker: kickerFor(d),
    date: d.filed === "Not filed" ? undefined : d.filed,
    title: d.title,
    deck: d.deck,
    byline: d.byline,
    status: d.status,
    seed: d.slug,
  };
}

import YouTubeEmbeds from "@/components/YouTubeEmbeds";
import DiscoverEventImage from "@/components/DiscoverEventImage";
import { discoverEvents } from "@/content/discover-events";

export const metadata = { title: "Discover | tape_x247" };

// Re-fetch from Supabase at most once a minute (otherwise the build-time snapshot is served forever).
export const revalidate = 60;

const eventImages = [
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=900&q=80",
];

export default function ScenesPage() {
  return (
    <div className="wrap py-10">
      <h1 className="page-title">Discover</h1>
      <p className="mt-4 max-w-prose text-lg text-muted">
        Starting points for exploring South Asian electronic music.
      </p>
      <section className="mt-10">
        <h2 className="kicker">YouTube records</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><YouTubeEmbeds expanded /></div>
      </section>
      <section className="mt-14">
        <h2 className="kicker">Event updates</h2>
        <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {discoverEvents.map((event, index) => (
            <li key={`${event.href}-${index}`} className="border border-rule p-5">
              <a href={event.href} target="_blank" rel="noreferrer" aria-label="View event listing" className="block no-underline hover:no-underline">
                <DiscoverEventImage src={eventImages[index % eventImages.length]} />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

import { getArticles } from "@/lib/content/queries";
import { toStory } from "@/lib/content/stories";
import { FeedRow } from "@/components/Stories";

export const metadata = { title: "Editorial | tape_x247" };

const editorialReferences = [
  {
    source: "The Daily Star",
    title: "‘Notun Shobdo’: Opening the doors to electronic music",
    href: "https://www.thedailystar.net/culture/entertainment/news/notun-shobdo-opening-the-doors-electronic-music-4213206",
    imageSrc: "https://www.thedailystar.net/sites/default/files/styles/social_share/public/2026-07/IMG_2257.JPG",
  },
  {
    source: "Resident Advisor",
    title: "Upcoming electronic music events in Bangladesh",
    href: "https://ra.co/events/bd/all",
    imageSrc: "/color01.jpg",
  },
  {
    source: "Mixmag Asia",
    title: "The Mixmag Lab debuts in Dhaka",
    href: "https://mixmag.asia/read/the-mixmag-lab-dhaka-bangladesh-debut-be-here-now-bhai-bhai-productions-june-13-events",
    imageSrc: "https://mixmag.asia/assets/uploads/images/_facebook/lab-dhaka-kead-image-2025.jpg",
  },
];

export default function MagazinePage() {
  const stories = getArticles().map(toStory);
  return (
    <div className="wrap py-10">
      <h1 className="page-title">Editorial</h1>
      <p className="mt-4 max-w-prose text-lg text-muted">
        Features, interviews, histories and experiments in listening.
      </p>

      <ul className="mt-10 border-b border-rule">
        {stories.map((s) => (
          <FeedRow key={s.href} s={s} />
        ))}
      </ul>

      <section aria-labelledby="editorial-references" className="mt-16 border-t border-rule pt-8">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <h2 id="editorial-references" className="headline-md">Read around the scene</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {editorialReferences.map((reference) => (
            <a
              key={reference.href}
              href={reference.href}
              target="_blank"
              rel="noreferrer"
              className="group flex min-h-44 flex-col justify-between border border-rule p-2 no-underline transition-colors hover:bg-paper/[0.04] hover:no-underline sm:p-3"
            >
              <div className="aspect-[4/3] overflow-hidden bg-paper/[0.04]">
                <img src={reference.imageSrc} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
              </div>
              <div className="flex flex-1 flex-col justify-between gap-5 p-3 sm:p-2">
              <p className="kicker">{reference.source}</p>
              <h3 className="story-title text-xl leading-tight decoration-1 underline-offset-4 group-hover:underline">
                {reference.title}
              </h3>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

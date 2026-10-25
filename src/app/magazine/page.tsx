import { getArticles } from "@/lib/content/queries";
import { toStory } from "@/lib/content/stories";
import { FeedRow } from "@/components/Stories";
import { editorialFormats } from "@/types/content";

export const metadata = { title: "Magazine | tape_x247" };

export default function MagazinePage() {
  const stories = getArticles().map(toStory);
  return (
    <div className="wrap py-10">
      <h1 className="page-title">Magazine</h1>
      <p className="mt-4 max-w-prose text-lg text-muted">
        Dispatches, interviews, histories and experiments in listening.
      </p>

      <p className="kicker mt-6" aria-label="Planned editorial formats">
        Planned formats: {editorialFormats.join(" / ")}
      </p>

      <ul className="mt-10 border-b border-rule">
        {stories.map((s) => (
          <FeedRow key={s.href} s={s} />
        ))}
      </ul>
    </div>
  );
}

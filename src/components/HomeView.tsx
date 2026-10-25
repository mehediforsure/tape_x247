import Link from "next/link";
import { LeadStory, SideStory, FeedRow, type Story } from "@/components/Stories";

export type Scene = { name: string; slug: string; count?: number };

export default function HomeView({
  lead,
  side,
  latest,
  scenes,
}: {
  lead: Story;
  side: Story[];
  latest: Story[];
  scenes: Scene[];
}) {
  return (
    <div className="wrap py-10">
      <section
        aria-label="Top stories"
        className="grid gap-10 lg:grid-cols-[7fr_5fr] lg:gap-12"
      >
        <LeadStory s={lead} />
        {side.length > 0 && (
          <div>
            <h2 className="kicker mb-4">More stories</h2>
            {side.map((s) => (
              <SideStory key={s.href} s={s} />
            ))}
          </div>
        )}
      </section>

      {latest.length > 0 && (
        <section aria-label="Latest" className="mt-16">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="headline-md">Latest</h2>
            <Link href="/magazine" className="kicker">
              See all →
            </Link>
          </div>
          <ul className="border-b border-rule">
            {latest.map((s) => (
              <FeedRow key={s.href} s={s} />
            ))}
          </ul>
        </section>
      )}

      <section aria-label="Scenes" className="mt-16">
        <h2 className="headline-md mb-4">Scenes</h2>
        <ul className="border-b border-rule">
          {scenes.map((c) => (
            <li key={c.slug} className="rule-t">
              <Link
                href={`/scenes/${c.slug}`}
                className="flex items-baseline justify-between py-3 no-underline hover:no-underline"
              >
                <span className="font-display text-3xl font-bold tracking-tight decoration-1 underline-offset-4 hover:underline sm:text-5xl">
                  {c.name}
                </span>
                {typeof c.count === "number" && (
                  <span className="kicker">
                    {String(c.count).padStart(2, "0")} records
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

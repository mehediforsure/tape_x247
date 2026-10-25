import Link from "next/link";
import CoverArt from "@/components/CoverArt";
import { SideStory } from "@/components/Stories";
import { getArtists, getArticles } from "@/lib/content/queries";
import { kickerFor, toStory } from "@/lib/content/stories";
import type { Dispatch } from "@/types/demo";

export default function Article({ lead }: { lead: Dispatch }) {
  const rest = getArticles().filter(d => d.slug !== lead.slug).map(toStory);
  const mentioned = getArtists().filter(a => lead.mentions.includes(a.slug));
  const kicker = kickerFor(lead);

  return (
    <article className="wrap py-10">
      <Link href="/magazine" className="kicker">← Magazine</Link>

      <header className="mt-6 max-w-4xl space-y-4">
        <p className="kicker">
          <b>{kicker}</b>
          {lead.filed !== "Not filed" ? ` · ${lead.filed}` : ""}{" "}
          <span className="stamp ml-1">{lead.status}</span>
        </p>
        <h1 className="page-title">{lead.title}</h1>
        <p className="max-w-2xl text-xl text-muted">{lead.deck}</p>
        <p className="kicker">By {lead.byline}</p>
        <p className="text-sm text-muted">Placeholder article for layout testing.</p>
      </header>

      <CoverArt seed={lead.slug} label={kicker} className="mt-8 aspect-[16/7] w-full" />

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_20rem]">
        <div className="prose-body max-w-prose">
          {lead.body.length === 0 && (
            <p>This article is a planning stub. No story has been published yet.</p>
          )}
          {lead.body.slice(0, 2).map((text) => <p key={text}>{text}</p>)}
          {lead.pull && (
            <blockquote className="border-l border-paper py-1 pl-5 font-display text-2xl font-semibold leading-snug">
              {lead.pull}
            </blockquote>
          )}
          {lead.body.slice(2).map((text) => <p key={text}>{text}</p>)}
        </div>

        <aside className="space-y-10">
          {mentioned.length > 0 && (
            <section>
              <h2 className="kicker mb-3">In this piece</h2>
              <ul className="border-b border-rule">
                {mentioned.map((a) => (
                  <li key={a.slug} className="rule-t py-3">
                    <Link href={`/archive/artists/${a.slug}`}>{a.name}</Link>
                    <span className="mt-1 block text-sm text-muted">{a.summary}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {rest.length > 0 && (
            <section>
              <h2 className="kicker mb-3">More stories</h2>
              {rest.map((s) => <SideStory key={s.href} s={s} />)}
            </section>
          )}
        </aside>
      </div>
    </article>
  );
}

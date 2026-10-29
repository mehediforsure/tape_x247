import Link from "next/link";
import CoverArt from "@/components/CoverArt";
import { SideStory } from "@/components/Stories";
import { getArtists, getArticles } from "@/lib/content/queries";
import { kickerFor, toStory } from "@/lib/content/stories";
import type { Artist, Dispatch } from "@/types/demo";

export default async function Article({ lead }: { lead: Dispatch }) {
  const rest = getArticles().filter(d => d.slug !== lead.slug).map(toStory);
  let mentioned: Artist[] = [];
  let archiveUnavailable = false;
  if (lead.mentions.length > 0) {
    try {
      mentioned = (await getArtists()).filter(a => lead.mentions.includes(a.slug));
    } catch (error) {
      console.error("[article] Related artists are unavailable:", error);
      archiveUnavailable = true;
    }
  }
  const kicker = kickerFor(lead);

  return (
    <article className="wrap article-page py-10">
      <Link href="/editorial" className="kicker">← Editorial</Link>

      <header className="editorial-header space-y-4">
        <p className="kicker">
          {kicker ? <span className="editorial-category">{kicker}</span> : null}
          {kicker && lead.filed !== "Not filed" ? " · " : null}
          {lead.filed !== "Not filed" ? lead.filed : null}
        </p>
        <h1 className="page-title">{lead.title}</h1>
        <p className="editorial-deck text-muted">{lead.deck}</p>
        <p className="editorial-byline">By {lead.byline}</p>
      </header>

      <CoverArt seed={lead.slug} label={kicker} imageSrc={lead.imageSrc} className="mt-8 aspect-[16/7] w-full" />

      <div className="editorial-layout">
        <div className="prose-body editorial-body">
          {lead.body.length === 0 && (
            <p>This article is a planning stub. No story has been published yet.</p>
          )}
          {lead.body.slice(0, 2).map((text) => <p key={text} lang={/[\u0980-\u09ff]/.test(text) ? "bn" : undefined}>{text}</p>)}
          {lead.pull && (
            <blockquote className="editorial-pull">
              {lead.pull}
            </blockquote>
          )}
          {lead.body.slice(2).map((text) => <p key={text} lang={/[\u0980-\u09ff]/.test(text) ? "bn" : undefined}>{text}</p>)}
        </div>

        <aside className="editorial-sidebar">
          {archiveUnavailable && <p className="text-sm text-muted">Related artist records are temporarily unavailable.</p>}
          {mentioned.length > 0 && (
            <section>
              <h2 className="kicker mb-3">In this piece</h2>
              <ul className="border-b border-rule">
                {mentioned.map((a) => (
                  <li key={a.slug} className="rule-t py-3">
                    <Link href={`/featured/artists/${a.slug}`}>{a.name}</Link>
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

import Link from "next/link";
import CoverArt from "@/components/CoverArt";

export type Story = {
  href: string;
  kicker: string;
  date?: string;
  title: string;
  deck?: string;
  byline?: string;
  status?: string;
  seed: string;
};

function Kicker({ s }: { s: Story }) {
  return (
    <p className="kicker">
      <b>{s.kicker}</b>
      {s.date ? ` · ${s.date}` : ""}
      {s.status ? (
        <>
          {" "}
          <span className="stamp ml-1">{s.status}</span>
        </>
      ) : null}
    </p>
  );
}

export function LeadStory({ s, imageSrc }: { s: Story; imageSrc?: string }) {
  return (
    <article>
      <Link href={s.href} className="block no-underline hover:no-underline">
        <CoverArt seed={s.seed} label={s.kicker} imageSrc={imageSrc} className="aspect-[4/3] w-full" />
        <div className="mt-4 space-y-3">
          <Kicker s={s} />
          <h1 className="headline-xl hover:underline decoration-1 underline-offset-4">
            {s.title}
          </h1>
          {s.deck && <p className="max-w-xl text-lg text-muted">{s.deck}</p>}
          {s.byline && <p className="kicker">By {s.byline}</p>}
        </div>
      </Link>
    </article>
  );
}

export function SideStory({ s }: { s: Story }) {
  return (
    <article className="rule-t py-4 first:border-t-0 first:pt-0">
      <Link
        href={s.href}
        className="grid grid-cols-[6rem_1fr] gap-4 no-underline hover:no-underline"
      >
        <CoverArt seed={s.seed} className="aspect-square w-full" />
        <div className="space-y-1.5">
          <Kicker s={s} />
          <h3 className="headline-md hover:underline decoration-1 underline-offset-4">
            {s.title}
          </h3>
        </div>
      </Link>
    </article>
  );
}

export function FeedRow({ s }: { s: Story }) {
  return (
    <li className="rule-t">
      <Link
        href={s.href}
        className="grid grid-cols-[4.5rem_1fr] gap-4 py-4 no-underline hover:no-underline sm:grid-cols-[6rem_1fr]"
      >
        <CoverArt seed={s.seed} className="aspect-square w-full" />
        <div className="space-y-1.5">
          <Kicker s={s} />
          <h3 className="headline-md hover:underline decoration-1 underline-offset-4">
            {s.title}
          </h3>
          {s.deck && <p className="hidden max-w-xl text-muted sm:block">{s.deck}</p>}
        </div>
      </Link>
    </li>
  );
}

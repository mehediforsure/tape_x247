import { SITE, mailto } from "@/lib/site";

export const metadata = { title: "About | tape_x247", description: SITE.description };

export default function AboutPage() {
  return (
    <article className="wrap py-10">
      <h1 className="page-title">Things get lost.</h1>
      <div className="prose-body mt-8 max-w-prose text-lg">
        <p>We are trying to build a home for the underground electronic music artists across South Asia.</p>
        <p>A space where these artists can share their stories, music, and experiences.</p>
        <p>
          Also, things get lost. We want to preserve the history of these artists and their work.
          Making money is not the goal.
        </p>
        <p>
          tape_x247 is a community-driven, non-profit project, and we are looking for volunteers to help build it.
          If you would like to contribute, please reach out. A home.
        </p>
        <p className="text-muted">
          Get featured on tape_x247. Reach out to us at{" "}
          <a href={mailto()} className="break-all">{SITE.contactEmail}</a>
        </p>
      </div>
    </article>
  );
}

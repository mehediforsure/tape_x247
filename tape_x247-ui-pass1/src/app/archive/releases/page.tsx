import Crumb from "@/components/Crumb";
import Link from "next/link";
import CoverArt from "@/components/CoverArt";
import { getReleases } from "@/lib/content/queries";

export const metadata = { title: "Releases | tape_x247" };
export const revalidate = 60;

export default async function ReleasesPage() {
  const releases = await getReleases();
  return (
    <div className="wrap py-10">
      <Crumb trail={[{ href: "/featured", label: "Featured" }]} />
      <h1 className="page-title mt-6">Releases</h1>
      <p className="kicker mt-6">{releases.length} records</p>
      {releases.length === 0 ? <p className="mt-8 text-muted">No published releases yet.</p> : (
        <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {releases.map(release => {
            const label = Array.isArray(release.labels) ? release.labels[0] : release.labels;
            return <li key={release.slug}><CoverArt seed={release.slug} imageSrc={release.cover_url ?? undefined} className="aspect-square w-full" /><h2 className="headline-md mt-4">{release.title}</h2><p className="mt-2 text-sm text-muted">{[release.release_date?.slice(0, 4), release.format, label?.name].filter(Boolean).join(" · ")}</p></li>;
          })}
        </ul>
      )}
    </div>
  );
}

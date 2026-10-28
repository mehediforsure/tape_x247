import Link from "next/link";
import CoverArt from "@/components/CoverArt";
import { getReleases } from "@/lib/content/queries";

export const metadata = { title: "Releases | tape_x247" };
export const revalidate = 60;

export default async function ReleasesPage() {
  const releases = await getReleases();
  return (
    <div className="wrap py-10">
      <Link href="/featured" className="kicker">← Featured</Link>
      <h1 className="page-title mt-6">Releases</h1>
      <p className="kicker mt-6">{releases.length} records</p>
      {releases.length === 0 ? <p className="mt-8 text-muted">No published releases yet.</p> : (
        <><div className="index-head mt-8" aria-hidden="true"><span>No.</span><span>Release</span><span className="index-meta">Year / Format / Label</span><span aria-hidden="true">&#8599;</span></div><ul className="index-list">
          {releases.map((release, index) => {
            const label = Array.isArray(release.labels) ? release.labels[0] : release.labels;
            return <li key={release.slug} className="index-row"><span className="index-number">{String(index + 1).padStart(2, "0")}</span><div className="index-identity"><CoverArt seed={release.slug} imageSrc={release.cover_url ?? undefined} className="aspect-square" /><h2 className="index-title">{release.title}</h2></div><p className="index-meta">&#9679; {[release.release_date?.slice(0, 4), release.format, label?.name].filter(Boolean).join(" / ") || "Not documented"}</p><span className="index-arrow" aria-hidden="true">&#8599;</span></li>;
          })}
        </ul></>
      )}
    </div>
  );
}

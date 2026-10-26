import Link from "next/link";
import { getLabels } from "@/lib/content/queries";

export const metadata = { title: "Labels | tape_x247" };
export const revalidate = 60;

export default async function LabelsPage() {
  const labels = await getLabels();
  return (
    <div className="wrap py-10">
      <Link href="/featured" className="kicker">← Featured</Link>
      <h1 className="page-title mt-6">Labels &amp; imprints</h1>
      <p className="kicker mt-6">{labels.length} records</p>
      {labels.length === 0 ? <p className="mt-8 text-muted">No published labels yet.</p> : (
        <ul className="mt-8 border-b border-rule">
          {labels.map(label => <li key={label.slug} className="rule-t py-6"><h2 className="headline-md">{label.name}</h2>{label.description ? <p className="mt-3 max-w-prose text-muted">{label.description}</p> : null}</li>)}
        </ul>
      )}
    </div>
  );
}

import Link from "next/link";
import { archiveCategories } from "@/content/taxonomy";
import type { EntityType } from "@/types/content";

export default function CategoryPage({ category }: { category: EntityType }) {
  const item = archiveCategories.find(c => c.slug === category)!;
  return (
    <div className="wrap py-10">
      <Link href="/featured" className="kicker">← Featured</Link>
      <h1 className="page-title mt-6">{item.title}</h1>
      <p className="mt-4 max-w-prose text-lg text-muted">{item.description}</p>
      <div className="rule-t rule-b mt-10 py-8">
        <h2 className="headline-md">This collection is in development.</h2>
        <p className="mt-2 max-w-prose text-muted">We’re gathering records for this section. In the meantime, explore the artists and releases already in the collection.</p>
        <div className="mt-6 flex flex-wrap gap-5"><Link href="/featured/artists">Explore artists →</Link><Link href="/featured/releases">Browse releases →</Link><a href={`mailto:info@tape_x247.com?subject=${encodeURIComponent(`Submission: ${item.title}`)}`}>Submit a lead →</a></div>
      </div>
    </div>
  );
}

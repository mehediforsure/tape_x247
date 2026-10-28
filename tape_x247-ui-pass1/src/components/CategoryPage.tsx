import Crumb from "@/components/Crumb";
import Link from "next/link";
import { archiveCategories } from "@/content/taxonomy";
import type { EntityType } from "@/types/content";

export default function CategoryPage({ category }: { category: EntityType }) {
  const item = archiveCategories.find(c => c.slug === category)!;
  return (
    <div className="wrap py-10">
      <Crumb trail={[{ href: "/featured", label: "Featured" }]} />
      <h1 className="page-title mt-6">{item.title}</h1>
      <p className="mt-4 max-w-prose text-lg text-muted">{item.description}</p>
      <div className="rule-t rule-b mt-10 py-8">
        <h2 className="headline-md">The collection starts here.</h2>
        <p className="mt-2 text-muted">No records have been added to this section yet.</p>
      </div>
    </div>
  );
}

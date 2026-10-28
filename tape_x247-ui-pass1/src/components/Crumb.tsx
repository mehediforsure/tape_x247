import Link from "next/link";

export type CrumbItem = { href: string; label: string };

// Text breadcrumb ("Featured / Artists"). Replaces the arrow-style back links.
export default function Crumb({ trail }: { trail: CrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="kicker flex flex-wrap items-center gap-x-2">
      {trail.map((item, i) => (
        <span key={item.href} className="flex items-center gap-x-2">
          {i > 0 ? <span aria-hidden="true">/</span> : null}
          <Link href={item.href} className="inline-block py-1.5 no-underline hover:text-paper hover:underline">
            {item.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}

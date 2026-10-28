"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/featured", label: "Featured" },
  { href: "/editorial", label: "Editorial" },
  { href: "/discover", label: "Discover" },
  { href: "/learn", label: "Learn" },
  { href: "/about", label: "About" },
];

export default function NavLinks() {
  const pathname = usePathname() ?? "/";
  return (
    <nav aria-label="Main navigation">
      {/* Spread across the full row on phones; py-2.5 gives a ~40px tap target. */}
      <ul className="flex items-center justify-between text-sm sm:justify-start sm:gap-x-6">
        {LINKS.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "inline-block py-2.5 text-paper underline decoration-paper underline-offset-[8px]"
                    : "inline-block py-2.5 text-muted no-underline hover:text-paper hover:no-underline"
                }
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

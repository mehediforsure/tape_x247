"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/archive", label: "Archive" },
  { href: "/magazine", label: "Magazine" },
  { href: "/scenes", label: "Scenes" },
  { href: "/learn", label: "Learn" },
  { href: "/about", label: "About" },
];

export default function NavLinks() {
  const pathname = usePathname() ?? "/";
  return (
    <nav aria-label="Main navigation">
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
        {LINKS.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "text-paper underline decoration-paper underline-offset-[6px]"
                    : "text-muted no-underline hover:text-paper hover:no-underline"
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

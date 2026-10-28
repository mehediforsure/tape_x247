import Link from "next/link";
import { mailto } from "@/lib/site";

const LINKS = [
  { href: "/featured", label: "Featured" },
  { href: "/editorial", label: "Editorial" },
  { href: "/discover", label: "Discover" },
  { href: "/learn", label: "Learn" },
  { href: "/about", label: "About" },
];

export default function Footer() {
  return (
    <footer className="mt-24 rule-t">
      <div className="wrap flex flex-col gap-8 py-10 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <img src="/logos-fonts/footer%20logo.png" alt="" aria-hidden="true" width={40} height={40} className="h-10 w-10 object-contain" />
            <img src="/logos-fonts/line%2001%20-%20Copy.png" alt="tape_x247" width={123} height={49} className="h-auto w-[123px]" />
          </div>
          <p className="kicker mt-2 whitespace-nowrap tracking-[0.2em]">records on 24/7</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-block py-2 text-muted no-underline hover:text-paper hover:no-underline">{l.label}</Link>
              </li>
            ))}
            <li>
              <a href={mailto("Hello tape_x247")} className="inline-block py-2 text-muted no-underline hover:text-paper hover:no-underline">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

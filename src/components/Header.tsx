import Link from "next/link";
import NavLinks from "@/components/NavLinks";

export default function Header() {
  return (
    <header className="rule-b">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4">
        <Link
          href="/"
          aria-label="tape_x247 home"
          className="flex items-center gap-2.5 no-underline hover:no-underline"
        >
          <svg
            width="26"
            height="18"
            viewBox="0 0 26 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            aria-hidden="true"
          >
            <rect x="0.6" y="0.6" width="24.8" height="16.8" rx="1.5" />
            <circle cx="8" cy="8" r="2.6" />
            <circle cx="18" cy="8" r="2.6" />
            <path d="M6 14h14" />
          </svg>
          <span className="font-display text-lg font-semibold tracking-tight">
            tape_x247
          </span>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}

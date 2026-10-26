import Image from "next/image";
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
          <Image
            src="/logos-fonts/main%20logo.png"
            alt="tape_x247"
            width={80}
            height={80}
            priority
            className="h-20 w-20 object-contain"
          />
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}

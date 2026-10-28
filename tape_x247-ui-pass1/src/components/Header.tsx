import Image from "next/image";
import Link from "next/link";
import NavLinks from "@/components/NavLinks";

export default function Header() {
  return (
    <header className="rule-b">
      <div className="wrap flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-x-6 sm:py-4">
        <Link
          href="/"
          aria-label="tape_x247 home"
          className="flex w-fit items-center no-underline hover:no-underline"
        >
          <Image
            src="/logos-fonts/main%20logo.png"
            alt="tape_x247"
            width={80}
            height={80}
            priority
            className="h-12 w-12 object-contain sm:h-20 sm:w-20"
          />
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 rule-t">
      <div className="wrap grid gap-6 py-8 text-sm sm:grid-cols-[1fr_auto] sm:items-start">
        <p className="max-w-xl text-muted">

        </p>
        {/* <ul className="flex flex-wrap gap-x-5 gap-y-1">
          <li><Link href="/featured">Featured</Link></li>
          <li><Link href="/editorial">Editorial</Link></li>
          <li><Link href="/about">About</Link></li>
        </ul> */}
      </div>
      <p className="kicker wrap pb-8">tape_x247 · records on 24/7</p>
    </footer>
  );
}

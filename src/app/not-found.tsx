import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap py-16">
      <p className="kicker">404</p>
      <h1 className="page-title mt-2">Record not found.</h1>
      <p className="mt-6">
        <Link href="/archive">Explore the archive</Link>
      </p>
    </div>
  );
}

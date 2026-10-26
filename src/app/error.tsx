"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function ErrorPage({ reset }: { reset: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function retry() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <section className="wrap py-16" aria-labelledby="page-error">
      <h1 id="page-error" className="page-title">This page is temporarily unavailable.</h1>
      <p className="mt-6 max-w-prose text-muted">Please try again in a moment. You can still explore the editorial archive.</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <button type="button" onClick={retry} disabled={pending} className="btn disabled:opacity-50">
          {pending ? "Trying again…" : "Try again"}
        </button>
        <Link href="/editorial" className="btn">Read the stories</Link>
      </div>
    </section>
  );
}

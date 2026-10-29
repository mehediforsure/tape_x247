export const metadata = {
  title: "Learn | tape_x247",
  description: "Explore timing, envelopes, signal flow and clip launching with the interactive Live Field Guide.",
};

export default function LearnPage() {
  return (
    <div>
      <div className="wrap flex flex-wrap items-center justify-between gap-4 py-6">
        <h1 className="page-title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>Learn</h1>
        <a className="underline underline-offset-4" href="/live-field-guide/index.html">
          Open full page ↗
        </a>
      </div>
      <section className="wrap">
        <iframe
          title="Live Field Guide — interactive music lessons"
          src="/live-field-guide/index.html"
          className="block h-[75dvh] min-h-[600px] w-full border-0"
        />
      </section>
        <section className="wrap mt-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker">Studio visit</p>
              <h2 className="mt-2 text-2xl font-medium">Roland 50 Studio</h2>
            </div>
            <a className="underline underline-offset-4" href="https://roland50.studio/" target="_blank" rel="noreferrer">Open full page ↗</a>
          </div>
          <iframe
            title="Roland 50 Studio"
            src="https://roland50.studio/"
            loading="eager"
            allow="autoplay; fullscreen; cross-origin-isolated"
            allowFullScreen
            className="block h-[75dvh] min-h-[600px] w-full border-0"
          />
          <p className="mt-3 text-sm text-muted">
            If the embedded studio does not load, <a className="underline underline-offset-4" href="https://roland50.studio/" target="_blank" rel="noreferrer">open Roland 50 Studio directly ↗</a>.
          </p>
        </section>
    </div>
  );
}

export const metadata = {
  title: "Learn | tape_x247",
  description: "Explore timing, envelopes, signal flow and clip launching with the interactive Live Field Guide.",
};

export default function LearnPage() {
  return (
    <div>
      <div className="wrap flex flex-wrap items-center justify-between gap-4 py-6">
        <h1 className="page-title">Learn</h1>
        <a className="underline underline-offset-4" href="/live-field-guide/index.html">
          Open Live Field Guide full page ↗
        </a>
      </div>
      <iframe
        title="Live Field Guide — interactive music lessons"
        src="/live-field-guide/index.html"
        className="block w-full border-0"
        style={{ height: "100dvh", minHeight: "600px" }}
      />
    </div>
  );
}

export const metadata = { title: "About | tape_x247" };

export default function AboutPage() {
  return (
    <article className="wrap py-14 md:py-20">
      <p className="mb-5 font-mono text-xs uppercase tracking-[0.22em] text-[#f1a34b]">About the archive</p>
      <h1 className="page-title max-w-4xl">Things get <span className="text-[#f1a34b]">lost.</span></h1>
      <div className="mt-12 max-w-[46rem] md:mt-16">
        <p className="text-xl leading-[1.55] text-white md:text-2xl md:leading-[1.5]">
          tape_x247 is building a living archive for underground electronic music across South Asia.
        </p>
        <p className="mt-10 max-w-[42rem] text-lg leading-[1.7] text-[#c8c8c8] md:mt-12">
          A place for artists to share their music, stories, and experiences—and for listeners to discover the people and communities shaping the scene.
        </p>
        <p className="mt-10 max-w-[42rem] text-lg leading-[1.7] text-white md:mt-12">
          Things disappear: releases, flyers, photographs, conversations, and the histories held between them. We want to document and preserve that work before it is lost. Profit is not the point.
        </p>
        <p className="mt-10 max-w-[42rem] border-l border-[#f1a34b] pl-6 text-lg leading-[1.7] text-[#c8c8c8] md:mt-12 md:pl-8">
          tape_x247 is community-driven and non-profit. We welcome artists, writers, photographers, researchers, and volunteers who want to help the archive grow.
        </p>
        <p className="mt-14 text-sm uppercase tracking-[0.08em] text-muted md:mt-16">
          Get featured or contribute. Write to <a className="text-[#f1a34b]" href="mailto:info@tape_x247.com">info@tape_x247.com</a>
        </p>

        <div className="mt-8 border-t border-rule pt-6">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Follow / connect
          </p>
          <div className="flex flex-wrap gap-3" aria-label="Social links coming soon">
            {[
              {
                label: "Instagram",
                path: "M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
              },
              {
                label: "YouTube",
                path: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z",
              },
              {
                label: "Bluesky",
                path: "M5.2 3.1C7.9 5.1 10.8 9 12 11.5c1.2-2.5 4.1-6.4 6.8-8.4 2-1.5 5.2-2.6 5.2 1 0 .7-.4 5.7-.7 6.5-1 3.5-4.4 4.4-7.5 3.8 5.4.9 6.8 3.9 3.8 6.9-5.6 5.8-8-1.4-8.6-3.2-.1-.4-.2-.6-.3-.6s-.2.2-.3.6c-.6 1.8-3 9-8.6 3.2-3-3-1.6-6 3.8-6.9-3.1.6-6.5-.3-7.5-3.8C.4 9.8 0 4.8 0 4.1c0-3.6 3.2-2.5 5.2-1Z",
              },
              {
                label: "Discord",
                path: "M19.5 5.3A16.3 16.3 0 0 0 15.4 4l-.5 1a15.4 15.4 0 0 0-5.8 0l-.5-1a16.3 16.3 0 0 0-4.1 1.3C1.9 9.2 1.2 13 1.5 16.8a16.6 16.6 0 0 0 5 2.5l1.2-1.7a10.5 10.5 0 0 1-1.9-.9l.5-.4a11.7 11.7 0 0 0 11.4 0l.5.4a10.5 10.5 0 0 1-1.9.9l1.2 1.7a16.6 16.6 0 0 0 5-2.5c.4-4.4-.7-8.1-3-11.5ZM8.4 14.5c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm7.2 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z",
              },
            ].map(({ label, path }) => (
              <span
                key={label}
                aria-disabled="true"
                aria-label={`${label} — coming soon`}
                className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-rule text-[#c8c8c8] transition-colors hover:border-[#f1a34b] hover:text-[#f1a34b]"
                role="link"
                title={`${label} — coming soon`}
              >
                <svg aria-hidden="true" className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d={path} />
                </svg>
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

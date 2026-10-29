import { discoverEvents } from "@/content/discover-events";

export const metadata = { title: "Discover | tape_x247" };

// Re-fetch from Supabase at most once a minute (otherwise the build-time snapshot is served forever).
export const revalidate = 60;

const videoRecords = [
  {
    title: "Boiler Room live electronic set",
    detail: "Live performance · start at 15:45",
    href: "https://youtu.be/r_niEkkh30E?si=N-xSPv_1gffg_8i2&t=945",
  },
  { title: "Boiler Room artist session", detail: "YouTube embed placeholder" },
  { title: "Bedroom live electronic set", detail: "YouTube embed placeholder" },
  { title: "Hardware and modular session", detail: "YouTube embed placeholder" },
  { title: "Ambient live performance", detail: "YouTube embed placeholder" },
  { title: "South Asian electronic artist set", detail: "YouTube embed placeholder" },
];



export default function ScenesPage() {
  return (
    <div className="wrap py-10">
      <h1 className="page-title">Discover</h1>
      <p className="mt-4 max-w-prose text-lg text-muted">
        Starting points for exploring South Asian electronic music.
      </p>
      <section className="mt-10">
        <h2 className="kicker">YouTube records</h2>
        <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videoRecords.map((record) => (
            <li key={record.title} className="border border-rule p-5">
              <a aria-label={`Watch ${record.title}`} href={record.href} target="_blank" rel="noreferrer" className="group block no-underline hover:no-underline">
                <div className="flex aspect-video items-center justify-center bg-paper/[0.04] transition-colors group-hover:bg-paper/[0.08]">
                  <div className="text-center">
                    <div className="font-display text-4xl">▶</div>
                  </div>
                </div>

              </a>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-14">
        <h2 className="kicker">Event updates</h2>
        <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {discoverEvents.map((event, index) => (
            <li key={`${event.href}-${index}`} className="border border-rule p-5">
              <a href={event.href} target="_blank" rel="noreferrer" aria-label="View event listing" className="block no-underline hover:no-underline">
                <div className="aspect-[4/3] bg-paper/[0.04]" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

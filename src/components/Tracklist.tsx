export default function Tracklist({
  heading,
  tracks,
  start = 1,
}: {
  heading: string;
  tracks: string[];
  start?: number;
}) {
  return (
    <div>
      <h4 className="kicker mb-2">{heading}</h4>
      {tracks.length === 0 ? <p className="text-sm text-muted">Tracklist not documented.</p> : null}
      {tracks.length > 0 ? <div className="mb-2 grid grid-cols-[2rem_minmax(0,1fr)] gap-4 text-xs text-muted" aria-hidden="true"><span>No.</span><span>Track</span></div> : null}
      <ol className="index-list">
        {tracks.map((t, i) => (
          <li key={`${i}-${t}`} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 border-t border-rule py-3">
            <span className="index-number">{String(start + i).padStart(2, "0")}</span>
            <span className="text-sm">{t}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

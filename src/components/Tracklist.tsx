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
      <div className="index-head" aria-hidden="true"><span>No.</span><span>Track</span><span className="index-meta">Audio</span><span aria-hidden="true">&#8599;</span></div>
      <ol className="index-list">
        {tracks.map((t, i) => (
          <li key={`${i}-${t}`} className="index-row">
            <span className="index-number">{String(start + i).padStart(2, "0")}</span>
            <span className="index-title">{t}</span><span className="index-meta" aria-hidden="true">&#9679;</span><span className="index-arrow" aria-hidden="true">&#8599;</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

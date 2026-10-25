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
      <ol>
        {tracks.map((t, i) => (
          <li key={`${i}-${t}`} className="row grid-cols-[2rem_1fr]">
            <span className="tabular-nums text-muted">{start + i}</span>
            <span>{t}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

import { getArtists } from "@/lib/content/queries";
import ArtistRow from "@/components/ArtistRow";

export default function ArtistIndex() {
  const artists = getArtists();
  return (
    <div className="wrap py-10">
      <h1 className="page-title">Artists</h1>
      <p className="mt-4 max-w-prose text-lg text-muted">
        Artists, labels and releases from the scene. Two placeholder artist records for now.
      </p>
      <p className="kicker mt-6">{String(artists.length).padStart(2, "0")} records</p>
      <ul className="mt-3 border-b border-rule">
        {artists.map((a) => (
          <ArtistRow key={a.slug} a={a} />
        ))}
      </ul>
    </div>
  );
}

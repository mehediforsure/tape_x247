import { getArtists } from "@/lib/content/queries";
import ArtistRow from "@/components/ArtistRow";

export default async function ArtistIndex() {
  const artists = await getArtists();
  return (
    <div className="wrap py-10">
      <h1 className="page-title">Artists</h1>
      <p className="mt-4 max-w-prose text-lg text-muted">
        Artists, labels and releases from the scene.
      </p>
      <p className="kicker mt-6">{String(artists.length).padStart(2, "0")} records</p>
      <div className="index-head mt-6" aria-hidden="true"><span>No.</span><span>Artist</span><span className="index-meta">Scene / Sound</span><span aria-hidden="true">&#8599;</span></div>
      <ul className="index-list">
        {artists.map((a, index) => (
          <ArtistRow key={a.slug} a={a} index={index} />
        ))}
      </ul>
    </div>
  );
}

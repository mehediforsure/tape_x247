import Link from "next/link";
import { notFound } from "next/navigation";
import ArtistRow from "@/components/ArtistRow";
import { countries } from "@/content/taxonomy";
import { getArtistsByCountry } from "@/lib/content/queries";

// Re-fetch from Supabase at most once a minute.
export const revalidate = 60;

export const generateStaticParams = () => countries.map(c => ({ country: c.slug }));

export default async function ScenePage({ params }: { params: Promise<{ country: string }> }) {
  const slug = (await params).country;
  const place = countries.find(c => c.slug === slug);
  if (!place) notFound();
  const artists = await getArtistsByCountry(place.name);

  return (
    <div className="wrap py-10">
      <Link href="/discover" className="kicker">← Discover</Link>
      <h1 className="page-title mt-6">{place.name}</h1>
      <p className="mt-4 max-w-prose text-muted">
        {artists.length
          ? "Demo artist records; research and verification are still to come."
          : "No records have been added for this country yet."}
      </p>
      {artists.length > 0 && (
        <ul className="mt-10 border-b border-rule">
          {artists.map((a) => (
            <ArtistRow key={a.slug} a={a} />
          ))}
        </ul>
      )}
    </div>
  );
}

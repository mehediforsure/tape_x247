import { artists, dispatches } from "@/content/demo";
export const getArtists = () => artists;
export const getArtist = (slug: string) => artists.find(a => a.slug === slug);
// Country is the last comma-separated part of an artist's location text.
export const getArtistsByCountry = (country: string) =>
  artists.filter(a => a.location.split(",").at(-1)?.trim() === country);
// Demo articles remain explicitly labeled drafts/stubs in the interface.
export const getArticles = () => dispatches;
export const getArticle = (slug: string) => dispatches.find(d => d.slug === slug);
export const getArtistArticles = (slug: string) => dispatches.filter(d => d.mentions.includes(slug));

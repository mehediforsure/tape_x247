export const metadata = { title: "Artists | tape_x247" };

// Re-fetch from Supabase at most once a minute (otherwise the build-time snapshot is served forever).
export const revalidate = 60;
export { default } from "@/components/ArtistIndex";

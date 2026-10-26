import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

/**
 * Cookie-free Supabase client for PUBLIC, read-only content (artists, releases,
 * labels, countries).
 *
 * Why not `server.ts`? That client calls `cookies()`, which only works while a
 * web request is being handled. `generateStaticParams`, static generation and
 * ISR revalidation run outside a request, so they crash with
 * "`cookies` was called outside a request scope".
 *
 * Row Level Security still applies: the anon role only sees published rows.
 * Use `server.ts` only for things that need the signed-in user's session.
 */
export function createPublicClient() {
  const { url, key } = getSupabaseEnv();
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

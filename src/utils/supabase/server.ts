import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./env";

/**
 * Supabase client for Server Components, Route Handlers and Server Actions.
 * Only needed for cookie-based auth. Public read-only content should use
 * `getPublicClient()` from `src/lib/artists.ts` instead.
 *
 * Next 15: cookies() is async and MUST be awaited.
 */
export async function createClient() {
  const { url, key } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // Safe to ignore when middleware refreshes the session.
        }
      },
    },
  });
}

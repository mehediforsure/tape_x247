import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, getSupabaseEnv } from "./env";

/**
 * Refreshes the Supabase auth session cookie.
 *
 * Designed so that it can NEVER take the whole site down:
 *  - it is a no-op unless SUPABASE_AUTH_ENABLED=true (as in .env.example)
 *  - it is a no-op if the Supabase env vars are missing
 *  - any Supabase error is logged and the request continues
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (process.env.SUPABASE_AUTH_ENABLED !== "true" || !isSupabaseConfigured()) {
    return response;
  }

  try {
    const { url, key } = getSupabaseEnv();
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    // Validates the JWT with the Auth server and refreshes it if needed.
    await supabase.auth.getUser();
  } catch (error) {
    console.error("[supabase middleware] session refresh failed:", error);
  }

  return response;
}

// NOTE: Next.js only inlines NEXT_PUBLIC_* variables when they are read with a
// literal `process.env.NAME` expression. Never read them dynamically
// (process.env[name]) or destructure process.env, or they will be undefined
// in the browser bundle.

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim(),
  );
}

export function getSupabaseEnv(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  const missing: string[] = [];
  if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!key) missing.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

  if (!url || !key) {
    throw new Error(
      `Missing Supabase environment variable(s): ${missing.join(", ")}. ` +
        "Copy .env.example to .env.local, fill the values, then restart `npm run dev` " +
        "(Next.js only reads .env.local at startup).",
    );
  }
  return { url, key };
}

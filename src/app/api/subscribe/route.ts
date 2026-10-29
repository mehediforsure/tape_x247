import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function getClientKey(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: NextRequest) {
  const now = Date.now();
  let body: { email?: unknown; website?: unknown; startedAt?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (body.website) return NextResponse.json({ message: "Thanks." });
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const startedAt = typeof body.startedAt === "string" ? Number(body.startedAt) : 0;
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (!Number.isFinite(startedAt) || now - startedAt < 1200) return NextResponse.json({ error: "Please take a moment, then try again." }, { status: 400 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const secret = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !secret) return NextResponse.json({ error: "Subscriptions are not configured yet." }, { status: 503 });
  const supabase = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  const keyHash = createHash("sha256").update(getClientKey(request)).digest("hex");
  const { data: rate } = await supabase.from("subscription_rate_limits").select("window_started_at,request_count").eq("key_hash", keyHash).maybeSingle();
  const windowStarted = rate ? new Date(rate.window_started_at).getTime() : 0;
  if (rate && now - windowStarted < WINDOW_MS && rate.request_count >= MAX_ATTEMPTS) return NextResponse.json({ error: "Please try again later." }, { status: 429 });
  const rateWrite = rate && now - windowStarted < WINDOW_MS
    ? supabase.from("subscription_rate_limits").update({ request_count: rate.request_count + 1 }).eq("key_hash", keyHash)
    : supabase.from("subscription_rate_limits").upsert({ key_hash: keyHash, window_started_at: new Date(now).toISOString(), request_count: 1 });
  const { error: rateError } = await rateWrite;
  if (rateError) { console.error("[subscribe] rate-limit write failed:", rateError); return NextResponse.json({ error: "Subscriptions are temporarily unavailable." }, { status: 503 }); }
  const { error } = await supabase.from("subscribers").insert({ email, status: "active" });
  if (error?.code === "23505") return NextResponse.json({ error: "That email is already subscribed." }, { status: 409 });
  if (error) { console.error("[subscribe] insert failed:", error); return NextResponse.json({ error: "Subscription could not be completed." }, { status: 500 }); }
  return NextResponse.json({ message: "You’re on the list." });
}

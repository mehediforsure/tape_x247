import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "tape_x247_access";
const PASSWORD = "tapex247";

function accessToken() {
  return createHash("sha256").update(`tape_x247:${PASSWORD}`).digest("hex");
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = formData.get("password");

  if (typeof password !== "string" || password !== PASSWORD) {
    return NextResponse.redirect(new URL("/access?error=1", request.url), 303);
  }

  const response = NextResponse.redirect(new URL("/", request.url), 303);
  response.cookies.set({
    name: COOKIE_NAME,
    value: accessToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

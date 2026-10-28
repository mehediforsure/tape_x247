import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "tape_x247_access";
const PASSWORD = "tapex247";

function accessToken() {
  return createHash("sha256").update(`tape_x247:${PASSWORD}`).digest("hex");
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname === "/access" ||
    pathname.startsWith("/api/access") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  if (request.cookies.get(COOKIE_NAME)?.value === accessToken()) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/access", request.url));
}

export const config = {
  matcher: ["/:path*"],
};

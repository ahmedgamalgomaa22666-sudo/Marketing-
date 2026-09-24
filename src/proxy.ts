import { NextResponse, type NextRequest } from "next/server";

/**
 * Production route guard.
 *
 * The private BD Intelligence / Career Evidence workspace and the AI API routes are for local
 * use only (`npm run dev`). In production they respond exactly like a page that does not exist.
 * No authentication, passwords or environment variables are involved — they are simply closed.
 */

const PRIVATE_PREFIXES = ["/workspace", "/api/ai"];

/** True for /workspace, /workspace/*, /api/ai and /api/ai/* (case-insensitive, trailing slashes ignored). */
export function isPrivatePath(pathname: string): boolean {
  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    // Malformed encoding — judge the raw path.
  }
  const path = decoded.toLowerCase().replace(/\/+$/, "") || "/";
  return PRIVATE_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export function isBlocked(pathname: string, nodeEnv: string | undefined = process.env.NODE_ENV): boolean {
  return nodeEnv === "production" && isPrivatePath(pathname);
}

export function proxy(request: NextRequest) {
  if (isBlocked(request.nextUrl.pathname)) {
    // Render the standard Not Found page with a 404 status; never reveal that the route exists.
    return NextResponse.rewrite(new URL("/__not-found", request.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/workspace", "/workspace/:path*", "/api/ai", "/api/ai/:path*"],
};

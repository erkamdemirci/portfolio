import { NextRequest, NextResponse } from "next/server";
import { toInternal } from "./lib/i18n/routes";

/**
 * Locale routing proxy — rewrites public TR/EN URLs into the internal app/[lang] route
 * structure (lib/i18n/routes.ts owns the URL table). Renamed from the deprecated
 * `middleware` file convention to `proxy` (Next.js 16, A9); the request-handling behavior
 * is unchanged (toInternal rewrites; shouldBypass passthrough lives inside toInternal).
 * Named decision (03-screens-and-flows.md §Locale routes): no request-header-based
 * auto-redirect of any kind — first paint is always TR at root; the switch is the
 * G1 locale chip (C5), never a redirect.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const internal = toInternal(pathname);

  // Asset/meta paths (Next.js internals, favicon, robots.txt, sitemap.xml,
  // og-*.png, /screens/*, any file with an extension) pass through untouched.
  if (!internal) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = internal.path;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Match every path except Next.js internals (/_next/*) and any path
    // that carries a file extension (assets, favicon, robots.txt, sitemap.xml, ...).
    "/((?!_next/|.*\\..*).*)",
  ],
};

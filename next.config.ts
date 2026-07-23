import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * 2026-07 scroll-film rebuild: the work/case + studio surface is retired until the
   * projects section returns. Permanent redirects preserve the link equity of the old
   * indexed URLs (both locales) into the locale home. Config-level redirects run before
   * proxy.ts, so the locale rewrite never sees these paths.
   */
  async redirects() {
    return [
      { source: "/isler", destination: "/", permanent: true },
      { source: "/isler/:path*", destination: "/", permanent: true },
      { source: "/studyo", destination: "/", permanent: true },
      { source: "/en/work", destination: "/en", permanent: true },
      { source: "/en/work/:path*", destination: "/en", permanent: true },
      { source: "/en/studio", destination: "/en", permanent: true },
    ];
  },
};

export default nextConfig;

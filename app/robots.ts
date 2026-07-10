import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * app/robots.ts (04-tasks.md T30; served at /robots.txt, already excluded from the T04 locale
 * rewrite via the `.txt` extension bypass). Disallows the internal-only /dev tree (both locale
 * prefixes — /dev/* under the TR segment, /en/dev/* under EN) — the specimen page (T06) and OG
 * template (T31) already ship `robots: noindex` themselves; this keeps crawlers out of that
 * subtree entirely rather than relying on meta tags alone.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dev", "/en/dev"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

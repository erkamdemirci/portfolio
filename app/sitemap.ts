import type { MetadataRoute } from "next";
import { sitemap as buildSitemap } from "@/lib/seo";

/**
 * app/sitemap.ts (04-tasks.md T30; Next's sitemap.ts file convention — served at /sitemap.xml,
 * already excluded from the T04 locale rewrite via the `.xml` extension bypass). Adapts
 * lib/seo.ts's `sitemap()` (the behavior-tested 20-entry source of truth) to Next's
 * `MetadataRoute.Sitemap` shape — `alternates.languages` per entry produces the
 * `<xhtml:link rel="alternate" hreflang=... href=...>` pairs (03 §Locale routes: "each entry
 * carrying both xhtml:link hreflang alternates").
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap().map((entry) => ({
    url: entry.url,
    alternates: { languages: entry.languages },
  }));
}

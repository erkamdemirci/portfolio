import type { Metadata } from "next";
import { localePairs, type Lang } from "@/lib/i18n/routes";
import { postSlugs } from "@/lib/blog/posts";

/**
 * SEO source of truth (04-tasks.md T30/T31; 03-screens-and-flows.md §Meta, titles & OG).
 * Title/description strings live here VERBATIM, once, and every page's `generateMetadata`
 * calls `pageMetadata()` instead of carrying its own copy.
 *
 * 2026-07 scroll-film rebuild: `PageKey` covers the three surviving routes (home, services,
 * contact) — the work/case/studio rows left with their pages (next.config.ts 301s their
 * URLs home). The surviving rows keep their ranking copy byte-identical. The 404 page is
 * deliberately excluded (noindex; it ships its own static metadata, T28).
 */

export const SITE_URL = "https://erkamdemirci.com";

export type PageKey = "home" | "services" | "contact";

interface MetaEntry {
  title: string;
  description: string;
}

// The 03 §SEO table — copied verbatim, both locales, all 10 rows (de-themed).
const META_TABLE: Record<PageKey, Record<Lang, MetaEntry>> = {
  home: {
    tr: {
      title: "Kurumsal Web Sitesi ve Mobil Uygulama Ajansı | DMRC",
      description:
        "Bursa merkezli DMRC kurumsal web siteleri, web tasarım ve mobil uygulama geliştirir. Kendi ürünlerini kuran bir stüdyonun özeniyle projenizi hayata geçiririz.",
    },
    en: {
      title: "Corporate Website & Mobile App Studio | DMRC",
      description:
        "Bursa-based DMRC builds corporate websites, web apps, and mobile apps — with the discipline of a studio that builds its own products end to end.",
    },
  },
  services: {
    tr: {
      title: "Web Tasarım ve Geliştirme Hizmetleri | DMRC",
      description:
        "Kurumsal web siteleri, web tasarım ve geliştirme, mobil uygulama ve kurumsal kimlik. DMRC projenizi tasarımdan yayına tek elden yürütür. Teklif için yazın.",
    },
    en: {
      title: "Web Design & Development Services | DMRC",
      description:
        "Corporate websites, web design and development, mobile apps, and brand identity. DMRC runs your project from design to launch — ask for a quote.",
    },
  },
  contact: {
    tr: {
      title: "İletişim — Teklif Al | DMRC",
      description:
        "Web sitesi veya mobil uygulama projeniz için teklif alın. Bursa merkezli DMRC her briefe 48 saat içinde yanıt verir. E-posta veya form ile ulaşın.",
    },
    en: {
      title: "Contact — Get a Quote | DMRC",
      description:
        "Get a quote for your website or mobile app project. Bursa-based DMRC replies to every brief within 48 hours. Reach us by email or the form.",
    },
  },
};

// localePairs[] index for each PageKey — mirrors lib/i18n/routes.ts's table order 1:1
// (Home, Services, Contact).
const PAGE_ROUTE_INDEX: Record<PageKey, number> = {
  home: 0,
  services: 1,
  contact: 2,
};

export interface PageAlternates {
  tr: string;
  en: string;
  xDefault: string;
}

/** Looks up a page's title/description for a locale — the 03 §Meta table, once. */
export function metaFor(page: PageKey, lang: Lang): MetaEntry {
  return META_TABLE[page][lang];
}

/**
 * Resolves both locale public URLs + x-default (always TR — matches first-visit behavior,
 * 03 §Locale routes) from EITHER side's public path. Returns null for an unknown path.
 */
export function alternatesForPath(pathname: string): PageAlternates | null {
  const pair = localePairs.find((p) => p.tr === pathname || p.en === pathname);
  if (!pair) return null;
  return { tr: pair.tr, en: pair.en, xDefault: pair.tr };
}

/**
 * Both locale public URLs + x-default for a `PageKey` (used by `pageMetadata()`'s canonical
 * field AND by `<HreflangLinks>`, components/seo/hreflang-links.tsx — see that file's doc
 * comment for why the alternate-language `<link>` tags are rendered manually rather than via
 * this function's `Metadata["alternates"]["languages"]` field).
 */
export function alternatesFor(page: PageKey): PageAlternates {
  const pair = localePairs[PAGE_ROUTE_INDEX[page]];
  return { tr: pair.tr, en: pair.en, xDefault: pair.tr };
}

/**
 * Full `generateMetadata()` return value for one page/locale: title, description, canonical
 * (→ `<link rel="canonical">`, unaffected by the hrefLang casing issue below). Deliberately
 * does NOT set `alternates.languages` — 04-tasks.md T30 deviation (see DEVIATIONS.md): this
 * Next.js 16.2.10 build serializes that field's generated `<link>` tags as `hrefLang="tr"`
 * (verbatim JSX-prop casing) instead of the spec-correct, lowercase `hreflang="tr"` HTML
 * attribute — harmless to real crawlers (HTML attribute names are case-insensitive per the
 * WHATWG spec) but fails T30's own literal `grep -c 'hreflang'` acceptance check. Every page
 * instead renders `<HreflangLinks>` directly in its JSX tree (React 19's `<head>`-hoisting),
 * which writes the attribute as a genuinely lowercase string and avoids emitting the tag
 * twice.
 *
 * `openGraph.images` (T31) points at `/og-{lang}.png` — ONE image per locale, shared across
 * every page of that locale (03 §Meta named decision: "per-page OG variants are out of v1
 * scope"), generated by scripts/generate-og.mjs from app/[lang]/dev/og/page.tsx.
 */
export function pageMetadata(page: PageKey, lang: Lang): Metadata {
  const { title, description } = metaFor(page, lang);
  const alt = alternatesFor(page);
  const canonical = lang === "tr" ? alt.tr : alt.en;
  const ogImage = `/og-${lang}.png`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
  };
}

export interface SitemapEntry {
  url: string;
  /** hreflang → URL. Frozen pages carry `tr` + `en`; TR-only blog carries `tr` + `x-default`. */
  languages: Record<string, string>;
}

/**
 * The 17-URL sitemap surface: the 6 frozen route URLs (3 pairs x 2 locales, each its own
 * `<url>` entry carrying the SAME tr+en alternates, per Next's localized-sitemap convention) PLUS
 * the TR-only blog (T69): `/blog` + the 10 posts, each emitting `tr` + `x-default` only — no `en`
 * pair (A11). Consumed by app/sitemap.ts; also the seo.test.ts behavior-test target directly (no
 * dev-only route, no /api, no 404, and no redirected legacy URL ever appears here).
 */
export function sitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const pair of localePairs) {
    const languages = { tr: `${SITE_URL}${pair.tr}`, en: `${SITE_URL}${pair.en}` };
    entries.push({ url: `${SITE_URL}${pair.tr}`, languages });
    entries.push({ url: `${SITE_URL}${pair.en}`, languages });
  }
  // Blog (TR-only, A11): /blog + the 10 post URLs, hreflang tr + x-default only.
  const blogPaths = ["/blog", ...postSlugs.map((slug) => `/blog/${slug}`)];
  for (const path of blogPaths) {
    const url = `${SITE_URL}${path}`;
    entries.push({ url, languages: { tr: url, "x-default": url } });
  }
  return entries;
}

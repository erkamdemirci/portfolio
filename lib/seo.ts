import type { Metadata } from "next";
import { localePairs, type Lang } from "@/lib/i18n/routes";
import type { CaseSlug } from "@/lib/cases";

/**
 * SEO source of truth (04-tasks.md T30/T31; 03-screens-and-flows.md §Meta, titles & OG).
 * The 03 table's title/description strings live here VERBATIM, once, and every page's
 * `generateMetadata` calls `pageMetadata()` instead of carrying its own copy — the six
 * page-local `META` consts this replaces were byte-identical to this table already.
 *
 * `PageKey` covers exactly the 10 rows of the 03 §Locale routes table (the 20-URL sitemap
 * surface) — the 404 page is deliberately excluded (03: "G3 is noindex and excluded"; it
 * ships its own static noindex metadata directly in app/[lang]/not-found.tsx, T28).
 */

export const SITE_URL = "https://erkamdemirci.com";

export type PageKey = "home" | "work" | CaseSlug | "services" | "studio" | "contact";

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
  work: {
    tr: {
      title: "İşler — Web ve Mobil Ürünlerimiz | DMRC",
      description:
        "DMRC'nin geliştirdiği ürünler ve müşteri projeleri: canlı web siteleri ve mobil uygulamalar. Her kayıt ne inşa ettiğimizi ve neyin çalıştığını gösterir.",
    },
    en: {
      title: "Work — Our Web & Mobile Products | DMRC",
      description:
        "The products and client work DMRC has built: live web and mobile apps. Each record shows what we built, what we built it with, and what runs.",
    },
  },
  vaaz: {
    tr: {
      title: "VAAZ — Namaz Vakti Uygulaması | DMRC",
      description:
        "VAAZ; namaz vakitleri, günlük takip ve vaaz içeriğini tek uygulamada sunar. iOS ve Android'de canlı, iki mağazada 4,9 puan. DMRC ürünü.",
    },
    en: {
      title: "VAAZ — Prayer Times App | DMRC",
      description:
        "VAAZ brings prayer times, daily tracking, and sermon content into one app. Live on iOS and Android, rated 4.9 on both stores. A DMRC product.",
    },
  },
  akitle: {
    tr: {
      title: "Akitle — Kira Sözleşmesi Uygulaması | DMRC",
      description:
        "Akitle kira sözleşmelerini tek akışta hazırlar, imzalar ve arşivler. v3.1 üretimde, gerçek kullanıcılarla canlı. DMRC ürünü.",
    },
    en: {
      title: "Akitle — Rental Contract App | DMRC",
      description:
        "Akitle drafts, signs, and archives rental contracts in a single flow. v3.1 in production, live with real users. A DMRC product.",
    },
  },
  linkden: {
    tr: {
      title: "Linkden — Geliştirici Dokümantasyon Aracı | DMRC",
      description:
        "Linkden, dokümantasyonu yazdığı kodun yanında tutan klavye öncelikli bir araç. v1.8 üretimde. DMRC ürünü.",
    },
    en: {
      title: "Linkden — Developer Docs Tool | DMRC",
      description:
        "Linkden keeps documentation next to the code it describes — a keyboard-first tool for dev teams. v1.8 in production. A DMRC product.",
    },
  },
  characterdex: {
    tr: {
      title: "CharacterDex — Kişilik Tipi Uygulaması | DMRC",
      description:
        "CharacterDex, koleksiyonluk kart sistemiyle kişilik tiplerini keşfettiren bir web uygulaması. v2.0 canlı. DMRC ürünü.",
    },
    en: {
      title: "CharacterDex — Personality Typing App | DMRC",
      description:
        "CharacterDex explores personality types with a collectible card system. v2.0 live on the web. A DMRC product.",
    },
  },
  "oasis-and-mind": {
    tr: {
      title: "Oasis and Mind — Bakım Oyunu | DMRC",
      description:
        "Oasis and Mind, günlük sağlıklı yaşam ritüelleri etrafında kurulan bir bakım oyunu. Mobilde geliştirme aşamasında. DMRC ürünü.",
    },
    en: {
      title: "Oasis and Mind — Care Game | DMRC",
      description:
        "Oasis and Mind is a care game built around daily wellness rituals. In development on mobile. A DMRC product.",
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
  studio: {
    tr: {
      title: "Stüdyo — DMRC Hakkında | Erkam Demirci",
      description:
        "DMRC, Bursa merkezli tek kuruculu bir web ve ürün stüdyosu. Erkam Demirci tasarımı, kodu ve operasyonu tek elden yürütür.",
    },
    en: {
      title: "Studio — About DMRC | Erkam Demirci",
      description:
        "DMRC is a one-founder web and product studio based in Bursa. Erkam Demirci runs design, code, and operations end to end.",
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
// (Home, Work, VAAZ, Akitle, Linkden, CharacterDex, Oasis and Mind, Services, Studio, Contact).
const PAGE_ROUTE_INDEX: Record<PageKey, number> = {
  home: 0,
  work: 1,
  vaaz: 2,
  akitle: 3,
  linkden: 4,
  characterdex: 5,
  "oasis-and-mind": 6,
  services: 7,
  studio: 8,
  contact: 9,
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
  languages: { tr: string; en: string };
}

/**
 * The full 20-URL sitemap surface (10 route pairs x 2 locales — each locale's own URL is its
 * own `<url>` entry, both carrying the SAME pair of hreflang alternates, per Next's own
 * "Generate a localized Sitemap" convention). Consumed by app/sitemap.ts; also the seo.test.ts
 * behavior-test target directly (no dev-only route, no 404, ever appears here).
 */
export function sitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const pair of localePairs) {
    const languages = { tr: `${SITE_URL}${pair.tr}`, en: `${SITE_URL}${pair.en}` };
    entries.push({ url: `${SITE_URL}${pair.tr}`, languages });
    entries.push({ url: `${SITE_URL}${pair.en}`, languages });
  }
  return entries;
}

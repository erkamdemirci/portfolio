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

// The 03 §Meta, titles & OG table — copied verbatim, both locales, all 10 rows.
const META_TABLE: Record<PageKey, Record<Lang, MetaEntry>> = {
  home: {
    tr: {
      title: "DMRC — Ürün stüdyosu · Web & mobil",
      description:
        "Kendi ürünlerimizi geliştiriyoruz — ve sizinkini. Beş ürünlük filo: web ve mobil ürün mühendisliği, tasarımdan operasyona.",
    },
    en: {
      title: "DMRC — Product studio · Web & mobile",
      description:
        "We build our own products — and yours. A five-product fleet: web and mobile product engineering, design through operations.",
    },
  },
  work: {
    tr: {
      title: "İşler — DMRC",
      description:
        "Tüm filo kaydı: VAAZ, Akitle, Linkden, CharacterDex, Oasis and Mind. Her vaka kaydı filodaki gerçek üründür — dördü üretimde, biri geliştirmede.",
    },
    en: {
      title: "Work — DMRC",
      description:
        "The full fleet record: VAAZ, Akitle, Linkden, CharacterDex, Oasis and Mind. Every case record is a real product in the fleet — four in production, one in development.",
    },
  },
  vaaz: {
    tr: {
      title: "VAAZ vaka kaydı — DMRC",
      description:
        "Namaz vakti yol arkadaşı: vakitler, takip, vaaz içeriği. unit-01: v2.4, iOS/Android, iki mağazada 4,9.",
    },
    en: {
      title: "VAAZ case record — DMRC",
      description:
        "A prayer companion: times, tracking, sermon content. unit-01: v2.4, iOS/Android, 4.9 across both stores.",
    },
  },
  akitle: {
    tr: {
      title: "Akitle vaka kaydı — DMRC",
      description: "Kira sözleşmeleri tek akışta: hazırla, imzala, arşivle. unit-02: v3.1, web, üretimde.",
    },
    en: {
      title: "Akitle case record — DMRC",
      description: "Rental contracts in one flow: draft, sign, archive. unit-02: v3.1, web, in production.",
    },
  },
  linkden: {
    tr: {
      title: "Linkden vaka kaydı — DMRC",
      description: "Kodun yanında yaşayan dokümantasyon; klavye öncelikli. unit-03: v1.8, web, üretimde.",
    },
    en: {
      title: "Linkden case record — DMRC",
      description: "Documentation that lives next to the code; keyboard first. unit-03: v1.8, web, in production.",
    },
  },
  characterdex: {
    tr: {
      title: "CharacterDex vaka kaydı — DMRC",
      description: "Kişilik tipleri, koleksiyonluk kehanet kartlarıyla. unit-04: v2.0, web, üretimde.",
    },
    en: {
      title: "CharacterDex case record — DMRC",
      description: "Personality typing with collectible oracle cards. unit-04: v2.0, web, in production.",
    },
  },
  "oasis-and-mind": {
    tr: {
      title: "Oasis and Mind vaka kaydı — DMRC",
      description:
        "Günlük ritüeller üzerine kurulu bakım oyunu. unit-05: v0.9, mobil, geliştirmede — kayıt güncellenir.",
    },
    en: {
      title: "Oasis and Mind case record — DMRC",
      description:
        "A care game built on daily rituals. unit-05: v0.9, mobile, in development — the record updates.",
    },
  },
  services: {
    tr: {
      title: "Hizmetler — DMRC",
      description:
        "Ürün mühendisliği, web ve mobil uygulamalar, tasarım sistemleri. Sabit kapsam ya da aylık; her iş çalışan bir şey sevk eder.",
    },
    en: {
      title: "Services — DMRC",
      description:
        "Product engineering, web and mobile apps, design systems. Fixed scope or ongoing; every engagement ships something that runs.",
    },
  },
  studio: {
    tr: {
      title: "Stüdyo — DMRC",
      description:
        "Tek kuruculu ürün stüdyosu: Erkam Demirci. Küçük kalır, uçtan uca inşa eder, sevk ettiğini işletir.",
    },
    en: {
      title: "Studio — DMRC",
      description:
        "A one-founder product studio: Erkam Demirci. It stays small, builds end to end, and operates what it ships.",
    },
  },
  contact: {
    tr: {
      title: "İletişim — DMRC",
      description: "Slot 06 boş. Brifinizi e-postayla gönderin; 48 saat içinde yazılı yanıt.",
    },
    en: {
      title: "Contact — DMRC",
      description: "Bay 06 is empty. Send your brief by email; a written reply within 48 hours.",
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
 * twice. T31 modifies this function to also attach the locale's `og:image` once the OG PNGs
 * exist (03 §Meta: "shared across all pages of that locale" — one image per locale, not per
 * page).
 */
export function pageMetadata(page: PageKey, lang: Lang): Metadata {
  const { title, description } = metaFor(page, lang);
  const alt = alternatesFor(page);
  const canonical = lang === "tr" ? alt.tr : alt.en;

  return {
    title,
    description,
    alternates: { canonical },
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

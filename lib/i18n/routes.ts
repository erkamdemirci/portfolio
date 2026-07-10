/**
 * Locale routing — bidirectional TR/EN public URL table + internal app/[lang] mapping.
 * Named decision (03-screens-and-flows.md §Locale routes): TR canonical at root, /en prefix,
 * ASCII-folded TR slugs, NO Accept-Language auto-redirect. Product slugs stay identical in
 * both locales (brand names).
 */

export type Lang = "tr" | "en";

export interface RouteInternal {
  lang: Lang;
  path: string;
}

export interface RoutePair {
  tr: string;
  en: string;
}

/** The full 03 §Locale routes URL table — TR canonical (root) <-> EN (/en prefix). */
export const localePairs: RoutePair[] = [
  { tr: "/", en: "/en" }, // Home
  { tr: "/isler", en: "/en/work" }, // Work index
  { tr: "/isler/vaaz", en: "/en/work/vaaz" }, // Case — VAAZ
  { tr: "/isler/akitle", en: "/en/work/akitle" }, // Case — Akitle
  { tr: "/isler/linkden", en: "/en/work/linkden" }, // Case — Linkden
  { tr: "/isler/characterdex", en: "/en/work/characterdex" }, // Case — CharacterDex
  { tr: "/isler/oasis-and-mind", en: "/en/work/oasis-and-mind" }, // Case — Oasis and Mind
  { tr: "/hizmetler", en: "/en/services" }, // Services
  { tr: "/studyo", en: "/en/studio" }, // Studio
  { tr: "/iletisim", en: "/en/contact" }, // Contact
];

const EN_PREFIX = "/en";

/** English canonical segment shared by both locales under app/[lang]/<canonical>. */
function canonicalOf(pair: RoutePair): string {
  return pair.en === EN_PREFIX ? "" : pair.en.slice(EN_PREFIX.length);
}

const TR_PREFIX = "/tr";

function isEnPath(pathname: string): boolean {
  return pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`);
}

/** Already-internal /tr paths (e.g. dev-only routes not in the public TR slug table). */
function isInternalTrPath(pathname: string): boolean {
  return pathname === TR_PREFIX || pathname.startsWith(`${TR_PREFIX}/`);
}

/** File-extension check — ignores query strings since it only matches the trailing segment. */
const HAS_EXTENSION = /\.[a-zA-Z0-9]+(?:[?#].*)?$/;

/**
 * Paths the middleware must never rewrite: Next.js internals (/_next/*) and any
 * asset/meta file (favicon.ico, icon.svg, robots.txt, sitemap.xml, og-*.png, /screens/*, ...).
 */
export function shouldBypass(pathname: string): boolean {
  if (pathname.startsWith("/_next/")) return true;
  if (HAS_EXTENSION.test(pathname)) return true;
  return false;
}

/**
 * Maps a public-facing URL to its internal app/[lang] route.
 * Known TR paths resolve to the English canonical segment (e.g. /isler/vaaz -> /tr/work/vaaz);
 * known and unknown EN paths are already in internal form (identity), and so are paths that
 * already carry the /tr segment (dev-only routes not in the public TR slug table, e.g.
 * /tr/dev/specimen — symmetric with /en so neither locale segment is ever double-prefixed);
 * unknown BARE (unprefixed) TR paths rewrite into the tr segment verbatim so the [...rest]
 * catch-all renders the locale-aware 404.
 * Returns null for asset/meta paths that must pass through untouched (no rewrite).
 */
export function toInternal(pathname: string): RouteInternal | null {
  if (shouldBypass(pathname)) return null;

  if (isEnPath(pathname)) {
    return { lang: "en", path: pathname };
  }

  if (isInternalTrPath(pathname)) {
    return { lang: "tr", path: pathname };
  }

  const match = localePairs.find((pair) => pair.tr === pathname);
  if (match) {
    return { lang: "tr", path: `/tr${canonicalOf(match)}` };
  }

  return { lang: "tr", path: `/tr${pathname}` };
}

/**
 * Returns the alternate-locale PUBLIC url for a given public url (used by C5, the G1 locale
 * chip). Unknown paths fall back to the OTHER locale's home — 03 §G3 named rule.
 */
export function getAlternate(pathname: string): string {
  if (isEnPath(pathname)) {
    const match = localePairs.find((pair) => pair.en === pathname);
    return match ? match.tr : "/";
  }

  const match = localePairs.find((pair) => pair.tr === pathname);
  return match ? match.en : "/en";
}

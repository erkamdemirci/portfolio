/**
 * Turkish dictionary — TR is the default/canonical locale (01-design-system.md §Localization).
 * Strings are stored in SOURCE case, never pre-uppercased — the mono-label uppercase transform
 * is a CSS `text-transform: uppercase` rule so `lang="tr"` drives correct İ/I casing (01 §Typography).
 * Shared-chrome content only (G1/G2) — verbatim from 03-screens-and-flows.md §G1/§G2 and
 * 02-components.md §C24. Page-level dictionaries land with their screens (T21+).
 */
export const tr = {
  lang: "tr",
  nav: {
    work: "İşler",
    services: "Hizmetler",
    studio: "Stüdyo",
    cta: "Proje başlat",
  },
  modeChip: {
    dark: "mod / koyu",
    light: "mod / açık",
  },
  localeChip: {
    label: "dil / tr",
  },
  footer: {
    cells: {
      studio: { key: "stüdyo", value: "DMRC — Erkam Demirci'nin stüdyosu" },
      base: { key: "üs", value: "Bursa, TR → dünya geneli" },
      fleet: { key: "filo", value: "filoda 05 ürün" },
      stack: { key: "yığın", value: "web & mobil" },
      channel: { key: "kanal", value: "hello@erkamdemirci.com" },
      status: { key: "durum", value: "● operasyonel" },
    },
    copyright: "© 2026 DMRC · erkamdemirci.com",
    sheetLine: "sayfa 01/01 · rev B · machine shop",
  },
} as const;

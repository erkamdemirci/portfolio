/**
 * English dictionary — secondary locale, switched to via the G1 locale chip (C5).
 * Shared-chrome content only (G1/G2) — verbatim where 03/02 give an exact EN string; the
 * four footer cell values not spelled out verbatim in 03/02 (stüdyo/üs/yığın/durum) are
 * direct cognate translations of the TR values, reusing phrasing already used elsewhere in
 * the same documents for the same concepts (see DEVIATIONS.md, T05).
 */
export const en = {
  lang: "en",
  nav: {
    work: "Work",
    services: "Services",
    studio: "Studio",
    cta: "Start a project",
  },
  modeChip: {
    dark: "mode / dark",
    light: "mode / light",
    ariaToLight: "Switch to light theme",
    ariaToDark: "Switch to dark theme",
  },
  localeChip: {
    label: "lang / en",
  },
  footer: {
    cells: {
      studio: { key: "studio", value: "DMRC — Erkam Demirci's studio" },
      base: { key: "base", value: "Bursa, TR → worldwide" },
      fleet: { key: "fleet", value: "05 products in the fleet" },
      stack: { key: "stack", value: "web & mobile" },
      channel: { key: "channel", value: "hello@erkamdemirci.com" },
      status: { key: "status", value: "● operational" },
    },
    copyright: "© 2026 DMRC · erkamdemirci.com",
    sheetLine: "sayfa 01/01 · rev B · machine shop",
  },
} as const;

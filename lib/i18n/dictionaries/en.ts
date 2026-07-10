/**
 * English dictionary — secondary locale, switched to via the G1 locale chip (C5).
 * Shared-chrome content only (G1/G2) — verbatim where 03/02 give an exact EN string; the
 * four footer cell values not spelled out verbatim in 03/02 (stüdyo/üs/yığın/durum) are
 * direct cognate translations of the TR values, reusing phrasing already used elsewhere in
 * the same documents for the same concepts (see DEVIATIONS.md, T05).
 */
export const en = {
  lang: "en",
  skipLink: "Skip to content",
  wordmark: {
    name: "DMRC",
    descriptor: "/ product studio",
  },
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
    ariaSwitch: "Switch to the Turkish version",
  },
  footer: {
    cells: {
      studio: { key: "studio", value: "DMRC — Erkam Demirci's studio" },
      base: { key: "base", value: "Bursa, TR → worldwide" },
      fleet: { key: "fleet", value: "05 products in the fleet" },
      stack: { key: "stack", value: "web & mobile" },
      channel: { key: "channel", value: "hello@erkamdemirci.com" },
      status: { key: "status", value: "operational" }, // dot is CSS-drawn (C11), not text
    },
    copyright: "© 2026 DMRC · erkamdemirci.com",
    sheetLine: "sayfa 01/01 · rev B · machine shop",
  },
  // Home (T21, 03-screens-and-flows.md §1) — verbatim EN content, structurally mirrors tr.ts.
  home: {
    eyebrow: "DMRC — product studio · Bursa, TR → worldwide",
    h1Lead: "We build our own products — ",
    h1Turn: "and yours.",
    lede: "Five products of our own in the fleet — four in production, one in development — monitored daily. Client work goes through the same shop: designed, built, shipped, and kept alive — web and mobile.",
    email: "hello@erkamdemirci.com",
    fleetReadoutAria: "Fleet status readout",
    statRailAria: "Studio numbers",
    fleet: {
      eyebrow: "01 — work / proof in production",
      heading: "The fleet, live.",
      side: "Every unit below is our own product, running with real users. We maintain what we ship — client builds get the same telemetry.",
    },
    cards: {
      vaaz: {
        unitLabel: "unit-01 · VAAZ",
        flag: "LIVE",
        meta: "v2.4 · iOS / Android",
        title: "VAAZ",
        description: "Prayer times, daily tracking, and sermon content in one companion app.",
        domain: "getvaaz.com",
        rating: "4.9",
        ratingSuffix: "store rating",
      },
      akitle: {
        unitLabel: "unit-02 · AKITLE",
        flag: "LIVE",
        meta: "v3.1 · Web",
        title: "Akitle",
        description: "Rental contracts drafted, signed, and archived in a single flow.",
        domain: "akitle.com",
        telLine2: "rental contract SaaS",
      },
      linkden: {
        unitLabel: "unit-03 · LINKDEN",
        flag: "LIVE",
        meta: "v1.8 · Web",
        title: "Linkden",
        description: "Documentation that lives next to the code it describes.",
        domain: "linkden.co",
        telLine2: "for dev teams",
      },
      characterdex: {
        unitLabel: "unit-04 · CHARACTERDEX",
        flag: "LIVE",
        meta: "v2.0 · Web",
        title: "CharacterDex",
        description: "Personality typing with a collectible oracle-card system.",
        domain: "characterdex.com",
        telLine2: "web app",
      },
      oasis: {
        unitLabel: "unit-05 · OASIS AND MIND",
        flag: "IN DEV",
        meta: "v0.9 · Mobile",
        title: "Oasis and Mind",
        description: "A care game built around daily wellness rituals.",
        telLine1: "in development",
        telLine2: "mobile · both stores",
        slotTitle: "Screen slot",
        slotBody: "Oasis home screen — warm cream UI",
      },
    },
    bay06: {
      slotLabel: "bay-06 · reserved",
      capacityLabel: "capacity: 01",
      title: "Your product runs here.",
      body: "We take on a few client builds at a time and run them like our own — same stack, same monitoring, same standards.",
      note: "next slot: available",
    },
    services: {
      eyebrow: "02 — services / what we take on",
      heading: "Built to order.",
      side: "Fixed scope or ongoing. Every engagement ships something that runs — not a deck.",
      ctaLabel: "All services",
      cellOne: {
        index: "s/01",
        title: "Product engineering",
        body: "Scope to shipped: architecture, build, deploy, and the operations after launch.",
      },
      cellTwo: {
        index: "s/02",
        title: "Web apps",
        body: "Next.js applications with real backends — from marketing site to full SaaS.",
      },
      cellThree: {
        index: "s/03",
        title: "Mobile apps",
        body: "Expo apps shipped to both stores, with over-the-air updates from day one.",
      },
      cellFour: {
        index: "s/04",
        title: "Design systems",
        body: "Tokens, components, and documentation a team can maintain without us.",
      },
    },
    studio: {
      eyebrow: "03 — studio / who is dmrc",
      heading: "One founder. A five-product fleet.",
      lede: "DMRC is Erkam Demirci's product studio. It stays small, builds end to end, and operates what it ships.",
      ctaLabel: "Meet the studio",
    },
    statRail: {
      products: { value: "05", caption: "products in the fleet" },
      platforms: { value: "02", caption: "platforms — web & mobile" },
      response: { value: "<48", suffix: "h", caption: "reply on new briefs" },
      openSlot: { value: "01", caption: "open slot — bay-06" },
    },
    contactBand: {
      eyebrow: "04 — contact / bay-06",
      heading: "Bay 06 is empty.",
      lede: "Tell us what you're building — stage, platform, and what shipped looks like to you. We read every brief and reply within 48 hours.",
      accentLabel: "Start a project",
      ghostLabel: "See the fleet",
      kvAriaLabel: "Contact details",
      kvEmail: { key: "email", value: "hello@erkamdemirci.com" },
      kvBase: { key: "base", value: "Bursa, Türkiye → worldwide" },
      kvResponse: { key: "response", value: "< 48h, working days" },
      kvStack: { key: "stack", value: "Next.js · Expo · Convex" },
    },
  },
  // Work index (T22, 03-screens-and-flows.md §2) — verbatim EN content.
  workIndex: {
    eyebrow: "01 — work / the full fleet",
    heading: "The full fleet record.",
    side: "Five products, two platforms. Each case record shows what we built, what we built it with, and what runs.",
    extended: {
      vaaz: "Time calculation, location, and the notification pipeline on one Expo base.",
      akitle: "One product from editor to signature to legal archive.",
      linkden: "Search, save, organize — keyboard first.",
      characterdex: "Type profiles, tests, and the collection in one panel.",
      oasis: "Real screens land in this record as they're ready.",
    },
  },
  // Case-study shared anatomy (T23) — template-wide labels, mirrors tr.ts.
  caseTemplate: {
    statusFlag: { live: "LIVE", inDev: "IN DEV" },
    sections: {
      context: { eyebrow: "01 — context", heading: "Context" },
      build: { eyebrow: "02 — build", heading: "What we built" },
      telemetry: { eyebrow: "03 — telemetry", heading: "Telemetry" },
      outcome: { eyebrow: "04 — outcome", heading: "Outcome" },
      roadStatus: { eyebrow: "04 — road status", heading: "Road status" },
      contact: { eyebrow: "05 — contact / bay-06" },
    },
    metaRailKeys: { status: "status", version: "version", platform: "platform", stack: "stack" },
    // Row 1 (durum/status) only — rows 2-4 are fully data-driven per case (lib/cases.tsx
    // telemetryExtra), since Oasis substitutes monitoring/target/record for
    // monitoring/shipping/live.
    telemetryKeys: { status: "status" },
    pager: { prevCaption: "previous unit", nextCaption: "next unit" },
    metaRailAria: "Unit telemetry strip",
    telemetryAria: "Operations telemetry",
  },
  // Services (T25) — verbatim EN content, mirrors tr.ts.
  servicesPage: {
    eyebrow: "01 — services / what we take on",
    heading: "Built to order.",
    includedLabel: "included",
    details: [
      {
        index: "s/01",
        anchor: "s-01",
        title: "Product engineering",
        body: "One responsibility from scope to shipped: architecture, build, deploy, and post-launch operations.",
        included: ["architecture + technical scope", "build + weekly shipping", "launch + operations"],
      },
      {
        index: "s/02",
        anchor: "s-02",
        title: "Web apps",
        body: "Next.js applications with real backends — from marketing site to full SaaS.",
        included: ["Next.js + Tailwind base", "a real data layer", "a performance budget"],
      },
      {
        index: "s/03",
        anchor: "s-03",
        title: "Mobile apps",
        body: "Expo apps shipped to both stores, with over-the-air updates from day one.",
        included: ["Expo base", "store processes", "an OTA update pipeline"],
      },
      {
        index: "s/04",
        anchor: "s-04",
        title: "Design systems",
        body: "Tokens, components, and documentation a team can maintain without us.",
        included: ["token set + dark mode", "component library", "usage documentation"],
      },
    ],
    modelEyebrow: "02 — engagement model / how it runs",
    steps: [
      "01 brief — a reply within 48 hours",
      "02 scope — fixed quote, explicit deliverables",
      "03 build — a weekly shipping rhythm",
      "04 launch — rehearsal, then live",
      "05 operations — monitoring and maintenance stay with us",
    ],
    kvAriaLabel: "Engagement model summary",
    kvModel: { key: "model", value: "fixed scope or ongoing" },
    kvCapacity: { key: "capacity", value: "01 open slot" },
    kvStart: { key: "start", value: "by calendar" },
    contactEyebrow: "03 — contact / bay-06",
  },
  // Studio (T26) — verbatim EN content, mirrors tr.ts.
  studioPage: {
    eyebrow: "01 — studio / who is dmrc",
    heading: "One founder. A five-product fleet.",
    lede: "DMRC is a one-founder product studio working from Bursa for anywhere. Erkam Demirci — full-stack developer and UI designer — runs design, code, and operations end to end.",
    principlesEyebrow: "02 — principles / how we work",
    principles: [
      { index: "p/01", title: "End to end", body: "Design, code, shipping, and operations in one pair of hands; no middle layer." },
      { index: "p/02", title: "Few, but live", body: "We take little on at once; everything we take on lives in production." },
      { index: "p/03", title: "Measured things talk", body: "We don't claim what we don't measure; telemetry isn't decoration." },
      { index: "p/04", title: "Ship it, keep it", body: "What we ship, we maintain — client work included." },
    ],
    registerEyebrow: "03 — fleet register / five units",
    registerAria: "Fleet register — five units",
    statsEyebrow: "04 — telemetry / the numbers",
    statsAria: "Studio numbers",
    founderStat: { value: "01", caption: "founder — on every line" },
    contactEyebrow: "05 — contact / bay-06",
  },
  // Contact (T27) — verbatim EN content, mirrors tr.ts.
  contactPage: {
    eyebrow: "01 — contact / bay-06",
    protocolHeading: "Response protocol",
    steps: [
      "01 brief — an email is enough, no template",
      "02 review — a written reply within 48 hours",
      "03 call — a 30-minute call if it fits; the quote arrives in writing",
    ],
  },
} as const;

/**
 * Turkish dictionary — TR is the default/canonical locale (01-design-system.md §Localization).
 * Strings are stored in SOURCE case, never pre-uppercased — the mono-label uppercase transform
 * is a CSS `text-transform: uppercase` rule so `lang="tr"` drives correct İ/I casing (01 §Typography).
 * Shared-chrome content only (G1/G2) — verbatim from 03-screens-and-flows.md §G1/§G2 and
 * 02-components.md §C24. Page-level dictionaries land with their screens (T21+).
 */
export const tr = {
  lang: "tr",
  skipLink: "İçeriğe atla",
  wordmark: {
    name: "DMRC",
    descriptor: "/ ürün stüdyosu",
  },
  nav: {
    work: "İşler",
    services: "Hizmetler",
    studio: "Stüdyo",
    cta: "Proje başlat",
  },
  modeChip: {
    dark: "mod / koyu",
    light: "mod / açık",
    ariaToLight: "Açık temaya geç",
    ariaToDark: "Koyu temaya geç",
  },
  localeChip: {
    label: "dil / tr",
    ariaSwitch: "İngilizce sürüme geç",
  },
  footer: {
    cells: {
      studio: { key: "stüdyo", value: "DMRC — Erkam Demirci'nin stüdyosu" },
      base: { key: "üs", value: "Bursa, TR → dünya geneli" },
      fleet: { key: "filo", value: "filoda 05 ürün" },
      stack: { key: "yığın", value: "web & mobil" },
      channel: { key: "kanal", value: "hello@erkamdemirci.com" },
      status: { key: "durum", value: "operasyonel" }, // dot is CSS-drawn (C11), not text
    },
    copyright: "© 2026 DMRC · erkamdemirci.com",
    sheetLine: "sayfa 01/01 · rev B · machine shop",
  },
  // Home (T21, 03-screens-and-flows.md §1) — verbatim TR content. Named keys (not arrays) so
  // grep-based acceptance checks can pin exact strings and so the `as const` + Dictionary
  // Widen<> machinery (lib/i18n/get-dictionary.ts) never has to widen a tuple-of-differently-
  // shaped-literals; card/cell lists are assembled into arrays at render time in the page.
  home: {
    eyebrow: "DMRC — ürün stüdyosu · Bursa, TR → dünya geneli",
    // h1 is split so the JSX can insert the aria-hidden CSS cursor block ("h1 .cursor" in the
    // mockup — an empty span, never a literal glyph) between the two halves without affecting
    // the rendered textContent: h1Lead + h1Turn === "Kendi ürünlerimizi geliştiriyoruz — ve sizinkini."
    h1Lead: "Kendi ürünlerimizi geliştiriyoruz — ",
    h1Turn: "ve sizinkini.",
    lede: "Beş ürünümüz filoda — dördü üretimde, biri geliştirmede — her gün izleniyor. Müşteri işleri aynı atölyeden geçer: tasarlanır, inşa edilir, sevk edilir ve canlı tutulur — web ve mobil.",
    email: "hello@erkamdemirci.com",
    fleetReadoutAria: "Filo durumu okuması",
    statRailAria: "Stüdyo rakamları",
    fleet: {
      eyebrow: "01 — işler / üretimde kanıt",
      heading: "Filo, canlı yayında.",
      side: "Aşağıdaki her ünite gerçek kullanıcılarla çalışan kendi ürünümüz. Ne sevkettiysek bakımını da yaparız — müşteri işleri aynı telemetriyi alır.",
    },
    cards: {
      vaaz: {
        unitLabel: "unit-01 · VAAZ",
        flag: "CANLI",
        meta: "v2.4 · iOS · Android",
        title: "VAAZ",
        description: "Namaz vakitleri, günlük takip ve vaaz içeriği tek yol arkadaşında.",
        domain: "getvaaz.com",
        rating: "4,9",
        ratingSuffix: "mağaza puanı",
      },
      akitle: {
        unitLabel: "unit-02 · AKITLE",
        flag: "CANLI",
        meta: "v3.1 · Web",
        title: "Akitle",
        description: "Kira sözleşmeleri tek akışta hazırlanır, imzalanır ve arşivlenir.",
        domain: "akitle.com",
        telLine2: "kira sözleşmesi SaaS'ı",
      },
      linkden: {
        unitLabel: "unit-03 · LINKDEN",
        flag: "CANLI",
        meta: "v1.8 · Web",
        title: "Linkden",
        description: "Tarif ettiği kodun hemen yanında yaşayan dokümantasyon.",
        domain: "linkden.co",
        telLine2: "geliştirici ekipler için",
      },
      characterdex: {
        unitLabel: "unit-04 · CHARACTERDEX",
        flag: "CANLI",
        meta: "v2.0 · Web",
        title: "CharacterDex",
        description: "Koleksiyonluk kehanet kartı sistemiyle kişilik tipleri.",
        domain: "characterdex.com",
        telLine2: "web uygulaması",
      },
      oasis: {
        unitLabel: "unit-05 · OASIS AND MIND",
        flag: "GELİŞTİRMEDE",
        meta: "v0.9 · Mobil",
        title: "Oasis and Mind",
        description: "Günlük sağlıklı yaşam ritüelleri etrafında kurulmuş bir bakım oyunu.",
        telLine1: "geliştirmede",
        telLine2: "mobil · iki mağaza",
        slotTitle: "Ekran yuvası",
        slotBody: "Oasis bakım ekranı — sıcak krem arayüz",
      },
    },
    bay06: {
      slotLabel: "slot-06 · rezerve",
      capacityLabel: "kapasite: 01",
      title: "Ürününüz burada çalışır.",
      body: "Aynı anda az sayıda müşteri işi alırız ve kendi ürünümüz gibi işletiriz — aynı yığın, aynı izleme, aynı standartlar.",
      note: "sıradaki slot: müsait",
    },
    services: {
      eyebrow: "02 — hizmetler / neler üstleniyoruz",
      heading: "Sipariş üzerine inşa.",
      side: "Sabit kapsam ya da aylık. Her iş, sunum değil çalışan bir şey sevk eder.",
      ctaLabel: "Hizmetlerin tamamı",
      cellOne: {
        index: "s/01",
        title: "Ürün mühendisliği",
        body: "Kapsamdan sevkiyata: mimari, geliştirme, dağıtım ve lansman sonrası operasyon.",
      },
      cellTwo: {
        index: "s/02",
        title: "Web uygulamaları",
        body: "Gerçek arka uçlu Next.js uygulamaları — tanıtım sitesinden tam SaaS'a.",
      },
      cellThree: {
        index: "s/03",
        title: "Mobil uygulamalar",
        body: "İki mağazaya da sevk edilen, ilk günden OTA güncellemeli Expo uygulamaları.",
      },
      cellFour: {
        index: "s/04",
        title: "Tasarım sistemleri",
        body: "Bir ekibin bizsiz sürdürebileceği token'lar, bileşenler ve dokümantasyon.",
      },
    },
    studio: {
      eyebrow: "03 — stüdyo / dmrc kimdir",
      heading: "Tek kurucu. Beş ürünlük filo.",
      lede: "DMRC, Erkam Demirci'nin ürün stüdyosu. Küçük kalır, uçtan uca inşa eder, sevk ettiğini işletir.",
      ctaLabel: "Stüdyoyu tanı",
    },
    statRail: {
      products: { value: "05", caption: "ürün filoda" },
      platforms: { value: "02", caption: "platform — web & mobil" },
      response: { value: "<48", suffix: "sa", caption: "yeni briflere yanıt" },
      openSlot: { value: "01", caption: "açık slot — slot-06" },
    },
    contactBand: {
      eyebrow: "04 — iletişim / slot-06",
      heading: "Slot 06 boş.",
      lede: "Ne inşa ettiğinizi anlatın — aşama, platform ve sizin için 'bitti'nin ne olduğu. Her brifi okuyor, 48 saat içinde yanıtlıyoruz.",
      accentLabel: "Proje başlat",
      ghostLabel: "Filoyu gör",
      kvAriaLabel: "İletişim bilgileri",
      kvEmail: { key: "e-posta", value: "hello@erkamdemirci.com" },
      kvBase: { key: "üs", value: "Bursa, Türkiye → dünya geneli" },
      kvResponse: { key: "yanıt", value: "< 48 sa · iş günleri" },
      kvStack: { key: "yığın", value: "Next.js · Expo · Convex" },
    },
  },
  // Work index (T22, 03-screens-and-flows.md §2) — verbatim TR content. Reuses `home.cards`
  // for the base card copy; `extended` holds the second sentence appended per card.
  workIndex: {
    eyebrow: "01 — işler / tüm filo",
    heading: "Tüm filo kaydı.",
    side: "Beş ürün, iki platform. Her vaka kaydı ne inşa ettiğimizi, neyle inşa ettiğimizi ve neyin çalıştığını gösterir.",
    extended: {
      vaaz: "Vakit hesabı, konum ve bildirim akışı tek Expo tabanında.",
      akitle: "Editörden imzaya, hukuki arşive kadar tek ürün.",
      linkden: "Arama, kaydetme ve organizasyon — klavye öncelikli.",
      characterdex: "Tip profilleri, testler ve koleksiyon tek panelde.",
      oasis: "Gerçek ekranlar hazır oldukça bu kayda düşer.",
    },
  },
} as const;

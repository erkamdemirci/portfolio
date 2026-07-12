/**
 * Turkish dictionary — TR is the default/canonical locale. Authoritative de-themed copy
 * (T23; 03-screens-and-flows.md §THE AUTHORITATIVE COPY). Every string carries its own source
 * case — no CSS re-casing (01 §Typography TR-casing rule). The old machine-shop metaphor
 * vocabulary is removed from every VALUE (banned-string gate, 05).
 *
 * Some keys are retained but soon-unused (cards.*.unitLabel, home.fleet.*, the numbered
 * eyebrows, notFound.chipFlag/readoutNote) so the not-yet-migrated page bodies keep compiling
 * through M3; each is dropped as its page migrates (T38–T43). en.ts mirrors this structure
 * key-for-key (the Dictionary type is Widen<typeof tr>, so both locales stay aligned).
 */
export const tr = {
  lang: "tr",
  skipLink: "İçeriğe atla",
  wordmark: {
    name: "DMRC",
    descriptor: "/ web ve ürün stüdyosu",
  },
  nav: {
    work: "İşler",
    services: "Hizmetler",
    studio: "Stüdyo",
    blog: "Blog",
    cta: "Teklif al",
  },
  modeChip: {
    ariaToLight: "Açık temaya geç",
    ariaToDark: "Koyu temaya geç",
  },
  localeChip: {
    label: "TR",
    ariaSwitch: "İngilizce sürüme geç",
  },
  footer: {
    copyright: "© 2026 DMRC · erkamdemirci.com",
    brand: "DMRC — Erkam Demirci'nin web ve ürün stüdyosu",
    contact: "hello@erkamdemirci.com · Bursa, Türkiye",
  },
  // Home (03 §1). Named keys (not arrays) so grep pins exact strings and the as-const Widen<>
  // machinery never widens a tuple of differently-shaped literals; card/cell lists are
  // assembled into arrays at render time in the page.
  home: {
    eyebrow: "DMRC — Bursa merkezli web tasarım ve ürün stüdyosu",
    // h1 is split so the JSX can wrap the second half in the italic-ever "turn" span
    // (01 §Signature) without a literal <em> in the source string:
    // h1Lead + h1Turn === "Kurumsal web siteleri ve mobil uygulamalar geliştiriyoruz — kendi ürünlerimizi kurar gibi."
    h1Lead: "Kurumsal web siteleri ve mobil uygulamalar geliştiriyoruz — ",
    h1Turn: "kendi ürünlerimizi kurar gibi.",
    lede: "Markanız için kurumsal web siteleri ve mobil uygulamalar tasarlıyor ve geliştiriyoruz. Kendi ürünlerimizi uçtan uca kurduğumuz için, sizin projenizi de aynı tasarım ve mühendislik disiplininde ele alıyoruz.",
    email: "hello@erkamdemirci.com",
    fleetReadoutAria: "Ürünlerimiz",
    statRailAria: "Sayılarla stüdyo",
    fleet: {
      eyebrow: "İşler",
      heading: "Üretimdeki işler.",
      side: "Aşağıdaki her ürün gerçek kullanıcılarla çalışıyor. Ne yayınladıysak bakımını da biz üstleniyoruz — müşteri projeleri de aynı standarttan geçer.",
    },
    cards: {
      vaaz: {
        unitLabel: "VAAZ",
        flag: "Canlı",
        meta: "v2.4 · iOS · Android",
        title: "VAAZ",
        description: "Namaz vakitleri, günlük takip ve vaaz içeriği tek uygulamada.",
        domain: "getvaaz.com",
        rating: "4,9",
        ratingSuffix: "mağaza puanı",
      },
      akitle: {
        unitLabel: "Akitle",
        flag: "Canlı",
        meta: "v3.1 · Web",
        title: "Akitle",
        description: "Kira sözleşmeleri tek akışta hazırlanır, imzalanır ve arşivlenir.",
        domain: "akitle.com",
        telLine2: "kurumsal web uygulaması",
      },
      linkden: {
        unitLabel: "Linkden",
        flag: "Canlı",
        meta: "v1.8 · Web",
        title: "Linkden",
        description: "Yazdığı kodun hemen yanında yaşayan dokümantasyon.",
        domain: "linkden.co",
        telLine2: "geliştirici ekipler için",
      },
      characterdex: {
        unitLabel: "CharacterDex",
        flag: "Canlı",
        meta: "v2.0 · Web",
        title: "CharacterDex",
        description: "Koleksiyonluk kart sistemiyle kişilik tipleri.",
        domain: "characterdex.com",
        telLine2: "web uygulaması",
      },
      oasis: {
        unitLabel: "Oasis and Mind",
        flag: "Geliştirmede",
        meta: "v0.9 · Mobil",
        title: "Oasis and Mind",
        description: "Günlük sağlıklı yaşam ritüelleri etrafında kurulan bir bakım oyunu.",
        telLine1: "geliştirmede",
        telLine2: "mobil · iki mağaza",
        slotTitle: "Görsel yakında",
        slotBody: "Oasis ana ekranı — sıcak krem arayüz",
      },
    },
    // Open-slot invitation (03: the old reserved-cell key becomes openSlot). OpenSlotCell (T28)
    // consumes {label, title, body, cta}; interim ReservedBay callers pass "" for dropped fields.
    openSlot: {
      label: "Açık yer",
      title: "Sıradaki proje sizinki olabilir.",
      body: "Aynı anda az sayıda müşteri projesi alıyor ve her birini kendi ürünümüz gibi işletiyoruz — aynı özen, aynı standart.",
      cta: "Teklif al",
    },
    services: {
      eyebrow: "Hizmetler",
      heading: "Uçtan uca dijital hizmetler.",
      side: "Sabit kapsam ya da aylık çalışma. Her iş, sunum değil çalışan bir şey teslim eder.",
      ctaLabel: "Hizmetlerin tamamı",
      cellOne: {
        index: "s/01",
        title: "Web tasarım ve geliştirme",
        body: "Markanıza özel arayüz, gerçek arka uç ve performans bütçesiyle kurulan modern web siteleri.",
      },
      cellTwo: {
        index: "s/02",
        title: "Kurumsal web siteleri",
        body: "Şirketinizi doğru anlatan, hızlı ve kolay yönetilen kurumsal siteler; SEO ve erişilebilirlik ilk günden içeride.",
      },
      cellThree: {
        index: "s/03",
        title: "Mobil uygulama",
        body: "iOS ve Android'e tek kod tabanından çıkan, mağaza süreçleri ve OTA güncellemeleriyle işletilen uygulamalar.",
      },
      cellFour: {
        index: "s/04",
        title: "Kurumsal kimlik ve tasarım sistemleri",
        body: "Logodan tipografiye ve bileşen kütüphanesine, ekibinizin bizsiz sürdürebileceği tutarlı bir sistem.",
      },
    },
    studio: {
      eyebrow: "Stüdyo",
      heading: "Tek kurucu, uçtan uca üretim.",
      lede: "DMRC, Erkam Demirci'nin web ve ürün stüdyosu. Küçük kalır, işi uçtan uca kurar ve yayınladığını işletir.",
      ctaLabel: "Stüdyoyu tanıyın",
    },
    statRail: {
      products: { value: "05", caption: "ürün" },
      platforms: { value: "02", caption: "platform — web & mobil" },
      response: { value: "<48", suffix: "sa", caption: "yeni projelere yanıt" },
      openSlot: { value: "01", caption: "açık proje yeri" },
    },
    contactBand: {
      eyebrow: "İletişim",
      // heading is the plain full string (interim band renders it as-is); headingTurn is the
      // clause the T32 band italicises inside it (works both locales — substring match).
      heading: "Bir sonraki projeniz için hazırız.",
      headingTurn: "Bir sonraki projeniz için",
      lede: "Ne inşa etmek istediğinizi anlatın — aşama, platform ve sizin için 'bitti'nin ne demek olduğunu. Her mesajı okuyor, 48 saat içinde yanıtlıyoruz.",
      accentLabel: "Teklif al",
      ghostLabel: "İşleri gör",
      kvAriaLabel: "İletişim bilgileri",
      kvEmail: { key: "e-posta", value: "hello@erkamdemirci.com" },
      kvBase: { key: "konum", value: "Bursa, Türkiye → dünya geneli" },
      kvResponse: { key: "yanıt", value: "< 48 sa · iş günleri" },
      kvStack: { key: "yığın", value: "Next.js · Expo · Convex" },
    },
  },
  // Work index (03 §2). Reuses home.cards for base copy; `extended` is the appended sentence.
  workIndex: {
    eyebrow: "İşler",
    heading: "Kurduğumuz işler.",
    side: "Beş ürün, iki platform. Her kayıt ne inşa ettiğimizi, neyle inşa ettiğimizi ve neyin çalıştığını gösterir.",
    extended: {
      vaaz: "Vakit hesabı, konum ve bildirim akışı tek Expo tabanında.",
      akitle: "Editörden imzaya ve arşive kadar tek ürün.",
      linkden: "Arama, kaydetme ve düzenleme — klavye öncelikli.",
      characterdex: "Tip profilleri, testler ve koleksiyon tek panelde.",
      oasis: "Gerçek ekranlar hazır oldukça bu kayda eklenecek.",
    },
  },
  // Case-study shared anatomy (03 §3). Section KEY names (context/build/telemetry/outcome)
  // are kept for the interim case page; only VALUES are de-themed (telemetry → "Ayrıntılar").
  caseTemplate: {
    statusFlag: { live: "Canlı", inDev: "Geliştirmede" },
    sections: {
      context: { eyebrow: "Bağlam", heading: "Bağlam" },
      build: { eyebrow: "İnşa", heading: "İnşa ettiklerimiz" },
      telemetry: { eyebrow: "Ayrıntılar", heading: "Ayrıntılar" },
      outcome: { eyebrow: "Sonuç", heading: "Sonuç" },
      roadStatus: { eyebrow: "Yol durumu", heading: "Yol durumu" },
      contact: { eyebrow: "İletişim" },
    },
    metaRailKeys: { status: "durum", version: "sürüm", platform: "platform", stack: "yığın" },
    telemetryKeys: { status: "durum" },
    pager: { prevCaption: "Önceki", nextCaption: "Sonraki" },
    metaRailAria: "Ürün künyesi",
    telemetryAria: "Ürün ayrıntıları",
  },
  // Services (03 §4). Grid cells reuse home.services.cell*; `details` carries the page's own
  // per-offer copy + the 3-item "dahil olanlar" list; `faq` feeds the FAQ band + FAQPage (T67).
  servicesPage: {
    eyebrow: "Hizmetler",
    heading: "Web tasarım ve dijital ürün hizmetleri.",
    intro: "Markanız için web sitesinden mobil uygulamaya, kurumsal kimlikten tasarım sistemine kadar; tasarımı ve geliştirmeyi tek ekiple yürütüyoruz.",
    includedLabel: "dahil olanlar",
    details: [
      {
        index: "s/01",
        anchor: "web-tasarim-gelistirme",
        title: "Web tasarım ve geliştirme",
        body: "Kapsamdan yayına tek sorumluluk: mimari, tasarım, geliştirme ve lansman sonrası bakım.",
        included: ["mimari + teknik kapsam", "tasarım + haftalık sürüm", "yayın + bakım"],
      },
      {
        index: "s/02",
        anchor: "kurumsal-web-siteleri",
        title: "Kurumsal web siteleri",
        body: "Şirketinizi doğru anlatan, hızlı ve yönetilebilir kurumsal siteler.",
        included: ["içerik yönetimi", "SEO temeli", "erişilebilirlik (AA)"],
      },
      {
        index: "s/03",
        anchor: "mobil-uygulama",
        title: "Mobil uygulama",
        body: "iOS ve Android'e tek kod tabanından çıkan Expo uygulamaları.",
        included: ["Expo tabanı", "mağaza süreçleri", "OTA güncelleme hattı"],
      },
      {
        index: "s/04",
        anchor: "kurumsal-kimlik",
        title: "Kurumsal kimlik ve tasarım sistemleri",
        body: "Logo, tipografi ve bileşen kütüphanesiyle sürdürülebilir bir marka sistemi.",
        included: ["logo + kurumsal kimlik", "token seti + karanlık mod", "bileşen kütüphanesi + doküman"],
      },
    ],
    modelEyebrow: "Çalışma modelimiz",
    steps: [
      "01 Brief — 48 saat içinde yanıt",
      "02 Kapsam — sabit teklif, net teslimler",
      "03 Geliştirme — haftalık sürüm ritmi",
      "04 Lansman — prova, sonra yayın",
      "05 Bakım — izleme ve güncelleme bizde",
    ],
    kvAriaLabel: "Çalışma modeli özeti",
    kvModel: { key: "model", value: "sabit kapsam ya da aylık" },
    kvCapacity: { key: "kapasite", value: "01 açık yer" },
    kvStart: { key: "başlangıç", value: "takvime göre" },
    contactEyebrow: "İletişim",
    faq: [
      {
        q: "Web tasarım ve geliştirme neleri kapsar?",
        a: "Markanıza özel arayüz tasarımı, gerçek bir arka uçla geliştirme, yayına alma ve lansman sonrası bakımı kapsar. Tanıtım sitesinden tam kapsamlı bir uygulamaya kadar süreci tek ekip uçtan uca yürütür.",
      },
      {
        q: "Neden DMRC ile çalışmalısınız?",
        a: "Çünkü kendi ürünlerimizi kurup işletiyoruz; dördü şu anda gerçek kullanıcılarla canlı. Aynı tasarım ve mühendislik disiplinini, aracı katman olmadan doğrudan sizin projenize taşıyoruz.",
      },
      {
        q: "Bir proje nasıl ilerler?",
        a: "Kısa bir brief ile başlar, sabit kapsamlı bir teklifle netleşir, haftalık sürümlerle geliştirilir ve prova sonrası yayına alınır. Yayından sonra izleme ve bakım bizde kalır.",
      },
      {
        q: "Fiyatlar nasıl belirlenir?",
        a: "Sabit paket fiyatı vermiyoruz; her proje kapsamına, entegrasyonlarına ve zaman çizgisine göre fiyatlanır. Kısa bir brief sonrası net ve yazılı bir teklif paylaşıyoruz — 48 saat içinde.",
      },
    ],
  },
  // Studio (03 §5).
  studioPage: {
    eyebrow: "Stüdyo",
    heading: "Tek kurucu. Beş ürün. Uçtan uca.",
    lede: "DMRC, Bursa'dan dünyaya çalışan tek kuruculu bir web ve ürün stüdyosu. Erkam Demirci — full-stack geliştirici ve arayüz tasarımcısı — tasarımı, kodu ve operasyonu tek elden yürütür.",
    principlesEyebrow: "İlkeler",
    principles: [
      { index: "p/01", title: "Uçtan uca", body: "Tasarım, kod, yayın ve bakım tek elden; ara katman yok." },
      { index: "p/02", title: "Az ama canlı", body: "Aynı anda az iş alırız; aldığımız her iş üretimde yaşar." },
      { index: "p/03", title: "Ölçtüğümüzü konuşuruz", body: "Ölçmediğimiz şeyi iddia etmeyiz; rakamlar süsleme değildir." },
      { index: "p/04", title: "Yayınlayan bakar", body: "Ne yayınladıysak bakımı bizdedir — müşteri işleri dahil." },
    ],
    registerEyebrow: "Ürünler",
    registerAria: "Ürünler",
    statsEyebrow: "Sayılar",
    statsAria: "Sayılarla stüdyo",
    founderStat: { value: "01", caption: "kurucu — her satırda" },
    contactEyebrow: "İletişim",
  },
  // Contact (03 §6). Interim band reuses home.contactBand; the new page (T50) uses heading/lede
  // + the form/actions/KVKK strings below (also feed ContactForm/ContactActions in M4).
  contactPage: {
    eyebrow: "İletişim",
    heading: "Projeniz için teklif alın.",
    lede: "Ne inşa etmek istediğinizi birkaç cümleyle anlatın; en doğru başlangıç noktasını birlikte bulalım. Her mesaja 48 saat içinde yazılı yanıt veriyoruz.",
    protocolHeading: "Yanıt protokolü",
    steps: [
      "01 Brief — e-posta ya da form yeterli, şablon yok",
      "02 Değerlendirme — 48 saat içinde yazılı yanıt",
      "03 Görüşme — uygunsa 30 dakikalık arama; teklif yazılı gelir",
    ],
    form: {
      nameLabel: "Ad soyad",
      emailLabel: "E-posta",
      phoneLabel: "Telefon (opsiyonel)",
      messageLabel: "Mesaj",
      hint: "projenizi kısaca anlatın",
      submit: "Gönder",
      successTitle: "Aldık, teşekkürler.",
      successBody: "48 saat içinde yanıtlıyoruz.",
      errorText: "Gönderilemedi — doğrudan e-posta ile ulaşabilirsiniz:",
    },
    actions: { email: "E-posta", call: "Ara", whatsapp: "WhatsApp" },
    kvkkConsent: "Kişisel verilerimin, talebimi yanıtlamak amacıyla KVKK kapsamında işlenmesini onaylıyorum.",
    kvkkDisclosureToggle: "Aydınlatma metnini oku",
    kvkkDisclosure: "Bu form aracılığıyla paylaştığınız ad, e-posta ve mesaj bilgileri yalnızca talebinizi yanıtlamak için işlenir, üçüncü taraflarla paylaşılmaz ve talebiniz sonuçlandıktan sonra makul süre içinde silinir. Veri sorumlusu: DMRC — Erkam Demirci (hello@erkamdemirci.com).",
    kvkkBlocked: "Devam etmek için aydınlatma onayını işaretleyin.",
  },
  // 404 (03 §9). heading/genericPath/homeLabel/workLabel feed the new NotFound (T37);
  // chipFlag/readoutNote stay de-themed only for the interim g3-not-found until T43.
  notFound: {
    chipFlag: "404",
    heading: "Aradığınız sayfa burada değil.",
    genericPath: "/istenen-sayfa",
    readoutNote: "",
    homeLabel: "Ana sayfaya dön",
    workLabel: "İşleri gör",
  },
} as const;

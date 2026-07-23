/**
 * Turkish dictionary — TR is the default/canonical locale. Authoritative de-themed copy;
 * every string carries its own source case — no CSS re-casing (01 §Typography TR-casing rule).
 *
 * 2026-07 "Tek Kalemde" scroll-film rebuild: home.* is the film's copy (chapters 01–05 +
 * finale). The work/case/studio surfaces retired with their pages (no products are shown
 * until the projects section returns), so cards/fleet/statRail/workIndex/caseTemplate/
 * studioPage keys left with them. servicesPage / contactPage / notFound / contactBand are
 * carried over verbatim (ranking + legal copy). en.ts mirrors this structure key-for-key
 * (the Dictionary type is Widen<typeof tr>).
 */
export const tr = {
  lang: "tr",
  skipLink: "İçeriğe atla",
  wordmark: {
    name: "DMRC",
    descriptor: "/ yazılım stüdyosu",
  },
  nav: {
    services: "Hizmetler",
    blog: "Blog",
    contact: "İletişim",
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
    brand: "DMRC — Erkam Demirci'nin yazılım stüdyosu",
    email: "hello@erkamdemirci.com",
    location: "Bursa, Türkiye → dünya geneli",
  },
  // Home = the scroll-film. One unbroken cobalt stroke travels the whole page:
  // hero underline → web baseline/frame → phone outline → custom route → principles rail →
  // portrait ring + signature (the pen lifts for the first time) → the finale hands the
  // pen to the client. Copy below is the film's entire voice.
  home: {
    eyebrow: "Yazılım stüdyosu — Bursa'dan dünyaya",
    h1: "Web siteleri, mobil uygulamalar ve özel yazılım — uçtan uca, tek elden.",
    scrollCue: "Kaydır",
    filmAria: "DMRC stüdyo filmi",
    web: {
      label: "01 — Web",
      word: "WEB SİTELERİ",
      beat: "Markanızı gerçekten taşıyan siteler: hızlı, erişilebilir, ölçülebilir. Tasarımdan yayına aynı el.",
      tags: "kurumsal · e-ticaret · yayın platformları",
    },
    mobile: {
      label: "02 — Mobil",
      word: "MOBİL UYGULAMALAR",
      beat: "Tek kod tabanından iOS ve Android'e. Mağaza süreçleri dahil — fikirden indirilebilir uygulamaya.",
      tags: "iOS · Android · mağazaya teslim",
    },
    custom: {
      label: "03 — Özel yazılım",
      word: "ÖZEL YAZILIM",
      beat: "Şablonun bittiği yerde başlarız. Yönetim panelleri, otomasyonlar, entegrasyonlar — işinize göre biçilir.",
      tags: "panel · otomasyon · entegrasyon",
    },
    how: {
      label: "04 — Nasıl",
      heading: "Nasıl çalışırız",
      stations: [
        { idx: "01", title: "Uçtan uca", body: "Tasarım, kod, yayın ve bakım aynı elde. Arada kaybolan katman yok." },
        { idx: "02", title: "Az iş, tam odak", body: "Aynı anda az proje alırız; her biri tam dikkat görür." },
        { idx: "03", title: "Ölçülü söz", body: "Ölçmediğimiz hiçbir şeyi vaat etmeyiz. Rakamlar süs değildir." },
        { idx: "04", title: "Yayından sonra da buradayız", body: "Yayınladığımızı işletir, bakımını üstleniriz — müşteri işleri dahil." },
      ],
    },
    who: {
      label: "05 — Kim",
      name: "Erkam Demirci",
      role: "Kurucu — tasarım, kod ve operasyon",
      line: "Bursa'dan dünyaya. Her satırda aynı imza.",
      portraitAlt: "Erkam Demirci — DMRC'nin kurucusu",
    },
    finale: {
      label: "06 — Sıra sizde",
      display: "Sıra sizin projenizde.",
      lede: "Ne inşa etmek istediğinizi anlatın — 48 saat içinde yazılı yanıt alırsınız.",
      cta: "Teklif al",
      emailLead: "ya da doğrudan yazın:",
      email: "hello@erkamdemirci.com",
      capacity: "01 açık proje yeri",
      marquee: "web siteleri — mobil uygulamalar — özel yazılım —",
    },
    contactBand: {
      eyebrow: "İletişim",
      heading: "Bir sonraki projeniz için hazırız.",
      headingTurn: "Bir sonraki projeniz için",
      lede: "Ne inşa etmek istediğinizi anlatın — aşama, platform ve sizin için 'bitti'nin ne demek olduğunu. Her mesajı okuyor, 48 saat içinde yanıtlıyoruz.",
      accentLabel: "Teklif al",
      ghostLabel: "Hizmetlere bak",
      kvAriaLabel: "İletişim bilgileri",
      kvEmail: { key: "e-posta", value: "hello@erkamdemirci.com" },
      kvBase: { key: "konum", value: "Bursa, Türkiye → dünya geneli" },
      kvResponse: { key: "yanıt", value: "< 48 sa · iş günleri" },
      kvStack: { key: "yığın", value: "Next.js · Expo · Convex" },
    },
  },
  // Services (03 §4). `details` carries the page's own per-offer copy + the 3-item
  // "dahil olanlar" list; `faq` feeds the FAQ band + FAQPage (T67).
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
  // Contact (03 §6).
  contactPage: {
    eyebrow: "İletişim",
    heading: "Projeniz için teklif alın.",
    lede: "Ne inşa etmek istediğinizi birkaç cümleyle anlatın; en doğru başlangıç noktasını birlikte bulalım. Her mesaja 48 saat içinde yazılı yanıt veriyoruz.",
    protocolHeading: "Yanıt protokolü",
    formAria: "İletişim formu",
    factsAria: "İletişim bilgileri",
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
      sending: "Gönderiliyor…",
      nameRequired: "Ad soyadınızı girin.",
      emailInvalid: "Geçerli bir e-posta girin.",
      messageRequired: "Kısa bir mesaj yazın.",
      mailtoSubject: "Web projesi teklif talebi",
      reset: "Başka bir mesaj gönder",
    },
    actions: { email: "E-posta", call: "Ara", whatsapp: "WhatsApp" },
    kvkkConsent: "Kişisel verilerimin, talebimi yanıtlamak amacıyla KVKK kapsamında işlenmesini onaylıyorum.",
    kvkkDisclosureToggle: "Aydınlatma metnini oku",
    kvkkDisclosure: "Bu form aracılığıyla paylaştığınız ad, e-posta ve mesaj bilgileri yalnızca talebinizi yanıtlamak için işlenir, üçüncü taraflarla paylaşılmaz ve talebiniz sonuçlandıktan sonra makul süre içinde silinir. Veri sorumlusu: DMRC — Erkam Demirci (hello@erkamdemirci.com).",
    kvkkBlocked: "Devam etmek için aydınlatma onayını işaretleyin.",
  },
  // 404 (03 §9). The old "İşleri gör" secondary now points at services (work retired).
  notFound: {
    chipFlag: "404",
    heading: "Aradığınız sayfa burada değil.",
    genericPath: "/istenen-sayfa",
    readoutNote: "",
    homeLabel: "Ana sayfaya dön",
    servicesLabel: "Hizmetlere bak",
  },
} as const;

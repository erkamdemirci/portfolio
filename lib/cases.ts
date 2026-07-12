import type { StatusVariant } from "@/components/ui/status-chip";
import type { Lang } from "@/lib/i18n/routes";

/**
 * Case data model (T23/T24, 03-screens-and-flows.md §Case-study shared anatomy + §3-7;
 * 04-tasks.md T23/T24). One typed record per fleet unit. Structural fields (frame kind,
 * image dimensions, slot bar geometry) are locale-independent; everything textual lives
 * under `locale.tr` / `locale.en`. `owner-verify` stack values (06-risks-and-assumptions.md
 * §Planning-invented facts) render exactly as provided — this module has no opinion on that
 * marker.
 *
 * Deliberately plain data (`.ts`, no JSX) — VAAZ's outcome and every standard case's
 * "canlı/live" telemetry row need rich content (bold rating, external mono links), modeled
 * as `ContentSegment[]` here and turned into actual React elements by the one page that reads
 * this module (app/[lang]/work/[slug]/page.tsx), keeping the data/render split clean and
 * matching the pinned `grep -F 'owner-verify' lib/cases.ts` acceptance command's literal path.
 *
 * `UNIT_IDENTITY` covers all five units from the start (unit number/key/display title are
 * fixed fleet facts, not page copy) so the pager always has both circular neighbors even
 * while a page is still being populated.
 */

export type CaseSlug = "vaaz" | "akitle" | "linkden" | "characterdex" | "oasis-and-mind";

/** Case order — the circular pager sequence (03: 01->02->03->04->05->01). */
export const CASE_ORDER: CaseSlug[] = ["vaaz", "akitle", "linkden", "characterdex", "oasis-and-mind"];

export interface UnitIdentity {
  unitNo: string; // "01".."05"
  /** Uppercase product key, kept for the interim case page's labels (removed when the case
   *  template migrates at T40; the new pager uses `title`). Brand-name spelling, not prose. */
  unitKey: string;
  /** Display title — identical spelling in both locales for every case (03 §3-7 confirms). */
  title: string;
}

export const UNIT_IDENTITY: Record<CaseSlug, UnitIdentity> = {
  vaaz: { unitNo: "01", unitKey: "VAAZ", title: "VAAZ" },
  akitle: { unitNo: "02", unitKey: "AKITLE", title: "Akitle" },
  linkden: { unitNo: "03", unitKey: "LINKDEN", title: "Linkden" },
  characterdex: { unitNo: "04", unitKey: "CHARACTERDEX", title: "CharacterDex" },
  "oasis-and-mind": { unitNo: "05", unitKey: "OASIS AND MIND", title: "Oasis and Mind" },
};

interface CaseImageSpec {
  src: string;
  width: number;
  height: number;
}

interface CaseFrameBrowser {
  kind: "browser";
  domain: string;
  image?: CaseImageSpec;
}

interface CaseFramePhone {
  kind: "phone";
  image?: CaseImageSpec;
}

export type CaseFrame = CaseFrameBrowser | CaseFramePhone;

interface CaseFeatureLocaleContent {
  title: string;
  body: string;
  /** Required when `frame.image` is set (01 §Imagery — descriptive, localized alt text). A
   *  feature with no image renders text-forward (03 §3 image map). */
  imageAlt?: string;
}

export interface CaseFeature {
  frame: CaseFrame;
  locale: Record<Lang, CaseFeatureLocaleContent>;
}

/** A plain data description of rich inline content — rendered into real React elements by
 *  app/[lang]/work/[slug]/page.tsx's `renderSegments`. `link` always renders via the site's
 *  ExternalTelLink (mono text + the ArrowUpRight icon, 01 Amendment A5 — never a literal ↗). */
export type ContentSegment = string | { bold: string } | { link: { href: string; label: string } };

export interface CaseTelemetryRow {
  key: string;
  value: string | ContentSegment[];
}

interface CaseLocaleContent {
  claim: string;
  /** Hero C11 chip meta string, e.g. "v3.1 · Web" (version + locale-formatted platform). */
  chipMeta: string;
  metaRail: { version: string; platform: string; stack: string };
  contextBody: string;
  /** Detail rows 2-4 (row 1, "durum/status", is always derived from statusVariant/flag by
   *  the template). Most cases share the same three update/distribution/online keys, but Oasis
   *  (no distribution cadence, no live URL yet) substitutes update/target/record — so keys
   *  travel WITH each row instead of being derived from a shared dict. */
  telemetryExtra: [CaseTelemetryRow, CaseTelemetryRow, CaseTelemetryRow];
  outcomeBody: string | ContentSegment[];
}

export interface CaseRecord {
  slug: CaseSlug;
  statusVariant: StatusVariant;
  /** Exactly two feature blocks per the shared case anatomy (03 §Case-study shared anatomy
   *  section 3 — "İnşa ettiklerimiz / What we built"). */
  features: [CaseFeature, CaseFeature];
  /** Oasis reports "Yol durumu / Road status" instead of "Sonuç / Outcome". */
  isRoadStatus?: boolean;
  locale: Record<Lang, CaseLocaleContent>;
}

// VAAZ store links — real, verified hrefs (recon: getvaaz.com/en download buttons), not
// invented placeholders. 01 named decision: mono text links, no badge images.
const VAAZ_APP_STORE_HREF = "https://apps.apple.com/app/vaaz-pro-ezan-vakti-kuran/id6761720785";
const VAAZ_GOOGLE_PLAY_HREF = "https://play.google.com/store/apps/details?id=com.erkamdmrc.vaaz";

export const cases: Partial<Record<CaseSlug, CaseRecord>> = {
  vaaz: {
    slug: "vaaz",
    statusVariant: "live",
    features: [
      {
        frame: {
          kind: "phone",
          image: { src: "/screens/vaaz/times-390.png", width: 700, height: 728 },
        },
        locale: {
          tr: {
            title: "Vakit ekranı",
            body: "Geri sayım, sonraki vakit kartı ve konuma göre hesap — açılışta tek bakışta.",
            imageAlt: "VAAZ namaz vakti geri sayım ekranı — İstanbul, sonraki vakit kartı",
          },
          en: {
            title: "The times screen",
            body: "Countdown, next-prayer card, and location-based calculation — one glance at launch.",
            imageAlt: "VAAZ prayer-time countdown screen — Istanbul, next-prayer card",
          },
        },
      },
      {
        // No real capture for this feature (recon: getvaaz.com has no distinct daily-tracking
        // screen) → renders text-forward (03 §3 image map).
        frame: { kind: "phone" },
        locale: {
          tr: {
            title: "Günlük takip",
            body: "Kılınan vakitler ve seri, baskı kurmadan işlenir; kaçan gün sessizce telafiye açılır.",
          },
          en: {
            title: "Daily tracking",
            body: "Prayed times and streaks are logged without pressure; a missed day quietly opens to make-up.",
          },
        },
      },
    ],
    locale: {
      tr: {
        claim: "Namaz vakti yol arkadaşınız: vakitler, takip ve vaaz içeriği.",
        chipMeta: "v2.4 · iOS/Android",
        metaRail: { version: "v2.4", platform: "iOS · Android", stack: "Expo · Convex" },
        contextBody:
          "Vakit uygulamaları ya reklam dolu ya da hesabı kaba. VAAZ vakti doğru hesaplar, günü nazikçe takip eder ve vaaz içeriğini tek yerde toplar.",
        telemetryExtra: [
          { key: "güncelleme", value: "günlük" },
          { key: "dağıtım", value: "OTA + mağaza" },
          { key: "yayında", value: [{ link: { href: "https://getvaaz.com", label: "getvaaz.com" } }] },
        ],
        outcomeBody: [
          "İki mağazada ",
          { bold: "4,9" },
          " puan. Mağaza bağlantıları: ",
          { link: { href: VAAZ_APP_STORE_HREF, label: "App Store" } },
          " · ",
          { link: { href: VAAZ_GOOGLE_PLAY_HREF, label: "Google Play" } },
        ],
      },
      en: {
        claim: "A prayer-time companion: times, tracking, and sermon content.",
        chipMeta: "v2.4 · iOS/Android",
        metaRail: { version: "v2.4", platform: "iOS / Android", stack: "Expo · Convex" },
        contextBody:
          "Prayer-time apps are either ad-stuffed or careless with the math. VAAZ computes times correctly, tracks the day gently, and keeps sermon content in one place.",
        telemetryExtra: [
          { key: "updates", value: "daily" },
          { key: "distribution", value: "OTA + stores" },
          { key: "online", value: [{ link: { href: "https://getvaaz.com", label: "getvaaz.com" } }] },
        ],
        outcomeBody: [
          "Rated ",
          { bold: "4.9" },
          " across both stores. Store links: ",
          { link: { href: VAAZ_APP_STORE_HREF, label: "App Store" } },
          " · ",
          { link: { href: VAAZ_GOOGLE_PLAY_HREF, label: "Google Play" } },
        ],
      },
    },
  },

  akitle: {
    slug: "akitle",
    statusVariant: "live",
    features: [
      {
        frame: {
          kind: "browser",
          domain: "akitle.com",
          image: { src: "/screens/akitle/editor-1600.png", width: 894, height: 754 },
        },
        locale: {
          tr: {
            title: "Sözleşme editörü",
            body: "Satır kalemleri, taraflar ve tutarlar yapılandırılmış alanlardır; metin değil veri düzenlenir.",
            imageAlt: "Akitle kira sözleşmesi editörü — satır kalemleri ve toplam tutar",
          },
          en: {
            title: "Contract editor",
            body: "Line items, parties, and amounts are structured fields — you edit data, not prose.",
            imageAlt: "Akitle rental contract editor — line items and grand total",
          },
        },
      },
      {
        frame: {
          kind: "browser",
          domain: "akitle.com",
          image: { src: "/screens/akitle/signed-1600.png", width: 892, height: 642 },
        },
        locale: {
          tr: {
            title: "İmza ve arşiv",
            body: "Her sözleşme imza rozetiyle kapanır, sürümlenmiş arşive düşer ve tekrar üretilebilir.",
            imageAlt: "Akitle sözleşme başlığı — 'İmzalandı' rozeti ve kiracı bilgileri",
          },
          en: {
            title: "Signature & archive",
            body: "Every contract closes with a signed badge, lands in a versioned archive, and can be reproduced.",
            imageAlt: "Akitle contract header — 'Signed' badge and tenant details",
          },
        },
      },
    ],
    locale: {
      tr: {
        claim: "Kira sözleşmeleri tek akışta: hazırla, imzala, arşivle.",
        chipMeta: "v3.1 · Web",
        metaRail: { version: "v3.1", platform: "Web", stack: "owner-verify" },
        contextBody:
          "Kira sözleşmeleri hâlâ Word şablonları ve ıslak imzayla dönüyor. Akitle sözleşmenin yazımından imzasına ve arşivine kadar tek bir akış kurar.",
        telemetryExtra: [
          { key: "güncelleme", value: "günlük" },
          { key: "dağıtım", value: "sürekli" },
          { key: "yayında", value: [{ link: { href: "https://akitle.com", label: "akitle.com" } }] },
        ],
        outcomeBody:
          "v3.1 üretimde; sözleşmeler gerçek taraflarca akıtılıyor — ürünün adı buradan gelir.",
      },
      en: {
        claim: "Rental contracts in one flow: draft, sign, archive.",
        chipMeta: "v3.1 · Web",
        metaRail: { version: "v3.1", platform: "Web", stack: "owner-verify" },
        contextBody:
          "Rental contracts still run on Word templates and wet signatures. Akitle builds a single flow from drafting to signature to archive.",
        telemetryExtra: [
          { key: "updates", value: "daily" },
          { key: "distribution", value: "continuous" },
          { key: "online", value: [{ link: { href: "https://akitle.com", label: "akitle.com" } }] },
        ],
        outcomeBody:
          "v3.1 in production; contracts flow between real parties — the product is named for it.",
      },
    },
  },

  linkden: {
    slug: "linkden",
    statusVariant: "live",
    features: [
      {
        frame: {
          kind: "browser",
          domain: "linkden.co",
          image: { src: "/screens/linkden/panel-1600.png", width: 1180, height: 784 },
        },
        locale: {
          tr: {
            title: "Docs paneli",
            body: "Panel gecikme rozetleriyle konuşur: arama <100ms, kayıt <50ms. Hız iddia değil, gösterge.",
            imageAlt: "Linkden dokümantasyon paneli — arama gecikme rozetleriyle",
          },
          en: {
            title: "The docs panel",
            body: "The panel speaks in latency badges: search <100ms, save <50ms. Speed is an instrument reading, not a claim.",
            imageAlt: "Linkden documentation panel — with search latency badges",
          },
        },
      },
      {
        frame: {
          kind: "browser",
          domain: "linkden.co",
          image: { src: "/screens/linkden/kbd-1600.png", width: 2368, height: 1304 },
        },
        locale: {
          tr: {
            title: "Klavye öncelikli",
            body: "Her eylem bir kısayol; kbd çipleri arayüzün dilidir. Fare opsiyoneldir.",
            imageAlt: "Linkden klavye kısayolu çipleri — kaydet ve ara panelleri",
          },
          en: {
            title: "Keyboard first",
            body: "Every action has a shortcut; kbd chips are the interface's language. The mouse is optional.",
            imageAlt: "Linkden keyboard shortcut chips — save and search panels",
          },
        },
      },
    ],
    locale: {
      tr: {
        claim: "Yazdığı kodun yanında yaşayan dokümantasyon.",
        chipMeta: "v1.8 · Web",
        metaRail: { version: "v1.8", platform: "Web", stack: "owner-verify" },
        contextBody:
          "Dokümantasyon koddan uzaklaştıkça çürür. Linkden geliştirici ekipler için aramayı, kaydetmeyi ve organizasyonu klavye hızında tutar.",
        telemetryExtra: [
          { key: "güncelleme", value: "günlük" },
          { key: "dağıtım", value: "sürekli" },
          { key: "yayında", value: [{ link: { href: "https://linkden.co", label: "linkden.co" } }] },
        ],
        outcomeBody: "v1.8 üretimde; B/W geliştirici-aracı estetiği ürünün kendi kimliğidir.",
      },
      en: {
        claim: "Documentation that lives next to its code.",
        chipMeta: "v1.8 · Web",
        metaRail: { version: "v1.8", platform: "Web", stack: "owner-verify" },
        contextBody:
          "Documentation rots as it drifts from the code. Linkden keeps search, save, and organization at keyboard speed for dev teams.",
        telemetryExtra: [
          { key: "updates", value: "daily" },
          { key: "distribution", value: "continuous" },
          { key: "online", value: [{ link: { href: "https://linkden.co", label: "linkden.co" } }] },
        ],
        outcomeBody: "v1.8 in production; the B/W dev-tool aesthetic is the product's own identity.",
      },
    },
  },

  characterdex: {
    slug: "characterdex",
    statusVariant: "live",
    features: [
      {
        frame: {
          kind: "browser",
          domain: "characterdex.com",
          image: { src: "/screens/characterdex/profiles-1600.png", width: 1600, height: 1000 },
        },
        locale: {
          tr: {
            title: "Tip profilleri",
            body: "Üç kolonlu panel: profil, test akışı ve topluluk karşılaştırması tek ekranda.",
            imageAlt: "CharacterDex uygulama paneli — üç kolonlu tip profili düzeni",
          },
          en: {
            title: "Type profiles",
            body: "A three-column panel: profile, test flow, and community comparison on one screen.",
            imageAlt: "CharacterDex app panel — three-column type-profile layout",
          },
        },
      },
      {
        frame: {
          kind: "browser",
          domain: "characterdex.com",
          image: { src: "/screens/characterdex/oracle-1600.png", width: 528, height: 360 },
        },
        locale: {
          tr: {
            title: "Kehanet kartları",
            body: "Her tip için altın detaylı, koleksiyonluk bir kart. Nadirlik gerçek: kartlar kazanılır, satın alınmaz.",
            imageAlt: "CharacterDex Günün Kehanet Kartı — altın detaylı koleksiyon kartı",
          },
          en: {
            title: "Oracle cards",
            body: "A gold-detailed collectible card for every type. Rarity is real: cards are earned, not bought.",
            imageAlt: "CharacterDex Oracle Card of the Day — gold-detailed collectible card",
          },
        },
      },
    ],
    locale: {
      tr: {
        claim: "Kişilik tipleri, koleksiyonluk kehanet kartlarıyla.",
        chipMeta: "v2.0 · Web",
        metaRail: { version: "v2.0", platform: "Web", stack: "owner-verify" },
        contextBody:
          "Kişilik testleri sonuç sayfasında biter; koleksiyon hissi yoktur. CharacterDex tip profillerini kalıcı, biriktirilebilir bir kayda çevirir.",
        telemetryExtra: [
          { key: "güncelleme", value: "günlük" },
          { key: "dağıtım", value: "sürekli" },
          { key: "yayında", value: [{ link: { href: "https://characterdex.com", label: "characterdex.com" } }] },
        ],
        outcomeBody: "v2.0 üretimde; kart sistemi canlı kullanıcılarla dönüyor.",
      },
      en: {
        claim: "Personality typing with collectible oracle cards.",
        chipMeta: "v2.0 · Web",
        metaRail: { version: "v2.0", platform: "Web", stack: "owner-verify" },
        contextBody:
          "Personality tests end at a results page; nothing accumulates. CharacterDex turns type profiles into a permanent, collectible record.",
        telemetryExtra: [
          { key: "updates", value: "daily" },
          { key: "distribution", value: "continuous" },
          { key: "online", value: [{ link: { href: "https://characterdex.com", label: "characterdex.com" } }] },
        ],
        outcomeBody: "v2.0 in production; the card system is running with live users.",
      },
    },
  },

  "oasis-and-mind": {
    slug: "oasis-and-mind",
    statusVariant: "in-dev",
    isRoadStatus: true,
    features: [
      {
        // ALL Oasis features render text-forward (01 §Imagery: no captures, no live URL yet).
        frame: { kind: "phone" },
        locale: {
          tr: {
            title: "Bakım döngüsü",
            body: "Günlük ritüeller oyunun kendisi: bak, besle, düzenle. Seri bozulunca ceza yok, dönüş var.",
          },
          en: {
            title: "The care loop",
            body: "Daily rituals are the game itself: tend, feed, arrange. A broken streak costs nothing — you just come back.",
          },
        },
      },
      {
        frame: { kind: "phone" },
        locale: {
          tr: {
            title: "Sıcak krem dünya",
            body: "Arayüz yumuşak, örüntü net: oyun görselleri sıcak krem, tipografi sakin.",
          },
          en: {
            title: "A warm cream world",
            body: "The interface is soft, the pattern is clear: warm cream visuals, calm typography.",
          },
        },
      },
    ],
    locale: {
      tr: {
        claim: "Günlük ritüeller üzerine kurulu bir bakım oyunu.",
        chipMeta: "v0.9 · Mobil",
        metaRail: { version: "v0.9", platform: "iOS · Android", stack: "owner-verify (Expo)" },
        contextBody:
          "Sağlıklı yaşam uygulamaları görev listesine dönüşür. Oasis and Mind bakımı bir oyuna çevirir: küçük ritüeller, sıcak bir dünya, suçluluk yok.",
        telemetryExtra: [
          { key: "güncelleme", value: "iç sürümlerde" },
          { key: "hedef", value: "iki mağaza" },
          { key: "kayıt", value: "bu sayfa güncellenir" },
        ],
        outcomeBody:
          "Ürün v0.9'da; iki mağazaya da çıkacak. Gerçek ekranlar hazır oldukça bu kayda eklenir.",
      },
      en: {
        claim: "A care game built around daily rituals.",
        chipMeta: "v0.9 · Mobile",
        metaRail: { version: "v0.9", platform: "iOS / Android", stack: "owner-verify (Expo)" },
        contextBody:
          "Wellness apps decay into task lists. Oasis and Mind turns care into a game: small rituals, a warm world, no guilt.",
        telemetryExtra: [
          { key: "updates", value: "internal builds" },
          { key: "target", value: "both stores" },
          { key: "record", value: "this page updates" },
        ],
        outcomeBody:
          "The product is at v0.9, headed to both stores. Real screens land in this record as they're ready.",
      },
    },
  },
};

/** Circular neighbor lookup over CASE_ORDER (feeds CasePager). Kept local so lib/cases.ts has
 *  no component-layer dependency. Works for any slug in CASE_ORDER regardless of whether
 *  `cases[slug]` is populated, since pager links only need routing + UNIT_IDENTITY.title. */
export function getCaseNeighbors(slug: CaseSlug): { prev: CaseSlug; next: CaseSlug } {
  const index = CASE_ORDER.indexOf(slug);
  const len = CASE_ORDER.length;
  const prev = CASE_ORDER[(index - 1 + len) % len];
  const next = CASE_ORDER[(index + 1) % len];
  return { prev, next };
}

import type { StatusVariant } from "@/components/ui/status-chip";
import type { SlotBar, SlotLabelContent } from "@/components/frames/slot-pattern";
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

/** Fleet order — unit-01..05, the circular pager sequence (03: 01->02->03->04->05->01). */
export const CASE_ORDER: CaseSlug[] = ["vaaz", "akitle", "linkden", "characterdex", "oasis-and-mind"];

export interface UnitIdentity {
  unitNo: string; // "01".."05"
  /** Uppercase product key for "unit-0X · KEY" eyebrow/pager labels (01 Typography exemption:
   *  brand-name spellings, not translatable prose — pre-uppercased same as fleet-readout.tsx). */
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
  slotBars?: SlotBar[];
}

interface CaseFramePhone {
  kind: "phone";
  image?: CaseImageSpec;
  slotBars?: SlotBar[];
}

export type CaseFrame = CaseFrameBrowser | CaseFramePhone;

interface CaseFeatureLocaleContent {
  title: string;
  body: string;
  /** Required when `frame.image` is set (01 §Imagery — descriptive, localized alt text). */
  imageAlt?: string;
  /** Required when `frame.image` is absent (C17 slot fallback). */
  slotLabel?: SlotLabelContent;
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
  /** Telemetry rows 2-4 (row 1, "durum/status", is always derived from statusVariant/flag by
   *  the template). Most cases use the shared izleme/sevkiyat/canlı keys (03 §Case-study
   *  shared anatomy section 4), but Oasis (no shipping cadence, no live URL yet) substitutes
   *  izleme/hedef/kayıt (03 §4) — so keys travel WITH each row instead of being derived from
   *  a shared dict. */
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
        // No real capture exists for this feature (T20 recon: getvaaz.com has no distinct
        // daily-tracking/streak screen) — 03 §7 explicitly allows "C16 real ya da C17 slot"
        // here. Bar geometry reuses machineshop.html's unit-01 phone-bay canvas verbatim
        // (03's pinned C17 geometry rule — no implementer-invented bar positions).
        frame: {
          kind: "phone",
          slotBars: [
            { top: "36px", left: "14%", width: "44%", height: "12px" },
            { top: "58px", left: "14%", width: "72%", height: "34px", tone: "skel-2" },
            { top: "106px", left: "14%", width: "26%", height: "7px", tone: "amber" },
            { top: "128px", left: "14%", width: "72%", height: "52px" },
            { top: "192px", left: "14%", width: "72%", height: "52px" },
            { bottom: "0", left: "14%", width: "72%", height: "40px", tone: "skel-2" },
          ],
        },
        locale: {
          tr: {
            title: "Günlük takip",
            body: "Kılınan vakitler ve seri, baskı kurmadan işlenir; kaçan gün sessizce telafiye açılır.",
            slotLabel: { title: "Ekran yuvası", body: "günlük takip ekranı — kılınan vakitler ve seri" },
          },
          en: {
            title: "Daily tracking",
            body: "Prayed times and streaks are logged without pressure; a missed day quietly opens to make-up.",
            slotLabel: { title: "Screen slot", body: "daily tracking screen — prayed times and streak" },
          },
        },
      },
    ],
    locale: {
      tr: {
        claim: "Namaz vakti yol arkadaşı: vakitler, takip, vaaz içeriği.",
        chipMeta: "v2.4 · iOS/Android",
        metaRail: { version: "v2.4", platform: "iOS · Android", stack: "Expo · Convex" },
        contextBody:
          "Vakit uygulamaları ya reklam dolu ya da hesabı kaba. VAAZ vakti doğru hesaplar, günü nazikçe takip eder ve vaaz içeriğini tek yerde toplar.",
        telemetryExtra: [
          { key: "izleme", value: "günlük" },
          { key: "sevkiyat", value: "OTA + mağaza" },
          { key: "canlı", value: [{ link: { href: "https://getvaaz.com", label: "getvaaz.com" } }] },
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
        claim: "A prayer companion: times, tracking, sermon content.",
        chipMeta: "v2.4 · iOS/Android",
        metaRail: { version: "v2.4", platform: "iOS / Android", stack: "Expo · Convex" },
        contextBody:
          "Prayer-time apps are either ad-stuffed or careless with the math. VAAZ computes times correctly, tracks the day gently, and keeps sermon content in one place.",
        telemetryExtra: [
          { key: "monitoring", value: "daily" },
          { key: "shipping", value: "OTA + stores" },
          { key: "live", value: [{ link: { href: "https://getvaaz.com", label: "getvaaz.com" } }] },
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
          { key: "izleme", value: "günlük" },
          { key: "sevkiyat", value: "sürekli" },
          { key: "canlı", value: [{ link: { href: "https://akitle.com", label: "akitle.com" } }] },
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
          { key: "monitoring", value: "daily" },
          { key: "shipping", value: "continuous" },
          { key: "live", value: [{ link: { href: "https://akitle.com", label: "akitle.com" } }] },
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
        claim: "Tarif ettiği kodun hemen yanında yaşayan dokümantasyon.",
        chipMeta: "v1.8 · Web",
        metaRail: { version: "v1.8", platform: "Web", stack: "owner-verify" },
        contextBody:
          "Dokümantasyon koddan uzaklaştıkça çürür. Linkden geliştirici ekipler için aramayı, kaydetmeyi ve organizasyonu klavye hızında tutar.",
        telemetryExtra: [
          { key: "izleme", value: "günlük" },
          { key: "sevkiyat", value: "sürekli" },
          { key: "canlı", value: [{ link: { href: "https://linkden.co", label: "linkden.co" } }] },
        ],
        outcomeBody: "v1.8 üretimde; B/W geliştirici-aracı estetiği ürünün kendi kimliğidir.",
      },
      en: {
        claim: "Documentation that lives next to the code it describes.",
        chipMeta: "v1.8 · Web",
        metaRail: { version: "v1.8", platform: "Web", stack: "owner-verify" },
        contextBody:
          "Documentation rots as it drifts from the code. Linkden keeps search, save, and organization at keyboard speed for dev teams.",
        telemetryExtra: [
          { key: "monitoring", value: "daily" },
          { key: "shipping", value: "continuous" },
          { key: "live", value: [{ link: { href: "https://linkden.co", label: "linkden.co" } }] },
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
          { key: "izleme", value: "günlük" },
          { key: "sevkiyat", value: "sürekli" },
          { key: "canlı", value: [{ link: { href: "https://characterdex.com", label: "characterdex.com" } }] },
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
          { key: "monitoring", value: "daily" },
          { key: "shipping", value: "continuous" },
          { key: "live", value: [{ link: { href: "https://characterdex.com", label: "characterdex.com" } }] },
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
        // ALL Oasis frames are C17 slots by design (01 §Imagery source table: "missing ->
        // flagged"; live URL is a placeholder landing). Bar geometry reuses machineshop.html's
        // unit-05 phone-bay canvas verbatim (03's pinned C17 geometry rule).
        frame: {
          kind: "phone",
          slotBars: [
            { top: "36px", left: "14%", width: "72%", height: "88px", tone: "skel-2" },
            { top: "138px", left: "14%", width: "20%", height: "7px", tone: "amber" },
            { top: "158px", left: "14%", width: "72%", height: "30px" },
            { top: "196px", left: "14%", width: "52%", height: "30px" },
            { bottom: "0", left: "14%", width: "72%", height: "40px", tone: "skel-2" },
          ],
        },
        locale: {
          tr: {
            title: "Bakım döngüsü",
            body: "Günlük ritüeller oyunun kendisi: bak, besle, düzenle. Seri bozulunca ceza yok, dönüş var.",
            slotLabel: { title: "Ekran yuvası", body: "bakım döngüsü ana ekranı, sıcak krem arayüz" },
          },
          en: {
            title: "The care loop",
            body: "Daily rituals are the game itself: tend, feed, arrange. A broken streak costs nothing — you just come back.",
            slotLabel: { title: "Screen slot", body: "care-loop home screen, warm cream UI" },
          },
        },
      },
      {
        frame: {
          kind: "phone",
          slotBars: [
            { top: "36px", left: "14%", width: "72%", height: "88px", tone: "skel-2" },
            { top: "138px", left: "14%", width: "20%", height: "7px", tone: "amber" },
            { top: "158px", left: "14%", width: "72%", height: "30px" },
            { top: "196px", left: "14%", width: "52%", height: "30px" },
            { bottom: "0", left: "14%", width: "72%", height: "40px", tone: "skel-2" },
          ],
        },
        locale: {
          tr: {
            title: "Sıcak krem dünya",
            body: "Arayüz yumuşak, örüntü net: oyun görselleri sıcak krem, tipografi sakin.",
            slotLabel: { title: "Ekran yuvası", body: "oyun görselleri sıcak krem, tipografi sakin" },
          },
          en: {
            title: "A warm cream world",
            body: "The interface is soft, the pattern is clear: warm cream visuals, calm typography.",
            slotLabel: { title: "Screen slot", body: "warm cream game visuals, calm typography" },
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
          { key: "izleme", value: "iç sürümlerde" },
          { key: "hedef", value: "iki mağaza" },
          { key: "kayıt", value: "bu sayfa güncellenir" },
        ],
        outcomeBody:
          "Ünite v0.9'da; iki mağazaya da sevk edilecek. Gerçek ekranlar hazır oldukça bu kayda düşer.",
      },
      en: {
        claim: "A care game built around daily rituals.",
        chipMeta: "v0.9 · Mobile",
        metaRail: { version: "v0.9", platform: "iOS / Android", stack: "owner-verify (Expo)" },
        contextBody:
          "Wellness apps decay into task lists. Oasis and Mind turns care into a game: small rituals, a warm world, no guilt.",
        telemetryExtra: [
          { key: "monitoring", value: "internal builds" },
          { key: "target", value: "both stores" },
          { key: "record", value: "this page updates" },
        ],
        outcomeBody:
          "The unit is at v0.9, headed to both stores. Real screens land in this record as they're ready.",
      },
    },
  },
};

/** Circular neighbor lookup over the fixed fleet order (mirrors components/case/unit-pager.tsx
 *  getCircularNeighbors — kept local here so lib/cases.ts has no component-layer dependency).
 *  Works for any slug in CASE_ORDER regardless of whether `cases[slug]` is populated, since
 *  pager links only need routing + UNIT_IDENTITY, not the full case record. */
export function getCaseNeighbors(slug: CaseSlug): { prev: CaseSlug; next: CaseSlug } {
  const index = CASE_ORDER.indexOf(slug);
  const len = CASE_ORDER.length;
  const prev = CASE_ORDER[(index - 1 + len) % len];
  const next = CASE_ORDER[(index + 1) % len];
  return { prev, next };
}

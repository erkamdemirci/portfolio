import type { ReactNode } from "react";
import type { StatusVariant } from "@/components/ui/status-chip";
import type { SlotBar, SlotLabelContent } from "@/components/frames/slot-pattern";
import type { Lang } from "@/lib/i18n/routes";

/**
 * Case data model (T23, 03-screens-and-flows.md §Case-study shared anatomy + §5 Akitle;
 * 04-tasks.md T23/T24). One typed record per fleet unit. Structural fields (frame kind,
 * image dimensions, slot bar geometry) are locale-independent; everything textual lives
 * under `locale.tr` / `locale.en`. `owner-verify` stack values (06-risks-and-assumptions.md
 * §Planning-invented facts) render exactly as provided — this module has no opinion on that
 * marker.
 *
 * T23 populates AKITLE only (the reference build) in `cases`; T24 adds the remaining four.
 * `UNIT_IDENTITY` covers all five from the start (unit number/key/display title are fixed
 * fleet facts, not page copy) so T23's pager can link to not-yet-built neighbor pages
 * (unit-01 VAAZ, unit-03 LINKDEN) without needing their full case records yet.
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

interface CaseLocaleContent {
  claim: string;
  /** Hero C11 chip meta string, e.g. "v3.1 · Web" (version + locale-formatted platform). */
  chipMeta: string;
  metaRail: { version: string; platform: string; stack: string };
  contextBody: string;
  telemetry: { monitoring: string; shipping: string };
  outcomeBody: ReactNode;
}

export interface CaseRecord {
  slug: CaseSlug;
  statusVariant: StatusVariant;
  /** External product domain for the telemetry "canlı/live" row link; undefined = no live link
   *  yet (Oasis, T24). */
  domain?: string;
  /** Exactly two feature blocks per the shared case anatomy (03 §Case-study shared anatomy
   *  section 3 — "İnşa ettiklerimiz / What we built"). */
  features: [CaseFeature, CaseFeature];
  /** Oasis (T24) reports "Yol durumu / Road status" instead of "Sonuç / Outcome". */
  isRoadStatus?: boolean;
  locale: Record<Lang, CaseLocaleContent>;
}

export const cases: Partial<Record<CaseSlug, CaseRecord>> = {
  akitle: {
    slug: "akitle",
    statusVariant: "live",
    domain: "akitle.com",
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
        telemetry: { monitoring: "günlük", shipping: "sürekli" },
        outcomeBody:
          "v3.1 üretimde; sözleşmeler gerçek taraflarca akıtılıyor — ürünün adı buradan gelir.",
      },
      en: {
        claim: "Rental contracts in one flow: draft, sign, archive.",
        chipMeta: "v3.1 · Web",
        metaRail: { version: "v3.1", platform: "Web", stack: "owner-verify" },
        contextBody:
          "Rental contracts still run on Word templates and wet signatures. Akitle builds a single flow from drafting to signature to archive.",
        telemetry: { monitoring: "daily", shipping: "continuous" },
        outcomeBody:
          "v3.1 in production; contracts flow between real parties — the product is named for it.",
      },
    },
  },
};

/** Circular neighbor lookup over the fixed fleet order (mirrors components/case/unit-pager.tsx
 *  getCircularNeighbors — kept local here so lib/cases.ts has no component-layer dependency).
 *  Works for any slug in CASE_ORDER regardless of whether `cases[slug]` is populated yet, since
 *  pager links only need routing + UNIT_IDENTITY, not the full case record. */
export function getCaseNeighbors(slug: CaseSlug): { prev: CaseSlug; next: CaseSlug } {
  const index = CASE_ORDER.indexOf(slug);
  const len = CASE_ORDER.length;
  const prev = CASE_ORDER[(index - 1 + len) % len];
  const next = CASE_ORDER[(index + 1) % len];
  return { prev, next };
}

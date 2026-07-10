import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { StatusChip } from "@/components/ui/status-chip";
import { ExternalTelLink } from "@/components/fleet/unit-card";
import { BrowserBay } from "@/components/frames/browser-bay";
import { PhoneBay } from "@/components/frames/phone-bay";
import { MetaRail } from "@/components/case/meta-rail";
import { KvBlock, type KvRow } from "@/components/telemetry/kv-block";
import { ContactBand } from "@/components/bands/contact-band";
import { UnitPager } from "@/components/case/unit-pager";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";
import {
  cases,
  UNIT_IDENTITY,
  getCaseNeighbors,
  type CaseFrame,
  type CaseSlug,
  type ContentSegment,
} from "@/lib/cases";

/** Turns lib/cases.ts's plain-data ContentSegment[] into real React elements — `link`
 *  segments always render via ExternalTelLink (mono text + the ArrowUpRight icon, 01
 *  Amendment A5: the "↗" in content strings is never a literal text glyph). */
function renderSegments(content: string | ContentSegment[]): ReactNode {
  if (typeof content === "string") return content;
  return content.map((segment, i) => {
    if (typeof segment === "string") return <span key={i}>{segment}</span>;
    if ("bold" in segment) return <b key={i}>{segment.bold}</b>;
    return <ExternalTelLink key={i} href={segment.link.href} label={segment.link.label} />;
  });
}

/**
 * Case-study template (03-screens-and-flows.md §Case-study shared anatomy; 04-tasks.md T23).
 * Ordered sections: hero (C9 unit eyebrow, h1, claim lede, C11 chip, C22 meta rail) -> bağlam
 * -> two feature blocks (alternating 7/5 at 1440, stacked <=1020) -> C20 telemetri -> sonuç
 * (Oasis: yol durumu) -> C21 compact contact band -> C23 pager (circular, always both
 * directions). This same template renders all five cases; T23 only populates AKITLE in
 * lib/cases.ts, T24 adds the remaining four without touching this file.
 */

const CONTACT_HREF: Record<Lang, string> = { tr: "/iletisim", en: "/en/contact" };

const CASE_HREF: Record<Lang, Record<CaseSlug, string>> = {
  tr: {
    vaaz: "/isler/vaaz",
    akitle: "/isler/akitle",
    linkden: "/isler/linkden",
    characterdex: "/isler/characterdex",
    "oasis-and-mind": "/isler/oasis-and-mind",
  },
  en: {
    vaaz: "/en/work/vaaz",
    akitle: "/en/work/akitle",
    linkden: "/en/work/linkden",
    characterdex: "/en/work/characterdex",
    "oasis-and-mind": "/en/work/oasis-and-mind",
  },
};

// 03 Meta, titles & OG table — full 5-case table so T24 (data-only) never needs to touch
// this template file.
const META: Record<CaseSlug, Record<Lang, Metadata>> = {
  vaaz: {
    tr: {
      title: "VAAZ vaka kaydı — DMRC",
      description:
        "Namaz vakti yol arkadaşı: vakitler, takip, vaaz içeriği. unit-01: v2.4, iOS/Android, iki mağazada 4,9.",
    },
    en: {
      title: "VAAZ case record — DMRC",
      description: "A prayer companion: times, tracking, sermon content. unit-01: v2.4, iOS/Android, 4.9 across both stores.",
    },
  },
  akitle: {
    tr: {
      title: "Akitle vaka kaydı — DMRC",
      description: "Kira sözleşmeleri tek akışta: hazırla, imzala, arşivle. unit-02: v3.1, web, üretimde.",
    },
    en: {
      title: "Akitle case record — DMRC",
      description: "Rental contracts in one flow: draft, sign, archive. unit-02: v3.1, web, in production.",
    },
  },
  linkden: {
    tr: {
      title: "Linkden vaka kaydı — DMRC",
      description: "Kodun yanında yaşayan dokümantasyon; klavye öncelikli. unit-03: v1.8, web, üretimde.",
    },
    en: {
      title: "Linkden case record — DMRC",
      description: "Documentation that lives next to the code; keyboard first. unit-03: v1.8, web, in production.",
    },
  },
  characterdex: {
    tr: {
      title: "CharacterDex vaka kaydı — DMRC",
      description: "Kişilik tipleri, koleksiyonluk kehanet kartlarıyla. unit-04: v2.0, web, üretimde.",
    },
    en: {
      title: "CharacterDex case record — DMRC",
      description: "Personality typing with collectible oracle cards. unit-04: v2.0, web, in production.",
    },
  },
  "oasis-and-mind": {
    tr: {
      title: "Oasis and Mind vaka kaydı — DMRC",
      description:
        "Günlük ritüeller üzerine kurulu bakım oyunu. unit-05: v0.9, mobil, geliştirmede — kayıt güncellenir.",
    },
    en: {
      title: "Oasis and Mind case record — DMRC",
      description: "A care game built on daily rituals. unit-05: v0.9, mobile, in development — the record updates.",
    },
  },
};

export function generateStaticParams() {
  const langs: Lang[] = ["tr", "en"];
  const slugs = Object.keys(cases) as CaseSlug[];
  return slugs.flatMap((slug) => langs.map((lang) => ({ slug, lang })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = (await params) as { lang: Lang; slug: CaseSlug };
  return META[slug]?.[lang] ?? {};
}

function renderFrame(frame: CaseFrame, image: { src: string; alt: string; width: number; height: number } | undefined, slot: { bars: NonNullable<CaseFrame["slotBars"]>; label: NonNullable<import("@/components/frames/slot-pattern").SlotLabelContent> } | undefined) {
  if (frame.kind === "browser") {
    return <BrowserBay domain={frame.domain} span={5} image={image} slot={slot} />;
  }
  return <PhoneBay image={image} slot={slot} />;
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = (await params) as { lang: Lang; slug: CaseSlug };
  const record = cases[slug];
  if (!record) notFound();

  const dict = getDictionary(lang);
  const ct = dict.caseTemplate;
  const content = record.locale[lang];
  const identity = UNIT_IDENTITY[slug];
  const caseHref = CASE_HREF[lang];
  const { prev, next } = getCaseNeighbors(slug);
  const prevIdentity = UNIT_IDENTITY[prev];
  const nextIdentity = UNIT_IDENTITY[next];

  const flag = record.statusVariant === "live" ? ct.statusFlag.live : ct.statusFlag.inDev;
  const sectionOutcome = record.isRoadStatus ? ct.sections.roadStatus : ct.sections.outcome;

  // Row 1 (durum/status) is always derived from statusVariant/flag; rows 2-4 are fully
  // data-driven (most cases: izleme/sevkiyat/canlı — Oasis: izleme/hedef/kayıt, 03 §4).
  const telemetryRows: KvRow[] = [
    { key: ct.telemetryKeys.status, value: <StatusChip variant={record.statusVariant} flag={flag} /> },
    ...content.telemetryExtra.map((row) => ({ key: row.key, value: renderSegments(row.value) })),
  ];

  return (
    <>
      {/* ---------- Hero — C9 unit eyebrow, h1, claim lede, C11 chip, C22 meta rail ---------- */}
      <section className="wrap pt-[var(--hero-top)] pb-[var(--sec-tight)]">
        <Eyebrow variant="hero">{`unit-${identity.unitNo} · ${identity.unitKey}`}</Eyebrow>
        <h1 className="max-w-[14ch] text-balance text-[clamp(2.8rem,6vw,5rem)] font-bold leading-[1.02] tracking-[-0.03em]">
          {identity.title}
        </h1>
        <p className="mt-[26px] max-w-[52ch] text-[1.1rem] text-steel">{content.claim}</p>
        <div className="mt-8">
          <StatusChip variant={record.statusVariant} flag={flag} meta={content.chipMeta} />
        </div>
        <MetaRail
          className="mt-10"
          cells={[
            { key: ct.metaRailKeys.status, status: { variant: record.statusVariant, flag } },
            { key: ct.metaRailKeys.version, value: content.metaRail.version },
            { key: ct.metaRailKeys.platform, value: content.metaRail.platform },
            { key: ct.metaRailKeys.stack, value: content.metaRail.stack },
          ]}
        />
      </section>

      {/* ---------- 01 — bağlam / context ---------- */}
      <section className="wrap border-t border-line py-[var(--sec-tight)]">
        <Eyebrow variant="section">{ct.sections.context.eyebrow}</Eyebrow>
        <h2 className="text-balance text-[clamp(1.9rem,3.4vw,2.7rem)] leading-[1.08] font-semibold tracking-[-0.025em]">
          {ct.sections.context.heading}
        </h2>
        <p className="mt-5 max-w-[65ch] text-[1rem] text-steel">{content.contextBody}</p>
      </section>

      {/* ---------- 02 — inşa / what we built (two feature blocks, alternating 7/5) ---------- */}
      <section className="wrap border-t border-line py-[var(--sec)]">
        <Eyebrow variant="section">{ct.sections.build.eyebrow}</Eyebrow>
        <h2 className="mb-10 text-balance text-[clamp(1.9rem,3.4vw,2.7rem)] leading-[1.08] font-semibold tracking-[-0.025em]">
          {ct.sections.build.heading}
        </h2>

        <div className="flex flex-col gap-16">
          {record.features.map((feature, i) => {
            const fc = feature.locale[lang];
            const image =
              feature.frame.image && fc.imageAlt
                ? { src: feature.frame.image.src, alt: fc.imageAlt, width: feature.frame.image.width, height: feature.frame.image.height }
                : undefined;
            const slot =
              !feature.frame.image && feature.frame.slotBars && fc.slotLabel
                ? { bars: feature.frame.slotBars, label: fc.slotLabel }
                : undefined;

            const textBlock = (
              <div key="text">
                <h3 className="text-[1.2rem] leading-[1.6] font-semibold tracking-[-0.015em]">{fc.title}</h3>
                <p className="mt-3 max-w-[46ch] text-[0.975rem] text-steel">{fc.body}</p>
              </div>
            );
            const frameBlock = (
              <div key="frame" className="overflow-hidden rounded border border-line bg-carbon-2">
                {renderFrame(feature.frame, image, slot)}
              </div>
            );

            return (
              <div
                key={i}
                className={`grid items-center gap-x-16 gap-y-8 max-[1020px]:grid-cols-1 max-[1020px]:gap-y-6 ${
                  i % 2 === 0 ? "grid-cols-[7fr_5fr]" : "grid-cols-[5fr_7fr]"
                }`}
              >
                {i % 2 === 0 ? [textBlock, frameBlock] : [frameBlock, textBlock]}
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- 03 — telemetri / telemetry ---------- */}
      <section className="wrap border-t border-line py-[var(--sec-tight)]">
        <Eyebrow variant="section">{ct.sections.telemetry.eyebrow}</Eyebrow>
        <h2 className="mb-8 text-balance text-[clamp(1.9rem,3.4vw,2.7rem)] leading-[1.08] font-semibold tracking-[-0.025em]">
          {ct.sections.telemetry.heading}
        </h2>
        <KvBlock ariaLabel={ct.telemetryAria} rows={telemetryRows} className="max-w-[520px]" />
      </section>

      {/* ---------- 04 — sonuç / outcome (Oasis: yol durumu / road status) ---------- */}
      <section className="wrap border-t border-line py-[var(--sec-tight)]">
        <Eyebrow variant="section">{sectionOutcome.eyebrow}</Eyebrow>
        <h2 className="text-balance text-[clamp(1.9rem,3.4vw,2.7rem)] leading-[1.08] font-semibold tracking-[-0.025em]">
          {sectionOutcome.heading}
        </h2>
        <p className="mt-5 max-w-[65ch] text-[1rem] text-steel">{renderSegments(content.outcomeBody)}</p>
      </section>

      {/* ---------- 05 — iletişim / slot-06 (compact) ---------- */}
      <ContactBand
        variant="compact"
        eyebrow={ct.sections.contact.eyebrow}
        heading={dict.home.contactBand.heading}
        accentHref={CONTACT_HREF[lang]}
        accentLabel={dict.nav.cta}
      />

      {/* ---------- Pager — circular, both directions always present ---------- */}
      <div className="wrap">
        <UnitPager
          prevCaption={ct.pager.prevCaption}
          nextCaption={ct.pager.nextCaption}
          prev={{
            href: caseHref[prev],
            unitLabel: `unit-${prevIdentity.unitNo} · ${prevIdentity.unitKey}`,
            title: prevIdentity.title,
          }}
          next={{
            href: caseHref[next],
            unitLabel: `unit-${nextIdentity.unitNo} · ${nextIdentity.unitKey}`,
            title: nextIdentity.title,
          }}
        />
      </div>
    </>
  );
}

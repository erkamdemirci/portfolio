import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { alternatesFor, pageMetadata } from "@/lib/seo";
import { HreflangLinks } from "@/components/seo/hreflang-links";
import { StatusChip } from "@/components/ui/status-chip";
import { TextLink } from "@/components/ui/text-link";
import { CaseHero } from "@/components/case/case-hero";
import { CaseFeature } from "@/components/case/case-feature";
import { CaseSpecList } from "@/components/case/case-spec-list";
import { CasePager } from "@/components/case/case-pager";
import { ContactBand } from "@/components/bands/contact-band";
import { Reveal } from "@/components/motion/reveal";
import { KvBlock, type KvRow } from "@/components/bands/kv-block";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";
import { cases, UNIT_IDENTITY, getCaseNeighbors, type CaseSlug, type ContentSegment } from "@/lib/cases";

/**
 * 3 — Case template (03-screens-and-flows.md §3). One template, five records. Shared anatomy:
 * mini-breadcrumb (İşler → title) → CaseHero → Context → two CaseFeature blocks (with-image where
 * a real screenshot exists, else text-forward — 03 image map) → CaseSpecList (Ayrıntılar) →
 * Outcome (Sonuç / Yol durumu) → CasePager → ContactBand compact.
 */

/** Turns cases.ts ContentSegment[] into elements — links render as external-mono TextLinks. */
function renderSegments(content: string | ContentSegment[]): ReactNode {
  if (typeof content === "string") return content;
  return content.map((segment, i) => {
    if (typeof segment === "string") return <span key={i}>{segment}</span>;
    if ("bold" in segment)
      return (
        <b key={i} className="mono font-medium text-ink">
          {segment.bold}
        </b>
      );
    return (
      <TextLink key={i} href={segment.link.href} variant="external-mono">
        {segment.link.label}
      </TextLink>
    );
  });
}

const WORK_HREF: Record<Lang, string> = { tr: "/isler", en: "/en/work" };
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
  if (!cases[slug]) return {};
  return pageMetadata(slug, lang);
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

  const flag = record.statusVariant === "live" ? ct.statusFlag.live : ct.statusFlag.inDev;
  const sectionOutcome = record.isRoadStatus ? ct.sections.roadStatus : ct.sections.outcome;

  const specRows: KvRow[] = [
    { key: ct.telemetryKeys.status, value: <StatusChip variant={record.statusVariant} flag={flag} /> },
    ...content.telemetryExtra.map((row) => ({ key: row.key, value: renderSegments(row.value) })),
  ];

  return (
    <>
      <HreflangLinks alt={alternatesFor(slug)} />

      {/* ---------- Mini-breadcrumb (matches BreadcrumbList JSON-LD, T68) ---------- */}
      <nav aria-label="breadcrumb" className="wrap pt-[var(--hero-top)]">
        <ol className="flex flex-wrap items-center gap-2 text-[0.86rem] leading-[1.4] text-ink-soft">
          <li>
            <TextLink href={WORK_HREF[lang]}>{dict.nav.work}</TextLink>
          </li>
          <li aria-hidden="true">→</li>
          <li aria-current="page" className="text-ink">
            {identity.title}
          </li>
        </ol>
      </nav>

      {/* ---------- Hero ---------- */}
      <Reveal>
        <section className="wrap pt-[clamp(20px,3vw,32px)] pb-[var(--pad-section)]">
          <CaseHero
            claim={content.claim}
            status={{ variant: record.statusVariant, flag }}
            meta={content.metaRail}
          />
        </section>
      </Reveal>

      {/* ---------- Context ---------- */}
      <Reveal>
        <section className="wrap border-t border-line py-[var(--pad-section)]">
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] text-ink">
            {ct.sections.context.heading}
          </h2>
          <p className="mt-5 max-w-[65ch] text-[1.05rem] leading-[1.6] text-ink text-pretty">{content.contextBody}</p>
        </section>
      </Reveal>

      {/* ---------- What we built — two feature blocks, alternating ---------- */}
      <section className="wrap border-t border-line py-[var(--pad-section)]">
        <h2 className="mb-[clamp(32px,4vw,56px)] font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] text-ink">
          {ct.sections.build.heading}
        </h2>
        <div className="flex flex-col gap-[clamp(48px,6vw,88px)]">
          {record.features.map((feature, i) => {
            const fc = feature.locale[lang];
            const image = feature.frame.image
              ? {
                  src: feature.frame.image.src,
                  alt: fc.imageAlt ?? fc.title,
                  width: feature.frame.image.width,
                  height: feature.frame.image.height,
                }
              : undefined;
            return (
              <Reveal key={i}>
                <CaseFeature
                  variant={image ? "with-image" : "text-forward"}
                  title={fc.title}
                  body={fc.body}
                  image={image}
                  plateVariant={feature.frame.kind === "browser" ? "browser-shot" : "phone-shot"}
                  flip={i % 2 === 1}
                />
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ---------- Details (de-themed from "Telemetri") ---------- */}
      <Reveal>
        <section className="wrap border-t border-line py-[var(--pad-section)]">
          <CaseSpecList heading={ct.sections.telemetry.heading} ariaLabel={ct.telemetryAria} rows={specRows} />
        </section>
      </Reveal>

      {/* ---------- Outcome (Oasis: Yol durumu) ---------- */}
      <Reveal>
        <section className="wrap border-t border-line py-[var(--pad-section)]">
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] text-ink">
            {sectionOutcome.heading}
          </h2>
          <p className="mt-5 max-w-[65ch] text-[1.05rem] leading-[1.6] text-ink text-pretty">
            {renderSegments(content.outcomeBody)}
          </p>
        </section>
      </Reveal>

      {/* ---------- Pager (circular) ---------- */}
      <section className="wrap py-[clamp(40px,5vw,64px)]">
        <CasePager
          prev={{ href: caseHref[prev], title: UNIT_IDENTITY[prev].title }}
          next={{ href: caseHref[next], title: UNIT_IDENTITY[next].title }}
          prevCaption={ct.pager.prevCaption}
          nextCaption={ct.pager.nextCaption}
        />
      </section>

      {/* ---------- Contact (compact) ---------- */}
      <Reveal>
        <ContactBand
          variant="compact"
          headingLevel="h2"
          heading={dict.home.contactBand.heading}
          turn={dict.home.contactBand.headingTurn}
          accentHref={CONTACT_HREF[lang]}
          accentLabel={dict.home.contactBand.accentLabel}
        />
      </Reveal>
    </>
  );
}

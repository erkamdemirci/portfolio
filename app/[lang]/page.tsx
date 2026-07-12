import type { Metadata } from "next";
import { alternatesFor, pageMetadata } from "@/lib/seo";
import { HreflangLinks } from "@/components/seo/hreflang-links";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { ArrowLink } from "@/components/ui/arrow-link";
import { SectionHead } from "@/components/layout/section-head";
import { ProductCard } from "@/components/work/product-card";
import { OpenSlotCell } from "@/components/work/open-slot-cell";
import { StatBand } from "@/components/bands/stat-band";
import { ServiceGrid, type ServiceCellContent } from "@/components/services/service-cell";
import { ContactBand } from "@/components/bands/contact-band";
import { Reveal } from "@/components/motion/reveal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { cases, type CaseSlug } from "@/lib/cases";
import type { Lang } from "@/lib/i18n/routes";

/**
 * 1 — Home (03-screens-and-flows.md §1). Section order: hero (eyebrow, H1 with the italic-ever
 * turn, lede, actions) → work proof (3 marquee products as typographic-plate ProductCards + the
 * OpenSlotCell) → services digest → studio digest → StatBand (aria-labelled, no h2) → ContactBand
 * full. Home imagery is TYPOGRAPHIC ONLY (amendment #6). The ContactBand full ships WITHOUT the
 * ContactActions row in M3 (03 §1 note; T49 wires it). Heading outline: single h1; work/services/
 * studio/contact are h2; the stat band is a labelled section.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Lang };
  return pageMetadata("home", lang);
}

const WORK_HREF: Record<Lang, string> = { tr: "/isler", en: "/en/work" };
const SERVICES_HREF: Record<Lang, string> = { tr: "/hizmetler", en: "/en/services" };
const STUDIO_HREF: Record<Lang, string> = { tr: "/studyo", en: "/en/studio" };
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

/** "v2.4 · iOS · Android" → { version, platform } so the version can carry mono (02 §ProductCard). */
function splitMeta(meta: string, domain?: string) {
  const [version, ...rest] = meta.split(" · ");
  return { version, platform: rest.join(" · "), domain };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: Lang };
  const dict = getDictionary(lang);
  const h = dict.home;
  const caseHref = CASE_HREF[lang];
  const claimOf = (slug: CaseSlug) => cases[slug]?.locale[lang].claim ?? "";

  const serviceCells: ServiceCellContent[] = [
    { ...h.services.cellOne, href: SERVICES_HREF[lang] },
    { ...h.services.cellTwo, href: SERVICES_HREF[lang] },
    { ...h.services.cellThree, href: SERVICES_HREF[lang] },
    { ...h.services.cellFour, href: SERVICES_HREF[lang] },
  ];

  return (
    <>
      <HreflangLinks alt={alternatesFor("home")} />

      {/* ---------- Hero — H1 is the LCP text (01 §Imagery: no raster hero image) ---------- */}
      <Reveal>
        <section className="wrap pt-[var(--hero-top)] pb-[var(--pad-section)]">
          <Eyebrow variant="hero">{h.eyebrow}</Eyebrow>
          <h1 className="max-w-[18ch] font-display text-[clamp(3rem,7vw,5.5rem)] leading-[1.05] tracking-[-0.005em] text-ink text-balance [&_em]:italic [&_em]:text-ever">
            {h.h1Lead}
            <em>{h.h1Turn}</em>
          </h1>
          <p className="mt-8 max-w-[60ch] text-[clamp(1.08rem,1.4vw,1.22rem)] leading-[1.6] text-ink-soft text-pretty">
            {h.lede}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button variant="primary" href={CONTACT_HREF[lang]}>
              {dict.nav.cta}
            </Button>
            <TextLink href={`mailto:${h.email}`}>{h.email}</TextLink>
            <ArrowLink href={WORK_HREF[lang]}>{h.contactBand.ghostLabel}</ArrowLink>
          </div>
        </section>
      </Reveal>

      {/* ---------- Work proof — typographic plates only (amendment #6) ---------- */}
      <section className="wrap border-t border-line py-[var(--pad-section)]">
        <SectionHead heading={h.fleet.heading} sideText={h.fleet.side} headingLevel="h2" />

        <div className="mt-[clamp(40px,5vw,72px)] flex flex-col gap-[clamp(48px,6vw,88px)]">
          <Reveal>
            <ProductCard
              variant="feature"
              href={caseHref.akitle}
              title={h.cards.akitle.title}
              status={{ variant: "live", flag: h.cards.akitle.flag }}
              meta={splitMeta(h.cards.akitle.meta, h.cards.akitle.domain)}
              description={h.cards.akitle.description}
              plate={{ status: h.cards.akitle.flag, name: h.cards.akitle.title, claim: claimOf("akitle"), ratio: "3/2" }}
            />
          </Reveal>

          <div className="grid grid-cols-3 gap-[clamp(28px,4vw,48px)] max-[900px]:grid-cols-1">
            <Reveal index={0}>
              <ProductCard
                variant="compact"
                href={caseHref.vaaz}
                title={h.cards.vaaz.title}
                status={{ variant: "live", flag: h.cards.vaaz.flag }}
                meta={splitMeta(h.cards.vaaz.meta, h.cards.vaaz.domain)}
                description={h.cards.vaaz.description}
                plate={{ status: h.cards.vaaz.flag, name: h.cards.vaaz.title, claim: claimOf("vaaz"), ratio: "700/728" }}
                proof={
                  <>
                    <span className="mono text-ink">{h.cards.vaaz.rating}</span> {h.cards.vaaz.ratingSuffix}
                  </>
                }
              />
            </Reveal>
            <Reveal index={1}>
              <ProductCard
                variant="compact"
                href={caseHref["oasis-and-mind"]}
                title={h.cards.oasis.title}
                status={{ variant: "in-dev", flag: h.cards.oasis.flag }}
                meta={splitMeta(h.cards.oasis.meta)}
                description={h.cards.oasis.description}
                plate={{ status: h.cards.oasis.flag, name: h.cards.oasis.title, claim: claimOf("oasis-and-mind"), ratio: "700/728" }}
              />
            </Reveal>
            <Reveal index={2}>
              <OpenSlotCell
                label={h.openSlot.label}
                title={h.openSlot.title}
                body={h.openSlot.body}
                ctaHref={CONTACT_HREF[lang]}
                ctaLabel={h.openSlot.cta}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Services digest — 4 linked cells ---------- */}
      <Reveal>
        <section className="wrap border-t border-line py-[var(--pad-section)]">
          <SectionHead heading={h.services.heading} sideText={h.services.side} headingLevel="h2" />
          <ServiceGrid variant="linked" cells={serviceCells} className="mt-[clamp(32px,4vw,56px)]" />
          <div className="mt-8">
            <ArrowLink href={SERVICES_HREF[lang]}>{h.services.ctaLabel}</ArrowLink>
          </div>
        </section>
      </Reveal>

      {/* ---------- Studio digest ---------- */}
      <Reveal>
        <section className="wrap border-t border-line py-[var(--pad-section)]">
          <div className="max-w-[52ch]">
            <SectionHead heading={h.studio.heading} headingLevel="h2" />
            <p className="mt-5 text-[1.05rem] leading-[1.6] text-ink-soft text-pretty">{h.studio.lede}</p>
            <div className="mt-8">
              <ArrowLink href={STUDIO_HREF[lang]}>{h.studio.ctaLabel}</ArrowLink>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ---------- Stat band — the one orchestrated moment; labelled section, no h2 ---------- */}
      <Reveal>
        <StatBand
          ariaLabel={h.statRailAria}
          cells={[h.statRail.products, h.statRail.platforms, h.statRail.response, h.statRail.openSlot]}
        />
      </Reveal>

      {/* ---------- Contact band (full) — NO ContactActions row in M3 (T49 wires it) ---------- */}
      <Reveal>
        <ContactBand
          variant="full"
          headingLevel="h2"
          heading={h.contactBand.heading}
          turn={h.contactBand.headingTurn}
          lede={h.contactBand.lede}
          accentHref={CONTACT_HREF[lang]}
          accentLabel={h.contactBand.accentLabel}
          ghostHref={WORK_HREF[lang]}
          ghostLabel={h.contactBand.ghostLabel}
          kvAriaLabel={h.contactBand.kvAriaLabel}
          kvRows={[
            {
              key: h.contactBand.kvEmail.key,
              value: <TextLink href={`mailto:${h.contactBand.kvEmail.value}`}>{h.contactBand.kvEmail.value}</TextLink>,
            },
            { key: h.contactBand.kvBase.key, value: h.contactBand.kvBase.value },
            { key: h.contactBand.kvResponse.key, value: h.contactBand.kvResponse.value, mono: true },
            { key: h.contactBand.kvStack.key, value: h.contactBand.kvStack.value },
          ]}
        />
      </Reveal>
    </>
  );
}

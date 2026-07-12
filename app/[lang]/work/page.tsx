import type { Metadata } from "next";
import { alternatesFor, pageMetadata } from "@/lib/seo";
import { HreflangLinks } from "@/components/seo/hreflang-links";
import { SectionHead } from "@/components/layout/section-head";
import { ProductCard } from "@/components/work/product-card";
import { OpenSlotCell } from "@/components/work/open-slot-cell";
import { ContactBand } from "@/components/bands/contact-band";
import { Reveal } from "@/components/motion/reveal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { cases, type CaseSlug } from "@/lib/cases";
import type { Lang } from "@/lib/i18n/routes";

/**
 * 2 — Work index (03-screens-and-flows.md §2). SectionHead (side-note, h1) → the full record of
 * 5 products as ProductCard `row` variants (typographic plates, --line-strong dividers) → the
 * OpenSlotCell → ContactBand compact. Heading outline: h1 → each row title h2 → OpenSlotCell h2
 * → contact h2.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Lang };
  return pageMetadata("work", lang);
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

function splitMeta(meta: string, domain?: string) {
  const [version, ...rest] = meta.split(" · ");
  return { version, platform: rest.join(" · "), domain };
}

export default async function WorkIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: Lang };
  const dict = getDictionary(lang);
  const h = dict.home;
  const w = dict.workIndex;
  const caseHref = CASE_HREF[lang];
  const claimOf = (slug: CaseSlug) => cases[slug]?.locale[lang].claim ?? "";

  return (
    <>
      <HreflangLinks alt={alternatesFor("work")} />

      <section className="wrap py-[var(--pad-section)]">
        <SectionHead heading={w.heading} sideText={w.side} headingLevel="h1" />

        <div className="mt-[clamp(24px,3vw,40px)] flex flex-col divide-y divide-line-strong border-t border-line-strong">
          <Reveal index={0}>
            <ProductCard
              variant="row"
              titleLevel="h2"
              href={caseHref.vaaz}
              title={h.cards.vaaz.title}
              status={{ variant: "live", flag: h.cards.vaaz.flag }}
              meta={splitMeta(h.cards.vaaz.meta, h.cards.vaaz.domain)}
              description={`${h.cards.vaaz.description} ${w.extended.vaaz}`}
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
              variant="row"
              titleLevel="h2"
              href={caseHref.akitle}
              title={h.cards.akitle.title}
              status={{ variant: "live", flag: h.cards.akitle.flag }}
              meta={splitMeta(h.cards.akitle.meta, h.cards.akitle.domain)}
              description={`${h.cards.akitle.description} ${w.extended.akitle}`}
              plate={{ status: h.cards.akitle.flag, name: h.cards.akitle.title, claim: claimOf("akitle"), ratio: "3/2" }}
            />
          </Reveal>
          <Reveal index={2}>
            <ProductCard
              variant="row"
              titleLevel="h2"
              href={caseHref.linkden}
              title={h.cards.linkden.title}
              status={{ variant: "live", flag: h.cards.linkden.flag }}
              meta={splitMeta(h.cards.linkden.meta, h.cards.linkden.domain)}
              description={`${h.cards.linkden.description} ${w.extended.linkden}`}
              plate={{ status: h.cards.linkden.flag, name: h.cards.linkden.title, claim: claimOf("linkden"), ratio: "3/2" }}
            />
          </Reveal>
          <Reveal index={3}>
            <ProductCard
              variant="row"
              titleLevel="h2"
              href={caseHref.characterdex}
              title={h.cards.characterdex.title}
              status={{ variant: "live", flag: h.cards.characterdex.flag }}
              meta={splitMeta(h.cards.characterdex.meta, h.cards.characterdex.domain)}
              description={`${h.cards.characterdex.description} ${w.extended.characterdex}`}
              plate={{ status: h.cards.characterdex.flag, name: h.cards.characterdex.title, claim: claimOf("characterdex"), ratio: "3/2" }}
            />
          </Reveal>
          <Reveal index={4}>
            <ProductCard
              variant="row"
              titleLevel="h2"
              href={caseHref["oasis-and-mind"]}
              title={h.cards.oasis.title}
              status={{ variant: "in-dev", flag: h.cards.oasis.flag }}
              meta={splitMeta(h.cards.oasis.meta)}
              description={`${h.cards.oasis.description} ${w.extended.oasis}`}
              plate={{ status: h.cards.oasis.flag, name: h.cards.oasis.title, claim: claimOf("oasis-and-mind"), ratio: "700/728" }}
            />
          </Reveal>
        </div>

        <Reveal>
          <OpenSlotCell
            className="mt-[clamp(40px,5vw,72px)]"
            titleLevel="h2"
            label={h.openSlot.label}
            title={h.openSlot.title}
            body={h.openSlot.body}
            ctaHref={CONTACT_HREF[lang]}
            ctaLabel={h.openSlot.cta}
          />
        </Reveal>
      </section>

      <Reveal>
        <ContactBand
          variant="compact"
          headingLevel="h2"
          heading={h.contactBand.heading}
          turn={h.contactBand.headingTurn}
          accentHref={CONTACT_HREF[lang]}
          accentLabel={h.contactBand.accentLabel}
        />
      </Reveal>
    </>
  );
}

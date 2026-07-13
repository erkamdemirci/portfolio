import type { Metadata } from "next";
import Link from "next/link";
import { alternatesFor, pageMetadata } from "@/lib/seo";
import { HreflangLinks } from "@/components/seo/hreflang-links";
import { SectionHead } from "@/components/layout/section-head";
import { ServiceGrid, type ServiceCellContent } from "@/components/services/service-cell";
import { StatusChip, type StatusVariant } from "@/components/ui/status-chip";
import { StatBand } from "@/components/bands/stat-band";
import { ContactBand } from "@/components/bands/contact-band";
import { JsonLd, personSchema } from "@/components/seo/json-ld";
import { Reveal } from "@/components/motion/reveal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { CaseSlug } from "@/lib/cases";
import type { Lang } from "@/lib/i18n/routes";

/**
 * 5 — Studio (03-screens-and-flows.md §5). SectionHead H1 + founder lede → principles (h2 İlkeler,
 * 4 cells, h3 each) → product register (h2 Ürünler, a light roll-call linking to each case) →
 * numbers (h2 Sayılar + StatBand with the founder stat) → ContactBand compact.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Lang };
  return pageMetadata("studio", lang);
}

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

export default async function StudioPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: Lang };
  const dict = getDictionary(lang);
  const h = dict.home;
  const s = dict.studioPage;
  const caseHref = CASE_HREF[lang];

  const principleCells: ServiceCellContent[] = s.principles.map((p) => ({ ...p }));

  const register: { slug: CaseSlug; title: string; flag: string; variant: StatusVariant; desc: string }[] = [
    { slug: "vaaz", title: h.cards.vaaz.title, flag: h.cards.vaaz.flag, variant: "live", desc: h.cards.vaaz.description },
    { slug: "akitle", title: h.cards.akitle.title, flag: h.cards.akitle.flag, variant: "live", desc: h.cards.akitle.description },
    { slug: "linkden", title: h.cards.linkden.title, flag: h.cards.linkden.flag, variant: "live", desc: h.cards.linkden.description },
    { slug: "characterdex", title: h.cards.characterdex.title, flag: h.cards.characterdex.flag, variant: "live", desc: h.cards.characterdex.description },
    { slug: "oasis-and-mind", title: h.cards.oasis.title, flag: h.cards.oasis.flag, variant: "in-dev", desc: h.cards.oasis.description },
  ];

  return (
    <>
      <HreflangLinks alt={alternatesFor("studio")} />
      {/* Person — Erkam Demirci (03 §SEO table: Person on /studyo). */}
      <JsonLd data={personSchema(lang)} />

      {/* ---------- Head + founder lede ---------- */}
      <Reveal>
        <section className="wrap pt-[var(--hero-top)] pb-[var(--pad-section)]">
          <SectionHead heading={s.heading} headingLevel="h1" />
          <p className="mt-6 max-w-[62ch] text-[clamp(1.08rem,1.4vw,1.22rem)] leading-[1.6] text-ink-soft text-pretty">
            {s.lede}
          </p>
        </section>
      </Reveal>

      {/* ---------- Principles ---------- */}
      <Reveal>
        <section className="wrap border-t border-line py-[var(--pad-section)]">
          <h2 className="mb-[clamp(24px,3vw,40px)] font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] text-ink">
            {s.principlesEyebrow}
          </h2>
          <ServiceGrid variant="static" cells={principleCells} />
        </section>
      </Reveal>

      {/* ---------- Product register ---------- */}
      <Reveal>
        <section className="wrap border-t border-line py-[var(--pad-section)]">
          <h2 className="mb-[clamp(24px,3vw,40px)] font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] text-ink">
            {s.registerEyebrow}
          </h2>
          <ul aria-label={s.registerAria} className="flex flex-col divide-y divide-line border-t border-line">
            {register.map((p) => (
              <li key={p.slug}>
                <Link
                  href={caseHref[p.slug]}
                  prefetch={false}
                  className="group figure grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-baseline gap-6 py-5 max-[680px]:grid-cols-1 max-[680px]:gap-2 motion-safe:active:[transform:scale(0.985)]"
                >
                  <span className="flex items-baseline gap-3">
                    <span className="font-display text-[1.35rem] leading-[1.2] text-ink underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-[var(--dur-fast)] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:decoration-line">
                      {p.title}
                    </span>
                    <StatusChip variant={p.variant} flag={p.flag} />
                  </span>
                  <span className="max-w-[52ch] text-[0.95rem] leading-[1.6] text-ink-soft text-pretty">{p.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {/* ---------- Numbers ---------- */}
      <Reveal>
        <section className="wrap border-t border-line pt-[var(--pad-section)]">
          <h2 className="mb-[clamp(24px,3vw,40px)] font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] text-ink">
            {s.statsEyebrow}
          </h2>
        </section>
      </Reveal>
      <StatBand
        ariaLabel={s.statsAria}
        cells={[h.statRail.products, h.statRail.platforms, s.founderStat, h.statRail.response]}
      />

      {/* ---------- Contact (compact) ---------- */}
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

import type { Metadata } from "next";
import { alternatesFor, pageMetadata } from "@/lib/seo";
import { HreflangLinks } from "@/components/seo/hreflang-links";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ServiceGrid, type ServiceCellContent } from "@/components/services/service-cell";
import { FleetReadout } from "@/components/telemetry/fleet-readout";
import { StatRail, type StatCell } from "@/components/telemetry/stat-rail";
import { ContactBand } from "@/components/bands/contact-band";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";

/**
 * 9 — Studio (03-screens-and-flows.md §9; 04-tasks.md T26). Ordered sections: head + lede
 * (this page's h1) -> principles (C19-static 4-cell grid, p/01-p/04) -> fleet register (C12
 * Fleet Readout REUSED as a full-width list — same anatomy, 5 rows, just no longer confined
 * to the hero's narrower column) -> stats (C13 StatRail reused with Studio's own values) ->
 * C21 compact contact band.
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

export default async function StudioPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: Lang };
  const dict = getDictionary(lang);
  const h = dict.home;
  const s = dict.studioPage;

  const principleCells: ServiceCellContent[] = s.principles.map((p) => ({ ...p }));

  const statCells: StatCell[] = [
    h.statRail.products,
    h.statRail.platforms,
    s.founderStat,
    h.statRail.response,
  ];

  return (
    <>
      <HreflangLinks alt={alternatesFor("studio")} />

      {/* ---------- 01 — stüdyo / dmrc kimdir (head + lede) ---------- */}
      <section className="wrap pt-[var(--hero-top)] pb-[var(--sec-tight)]">
        <Eyebrow variant="hero">{s.eyebrow}</Eyebrow>
        <h1 className="max-w-[16ch] text-balance text-[clamp(2.8rem,6vw,5rem)] leading-[1.02] font-bold tracking-[-0.03em]">
          {s.heading}
        </h1>
        <p className="mt-[26px] max-w-[52ch] text-[1.1rem] text-steel">{s.lede}</p>
      </section>

      {/* ---------- 02 — ilkeler / böyle çalışırız ---------- */}
      <section className="wrap border-t border-line py-[var(--sec-tight)]">
        <Eyebrow variant="section">{s.principlesEyebrow}</Eyebrow>
        <ServiceGrid variant="static" cells={principleCells} className="mt-2" />
      </section>

      {/* ---------- 03 — filo kaydı / beş ünite (C12 reused full-width; no page-level
           heading is given for this section in 03 — the panel's own head ("Filo panosu")
           already carries it) ---------- */}
      <section className="wrap border-t border-line py-[var(--sec)]">
        <Eyebrow variant="section">{s.registerEyebrow}</Eyebrow>
        <FleetReadout lang={lang} ariaLabel={s.registerAria} />
      </section>

      {/* ---------- 04 — telemetri / rakamlar (C13 reused) ---------- */}
      <section className="wrap border-t border-line py-[var(--sec-tight)]">
        <Eyebrow variant="section">{s.statsEyebrow}</Eyebrow>
        <StatRail ariaLabel={s.statsAria} cells={statCells} />
      </section>

      {/* ---------- 05 — iletişim / slot-06 (compact) ---------- */}
      <ContactBand
        variant="compact"
        eyebrow={s.contactEyebrow}
        heading={h.contactBand.heading}
        accentHref={CONTACT_HREF[lang]}
        accentLabel={dict.nav.cta}
      />
    </>
  );
}

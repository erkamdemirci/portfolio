import type { Metadata } from "next";
import { alternatesFor, pageMetadata } from "@/lib/seo";
import { HreflangLinks } from "@/components/seo/hreflang-links";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHead } from "@/components/layout/section-head";
import { ServiceGrid, type ServiceCellContent } from "@/components/services/service-cell";
import { KvBlock, type KvRow } from "@/components/telemetry/kv-block";
import { ContactBand } from "@/components/bands/contact-band";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";

/**
 * 8 — Services (03-screens-and-flows.md §8; 04-tasks.md T25). Ordered sections: C10 head
 * (h2 — this page's h1 lives in the head via headingLevel="h1") -> C19 grid (linked, IN-PAGE
 * anchors to the detail blocks below, per 03: "cells anchor-link (C19 linked, in-page)") ->
 * four detail blocks (own C9 index + h3 + body + 3-item "dahil olanlar" list) -> çalışma
 * modeli (eyebrow + 5 numbered mono steps + C20 kv) -> C21 full contact band. Section-padding
 * rhythm follows 03's own line verbatim: "tight grid -> airy details -> dense steps -> airy
 * band".
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Lang };
  return pageMetadata("services", lang);
}

const CONTACT_HREF: Record<Lang, string> = { tr: "/iletisim", en: "/en/contact" };
const WORK_HREF: Record<Lang, string> = { tr: "/isler", en: "/en/work" };

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: Lang };
  const dict = getDictionary(lang);
  const h = dict.home;
  const s = dict.servicesPage;

  const gridCells: ServiceCellContent[] = [
    { ...h.services.cellOne, href: `#${s.details[0].anchor}` },
    { ...h.services.cellTwo, href: `#${s.details[1].anchor}` },
    { ...h.services.cellThree, href: `#${s.details[2].anchor}` },
    { ...h.services.cellFour, href: `#${s.details[3].anchor}` },
  ];

  const kvRows: KvRow[] = [
    { key: s.kvModel.key, value: s.kvModel.value },
    { key: s.kvCapacity.key, value: s.kvCapacity.value },
    { key: s.kvStart.key, value: s.kvStart.value },
  ];

  return (
    <>
      <HreflangLinks alt={alternatesFor("services")} />

      {/* ---------- 01 — hizmetler / neler üstleniyoruz (head + grid, "tight grid") ---------- */}
      <section className="wrap pt-[var(--hero-top)] pb-[var(--sec-tight)]">
        <SectionHead eyebrow={s.eyebrow} heading={s.heading} headingLevel="h1" />
        <ServiceGrid variant="linked" cells={gridCells} />
      </section>

      {/* ---------- Service details — four blocks, single column, "airy details" ---------- */}
      <section className="wrap border-t border-line py-[var(--sec)]">
        <div className="flex flex-col divide-y divide-line">
          {s.details.map((item) => (
            <div key={item.anchor} id={item.anchor} className="svc-detail scroll-mt-24 py-10 first:pt-0 last:pb-0">
              <Eyebrow variant="section" className="mb-4">
                {item.index}
              </Eyebrow>
              <h3 className="text-[1.2rem] leading-[1.6] font-semibold tracking-[-0.015em]">{item.title}</h3>
              <p className="mt-3 max-w-[58ch] text-[0.975rem] text-steel">{item.body}</p>
              <div className="mt-6">
                <span className="mono text-steel">{s.includedLabel}</span>
                <ul className="mt-3 flex flex-col divide-y divide-line border-t border-line max-w-[52ch]">
                  {item.included.map((line) => (
                    <li key={line} className="mono py-2 text-steel">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 02 — çalışma modeli / böyle yürür ("dense steps") ---------- */}
      <section className="wrap border-t border-line py-[var(--sec-tight)]">
        <Eyebrow variant="section">{s.modelEyebrow}</Eyebrow>
        <div className="grid grid-cols-[7fr_5fr] gap-x-16 gap-y-8 max-[1020px]:grid-cols-1">
          <ul className="flex flex-col gap-3">
            {s.steps.map((step) => (
              <li key={step} className="svc-step mono text-steel">
                {step}
              </li>
            ))}
          </ul>
          <KvBlock ariaLabel={s.kvAriaLabel} rows={kvRows} className="self-start" />
        </div>
      </section>

      {/* ---------- 03 — iletişim / slot-06 (full, "airy band") ---------- */}
      <ContactBand
        variant="full"
        eyebrow={s.contactEyebrow}
        heading={h.contactBand.heading}
        lede={h.contactBand.lede}
        accentHref={CONTACT_HREF[lang]}
        accentLabel={h.contactBand.accentLabel}
        ghostHref={WORK_HREF[lang]}
        ghostLabel={h.contactBand.ghostLabel}
        kvAriaLabel={h.contactBand.kvAriaLabel}
        kvRows={[
          {
            key: h.contactBand.kvEmail.key,
            value: <a href={`mailto:${h.contactBand.kvEmail.value}`}>{h.contactBand.kvEmail.value}</a>,
          },
          { key: h.contactBand.kvBase.key, value: h.contactBand.kvBase.value },
          { key: h.contactBand.kvResponse.key, value: h.contactBand.kvResponse.value },
          { key: h.contactBand.kvStack.key, value: h.contactBand.kvStack.value },
        ]}
      />
    </>
  );
}

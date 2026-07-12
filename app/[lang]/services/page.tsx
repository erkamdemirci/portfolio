import type { Metadata } from "next";
import { alternatesFor, pageMetadata } from "@/lib/seo";
import { HreflangLinks } from "@/components/seo/hreflang-links";
import { SectionHead } from "@/components/layout/section-head";
import { ServiceDetail } from "@/components/services/service-cell";
import { KvBlock, type KvRow } from "@/components/bands/kv-block";
import { ContactBand } from "@/components/bands/contact-band";
import { Reveal } from "@/components/motion/reveal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";

/**
 * 4 — Services (03-screens-and-flows.md §4). SectionHead H1 + intro → offerings (4 ServiceDetail
 * blocks with id anchors under one h2) → the four-question FAQ band (standalone h2s, feeds the
 * FAQPage schema T67) → engagement model (5 steps + KvBlock) → ContactBand compact.
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

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: Lang };
  const dict = getDictionary(lang);
  const h = dict.home;
  const s = dict.servicesPage;

  const kvRows: KvRow[] = [
    { key: s.kvModel.key, value: s.kvModel.value },
    { key: s.kvCapacity.key, value: s.kvCapacity.value, mono: true },
    { key: s.kvStart.key, value: s.kvStart.value },
  ];

  return (
    <>
      <HreflangLinks alt={alternatesFor("services")} />

      {/* ---------- Head + intro ---------- */}
      <Reveal>
        <section className="wrap pt-[var(--hero-top)] pb-[var(--pad-section)]">
          <SectionHead heading={s.heading} headingLevel="h1" />
          <p className="mt-6 max-w-[60ch] text-[clamp(1.08rem,1.4vw,1.22rem)] leading-[1.6] text-ink-soft text-pretty">
            {s.intro}
          </p>
        </section>
      </Reveal>

      {/* ---------- Offerings — 4 detail blocks (h3) under one h2 ---------- */}
      <section className="wrap border-t border-line py-[var(--pad-section)]">
        <h2 className="mb-[clamp(24px,3vw,40px)] font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] text-ink">
          {dict.nav.services}
        </h2>
        <div className="flex flex-col divide-y divide-line">
          {s.details.map((item) => (
            <Reveal key={item.anchor}>
              <ServiceDetail
                anchor={item.anchor}
                title={item.title}
                body={item.body}
                included={item.included}
                includedLabel={s.includedLabel}
                titleLevel="h3"
                className="py-[clamp(28px,4vw,44px)] first:pt-0"
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- FAQ band — four standalone h2 questions (feeds FAQPage, T67) ---------- */}
      <section className="wrap border-t border-line py-[var(--pad-section)]">
        <div className="flex flex-col gap-[clamp(32px,4vw,56px)]">
          {s.faq.map((item) => (
            <Reveal key={item.q}>
              <div className="max-w-[68ch]">
                <h2 className="font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.15] text-ink text-balance">
                  {item.q}
                </h2>
                <p className="mt-4 text-[1.05rem] leading-[1.6] text-ink text-pretty">{item.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Engagement model — 5 steps + KvBlock ---------- */}
      <Reveal>
        <section className="wrap border-t border-line py-[var(--pad-section)]">
          <h2 className="mb-[clamp(24px,3vw,40px)] font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] text-ink">
            {s.modelEyebrow}
          </h2>
          <div className="grid grid-cols-[1.2fr_0.8fr] gap-[clamp(32px,5vw,72px)] max-[900px]:grid-cols-1 max-[900px]:gap-10">
            <ol className="flex flex-col divide-y divide-line border-t border-line">
              {s.steps.map((step) => (
                <li key={step} className="py-3 text-[1rem] leading-[1.5] text-ink">
                  {step}
                </li>
              ))}
            </ol>
            <KvBlock ariaLabel={s.kvAriaLabel} rows={kvRows} className="self-start" />
          </div>
        </section>
      </Reveal>

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

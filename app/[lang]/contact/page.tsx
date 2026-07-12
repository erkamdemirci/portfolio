import type { Metadata } from "next";
import { alternatesFor, pageMetadata } from "@/lib/seo";
import { HreflangLinks } from "@/components/seo/hreflang-links";
import { SectionHead } from "@/components/layout/section-head";
import { ContactActions } from "@/components/contact/contact-actions";
import { ContactForm, type ContactFormCopy } from "@/components/contact/contact-form";
import { KvBlock, type KvRow } from "@/components/bands/kv-block";
import { TextLink } from "@/components/ui/text-link";
import { Reveal } from "@/components/motion/reveal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { siteConfig } from "@/lib/site-config";
import type { Lang } from "@/lib/i18n/routes";

/**
 * 6 — Contact (03-screens-and-flows.md §6). The page IS the contact surface (no ContactBand).
 * Heading outline: h1 → ContactActions row (no heading) → ContactForm in a labelled section
 * (no h2) → h2 "Yanıt protokolü" → the facts KvBlock in a labelled section (no h2). Only one h2.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Lang };
  return pageMetadata("contact", lang);
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: Lang };
  const dict = getDictionary(lang);
  const h = dict.home;
  const c = dict.contactPage;

  const formCopy: ContactFormCopy = {
    ...c.form,
    kvkkConsent: c.kvkkConsent,
    kvkkDisclosureToggle: c.kvkkDisclosureToggle,
    kvkkDisclosure: c.kvkkDisclosure,
    kvkkBlocked: c.kvkkBlocked,
  };

  // Contact facts (02 §KvBlock content): e-posta · konum · yanıt · yığın — the same facts as the
  // home contact band (03 gives one set of kv facts).
  const factsRows: KvRow[] = [
    {
      key: h.contactBand.kvEmail.key,
      value: <TextLink href={`mailto:${h.contactBand.kvEmail.value}`}>{h.contactBand.kvEmail.value}</TextLink>,
    },
    { key: h.contactBand.kvBase.key, value: h.contactBand.kvBase.value },
    { key: h.contactBand.kvResponse.key, value: h.contactBand.kvResponse.value, mono: true },
    { key: h.contactBand.kvStack.key, value: h.contactBand.kvStack.value },
  ];

  return (
    <>
      <HreflangLinks alt={alternatesFor("contact")} />

      {/* ---------- Head: h1 + lede + ContactActions full (no heading) ---------- */}
      <Reveal>
        <section className="wrap pt-[var(--hero-top)] pb-[var(--pad-section)]">
          <SectionHead heading={c.heading} headingLevel="h1" />
          <p className="mt-6 max-w-[60ch] text-[clamp(1.08rem,1.4vw,1.22rem)] leading-[1.6] text-ink-soft text-pretty">
            {c.lede}
          </p>
          <ContactActions variant="full" labels={c.actions} className="mt-8" />
        </section>
      </Reveal>

      {/* ---------- Form (labelled section, no h2) ---------- */}
      <section aria-label={c.formAria} className="wrap border-t border-line py-[var(--pad-section)]">
        <ContactForm copy={formCopy} email={siteConfig.email} />
      </section>

      {/* ---------- Yanıt protokolü (the page's only h2) ---------- */}
      <Reveal>
        <section className="wrap border-t border-line py-[var(--pad-section)]">
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] text-ink">
            {c.protocolHeading}
          </h2>
          <ol className="mt-8 flex max-w-[52ch] flex-col divide-y divide-line border-t border-line">
            {c.steps.map((step) => (
              <li key={step} className="py-3 text-[1rem] leading-[1.5] text-ink">
                {step}
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

      {/* ---------- Facts (labelled section, no h2) ---------- */}
      <Reveal>
        <section aria-label={c.factsAria} className="wrap border-t border-line py-[var(--pad-section)]">
          <KvBlock ariaLabel={c.factsAria} rows={factsRows} className="max-w-[42rem]" />
        </section>
      </Reveal>
    </>
  );
}

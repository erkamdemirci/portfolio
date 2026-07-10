import type { Metadata } from "next";
import { ContactBand } from "@/components/bands/contact-band";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";

/**
 * 10 — Contact (03-screens-and-flows.md §10; 04-tasks.md T27). C21 full AS the page body
 * (heading level h1 — this page's only h1, eyebrow renumbered "01 — iletişim / slot-06")
 * -> yanıt protokolü / response protocol (3 numbered mono steps). No form anywhere (brief
 * rule). The band's heading/lede/buttons/kv content is byte-identical to Home's contact
 * band (03 gives the same strings verbatim) — only the eyebrow differs per page.
 */

const META: Record<Lang, Metadata> = {
  tr: {
    title: "İletişim — DMRC",
    description: "Slot 06 boş. Brifinizi e-postayla gönderin; 48 saat içinde yazılı yanıt.",
  },
  en: {
    title: "Contact — DMRC",
    description: "Bay 06 is empty. Send your brief by email; a written reply within 48 hours.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Lang };
  return META[lang];
}

const WORK_HREF: Record<Lang, string> = { tr: "/isler", en: "/en/work" };

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: Lang };
  const dict = getDictionary(lang);
  const h = dict.home;
  const c = dict.contactPage;

  return (
    <>
      {/* ---------- 01 — iletişim / slot-06 (C21 full, h1) ---------- */}
      <ContactBand
        variant="full"
        headingLevel="h1"
        eyebrow={c.eyebrow}
        heading={h.contactBand.heading}
        lede={h.contactBand.lede}
        accentHref={`mailto:${h.contactBand.kvEmail.value}`}
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

      {/* ---------- Yanıt protokolü / Response protocol ---------- */}
      <section className="wrap border-t border-line py-[var(--sec-tight)]">
        <h2 className="text-balance text-[clamp(1.9rem,3.4vw,2.7rem)] leading-[1.08] font-semibold tracking-[-0.025em]">
          {c.protocolHeading}
        </h2>
        <ul className="mt-8 flex flex-col gap-3">
          {c.steps.map((step) => (
            <li key={step} className="mono text-steel">
              {step}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FleetReadout } from "@/components/telemetry/fleet-readout";
import { StatRail } from "@/components/telemetry/stat-rail";
import { BrowserBay } from "@/components/frames/browser-bay";
import { PhoneBay } from "@/components/frames/phone-bay";
import { UnitCard, ExternalTelLink } from "@/components/fleet/unit-card";
import { ReservedBay } from "@/components/fleet/reserved-bay";
import { SectionHead } from "@/components/layout/section-head";
import { ServiceGrid, type ServiceCellContent } from "@/components/services/service-cell";
import { ContactBand } from "@/components/bands/contact-band";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";

/**
 * 1 — Home (03-screens-and-flows.md §1; 04-tasks.md T21). Ordered sections: hero (no raster
 * image — LCP is the h1 text, 01 §Imagery) → fleet teaser (five C14 + C18) → services teaser
 * (C19 linked ×4 + C8) → studio teaser band → contact band (C21 full). Copy verbatim from
 * lib/i18n/dictionaries/{tr,en}.ts `home` block (sourced from 03 §1 / 02-components.md).
 */

const META: Record<Lang, Metadata> = {
  tr: {
    title: "DMRC — Ürün stüdyosu · Web & mobil",
    description:
      "Kendi ürünlerimizi geliştiriyoruz — ve sizinkini. Beş ürünlük filo: web ve mobil ürün mühendisliği, tasarımdan operasyona.",
  },
  en: {
    title: "DMRC — Product studio · Web & mobile",
    description:
      "We build our own products — and yours. A five-product fleet: web and mobile product engineering, design through operations.",
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
const SERVICES_HREF: Record<Lang, string> = { tr: "/hizmetler", en: "/en/services" };
const STUDIO_HREF: Record<Lang, string> = { tr: "/studyo", en: "/en/studio" };
const CONTACT_HREF: Record<Lang, string> = { tr: "/iletisim", en: "/en/contact" };

const CASE_HREF: Record<Lang, Record<"vaaz" | "akitle" | "linkden" | "characterdex" | "oasis", string>> = {
  tr: {
    vaaz: "/isler/vaaz",
    akitle: "/isler/akitle",
    linkden: "/isler/linkden",
    characterdex: "/isler/characterdex",
    oasis: "/isler/oasis-and-mind",
  },
  en: {
    vaaz: "/en/work/vaaz",
    akitle: "/en/work/akitle",
    linkden: "/en/work/linkden",
    characterdex: "/en/work/characterdex",
    oasis: "/en/work/oasis-and-mind",
  },
};

// Descriptive, localized alt text (01 §Imagery — never "screenshot"). Not spec-cited verbatim
// (03/02 don't pin exact alt strings); implementer-authored per the 01 rule's own example.
const IMAGE_ALT: Record<Lang, Record<"vaaz" | "akitle" | "linkden" | "characterdex", string>> = {
  tr: {
    vaaz: "VAAZ namaz vakti geri sayım ekranı — İstanbul, sonraki vakit kartı",
    akitle: "Akitle kira sözleşmesi editörü — satır kalemleri ve imzalandı rozeti",
    linkden: "Linkden dokümantasyon paneli — arama gecikme rozetleriyle",
    characterdex: "CharacterDex uygulama paneli — üç kolonlu tip profili düzeni",
  },
  en: {
    vaaz: "VAAZ prayer-time countdown screen — Istanbul, next-prayer card",
    akitle: "Akitle rental contract editor — line items and signed badge",
    linkden: "Linkden documentation panel — with search latency badges",
    characterdex: "CharacterDex app panel — three-column type-profile layout",
  },
};

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: Lang };
  const dict = getDictionary(lang);
  const h = dict.home;
  const caseHref = CASE_HREF[lang];
  const alt = IMAGE_ALT[lang];

  const serviceCells: ServiceCellContent[] = [
    { ...h.services.cellOne, href: SERVICES_HREF[lang] },
    { ...h.services.cellTwo, href: SERVICES_HREF[lang] },
    { ...h.services.cellThree, href: SERVICES_HREF[lang] },
    { ...h.services.cellFour, href: SERVICES_HREF[lang] },
  ];

  return (
    <>
      {/* ---------- Hero — no raster image; LCP is the h1 text (01 §Imagery) ---------- */}
      <section className="wrap pt-[var(--hero-top)]">
        <div className="grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] grid-rows-[auto_auto] gap-x-[var(--gap-col)] max-[1020px]:grid-cols-1 max-[1020px]:grid-rows-[auto_auto_auto]">
          <div className="col-start-1 row-start-1 pb-[clamp(48px,5vw,72px)]">
            <Eyebrow variant="hero">{h.eyebrow}</Eyebrow>
            <h1 className="max-w-[14ch] text-balance text-[clamp(2.8rem,6vw,5rem)] font-bold leading-[1.02] tracking-[-0.03em]">
              {h.h1Lead}
              <span className="block pl-[0.9ch]">
                <span
                  aria-hidden="true"
                  className="mr-[0.18em] inline-block h-[0.62em] w-[0.42em] translate-y-[0.02em] rounded-xs bg-amber-mark"
                />
                {h.h1Turn}
              </span>
            </h1>
            <p className="mt-[26px] max-w-[52ch] text-[1.1rem] text-steel">{h.lede}</p>
            <div className="mt-[34px] flex flex-wrap items-center gap-5">
              <Button variant="accent" href={CONTACT_HREF[lang]}>
                {dict.nav.cta}
              </Button>
              <span className="mono text-steel">
                <a
                  href={`mailto:${h.email}`}
                  className="transition-colors duration-[var(--dur-base)] ease-[var(--ease)] hover:text-amber-text"
                >
                  {h.email}
                </a>
              </span>
            </div>
          </div>

          <FleetReadout
            lang={lang}
            ariaLabel={h.fleetReadoutAria}
            className="col-start-2 row-start-1 self-start max-[1020px]:col-start-1 max-[1020px]:row-start-2 max-[1020px]:mb-11"
          />

          <StatRail
            ariaLabel={h.statRailAria}
            cells={[h.statRail.products, h.statRail.platforms, h.statRail.response, h.statRail.openSlot]}
            className="col-span-2 row-start-2 self-end max-[1020px]:col-span-1 max-[1020px]:row-start-3"
          />
        </div>
      </section>

      {/* ---------- Fleet teaser — 01 — işler / üretimde kanıt ---------- */}
      <section className="wrap border-t border-line py-[var(--sec)]">
        <SectionHead
          eyebrow={h.fleet.eyebrow}
          heading={h.fleet.heading}
          sideText={h.fleet.side}
          headingLevel="h2"
        />

        <div className="grid grid-cols-12 gap-[var(--gap-grid)]">
          <UnitCard
            span={5}
            unitLabel={h.cards.vaaz.unitLabel}
            status={{ variant: "live", flag: h.cards.vaaz.flag, meta: h.cards.vaaz.meta }}
            frame={
              <PhoneBay
                image={{
                  src: "/screens/vaaz/times-390.png",
                  alt: alt.vaaz,
                  width: 700,
                  height: 728,
                }}
              />
            }
            href={caseHref.vaaz}
            title={h.cards.vaaz.title}
            description={h.cards.vaaz.description}
            telLine1={<ExternalTelLink href={`https://${h.cards.vaaz.domain}`} label={h.cards.vaaz.domain} />}
            telLine2={
              <>
                <b>{h.cards.vaaz.rating}</b> {h.cards.vaaz.ratingSuffix}
              </>
            }
          />

          <UnitCard
            span={7}
            unitLabel={h.cards.akitle.unitLabel}
            status={{ variant: "live", flag: h.cards.akitle.flag, meta: h.cards.akitle.meta }}
            frame={
              <BrowserBay
                domain={h.cards.akitle.domain}
                span={7}
                image={{
                  src: "/screens/akitle/editor-1600.png",
                  alt: alt.akitle,
                  width: 894,
                  height: 754,
                }}
              />
            }
            href={caseHref.akitle}
            title={h.cards.akitle.title}
            description={h.cards.akitle.description}
            telLine1={<ExternalTelLink href={`https://${h.cards.akitle.domain}`} label={h.cards.akitle.domain} />}
            telLine2={h.cards.akitle.telLine2}
          />

          <UnitCard
            span={5}
            unitLabel={h.cards.linkden.unitLabel}
            status={{ variant: "live", flag: h.cards.linkden.flag, meta: h.cards.linkden.meta }}
            frame={
              <BrowserBay
                domain={h.cards.linkden.domain}
                span={5}
                image={{
                  src: "/screens/linkden/panel-1600.png",
                  alt: alt.linkden,
                  width: 1180,
                  height: 784,
                }}
              />
            }
            href={caseHref.linkden}
            title={h.cards.linkden.title}
            description={h.cards.linkden.description}
            telLine1={<ExternalTelLink href={`https://${h.cards.linkden.domain}`} label={h.cards.linkden.domain} />}
            telLine2={h.cards.linkden.telLine2}
          />

          <UnitCard
            span={7}
            unitLabel={h.cards.characterdex.unitLabel}
            status={{ variant: "live", flag: h.cards.characterdex.flag, meta: h.cards.characterdex.meta }}
            frame={
              <BrowserBay
                domain={h.cards.characterdex.domain}
                span={7}
                image={{
                  src: "/screens/characterdex/profiles-1600.png",
                  alt: alt.characterdex,
                  width: 1600,
                  height: 1000,
                }}
              />
            }
            href={caseHref.characterdex}
            title={h.cards.characterdex.title}
            description={h.cards.characterdex.description}
            telLine1={
              <ExternalTelLink href={`https://${h.cards.characterdex.domain}`} label={h.cards.characterdex.domain} />
            }
            telLine2={h.cards.characterdex.telLine2}
          />

          <UnitCard
            span={5}
            unitLabel={h.cards.oasis.unitLabel}
            status={{ variant: "in-dev", flag: h.cards.oasis.flag, meta: h.cards.oasis.meta }}
            frame={
              <PhoneBay
                slot={{
                  bars: [
                    { top: "36px", left: "14%", width: "44%", height: "12px" },
                    { top: "58px", left: "14%", width: "72%", height: "34px", tone: "skel-2" },
                    { top: "106px", left: "14%", width: "26%", height: "7px", tone: "amber" },
                  ],
                  label: { title: h.cards.oasis.slotTitle, body: h.cards.oasis.slotBody },
                }}
              />
            }
            href={caseHref.oasis}
            title={h.cards.oasis.title}
            description={h.cards.oasis.description}
            telLine1={h.cards.oasis.telLine1}
            telLine2={h.cards.oasis.telLine2}
          />

          <ReservedBay
            slotLabel={h.bay06.slotLabel}
            capacityLabel={h.bay06.capacityLabel}
            title={h.bay06.title}
            body={h.bay06.body}
            ctaHref={CONTACT_HREF[lang]}
            ctaLabel={dict.nav.cta}
            note={h.bay06.note}
          />
        </div>
      </section>

      {/* ---------- Services teaser — 02 — hizmetler / neler üstleniyoruz ---------- */}
      <section className="wrap border-t border-line py-[var(--sec-tight)]">
        <SectionHead
          eyebrow={h.services.eyebrow}
          heading={h.services.heading}
          sideText={h.services.side}
          headingLevel="h2"
        />
        <ServiceGrid variant="linked" cells={serviceCells} />
        <div className="mt-8">
          <ArrowLink href={SERVICES_HREF[lang]}>{h.services.ctaLabel}</ArrowLink>
        </div>
      </section>

      {/* ---------- Studio teaser band — 03 — stüdyo / dmrc kimdir (extrapolated, 03 §1) ---------- */}
      <section className="wrap border-t border-line py-[var(--sec-tight)]">
        <div className="max-w-[46ch]">
          <Eyebrow variant="section">{h.studio.eyebrow}</Eyebrow>
          <h2 className="text-balance text-[clamp(1.9rem,3.4vw,2.7rem)] leading-[1.08] font-semibold tracking-[-0.025em]">
            {h.studio.heading}
          </h2>
          <p className="mt-5 max-w-[52ch] text-[1rem] text-steel">{h.studio.lede}</p>
          <div className="mt-8">
            <ArrowLink href={STUDIO_HREF[lang]}>{h.studio.ctaLabel}</ArrowLink>
          </div>
        </div>
      </section>

      {/* ---------- Contact band (full) — 04 — iletişim / slot-06 ---------- */}
      <ContactBand
        variant="full"
        headingLevel="h2"
        eyebrow={h.contactBand.eyebrow}
        heading={h.contactBand.heading}
        lede={h.contactBand.lede}
        accentHref={CONTACT_HREF[lang]}
        accentLabel={h.contactBand.accentLabel}
        ghostHref={WORK_HREF[lang]}
        ghostLabel={h.contactBand.ghostLabel}
        kvAriaLabel={h.contactBand.kvAriaLabel}
        kvRows={[
          { key: h.contactBand.kvEmail.key, value: <a href={`mailto:${h.contactBand.kvEmail.value}`}>{h.contactBand.kvEmail.value}</a> },
          { key: h.contactBand.kvBase.key, value: h.contactBand.kvBase.value },
          { key: h.contactBand.kvResponse.key, value: h.contactBand.kvResponse.value },
          { key: h.contactBand.kvStack.key, value: h.contactBand.kvStack.value },
        ]}
      />
    </>
  );
}

import type { Metadata } from "next";
import { SectionHead } from "@/components/layout/section-head";
import { BrowserBay } from "@/components/frames/browser-bay";
import { PhoneBay } from "@/components/frames/phone-bay";
import { UnitCard, ExternalTelLink } from "@/components/fleet/unit-card";
import { ReservedBay } from "@/components/fleet/reserved-bay";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";

/**
 * 2 — Work index (03-screens-and-flows.md §2; 04-tasks.md T22). C10 head (h1 — this is the
 * page's only h1, per the heading-outline rule) + the same 5-card fleet grid as Home's teaser,
 * with an extended second sentence per card, closed by C18. Public URL /isler via the T04
 * locale-rewrite middleware.
 */

const META: Record<Lang, Metadata> = {
  tr: {
    title: "İşler — DMRC",
    description:
      "Tüm filo kaydı: VAAZ, Akitle, Linkden, CharacterDex, Oasis and Mind. Her vaka kaydı filodaki gerçek üründür — dördü üretimde, biri geliştirmede.",
  },
  en: {
    title: "Work — DMRC",
    description:
      "The full fleet record: VAAZ, Akitle, Linkden, CharacterDex, Oasis and Mind. Every case record is a real product in the fleet — four in production, one in development.",
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

// Same descriptive, localized alt text convention as Home (T21) — not spec-cited verbatim.
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

export default async function WorkIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: Lang };
  const dict = getDictionary(lang);
  const h = dict.home;
  const w = dict.workIndex;
  const caseHref = CASE_HREF[lang];
  const alt = IMAGE_ALT[lang];

  return (
    <section className="wrap py-[var(--sec)]">
      <SectionHead
        eyebrow={w.eyebrow}
        heading={w.heading}
        sideText={w.side}
        headingLevel="h1"
      />

      <div className="grid grid-cols-12 gap-[var(--gap-grid)]">
        <UnitCard
          span={5}
          unitLabel={h.cards.vaaz.unitLabel}
          status={{ variant: "live", flag: h.cards.vaaz.flag, meta: h.cards.vaaz.meta }}
          frame={
            <PhoneBay
              image={{ src: "/screens/vaaz/times-390.png", alt: alt.vaaz, width: 700, height: 728 }}
            />
          }
          href={caseHref.vaaz}
          title={h.cards.vaaz.title}
          description={`${h.cards.vaaz.description} ${w.extended.vaaz}`}
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
              image={{ src: "/screens/akitle/editor-1600.png", alt: alt.akitle, width: 898, height: 856 }}
            />
          }
          href={caseHref.akitle}
          title={h.cards.akitle.title}
          description={`${h.cards.akitle.description} ${w.extended.akitle}`}
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
              image={{ src: "/screens/linkden/panel-1600.png", alt: alt.linkden, width: 1180, height: 784 }}
            />
          }
          href={caseHref.linkden}
          title={h.cards.linkden.title}
          description={`${h.cards.linkden.description} ${w.extended.linkden}`}
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
          description={`${h.cards.characterdex.description} ${w.extended.characterdex}`}
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
          description={`${h.cards.oasis.description} ${w.extended.oasis}`}
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
  );
}

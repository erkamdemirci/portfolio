import Link from "next/link";
import type { Lang } from "@/lib/i18n/routes";

/**
 * C12 — Fleet Readout panel (02-components.md §C12). The header dot carries the site's
 * ONE motion moment (01 §Motion, wired in T14) — every other status dot on the site,
 * including the five row dots below, is static.
 *
 * EN row-role copy note (DEVIATIONS.md, T13): 02 §C12 spells out TR row content only;
 * the EN equivalents below are the machineshop.html mockup's own original English panel
 * rows for these same five products (ground truth for content the written spec is
 * silent on, per 01 Amendment A6) — not new translations.
 */

type UnitKey = "vaaz" | "akitle" | "linkden" | "characterdex" | "oasis";

interface FleetRow {
  key: UnitKey;
  name: string;
  role: string;
  status: "live" | "in-dev";
  flag: string;
  version: string;
  platform: string;
}

const CASE_HREF: Record<Lang, Record<UnitKey, string>> = {
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

const FLEET: Record<Lang, FleetRow[]> = {
  tr: [
    {
      key: "vaaz",
      name: "VAAZ",
      role: "Namaz vakti yol arkadaşı",
      status: "live",
      flag: "CANLI",
      version: "v2.4",
      platform: "iOS · Android",
    },
    {
      key: "akitle",
      name: "AKITLE",
      role: "Kira sözleşmesi SaaS'ı",
      status: "live",
      flag: "CANLI",
      version: "v3.1",
      platform: "Web",
    },
    {
      key: "linkden",
      name: "LINKDEN",
      role: "Geliştirici ekipler için dokümantasyon",
      status: "live",
      flag: "CANLI",
      version: "v1.8",
      platform: "Web",
    },
    {
      key: "characterdex",
      name: "CHARACTERDEX",
      role: "Kişilik tipleri + kehanet kartları",
      status: "live",
      flag: "CANLI",
      version: "v2.0",
      platform: "Web",
    },
    {
      key: "oasis",
      name: "OASIS AND MIND",
      role: "Sağlıklı yaşam bakım oyunu",
      status: "in-dev",
      flag: "GELİŞTİRMEDE",
      version: "v0.9",
      platform: "Mobil",
    },
  ],
  en: [
    {
      key: "vaaz",
      name: "VAAZ",
      role: "Prayer companion app",
      status: "live",
      flag: "LIVE",
      version: "v2.4",
      platform: "iOS / Android",
    },
    {
      key: "akitle",
      name: "AKITLE",
      role: "Rental contract SaaS",
      status: "live",
      flag: "LIVE",
      version: "v3.1",
      platform: "Web",
    },
    {
      key: "linkden",
      name: "LINKDEN",
      role: "Docs platform for dev teams",
      status: "live",
      flag: "LIVE",
      version: "v1.8",
      platform: "Web",
    },
    {
      key: "characterdex",
      name: "CHARACTERDEX",
      role: "Personality typing + oracle cards",
      status: "live",
      flag: "LIVE",
      version: "v2.0",
      platform: "Web",
    },
    {
      key: "oasis",
      name: "OASIS AND MIND",
      role: "Wellness care game",
      status: "in-dev",
      flag: "IN DEV",
      version: "v0.9",
      platform: "Mobile",
    },
  ],
};

const HEAD_CONTENT: Record<Lang, { title: string; liveFlag: string }> = {
  tr: { title: "Filo panosu", liveFlag: "canlı" },
  en: { title: "Fleet readout", liveFlag: "live" },
};

const FOOT_CONTENT: Record<Lang, { summary: string; poll: string }> = {
  tr: { summary: "04 canlı · 01 geliştirmede", poll: "yoklama 60 sn" },
  en: { summary: "04 live · 01 in dev", poll: "poll 60s" },
};

interface FleetReadoutProps {
  lang: Lang;
  ariaLabel: string;
  className?: string;
}

export function FleetReadout({ lang, ariaLabel, className }: FleetReadoutProps) {
  const rows = FLEET[lang];
  const hrefs = CASE_HREF[lang];
  const head = HEAD_CONTENT[lang];
  const foot = FOOT_CONTENT[lang];

  return (
    <aside
      aria-label={ariaLabel}
      className={`overflow-hidden rounded border border-line bg-carbon-2 ${className ?? ""}`}
    >
      <div className="mono flex items-center justify-between border-b border-line px-5 py-4 text-steel">
        <b className="font-medium text-bright">{head.title}</b>
        <span className="inline-flex items-center gap-2 text-amber-text">
          {/* The site's ONE motion moment (01 §Motion) — every other status dot is static. */}
          <span aria-hidden="true" className="pulse h-2 w-2 rounded-full bg-amber-mark" />
          {head.liveFlag}
        </span>
      </div>

      {rows.map((row) => (
        <Link
          key={row.key}
          href={hrefs[row.key]}
          prefetch={false}
          className="grid grid-cols-[16px_minmax(0,1fr)_auto] items-center gap-x-3 border-b border-line px-5 py-3 transition-colors duration-[var(--dur-base)] ease-[var(--ease)] hover:bg-carbon-3 focus-visible:outline-offset-[-3px]!"
        >
          <span
            aria-hidden="true"
            className={
              row.status === "live"
                ? "row-span-2 h-2 w-2 rounded-full bg-amber-mark"
                : "row-span-2 h-2 w-2 rounded-full border-[1.5px] border-amber-mark bg-transparent"
            }
          />
          <span className="mono font-medium tracking-[0.06em] text-bright">{row.name}</span>
          <span className="col-start-3 row-span-2 self-center text-right font-mono text-xs leading-[1.7] tracking-[0.06em] text-steel">
            <b className="font-medium text-amber-text">{row.flag}</b> · {row.version}
            <br />
            {row.platform}
          </span>
          <span className="col-start-2 line-clamp-2 text-[0.8125rem] leading-[1.4] text-steel">
            {row.role}
          </span>
        </Link>
      ))}

      <div className="mono flex items-center justify-between px-5 py-3 text-steel">
        <span>{foot.summary}</span>
        <span>{foot.poll}</span>
      </div>
    </aside>
  );
}

import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";
import { StatusChip } from "@/components/ui/status-chip";

/**
 * G2 — Footer title block (02-components.md §C24; 03-screens-and-flows.md §G2).
 * Six-cell telemetry title block (border-collapse rules below) + foot-base
 * (copyright · footer nav · sheet line). The "durum" cell's dot does NOT pulse — only
 * the C12 Fleet Readout header dot pulses site-wide (01 §Motion, wired in T14).
 */

const NAV_ROUTES: Record<Lang, { work: string; services: string; studio: string }> = {
  tr: { work: "/isler", services: "/hizmetler", studio: "/studyo" },
  en: { work: "/en/work", services: "/en/services", studio: "/en/studio" },
};

interface FooterProps {
  lang: Lang;
  dict: Dictionary;
}

// C24 cell border-collapse (mockup .tb/.cell responsive rules, A1-normalized padding):
// >1020px: 6 cols, border-left on every cell but the first.
// <=1020px: 3 cols; cell 4 (row-2 start) loses its left border; row 2 (n+4) gets a top border.
// <=640px: 2 cols; no left borders anywhere; every cell gets a top border except the first two.
const CELL_CLASSES =
  "cell border-line px-5 pt-5 pb-6 border-l " +
  "first:border-l-0 first:pl-0 " +
  "max-[1020px]:[&:nth-child(4)]:border-l-0 max-[1020px]:[&:nth-child(4)]:pl-0 " +
  "max-[1020px]:[&:nth-child(n+4)]:border-t " +
  "max-[640px]:border-l-0 max-[640px]:pl-0 max-[640px]:border-t " +
  "max-[640px]:[&:nth-child(-n+2)]:border-t-0";

const VALUE_CLASSES =
  "block break-words font-mono text-[0.8125rem] leading-[1.6] tracking-[0.04em] text-bright";

export function Footer({ lang, dict }: FooterProps) {
  const routes = NAV_ROUTES[lang];
  const navItems = [
    { href: routes.work, label: dict.nav.work },
    { href: routes.services, label: dict.nav.services },
    { href: routes.studio, label: dict.nav.studio },
  ];
  const cells = dict.footer.cells;

  return (
    <footer role="contentinfo" className="border-t border-line">
      <div className="wrap">
        <div className="grid grid-cols-6 border-b border-line max-[1020px]:grid-cols-3 max-[640px]:grid-cols-2">
          <div className={CELL_CLASSES}>
            <span className="mono mb-2 block text-steel">{cells.studio.key}</span>
            <span className={VALUE_CLASSES}>{cells.studio.value}</span>
          </div>
          <div className={CELL_CLASSES}>
            <span className="mono mb-2 block text-steel">{cells.base.key}</span>
            <span className={VALUE_CLASSES}>{cells.base.value}</span>
          </div>
          <div className={CELL_CLASSES}>
            <span className="mono mb-2 block text-steel">{cells.fleet.key}</span>
            <span className={VALUE_CLASSES}>{cells.fleet.value}</span>
          </div>
          <div className={CELL_CLASSES}>
            <span className="mono mb-2 block text-steel">{cells.stack.key}</span>
            <span className={VALUE_CLASSES}>{cells.stack.value}</span>
          </div>
          <div className={CELL_CLASSES}>
            <span className="mono mb-2 block text-steel">{cells.channel.key}</span>
            <span className={VALUE_CLASSES}>
              <a
                href={`mailto:${cells.channel.value}`}
                className="transition-colors duration-[var(--dur-base)] ease-[var(--ease)] hover:text-amber-text"
              >
                {cells.channel.value}
              </a>
            </span>
          </div>
          <div className={CELL_CLASSES}>
            <span className="mono mb-2 block text-steel">{cells.status.key}</span>
            <span className={VALUE_CLASSES}>
              <StatusChip variant="live" flag={cells.status.value} />
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5 pt-5 pb-7 text-steel">
          <span className="mono">{dict.footer.copyright}</span>
          <nav aria-label="Footer" className="flex gap-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="mono text-steel transition-colors duration-[var(--dur-base)] ease-[var(--ease)] hover:text-bright"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <span className="mono">{dict.footer.sheetLine}</span>
        </div>
      </div>
    </footer>
  );
}

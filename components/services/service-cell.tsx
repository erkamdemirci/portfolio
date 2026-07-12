import Link from "next/link";
import type { ElementType } from "react";

/**
 * ServiceCell (02-components.md §ServiceCell). Two containers:
 * - ServiceGrid: the shared-hairline 4→2→1 grid of cells (home services digest, the services-page
 *   offering grid, studio principles). `linked` cells are <a> with hover/press/focus; `static`
 *   cells are plain <div>. No `s/01` index apparatus — cells lead with a serif title.
 * - ServiceDetail: a single stacked offering block with an `id` anchor + a "dahil olanlar" list
 *   (services page offerings, T41). Title display-3, `--line` dividers between included items.
 */

export type ServiceCellVariant = "linked" | "static";

export interface ServiceCellContent {
  /** kept for the map key + build-green callers; never rendered (02: no index apparatus). */
  index: string;
  title: string;
  body: string;
  /** required for the `linked` variant. */
  href?: string;
}

interface ServiceGridProps {
  cells: ServiceCellContent[];
  variant: ServiceCellVariant;
  className?: string;
}

const CELL_BASE =
  "cell block border-line px-6 pt-7 pb-8 border-l first:border-l-0 " +
  "max-[1020px]:[&:nth-child(3)]:border-l-0 max-[1020px]:[&:nth-child(n+3)]:border-t max-[1020px]:[&:nth-child(n+3)]:border-line " +
  "max-[640px]:border-l-0 max-[640px]:[&:not(:first-child)]:border-t";

const TITLE = "font-display text-[clamp(1.2rem,1.7vw,1.5rem)] leading-[1.2] text-ink";
const TITLE_LINKED =
  `${TITLE} underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-[var(--dur-fast)] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:decoration-line`;

function CellBody({ title, body, linked }: { title: string; body: string; linked: boolean }) {
  return (
    <>
      <h3 className={linked ? TITLE_LINKED : TITLE}>{title}</h3>
      <p className="mt-3 max-w-[46ch] text-[0.9rem] leading-[1.6] text-ink-soft text-pretty">{body}</p>
    </>
  );
}

export function ServiceGrid({ cells, variant, className }: ServiceGridProps) {
  return (
    <div
      className={`grid grid-cols-4 overflow-hidden rounded-media border border-line max-[1020px]:grid-cols-2 max-[640px]:grid-cols-1 ${className ?? ""}`}
    >
      {cells.map((cell) => {
        if (variant === "linked" && cell.href) {
          const linkClass = `group figure ${CELL_BASE} transition-[background-color,transform] duration-[var(--dur-fast)] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-paper-2 motion-safe:active:[transform:scale(0.985)]`;
          return cell.href.startsWith("/") ? (
            <Link key={cell.index} href={cell.href} prefetch={false} className={linkClass}>
              <CellBody title={cell.title} body={cell.body} linked />
            </Link>
          ) : (
            <a key={cell.index} href={cell.href} className={linkClass}>
              <CellBody title={cell.title} body={cell.body} linked />
            </a>
          );
        }
        return (
          <div key={cell.index} className={CELL_BASE}>
            <CellBody title={cell.title} body={cell.body} linked={false} />
          </div>
        );
      })}
    </div>
  );
}

interface ServiceDetailProps {
  anchor: string;
  title: string;
  body: string;
  /** readonly — the dict's `as const` details make this a readonly tuple. */
  included: readonly string[];
  includedLabel: string;
  /** h3 — offerings sit under one h2 "Hizmetler" (03 §4 outline). */
  titleLevel?: ElementType;
  className?: string;
}

export function ServiceDetail({
  anchor,
  title,
  body,
  included,
  includedLabel,
  titleLevel = "h3",
  className,
}: ServiceDetailProps) {
  const Title = titleLevel;
  return (
    <div id={anchor} className={`scroll-mt-24 ${className ?? ""}`}>
      <Title className="font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.1] text-ink">{title}</Title>
      <p className="mt-3 max-w-[52ch] text-[1rem] leading-[1.6] text-ink text-pretty">{body}</p>
      <div className="mt-6">
        <p className="text-[0.78rem] font-medium leading-[1.4] tracking-[0.04em] text-ink-soft">{includedLabel}</p>
        <ul className="mt-3 max-w-[52ch]">
          {included.map((item) => (
            <li key={item} className="border-t border-line py-2 text-[0.85rem] leading-[1.5] text-ink-soft">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

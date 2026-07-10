import Link from "next/link";

/**
 * C19 — Services cell + grid (02-components.md §C19). Shared-hairline 4-col grid
 * (border-left between cells, no gaps) with border-collapse at 1020px/640px. Two
 * variants: linked (Home teaser — <a> per cell, hover bg + index color shift) / static
 * (Services page — cells head their own detail blocks, no interactive states).
 */

export type ServiceCellVariant = "linked" | "static";

export interface ServiceCellContent {
  index: string;
  title: string;
  body: string;
  /** Required when the grid variant is "linked". */
  href?: string;
}

interface ServiceGridProps {
  cells: ServiceCellContent[];
  variant: ServiceCellVariant;
  className?: string;
}

const CELL_BASE =
  "cell border-line pt-7 px-6 pb-8 border-l " +
  "first:border-l-0 " +
  "max-[1020px]:[&:nth-child(3)]:border-l-0 " +
  "max-[1020px]:[&:nth-child(n+3)]:border-t " +
  "max-[640px]:border-l-0 max-[640px]:[&:not(:first-child)]:border-t";

function CellBody({ index, title, body }: ServiceCellContent) {
  return (
    <>
      <span className="mono index block text-steel transition-colors duration-[var(--dur-base)] ease-[var(--ease)] group-hover:text-amber-text">
        {index}
      </span>
      <h3 className="mt-4 mb-2 text-[1.05rem] leading-[1.6] font-semibold tracking-[-0.01em]">
        {title}
      </h3>
      <p className="text-[0.875rem] leading-[1.6] text-steel">{body}</p>
    </>
  );
}

export function ServiceGrid({ cells, variant, className }: ServiceGridProps) {
  return (
    <div
      className={`grid grid-cols-4 overflow-hidden rounded border border-line max-[1020px]:grid-cols-2 max-[640px]:grid-cols-1 ${className ?? ""}`}
    >
      {cells.map((cell) =>
        variant === "linked" && cell.href ? (
          <Link
            key={cell.index}
            href={cell.href}
            className={`group ${CELL_BASE} transition-colors duration-[var(--dur-base)] ease-[var(--ease)] hover:bg-carbon-2 active:translate-y-px focus-visible:outline-offset-[-3px]!`}
          >
            <CellBody {...cell} />
          </Link>
        ) : (
          <div key={cell.index} className={CELL_BASE}>
            <CellBody {...cell} />
          </div>
        ),
      )}
    </div>
  );
}

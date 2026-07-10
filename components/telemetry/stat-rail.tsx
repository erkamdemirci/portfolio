/**
 * C13 — Stat rail + stat cell (02-components.md §C13), static build in T13. Values are
 * server-rendered FINAL numbers (no skeleton) — the odometer count-up presentation
 * attaches on top in T14 without changing what's in the initial HTML.
 */

export interface StatCell {
  value: string;
  /** Unit suffix rendered in --amber-text via <em> (e.g. "sa" / "h"). */
  suffix?: string;
  caption: string;
}

const CELL_CLASSES =
  "stat-cell border-line pt-6 pr-5 pb-7 pl-0 " +
  "[&:not(:first-child)]:border-l [&:not(:first-child)]:pl-5 " +
  "max-[640px]:pt-5 max-[640px]:pr-3 max-[640px]:pb-5 " +
  "max-[640px]:[&:not(:first-child)]:pl-4 " +
  "max-[640px]:[&:nth-child(3)]:border-l-0 max-[640px]:[&:nth-child(3)]:pl-0 " +
  "max-[640px]:[&:nth-child(n+3)]:border-t";

interface StatRailProps {
  cells: StatCell[];
  ariaLabel: string;
  className?: string;
}

export function StatRail({ cells, ariaLabel, className }: StatRailProps) {
  return (
    <div
      role="list"
      aria-label={ariaLabel}
      className={`grid grid-cols-4 border-t border-line max-[640px]:grid-cols-2 ${className ?? ""}`}
    >
      {cells.map((cell) => (
        <div key={cell.caption} role="listitem" className={CELL_CLASSES}>
          <b
            data-stat-value={cell.value}
            className="block text-[2rem] leading-[1.1] font-semibold tracking-[-0.02em] text-bright tabular-nums"
          >
            {cell.value}
            {cell.suffix && <em className="not-italic text-amber-text">{cell.suffix}</em>}
          </b>
          <span className="mono mt-2 block text-steel">{cell.caption}</span>
        </div>
      ))}
    </div>
  );
}

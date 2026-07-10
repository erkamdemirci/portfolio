"use client";

import { useOdometer } from "@/lib/motion/use-odometer";

/**
 * C13 — Stat rail + stat cell (02-components.md §C13). Values are server-rendered FINAL
 * numbers (01 §Motion progressive-enhancement rule) — the odometer (lib/motion/
 * use-odometer.ts) only animates a visual 0->N count-up on top once mounted, 700ms
 * --ease-out, once per load; reduced motion never dips below the real value.
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

const VALUE_PATTERN = /^(\D*)(\d+)$/;

/** Parses "05"/"<48"/"01" -> a non-numeric prefix + zero-padded digit count + the target
 *  number, so the odometer can count 0..N while the rendered string keeps its original
 *  prefix ("<") and zero-padding ("05", never "5") at every animation frame. */
function StatValue({ raw }: { raw: string }) {
  const match = raw.match(VALUE_PATTERN);
  const prefix = match?.[1] ?? "";
  const digits = match?.[2]?.length ?? raw.length;
  const target = match ? Number(match[2]) : 0;
  const display = useOdometer(target);
  return (
    <>
      {prefix}
      {String(display).padStart(digits, "0")}
    </>
  );
}

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
          <b className="block text-[2rem] leading-[1.1] font-semibold tracking-[-0.02em] text-bright tabular-nums">
            <StatValue raw={cell.value} />
            {cell.suffix && <em className="not-italic text-amber-text">{cell.suffix}</em>}
          </b>
          <span className="mono mt-2 block text-steel">{cell.caption}</span>
        </div>
      ))}
    </div>
  );
}

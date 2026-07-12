"use client";

import { useOdometer } from "@/lib/motion/use-odometer";

/**
 * StatBand (02-components.md §StatBand; 01 §Motion — the ONE orchestrated moment). A bordered
 * band of tabular figures that count up once on mount via the kept use-odometer hook; under
 * reduced motion the hook returns the final value synchronously (already server-rendered), so
 * no movement occurs. Non-interactive; rendered as an aria-labelled section (no visible h2,
 * 03 outline rule). Home + studio pass their own cells.
 */

export interface StatCell {
  /** e.g. "05", "<48", "01" — a leading prefix + digits (zero-padding preserved) + tail. */
  value: string;
  suffix?: string;
  caption: string;
}

// prefix (non-digits) · digits · tail — lets "<48" animate the 48 while keeping the "<".
const PARTS = /^(\D*)(\d+)(.*)$/;

function Stat({ value, suffix, caption }: StatCell) {
  const match = PARTS.exec(value);
  const prefix = match?.[1] ?? "";
  const digits = match?.[2] ?? "";
  const tail = match?.[3] ?? "";
  const target = digits ? Number.parseInt(digits, 10) : 0;
  const n = useOdometer(target);
  const shown = digits ? `${prefix}${String(n).padStart(digits.length, "0")}${tail}` : value;

  return (
    <div className="flex flex-col gap-2 border-l border-line px-[clamp(1rem,2.6vw,2rem)] py-[0.4rem] first:border-l-0 first:pl-0 max-[620px]:[&:nth-child(3)]:border-l-0 max-[620px]:[&:nth-child(3)]:pl-0 max-[620px]:[&:nth-child(n+3)]:border-t max-[620px]:[&:nth-child(n+3)]:border-line max-[620px]:[&:nth-child(n+3)]:pt-6">
      <span className="mono text-[clamp(2rem,4vw,3rem)] leading-none tracking-[-0.02em] text-ink">
        {shown}
        {suffix && <span className="ml-1 text-[0.45em] text-ink-soft">{suffix}</span>}
      </span>
      <span className="text-[0.9rem] leading-[1.4] text-ink-soft text-pretty">{caption}</span>
    </div>
  );
}

interface StatBandProps {
  cells: StatCell[];
  ariaLabel: string;
  className?: string;
}

export function StatBand({ cells, ariaLabel, className }: StatBandProps) {
  return (
    <section aria-label={ariaLabel} className={`border-y border-line ${className ?? ""}`}>
      <div className="wrap py-[clamp(40px,5vw,64px)]">
        <div className="grid grid-cols-4 max-[620px]:grid-cols-2">
          {cells.map((cell) => (
            <Stat key={cell.caption} value={cell.value} suffix={cell.suffix} caption={cell.caption} />
          ))}
        </div>
      </div>
    </section>
  );
}

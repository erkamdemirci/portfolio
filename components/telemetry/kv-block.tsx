import type { ReactNode } from "react";

/**
 * C20 — kv telemetry block (02-components.md §C20). Bordered block on `--carbon` —
 * an INSET surface when it sits inside a `--carbon-2` region (Contact band, 01 depth
 * rule: insets step down, never shadow). Key column is exactly 110px.
 */

export interface KvRow {
  key: string;
  value: ReactNode;
}

interface KvBlockProps {
  rows: KvRow[];
  ariaLabel: string;
  className?: string;
}

export function KvBlock({ rows, ariaLabel, className }: KvBlockProps) {
  return (
    <div
      role="list"
      aria-label={ariaLabel}
      className={`overflow-hidden rounded border border-line bg-carbon ${className ?? ""}`}
    >
      {rows.map((row, index) => (
        <div
          key={row.key}
          role="listitem"
          className={`grid grid-cols-[110px_minmax(0,1fr)] items-baseline gap-4 px-5 py-4 ${
            index > 0 ? "border-t border-line" : ""
          }`}
        >
          <span className="mono text-steel">{row.key}</span>
          <span className="break-words font-mono text-[0.8125rem] tracking-[0.03em] text-bright [&_a]:transition-colors [&_a]:duration-[var(--dur-base)] [&_a]:ease-[var(--ease)] [&_a:hover]:text-amber-text">
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}

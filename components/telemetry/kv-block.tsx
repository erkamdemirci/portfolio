import type { ReactNode } from "react";

/**
 * KvBlock (02-components.md §KvBlock). A definition list of key/value facts — used by the
 * contact facts, the services engagement summary, and (via CaseSpecList) the case detail rows.
 * Each row is a `5.5rem / 1fr` grid with a `--line` top rule; the label is label-xs `--ink-soft`,
 * the value 0.98rem `--ink`. Numeric/code rows opt into `.mono` (tabular figures) via `mono`.
 * The `{ rows }` prop shape is unchanged (value may be a string or rich segments with links).
 */

export interface KvRow {
  key: string;
  value: ReactNode;
  /** render the value in tabular mono — numeric/code rows (02 §KvBlock). */
  mono?: boolean;
}

interface KvBlockProps {
  rows: KvRow[];
  ariaLabel: string;
  className?: string;
}

export function KvBlock({ rows, ariaLabel, className }: KvBlockProps) {
  return (
    <dl aria-label={ariaLabel} className={`m-0 ${className ?? ""}`}>
      {rows.map((row) => (
        <div
          key={row.key}
          className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-4 border-t border-line py-[0.95rem]"
        >
          <dt className="text-[0.86rem] font-medium leading-[1.4] text-ink-soft">{row.key}</dt>
          <dd
            className={`m-0 break-words text-[0.98rem] leading-[1.5] text-ink [&_a]:text-ever [&_a]:underline [&_a]:decoration-[color-mix(in_oklab,var(--ever)_42%,transparent)] [&_a]:underline-offset-2 ${
              row.mono ? "mono" : ""
            }`}
          >
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

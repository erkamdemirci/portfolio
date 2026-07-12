/**
 * StatusChip (02-components.md §StatusChip). Word-only neutral chip: Hanken 500 0.8rem,
 * --ink-soft, --line border, radius-ui. No dot, no color-coding — the WORD states the
 * status (color is never the only signal). Identical neutral styling for every variant;
 * only the `flag` word differs (Canlı / Geliştirmede).
 *
 * The `StatusVariant` type is kept unchanged (lib/cases.ts imports it; the old
 * `no-signal` member stays until the 404 conceit is dropped in M3). `variant`/`meta` are
 * retained on the interface for build-green consumers but no longer affect styling.
 */

export type StatusVariant = "live" | "in-dev" | "no-signal";

interface StatusChipProps {
  variant: StatusVariant;
  flag: string;
  meta?: string;
  className?: string;
}

export function StatusChip({ flag, className }: StatusChipProps) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-ui border border-line px-[0.55rem] py-[0.2rem] font-body text-[0.8rem] font-medium leading-[1.3] text-ink-soft ${className ?? ""}`}
    >
      {flag}
    </span>
  );
}

/**
 * C11 — Status chip (02-components.md §C11). Mono-label chip: dot mark (8px) + flag
 * (--amber-text, weight 500) + optional meta text (--steel). Color is never the only
 * signal — the flag text always states the status. No own hover/focus (static; sits
 * inside interactive parents). No pulse here — the ONE site-wide pulse lives on the
 * C12 Fleet Readout header dot only (T14).
 */

export type StatusVariant = "live" | "in-dev" | "no-signal";

interface StatusChipProps {
  variant: StatusVariant;
  flag: string;
  meta?: string;
  className?: string;
}

export function StatusChip({ variant, flag, meta, className }: StatusChipProps) {
  const dotClasses =
    variant === "live"
      ? "h-2 w-2 shrink-0 rounded-full bg-amber-mark"
      : "h-2 w-2 shrink-0 rounded-full border-[1.5px] border-amber-mark bg-transparent";

  return (
    <span
      className={`mono inline-flex items-center gap-2 whitespace-nowrap text-steel ${className ?? ""}`}
    >
      <span aria-hidden="true" className={dotClasses} />
      <b className="font-medium text-amber-text">{flag}</b>
      {meta && <span>· {meta}</span>}
    </span>
  );
}

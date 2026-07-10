import type { ReactNode } from "react";
import { StatusChip, type StatusVariant } from "@/components/ui/status-chip";

/**
 * C22 — Case-study meta rail (02-components.md §C22, extrapolated from the telemetry
 * grammar). Horizontal strip under the case hero: 4 shared-hairline cells (border-top +
 * border-bottom on the strip, border-left between cells — same collapse family as C24).
 * The "durum" cell renders a C11 status chip instead of plain mono-data text.
 * `owner-verify` values (e.g. an unconfirmed yığın string) render exactly as provided —
 * this component has no opinion on that marker, the caller's content does.
 */

export interface MetaRailCell {
  key: string;
  value?: ReactNode;
  status?: { variant: StatusVariant; flag: string };
}

interface MetaRailProps {
  cells: MetaRailCell[];
  className?: string;
}

const CELL_CLASSES =
  "cell border-line px-5 pt-5 pb-6 border-l " +
  "first:border-l-0 first:pl-0 " +
  "max-[640px]:border-l-0 max-[640px]:border-t max-[640px]:[&:nth-child(-n+2)]:border-t-0";

export function MetaRail({ cells, className }: MetaRailProps) {
  return (
    <div
      className={`grid grid-cols-4 border-t border-b border-line max-[640px]:grid-cols-2 ${className ?? ""}`}
    >
      {cells.map((cell) => (
        <div key={cell.key} className={CELL_CLASSES}>
          <span className="mono mb-2 block text-steel">{cell.key}</span>
          <span className="block font-mono text-[0.8125rem] tracking-[0.04em] text-bright">
            {cell.status ? (
              <StatusChip variant={cell.status.variant} flag={cell.status.flag} />
            ) : (
              cell.value
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

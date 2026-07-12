import { KvBlock, type KvRow } from "@/components/telemetry/kv-block";

/**
 * CaseSpecList (02-components.md §CaseSpecList — de-themed replacement for the "Telemetri" KV
 * section). A de-themed section head ("Ayrıntılar" / "Details", NEVER "Telemetri") over a
 * KvBlock of a status row + 2–3 data rows. Rows are built by the case page (status → StatusChip,
 * the live row → an external-mono TextLink, rich values via renderSegments), so `standard` and
 * `road-status` (Oasis) are pure data differences — no branch here.
 */

interface CaseSpecListProps {
  heading: string;
  ariaLabel: string;
  rows: KvRow[];
  className?: string;
}

export function CaseSpecList({ heading, ariaLabel, rows, className }: CaseSpecListProps) {
  return (
    <div className={className}>
      <h2 className="mb-8 font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] text-ink">{heading}</h2>
      <KvBlock ariaLabel={ariaLabel} rows={rows} className="max-w-[560px]" />
    </div>
  );
}

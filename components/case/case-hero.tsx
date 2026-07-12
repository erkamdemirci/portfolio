import { StatusChip, type StatusVariant } from "@/components/ui/status-chip";

/**
 * CaseHero (02-components.md §CaseHero, replaces case/meta-rail). Claim (display-1/2, h1 — the
 * page's title) + a StatusChip + a clean meta strip (version · platform · stack). When the stack
 * is `owner-verify` (or carries that marker), it is OMITTED entirely — the literal marker is
 * never rendered and no value is guessed (01/03 owner-verify rule).
 */

interface CaseHeroProps {
  eyebrow?: string;
  claim: string;
  status: { variant: StatusVariant; flag: string };
  meta: { version: string; platform: string; stack: string };
  className?: string;
}

export function CaseHero({ eyebrow, claim, status, meta, className }: CaseHeroProps) {
  const showStack = !meta.stack.includes("owner-verify");
  return (
    <div className={className}>
      {eyebrow && (
        <p className="mb-5 text-[0.82rem] font-medium leading-[1.3] tracking-[0.04em] text-ink-soft">{eyebrow}</p>
      )}
      <h1 className="max-w-[18ch] font-display text-[clamp(2rem,3.6vw,3rem)] leading-[1.08] text-ink [&_em]:italic [&_em]:text-ever">
        {claim}
      </h1>
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
        <StatusChip variant={status.variant} flag={status.flag} />
        <p className="text-[0.9rem] leading-[1.4] text-ink-soft">
          <span className="mono text-ink">{meta.version}</span>
          {` · ${meta.platform}`}
          {showStack ? ` · ${meta.stack}` : ""}
        </p>
      </div>
    </div>
  );
}

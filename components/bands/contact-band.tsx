import type { ElementType, ReactNode } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { KvBlock, type KvRow } from "@/components/telemetry/kv-block";

/**
 * C21 — Contact band (02-components.md §C21). `--carbon-2` band, `.wrap` grid `7fr/5fr`.
 * Full (Contact page + Home close): eyebrow + heading + lede + two buttons + C20 kv
 * block. Compact (case-study close): eyebrow + heading + a single accent button, no kv
 * block. Heading level is caller-configurable — h1 on the Contact page, h2 elsewhere
 * (03 outline rule: exactly one h1 per screen).
 */

interface ContactBandBase {
  eyebrow: ReactNode;
  heading: ReactNode;
  headingLevel?: ElementType;
  accentHref: string;
  accentLabel: string;
  className?: string;
}

interface ContactBandFullProps extends ContactBandBase {
  variant?: "full";
  lede: string;
  ghostHref: string;
  ghostLabel: string;
  kvRows: KvRow[];
  kvAriaLabel: string;
}

interface ContactBandCompactProps extends ContactBandBase {
  variant: "compact";
}

export type ContactBandProps = ContactBandFullProps | ContactBandCompactProps;

export function ContactBand(props: ContactBandProps) {
  const { eyebrow, heading, headingLevel = "h2", accentHref, accentLabel, className } = props;
  const Heading = headingLevel;
  const isFull = props.variant !== "compact";

  return (
    <section className={`border-t border-line bg-carbon-2 py-[var(--sec)] ${className ?? ""}`}>
      <div className="wrap grid grid-cols-[7fr_5fr] items-center gap-x-16 gap-y-11 max-[1020px]:grid-cols-1">
        <div>
          <Eyebrow variant="section">{eyebrow}</Eyebrow>
          <Heading className="max-w-[16ch] text-balance text-[clamp(1.9rem,3.4vw,2.7rem)] leading-[1.08] font-semibold tracking-[-0.025em]">
            {heading}
          </Heading>
          {isFull && <p className="mt-5 max-w-[52ch] text-[1rem] text-steel">{props.lede}</p>}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button variant="accent" href={accentHref}>
              {accentLabel}
            </Button>
            {isFull && (
              <Button variant="ghost" href={props.ghostHref}>
                {props.ghostLabel}
              </Button>
            )}
          </div>
        </div>
        {isFull && <KvBlock ariaLabel={props.kvAriaLabel} rows={props.kvRows} />}
      </div>
    </section>
  );
}

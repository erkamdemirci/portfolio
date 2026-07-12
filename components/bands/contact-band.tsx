import type { ElementType } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { ArrowLink } from "@/components/ui/arrow-link";
import { KvBlock, type KvRow } from "@/components/bands/kv-block";

/**
 * ContactBand (02-components.md §ContactBand). Keeps the full | compact union.
 * - full (home + contact close): lead (display-1 heading with the italic-ever `<em>` turn + lede
 *   + primary CTA + ArrowLink) beside a KvBlock, grid 1.1fr/.9fr, single column ≤900px.
 * - compact (case/studio/services close): the lead only (heading + primary CTA), no kv.
 * The italic turn is applied by wrapping the `turn` substring of `heading` in `<em>` — works in
 * both locales (TR turns lead, EN turns tail). M3 ships WITHOUT the ContactActions row; T49 (M4)
 * wires it into the full instances.
 */

function HeadingWithTurn({ heading, turn }: { heading: string; turn?: string }) {
  if (!turn || !heading.includes(turn)) return <>{heading}</>;
  const [before, after] = heading.split(turn);
  return (
    <>
      {before}
      <em>{turn}</em>
      {after}
    </>
  );
}

interface ContactBandBase {
  eyebrow?: string;
  heading: string;
  /** the clause inside `heading` set as the italic-ever turn (01 §Signature). */
  turn?: string;
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

const HEADING =
  "max-w-[15ch] font-display text-[clamp(2rem,3.6vw,3rem)] leading-[1.08] text-ink [&_em]:italic [&_em]:text-ever";

export function ContactBand(props: ContactBandProps) {
  const { eyebrow, heading, turn, headingLevel = "h2", accentHref, accentLabel, className } = props;
  const Heading = headingLevel;
  const isFull = props.variant !== "compact";

  return (
    <section className={`border-t border-line bg-paper-2 py-[var(--pad-section)] ${className ?? ""}`}>
      <div className="wrap grid grid-cols-[1.1fr_0.9fr] items-start gap-[clamp(40px,6vw,88px)] max-[900px]:grid-cols-1 max-[900px]:gap-11">
        <div>
          {eyebrow && <Eyebrow variant="section">{eyebrow}</Eyebrow>}
          <Heading className={HEADING}>
            <HeadingWithTurn heading={heading} turn={turn} />
          </Heading>
          {isFull && (
            <p className="mt-[1.15rem] max-w-[52ch] text-[1.05rem] leading-[1.6] text-ink-soft text-pretty">
              {props.lede}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button variant="primary" href={accentHref}>
              {accentLabel}
            </Button>
            {isFull && <ArrowLink href={props.ghostHref}>{props.ghostLabel}</ArrowLink>}
          </div>
        </div>
        {isFull && <KvBlock ariaLabel={props.kvAriaLabel} rows={props.kvRows} className="self-start" />}
      </div>
    </section>
  );
}

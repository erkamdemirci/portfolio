import type { ElementType, ReactNode } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";

/**
 * SectionHead (02-components.md §SectionHead). Variants resolve from props:
 * - simple / italic-turn: heading only (an `<em>` inside the heading renders the
 *   italic-ever "turn" — the signature element, 01 §Signature).
 * - side-note: when `sideText` is given, a two-column grid (mockup .work-intro) —
 *   heading left, note right — closed by a `--line` bottom rule; collapses to one column
 *   at ≤760px.
 * Heading is display-2 (Instrument Serif); `eyebrow` is optional (M3 pages lead with the
 * heading, dropping the rejected numbered kickers).
 */

interface SectionHeadProps {
  eyebrow?: ReactNode;
  heading: ReactNode;
  sideText?: string;
  /** Document heading level — h1 where the section owns the page title, else h2. */
  headingLevel?: ElementType;
  className?: string;
}

export function SectionHead({
  eyebrow,
  heading,
  sideText,
  headingLevel = "h2",
  className,
}: SectionHeadProps) {
  const Heading = headingLevel;
  const headingEl = (
    <Heading className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] font-normal text-balance [&_em]:text-ever [&_em]:italic">
      {heading}
    </Heading>
  );

  if (sideText) {
    return (
      <div
        className={`grid grid-cols-2 items-end gap-[clamp(24px,4vw,56px)] border-b border-line pb-[clamp(28px,3vw,44px)] max-[760px]:grid-cols-1 max-[760px]:items-start max-[760px]:gap-[1.4rem] ${className ?? ""}`}
      >
        <div>
          {eyebrow && <Eyebrow variant="section">{eyebrow}</Eyebrow>}
          {headingEl}
        </div>
        <p className="max-w-[44ch] text-[1rem] leading-[1.6] text-ink-soft text-pretty">
          {sideText}
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {eyebrow && <Eyebrow variant="section">{eyebrow}</Eyebrow>}
      {headingEl}
    </div>
  );
}

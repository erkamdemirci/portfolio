import type { ElementType, ReactNode } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";

/**
 * C10 — Section head (02-components.md §C10). Grid `7fr/5fr` (gap 20px row / 64px
 * column, align end): left = C9 eyebrow + heading; right = an optional side paragraph.
 * Collapses to a single column, align start, at <=1020px.
 */

interface SectionHeadProps {
  eyebrow: ReactNode;
  heading: ReactNode;
  sideText?: string;
  /** Document heading level — h1 on Contact, h2 elsewhere (03 outline rule). */
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
  return (
    <div
      className={`mb-[clamp(36px,4vw,56px)] grid grid-cols-[7fr_5fr] items-end gap-x-16 gap-y-5 max-[1020px]:grid-cols-1 max-[1020px]:items-start ${className ?? ""}`}
    >
      <div>
        <Eyebrow variant="section">{eyebrow}</Eyebrow>
        <Heading className="text-balance text-[clamp(1.9rem,3.4vw,2.7rem)] leading-[1.08] font-semibold tracking-[-0.025em]">
          {heading}
        </Heading>
      </div>
      {sideText && <p className="max-w-[44ch] text-[0.975rem] text-steel">{sideText}</p>}
    </div>
  );
}

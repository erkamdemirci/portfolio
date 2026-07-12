import type { ElementType } from "react";
import { Button } from "@/components/ui/button";

/**
 * OpenSlotCell (02-components.md §OpenSlotCell — defect #9 fix). The conversion cell that sits
 * on the showcase/work-index grid. A SOLID `--line` border (never dashed), real copy that fills
 * the cell, and a primary CTA — it reads as a composed invitation, not a broken/empty frame.
 * No capacity/machine label, no void.
 */

interface OpenSlotCellProps {
  label?: string;
  title: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
  /** h3 on home (under the work section h2) · h2 on the work index (03 outlines). */
  titleLevel?: ElementType;
  className?: string;
}

export function OpenSlotCell({
  label,
  title,
  body,
  ctaHref,
  ctaLabel,
  titleLevel = "h3",
  className,
}: OpenSlotCellProps) {
  const Title = titleLevel;
  return (
    <div
      className={`flex flex-col gap-4 rounded-media border border-line p-[clamp(24px,3vw,40px)] ${className ?? ""}`}
    >
      {label && (
        <p className="text-[0.8rem] font-medium leading-[1.4] tracking-[0.04em] text-ink-soft">{label}</p>
      )}
      <Title className="font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.1] text-ink">{title}</Title>
      <p className="max-w-[38ch] text-[0.92rem] leading-[1.6] text-ink-soft text-pretty">{body}</p>
      <div className="mt-2">
        <Button variant="primary" href={ctaHref}>
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}

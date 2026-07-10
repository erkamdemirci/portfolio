import Image from "next/image";
import { SlotPattern, type SlotBar, type SlotLabelContent } from "./slot-pattern";

/**
 * C15 — Browser bay frame (02-components.md §C15). Chrome bar (3 skeleton dots + centered
 * url pill) over a canvas — aspect `16/9.2` for span-7 cards, `16/11.5` for span-5 cards.
 * Real screenshots fill the canvas edge-to-edge (`object-fit: cover`, top crop); a missing
 * `image` prop renders the C17 slot pattern — the designed fallback IS the error state.
 */

interface BrowserBayImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

interface BrowserBaySlot {
  bars: SlotBar[];
  label: SlotLabelContent;
}

interface BrowserBayProps {
  domain: string;
  /** span-7 -> aspect 16/9.2; span-5 -> aspect 16/11.5 (02 §C15 measurements). */
  span: 7 | 5;
  image?: BrowserBayImage;
  slot?: BrowserBaySlot;
  className?: string;
}

export function BrowserBay({ domain, span, image, slot, className }: BrowserBayProps) {
  const aspectClass = span === 5 ? "aspect-[16/11.5]" : "aspect-[16/9.2]";

  return (
    <div className={`flex flex-col ${className ?? ""}`}>
      <div
        aria-hidden="true"
        className="flex items-center gap-4 border-b border-ring-media px-4 py-3"
      >
        <span className="h-2 w-2 shrink-0 rounded-full bg-skel-2" />
        <span className="h-2 w-2 shrink-0 rounded-full bg-skel-2" />
        <span className="h-2 w-2 shrink-0 rounded-full bg-skel-2" />
        <span className="mx-auto max-w-[260px] truncate rounded-sm bg-skel px-3 py-1 text-center font-mono text-xs tracking-[0.05em] text-steel">
          {domain}
        </span>
      </div>

      <div
        className={`relative ${aspectClass} overflow-hidden border-b border-ring-media bg-carbon-3 ${image ? "" : "p-5"}`}
        style={{
          backgroundImage: "radial-gradient(120% 90% at 50% 0%, var(--glow), transparent 55%)",
        }}
      >
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            priority={image.priority}
            loading={image.priority ? undefined : "lazy"}
            className="h-full w-full object-cover object-top"
          />
        ) : slot ? (
          <SlotPattern bars={slot.bars} label={slot.label} />
        ) : null}
      </div>
    </div>
  );
}

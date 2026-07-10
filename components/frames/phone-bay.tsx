import Image from "next/image";
import { SlotBars, SlotLabel, type SlotBar, type SlotLabelContent } from "./slot-pattern";

/**
 * C16 — Phone bay frame (02-components.md §C16). Left column: C17 slot label (static,
 * left-aligned) when there's no real screenshot; right column: the phone frame itself
 * (responsive width clamped 160-230px, aspect `9/17`, `--radius-phone` on the top corners
 * only, docked to the card's bottom edge — border-bottom omitted on purpose). Real
 * screenshots fill the frame under the notch; a missing `image` renders C17 skeleton
 * bars inside the frame instead (the designed fallback IS the error state).
 *
 * The 160-230px clamp lives on the grid TRACK (`minmax(160px,230px)`), not as a percentage
 * width on the phone element itself: a percentage width on a grid item inside an `auto`-sized
 * track is genuinely ambiguous per the CSS Grid sizing algorithm (percentages can't resolve
 * during intrinsic/auto track-size computation), and collapsed the track to ~2px in every
 * browser tested here — the phone then rendered at its own clamp() min-bound width but
 * OVERFLOWED its collapsed track, visually overlapping/obscuring the slot label text in the
 * first (`minmax(0,1fr)`) column. Found while visually verifying the T24 Oasis case page
 * (both feature slots showed the phone frame covering the tail of the slot-label body text)
 * — see DEVIATIONS.md. `w-full` on the phone element now just fills its own already-clamped
 * track, no percentage-in-auto-track ambiguity.
 */

interface PhoneBayImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

interface PhoneBaySlot {
  bars: SlotBar[];
  label: SlotLabelContent;
}

interface PhoneBayProps {
  image?: PhoneBayImage;
  slot?: PhoneBaySlot;
  className?: string;
}

export function PhoneBay({ image, slot, className }: PhoneBayProps) {
  return (
    <div
      className={`grid grid-cols-[minmax(0,1fr)_minmax(160px,230px)] items-end gap-6 px-7 pt-7 max-[640px]:grid-cols-1 max-[640px]:justify-items-center max-[640px]:px-5 max-[640px]:pt-6 ${className ?? ""}`}
    >
      {!image && slot ? <SlotLabel label={slot.label} variant="phone-bay" /> : <span />}

      <div
        className="relative aspect-[9/17] w-full justify-self-end overflow-hidden rounded-t-phone border border-b-0 border-ring-media bg-carbon-3 max-[640px]:w-[min(200px,70%)] max-[640px]:justify-self-center"
        style={{
          backgroundImage: "radial-gradient(140% 70% at 50% 0%, var(--glow), transparent 60%)",
        }}
      >
        <span
          aria-hidden="true"
          className="absolute top-[9px] left-1/2 h-[9px] w-[34%] -translate-x-1/2 rounded-sm bg-skel"
        />
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
          <SlotBars bars={slot.bars} />
        ) : null}
      </div>
    </div>
  );
}

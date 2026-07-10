/**
 * C17 — Placeholder slot pattern (02-components.md §C17). The designed fallback for
 * missing/failed imagery — must read as a finished design element, never a loading
 * indicator (no shimmer, 01 no-animation list). Two pieces so callers can compose them
 * either overlaid together (C15 browser-bay canvas) or split apart (C16 phone-bay: bars
 * live inside the phone frame, the label sits in the adjacent grid column).
 */

export interface SlotBar {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  width: string;
  height: string;
  tone?: "skel" | "skel-2" | "amber";
}

export interface SlotLabelContent {
  title: string;
  body: string;
}

const TONE_CLASSES: Record<NonNullable<SlotBar["tone"]>, string> = {
  skel: "bg-skel",
  "skel-2": "bg-skel-2",
  amber: "bg-amber-mark",
};

/** Decorative skeleton bars only, aria-hidden. The parent must establish a positioning
 *  context (`relative`/`absolute`) for these coordinates to resolve correctly. */
export function SlotBars({ bars }: { bars: SlotBar[] }) {
  return (
    <>
      {bars.map((bar, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={`absolute rounded-xs ${TONE_CLASSES[bar.tone ?? "skel"]}`}
          style={{
            top: bar.top,
            bottom: bar.bottom,
            left: bar.left,
            right: bar.right,
            width: bar.width,
            height: bar.height,
          }}
        />
      ))}
    </>
  );
}

interface SlotLabelProps {
  label: SlotLabelContent;
  /** overlay = centered over a browser-bay canvas (C15); phone-bay = static, left-aligned,
   *  bottom-padded column beside the phone frame (C16). */
  variant?: "overlay" | "phone-bay";
  className?: string;
}

export function SlotLabel({ label, variant = "overlay", className }: SlotLabelProps) {
  const content = (
    <span className="max-w-[36ch] font-mono text-xs leading-[1.75] tracking-[0.06em] text-steel uppercase">
      <b className="mb-1 block font-medium text-bright">{label.title}</b>
      {label.body}
    </span>
  );

  if (variant === "phone-bay") {
    return (
      <div className={`pb-7 text-left max-[640px]:pb-5 ${className ?? ""}`}>{content}</div>
    );
  }

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center p-6 text-center ${className ?? ""}`}
    >
      {content}
    </div>
  );
}

interface SlotPatternProps {
  bars: SlotBar[];
  label: SlotLabelContent;
  className?: string;
}

/** Overlay convenience wrapper for C15 (bars + centered label together). */
export function SlotPattern({ bars, label, className }: SlotPatternProps) {
  return (
    <div className={`absolute inset-0 ${className ?? ""}`}>
      <SlotBars bars={bars} />
      <SlotLabel label={label} variant="overlay" />
    </div>
  );
}

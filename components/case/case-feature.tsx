import { Plate } from "@/components/frames/plate";

/**
 * CaseFeature (02-components.md §CaseFeature). A "what we built" block, two variants:
 * - with-image: a Plate (real screenshot, case pages only) + caption beside a title + body,
 *   the plate side alternating per feature via `flip` (desktop only; plate sits above text on
 *   mobile).
 * - text-forward: no plate — title + a wider body, for a feature with no capture (VAAZ f2,
 *   Oasis, and any DEMOTED shot that fails the T46 visual loop).
 */

interface CaseFeatureImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface CaseFeatureProps {
  variant: "with-image" | "text-forward";
  title: string;
  body: string;
  image?: CaseFeatureImage;
  caption?: string;
  plateVariant?: "browser-shot" | "phone-shot";
  /** alternate the plate to the right on desktop (02 — features alternate sides). */
  flip?: boolean;
  className?: string;
}

const TITLE = "font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.1] text-ink";

export function CaseFeature({
  variant,
  title,
  body,
  image,
  caption,
  plateVariant = "browser-shot",
  flip,
  className,
}: CaseFeatureProps) {
  if (variant === "text-forward" || !image) {
    return (
      <div className={`max-w-[60ch] ${className ?? ""}`}>
        <h3 className={TITLE}>{title}</h3>
        <p className="mt-3 text-[1.05rem] leading-[1.6] text-ink text-pretty">{body}</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-[1.4fr_1fr] items-center gap-[clamp(28px,4vw,60px)] max-[900px]:grid-cols-1 max-[900px]:gap-8 ${
        flip ? "min-[901px]:[&>*:first-child]:order-2" : ""
      } ${className ?? ""}`}
    >
      <Plate variant={plateVariant} image={image} caption={caption} sizes="(max-width: 900px) 100vw, 55vw" />
      <div>
        <h3 className={TITLE}>{title}</h3>
        <p className="mt-3 max-w-[46ch] text-[1rem] leading-[1.6] text-ink text-pretty">{body}</p>
      </div>
    </div>
  );
}

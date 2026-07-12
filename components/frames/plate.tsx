import Image from "next/image";

/**
 * Plate (02-components.md §Plate; 01 §Iconography & imagery) — THE frame system, replacing
 * frames/browser-bay + phone-bay + slot-pattern.
 *
 * A `--paper-2` mat (hairline border, radius-media) holds either a real screenshot or a
 * typographic fallback, with an optional sentence-case caption below. Screenshots mount via
 * next/image with a 1px inset `--ring-media` ring and an `aspect-ratio` set to the image's
 * INTRINSIC w/h (never a fixed frame ratio — the defect-#6 fix; no CLS). There is NO fake
 * browser/phone chrome over real images — the app's own UI is already in the pixels and the
 * domain lives on the ProductCard meta line.
 *
 * Variants: `typographic` (the default — home showcase + work index, no screenshot;
 * status → 34px rule → name → one-line claim, carried on a 3/2 (web) or 700/728 (app)
 * ratio) · `browser-shot` / `phone-shot` (real screenshots — case pages only).
 */

interface PlateImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface PlateTypographic {
  status: string;
  name: string;
  claim: string;
  /** 3/2 for web products, 700/728 for app products (01 §Imagery placement policy). */
  ratio?: string;
}

interface PlateProps {
  variant: "typographic" | "browser-shot" | "phone-shot";
  image?: PlateImage;
  typographic?: PlateTypographic;
  caption?: string;
  /** next/image sizes per placement (srcset selection). */
  sizes?: string;
  /** The hero is text, so no plate takes priority — default lazy (01 §Imagery). */
  priority?: boolean;
  className?: string;
}

// `plate-mat` is a hook (no visual effect alone) so a parent card can warm the mat border
// on hover (ProductCard T27, CaseFeature T34); the border-color transition rides --dur-fast.
const MAT =
  "plate-mat rounded-media border border-line bg-paper-2 p-[clamp(10px,1.3vw,16px)] transition-[border-color] duration-[var(--dur-fast)] ease-[var(--ease-out)]";

export function Plate({
  variant,
  image,
  typographic,
  caption,
  sizes,
  priority = false,
  className,
}: PlateProps) {
  const isTypographic = variant === "typographic" || !image;

  return (
    <div className={className}>
      {isTypographic && typographic ? (
        <div
          className={`${MAT} flex items-center justify-center text-center`}
          style={{ aspectRatio: typographic.ratio ?? "3/2" }}
        >
          <div className="flex flex-col items-center gap-2 p-6">
            <span className="text-[0.78rem] font-medium tracking-[0.05em] text-ink-soft">
              {typographic.status}
            </span>
            <span aria-hidden="true" className="my-[0.4rem] h-px w-[34px] bg-line" />
            <span className="font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.1] text-ink">
              {typographic.name}
            </span>
            <span className="max-w-[24ch] text-[0.92rem] leading-[1.5] text-ink-soft text-pretty">
              {typographic.claim}
            </span>
          </div>
        </div>
      ) : (
        image && (
          <div className={MAT}>
            <div
              // aspect-ratio bound to the image's INTRINSIC dims — never a fixed frame ratio.
              className="relative overflow-hidden rounded-shot after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border after:border-ring-media after:content-['']"
              style={{ aspectRatio: `${image.width}/${image.height}` }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes={sizes}
                priority={priority}
                className="block h-auto w-full"
              />
            </div>
          </div>
        )
      )}
      {caption && (
        <p className="mt-[0.85rem] text-[0.88rem] leading-[1.5] text-ink-soft text-pretty">
          {caption}
        </p>
      )}
    </div>
  );
}

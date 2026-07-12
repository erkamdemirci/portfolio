import Link from "next/link";
import type { ElementType, ReactNode } from "react";
import { Plate } from "@/components/frames/plate";
import { StatusChip, type StatusVariant } from "@/components/ui/status-chip";

/**
 * ProductCard (02-components.md §ProductCard, amended). The home showcase + work-index card.
 * Its media is ALWAYS a typographic Plate (amendment #6 — no screenshots on those two screens).
 * Variants: feature (plate-left / info-right lead card) · compact (stacked pair) · row
 * (work-index list row). The whole card is one link to the case page; hover (gated) warms the
 * plate border + underlines the title, press scales .985 (removed under reduced motion via the
 * `.figure` globals hook + motion-safe), focus-visible lands on the <a> (global ring).
 */

export interface ProductPlateContent {
  status: string;
  name: string;
  claim: string;
  /** 3/2 for web products, 700/728 for app products (01 §Imagery placement policy). */
  ratio?: string;
}

interface ProductCardProps {
  href: string;
  title: string;
  status: { variant: StatusVariant; flag: string };
  meta: { version: string; platform: string; domain?: string };
  description: string;
  plate: ProductPlateContent;
  proof?: ReactNode;
  variant: "feature" | "compact" | "row";
  /** h3 under a section h2 (home) · h2 where the row title owns the outline slot (work index). */
  titleLevel?: ElementType;
  className?: string;
}

const CARD_BASE =
  "group figure block transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)] " +
  "motion-safe:active:[transform:scale(0.985)] " +
  "[@media(hover:hover)_and_(pointer:fine)]:hover:[&_.plate-mat]:border-[color-mix(in_oklab,var(--ink)_22%,transparent)]";

const LAYOUT: Record<ProductCardProps["variant"], string> = {
  feature:
    "grid grid-cols-[1.5fr_1fr] items-center gap-[clamp(28px,4vw,60px)] max-[860px]:grid-cols-1 max-[860px]:gap-8",
  compact: "flex flex-col gap-[1.35rem]",
  row: "grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] items-center gap-[clamp(28px,4vw,56px)] py-[clamp(28px,4vw,44px)] max-[760px]:grid-cols-1 max-[760px]:gap-7",
};

const TITLE =
  "font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.1] text-ink underline decoration-transparent underline-offset-4 " +
  "transition-[text-decoration-color] duration-[var(--dur-fast)] ease-[var(--ease-out)] " +
  "[@media(hover:hover)_and_(pointer:fine)]:group-hover:decoration-line";

function CardInner({
  title,
  titleLevel = "h3",
  status,
  meta,
  description,
  plate,
  proof,
  variant,
}: Omit<ProductCardProps, "href" | "className">) {
  const Title = titleLevel;
  const plateClass = variant === "compact" ? "w-full max-w-[340px]" : "w-full";

  return (
    <div className={LAYOUT[variant]}>
      <Plate
        variant="typographic"
        typographic={{ status: plate.status, name: plate.name, claim: plate.claim, ratio: plate.ratio }}
        className={plateClass}
      />
      <div>
        <div className="flex flex-wrap items-baseline gap-[0.85rem]">
          <Title className={TITLE}>{title}</Title>
          <StatusChip variant={status.variant} flag={status.flag} />
        </div>
        <p className="mt-2 text-[0.92rem] leading-[1.5] text-ink-soft">
          <span className="mono text-[0.86rem] text-ink">{meta.version}</span>
          {` · ${meta.platform}`}
          {meta.domain ? ` · ${meta.domain}` : ""}
        </p>
        <p className="mt-3 max-w-[48ch] text-[1rem] leading-[1.6] text-ink text-pretty">{description}</p>
        {proof && <p className="mt-3 text-[0.92rem] leading-[1.5] text-ink-soft">{proof}</p>}
      </div>
    </div>
  );
}

export function ProductCard({ href, className, ...rest }: ProductCardProps) {
  return (
    // prefetch={false} — matches the site-wide perf pattern (components/ui/button.tsx).
    <Link href={href} prefetch={false} className={`${CARD_BASE} ${className ?? ""}`}>
      <CardInner {...rest} />
    </Link>
  );
}

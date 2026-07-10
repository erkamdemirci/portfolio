import { ArrowLink } from "@/components/ui/arrow-link";

/**
 * C18 — BAY-06 reserved card (02-components.md §C18). Dashed border, transparent bg —
 * the site's conversion through-line ("Slot 06 boş." on Contact). Not itself a link;
 * only the C8 arrow-link inside is interactive, so hover/focus-within both elevate the
 * whole card (border --amber, bg --carbon-2) to signal the card as a unit.
 */

interface ReservedBayProps {
  slotLabel: string;
  capacityLabel: string;
  title: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
  note: string;
  className?: string;
}

export function ReservedBay({
  slotLabel,
  capacityLabel,
  title,
  body,
  ctaHref,
  ctaLabel,
  note,
  className,
}: ReservedBayProps) {
  return (
    <article
      className={`col-span-7 flex flex-col justify-between gap-10 rounded border border-dashed border-line-strong bg-transparent p-5 transition-[border-color,background-color] duration-[var(--dur-base)] ease-[var(--ease)] hover:border-amber hover:bg-carbon-2 focus-within:border-amber focus-within:bg-carbon-2 max-[1020px]:col-span-12 ${className ?? ""}`}
    >
      <div className="mono flex items-center justify-between text-steel">
        <span>{slotLabel}</span>
        <span>{capacityLabel}</span>
      </div>
      <div>
        <h3 className="max-w-[12ch] text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.6] font-semibold tracking-[-0.02em]">
          {title}
        </h3>
        <p className="mt-3 max-w-[42ch] text-[0.95rem] text-steel">{body}</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ArrowLink href={ctaHref}>{ctaLabel}</ArrowLink>
        <span className="mono text-steel">{note}</span>
      </div>
    </article>
  );
}

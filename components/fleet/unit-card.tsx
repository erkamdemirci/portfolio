import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { StatusChip, type StatusVariant } from "@/components/ui/status-chip";

/**
 * External product link for the tel block's first line — the trailing "↗" in content
 * strings is NEVER a text glyph (01 Amendment A5); it's the Lucide ArrowUpRight icon,
 * 14px, aria-hidden, inheriting the surrounding text's color/hover.
 */
export function ExternalTelLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      // normal-case: domains are code artifacts (01 §Typography exemption) — the TR
      // locale's uppercase transform must never dot the i's (AKİTLE.COM is not a domain).
      className="inline-flex items-center gap-1 normal-case"
    >
      {label}
      <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.5} />
    </a>
  );
}

/**
 * C14 — Unit card (02-components.md §C14). Card-top (unit label + status chip) → screen
 * region (C15/C16, caller-provided) → card-meta (h3 wrapping the STRETCHED case-study
 * link that covers the whole card via an absolutely-positioned pseudo-element on an
 * ancestor with `position: relative`) + description + a right-aligned tel block. The
 * tel block's own link (when present) stays independently clickable above the stretched
 * overlay (`relative z-10`).
 */

interface UnitCardProps {
  unitLabel: string;
  status: { variant: StatusVariant; flag: string; meta?: string };
  frame: ReactNode;
  href: string;
  title: string;
  description: string;
  /** External product link OR plain text (Oasis has no live link yet). */
  telLine1: ReactNode;
  /** Data line — caller embeds <b> where a specific value (e.g. a rating) is bold. */
  telLine2: ReactNode;
  span: 7 | 5;
  className?: string;
}

const SPAN_CLASSES: Record<7 | 5, string> = {
  7: "col-span-7 max-[1020px]:col-span-12",
  5: "col-span-5 max-[1020px]:col-span-12",
};

export function UnitCard({
  unitLabel,
  status,
  frame,
  href,
  title,
  description,
  telLine1,
  telLine2,
  span,
  className,
}: UnitCardProps) {
  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded border border-line bg-carbon-2 transition-[background-color,border-color,transform] duration-[var(--dur-base)] ease-[var(--ease)] hover:-translate-y-0.5 hover:border-line-strong hover:bg-carbon-3 focus-within:-translate-y-0.5 focus-within:border-line-strong focus-within:bg-carbon-3 active:translate-y-0 ${SPAN_CLASSES[span]} ${className ?? ""}`}
    >
      <div className="mono flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3 text-steel">
        <span>{unitLabel}</span>
        <StatusChip variant={status.variant} flag={status.flag} meta={status.meta} />
      </div>

      {frame}

      <div className="mt-auto grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-2 p-5 max-[640px]:grid-cols-1">
        <h3 className="text-[1.2rem] leading-[1.6] font-semibold tracking-[-0.015em]">
          <Link href={href} prefetch={false} className="after:absolute after:inset-0 after:content-['']">
            {title}
          </Link>
        </h3>
        <p className="col-start-1 max-w-[44ch] text-[0.9rem] text-steel">{description}</p>
        <span className="relative z-10 col-start-2 row-span-2 self-center text-right font-mono text-xs leading-[2] tracking-[0.06em] text-steel uppercase max-[640px]:col-start-1 max-[640px]:row-start-3 max-[640px]:mt-2 max-[640px]:text-left">
          <span className="relative z-10 transition-colors duration-[var(--dur-base)] ease-[var(--ease)] hover:text-amber-text">
            {telLine1}
          </span>
          <br />
          {telLine2}
        </span>
      </div>
    </article>
  );
}

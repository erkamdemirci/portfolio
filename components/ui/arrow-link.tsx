import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

/**
 * C8 — Arrow-link (02-components.md §C8). Text + Lucide arrow icon (16px, stroke 1.5,
 * --amber-text). `forward` (default) trails ArrowRight; `back` leads with ArrowLeft.
 * The trailing/leading arrow glyph in content strings (→ / ←) is NEVER rendered as text
 * (01 Amendment A5) — the icon carries it; `children` must be glyph-free.
 */

interface ArrowLinkProps {
  href: string;
  children: ReactNode;
  variant?: "forward" | "back";
  className?: string;
}

const ICON_CLASSES =
  "text-amber-text transition-transform duration-[var(--dur-base)] ease-[var(--ease)]";

export function ArrowLink({ href, children, variant = "forward", className }: ArrowLinkProps) {
  const isInternal = href.startsWith("/");
  const content = (
    <>
      {variant === "back" && (
        <ArrowLeft
          aria-hidden="true"
          size={16}
          strokeWidth={1.5}
          className={`${ICON_CLASSES} group-hover:-translate-x-1`}
        />
      )}
      <span>{children}</span>
      {variant === "forward" && (
        <ArrowRight
          aria-hidden="true"
          size={16}
          strokeWidth={1.5}
          className={`${ICON_CLASSES} group-hover:translate-x-1`}
        />
      )}
    </>
  );

  const classes = `group inline-flex items-center gap-2 text-[0.95rem] font-semibold leading-[1.6] text-bright active:translate-y-px ${className ?? ""}`;

  if (isInternal) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={classes}>
      {content}
    </a>
  );
}

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { AnchorHTMLAttributes, ReactNode } from "react";

/**
 * TextLink (02-components.md §TextLink). Inline prose/link affordance — never a box button.
 *
 * - `inline` (default): evergreen text with a 1px underline at 3px offset, the underline
 *   drawn in `--ever` at 42% and rising to full `--ever` on hover (--dur-fast). Email + in-prose
 *   links. No press scale (text links never scale — 01 §Motion).
 * - `external-mono`: same evergreen underline, but Geist Mono (figure-inline step) + a
 *   trailing lucide ArrowUpRight (aria-hidden). Replaces the dead ExternalTelLink — the "↗"
 *   is the icon, never a literal glyph. Opens in a new tab (target/rel), matching the
 *   renderSegments contract lib/cases.ts expects (wired in T35).
 *
 * Hover is gated behind `(hover:hover) and (pointer:fine)`.
 */

const EVER_UNDERLINE =
  "text-ever underline decoration-1 underline-offset-[3px] [text-decoration-color:color-mix(in_oklab,var(--ever)_42%,transparent)] transition-[text-decoration-color] duration-[var(--dur-fast)] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:hover:[text-decoration-color:var(--ever)]";

type TextLinkVariant = "inline" | "external-mono";

interface TextLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> {
  href: string;
  children: ReactNode;
  variant?: TextLinkVariant;
  className?: string;
}

export function TextLink({
  href,
  children,
  variant = "inline",
  className,
  ...rest
}: TextLinkProps) {
  if (variant === "external-mono") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1 font-mono text-[0.86rem] tracking-[-0.01em] ${EVER_UNDERLINE} ${className ?? ""}`}
        {...rest}
      >
        {children}
        <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.5} />
      </a>
    );
  }

  const classes = `${EVER_UNDERLINE} ${className ?? ""}`;
  if (href.startsWith("/")) {
    return (
      <Link href={href} prefetch={false} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  );
}

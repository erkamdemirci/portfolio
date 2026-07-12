import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

/**
 * ArrowLink (02-components.md §ArrowLink). Hanken 500 (ui) label + a lucide arrow, a
 * hairline `--line` underline at 4px offset. `forward` (default) trails ArrowRight;
 * `back` leads with ArrowLeft. On hover (gated `(hover:hover) and (pointer:fine)`) the
 * underline warms to `--ink-soft` and the arrow slides 3px. Reduced-motion removes the
 * slide via the globals `.ghost:hover .arw { transform: none }` rule (unlayered, so it
 * wins over the utility). Text links never press-scale (01 §Motion). The `.ghost`/`.arw`
 * class hooks are the reduced-motion targets; the visible glyph (→/←) is the icon, never
 * a literal character.
 */

interface ArrowLinkProps {
  href: string;
  children: ReactNode;
  variant?: "forward" | "back";
  className?: string;
}

const ARROW_BASE =
  "arw flex-none transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)]";

export function ArrowLink({ href, children, variant = "forward", className }: ArrowLinkProps) {
  const content = (
    <>
      {variant === "back" && (
        <ArrowLeft
          aria-hidden="true"
          size={16}
          strokeWidth={1.5}
          className={`${ARROW_BASE} [@media(hover:hover)_and_(pointer:fine)]:group-hover:[transform:translateX(-3px)]`}
        />
      )}
      <span>{children}</span>
      {variant === "forward" && (
        <ArrowRight
          aria-hidden="true"
          size={16}
          strokeWidth={1.5}
          className={`${ARROW_BASE} [@media(hover:hover)_and_(pointer:fine)]:group-hover:[transform:translateX(3px)]`}
        />
      )}
    </>
  );

  const classes = `group ghost inline-flex items-center gap-[0.45rem] font-body text-[0.95rem] font-medium leading-none text-ink underline decoration-line underline-offset-4 transition-[text-decoration-color] duration-[var(--dur-fast)] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-ink-soft ${className ?? ""}`;

  if (href.startsWith("/")) {
    return (
      // prefetch={false} — T32 perf fix, see components/ui/button.tsx and DEVIATIONS.md.
      <Link href={href} prefetch={false} className={classes}>
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

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * CasePager (02-components.md §CasePager, replaces case/unit-pager). Circular prev/next at the
 * case foot (05 → 01) driven by CASE_ORDER + UNIT_IDENTITY.title (the page supplies the
 * neighbors). Captions are de-themed ("Önceki"/"Sonraki" — no "ünite"). Hover slides the arrow
 * + underlines the neighbour title; press scales .985; both are removed under reduced motion via
 * the `.ghost`/`.figure` globals hooks. Arrows are lucide icons, never literal glyphs.
 */

interface PagerLink {
  href: string;
  title: string;
}

interface CasePagerProps {
  prev: PagerLink;
  next: PagerLink;
  prevCaption: string;
  nextCaption: string;
  className?: string;
}

const LINK_BASE =
  "group ghost figure flex items-center gap-3 no-underline transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)] motion-safe:active:[transform:scale(0.985)]";
const CAPTION = "text-[0.8rem] leading-[1.3] tracking-[0.02em] text-ink-soft";
const NAME =
  "font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.1] text-ink underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-[var(--dur-fast)] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:decoration-line";
const ARROW = "arw flex-none transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)]";

export function CasePager({ prev, next, prevCaption, nextCaption, className }: CasePagerProps) {
  return (
    <nav
      aria-label={`${prevCaption} / ${nextCaption}`}
      className={`flex items-stretch justify-between gap-6 border-t border-line-strong pt-8 ${className ?? ""}`}
    >
      <Link href={prev.href} prefetch={false} className={LINK_BASE}>
        <ArrowLeft
          aria-hidden="true"
          size={16}
          strokeWidth={1.5}
          className={`${ARROW} [@media(hover:hover)_and_(pointer:fine)]:group-hover:[transform:translateX(-3px)]`}
        />
        <span className="flex flex-col gap-1">
          <span className={CAPTION}>{prevCaption}</span>
          <span className={NAME}>{prev.title}</span>
        </span>
      </Link>
      <Link href={next.href} prefetch={false} className={`${LINK_BASE} text-right`}>
        <span className="flex flex-col items-end gap-1">
          <span className={CAPTION}>{nextCaption}</span>
          <span className={NAME}>{next.title}</span>
        </span>
        <ArrowRight
          aria-hidden="true"
          size={16}
          strokeWidth={1.5}
          className={`${ARROW} [@media(hover:hover)_and_(pointer:fine)]:group-hover:[transform:translateX(3px)]`}
        />
      </Link>
    </nav>
  );
}

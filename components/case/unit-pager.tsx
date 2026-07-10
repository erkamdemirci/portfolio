import { ArrowLink } from "@/components/ui/arrow-link";

/**
 * C23 — Next-unit pager (02-components.md §C23, extrapolated). Case-study footer strip:
 * two halves (back arrow-link / forward arrow-link), each with a mono unit label above
 * the product name. The fleet is a loop — both directions are ALWAYS present, never a
 * dead end (getCircularNeighbors below: 01->02->03->04->05->01).
 */

export interface PagerUnit {
  href: string;
  unitLabel: string;
  title: string;
}

interface UnitPagerProps {
  prev: PagerUnit;
  next: PagerUnit;
  prevCaption: string;
  nextCaption: string;
  className?: string;
}

export function UnitPager({ prev, next, prevCaption, nextCaption, className }: UnitPagerProps) {
  return (
    <div
      className={`grid grid-cols-2 gap-5 border-t border-line py-[var(--sec-tight)] max-[640px]:grid-cols-1 ${className ?? ""}`}
    >
      <div>
        <span className="mono mb-2 block text-steel">
          {prevCaption} / {prev.unitLabel}
        </span>
        <ArrowLink href={prev.href} variant="back" className="text-[1.2rem] font-semibold">
          {prev.title}
        </ArrowLink>
      </div>
      <div className="text-right max-[640px]:text-left">
        <span className="mono mb-2 block text-steel">
          {nextCaption} / {next.unitLabel}
        </span>
        <ArrowLink
          href={next.href}
          variant="forward"
          className="justify-end text-[1.2rem] font-semibold max-[640px]:justify-start"
        >
          {next.title}
        </ArrowLink>
      </div>
    </div>
  );
}

/** Circular neighbor lookup — the fleet loops (01..05..01), both directions always exist. */
export function getCircularNeighbors<T>(items: T[], currentIndex: number): { prev: T; next: T } {
  const len = items.length;
  const prevIndex = (currentIndex - 1 + len) % len;
  const nextIndex = (currentIndex + 1) % len;
  return { prev: items[prevIndex], next: items[nextIndex] };
}

import type { ReactNode } from "react";

/**
 * C9 — Section eyebrow (02-components.md §C9). Mono-label preceded by a 34×1px
 * --amber-mark tick rule (::before via Tailwind `before:`), gap 12px. Margin-bottom:
 * 28px on the hero, 20px inside section heads (A1-normalized 18→20).
 */

interface EyebrowProps {
  children: ReactNode;
  variant?: "hero" | "section";
  className?: string;
}

export function Eyebrow({ children, variant = "section", className }: EyebrowProps) {
  const marginBottom = variant === "hero" ? "mb-7" : "mb-5";
  return (
    <p
      className={`mono flex items-center gap-3 text-steel before:h-px before:w-[34px] before:shrink-0 before:bg-amber-mark ${marginBottom} ${className ?? ""}`}
    >
      {children}
    </p>
  );
}

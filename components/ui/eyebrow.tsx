import type { ReactNode } from "react";

/**
 * Eyebrow (02-components.md §Eyebrow). Plain kicker: Hanken 500 0.82rem, tracking 0.04em,
 * --ink-soft. No leading index, no tick, no dot (the old accent-mark rule + numbering are
 * rejected apparatus). Sentence case in source copy — never a CSS transform (TR İ/ı rule).
 * The `variant` only sets the trailing margin (28px hero / 20px section); it carries no
 * visual difference otherwise.
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
      className={`text-[0.82rem] font-medium leading-[1.3] tracking-[0.04em] text-ink-soft ${marginBottom} ${className ?? ""}`}
    >
      {children}
    </p>
  );
}

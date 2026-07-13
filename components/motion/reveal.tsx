"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Entrance reveal (01-design-system.md §Motion): opacity 0→1 + an 8px rise, on the
 * --dur-reveal / --ease-out curve — both supplied by globals via the .reveal / .reveal-hidden
 * classes (T02), never hard-coded here — triggered once at ~20% intersection, with a per-item
 * stagger applied through transition-delay (index × the step, 01 §Motion). Progressive
 * enhancement is BINDING (io's measured failure class): the default render is always fully
 * visible; the pre-animation hidden state is applied by JS only after mount, and only when
 * IntersectionObserver exists AND reduced-motion is off. Under prefers-reduced-motion the
 * component never hides (opacity stays 1) and the globals surgical block drops the movement
 * (.reveal-hidden { transform: none }) — motion removed, not a blanket transition kill.
 */

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface RevealProps {
  children: ReactNode;
  /** Position within a reveal group — the transition-delay is index × the stagger step
   *  (01 §Motion). 0 (the default) means no delay. */
  index?: number;
  className?: string;
}

export function Reveal({ children, index = 0, className }: RevealProps) {
  const [hidden, setHidden] = useState(false); // default: always visible (io failure guard)
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return; // stays visible — reduced motion kills the reveal
    if (typeof IntersectionObserver === "undefined") return; // io failure guard — stays visible
    const node = ref.current;
    if (!node) return;

    // Above-fold guard (T72 LCP fix): content already in the viewport at hydration is NEVER
    // hidden — hiding it after SSR paint and re-showing it post-hydration re-rasters the hero
    // and becomes the page's LCP under CPU throttle (measured 3.3s → the fix restores
    // first-paint LCP). It also matches the restraint rule: no entrance animation for what
    // the visitor already sees. Reveal remains a below-fold entrance.
    if (node.getBoundingClientRect().top < window.innerHeight) return;

    setHidden(true); // JS + IntersectionObserver + motion all confirmed available now

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHidden(false);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${hidden ? "reveal-hidden" : ""} ${className ?? ""}`}
      style={index > 0 ? { transitionDelay: `${index * 40}ms` } : undefined}
    >
      {children}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Entrance reveal (01-design-system.md §Motion): opacity 0->1 + translateY(8px)->0,
 * 240ms --ease-out, 40ms stagger, triggered once at ~20% intersection. Progressive
 * enhancement is BINDING (io's measured failure class): default render is always fully
 * visible; the pre-animation hidden state is applied by JS only after mount, and only
 * when IntersectionObserver exists AND reduced-motion is off. `prefers-reduced-motion`
 * also gets a global `transition: none !important` kill in app/globals.css, so even the
 * hidden->visible cross-fade never runs under reduced motion.
 */

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface RevealProps {
  children: ReactNode;
  /** Position within a reveal group — delay = index * 40ms (01 §Motion stagger). */
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

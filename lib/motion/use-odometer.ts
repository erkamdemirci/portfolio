"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The ONE orchestrated moment (01-design-system.md §Motion): the StatBand odometer.
 * 0 -> value, 700ms --ease-out, 40ms stagger applied by the caller (per stat cell), once
 * per mount. Runs on a fixed-step `setInterval` (not requestAnimationFrame) so behavior
 * is deterministic under fake timers and never depends on real frame timing. Reduced
 * motion (or a missing `matchMedia`, e.g. no-JS/old browsers) returns the final value
 * synchronously with NO timer ever attached — the real value is already server-rendered
 * in the HTML; this hook only animates the presentation on top of it.
 */

const DURATION_MS = 700;
const STEP_MS = 16;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function easeOutCubic(progress: number): number {
  return 1 - Math.pow(1 - progress, 3);
}

export function useOdometer(targetValue: number): number {
  // Initial state is ALWAYS the real target — `prefersReducedMotion()` reads `window`,
  // which never exists during SSR/static generation, so a server-computed initial value
  // could never depend on it anyway (this is a statically-generated site, not per-request
  // SSR that could read client headers). Server-rendered HTML and the pre-effect client
  // render must match, so both show the final value — satisfying "real value
  // server-rendered in the HTML" exactly. The count-up is a POST-MOUNT-ONLY visual layer
  // applied by the effect below (skipped entirely under reduced motion).
  const [display, setDisplay] = useState(targetValue);
  const startedRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) return; // stays at the real value — no timer, no dip to 0
    if (startedRef.current) return; // runs once — a re-render never restarts the count
    startedRef.current = true;

    setDisplay(0); // begin the visual count-up
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += STEP_MS;
      const progress = Math.min(elapsed / DURATION_MS, 1);
      setDisplay(Math.round(easeOutCubic(progress) * targetValue));
      if (progress >= 1) {
        clearInterval(interval);
      }
    }, STEP_MS);

    return () => clearInterval(interval);
  }, [targetValue]);

  return display;
}

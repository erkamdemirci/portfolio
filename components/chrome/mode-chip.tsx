"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

/**
 * C4 — Mode chip / theme toggle (02-components.md §C4). Hand-rolled `<button>`: toggles
 * `data-theme` on <html>, persists `localStorage("theme")`. Accessible name is the
 * ACTION (localized, flips on toggle) — this is a mode cycler, not a pressed toggle, so
 * it carries no pressed-state ARIA attribute. No sun/moon icon (01 named decision) —
 * mono text chip only.
 */

type Theme = "dark" | "light";

interface ModeChipProps {
  dict: Dictionary["modeChip"];
  className?: string;
}

export function ModeChip({ dict, className }: ModeChipProps) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage may be unavailable (private mode, disabled) — visual toggle still works */
    }
    setTheme(next);
  }

  const label = theme === "light" ? dict.light : dict.dark;
  const ariaLabel = theme === "light" ? dict.ariaToDark : dict.ariaToLight;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={ariaLabel}
      className={`mono relative inline-flex items-center justify-center whitespace-nowrap rounded border border-line px-3 py-2 text-steel transition-[color,border-color] duration-[var(--dur-base)] ease-[var(--ease)] before:absolute before:-inset-2 before:content-[''] hover:border-line-strong hover:text-bright active:translate-y-px ${className ?? ""}`}
    >
      {label}
    </button>
  );
}

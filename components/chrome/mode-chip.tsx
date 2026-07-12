"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

/**
 * ThemeToggle / ModeChip (02-components.md §ThemeToggle). Hand-rolled 44×44 icon button:
 * flips `data-theme` on <html> and persists localStorage("theme"). The kept mechanism is
 * unchanged in shape — only the default resolves to LIGHT now (T03), and the visible
 * "mod / koyu" text chip becomes an icon.
 *
 * Icon follows the theme via CSS on <html data-theme> (Moon in light → offers dark; Sun in
 * dark → offers light), so it is correct before hydration with no flash. The accessible
 * name is the ACTION and flips with state; it is a mode cycler, so it carries no
 * aria-pressed. NO transition on the theme-swap path — only `transform` is transitioned
 * (the press), so flipping the theme never animates the button's colors.
 */

type Theme = "dark" | "light";

interface ModeChipProps {
  dict: Dictionary["modeChip"];
  className?: string;
}

export function ModeChip({ dict, className }: ModeChipProps) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
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

  const ariaLabel = theme === "light" ? dict.ariaToDark : dict.ariaToLight;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={ariaLabel}
      className={`grid h-11 w-11 place-items-center rounded-ui border border-line bg-paper text-ink transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)] motion-safe:active:[transform:scale(0.97)] [@media(hover:hover)_and_(pointer:fine)]:hover:border-ink-soft ${className ?? ""}`}
    >
      <Moon
        aria-hidden="true"
        size={18}
        strokeWidth={1.5}
        className="[html[data-theme=dark]_&]:hidden"
      />
      <Sun
        aria-hidden="true"
        size={18}
        strokeWidth={1.5}
        className="hidden [html[data-theme=dark]_&]:block"
      />
    </button>
  );
}

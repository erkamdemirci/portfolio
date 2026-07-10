"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { getAlternate } from "@/lib/i18n/routes";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

/**
 * C5 — Locale chip (02-components.md §C5). Same visual anatomy as C4 (mono chip). A
 * plain <a> (full navigation, no client-side text swap) to the exact alternate-locale
 * counterpart of the current page (lib/i18n/routes' getAlternate, T04's route table).
 * Renders the target-locale `hreflang` attribute + `rel="alternate"`; `aria-label` is in
 * the CURRENT page's language (dict.ariaSwitch, per-locale dictionary content).
 */

interface LocaleChipProps {
  dict: Dictionary["localeChip"];
  className?: string;
}

export function LocaleChip({ dict, className }: LocaleChipProps) {
  const pathname = usePathname();
  const params = useParams<{ lang: string }>();
  const href = getAlternate(pathname ?? "/");
  const targetLang = params?.lang === "en" ? "tr" : "en";

  return (
    <Link
      href={href}
      prefetch={false}
      hrefLang={targetLang}
      rel="alternate"
      aria-label={dict.ariaSwitch}
      className={`mono relative inline-flex items-center justify-center whitespace-nowrap rounded border border-line px-3 py-2 text-steel transition-[color,border-color] duration-[var(--dur-base)] ease-[var(--ease)] before:absolute before:-inset-2 before:content-[''] hover:border-line-strong hover:text-bright active:translate-y-px ${className ?? ""}`}
    >
      {dict.label}
    </Link>
  );
}

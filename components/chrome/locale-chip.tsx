"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { getAlternate } from "@/lib/i18n/routes";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

/**
 * LocaleChip (02-components.md §LocaleChip). A ui-step ghost <a> (Hanken 500 0.95rem,
 * --ink-soft → --ink on hover), ≥44px hit area. Kept plumbing: a full-navigation link to
 * `getAlternate(pathname)` (never a client text swap), rendering the target-locale
 * `hreflang` + `rel="alternate"`; the `aria-label` stays in the CURRENT page's language.
 * The locale switch is a page navigation, so it never animates (frequency rule).
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
      className={`inline-flex min-h-11 items-center whitespace-nowrap text-[0.95rem] font-medium text-ink-soft transition-[color] duration-[var(--dur-fast)] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:hover:text-ink ${className ?? ""}`}
    >
      {dict.label}
    </Link>
  );
}

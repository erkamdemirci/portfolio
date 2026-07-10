"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";
import { Button } from "@/components/ui/button";
import { ModeChip } from "./mode-chip";
import { LocaleChip } from "./locale-chip";

/**
 * G1 — Header / nav (03-screens-and-flows.md §G1; 02-components.md §C1/C2/C3/C5).
 * 64px bar, border-bottom --line: C2 wordmark -> C3 links (margin-left auto) -> C4 mode
 * chip -> C5 locale chip (gap 12px) -> C7-accent CTA. <=640px: nav links + locale chip
 * move into the C6 mobile-menu panel; the bar keeps C2 (no descriptor) + C4 + C7 + the
 * C6 trigger. The trigger below is a non-functional placeholder — T11 replaces it with
 * the real MobileMenu disclosure (keyboard/ARIA/focus contract lives there).
 */

const NAV_ROUTES: Record<Lang, { work: string; services: string; studio: string }> = {
  tr: { work: "/isler", services: "/hizmetler", studio: "/studyo" },
  en: { work: "/en/work", services: "/en/services", studio: "/en/studio" },
};

const HOME_HREF: Record<Lang, string> = { tr: "/", en: "/en" };
const CONTACT_HREF: Record<Lang, string> = { tr: "/iletisim", en: "/en/contact" };

interface HeaderProps {
  lang: Lang;
  dict: Dictionary;
}

export function Header({ lang, dict }: HeaderProps) {
  const pathname = usePathname();
  const routes = NAV_ROUTES[lang];

  const navItems = [
    { href: routes.work, label: dict.nav.work },
    { href: routes.services, label: dict.nav.services },
    { href: routes.studio, label: dict.nav.studio },
  ];

  return (
    <header role="banner" className="border-b border-line">
      <div className="wrap flex h-auto min-h-16 flex-wrap items-center gap-x-2 gap-y-2 sm:h-16 sm:flex-nowrap sm:gap-7">
        <Link
          href={HOME_HREF[lang]}
          className="inline-flex items-baseline gap-3 text-[1.1rem] font-bold tracking-[-0.01em] text-bright active:translate-y-px"
        >
          <i aria-hidden="true" className="h-[9px] w-[9px] self-center rounded-[2px] bg-amber-mark" />
          {dict.wordmark.name}{" "}
          <span className="mono text-steel max-[640px]:hidden">{dict.wordmark.descriptor}</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 sm:ml-auto sm:flex">
          {navItems.map((item) => {
            const current = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`text-[0.9rem] font-medium underline-offset-[6px] transition-colors duration-[var(--dur-base)] ease-[var(--ease)] hover:text-bright hover:underline hover:decoration-amber-mark active:translate-y-px ${
                  current ? "text-bright underline decoration-amber-mark" : "text-steel"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3 sm:ml-0">
          <ModeChip dict={dict.modeChip} />
          <span className="hidden sm:inline-flex">
            <LocaleChip dict={dict.localeChip} />
          </span>
        </div>

        <Button variant="accent" href={CONTACT_HREF[lang]}>
          {dict.nav.cta}
        </Button>

        {/*
          Mobile menu trigger placeholder — replaced by MobileMenu in T11 (full ARIA
          contract lands there). 20px visible icon with the A7 invisible-expansion
          pattern (before:-inset-3 = 12px each side -> 44x44 hit area, zero extra
          layout width, matching the mode/locale chip technique already used above).
        */}
        <button
          type="button"
          aria-hidden="true"
          tabIndex={-1}
          className="relative inline-flex h-5 w-5 items-center justify-center text-bright before:absolute before:-inset-3 before:content-[''] sm:hidden"
        >
          <Menu aria-hidden="true" size={20} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}

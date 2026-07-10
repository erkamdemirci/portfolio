"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";
import { Button } from "@/components/ui/button";
import { ModeChip } from "./mode-chip";
import { LocaleChip } from "./locale-chip";
import { MobileMenu } from "./mobile-menu";

/**
 * G1 — Header / nav (03-screens-and-flows.md §G1; 02-components.md §C1/C2/C3/C5/§C6).
 * 64px bar, border-bottom --line: C2 wordmark -> C3 links (margin-left auto) -> C4 mode
 * chip -> C5 locale chip (gap 12px) -> C7-accent CTA. <=849px: nav links + locale chip
 * move into the C6 mobile-menu panel (T11); the bar keeps C2 (no descriptor) + C4 + C7 +
 * the C6 trigger.
 *
 * T29 fix (see DEVIATIONS.md): the compact-bar cutover was originally `sm:` (640px,
 * Tailwind's default) — measured overflow at the pinned 768px shot-matrix breakpoint
 * (scrollWidth 805px vs 768px viewport, ~37px over) proved the FULL desktop composition
 * (wordmark+descriptor + all 3 nav links + mode chip + locale chip + CTA) needs ~805-814px
 * to fit without wrapping, a genuine viewport-arithmetic gap the same class as T10's own
 * mobile-bar fix (04-tasks.md T10 deviation) — not a design change, since the composition
 * on each side of the cutover is unchanged, only WHERE the cutover sits. Widened to a custom
 * 850px breakpoint (comfortable ~40-190px margin above the measured minimum at every
 * viewport this affects) so 768px gets the SAME already-built, already-tested compact
 * composition tablets already use below 640px, instead of overflowing.
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
      <div className="wrap flex h-auto min-h-16 flex-wrap items-center gap-x-2 gap-y-2 min-[850px]:h-16 min-[850px]:flex-nowrap min-[850px]:gap-7">
        <Link
          href={HOME_HREF[lang]}
          className="inline-flex items-baseline gap-3 text-[1.1rem] font-bold tracking-[-0.01em] text-bright active:translate-y-px"
        >
          <i aria-hidden="true" className="h-[9px] w-[9px] self-center rounded-[2px] bg-amber-mark" />
          {dict.wordmark.name}{" "}
          <span className="mono text-steel max-[849px]:hidden">{dict.wordmark.descriptor}</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 min-[850px]:ml-auto min-[850px]:flex">
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

        <div className="ml-auto flex items-center gap-3 min-[850px]:ml-0">
          <ModeChip dict={dict.modeChip} />
          <span className="hidden min-[850px]:inline-flex">
            <LocaleChip dict={dict.localeChip} />
          </span>
        </div>

        <Button variant="accent" href={CONTACT_HREF[lang]}>
          {dict.nav.cta}
        </Button>

        <MobileMenu lang={lang} dict={dict} navItems={navItems} contactHref={CONTACT_HREF[lang]} />
      </div>
    </header>
  );
}

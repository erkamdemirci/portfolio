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
 * Header. Two modes by route:
 * - Inner pages (services / blog / contact): the sticky paper bar — wordmark + nav
 *   (Hizmetler, Blog when TR) + LocaleChip + ModeChip + primary CTA.
 * - Home (the scroll-film): a transparent absolute bar over the night world — the film
 *   owns the viewport, so the bar scrolls away with the opening shot. `.film-scope`
 *   remaps the tokens so every chip/menu restyles itself; ModeChip is hidden (the film's
 *   palette is fixed by design).
 * Below 850px the nav + LocaleChip + CTA move into the MobileMenu.
 */

const SERVICES_HREF: Record<Lang, string> = { tr: "/hizmetler", en: "/en/services" };
const HOME_HREF: Record<Lang, string> = { tr: "/", en: "/en" };
const CONTACT_HREF: Record<Lang, string> = { tr: "/iletisim", en: "/en/contact" };
// The blog is TR-only (A11); its index lives at /blog.
const BLOG_HREF = "/blog";

interface HeaderProps {
  lang: Lang;
  dict: Dictionary;
}

export function Header({ lang, dict }: HeaderProps) {
  const pathname = usePathname();
  const isFilm = pathname === "/" || pathname === "/en" || pathname === "/tr";

  const navItems = [{ href: SERVICES_HREF[lang], label: dict.nav.services }];
  // Blog is rendered only for TR (render-time rule; en.ts keeps the key for type parity).
  const desktopNav =
    lang === "tr" ? [...navItems, { href: BLOG_HREF, label: dict.nav.blog }] : navItems;

  return (
    <header
      role="banner"
      className={
        isFilm
          ? "film-scope absolute inset-x-0 top-0 z-40 bg-transparent"
          : "sticky top-0 z-40 border-b border-line bg-paper"
      }
    >
      <div className="wrap flex min-h-[68px] items-center justify-between gap-6">
        <Link
          href={HOME_HREF[lang]}
          prefetch={false}
          className="group inline-flex items-baseline gap-2 text-[1.06rem] font-bold tracking-[-0.01em] text-ink"
        >
          {dict.wordmark.name}
          <span className="text-[0.86rem] font-normal text-ink-soft transition-[color] duration-[var(--dur-fast)] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-ink">
            {dict.wordmark.descriptor}
          </span>
        </Link>

        <div className="flex items-center gap-[clamp(1rem,2.4vw,2rem)]">
          <nav aria-label="Primary" className="flex gap-[clamp(1rem,2vw,1.6rem)] max-[849px]:hidden">
            {desktopNav.map((item) => {
              const current = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  aria-current={current ? "page" : undefined}
                  className={`border-b py-1 text-[0.95rem] font-medium transition-[color,border-color] duration-[var(--dur-fast)] ease-[var(--ease-out)] ${
                    current
                      ? "border-ink-soft text-ink"
                      : "border-transparent text-ink-soft [@media(hover:hover)_and_(pointer:fine)]:hover:border-line [@media(hover:hover)_and_(pointer:fine)]:hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <LocaleChip dict={dict.localeChip} className="max-[849px]:hidden" />
          {!isFilm && <ModeChip dict={dict.modeChip} />}
          <Button variant="primary" href={CONTACT_HREF[lang]} className="max-[849px]:hidden">
            {dict.nav.cta}
          </Button>

          <MobileMenu lang={lang} dict={dict} navItems={navItems} contactHref={CONTACT_HREF[lang]} film={isFilm} />
        </div>
      </div>
    </header>
  );
}

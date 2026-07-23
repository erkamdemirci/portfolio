"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";
import { TextLink } from "@/components/ui/text-link";

/**
 * Footer. Brand restatement + contact (email link, location line) on the left, footer nav
 * on the right (Blog is TR-only, A11), closed by a top-bordered copyright line with the
 * domain in Geist Mono. Hidden on the home scroll-film — the film ends in its own designed
 * finale block (contact CTA + mini-nav + copyright), and a second footer under a film is a
 * seam. Client component only for the pathname check.
 */

const NAV_ROUTES: Record<Lang, { services: string; contact: string }> = {
  tr: { services: "/hizmetler", contact: "/iletisim" },
  en: { services: "/en/services", contact: "/en/contact" },
};

// The blog is TR-only (A11); its index lives at /blog.
const BLOG_HREF = "/blog";

interface FooterProps {
  lang: Lang;
  dict: Dictionary;
}

export function Footer({ lang, dict }: FooterProps) {
  const pathname = usePathname();
  const isFilm = pathname === "/" || pathname === "/en" || pathname === "/tr";
  if (isFilm) return null;

  const routes = NAV_ROUTES[lang];
  const navItems = [
    { href: routes.services, label: dict.nav.services },
    ...(lang === "tr" ? [{ href: BLOG_HREF, label: dict.nav.blog }] : []),
    { href: routes.contact, label: dict.nav.contact },
  ];

  // "© 2026 DMRC · erkamdemirci.com" → render the domain in Geist Mono.
  const [copyLead, copyDomain] = dict.footer.copyright.split(" · ");

  return (
    <footer role="contentinfo" className="border-t border-line">
      <div className="wrap py-[clamp(40px,5vw,60px)]">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-[1rem] text-ink">{dict.footer.brand}</p>
            <p className="mt-2 text-[0.92rem]">
              <TextLink href={`mailto:${dict.footer.email}`} className="inline-block">
                {dict.footer.email}
              </TextLink>
              <span className="text-ink-soft"> · {dict.footer.location}</span>
            </p>
          </div>

          <nav aria-label="Footer" className="flex gap-[1.4rem]">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className="text-[0.95rem] font-medium text-ink-soft transition-[color] duration-[var(--dur-fast)] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-[1.6rem] border-t border-line pt-[1.4rem] text-[0.86rem] text-ink-soft">
          {copyLead}
          {copyDomain && (
            <>
              {" · "}
              <span className="mono text-[0.82rem]">{copyDomain}</span>
            </>
          )}
        </p>
      </div>
    </footer>
  );
}

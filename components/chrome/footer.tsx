import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";
import { TextLink } from "@/components/ui/text-link";

/**
 * Footer (02-components.md §Footer; 03 §G2). A designed block, not a strip: brand
 * restatement + a contact line (email) on the left, footer nav on the right (Blog is
 * TR-only, A11), closed by a top-bordered copyright line with the domain in Geist Mono.
 * The old six-cell kv-grid and the printed-sheet metadata line are removed — this footer
 * is fully de-themed.
 */

const NAV_ROUTES: Record<Lang, { work: string; services: string; studio: string }> = {
  tr: { work: "/isler", services: "/hizmetler", studio: "/studyo" },
  en: { work: "/en/work", services: "/en/services", studio: "/en/studio" },
};

// The blog is TR-only (A11); its index lives at /blog.
const BLOG_HREF = "/blog";

interface FooterProps {
  lang: Lang;
  dict: Dictionary;
}

export function Footer({ lang, dict }: FooterProps) {
  const routes = NAV_ROUTES[lang];
  const navItems = [
    { href: routes.work, label: dict.nav.work },
    { href: routes.services, label: dict.nav.services },
    { href: routes.studio, label: dict.nav.studio },
  ];
  const footerNav =
    lang === "tr" ? [...navItems, { href: BLOG_HREF, label: dict.nav.blog }] : navItems;

  // "© 2026 DMRC · erkamdemirci.com" → render the domain in Geist Mono (mockup .foot-copy).
  const [copyLead, copyDomain] = dict.footer.copyright.split(" · ");

  return (
    <footer role="contentinfo" className="border-t border-line">
      <div className="wrap py-[clamp(40px,5vw,60px)]">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-[1rem] text-ink">{dict.footer.brand}</p>
            <TextLink
              href={`mailto:${dict.footer.contact}`}
              className="mt-2 inline-block text-[0.92rem]"
            >
              {dict.footer.contact}
            </TextLink>
          </div>

          <nav aria-label="Footer" className="flex gap-[1.4rem]">
            {footerNav.map((item) => (
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

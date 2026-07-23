import type { Metadata } from "next";
import { NotFound } from "@/components/chrome/not-found";
import { getRequestLang } from "@/lib/i18n/request-lang";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";

/**
 * G3 — 404 (03-screens-and-flows.md §G3; 02-components.md §C25; 04-tasks.md T28). Renders for
 * every unmatched public path, reached via the app/[lang]/[...rest] catch-all's notFound()
 * call — always inside the [lang] segment (G1/G2 wrap it via app/[lang]/layout.tsx, unaffected
 * by the notFound() boundary swap). Never a root 404 (no app/not-found.tsx exists) — a
 * root-level attempt was tried and reverted during T28; see DEVIATIONS.md and
 * components/chrome/g3-not-found.tsx's doc comment for the full writeup (short version: it
 * would have made this page's raw HTML complete without client JavaScript, a real Next.js App
 * Router limitation confirmed here, but only by forcing the entire site's 24 real routes out
 * of static generation — not a trade worth making for one rarely-hit, noindex'd error page).
 *
 * Locale comes from `getRequestLang()` (T28 deviation, see DEVIATIONS.md and
 * lib/i18n/request-lang.ts) — NOT `[lang]` params, which Next.js's not-found.js convention
 * never receives, and NOT a Dynamic API like `headers()`, which forces the entire [lang]
 * segment out of static generation (confirmed empirically: `pnpm build` regressed all 25
 * routes from SSG to fully dynamic the moment `headers()` was tried here). `getRequestLang()`
 * works because this boundary is only ever reached for a request that DID enter the [lang]
 * segment, so app/[lang]/layout.tsx already ran and called `setRequestLang()` first.
 */

// Static, locale-neutral metadata: not-found.tsx has no reliable per-request dynamic
// metadata resolution in this Next.js version (see DEVIATIONS.md) — noindex is the load-
// bearing acceptance criterion here and is unconditional regardless of locale.
export const metadata: Metadata = {
  title: "DMRC — 404",
  robots: "noindex",
};

const HOME_HREF: Record<Lang, string> = { tr: "/", en: "/en" };
const SERVICES_HREF: Record<Lang, string> = { tr: "/hizmetler", en: "/en/services" };

export default function NotFoundPage() {
  const lang = getRequestLang();
  const n = getDictionary(lang).notFound;
  return (
    <NotFound
      heading={n.heading}
      path={n.genericPath}
      homeHref={HOME_HREF[lang]}
      homeLabel={n.homeLabel}
      secondaryHref={SERVICES_HREF[lang]}
      secondaryLabel={n.servicesLabel}
    />
  );
}

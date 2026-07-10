import { StatusChip } from "@/components/ui/status-chip";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Button } from "@/components/ui/button";
import { RouteReadout } from "@/components/case/route-readout";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";

/**
 * G3 — 404 body content (03-screens-and-flows.md §G3; 02-components.md §C25; 04-tasks.md
 * T28). Rendered by app/[lang]/not-found.tsx, reached via the app/[lang]/[...rest] catch-all's
 * notFound() call.
 *
 * Factored out of app/[lang]/not-found.tsx into its own component during T28 while a
 * root-level `app/not-found.tsx` was briefly tried as a second consumer — that attempt is
 * REVERTED (see DEVIATIONS.md for the full writeup): it would have made the 404 page's raw
 * HTML complete without client JavaScript (a real, confirmed Next.js App Router limitation —
 * a notFound() thrown from ANY page it matched, static or dynamic, streams a shell requiring
 * client JS to paint; independently corroborated by vercel/next.js issue 62228), but only by
 * using a Dynamic API (`headers()`) in a root-level file reachable from every route, which
 * forced the ENTIRE SITE — all 24 real routes — out of static generation. That trade was not
 * worth it for a single, rarely-hit, noindex'd error page, so this stayed a single-consumer
 * component; kept factored out anyway since it reads cleanly on its own.
 *
 * h1 is styled at the h2 VISUAL scale (03: "h1 styled with the h2 type role — visual scale
 * != document outline — pinned") while remaining the actual, only h1 in the document outline.
 */

const HOME_HREF: Record<Lang, string> = { tr: "/", en: "/en" };
const WORK_HREF: Record<Lang, string> = { tr: "/isler", en: "/en/work" };

export function G3NotFound({ lang }: { lang: Lang }) {
  const dict = getDictionary(lang);
  const n = dict.notFound;

  return (
    <section className="wrap flex justify-center py-[var(--sec)]">
      <div className="max-w-[52ch] text-left">
        <StatusChip variant="no-signal" flag={n.chipFlag} />
        <h1 className="mt-6 text-balance text-[clamp(1.9rem,3.4vw,2.7rem)] leading-[1.08] font-semibold tracking-[-0.025em]">
          {n.heading}
        </h1>
        <RouteReadout className="mt-5" genericPath={n.genericPath} note={n.readoutNote} />
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <ArrowLink href={HOME_HREF[lang]} variant="back">
            {n.homeLabel}
          </ArrowLink>
          <Button variant="ghost" href={WORK_HREF[lang]}>
            {n.workLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}

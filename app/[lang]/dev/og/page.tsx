import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";

/**
 * OG image template (04-tasks.md T31; 03-screens-and-flows.md §Meta: "1200×630 static PNG per
 * locale: --carbon ground, C2 wordmark composition at display scale (tick + 'DMRC' GS 700),
 * one mono telemetry line, --steel, bottom-left title-block corner rule in --line"). Captured
 * at exactly 1200×630 by scripts/generate-og.mjs -> public/og-{tr,en}.png. Internal-only,
 * excluded from search indexing (robots noindex) and from crawling (robots.txt disallows /dev).
 *
 * The composition is a `position: fixed; inset: 0` layer with an explicit z-index — this page
 * still renders inside the shared app/[lang]/layout.tsx (Header/Footer; a root layout can't be
 * bypassed per-route in this App Router pattern, T05) but a fixed, opaque, higher-stacking
 * layer fully occludes both within the 1200×630 viewport the capture script uses (CSS painting
 * order: non-positioned in-flow content, e.g. the static-positioned G1/G2 chrome, paints BELOW
 * any positioned descendant that has an explicit z-index, regardless of DOM source order) —
 * confirmed empirically via the generated PNGs (og-tr.png/og-en.png contain only this
 * composition, no header/footer bleed-through).
 */

export const metadata: Metadata = {
  robots: "noindex",
};

// 03 §Meta OG spec — verbatim, both locales.
const TELEMETRY: Record<Lang, string> = {
  tr: "filoda 05 ürün · web & mobil",
  en: "05 products in the fleet · web & mobile",
};

export default async function OgTemplatePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: Lang };
  const dict = getDictionary(lang);

  return (
    <div className="fixed inset-0 z-[999] flex flex-col justify-center overflow-hidden bg-carbon px-[96px]">
      {/* ---------- C2 wordmark composition, display scale ---------- */}
      <div className="flex items-baseline gap-5">
        <i aria-hidden="true" className="mb-[14px] h-[26px] w-[26px] self-center rounded-[6px] bg-amber-mark" />
        <span className="text-[96px] leading-none font-bold tracking-[-0.02em] text-bright">
          {dict.wordmark.name}
        </span>
        <span className="font-mono text-[26px] tracking-[0.02em] text-steel uppercase">{dict.wordmark.descriptor}</span>
      </div>

      {/* ---------- one mono telemetry line ---------- */}
      <p className="mt-11 font-mono text-[24px] tracking-[0.04em] text-steel uppercase">{TELEMETRY[lang]}</p>

      {/* ---------- bottom-left title-block corner rule ---------- */}
      <span aria-hidden="true" className="absolute bottom-16 left-16 h-16 w-16 border-b border-l border-line" />
    </div>
  );
}

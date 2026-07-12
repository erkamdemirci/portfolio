import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";

/**
 * OG image template (T45; 01-design-system.md §Iconography — OG re-skin). The new quiet-editorial
 * card: a `--paper` ground, the `DMRC` wordmark + descriptor in Instrument Serif `--ink`, one
 * evergreen italic "turn" on the studio phrase, and a bottom-left corner rule in `--line`. The old
 * dark-carbon / amber-tick / mono-telemetry composition is dropped. Captured at exactly 1200×630
 * by scripts/generate-og.mjs → public/og-{tr,en}.png. Internal-only (noindex; robots disallows /dev).
 *
 * The composition is a `position: fixed; inset: 0` layer with an explicit z-index so it fully
 * occludes the shared Header/Footer within the 1200×630 capture viewport (a root layout can't be
 * bypassed per-route in this App Router pattern; painting order puts a positioned z-indexed layer
 * above the static in-flow chrome).
 */

export const metadata: Metadata = {
  robots: "noindex",
};

export default async function OgTemplatePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: Lang };
  const dict = getDictionary(lang);
  // De-themed copy from the dictionary: the descriptor, with its last word (the "stüdyosu" /
  // "studio" identity) set as the evergreen italic turn.
  const descriptor = dict.wordmark.descriptor;
  const cut = descriptor.lastIndexOf(" ");
  const descLead = cut > -1 ? descriptor.slice(0, cut + 1) : descriptor;
  const descTurn = cut > -1 ? descriptor.slice(cut + 1) : "";

  return (
    <div className="fixed inset-0 z-[999] flex flex-col justify-center overflow-hidden bg-paper px-[110px]">
      <span className="font-display text-[168px] leading-[0.95] tracking-[-0.01em] text-ink">
        {dict.wordmark.name}
      </span>
      <p className="mt-8 font-display text-[52px] leading-[1.15] text-ink-soft">
        {descLead}
        <em className="italic text-ever">{descTurn}</em>
      </p>
      <span aria-hidden="true" className="absolute bottom-16 left-16 h-16 w-16 border-b border-l border-line" />
    </div>
  );
}

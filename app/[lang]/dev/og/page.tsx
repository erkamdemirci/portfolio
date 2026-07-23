import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";

/**
 * OG image template — the "Tek Kalemde" card: night ground, colossal expanded DMRC, the
 * one cobalt stroke underlining it (fully drawn — a static capture has no animation), the
 * descriptor + the tri-service line, domain bottom-left. Captured at exactly 1200×630 by
 * scripts/generate-og.mjs → public/og-{tr,en}.png. Internal-only (noindex; robots
 * disallows /dev). Fixed film hexes on purpose: the OG card is a rendered asset, not a
 * themed surface.
 *
 * The composition is a `position: fixed; inset: 0` layer with an explicit z-index so it
 * fully occludes the shared Header within the capture viewport.
 */

export const metadata: Metadata = {
  robots: "noindex",
};

const TRI_LINE: Record<Lang, string> = {
  tr: "web siteleri · mobil uygulamalar · özel yazılım",
  en: "websites · mobile apps · custom software",
};

export default async function OgTemplatePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: Lang };
  const dict = getDictionary(lang);

  return (
    <div className="fixed inset-0 z-[999] flex flex-col justify-center overflow-hidden bg-[#0F0E0C] px-[110px]">
      <p className="label-cond text-[26px] text-[#8A94FF]">{dict.home.eyebrow}</p>
      <span
        className="mt-2 font-display text-[220px] leading-[0.95] text-[#F4F1EA]"
        style={{ fontStretch: "125%", fontWeight: 780, letterSpacing: "-0.028em" }}
      >
        {dict.wordmark.name}
      </span>
      <svg viewBox="0 0 600 40" className="mt-1 h-[40px] w-[720px]" aria-hidden="true">
        <path
          d="M 3 31 C 150 23, 380 35, 597 17"
          fill="none"
          stroke="#4A58FF"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <p className="mt-8 text-[40px] leading-[1.2] text-[#9A968B]">
        {dict.wordmark.descriptor.replace("/ ", "")} — {TRI_LINE[lang]}
      </p>
      <span className="mono absolute bottom-14 left-[110px] text-[24px] text-[#9A968B]">
        erkamdemirci.com
      </span>
    </div>
  );
}

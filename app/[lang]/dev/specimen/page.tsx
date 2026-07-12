import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import type { Lang } from "@/lib/i18n/routes";

/**
 * Dev specimen — 01-design-system.md demonstrator (internal-only, noindex). Renders the NEW
 * quiet-editorial system in whatever theme data-theme resolves to: the §Color tokens (both
 * themes via the theme toggle), the full §Typography scale (display-hero → figure-inline)
 * including the signature serif-italic evergreen turn, the §Motion behaviors (entrance
 * reveal, press scale(0.97), the stat figure), and a §Iconography & imagery plate sample
 * (typographic + browser-shot). Uses ONLY new tokens/utilities — no old carbon/amber/steel.
 *
 * Note: the stat figure renders in its final value (the odometer's SSR + reduced-motion
 * state). The live count-up ships on the home + studio stat bands (T29/T38/T42) where the
 * use-odometer client hook is wired; the specimen stays a server component to keep the
 * noindex metadata export. See DEVIATIONS.md (T06).
 */

export const metadata: Metadata = {
  robots: "noindex",
};

interface TypeRole {
  token: string;
  note: string;
  style: CSSProperties;
  sample: string;
  /** render the sample as an italic-ever turn after the upright text (display-hero) */
  turn?: string;
  mono?: boolean;
}

const DISPLAY = "var(--font-display)";
const BODY = "var(--font-body)";

const TYPE_SCALE: TypeRole[] = [
  {
    token: "display-hero",
    note: "Instrument Serif 400 · clamp(3rem,7vw,5.5rem) · lh 1.05 · -0.005em",
    style: { fontFamily: DISPLAY, fontWeight: 400, fontSize: "clamp(3rem,7vw,5.5rem)", lineHeight: 1.05, letterSpacing: "-0.005em" },
    sample: "İyi kurulmuş bir deneme",
    turn: " — ve sizinki.",
  },
  {
    token: "display-1",
    note: "Instrument Serif 400 · clamp(2rem,3.6vw,3rem) · lh 1.08 · -0.005em",
    style: { fontFamily: DISPLAY, fontWeight: 400, fontSize: "clamp(2rem,3.6vw,3rem)", lineHeight: 1.08, letterSpacing: "-0.005em" },
    sample: "Web ve ürün stüdyosu",
  },
  {
    token: "display-2",
    note: "Instrument Serif 400 · clamp(1.75rem,3vw,2.5rem) · lh 1.1",
    style: { fontFamily: DISPLAY, fontWeight: 400, fontSize: "clamp(1.75rem,3vw,2.5rem)", lineHeight: 1.1 },
    sample: "Üretimde",
  },
  {
    token: "display-3",
    note: "Instrument Serif 400 · clamp(1.5rem,2.2vw,2rem) · lh 1.1",
    style: { fontFamily: DISPLAY, fontWeight: 400, fontSize: "clamp(1.5rem,2.2vw,2rem)", lineHeight: 1.1 },
    sample: "Hizmetler ve çalışma biçimi",
  },
  {
    token: "figure-xl",
    note: "Geist Mono 400 tnum · clamp(2rem,4vw,3rem) · lh 1 · -0.02em",
    style: { fontSize: "clamp(2rem,4vw,3rem)", lineHeight: 1, letterSpacing: "-0.02em" },
    sample: "05",
    mono: true,
  },
  {
    token: "lede",
    note: "Hanken 400 · clamp(1.08rem,1.4vw,1.22rem) · lh 1.6",
    style: { fontFamily: BODY, fontWeight: 400, fontSize: "clamp(1.08rem,1.4vw,1.22rem)", lineHeight: 1.6, textWrap: "pretty" },
    sample: "Kendi ürünlerimizi kurar, aynı özenle sizinkini de kurarız.",
  },
  {
    token: "body",
    note: "Hanken 400 · 17px · lh 1.65 · text-wrap pretty",
    style: { fontFamily: BODY, fontWeight: 400, fontSize: "17px", lineHeight: 1.65, textWrap: "pretty" },
    sample:
      "Her iş aynı yerden geçer: tasarlanır, kurulur ve yayına alınır. Sonrasında da bakımını üstleniriz.",
  },
  {
    token: "body-sm",
    note: "Hanken 400 · 0.92rem · lh 1.55",
    style: { fontFamily: BODY, fontWeight: 400, fontSize: "0.92rem", lineHeight: 1.55 },
    sample: "Sözleşmeler tek akışta hazırlanır, imzalanır ve arşivlenir.",
  },
  {
    token: "ui",
    note: "Hanken 500 · 0.95rem · lh 1",
    style: { fontFamily: BODY, fontWeight: 500, fontSize: "0.95rem", lineHeight: 1 },
    sample: "İşler · Hizmetler · Stüdyo",
  },
  {
    token: "eyebrow",
    note: "Hanken 500 · 0.82rem · lh 1.3 · 0.04em · sentence case",
    style: { fontFamily: BODY, fontWeight: 500, fontSize: "0.82rem", lineHeight: 1.3, letterSpacing: "0.04em" },
    sample: "web ve ürün stüdyosu",
  },
  {
    token: "label-xs",
    note: "Hanken 500 · 0.8rem · lh 1.4",
    style: { fontFamily: BODY, fontWeight: 500, fontSize: "0.8rem", lineHeight: 1.4 },
    sample: "sürüm · platform · yığın",
  },
  {
    token: "figure-inline",
    note: "Geist Mono 400 tnum · 0.84rem · -0.01em",
    style: { fontSize: "0.84rem", letterSpacing: "-0.01em" },
    sample: "v2.4 · 4,9 · <48 sa",
    mono: true,
  },
];

interface Swatch {
  name: string;
  fill: string;
  /** demonstrate translucent hairline tokens as a border on a paper-2 field */
  border?: boolean;
}

const SWATCHES: Swatch[] = [
  { name: "--paper", fill: "var(--paper)" },
  { name: "--paper-2", fill: "var(--paper-2)" },
  { name: "--ink", fill: "var(--ink)" },
  { name: "--ink-soft", fill: "var(--ink-soft)" },
  { name: "--ever", fill: "var(--ever)" },
  { name: "--ever-hover", fill: "var(--ever-hover)" },
  { name: "--line", fill: "var(--line)", border: true },
  { name: "--line-strong", fill: "var(--line-strong)", border: true },
  { name: "--ring-media", fill: "var(--ring-media)", border: true },
];

const sectionStyle: CSSProperties = {
  borderBottom: "1px solid var(--line)",
  paddingBottom: "48px",
  marginBottom: "48px",
};

const capStyle: CSSProperties = { marginBottom: "16px" };

export default async function SpecimenPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Lang };

  return (
    <div className="wrap text-ink" style={{ paddingTop: "48px", paddingBottom: "120px" }}>
      <p className="mono text-ink-soft" style={{ marginBottom: "8px" }}>
        dev / specimen — internal only · {lang}
      </p>
      <h1 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: "clamp(2rem,3.6vw,3rem)", lineHeight: 1.08, marginBottom: "48px" }}>
        Quiet-editorial system specimen
      </h1>

      {/* ---------- Color tokens ---------- */}
      <section style={sectionStyle}>
        <p className="mono text-ink-soft" style={capStyle}>
          color tokens — 01 §Color (toggle theme to verify both columns)
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "16px",
          }}
        >
          {SWATCHES.map((s) => (
            <div key={s.name}>
              <div
                className="rounded-media"
                style={{
                  height: "64px",
                  background: s.border ? "var(--paper-2)" : s.fill,
                  border: s.border ? `2px solid ${s.fill}` : "1px solid var(--line)",
                }}
              />
              <p className="mono text-ink-soft" style={{ marginTop: "8px" }}>
                {s.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Type scale ---------- */}
      <section style={sectionStyle}>
        <p className="mono text-ink-soft" style={capStyle}>
          type scale — 01 §Typography (display-hero → figure-inline)
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {TYPE_SCALE.map((role) => (
            <div key={role.token}>
              <p className="mono text-ink-soft" style={{ marginBottom: "8px" }}>
                {role.token} · {role.note}
              </p>
              <p className={role.mono ? "mono text-ink" : "text-ink"} style={role.style}>
                {role.sample}
                {role.turn ? (
                  <em style={{ fontStyle: "italic", color: "var(--ever)" }}>{role.turn}</em>
                ) : null}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- TR glyph coverage (latin-ext) ---------- */}
      <section style={sectionStyle}>
        <p className="mono text-ink-soft" style={capStyle}>
          Turkish glyph coverage — latin-ext (no tofu)
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <p className="text-ink" style={{ fontFamily: DISPLAY, fontSize: "1.75rem" }}>
            İĞŞÇÖÜ ığşçöü — display
          </p>
          <p className="text-ink" style={{ fontFamily: BODY, fontSize: "1.5rem" }}>
            İĞŞÇÖÜ ığşçöü — body
          </p>
          <p className="mono text-ink" style={{ fontSize: "1.25rem" }}>
            İĞŞÇÖÜ ığşçöü — mono
          </p>
        </div>
      </section>

      {/* ---------- Motion ---------- */}
      <section style={sectionStyle}>
        <p className="mono text-ink-soft" style={capStyle}>
          motion — 01 §Motion (entrance reveal · press scale(0.97) · stat figure)
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", alignItems: "flex-start" }}>
          {/* entrance reveal — shown in its settled state (opacity 1 / no translate) */}
          <div>
            <p className="mono text-ink-soft" style={{ marginBottom: "10px" }}>
              entrance reveal · 240ms --ease-out · fade + 8px rise
            </p>
            <div
              className="reveal rounded-media border-line text-ink"
              style={{ border: "1px solid var(--line)", background: "var(--paper-2)", padding: "20px 24px", maxWidth: "280px", fontFamily: BODY }}
            >
              Bölümler görünüme girdikçe belirir.
            </div>
          </div>

          {/* press feedback — real native button, scale(0.97) on :active */}
          <div>
            <p className="mono text-ink-soft" style={{ marginBottom: "10px" }}>
              press · scale(0.97) · --dur-fast --ease-out
            </p>
            <button
              type="button"
              className="rounded-ui active:[transform:scale(0.97)]"
              style={{
                minHeight: "44px",
                padding: "0.62rem 1.2rem",
                background: "var(--ever)",
                color: "var(--paper)",
                fontFamily: BODY,
                fontWeight: 500,
                fontSize: "0.95rem",
                transitionProperty: "transform",
                transitionDuration: "var(--dur-fast)",
                transitionTimingFunction: "var(--ease-out)",
              }}
            >
              Teklif al
            </button>
          </div>

          {/* stat figure — figure-xl, final value (odometer SSR/reduced-motion state) */}
          <div>
            <p className="mono text-ink-soft" style={{ marginBottom: "10px" }}>
              stat figure · figure-xl · Geist Mono tnum
            </p>
            <span
              className="mono text-ink"
              style={{ fontSize: "clamp(2rem,4vw,3rem)", lineHeight: 1, letterSpacing: "-0.02em" }}
            >
              05
            </span>
          </div>
        </div>
      </section>

      {/* ---------- Plate sample ---------- */}
      <section>
        <p className="mono text-ink-soft" style={capStyle}>
          plate — 01 §Iconography & imagery (typographic + browser-shot)
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "32px", maxWidth: "760px" }}>
          {/* typographic plate — aspect 3/2 mat, centered status/rule/name/claim */}
          <div>
            <div
              className="rounded-media border-line"
              style={{
                background: "var(--paper-2)",
                border: "1px solid var(--line)",
                padding: "clamp(10px,1.3vw,16px)",
              }}
            >
              <div
                className="rounded-shot"
                style={{
                  aspectRatio: "3 / 2",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "24px",
                  textAlign: "center",
                }}
              >
                <span className="text-ink-soft" style={{ fontFamily: BODY, fontWeight: 500, fontSize: "0.8rem", letterSpacing: "0.02em" }}>
                  Geliştirmede
                </span>
                <span style={{ width: "34px", height: "1px", background: "var(--line-strong)" }} />
                <span className="text-ink" style={{ fontFamily: DISPLAY, fontSize: "1.6rem", lineHeight: 1.1 }}>
                  Oasis and Mind
                </span>
                <span className="text-ink-soft" style={{ fontFamily: BODY, fontSize: "0.92rem", lineHeight: 1.5, maxWidth: "34ch" }}>
                  Sakinlik ve odak için tasarlanan bir mobil uygulama.
                </span>
              </div>
            </div>
            <p className="text-ink-soft" style={{ fontFamily: BODY, fontSize: "0.92rem", marginTop: "10px" }}>
              Tipografik plaka — ekran görüntüsü olmayan ürün.
            </p>
          </div>

          {/* browser-shot plate — real screenshot, inset ring drawn as a border overlay */}
          <div>
            <div
              className="rounded-media border-line"
              style={{
                background: "var(--paper-2)",
                border: "1px solid var(--line)",
                padding: "clamp(10px,1.3vw,16px)",
              }}
            >
              <div className="rounded-shot" style={{ position: "relative", overflow: "hidden", aspectRatio: "894 / 754" }}>
                <Image
                  src="/screens/akitle/editor-1600.png"
                  alt="Akitle sözleşme editörü"
                  width={894}
                  height={754}
                  sizes="(max-width: 760px) 100vw, 380px"
                  style={{ display: "block", width: "100%", height: "auto" }}
                />
                {/* 1px inset ring (border overlay, not a shadow — borders-only depth strategy) */}
                <span
                  aria-hidden
                  className="rounded-shot"
                  style={{ position: "absolute", inset: 0, border: "1px solid var(--ring-media)", pointerEvents: "none" }}
                />
              </div>
            </div>
            <p className="text-ink-soft" style={{ fontFamily: BODY, fontSize: "0.92rem", marginTop: "10px" }}>
              Tarayıcı plakası — gerçek ekran görüntüsü, sahte tarayıcı çerçevesi yok.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

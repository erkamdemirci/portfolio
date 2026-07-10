import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowLink } from "@/components/ui/arrow-link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { StatusChip } from "@/components/ui/status-chip";
import { FleetReadout } from "@/components/telemetry/fleet-readout";
import { StatRail } from "@/components/telemetry/stat-rail";
import { BrowserBay } from "@/components/frames/browser-bay";
import { PhoneBay } from "@/components/frames/phone-bay";
import { UnitCard, ExternalTelLink } from "@/components/fleet/unit-card";
import { ReservedBay } from "@/components/fleet/reserved-bay";
import type { Lang } from "@/lib/i18n/routes";

/**
 * Dev specimen page — 01-design-system.md §Typography (scale table, TR coverage check),
 * §Color tokens. Internal-only reference render; excluded from search indexing.
 *
 * Every type-role token from the 01 scale table, a swatch grid for every color primitive,
 * an İĞŞÇÖÜ/ığşçöü render in both faces (both weights), and the İ/I uppercase-transform
 * probe ("işler · istanbul" -> "İŞLER · İSTANBUL" under lang="tr").
 */

export const metadata: Metadata = {
  robots: "noindex",
};

interface TypeRole {
  token: string;
  face: string;
  size: string;
  tracking: string;
  lineHeight: string;
  notes: string;
  sample: string;
}

const TYPE_SCALE: TypeRole[] = [
  {
    token: "display (h1)",
    face: "GS 700",
    size: "clamp(2.8rem, 6vw, 5rem)",
    tracking: "-0.03em",
    lineHeight: "1.02",
    notes: "one per page; text-wrap: balance",
    sample: "Filo, canlı yayında.",
  },
  {
    token: "h2",
    face: "GS 600",
    size: "clamp(1.9rem, 3.4vw, 2.7rem)",
    tracking: "-0.025em",
    lineHeight: "1.08",
    notes: "section heads",
    sample: "Sipariş üzerine inşa.",
  },
  {
    token: "h3-lg",
    face: "GS 600",
    size: "clamp(1.5rem, 2.4vw, 2rem)",
    tracking: "-0.02em",
    lineHeight: "1.6",
    notes: "bay/CTA card titles",
    sample: "Slot 06 boş.",
  },
  {
    token: "stat",
    face: "GS 600",
    size: "2rem",
    tracking: "-0.02em",
    lineHeight: "1.1",
    notes: "stat-rail values; tabular-nums",
    sample: "05",
  },
  {
    token: "h3",
    face: "GS 600",
    size: "1.2rem",
    tracking: "-0.015em",
    lineHeight: "1.6",
    notes: "card titles",
    sample: "Akitle",
  },
  {
    token: "h3-sm",
    face: "GS 600",
    size: "1.05rem",
    tracking: "-0.01em",
    lineHeight: "1.6",
    notes: "service cell titles",
    sample: "Ürün tasarımı",
  },
  {
    token: "lede",
    face: "GS 400",
    size: "1.1rem",
    tracking: "0",
    lineHeight: "1.6",
    notes: "color --steel; max-width 52ch",
    sample: "Beş ürünümüz filoda — dördü üretimde, biri geliştirmede.",
  },
  {
    token: "body",
    face: "GS 400",
    size: "1rem",
    tracking: "0",
    lineHeight: "1.6",
    notes: "16px base; text-wrap: pretty",
    sample: "Müşteri işleri aynı atölyeden geçer: tasarlanır, inşa edilir, sevk edilir.",
  },
  {
    token: "btn",
    face: "GS 600",
    size: "0.95rem",
    tracking: "0",
    lineHeight: "1.6",
    notes: "buttons, arrow-links",
    sample: "Proje başlat",
  },
  {
    token: "ui",
    face: "GS 500",
    size: "0.9rem",
    tracking: "0",
    lineHeight: "1.6",
    notes: "nav links",
    sample: "İşler · Hizmetler · Stüdyo",
  },
  {
    token: "body-sm",
    face: "GS 400",
    size: "0.875rem",
    tracking: "0",
    lineHeight: "1.6",
    notes: "card/service body copy",
    sample: "Kira sözleşmeleri tek akışta hazırlanır, imzalanır ve arşivlenir.",
  },
  {
    token: "meta",
    face: "GS 400",
    size: "0.8125rem",
    tracking: "0",
    lineHeight: "1.4",
    notes: "panel row roles",
    sample: "Namaz vakti yol arkadaşı",
  },
];

const MONO_DATA = {
  token: "mono-data",
  face: "Plex Mono 400/500",
  size: "0.8125rem (13px)",
  tracking: "+0.03em (kv) / +0.06em (telemetry)",
  lineHeight: "1.7",
  notes: "versions, URLs, kv values; tabular-nums",
  sample: "v2.4 · akitle.com ↗ · 4,9",
};

const MONO_LABEL = {
  token: "mono-label",
  face: "Plex Mono 400/500",
  size: "0.75rem (12px)",
  tracking: "+0.07–0.08em",
  lineHeight: "1.6–1.75",
  notes: "UPPERCASE eyebrow/label layer — 12px floor, never smaller",
  sample: "unit-02 · akitle",
};

interface ColorToken {
  name: string;
  var: string;
}

const COLOR_TOKENS: ColorToken[] = [
  { name: "--carbon", var: "var(--carbon)" },
  { name: "--carbon-2", var: "var(--carbon-2)" },
  { name: "--carbon-3", var: "var(--carbon-3)" },
  { name: "--bright", var: "var(--bright)" },
  { name: "--steel", var: "var(--steel)" },
  { name: "--amber", var: "var(--amber)" },
  { name: "--amber-hi", var: "var(--amber-hi)" },
  { name: "--amber-text", var: "var(--amber-text)" },
  { name: "--amber-mark", var: "var(--amber-mark)" },
  { name: "--on-amber", var: "var(--on-amber)" },
  { name: "--focus", var: "var(--focus)" },
  { name: "--line", var: "var(--line)" },
  { name: "--line-strong", var: "var(--line-strong)" },
  { name: "--ring", var: "var(--ring)" },
  { name: "--glow", var: "var(--glow)" },
  { name: "--skel", var: "var(--skel)" },
  { name: "--skel-2", var: "var(--skel-2)" },
];

const sectionStyle: CSSProperties = {
  borderBottom: "1px solid var(--line)",
  paddingBottom: "40px",
  marginBottom: "40px",
};

export default async function SpecimenPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Lang };

  return (
    <div
      className="wrap"
      style={{ paddingTop: "48px", paddingBottom: "104px", color: "var(--bright)" }}
    >
      <p className="mono" style={{ color: "var(--steel)", marginBottom: "8px" }}>
        dev / specimen — internal only
      </p>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "40px" }}>
        Token &amp; type specimen
      </h1>

      {/* ---------- TR glyph coverage — General Sans ---------- */}
      <section style={sectionStyle}>
        <p className="mono" style={{ color: "var(--steel)", marginBottom: "12px" }}>
          tr coverage — general sans
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: "1.5rem" }}>
          İĞŞÇÖÜ ığşçöü
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "1.5rem" }}>
          İĞŞÇÖÜ ığşçöü
        </p>
      </section>

      {/* ---------- TR glyph coverage — IBM Plex Mono ---------- */}
      <section style={sectionStyle}>
        <p className="mono" style={{ color: "var(--steel)", marginBottom: "12px" }}>
          tr coverage — ibm plex mono
        </p>
        <p style={{ fontFamily: "var(--font-mono)", fontWeight: 400, fontSize: "1.25rem" }}>
          İĞŞÇÖÜ ığşçöü
        </p>
        <p style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "1.25rem" }}>
          İĞŞÇÖÜ ığşçöü
        </p>
      </section>

      {/* ---------- İ/I uppercase-transform probe ---------- */}
      <section style={sectionStyle}>
        <p className="mono" style={{ color: "var(--steel)", marginBottom: "12px" }}>
          uppercase transform probe (lang-dependent İ/I casing)
        </p>
        <span className="mono" style={{ color: "var(--amber-text)" }}>
          işler · istanbul
        </span>
      </section>

      {/* ---------- Type scale ---------- */}
      <section style={sectionStyle}>
        <p className="mono" style={{ color: "var(--steel)", marginBottom: "20px" }}>
          type scale
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {TYPE_SCALE.map((role) => (
            <div key={role.token}>
              <p
                className="mono"
                style={{ color: "var(--steel)", marginBottom: "6px" }}
              >
                {role.token} · {role.face} · {role.size} · tracking {role.tracking} · lh{" "}
                {role.lineHeight} — {role.notes}
              </p>
              <p
                style={{
                  fontSize: role.size,
                  letterSpacing: role.tracking,
                  lineHeight: role.lineHeight,
                  fontWeight: role.face.includes("700")
                    ? 700
                    : role.face.includes("600")
                      ? 600
                      : role.face.includes("500")
                        ? 500
                        : 400,
                }}
              >
                {role.sample}
              </p>
            </div>
          ))}

          {[MONO_DATA, MONO_LABEL].map((role) => (
            <div key={role.token}>
              <p
                className="mono"
                style={{ color: "var(--steel)", marginBottom: "6px" }}
              >
                {role.token} · {role.face} · {role.size} · tracking {role.tracking} · lh{" "}
                {role.lineHeight} — {role.notes}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8125rem",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {role.sample}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Color token swatches ---------- */}
      <section style={sectionStyle}>
        <p className="mono" style={{ color: "var(--steel)", marginBottom: "20px" }}>
          color primitives
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "16px",
          }}
        >
          {COLOR_TOKENS.map((token) => (
            <div key={token.name}>
              <div
                style={{
                  height: "64px",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--line)",
                  background: token.var,
                }}
              />
              <p className="mono" style={{ color: "var(--steel)", marginTop: "8px" }}>
                {token.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- T08 — primitives gallery (C7/C8/C9/C11) ---------- */}
      <section>
        <p className="mono" style={{ color: "var(--steel)", marginBottom: "20px" }}>
          primitives — button / arrow-link / eyebrow / status chip (C7/C8/C9/C11)
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          <div>
            <p className="mono" style={{ color: "var(--steel)", marginBottom: "12px" }}>
              C7 — button
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
              <Button variant="accent" href="/tr/dev/specimen">
                Proje başlat
              </Button>
              <Button variant="ghost" href="/tr/dev/specimen">
                Filoyu gör
              </Button>
              <Button variant="accent" disabled>
                Proje başlat
              </Button>
              <Button variant="ghost" disabled>
                Filoyu gör
              </Button>
            </div>
          </div>

          <div>
            <p className="mono" style={{ color: "var(--steel)", marginBottom: "12px" }}>
              C8 — arrow-link
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "center" }}>
              <ArrowLink href="/iletisim" variant="forward">
                Proje başlat
              </ArrowLink>
              <ArrowLink href="/" variant="back">
                Ana sayfaya dön
              </ArrowLink>
            </div>
          </div>

          <div>
            <p className="mono" style={{ color: "var(--steel)", marginBottom: "12px" }}>
              C9 — section eyebrow
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Eyebrow variant="hero">
                DMRC — ürün stüdyosu · Bursa, TR → dünya geneli
              </Eyebrow>
              <Eyebrow variant="section">01 — işler / üretimde kanıt</Eyebrow>
              <Eyebrow variant="section">03 — iletişim / slot-06</Eyebrow>
            </div>
          </div>

          <div>
            <p className="mono" style={{ color: "var(--steel)", marginBottom: "12px" }}>
              C11 — status chip
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <StatusChip variant="live" flag="CANLI" meta="v2.4 · iOS/Android" />
              <StatusChip variant="in-dev" flag="GELİŞTİRMEDE" meta="v0.9 · Mobil" />
              <StatusChip variant="no-signal" flag="SİNYAL YOK" />
              <div style={{ maxWidth: "220px" }}>
                <StatusChip
                  variant="in-dev"
                  flag="GELİŞTİRME AŞAMASINDA"
                  meta="OASIS AND MIND"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- T13 — Fleet Readout panel + stat rail (C12/C13) ---------- */}
      <section>
        <p className="mono" style={{ color: "var(--steel)", marginBottom: "20px" }}>
          telemetry — fleet readout panel / stat rail (C12/C13)
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          <div style={{ maxWidth: "480px" }}>
            <p className="mono" style={{ color: "var(--steel)", marginBottom: "12px" }}>
              C12 — fleet readout panel
            </p>
            <FleetReadout
              lang={lang}
              ariaLabel={lang === "tr" ? "Filo durumu okuması" : "Fleet status readout"}
            />
          </div>

          <div>
            <p className="mono" style={{ color: "var(--steel)", marginBottom: "12px" }}>
              C13 — stat rail
            </p>
            <StatRail
              ariaLabel={lang === "tr" ? "Stüdyo rakamları" : "Studio numbers"}
              cells={
                lang === "tr"
                  ? [
                      { value: "05", caption: "ürün filoda" },
                      { value: "02", caption: "platform — web & mobil" },
                      { value: "<48", suffix: "sa", caption: "yeni briflere yanıt" },
                      { value: "01", caption: "açık slot — slot-06" },
                    ]
                  : [
                      { value: "05", caption: "products in the fleet" },
                      { value: "02", caption: "platforms — web & mobile" },
                      { value: "<48", suffix: "h", caption: "reply on new briefs" },
                      { value: "01", caption: "open slot — bay-06" },
                    ]
              }
            />
          </div>
        </div>
      </section>

      {/* ---------- T15 — Screen frames (C15/C16/C17) ---------- */}
      <section>
        <p className="mono" style={{ color: "var(--steel)", marginBottom: "20px" }}>
          frames — browser bay / phone bay / slot pattern (C15/C16/C17)
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          <div style={{ maxWidth: "560px" }}>
            <p className="mono" style={{ color: "var(--steel)", marginBottom: "12px" }}>
              C15 — browser bay (span-7, slot state)
            </p>
            <div
              style={{
                border: "1px solid var(--line)",
                borderRadius: "var(--radius)",
                overflow: "hidden",
                background: "var(--carbon-2)",
              }}
            >
              <BrowserBay
                domain="akitle.com"
                span={7}
                slot={{
                  bars: [
                    { top: "20px", left: "20px", width: "26%", height: "14px" },
                    { top: "52px", left: "20px", width: "44%", height: "70%", tone: "skel-2" },
                    { top: "52px", right: "20px", width: "30%", height: "36px" },
                    { top: "104px", right: "20px", width: "12%", height: "8px", tone: "amber" },
                    { top: "130px", right: "20px", width: "30%", height: "44%" },
                  ],
                  label:
                    lang === "tr"
                      ? {
                          title: "Ekran yuvası",
                          body: "Akitle sözleşme editörü: satır kalemleri, imza rozeti, koyu yeşil serif vurgular",
                        }
                      : {
                          title: "Screen slot",
                          body: "Akitle contract editor — line items, signed badge, deep-green serif accents",
                        },
                }}
              />
            </div>
          </div>

          <div style={{ maxWidth: "560px" }}>
            <p className="mono" style={{ color: "var(--steel)", marginBottom: "12px" }}>
              C16 — phone bay (slot state)
            </p>
            <div
              style={{
                border: "1px solid var(--line)",
                borderRadius: "var(--radius)",
                overflow: "hidden",
                background: "var(--carbon-2)",
                paddingBottom: "0",
              }}
            >
              <PhoneBay
                slot={{
                  bars: [
                    { top: "36px", left: "14%", width: "44%", height: "12px" },
                    { top: "58px", left: "14%", width: "72%", height: "34px", tone: "skel-2" },
                    { top: "106px", left: "14%", width: "26%", height: "7px", tone: "amber" },
                    { top: "128px", left: "14%", width: "72%", height: "52px" },
                  ],
                  label:
                    lang === "tr"
                      ? {
                          title: "Ekran yuvası",
                          body: "VAAZ ana ekranı — namaz vakti geri sayımı, yeşil-altın serif arayüz",
                        }
                      : {
                          title: "Screen slot",
                          body: "VAAZ home — prayer-times countdown, green-gold serif UI",
                        },
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- T16 — Unit card + BAY-06 reserved card (C14/C18) ---------- */}
      <section>
        <p className="mono" style={{ color: "var(--steel)", marginBottom: "20px" }}>
          fleet — unit card / reserved bay (C14/C18)
        </p>

        <div className="grid grid-cols-12 gap-5">
          <UnitCard
            span={7}
            unitLabel="unit-02 · AKITLE"
            status={{ variant: "live", flag: "CANLI", meta: "v3.1 · Web" }}
            frame={
              <BrowserBay
                domain="akitle.com"
                span={7}
                slot={{
                  bars: [
                    { top: "20px", left: "20px", width: "26%", height: "14px" },
                    { top: "52px", left: "20px", width: "44%", height: "70%", tone: "skel-2" },
                    { top: "52px", right: "20px", width: "30%", height: "36px" },
                    { top: "104px", right: "20px", width: "12%", height: "8px", tone: "amber" },
                    { top: "130px", right: "20px", width: "30%", height: "44%" },
                  ],
                  label:
                    lang === "tr"
                      ? { title: "Ekran yuvası", body: "Akitle sözleşme editörü" }
                      : { title: "Screen slot", body: "Akitle contract editor" },
                }}
              />
            }
            href={lang === "tr" ? "/isler/akitle" : "/en/work/akitle"}
            title="Akitle"
            description={
              lang === "tr"
                ? "Kira sözleşmeleri tek akışta hazırlanır, imzalanır ve arşivlenir."
                : "Rental contracts drafted, signed, and archived in a single flow."
            }
            telLine1={<ExternalTelLink href="https://akitle.com" label="akitle.com" />}
            telLine2={lang === "tr" ? "kira sözleşmesi SaaS'ı" : "rental contract SaaS"}
          />

          <UnitCard
            span={5}
            unitLabel="unit-01 · VAAZ"
            status={{ variant: "live", flag: "CANLI", meta: "v2.4 · iOS/Android" }}
            frame={
              <PhoneBay
                slot={{
                  bars: [
                    { top: "36px", left: "14%", width: "44%", height: "12px" },
                    { top: "58px", left: "14%", width: "72%", height: "34px", tone: "skel-2" },
                    { top: "106px", left: "14%", width: "26%", height: "7px", tone: "amber" },
                  ],
                  label:
                    lang === "tr"
                      ? { title: "Ekran yuvası", body: "VAAZ ana ekranı" }
                      : { title: "Screen slot", body: "VAAZ home" },
                }}
              />
            }
            href={lang === "tr" ? "/isler/vaaz" : "/en/work/vaaz"}
            title="VAAZ"
            description={
              lang === "tr"
                ? "Namaz vakitleri, günlük takip ve vaaz içeriği tek yol arkadaşında."
                : "Prayer times, daily tracking, and sermon content in one companion app."
            }
            telLine1={<ExternalTelLink href="https://getvaaz.com" label="getvaaz.com" />}
            telLine2={
              lang === "tr" ? (
                <>
                  <b>4,9</b> mağaza puanı
                </>
              ) : (
                <>
                  <b>4.9</b> store rating
                </>
              )
            }
          />

          <ReservedBay
            slotLabel={lang === "tr" ? "slot-06 · rezerve" : "bay-06 · reserved"}
            capacityLabel={lang === "tr" ? "kapasite: 01" : "capacity: 01"}
            title={lang === "tr" ? "Ürününüz burada çalışır." : "Your product runs here."}
            body={
              lang === "tr"
                ? "Aynı anda az sayıda müşteri işi alırız ve kendi ürünümüz gibi işletiriz — aynı yığın, aynı izleme, aynı standartlar."
                : "We take on a few client builds at a time and run them like our own — same stack, same monitoring, same standards."
            }
            ctaHref={lang === "tr" ? "/iletisim" : "/en/contact"}
            ctaLabel={lang === "tr" ? "Proje başlat" : "Start a project"}
            note={lang === "tr" ? "sıradaki slot: müsait" : "next slot: available"}
          />
        </div>
      </section>
    </div>
  );
}

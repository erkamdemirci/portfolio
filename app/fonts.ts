import { Instrument_Serif, Hanken_Grotesk, Geist_Mono } from "next/font/google";

// 01-design-system.md §Typography (Loading plan). Two faces + one data mono, all
// self-hosted via next/font/google, subsets latin + latin-ext (TR-glyph-verified in
// 03-design-research.md). Preload exactly ONE face — the one rendering the LCP element
// (the hero serif h1) — never two (the T32 LCP-competition lesson).

export const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-instrument-serif",
  preload: true, // the hero h1 = LCP text element
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const hanken = Hanken_Grotesk({
  // variable wght axis; CSS uses 400/500/700
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-hanken",
  preload: false, // not the LCP element; swap + metric-matched fallback
  fallback: ["-apple-system", "Segoe UI", "Helvetica Neue", "sans-serif"],
});

export const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-geist-mono",
  preload: false, // figures only, never LCP
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

import { Archivo, Geist_Mono } from "next/font/google";

// 2026-07 "Tek Kalemde" scroll-film system. ONE expressive family — Archivo variable with
// BOTH axes (wght 100–900 via variable default, wdth 62–125 via `axes`) — carries the whole
// site: colossal expanded display (font-stretch ~125%), plain body (100%), and condensed
// caps labels (~75%). One family, many widths mirrors the brand story (one hand, many
// trades) and keeps exactly one preloaded font file competing for the LCP. Geist Mono stays
// as the data/figures voice. Subsets latin + latin-ext (TR İ/ı/ğ/ş verified glyph coverage).

export const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-archivo",
  axes: ["wdth"],
  preload: true, // the hero display text = LCP element; the ONLY preloaded face
  fallback: ["-apple-system", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});

export const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-geist-mono",
  preload: false, // figures only, never LCP
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

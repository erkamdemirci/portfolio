import { describe, expect, it } from "vitest";
import { getAlternate, localePairs, toInternal } from "./routes";

describe("toInternal", () => {
  it("maps a TR case-study path to its internal /tr route (English canonical segment)", () => {
    expect(toInternal("/isler/vaaz")).toEqual({ lang: "tr", path: "/tr/work/vaaz" });
  });

  it("maps an EN case-study path to its internal /en route (identity)", () => {
    expect(toInternal("/en/work/vaaz")).toEqual({ lang: "en", path: "/en/work/vaaz" });
  });

  it("rewrites an unknown non-/en path into the tr segment, verbatim", () => {
    expect(toInternal("/olmayan-rota")).toEqual({ lang: "tr", path: "/tr/olmayan-rota" });
  });

  it("rewrites an unknown /en path into the en segment, verbatim", () => {
    expect(toInternal("/en/olmayan")).toEqual({ lang: "en", path: "/en/olmayan" });
  });

  it("maps TR root to /tr", () => {
    expect(toInternal("/")).toEqual({ lang: "tr", path: "/tr" });
  });

  it("maps EN root to /en", () => {
    expect(toInternal("/en")).toEqual({ lang: "en", path: "/en" });
  });

  const bypassPaths = [
    "/_next/static/chunks/main.js",
    "/_next/image?url=%2Fscreens%2Fvaaz.png&w=640&q=75",
    "/favicon.ico",
    "/icon.svg",
    "/robots.txt",
    "/sitemap.xml",
    "/og-tr.png",
    "/og-en.png",
    "/screens/akitle/editor-1600.png",
    "/some-file.pdf",
  ];

  it.each(bypassPaths)("leaves asset/meta path %s untouched (returns null)", (path) => {
    expect(toInternal(path)).toBeNull();
  });
});

describe("getAlternate", () => {
  it.each(localePairs)("maps $tr <-> $en bidirectionally", ({ tr, en }) => {
    expect(getAlternate(tr)).toBe(en);
    expect(getAlternate(en)).toBe(tr);
  });

  it("unknown TR path falls back to the EN home (03 §G3)", () => {
    expect(getAlternate("/olmayan")).toBe("/en");
  });

  it("unknown EN path falls back to the TR home (03 §G3)", () => {
    expect(getAlternate("/en/olmayan")).toBe("/");
  });
});

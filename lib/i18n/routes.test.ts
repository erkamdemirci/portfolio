import { describe, expect, it } from "vitest";
import { getAlternate, localePairs, toInternal } from "./routes";
import { generateStaticParams as blogIndexParams } from "@/app/[lang]/blog/page";
import { generateStaticParams as blogSlugParams } from "@/app/[lang]/blog/[slug]/page";

describe("toInternal", () => {
  it("maps the TR services path to its internal /tr route (English canonical segment)", () => {
    expect(toInternal("/hizmetler")).toEqual({ lang: "tr", path: "/tr/services" });
  });

  it("maps the TR contact path to its internal /tr route", () => {
    expect(toInternal("/iletisim")).toEqual({ lang: "tr", path: "/tr/contact" });
  });

  it("maps an EN public path to its internal /en route (identity)", () => {
    expect(toInternal("/en/services")).toEqual({ lang: "en", path: "/en/services" });
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

  it("treats a bare /tr request as internal identity (symmetric with /en)", () => {
    expect(toInternal("/tr")).toEqual({ lang: "tr", path: "/tr" });
  });

  it("treats an already-internal /tr/* path (e.g. the dev-only OG route) as identity, not double-prefixed", () => {
    expect(toInternal("/tr/dev/og")).toEqual({ lang: "tr", path: "/tr/dev/og" });
  });

  const bypassPaths = [
    "/_next/static/chunks/main.js",
    "/_next/image?url=%2Fportrait%2Ferkam-demirci.jpg&w=640&q=75",
    "/favicon.ico",
    "/icon.svg",
    "/robots.txt",
    "/sitemap.xml",
    "/og-tr.png",
    "/og-en.png",
    "/portrait/erkam-demirci.jpg",
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

// The retired work/studio URLs never re-enter the locale table — next.config.ts owns their
// 301s, and the proxy must keep treating them as unknown TR paths (catch-all → 404) if a
// request ever slips past the redirect layer.
describe("retired routes (2026-07 scroll-film rebuild)", () => {
  it("the locale table is exactly home + services + contact", () => {
    expect(localePairs).toEqual([
      { tr: "/", en: "/en" },
      { tr: "/hizmetler", en: "/en/services" },
      { tr: "/iletisim", en: "/en/contact" },
    ]);
  });

  it("a retired TR path is unknown to the table (falls through verbatim)", () => {
    expect(toInternal("/isler")).toEqual({ lang: "tr", path: "/tr/isler" });
    expect(toInternal("/studyo")).toEqual({ lang: "tr", path: "/tr/studyo" });
  });
});

// T52 — blog is TR-only (A11). The bare-TR fall-through in toInternal already resolves /blog and
// /blog/<slug> to the tr segment (no localePairs entry, no routes.ts change); these lock that in.
describe("blog routing (TR-only, A11)", () => {
  it("resolves bare /blog to the internal tr segment", () => {
    expect(toInternal("/blog")).toEqual({ lang: "tr", path: "/tr/blog" });
  });

  it("resolves /blog/<slug> to the internal tr segment", () => {
    expect(toInternal("/blog/kurumsal-web-sitesi-nasil-olmali")).toEqual({
      lang: "tr",
      path: "/tr/blog/kurumsal-web-sitesi-nasil-olmali",
    });
  });

  it("blog has no EN pair — getAlternate('/blog') falls back to the EN home (F3)", () => {
    expect(getAlternate("/blog")).toBe("/en");
    expect(getAlternate("/blog/kurumsal-web-sitesi-nasil-olmali")).toBe("/en");
  });

  it("the frozen pairs never include a blog path", () => {
    expect(localePairs.some((p) => p.tr.includes("/blog") || p.en.includes("/blog"))).toBe(false);
  });

  it("blog index generateStaticParams is TR-only (no EN params generated)", () => {
    expect(blogIndexParams()).toEqual([{ lang: "tr" }]);
  });

  it("blog [slug] generateStaticParams yields TR-only params for every post (no EN)", () => {
    const params = blogSlugParams();
    expect(params).toHaveLength(10);
    expect(params.every((p) => p.lang === "tr")).toBe(true);
    expect(params.some((p) => p.lang === "en")).toBe(false);
  });
});

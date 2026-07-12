import { describe, expect, it } from "vitest";
import { getAlternate, localePairs, toInternal } from "./routes";
import { generateStaticParams as blogIndexParams } from "@/app/[lang]/blog/page";
import { generateStaticParams as blogSlugParams } from "@/app/[lang]/blog/[slug]/page";

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

  it("rewrites a public-facing garbage case-study slug (/isler/<unknown>) into the tr segment, verbatim (falls through to the app/[lang]/[...rest] catch-all — 'isler' is not a real internal segment name)", () => {
    expect(toInternal("/isler/nonexistent-product")).toEqual({ lang: "tr", path: "/tr/isler/nonexistent-product" });
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

  it("treats an already-internal /tr/* path (e.g. a dev-only route not in the public table) as identity, not double-prefixed", () => {
    expect(toInternal("/tr/dev/specimen")).toEqual({ lang: "tr", path: "/tr/dev/specimen" });
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

  it("the 10 frozen pairs never include a blog path", () => {
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

import { describe, expect, it } from "vitest";
import { alternatesForPath, metaFor, sitemap } from "@/lib/seo";

/**
 * T30 behavior tests, updated for the 2026-07 scroll-film rebuild: the meta table carries
 * exactly home / services / contact (the surviving, ranking rows — byte-identical to the
 * pre-rebuild table), and the sitemap surface is 17 URLs (6 frozen + /blog + 10 posts).
 */

describe("metaFor", () => {
  it("home/tr keeps the ranking title verbatim", () => {
    expect(metaFor("home", "tr").title).toBe("Kurumsal Web Sitesi ve Mobil Uygulama Ajansı | DMRC");
  });

  it("home/en keeps the ranking title verbatim", () => {
    expect(metaFor("home", "en").title).toBe("Corporate Website & Mobile App Studio | DMRC");
  });

  it("services/tr keeps the ranking row verbatim", () => {
    expect(metaFor("services", "tr").title).toBe("Web Tasarım ve Geliştirme Hizmetleri | DMRC");
  });

  it("contact/en keeps the ranking row verbatim", () => {
    expect(metaFor("contact", "en").title).toBe("Contact — Get a Quote | DMRC");
    expect(metaFor("contact", "en").description).toBe(
      "Get a quote for your website or mobile app project. Bursa-based DMRC replies to every brief within 48 hours. Reach us by email or the form.",
    );
  });
});

describe("alternatesForPath", () => {
  it("resolves both locale URLs + x-default from the TR public path", () => {
    expect(alternatesForPath("/hizmetler")).toEqual({
      tr: "/hizmetler",
      en: "/en/services",
      xDefault: "/hizmetler",
    });
  });

  it("resolves the same pair from the EN public path (symmetric lookup)", () => {
    expect(alternatesForPath("/en/services")).toEqual({
      tr: "/hizmetler",
      en: "/en/services",
      xDefault: "/hizmetler",
    });
  });

  it("x-default is always the TR url — matches first-visit behavior (03 named decision)", () => {
    expect(alternatesForPath("/")).toEqual({ tr: "/", en: "/en", xDefault: "/" });
  });

  it("a retired route is no longer part of the alternates surface", () => {
    expect(alternatesForPath("/isler")).toBeNull();
    expect(alternatesForPath("/en/studio")).toBeNull();
  });
});

describe("sitemap", () => {
  const entries = sitemap();
  const blog = entries.filter((e) => e.url.includes("/blog"));
  const frozen = entries.filter((e) => !e.url.includes("/blog"));

  it("returns exactly 17 entries (6 frozen + /blog + 10 posts)", () => {
    expect(entries).toHaveLength(17);
  });

  it("keeps the 6 frozen entries with both tr + en alternates (A1)", () => {
    expect(frozen).toHaveLength(6);
    for (const entry of frozen) {
      expect(entry.languages.tr).toMatch(/^https:\/\//);
      expect(entry.languages.en).toMatch(/^https:\/\//);
    }
  });

  it("adds 11 blog entries (/blog + 10 posts) with tr + x-default only — no en (A11)", () => {
    expect(blog).toHaveLength(11);
    for (const entry of blog) {
      expect(entry.languages.tr).toMatch(/^https:\/\//);
      expect(entry.languages["x-default"]).toMatch(/^https:\/\//);
      expect(entry.languages.en).toBeUndefined();
    }
  });

  it("no sitemap entry contains /dev/, /api/, the 404 route, or a retired URL", () => {
    for (const entry of entries) {
      expect(entry.url).not.toContain("/dev/");
      expect(entry.url).not.toContain("/api/");
      expect(entry.url).not.toContain("olmayan");
      expect(entry.url).not.toContain("/isler");
      expect(entry.url).not.toContain("/studyo");
      expect(entry.url).not.toContain("/work");
      expect(entry.url).not.toContain("/studio");
    }
  });
});

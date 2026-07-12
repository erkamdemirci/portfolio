import { describe, expect, it } from "vitest";
import { alternatesForPath, metaFor, sitemap } from "@/lib/seo";

/**
 * T30 (04-tasks.md; 03-screens-and-flows.md §Meta, titles & OG). Written FIRST, seen failing
 * (module missing), per the card's own TDD ordering.
 */

describe("metaFor", () => {
  it("home/tr matches the 03 §SEO table verbatim", () => {
    expect(metaFor("home", "tr").title).toBe("Kurumsal Web Sitesi ve Mobil Uygulama Ajansı | DMRC");
  });

  it("home/en matches the 03 §SEO table verbatim", () => {
    expect(metaFor("home", "en").title).toBe("Corporate Website & Mobile App Studio | DMRC");
  });

  it("work/tr matches the 03 §SEO table verbatim", () => {
    expect(metaFor("work", "tr").title).toBe("İşler — Web ve Mobil Ürünlerimiz | DMRC");
  });

  it("vaaz/tr description carries the 4,9 formatting (criterion 10d)", () => {
    expect(metaFor("vaaz", "tr").description).toBe(
      "VAAZ; namaz vakitleri, günlük takip ve vaaz içeriğini tek uygulamada sunar. iOS ve Android'de canlı, iki mağazada 4,9 puan. DMRC ürünü.",
    );
  });

  it("vaaz/en description carries the 4.9 formatting (criterion 10d)", () => {
    expect(metaFor("vaaz", "en").description).toBe(
      "VAAZ brings prayer times, daily tracking, and sermon content into one app. Live on iOS and Android, rated 4.9 on both stores. A DMRC product.",
    );
  });

  it("contact/en matches the 03 §SEO table verbatim (de-themed contact copy)", () => {
    expect(metaFor("contact", "en").title).toBe("Contact — Get a Quote | DMRC");
    expect(metaFor("contact", "en").description).toBe(
      "Get a quote for your website or mobile app project. Bursa-based DMRC replies to every brief within 48 hours. Reach us by email or the form.",
    );
  });
});

describe("alternatesForPath", () => {
  it("resolves both locale URLs + x-default from the TR public path", () => {
    expect(alternatesForPath("/isler/vaaz")).toEqual({
      tr: "/isler/vaaz",
      en: "/en/work/vaaz",
      xDefault: "/isler/vaaz",
    });
  });

  it("resolves the same pair from the EN public path (symmetric lookup)", () => {
    expect(alternatesForPath("/en/work/vaaz")).toEqual({
      tr: "/isler/vaaz",
      en: "/en/work/vaaz",
      xDefault: "/isler/vaaz",
    });
  });

  it("x-default is always the TR url — matches first-visit behavior (03 named decision)", () => {
    expect(alternatesForPath("/")).toEqual({ tr: "/", en: "/en", xDefault: "/" });
  });
});

describe("sitemap", () => {
  const entries = sitemap();

  it("returns exactly 20 entries (10 route pairs x 2 locales)", () => {
    expect(entries).toHaveLength(20);
  });

  it("every entry carries both language alternates", () => {
    for (const entry of entries) {
      expect(entry.languages.tr).toMatch(/^https:\/\//);
      expect(entry.languages.en).toMatch(/^https:\/\//);
    }
  });

  it("no sitemap entry contains /dev/ or the 404 route", () => {
    for (const entry of entries) {
      expect(entry.url).not.toContain("/dev/");
      expect(entry.url).not.toContain("olmayan");
    }
  });
});

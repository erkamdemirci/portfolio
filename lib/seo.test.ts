import { describe, expect, it } from "vitest";
import { alternatesForPath, metaFor, sitemap } from "@/lib/seo";

/**
 * T30 (04-tasks.md; 03-screens-and-flows.md §Meta, titles & OG). Written FIRST, seen failing
 * (module missing), per the card's own TDD ordering.
 */

describe("metaFor", () => {
  it("home/tr matches the 03 §Meta table verbatim", () => {
    expect(metaFor("home", "tr").title).toBe("DMRC — Ürün stüdyosu · Web & mobil");
  });

  it("home/en matches the 03 §Meta table verbatim", () => {
    expect(metaFor("home", "en").title).toBe("DMRC — Product studio · Web & mobile");
  });

  it("work/tr matches the 03 §Meta table verbatim", () => {
    expect(metaFor("work", "tr").title).toBe("İşler — DMRC");
  });

  it("vaaz/tr description carries the 4,9 formatting (criterion 10d)", () => {
    expect(metaFor("vaaz", "tr").description).toBe(
      "Namaz vakti yol arkadaşı: vakitler, takip, vaaz içeriği. unit-01: v2.4, iOS/Android, iki mağazada 4,9.",
    );
  });

  it("vaaz/en description carries the 4.9 formatting (criterion 10d)", () => {
    expect(metaFor("vaaz", "en").description).toBe(
      "A prayer companion: times, tracking, sermon content. unit-01: v2.4, iOS/Android, 4.9 across both stores.",
    );
  });

  it("contact/en matches the 03 §Meta table verbatim (Bay 06 / bay-06 register)", () => {
    expect(metaFor("contact", "en").title).toBe("Contact — DMRC");
    expect(metaFor("contact", "en").description).toBe(
      "Bay 06 is empty. Send your brief by email; a written reply within 48 hours.",
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

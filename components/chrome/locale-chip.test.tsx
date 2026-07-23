import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { tr } from "@/lib/i18n/dictionaries/tr";
import { LocaleChip } from "./locale-chip";

/**
 * C5 — Locale chip render-proxy tests (pinned exception, 05-verification.md §Test
 * strategy): mocked usePathname/useParams, asserting the href mapping against T04's
 * route table (lib/i18n/routes.ts), including the unknown-path -> other-locale-home rule.
 */

const mocks = vi.hoisted(() => ({
  usePathname: vi.fn(),
  useParams: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: mocks.usePathname,
  useParams: mocks.useParams,
}));

describe("LocaleChip", () => {
  it("maps the TR services path to its EN counterpart", () => {
    mocks.usePathname.mockReturnValue("/hizmetler");
    mocks.useParams.mockReturnValue({ lang: "tr" });
    render(<LocaleChip dict={tr.localeChip} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/en/services");
  });

  it("maps the EN services path back to its TR counterpart", () => {
    mocks.usePathname.mockReturnValue("/en/services");
    mocks.useParams.mockReturnValue({ lang: "en" });
    render(<LocaleChip dict={tr.localeChip} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/hizmetler");
  });

  it("unknown TR path falls back to the EN home (03 §G3)", () => {
    mocks.usePathname.mockReturnValue("/olmayan");
    mocks.useParams.mockReturnValue({ lang: "tr" });
    render(<LocaleChip dict={tr.localeChip} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/en");
  });
});

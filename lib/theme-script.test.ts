import { beforeEach, describe, expect, it } from "vitest";
import { THEME_SCRIPT } from "./theme-script";

/**
 * Pre-hydration theme script — 02-components.md §C4 behavior contract; 01-design-system.md
 * §Direction & mode map (LIGHT canonical, localStorage, no-flash). LIGHT is now the
 * no-preference default (01 §Platform mapping — the default flips from dark to light);
 * a stored `dark` preference still wins. The script string is evaluated exactly as it will
 * run inline before hydration; it must set `data-theme` from a stored preference, or resolve
 * to the light canonical when none exists — always writing the attribute pre-paint.
 */
describe("THEME_SCRIPT (pre-hydration, no-flash)", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
  });

  it("resolves the light canonical when no stored preference exists (first visit)", () => {
    // Safe test-only eval: THEME_SCRIPT is a fixed, repo-owned constant (not user input)
    // and this test exists specifically to prove the exact string injected into the
    // page's inline <script> behaves correctly when a browser runs it verbatim.
    // eslint-disable-next-line no-eval
    eval(THEME_SCRIPT);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("keeps the stored 'dark' preference (dark still wins over the light default)", () => {
    localStorage.setItem("theme", "dark");
    // eslint-disable-next-line no-eval
    eval(THEME_SCRIPT);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("sets data-theme from a stored 'light' preference before hydration", () => {
    localStorage.setItem("theme", "light");
    // eslint-disable-next-line no-eval
    eval(THEME_SCRIPT);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("writes the attribute pre-paint (synchronously on eval)", () => {
    expect(document.documentElement.getAttribute("data-theme")).toBeNull();
    // eslint-disable-next-line no-eval
    eval(THEME_SCRIPT);
    expect(document.documentElement.getAttribute("data-theme")).not.toBeNull();
  });
});

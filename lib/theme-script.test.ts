import { beforeEach, describe, expect, it } from "vitest";
import { THEME_SCRIPT } from "./theme-script";

/**
 * Pre-hydration theme script — 02-components.md §C4 behavior contract, 01 §Direction &
 * mode map (dark-first, localStorage, no-flash). The script string is evaluated exactly
 * as it will run inline before hydration; it must set `data-theme` from a stored
 * preference, or explicitly stay on the dark canonical when none exists.
 */
describe("THEME_SCRIPT (pre-hydration, no-flash)", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
  });

  it("sets data-theme from a stored 'light' preference before hydration", () => {
    localStorage.setItem("theme", "light");
    // Safe test-only eval: THEME_SCRIPT is a fixed, repo-owned constant (not user input)
    // and this test exists specifically to prove the exact string injected into the
    // page's inline <script> behaves correctly when a browser runs it verbatim.
    // eslint-disable-next-line no-eval
    eval(THEME_SCRIPT);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("leaves dark canonical when no stored preference exists (first visit)", () => {
    // Safe test-only eval — see comment above.
    // eslint-disable-next-line no-eval
    eval(THEME_SCRIPT);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { tr } from "@/lib/i18n/dictionaries/tr";
import { ModeChip } from "./mode-chip";

/**
 * ThemeToggle / ModeChip behavior contract (02-components.md §ThemeToggle): a 44×44
 * icon-only button that flips `data-theme` on <html> and persists localStorage("theme").
 * The accessible name is the ACTION (localized, state-reflecting), never `aria-pressed`
 * (mode cycler, not a pressed toggle). Icon-only — the old visible "mod / koyu" text chip
 * is gone. Light is the canonical default (T03), so with no stored theme the button offers
 * switching TO dark.
 */
describe("ModeChip", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("is icon-only (no visible mode text) and its label reflects the light default", () => {
    render(<ModeChip dict={tr.modeChip} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", tr.modeChip.ariaToDark);
    expect(button).not.toHaveTextContent("mod");
  });

  it("click switches to dark: sets data-theme, persists localStorage, flips the aria-label", async () => {
    const user = userEvent.setup();
    render(<ModeChip dict={tr.modeChip} />);
    const button = screen.getByRole("button");
    await user.click(button);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(button).toHaveAttribute("aria-label", tr.modeChip.ariaToLight);
  });

  it("second click returns to light", async () => {
    const user = userEvent.setup();
    render(<ModeChip dict={tr.modeChip} />);
    const button = screen.getByRole("button");
    await user.click(button);
    await user.click(button);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
    expect(button).toHaveAttribute("aria-label", tr.modeChip.ariaToDark);
  });

  it("reads an existing dark data-theme on mount and offers switching to light", () => {
    document.documentElement.setAttribute("data-theme", "dark");
    render(<ModeChip dict={tr.modeChip} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", tr.modeChip.ariaToLight);
  });

  it("never sets aria-pressed (mode cycler, not a pressed toggle)", () => {
    render(<ModeChip dict={tr.modeChip} />);
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-pressed");
  });
});

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { tr } from "@/lib/i18n/dictionaries/tr";
import { ModeChip } from "./mode-chip";

/**
 * C4 — Mode chip behavior contract (02-components.md §C4): toggles `data-theme` on
 * <html>, persists localStorage("theme"), accessible name is the ACTION (not a pressed
 * state) and flips with it, never `aria-pressed` (mode cycler, not a pressed toggle).
 */
describe("ModeChip", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the TR dark label by default", () => {
    render(<ModeChip dict={tr.modeChip} />);
    expect(screen.getByRole("button")).toHaveTextContent("mod / koyu");
  });

  it("click switches to light: sets data-theme, persists localStorage, flips the label", async () => {
    const user = userEvent.setup();
    render(<ModeChip dict={tr.modeChip} />);
    await user.click(screen.getByRole("button"));
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
    expect(screen.getByRole("button")).toHaveTextContent("mod / açık");
  });

  it("second click returns to dark", async () => {
    const user = userEvent.setup();
    render(<ModeChip dict={tr.modeChip} />);
    const button = screen.getByRole("button");
    await user.click(button);
    await user.click(button);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(button).toHaveTextContent("mod / koyu");
  });

  it("aria-label announces the action and flips with state", async () => {
    const user = userEvent.setup();
    render(<ModeChip dict={tr.modeChip} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Açık temaya geç");
    await user.click(button);
    expect(button).toHaveAttribute("aria-label", "Koyu temaya geç");
  });

  it("never sets aria-pressed (mode cycler, not a pressed toggle)", () => {
    render(<ModeChip dict={tr.modeChip} />);
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-pressed");
  });
});

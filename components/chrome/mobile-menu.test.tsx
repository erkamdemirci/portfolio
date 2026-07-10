import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { tr } from "@/lib/i18n/dictionaries/tr";
import { MobileMenu } from "./mobile-menu";

/**
 * C6 — Mobile menu keyboard/ARIA/focus contract (02-components.md §C6, binding):
 * aria-expanded/aria-controls + hidden label; open moves focus to the first nav link;
 * Tab traps inside the panel; Escape closes and returns focus to the trigger; the closed
 * panel is `display:none` (never `visibility`); body scroll locks while open; the
 * background container (main content) gets `inert` while open.
 */

const navItems = [
  { href: "/isler", label: "İşler" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/studyo", label: "Stüdyo" },
];

function renderMenu() {
  // Mirror the real app-shell: <header>(trigger+portaled panel)</header><main>...</main>
  // as siblings under <body>, so the "background inert" contract has something real to
  // target — MobileMenu portals its panel straight to document.body.
  const main = document.createElement("main");
  main.id = "main";
  main.textContent = "background content";
  document.body.appendChild(main);

  const utils = render(
    <MobileMenu lang="tr" dict={tr} navItems={navItems} contactHref="/iletisim" />,
  );

  return { ...utils, main };
}

describe("MobileMenu", () => {
  afterEach(() => {
    // cleanup() unmounts the React tree (incl. the portaled panel) properly first, so
    // React never tries to remove a node we've already ripped out from under it; only
    // then remove the raw <main> sibling that renderMenu() appended by hand.
    cleanup();
    document.body.querySelectorAll("main").forEach((el) => el.remove());
    document.body.style.overflow = "";
  });

  it("trigger has aria-expanded=false, aria-controls='site-menu', and a hidden 'Menü' label", () => {
    renderMenu();
    const trigger = screen.getByRole("button", { name: "Menü" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-controls", "site-menu");
  });

  it("opening sets aria-expanded=true and moves focus to the first nav link", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole("button", { name: "Menü" }));
    expect(screen.getByRole("button", { name: "Menü" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "İşler" })).toHaveFocus();
  });

  it("traps Tab: from the last focusable it cycles back to the first (the close button)", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole("button", { name: "Menü" }));
    const localeLink = screen.getByRole("link", { name: tr.localeChip.ariaSwitch });
    localeLink.focus();
    expect(localeLink).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Kapat" })).toHaveFocus();
  });

  it("Escape closes the panel and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    renderMenu();
    const trigger = screen.getByRole("button", { name: "Menü" });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("the closed panel uses display:none (Tailwind `hidden`), never visibility", () => {
    renderMenu();
    const panel = document.getElementById("site-menu");
    expect(panel).toHaveClass("hidden");
    expect(panel?.className ?? "").not.toMatch(/invisible/);
  });

  it("locks body scroll on open and restores it on close", async () => {
    const user = userEvent.setup();
    renderMenu();
    expect(document.body.style.overflow).not.toBe("hidden");
    await user.click(screen.getByRole("button", { name: "Menü" }));
    expect(document.body.style.overflow).toBe("hidden");
    await user.keyboard("{Escape}");
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("marks the background container inert while open, and lifts it on close", async () => {
    const user = userEvent.setup();
    const { main } = renderMenu();
    expect(main).not.toHaveAttribute("inert");
    await user.click(screen.getByRole("button", { name: "Menü" }));
    expect(main).toHaveAttribute("inert");
    await user.keyboard("{Escape}");
    expect(main).not.toHaveAttribute("inert");
  });
});

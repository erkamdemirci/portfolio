import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "./button";

/**
 * Button render smoke (02-components.md §Button). Confirms the two shipped variants render
 * with their token classes, the element type follows `href` (link vs action), and the
 * build-green `accent` alias resolves to the primary evergreen fill.
 */
describe("Button", () => {
  afterEach(() => {
    cleanup();
  });

  it("primary renders a <button> with the evergreen fill + touch-floor sizing", () => {
    render(<Button variant="primary">Teklif al</Button>);
    const button = screen.getByRole("button", { name: "Teklif al" });
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveClass("bg-ever");
    expect(button).toHaveClass("text-paper");
    expect(button).toHaveClass("min-h-11");
  });

  it("ghost renders the hairline outline variant", () => {
    render(<Button variant="ghost">İşleri gör</Button>);
    const button = screen.getByRole("button", { name: "İşleri gör" });
    expect(button).toHaveClass("border-line");
    expect(button).toHaveClass("text-ink");
    expect(button).not.toHaveClass("bg-ever");
  });

  it("renders an <a> when href is given (navigation, not action)", () => {
    render(
      <Button variant="primary" href="/iletisim">
        Teklif al
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Teklif al" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/iletisim");
  });

  it("accent is a build-green alias for the primary evergreen fill", () => {
    render(<Button variant="accent">Teklif al</Button>);
    expect(screen.getByRole("button", { name: "Teklif al" })).toHaveClass("bg-ever");
  });
});

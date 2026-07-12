import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ContactActions } from "./contact-actions";

/**
 * T49 (04-tasks.md; 02 §ContactActions; 01-environment A10). Written FIRST, seen failing
 * (component missing). Email always renders; Call/WhatsApp render ONLY when their config value
 * is non-empty, and an unavailable action is ABSENT from the DOM — never a disabled placeholder
 * (05 manual-check #5). `full` shows all available actions; `compact` (inside ContactBand full)
 * is email + whatsapp only.
 */

const LABELS = { email: "E-posta", call: "Ara", whatsapp: "WhatsApp" };
const EMAIL = "hello@erkamdemirci.com";

describe("ContactActions", () => {
  afterEach(cleanup);

  it("renders only Email when phone/whatsapp are unset (A10) — no Call/WhatsApp nodes", () => {
    render(<ContactActions config={{ email: EMAIL }} labels={LABELS} variant="full" />);
    expect(screen.getByRole("link", { name: "E-posta" })).toHaveAttribute("href", `mailto:${EMAIL}`);
    expect(screen.queryByRole("link", { name: "Ara" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "WhatsApp" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("renders all three (full) when phone + whatsapp are configured", () => {
    render(
      <ContactActions
        config={{ email: EMAIL, phone: "+905551112233", whatsapp: "905551112233" }}
        labels={LABELS}
        variant="full"
      />,
    );
    expect(screen.getByRole("link", { name: "E-posta" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ara" })).toHaveAttribute("href", "tel:+905551112233");
    const wa = screen.getByRole("link", { name: "WhatsApp" });
    expect(wa.getAttribute("href")).toContain("wa.me/905551112233");
    expect(wa.getAttribute("href")).toContain("text=");
  });

  it("compact omits Call even when phone is set (email + whatsapp only)", () => {
    render(
      <ContactActions
        config={{ email: EMAIL, phone: "+905551112233", whatsapp: "905551112233" }}
        labels={LABELS}
        variant="compact"
      />,
    );
    expect(screen.getByRole("link", { name: "E-posta" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Ara" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "WhatsApp" })).toBeInTheDocument();
  });

  it("unavailable actions are absent — no disabled placeholder nodes", () => {
    const { container } = render(<ContactActions config={{ email: EMAIL }} labels={LABELS} variant="full" />);
    expect(container.querySelector("[disabled]")).toBeNull();
    expect(container.querySelector('[aria-disabled="true"]')).toBeNull();
  });
});

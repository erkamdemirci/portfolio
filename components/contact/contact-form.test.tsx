import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ContactForm, type ContactFormCopy } from "./contact-form";

/**
 * T48 (04-tasks.md; 02 §ContactForm; 03 §Flows F1). Written FIRST, seen failing (component
 * missing). The state machine paths: per-field invalid (inline text + aria-invalid, no POST) ·
 * KVKK unchecked blocks submit (message, no POST) · pending (disabled + aria-busy) · error →
 * prefilled-mailto fallback · honeypot filled → silent success (no POST). Copy is a fixture so
 * the test is locale-agnostic (the page passes the real dict slice, T50).
 */

const COPY: ContactFormCopy = {
  nameLabel: "Ad soyad",
  emailLabel: "E-posta",
  phoneLabel: "Telefon (opsiyonel)",
  messageLabel: "Mesaj",
  hint: "projenizi kısaca anlatın",
  submit: "Gönder",
  sending: "Gönderiliyor…",
  nameRequired: "Ad soyadınızı girin.",
  emailInvalid: "Geçerli bir e-posta girin.",
  messageRequired: "Kısa bir mesaj yazın.",
  mailtoSubject: "Web projesi teklif talebi",
  successTitle: "Aldık, teşekkürler.",
  successBody: "48 saat içinde yanıtlıyoruz.",
  errorText: "Gönderilemedi — doğrudan e-posta ile ulaşabilirsiniz:",
  reset: "Başka bir mesaj gönder",
  kvkkConsent: "KVKK kapsamında işlenmesini onaylıyorum.",
  kvkkDisclosureToggle: "Aydınlatma metnini oku",
  kvkkDisclosure: "Aydınlatma metni gövdesi.",
  kvkkBlocked: "Devam etmek için aydınlatma onayını işaretleyin.",
};

const EMAIL = "hello@erkamdemirci.com";

let fetchMock: ReturnType<typeof vi.fn>;

async function fillRequired(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Ad soyad"), "Ada Lovelace");
  await user.type(screen.getByLabelText("E-posta"), "ada@example.com");
  await user.type(screen.getByLabelText("Mesaj"), "Kurumsal web sitesi projesi.");
}

describe("ContactForm", () => {
  beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("shows per-field invalid messages + aria-invalid and never POSTs", async () => {
    const user = userEvent.setup();
    render(<ContactForm copy={COPY} email={EMAIL} />);
    await user.click(screen.getByRole("checkbox")); // consent on, so KVKK is not the blocker
    await user.click(screen.getByRole("button", { name: "Gönder" }));

    expect(screen.getByText("Geçerli bir e-posta girin.")).toBeInTheDocument();
    expect(screen.getByLabelText("E-posta")).toHaveAttribute("aria-invalid", "true");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("blocks submit while KVKK is unchecked, shows the consent message, no POST", async () => {
    const user = userEvent.setup();
    render(<ContactForm copy={COPY} email={EMAIL} />);
    await fillRequired(user);
    await user.click(screen.getByRole("button", { name: "Gönder" }));

    expect(
      screen.getByText("Devam etmek için aydınlatma onayını işaretleyin."),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("disables submit + sets aria-busy while the request is pending", async () => {
    const user = userEvent.setup();
    fetchMock.mockReturnValue(new Promise(() => {})); // never resolves — holds the pending state
    render(<ContactForm copy={COPY} email={EMAIL} />);
    await fillRequired(user);
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Gönder" }));

    await waitFor(() => {
      const btn = screen.getByRole("button", { name: "Gönderiliyor…" });
      expect(btn).toBeDisabled();
      expect(btn).toHaveAttribute("aria-busy", "true");
    });
  });

  it("on a non-200 response shows the error text + a prefilled mailto fallback", async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue({ ok: false, status: 503 });
    render(<ContactForm copy={COPY} email={EMAIL} />);
    await fillRequired(user);
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Gönder" }));

    expect(await screen.findByText(COPY.errorText)).toBeInTheDocument();
    const link = screen.getByRole("link");
    const href = link.getAttribute("href") ?? "";
    expect(href).toContain("mailto:hello@erkamdemirci.com");
    expect(href).toContain(encodeURIComponent("ada@example.com"));
  });

  it("succeeds silently (no POST) when the honeypot is filled (F1 step 6)", async () => {
    const user = userEvent.setup();
    const { container } = render(<ContactForm copy={COPY} email={EMAIL} />);
    const honeypot = container.querySelector('input[name="website"]') as HTMLInputElement;
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot).toHaveAttribute("aria-hidden", "true");
    fireEvent.change(honeypot, { target: { value: "http://spam.example" } });
    await user.click(screen.getByRole("button", { name: "Gönder" }));

    expect(await screen.findByText(COPY.successTitle)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("replaces the form with the success panel on a 200", async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue({ ok: true, status: 200 });
    render(<ContactForm copy={COPY} email={EMAIL} />);
    await fillRequired(user);
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Gönder" }));

    expect(await screen.findByText(COPY.successTitle)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Gönder" })).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * T47 (04-tasks.md; 03 §Flows F1; 01-environment A12). Written FIRST, seen failing (route
 * module missing), per the card's TDD ordering. Four paths: valid→200 (sends), missing
 * required→400 (no send), honeypot filled→200 silent (no send), SMTP env unset→503.
 *
 * nodemailer is mocked so no real transport/connection is created; `sendMail` is the spy the
 * "no send" assertions check. `vi.hoisted` makes the spy available to the hoisted vi.mock factory.
 */

const { sendMail } = vi.hoisted(() => ({ sendMail: vi.fn() }));
vi.mock("nodemailer", () => ({
  default: { createTransport: vi.fn(() => ({ sendMail })) },
}));

import { POST } from "./route";

function post(body: unknown): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const VALID = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "",
  message: "Kurumsal bir web sitesi projesi için görüşmek istiyorum.",
  website: "", // honeypot — empty for a real submission
};

const SMTP_KEYS = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "CONTACT_TO"] as const;
function setSmtp() {
  process.env.SMTP_HOST = "smtp.example.com";
  process.env.SMTP_PORT = "587";
  process.env.SMTP_USER = "postmaster@example.com";
  process.env.SMTP_PASS = "secret";
  process.env.CONTACT_TO = "hello@erkamdemirci.com";
}
function clearSmtp() {
  for (const key of SMTP_KEYS) delete process.env[key];
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    sendMail.mockReset();
    sendMail.mockResolvedValue({ messageId: "test" });
    clearSmtp();
  });
  afterEach(clearSmtp);

  it("sends and returns 200 for a valid payload when SMTP is configured", async () => {
    setSmtp();
    const res = await POST(post(VALID));
    expect(res.status).toBe(200);
    expect(sendMail).toHaveBeenCalledTimes(1);
  });

  it("returns 400 when a required field is missing — no send", async () => {
    setSmtp();
    const res = await POST(post({ ...VALID, email: "" }));
    expect(res.status).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("silently accepts a filled honeypot with 200 and never sends (F1 step 6)", async () => {
    setSmtp(); // configured, so a wrong implementation WOULD send — makes the assertion meaningful
    const res = await POST(post({ ...VALID, website: "http://spam.example" }));
    expect(res.status).toBe(200);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("returns 503 not-configured when SMTP env is unset — no send (A12)", async () => {
    const res = await POST(post(VALID)); // SMTP cleared in beforeEach
    expect(res.status).toBe(503);
    expect(sendMail).not.toHaveBeenCalled();
  });
});

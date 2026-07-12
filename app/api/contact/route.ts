import nodemailer from "nodemailer";

/**
 * Contact form endpoint (03 §Flows F1; 01-environment A12; 02 §ContactForm). POST-only,
 * Node runtime (nodemailer needs Node APIs), noindex + never in the sitemap (a POST endpoint).
 *
 * Order of checks is deliberate:
 *  1. Honeypot first — a filled hidden `website` field means a bot; accept SILENTLY (200, no
 *     validation error) so the bot gets no signal, and never send (F1 step 6).
 *  2. Required-field validation (server mirror of the ContactForm gate) → 400.
 *  3. SMTP env gate — until `SMTP_*` is provisioned on the VPS the route returns the honest
 *     503 not-configured signal; the client then shows the prefilled-mailto fallback, never a
 *     fake success (A12). Email + form are functional day one via that fallback.
 */

export const runtime = "nodejs";

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
  website?: unknown; // honeypot
}

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: Record<string, unknown>, status: number): Response {
  return Response.json(body, { status });
}

export async function POST(request: Request): Promise<Response> {
  let data: ContactPayload;
  try {
    data = (await request.json()) as ContactPayload;
  } catch {
    return json({ error: "invalid" }, 400);
  }

  // 1. Honeypot — silent accept, no send (bot sees success, no real submission).
  if (isNonEmpty(data.website)) {
    return json({ ok: true }, 200);
  }

  // 2. Required fields.
  if (
    !isNonEmpty(data.name) ||
    !isNonEmpty(data.email) ||
    !EMAIL_RE.test(data.email) ||
    !isNonEmpty(data.message)
  ) {
    return json({ error: "invalid" }, 400);
  }

  // 3. SMTP configuration — the honest not-configured signal when unset.
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return json({ error: "not-configured" }, 503);
  }

  const port = Number(SMTP_PORT ?? 587);
  const to = process.env.CONTACT_TO ?? "hello@erkamdemirci.com";
  const from = process.env.CONTACT_FROM ?? SMTP_USER;
  const phoneLine = isNonEmpty(data.phone) ? `\nTelefon: ${data.phone}` : "";

  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transport.sendMail({
      to,
      from,
      replyTo: data.email,
      subject: `Yeni proje talebi — ${data.name}`,
      text: `Ad soyad: ${data.name}\nE-posta: ${data.email}${phoneLine}\n\nMesaj:\n${data.message}`,
    });
  } catch {
    return json({ error: "send-failed" }, 502);
  }

  return json({ ok: true }, 200);
}

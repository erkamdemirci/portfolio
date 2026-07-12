"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";

/**
 * ContactForm (02 §ContactForm; 03 §Flows F1). Client component posting JSON to /api/contact.
 * Full state machine: per-field invalid (inline --ink message + --line-strong border +
 * aria-invalid/aria-describedby — never color-only) · KVKK unchecked blocks submit · pending
 * (disabled + aria-busy, "Gönderiliyor…") · success (a panel REPLACES the form) · error →
 * prefilled-mailto fallback (also the SMTP-not-configured 503 path — never a fake success,
 * A12) · a filled honeypot silently succeeds without any POST (bot path, F1 step 6).
 *
 * Copy is injected (the page passes the dict slice, T50) so the component stays locale-agnostic.
 */

export interface ContactFormCopy {
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  messageLabel: string;
  hint: string;
  submit: string;
  sending: string;
  nameRequired: string;
  emailInvalid: string;
  messageRequired: string;
  mailtoSubject: string;
  successTitle: string;
  successBody: string;
  errorText: string;
  reset: string;
  kvkkConsent: string;
  kvkkDisclosureToggle: string;
  kvkkDisclosure: string;
  kvkkBlocked: string;
}

interface ContactFormProps {
  copy: ContactFormCopy;
  email: string;
}

type Status = "idle" | "pending" | "success" | "error";

interface FieldErrors {
  name?: boolean;
  email?: boolean;
  message?: boolean;
  kvkk?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INPUT_BASE =
  "min-h-11 w-full rounded-ui border bg-paper px-[0.9rem] py-[0.7rem] text-[1rem] leading-[1.5] text-ink";
const LABEL = "text-[0.86rem] font-medium leading-[1.4] text-ink-soft";
const MESSAGE = "mt-1.5 text-[0.86rem] leading-[1.45] text-ink";

export function ContactForm({ copy, email }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "", // honeypot
    kvkk: false,
  });

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const kvkkRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: FieldErrors = {
      name: values.name.trim().length === 0,
      email: !EMAIL_RE.test(values.email.trim()),
      message: values.message.trim().length === 0,
      kvkk: !values.kvkk,
    };
    setErrors(next);
    if (next.name) nameRef.current?.focus();
    else if (next.email) emailRef.current?.focus();
    else if (next.message) messageRef.current?.focus();
    else if (next.kvkk) kvkkRef.current?.focus();
    return !next.name && !next.email && !next.message && !next.kvkk;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "pending") return;

    // Honeypot: a filled hidden field means a bot → show success WITHOUT a request (F1 step 6).
    if (values.website.trim().length > 0) {
      setStatus("success");
      return;
    }

    if (!validate()) return; // inline messages render; no POST

    setStatus("pending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          message: values.message,
          website: values.website,
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setValues({ name: "", email: "", phone: "", message: "", website: "", kvkk: false });
    setErrors({});
    setStatus("idle");
  }

  if (status === "success") {
    return (
      <div className="max-w-[52ch] rounded-media border border-line bg-paper-2 p-[clamp(24px,3vw,36px)]">
        <p className="font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.15] text-ink">
          {copy.successTitle}
        </p>
        <p className="mt-3 text-[1.05rem] leading-[1.6] text-ink-soft">{copy.successBody}</p>
        <div className="mt-6">
          <Button variant="ghost" type="button" onClick={reset}>
            {copy.reset}
          </Button>
        </div>
      </div>
    );
  }

  const mailtoBody =
    `${copy.nameLabel}: ${values.name}\n` +
    `${copy.emailLabel}: ${values.email}` +
    (values.phone.trim() ? `\n${copy.phoneLabel}: ${values.phone}` : "") +
    `\n\n${values.message}`;
  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(copy.mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-[42rem]">
      <div className="flex flex-col gap-[1.1rem]">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-name" className={LABEL}>
            {copy.nameLabel}
          </label>
          <input
            ref={nameRef}
            id="cf-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={errors.name || undefined}
            aria-describedby={errors.name ? "cf-name-error" : undefined}
            className={`${INPUT_BASE} ${errors.name ? "border-line-strong" : "border-line"}`}
          />
          {errors.name && (
            <p id="cf-name-error" className={MESSAGE}>
              {copy.nameRequired}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-email" className={LABEL}>
            {copy.emailLabel}
          </label>
          <input
            ref={emailRef}
            id="cf-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={errors.email || undefined}
            aria-describedby={errors.email ? "cf-email-error" : undefined}
            className={`${INPUT_BASE} ${errors.email ? "border-line-strong" : "border-line"}`}
          />
          {errors.email && (
            <p id="cf-email-error" className={MESSAGE}>
              {copy.emailInvalid}
            </p>
          )}
        </div>

        {/* Phone (optional) */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-phone" className={LABEL}>
            {copy.phoneLabel}
          </label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={`${INPUT_BASE} border-line`}
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-message" className={LABEL}>
            {copy.messageLabel}
          </label>
          <textarea
            ref={messageRef}
            id="cf-message"
            name="message"
            rows={6}
            required
            placeholder={copy.hint}
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
            aria-invalid={errors.message || undefined}
            aria-describedby={errors.message ? "cf-message-error" : undefined}
            className={`${INPUT_BASE} min-h-[8rem] resize-y ${errors.message ? "border-line-strong" : "border-line"}`}
          />
          {errors.message && (
            <p id="cf-message-error" className={MESSAGE}>
              {copy.messageRequired}
            </p>
          )}
        </div>

        {/* Honeypot — off-screen, hidden from AT + tab order (bots fill it, humans don't). */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="cf-website">Web sitesi</label>
          <input
            id="cf-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={values.website}
            onChange={(e) => set("website", e.target.value)}
          />
        </div>

        {/* KVKK consent (required) + inline disclosure */}
        <div className="flex flex-col gap-2">
          <label htmlFor="cf-kvkk" className="flex min-h-11 cursor-pointer items-start gap-3">
            <input
              ref={kvkkRef}
              id="cf-kvkk"
              name="kvkk"
              type="checkbox"
              required
              checked={values.kvkk}
              onChange={(e) => set("kvkk", e.target.checked)}
              aria-invalid={errors.kvkk || undefined}
              aria-describedby={errors.kvkk ? "cf-kvkk-error" : undefined}
              className="mt-0.5 h-6 w-6 shrink-0 rounded-xs border border-line accent-ever"
            />
            <span className="text-[0.92rem] leading-[1.5] text-ink-soft">{copy.kvkkConsent}</span>
          </label>
          <details className="ml-9">
            <summary className="cursor-pointer text-[0.86rem] text-ink-soft underline decoration-line underline-offset-4">
              {copy.kvkkDisclosureToggle}
            </summary>
            <p className="mt-2 max-w-[60ch] text-[0.86rem] leading-[1.6] text-ink-soft">
              {copy.kvkkDisclosure}
            </p>
          </details>
          {errors.kvkk && (
            <p id="cf-kvkk-error" className={MESSAGE}>
              {copy.kvkkBlocked}
            </p>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button type="submit" variant="primary" disabled={status === "pending"} aria-busy={status === "pending" || undefined}>
            {status === "pending" ? copy.sending : copy.submit}
          </Button>
          {status === "error" && (
            <span className="text-[0.92rem] leading-[1.5] text-ink">
              {copy.errorText}{" "}
              <TextLink href={mailtoHref}>{email}</TextLink>
            </span>
          )}
        </div>
      </div>
    </form>
  );
}

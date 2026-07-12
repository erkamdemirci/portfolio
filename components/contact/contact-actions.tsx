import { Mail, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig, type SiteConfig } from "@/lib/site-config";

/**
 * ContactActions (02 §ContactActions; 01-environment A10). A row of ghost Buttons — Email
 * (always), Call (when `phone` is set), WhatsApp (when `whatsapp` is set). `lib/site-config.ts`
 * is the single source of truth (also feeds JSON-LD, T67); an unavailable action is ABSENT from
 * the DOM, never a disabled placeholder. Icons stay inside lucide (Mail/Phone/MessageCircle) with
 * a visible text label — NO brand SVG (the "WhatsApp" word carries the recognition).
 *
 * Variants: `full` (contact page — every available action) · `compact` (inside ContactBand full —
 * email + whatsapp only, no Call).
 */

export interface ContactActionsLabels {
  email: string;
  call: string;
  whatsapp: string;
}

interface ContactActionsProps {
  labels: ContactActionsLabels;
  variant?: "full" | "compact";
  /** defaults to the shared site-config (single source of truth); overridable for tests. */
  config?: SiteConfig;
  /** URL-encoded into the wa.me link; TR primary. */
  whatsappGreeting?: string;
  className?: string;
}

const DEFAULT_GREETING = "Merhaba, bir proje hakkında konuşmak istiyorum.";

export function ContactActions({
  labels,
  variant = "full",
  config = siteConfig,
  whatsappGreeting = DEFAULT_GREETING,
  className,
}: ContactActionsProps) {
  const showCall = variant === "full" && Boolean(config.phone);
  const showWhatsApp = Boolean(config.whatsapp);

  return (
    <div className={`flex flex-wrap items-center gap-[0.9rem] ${className ?? ""}`}>
      <Button variant="ghost" href={`mailto:${config.email}`}>
        <Mail aria-hidden="true" size={16} strokeWidth={1.5} />
        {labels.email}
      </Button>

      {showCall && (
        <Button variant="ghost" href={`tel:${config.phone}`}>
          <Phone aria-hidden="true" size={16} strokeWidth={1.5} />
          {labels.call}
        </Button>
      )}

      {showWhatsApp && (
        <Button
          variant="ghost"
          href={`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(whatsappGreeting)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle aria-hidden="true" size={16} strokeWidth={1.5} />
          {labels.whatsapp}
        </Button>
      )}
    </div>
  );
}

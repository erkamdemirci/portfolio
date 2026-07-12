/**
 * Single source of truth for contact affordances (02-components.md §ContactActions;
 * 03-screens-and-flows.md §Contact; 01-environment A10).
 *
 * Email + the contact form work day one. `phone` and `whatsapp` ship EMPTY (undefined):
 * the Call / WhatsApp actions render ONLY when a value is filled in here — they are absent
 * from the DOM while empty, never merely hidden (05-verification.md manual-check #5). The
 * owner enables them by setting a value below, with no code change.
 */
export interface SiteConfig {
  email: string;
  phone?: string;
  whatsapp?: string;
}

export const siteConfig: SiteConfig = {
  email: "hello@erkamdemirci.com",
  // phone:    "",  // A10 — no number yet; set to enable the Call action
  // whatsapp: "",  // A10 — no number yet; set to enable the WhatsApp action
};

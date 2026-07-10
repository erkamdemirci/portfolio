import { notFound } from "next/navigation";

/**
 * Catch-all (03-screens-and-flows.md §G3; 04-tasks.md T28). Unknown public paths reach here
 * via the T04 middleware rewrite (`/olmayan-rota` -> `/tr/olmayan-rota`; `/en/olmayan` stays
 * in the `en` segment), so notFound() always throws INSIDE the [lang] segment and the nearest
 * app/[lang]/not-found.tsx boundary renders — never a root 404 (no app/not-found.tsx exists;
 * see DEVIATIONS.md for why a root-level attempt was tried and reverted: it "fixed" the
 * not-found page's no-JS completeness at the cost of forcing the ENTIRE SITE — all 24 real
 * routes — out of static generation, which is a far worse trade for a rarely-hit, noindex'd
 * error page).
 */
export default function CatchAll() {
  notFound();
}

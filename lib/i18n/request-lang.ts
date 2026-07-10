import { cache } from "react";
import type { Lang } from "./routes";

/**
 * Request-scoped locale relay for app/[lang]/not-found.tsx (T28 deviation, see
 * DEVIATIONS.md). Next.js's not-found.js convention receives no props/params (confirmed in
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md:
 * "not-found.js ... components do not accept any props"), so the 404 boundary cannot read
 * `lang` the way every other route does — but the G3 404 body must still be locale-correct
 * in the raw server-rendered HTML (curl/no-JS, 03 §G3).
 *
 * `headers()`/`cookies()` would solve this too, but both are Next.js Dynamic APIs: using
 * either inside app/[lang]/not-found.tsx (a boundary reachable from EVERY route in the
 * segment) forced the entire [lang] tree out of static generation — confirmed empirically,
 * `pnpm build` regressed all 25 routes from `●` (SSG) to `ƒ` (fully dynamic) the moment
 * `headers()` was added here. `React.cache()` is not a Next.js Dynamic API — it's a plain
 * per-request memoization primitive, so it carries no such penalty: app/[lang]/layout.tsx
 * (which DOES receive `params.lang` correctly, unaffected by the notFound() boundary swap)
 * writes the resolved lang here before rendering `{children}`; not-found.tsx reads it back.
 * Same request → same cache() call → same value, both at runtime and during `next build`'s
 * per-locale static generation pass.
 */
const getStore = cache<() => { lang: Lang }>(() => ({ lang: "tr" }));

export function setRequestLang(lang: Lang): void {
  getStore().lang = lang;
}

export function getRequestLang(): Lang {
  return getStore().lang;
}

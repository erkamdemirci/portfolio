#!/usr/bin/env node
/**
 * Locale walk (04-tasks.md T29; 00-overview.md success criterion #10b). On every TR route,
 * click C5 (the locale chip) -> assert the landed URL equals the 03 route-table's EN
 * counterpart AND documentElement.lang === 'en'; then click C5 again -> assert landing back
 * on the original TR URL with lang === 'tr'. 11/11 routes must pass.
 *
 * Usage: node scripts/locale-walk.mjs [--base http://localhost:3000]
 */
import { chromium } from "playwright";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token.startsWith("--")) {
      const key = token.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        args[key] = next;
        i++;
      } else {
        args[key] = "true";
      }
    }
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const baseUrl = args.base || process.env.SHOOT_BASE_URL || "http://localhost:3000";

// The same 03 §Locale routes table lib/i18n/routes.ts's localePairs encodes, plus the 404
// route (its C5 links to the other locale's HOME per 03 §G3, not a "counterpart" 404 URL).
const ROUTES = [
  { name: "home", tr: "/", en: "/en" },
  { name: "work", tr: "/isler", en: "/en/work" },
  { name: "vaaz", tr: "/isler/vaaz", en: "/en/work/vaaz" },
  { name: "akitle", tr: "/isler/akitle", en: "/en/work/akitle" },
  { name: "linkden", tr: "/isler/linkden", en: "/en/work/linkden" },
  { name: "characterdex", tr: "/isler/characterdex", en: "/en/work/characterdex" },
  { name: "oasis", tr: "/isler/oasis-and-mind", en: "/en/work/oasis-and-mind" },
  { name: "services", tr: "/hizmetler", en: "/en/services" },
  { name: "studio", tr: "/studyo", en: "/en/studio" },
  { name: "contact", tr: "/iletisim", en: "/en/contact" },
  { name: "404", tr: "/olmayan-rota", en: "/en" }, // G3 rule: unknown path -> other locale's home
];

function pathOf(url) {
  const u = new URL(url);
  return u.pathname === "" ? "/" : u.pathname;
}

async function walkOne(browser, route) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto(`${baseUrl}${route.tr}`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);

  // Next.js <Link> does a client-side (pushState) transition, not a full navigation — "load"
  // never fires again, so wait for the URL (and therefore <html lang>) to actually change
  // instead.
  const startUrl = page.url();
  const localeChip = page.locator('header a[hreflang]');
  await localeChip.waitFor({ state: "visible" });
  await localeChip.click();
  await page.waitForURL((url) => url.toString() !== startUrl, { timeout: 5000 });
  await page.waitForFunction((expected) => document.documentElement.lang === expected, "en", { timeout: 5000 });

  const landedEnPath = pathOf(page.url());
  const langAfterForward = await page.evaluate(() => document.documentElement.lang);

  const forwardOk = landedEnPath === route.en && langAfterForward === "en";
  if (!forwardOk) {
    await context.close();
    return {
      route: route.name,
      pass: false,
      detail: `forward: expected path=${route.en} lang=en, got path=${landedEnPath} lang=${langAfterForward}`,
    };
  }

  const enUrl = page.url();
  const backChip = page.locator('header a[hreflang]');
  await backChip.waitFor({ state: "visible" });
  await backChip.click();
  await page.waitForURL((url) => url.toString() !== enUrl, { timeout: 5000 });
  await page.waitForFunction((expected) => document.documentElement.lang === expected, "tr", { timeout: 5000 });

  const landedTrPath = pathOf(page.url());
  const langAfterBack = await page.evaluate(() => document.documentElement.lang);

  await context.close();

  // The 404 route's EN home does not link back to /olmayan-rota (there is no "back to the
  // 404 I came from" concept) — it links to the TR home, which is the correct, intentional
  // G3 behavior; only assert the forward leg's mechanical correctness for that one route.
  if (route.name === "404") {
    const backOk = landedTrPath === "/" && langAfterBack === "tr";
    return { route: route.name, pass: backOk, detail: backOk ? "" : `back: got path=${landedTrPath} lang=${langAfterBack}` };
  }

  const backOk = landedTrPath === route.tr && langAfterBack === "tr";
  return {
    route: route.name,
    pass: backOk,
    detail: backOk ? "" : `back: expected path=${route.tr} lang=tr, got path=${landedTrPath} lang=${langAfterBack}`,
  };
}

const browser = await chromium.launch();
const results = [];
for (const route of ROUTES) {
  const result = await walkOne(browser, route);
  results.push(result);
  console.log(`${result.pass ? "PASS" : "FAIL"}  ${route.name.padEnd(14)} ${route.tr}${result.detail ? "  — " + result.detail : ""}`);
}
await browser.close();

const passCount = results.filter((r) => r.pass).length;
console.log(`\nlocale-walk: ${passCount}/${results.length} routes pass`);
process.exit(passCount === results.length ? 0 : 1);

#!/usr/bin/env node
/**
 * T32 flow proofs (04-tasks.md; 00-overview.md success criterion #6; 03-screens-and-flows.md
 * §Flows F1/F2) — three independent Playwright checks:
 *
 *  1. F1 worst path: Home -> [1] click a C14 fleet card (Akitle) -> case study -> [2] G1
 *     "Hizmetler" -> offer -> [3] the offer page's own C21 "Proje başlat" -> lands on
 *     /iletisim, where a real `mailto:` anchor exists and can receive focus. Per T32's own
 *     acceptance wording ("exactly 3 clicks Home->case->services->mailto anchor focused") the
 *     3rd click is proven to land on the page carrying the mailto anchor and that anchor is
 *     proven present + focusable — it does not additionally fire the OS mail-client handler
 *     (Playwright cannot observe an OS-level mailto dispatch anyway; the DOM-level contract —
 *     an `<a href="mailto:...">` reachable in exactly 3 clicks — is what's mechanically
 *     provable and what T32 asks for).
 *  2. F2 404 recovery: /en/olmayan (unknown EN path) -> EN 404 (status 404, "NO SIGNAL" +
 *     "Nothing on this route." present) -> [1] click "See the fleet" -> /en/work. 1 click,
 *     well within the "<=2 clicks" budget.
 *  3. External-link noopener sweep: every external (different-origin http(s)) <a> across the
 *     11 pinned TR routes + an EN spot-check (home, vaaz) carries target="_blank" AND
 *     rel="noopener noreferrer".
 *
 * Usage: node scripts/flow-proofs.mjs [--base http://localhost:3000]
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

function pathOf(url) {
  const u = new URL(url);
  return u.pathname === "" ? "/" : u.pathname;
}

async function runF1(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const steps = [];

  await page.goto(`${baseUrl}/`, { waitUntil: "load" });

  // [1] click a C14 fleet card (Akitle) -> case study
  let url = page.url();
  await page.getByRole("link", { name: "Akitle", exact: true }).click();
  await page.waitForURL((u) => u.toString() !== url, { timeout: 5000 });
  steps.push({ step: 1, expect: "/isler/akitle", got: pathOf(page.url()) });

  // [2] G1 "Hizmetler" -> offer
  url = page.url();
  await page.locator("header").getByRole("link", { name: "Hizmetler", exact: true }).click();
  await page.waitForURL((u) => u.toString() !== url, { timeout: 5000 });
  steps.push({ step: 2, expect: "/hizmetler", got: pathOf(page.url()) });

  // [3] the offer page's own C21 "Proje başlat" (scoped to <main>, not the G1 header's CTA)
  url = page.url();
  await page.locator("main").getByRole("link", { name: "Proje başlat", exact: true }).click();
  await page.waitForURL((u) => u.toString() !== url, { timeout: 5000 });
  steps.push({ step: 3, expect: "/iletisim", got: pathOf(page.url()) });

  const mailto = page.locator('a[href^="mailto:"]').first();
  await mailto.waitFor({ state: "visible" });
  await mailto.focus();
  const focusedHref = await page.evaluate(() => document.activeElement?.getAttribute("href") ?? null);

  await context.close();

  const pathsOk = steps.every((s) => s.got === s.expect);
  const mailtoOk = typeof focusedHref === "string" && focusedHref.startsWith("mailto:");
  return { pass: pathsOk && mailtoOk, steps, focusedHref, interactionCount: 3 };
}

async function runF2(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const response = await page.goto(`${baseUrl}/en/olmayan`, { waitUntil: "load" });
  const status = response ? response.status() : null;

  // notFound()'s streamed shell needs client-JS hydration to paint the real C25 content (the
  // T28 RSC-payload finding documented in DEVIATIONS.md) — `waitUntil: "load"` alone races
  // ahead of that; wait for the actual heading text before reading document.body.innerText.
  await page.getByText("Nothing on this route.").waitFor({ state: "visible", timeout: 5000 });

  const bodyText = await page.evaluate(() => document.body.innerText);
  const chipOk = bodyText.includes("NO SIGNAL");
  const headingOk = bodyText.includes("Nothing on this route.");

  const url = page.url();
  await page.getByRole("link", { name: "See the fleet", exact: true }).click();
  await page.waitForURL((u) => u.toString() !== url, { timeout: 5000 });
  const landedPath = pathOf(page.url());

  await context.close();

  const pass = status === 404 && chipOk && headingOk && landedPath === "/en/work";
  return { pass, status, chipOk, headingOk, landedPath, interactionCount: 1 };
}

const SWEEP_ROUTES = [
  "/",
  "/isler",
  "/isler/vaaz",
  "/isler/akitle",
  "/isler/linkden",
  "/isler/characterdex",
  "/isler/oasis-and-mind",
  "/hizmetler",
  "/studyo",
  "/iletisim",
  "/olmayan-rota",
  "/en",
  "/en/work/vaaz",
];

async function runNoopenerSweep(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const violations = [];
  let externalLinkCount = 0;

  for (const route of SWEEP_ROUTES) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: "load" });
    const links = await page.evaluate(() => {
      const siteHost = location.host;
      return Array.from(document.querySelectorAll("a[href]"))
        .filter((a) => /^https?:\/\//.test(a.getAttribute("href") || ""))
        .filter((a) => {
          try {
            return new URL(a.getAttribute("href"), location.href).host !== siteHost;
          } catch {
            return false;
          }
        })
        .map((a) => ({
          href: a.getAttribute("href"),
          target: a.getAttribute("target"),
          rel: a.getAttribute("rel"),
        }));
    });

    for (const link of links) {
      externalLinkCount++;
      const rel = link.rel || "";
      const relOk = rel.includes("noopener") && rel.includes("noreferrer");
      const targetOk = link.target === "_blank";
      if (!relOk || !targetOk) {
        violations.push({ route, ...link });
      }
    }
  }

  await context.close();
  return { pass: violations.length === 0, violations, externalLinkCount };
}

async function main() {
  const browser = await chromium.launch();
  let allPass = true;

  console.log("== F1 — founder credibility path (worst case, 3 interactions) ==");
  const f1 = await runF1(browser);
  for (const s of f1.steps) {
    console.log(`  [${s.step}] expect=${s.expect} got=${s.got} ${s.got === s.expect ? "OK" : "MISMATCH"}`);
  }
  console.log(`  mailto anchor focused: ${f1.focusedHref}`);
  console.log(f1.pass ? "PASS F1\n" : "FAIL F1\n");
  if (!f1.pass) allPass = false;

  console.log("== F2 — 404 recovery (<=2 clicks) ==");
  const f2 = await runF2(browser);
  console.log(`  status=${f2.status} chip="NO SIGNAL"=${f2.chipOk} heading="Nothing on this route."=${f2.headingOk}`);
  console.log(`  landed after 1 click: ${f2.landedPath}`);
  console.log(f2.pass ? "PASS F2\n" : "FAIL F2\n");
  if (!f2.pass) allPass = false;

  console.log("== External-link noopener sweep ==");
  const sweep = await runNoopenerSweep(browser);
  console.log(`  external links checked: ${sweep.externalLinkCount}`);
  for (const v of sweep.violations) {
    console.log(`  VIOLATION route=${v.route} href=${v.href} target=${v.target} rel=${v.rel}`);
  }
  console.log(sweep.pass ? "PASS noopener sweep\n" : "FAIL noopener sweep\n");
  if (!sweep.pass) allPass = false;

  await browser.close();

  console.log(allPass ? "flow-proofs: ALL PASS" : "flow-proofs: FAILURES ABOVE");
  process.exit(allPass ? 0 : 1);
}

await main();

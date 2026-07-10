#!/usr/bin/env node
/**
 * T29's two remaining mechanical checks (04-tasks.md; 00-overview.md criteria #8, brief
 * minimum viewport):
 *  1. Reduced-motion pass: emulate prefers-reduced-motion, load /tr — assert stat values are
 *     final in the initial DOM (no odometer count-up) and no element carries the pulse
 *     animation's running play-state.
 *  2. No-horizontal-scroll sweep: at 360x800 (the brief's minimum viewport — sweep-only,
 *     shot matrix stays 375 per 05-verification.md), assert
 *     document.documentElement.scrollWidth <= 360 on every one of the 11 pinned routes.
 *
 * Usage: node scripts/m3-checks.mjs [--base http://localhost:3000]
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

const ROUTES = [
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
];

let allPass = true;
const browser = await chromium.launch();

// ---------- 1. Reduced-motion pass ----------
console.log("== Reduced-motion pass (/, 1440x900, dark, TR) ==");
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);

  const statValues = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[role="list"] .stat-cell b')).map((el) => el.textContent.trim()),
  );
  const expectedFinal = ["05", "02", "<48sa", "01"];
  const statsMatch = JSON.stringify(statValues) === JSON.stringify(expectedFinal);
  console.log(statsMatch ? "PASS" : "FAIL", "stat values final in initial DOM:", statValues);
  if (!statsMatch) allPass = false;

  // animationPlayState reports "running" as its initial/default value even when NO animation
  // is actually driving the element (animation-name: none) — animationName is the correct
  // signal that the keyframe animation itself was killed by the reduced-motion rule (same
  // verification method T14's own DEVIATIONS entry established for this exact component).
  const pulseAnimationName = await page.evaluate(() => {
    const el = document.querySelector(".pulse");
    if (!el) return null;
    return getComputedStyle(el).animationName;
  });
  const pulseOk = pulseAnimationName === "none";
  console.log(pulseOk ? "PASS" : "FAIL", "pulse animation-name (reduced motion, expect 'none'):", pulseAnimationName);
  if (!pulseOk) allPass = false;

  await context.close();
}

// ---------- 2. No-horizontal-scroll sweep at 360x800 ----------
console.log("\n== No-horizontal-scroll sweep (360x800, dark, TR, all 11 routes) ==");
for (const route of ROUTES) {
  const context = await browser.newContext({ viewport: { width: 360, height: 800 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}${route}`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const ok = scrollWidth <= 360;
  console.log(`${ok ? "PASS" : "FAIL"}  ${route.padEnd(24)} scrollWidth=${scrollWidth}`);
  if (!ok) allPass = false;
  await context.close();
}

await browser.close();

console.log(allPass ? "\nm3-checks: ALL PASS" : "\nm3-checks: FAILURES ABOVE");
process.exit(allPass ? 0 : 1);

#!/usr/bin/env node
/**
 * Reusable Playwright screenshot runner — 05-verification.md §Visual verification loop
 * documented fallback mechanism (T07). Sets data-theme before the shot, supports the
 * pinned viewport matrix and reduced-motion emulation, and is reused by every later
 * verification card (T19/T29/T32).
 *
 * Usage:
 *   node scripts/shoot.mjs --route /tr/dev/specimen --out out.png \
 *     [--viewport 1440,900] [--theme dark|light] [--reduced-motion true|false] \
 *     [--base http://localhost:3000]
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

if (!args.route || !args.out) {
  console.error(
    "Usage: node scripts/shoot.mjs --route /path --out out.png " +
      "[--viewport 1440,900] [--theme dark|light] [--reduced-motion true|false] " +
      "[--base http://localhost:3000]",
  );
  process.exit(1);
}

const [width, height] = (args.viewport || "1440,900").split(",").map(Number);
const theme = args.theme === "light" ? "light" : "dark";
const reducedMotion = args["reduced-motion"] === "true";
const baseUrl = args.base || process.env.SHOOT_BASE_URL || "http://localhost:3000";

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width, height },
  reducedMotion: reducedMotion ? "reduce" : "no-preference",
});
const page = await context.newPage();

// Pre-seed localStorage so the T09 pre-hydration theme script (once it exists) picks the
// theme up before first paint; harmless no-op before T09 lands.
await context.addInitScript((seedTheme) => {
  try {
    window.localStorage.setItem("theme", seedTheme);
  } catch {
    /* storage may be unavailable in some contexts — the post-load override below covers it */
  }
}, theme);

await page.goto(`${baseUrl}${args.route}`, { waitUntil: "networkidle" });

// Belt-and-suspenders: force the attribute directly too, so shots are correct even before
// the toggle mechanism (T09) exists, and even if the pre-hydration script is bypassed.
await page.evaluate((forcedTheme) => {
  document.documentElement.setAttribute("data-theme", forcedTheme);
}, theme);

await page.waitForTimeout(50); // let the 180ms theme-transition settle visually (~none needed for static shots, kept small)

await page.screenshot({ path: args.out });

await browser.close();

console.log(`shot: ${args.route} (${theme}, ${width}x${height}) -> ${args.out}`);

#!/usr/bin/env node
/**
 * Reusable Playwright screenshot runner — 05-verification.md §Visual verification loop
 * documented fallback mechanism (T07). Sets data-theme before the shot, supports the
 * pinned viewport matrix and reduced-motion emulation, and is reused by every later
 * verification card (T19/T29/T32).
 *
 * Usage (single shot):
 *   node scripts/shoot.mjs --route /tr/dev/specimen --out out.png \
 *     [--viewport 1440,900] [--theme dark|light] [--reduced-motion true|false] \
 *     [--base http://localhost:3000] [--selector "h1"]
 *
 * Usage (pinned matrix, T29/T32):
 *   node scripts/shoot.mjs --matrix m3 [--base http://localhost:3000]
 *
 * T29 fix (04-tasks.md; see DEVIATIONS.md T21 flag): the original wait strategy was
 * `waitUntil: "networkidle"`, which never resolves on Link-heavy pages once Home (T21) and
 * every other real screen exist — Next's <Link> viewport/hover prefetching keeps firing
 * `GET /...?_rsc=<hash>` requests with a fresh hash each time, so the network never goes
 * idle. Replaced with `waitUntil: "load"` (the actual document load event) + an explicit
 * `document.fonts.ready` wait (guards against a font-swap repaint landing mid-screenshot) +
 * an optional `--selector` wait (belt-and-suspenders for any screen where a specific element
 * must be visible before the shot is meaningful, e.g. the reduced-motion stat-rail assert).
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

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

const VIEWPORTS = {
  375: { width: 375, height: 812 },
  768: { width: 768, height: 1024 },
  1440: { width: 1440, height: 900 },
};

/** Shoots one route/viewport/theme combination with the fixed T29 wait strategy. */
async function shootOne(browser, { route, out, width, height, theme, reducedMotion, selector }) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: reducedMotion ? "reduce" : "no-preference",
  });

  // Pre-seed localStorage so the T09 pre-hydration theme script picks the theme up before
  // first paint.
  await context.addInitScript((seedTheme) => {
    try {
      window.localStorage.setItem("theme", seedTheme);
    } catch {
      /* storage may be unavailable in some contexts — the post-load override below covers it */
    }
  }, theme);

  const page = await context.newPage();

  await page.goto(`${baseUrl}${route}`, { waitUntil: "load" });

  // Belt-and-suspenders: force the attribute directly too, so shots are correct even if the
  // pre-hydration script is bypassed.
  await page.evaluate((forcedTheme) => {
    document.documentElement.setAttribute("data-theme", forcedTheme);
  }, theme);

  await page.evaluate(() => document.fonts.ready);

  if (selector) {
    await page.waitForSelector(selector, { state: "visible" });
  }

  await page.waitForTimeout(50); // let the 180ms theme-transition settle visually

  await mkdir(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out });
  await context.close();

  console.log(`shot: ${route} (${theme}, ${width}x${height}) -> ${out}`);
}

// ---------- Pinned route table (lib/i18n/routes.ts's localePairs, plus the 404 route) ----------
const ROUTES = [
  { slug: "home", tr: "/", en: "/en" },
  { slug: "work", tr: "/isler", en: "/en/work" },
  { slug: "vaaz", tr: "/isler/vaaz", en: "/en/work/vaaz" },
  { slug: "akitle", tr: "/isler/akitle", en: "/en/work/akitle" },
  { slug: "linkden", tr: "/isler/linkden", en: "/en/work/linkden" },
  { slug: "characterdex", tr: "/isler/characterdex", en: "/en/work/characterdex" },
  { slug: "oasis", tr: "/isler/oasis-and-mind", en: "/en/work/oasis-and-mind" },
  { slug: "services", tr: "/hizmetler", en: "/en/services" },
  { slug: "studio", tr: "/studyo", en: "/en/studio" },
  { slug: "contact", tr: "/iletisim", en: "/en/contact" },
  { slug: "404", tr: "/olmayan-rota", en: "/en/olmayan" },
];

const RUN_M3_DIR =
  "/Users/erkamdemirci/Desktop/portfolio/.bpud/runs/20260710-0135-studio-redesign/assets/impl/m3";

async function runMatrix(name) {
  if (name !== "m3") {
    console.error(`Unknown matrix "${name}" — only "m3" is defined.`);
    process.exit(1);
  }

  const browser = await chromium.launch();
  const shots = [];

  // Core TR: all 11 routes x 375/768/1440 x dark+light = 66 shots.
  for (const route of ROUTES) {
    for (const width of [375, 768, 1440]) {
      for (const theme of ["dark", "light"]) {
        const { height } = VIEWPORTS[width];
        shots.push({
          route: route.tr,
          out: path.join(RUN_M3_DIR, `${route.slug}-tr-${theme}-${width}.png`),
          width,
          height,
          theme,
          reducedMotion: false,
        });
      }
    }
  }

  // EN spot-check: home + vaaz x 375/1440 x dark = 4 shots (carries the 4.9 formatting check).
  for (const route of [ROUTES[0], ROUTES[2]]) {
    for (const width of [375, 1440]) {
      const { height } = VIEWPORTS[width];
      shots.push({
        route: route.en,
        out: path.join(RUN_M3_DIR, `${route.slug}-en-dark-${width}.png`),
        width,
        height,
        theme: "dark",
        reducedMotion: false,
      });
    }
  }

  // Reduced motion: home, 1440, dark, TR, prefers-reduced-motion emulated = 1 shot.
  shots.push({
    route: "/",
    out: path.join(RUN_M3_DIR, "home-tr-dark-1440-reduced-motion.png"),
    width: 1440,
    height: VIEWPORTS[1440].height,
    theme: "dark",
    reducedMotion: true,
  });

  for (const shot of shots) {
    await shootOne(browser, shot);
  }

  await browser.close();
  console.log(`\nmatrix ${name}: ${shots.length} shots written to ${RUN_M3_DIR}`);
}

if (args.matrix) {
  await runMatrix(args.matrix);
  process.exit(0);
}

if (!args.route || !args.out) {
  console.error(
    "Usage: node scripts/shoot.mjs --route /path --out out.png " +
      "[--viewport 1440,900] [--theme dark|light] [--reduced-motion true|false] " +
      "[--base http://localhost:3000] [--selector css]\n" +
      "   or: node scripts/shoot.mjs --matrix m3 [--base http://localhost:3000]",
  );
  process.exit(1);
}

const [width, height] = (args.viewport || "1440,900").split(",").map(Number);
const theme = args.theme === "light" ? "light" : "dark";
const reducedMotion = args["reduced-motion"] === "true";

const browser = await chromium.launch();
await shootOne(browser, {
  route: args.route,
  out: args.out,
  width,
  height,
  theme,
  reducedMotion,
  selector: args.selector,
});
await browser.close();

#!/usr/bin/env node
/**
 * Scroll-film verification harness (the skill's dev contract): every target is loaded
 * with ?jump=<y>, waits for window.__ready (fires only once triggers are settled), then
 * screenshots. Captures console errors/warnings per page. Also runs a live-scroll jank
 * probe (rAF max frame delta while Lenis-scrolling through the film — judge max, never
 * average).
 *
 * Usage: node scripts/verify-film.mjs [--base http://localhost:3001] [--out .playwright-mcp/film]
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i > -1 && args[i + 1] ? args[i + 1] : fallback;
};
const BASE = flag("base", "http://localhost:3001");
const OUT = flag("out", ".playwright-mcp/film");

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

// Chapter beats as (scene selector, fraction through its pin) — the harness measures the
// real pin-spacer ranges per viewport first, then derives each jump (self-calibrating).
const BEATS = [
  { name: "01-web", sel: ".scene-web", frac: 0.68 },
  { name: "02-mobile", sel: ".scene-mobile", frac: 0.62 },
  { name: "03-custom", sel: ".scene-custom", frac: 0.66 },
  { name: "04-rail", sel: ".scene-how", frac: 0.55 },
  { name: "05-who", sel: ".scene-who", frac: 0.82 },
];

const PLAIN_SHOTS = [
  { name: "rm-tr-full", url: "/", vp: DESKTOP, reducedMotion: true, fullPage: true },
  { name: "inner-services", url: "/hizmetler", vp: DESKTOP, plain: true },
  { name: "inner-contact", url: "/iletisim", vp: DESKTOP, plain: true },
  { name: "inner-blog", url: "/blog", vp: DESKTOP, plain: true },
  { name: "inner-blog-post", url: "/blog/kurumsal-web-sitesi-nasil-olmali", vp: DESKTOP, plain: true },
  { name: "inner-404", url: "/olmayan-bir-rota", vp: DESKTOP, plain: true },
];

async function measureBeats(browser, base, vp) {
  const context = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto(`${base}?jump=0`, { waitUntil: "load", timeout: 20000 });
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 15000 });
  const ranges = await page.evaluate((sels) => {
    const out = {};
    for (const sel of sels) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const spacer = el.parentElement?.classList?.contains("pin-spacer")
        ? el.parentElement
        : el;
      const r = spacer.getBoundingClientRect();
      out[sel] = { top: Math.round(r.top + scrollY), height: Math.round(r.height) };
    }
    return out;
  }, BEATS.map((b) => b.sel));
  await context.close();
  return ranges;
}

function buildShots(prefix, basePath, vp, ranges) {
  const shots = [{ name: `${prefix}00-hero`, url: `${basePath}?jump=0`, vp }];
  for (const beat of BEATS) {
    const r = ranges[beat.sel];
    if (!r) continue;
    const pinScroll = Math.max(r.height - vp.height, 0);
    const y = Math.round(r.top + pinScroll * beat.frac);
    shots.push({ name: `${prefix}${beat.name}`, url: `${basePath}?jump=${y}`, vp });
  }
  shots.push({ name: `${prefix}06-finale`, url: `${basePath}?jump=99999`, vp });
  return shots;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const problems = [];

  const trDesktop = await measureBeats(browser, `${BASE}/`, DESKTOP);
  const trMobile = await measureBeats(browser, `${BASE}/`, MOBILE);
  const SHOTS = [
    ...buildShots("tr-", "/", DESKTOP, trDesktop),
    { name: "en-00-hero", url: "/en?jump=0", vp: DESKTOP },
    { name: "en-06-finale", url: "/en?jump=99999", vp: DESKTOP },
    ...buildShots("m-tr-", "/", MOBILE, trMobile),
    ...PLAIN_SHOTS,
  ];

  for (const shot of SHOTS) {
    const context = await browser.newContext({
      viewport: shot.vp,
      deviceScaleFactor: 1,
      reducedMotion: shot.reducedMotion ? "reduce" : "no-preference",
    });
    const page = await context.newPage();
    const consoleMsgs = [];
    page.on("console", (m) => {
      if (m.type() === "error" || m.type() === "warning") {
        consoleMsgs.push(`[${m.type()}] ${m.text()}`);
      }
    });
    page.on("pageerror", (e) => consoleMsgs.push(`[pageerror] ${e.message}`));

    try {
      await page.goto(`${BASE}${shot.url}`, { waitUntil: "load", timeout: 20000 });
      if (shot.plain) {
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(250);
      } else {
        await page.waitForFunction(() => window.__ready === true, null, { timeout: 15000 });
        await page.waitForTimeout(120);
      }
      await page.screenshot({
        path: path.join(OUT, `${shot.name}.png`),
        fullPage: Boolean(shot.fullPage),
      });
      const filtered = consoleMsgs.filter(
        (m) => !m.includes("Download the React DevTools"),
      );
      if (filtered.length) problems.push({ shot: shot.name, consoleMsgs: filtered });
      console.log(`ok: ${shot.name}${filtered.length ? ` (console: ${filtered.length})` : ""}`);
    } catch (err) {
      problems.push({ shot: shot.name, error: String(err).slice(0, 300) });
      console.log(`FAIL: ${shot.name} — ${String(err).slice(0, 200)}`);
    }
    await context.close();
  }

  // Jank probe: live-load TR home (no jump → Lenis on), scroll through the film in steps,
  // record max rAF delta.
  {
    const context = await browser.newContext({ viewport: DESKTOP });
    const page = await context.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "load", timeout: 20000 });
    await page.waitForFunction(() => window.__ready === true, null, { timeout: 15000 });
    const maxDelta = await page.evaluate(async () => {
      let max = 0;
      let last = performance.now();
      let running = true;
      const tick = (t) => {
        max = Math.max(max, t - last);
        last = t;
        if (running) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      const total = document.documentElement.scrollHeight - innerHeight;
      for (let i = 0; i <= 40; i++) {
        window.scrollTo(0, (total * i) / 40);
        await new Promise((r) => setTimeout(r, 90));
      }
      running = false;
      return max;
    });
    console.log(`jank probe: max rAF delta ${maxDelta.toFixed(1)}ms (target < 50ms)`);
    if (maxDelta > 50) problems.push({ shot: "jank-probe", error: `max ${maxDelta.toFixed(1)}ms` });
    await context.close();
  }

  await browser.close();
  if (problems.length) {
    console.log("\nPROBLEMS:\n" + JSON.stringify(problems, null, 2));
    process.exitCode = 1;
  } else {
    console.log("\nall clear");
  }
}

await main();

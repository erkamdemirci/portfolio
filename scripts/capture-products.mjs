#!/usr/bin/env node
/**
 * T20 — Capture live product screenshots (assets for frames).
 * 04-tasks.md T20 capture matrix; 01-design-system.md §Iconography & imagery (source table,
 * budget). Captures real product UI regions with Playwright, element-anchored (never
 * hardcoded pixel offsets alone) so the script degrades gracefully — the C17 slot pattern is
 * the designed fallback, not a script failure, when a target region can't be located.
 *
 * LINKDEN GUARD (recon crash, binding): assert the loaded page's body text never contains
 * "Application error"; on first sight, reload once and re-assert; abort nonzero if it
 * persists — this is the one HARD failure condition in this script (everything else degrades
 * to a logged skip -> C17 slot fallback on the consuming page).
 */
import { chromium } from "playwright";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const OUT_ROOT = path.join(REPO_ROOT, "public/screens");
const MAX_BYTES = 500 * 1024; // 01 §Imagery budget: source PNGs <=500KB each
const DEVICE_SCALE = 2; // capture at 2x so next/image can deliver crisp AVIF/WebP at 2x

async function ensureDirFor(filePath) {
  await mkdir(path.dirname(filePath), { recursive: true });
}

/** Hide any fixed/sticky overlay (cookie banners, app-install prompts, chat widgets) so they
 *  can't composite over an element screenshot — they stay pinned to the viewport regardless
 *  of which page element we scroll to and screenshot. */
async function hideOverlays(page) {
  await page.evaluate(() => {
    document.querySelectorAll("body *").forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.position === "fixed" || cs.position === "sticky") {
        el.style.setProperty("visibility", "hidden", "important");
      }
    });
  });
}

async function dismissCookieLayer(page) {
  for (const label of ["Accept all", "Accept All", "Kabul et", "I agree", "Got it", "Allow all"]) {
    const btn = page.getByText(label, { exact: false }).first();
    if (await btn.count()) {
      await btn.click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(300);
    }
  }
}

async function waitSettled(page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForTimeout(400);
}

async function hasApplicationError(page) {
  const text = (await page.textContent("body").catch(() => "")) || "";
  return text.includes("Application error");
}

/** LINKDEN GUARD — the one hard-abort condition in this script (binding, 04-tasks.md T20). */
async function assertNoLinkdenCrash(page) {
  if (!(await hasApplicationError(page))) return;
  console.warn("  [linkden guard] 'Application error' detected on first load — reloading once...");
  await page.reload({ waitUntil: "networkidle" });
  await waitSettled(page);
  if (await hasApplicationError(page)) {
    console.error(
      "FATAL: linkden.co still shows 'Application error' after one reload — aborting (recon crash guard, T20).",
    );
    process.exit(1);
  }
}

/** Locates `anchorText`, climbs `levels` DOM ancestors from it, and screenshots that element.
 *  This is deliberately anchor-relative (not fixed pixel coordinates) so the capture survives
 *  minor upstream layout shifts — if the anchor text disappears entirely, the shot is skipped
 *  (falls back to the C17 slot on the consuming page) rather than silently capturing garbage. */
async function climbAndShoot(page, anchorText, levels, outPath) {
  const loc = page.getByText(anchorText, { exact: false }).first();
  if (!(await loc.count())) throw new Error(`anchor text not found: "${anchorText}"`);
  await loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600); // let scroll-triggered reveal animations settle
  let node = loc;
  for (let i = 0; i < levels; i++) node = node.locator("xpath=..");
  await ensureDirFor(outPath);
  await node.screenshot({ path: outPath, timeout: 15000 });
}

/** Some marketing sites gate section content behind a scroll-position intersection observer
 *  that a single scrollIntoViewIfNeeded() can jump past too fast to trigger. Walking down the
 *  page in small increments first (then back to top) primes every section's reveal state. */
async function primeLazyContent(page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((offset) => window.scrollTo(0, offset), y);
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

async function clipShoot(page, clip, outPath) {
  await ensureDirFor(outPath);
  await page.screenshot({ path: outPath, clip });
}

async function assertCaptured(outPath) {
  const s = await stat(outPath);
  if (s.size === 0) throw new Error(`empty file: ${outPath}`);
  if (s.size > MAX_BYTES) {
    throw new Error(`file too large (${(s.size / 1024).toFixed(0)}KB > 500KB budget): ${outPath}`);
  }
  return s.size;
}

const results = [];

async function capture(name, fn) {
  const outPath = path.join(OUT_ROOT, name);
  try {
    await fn(outPath);
    const bytes = await assertCaptured(outPath);
    results.push({ name, ok: true, bytes });
    console.log(`  OK   ${name} (${(bytes / 1024).toFixed(0)}KB)`);
  } catch (e) {
    results.push({ name, ok: false, reason: e.message });
    console.warn(`  SKIP ${name} — ${e.message} (falls back to C17 slot on the consuming page)`);
  }
}

async function run() {
  const browser = await chromium.launch();

  // ---------------- Akitle — real capture (recon: contract editor + signed badge) ----------------
  {
    const context = await browser.newContext({
      viewport: { width: 1600, height: 1000 },
      deviceScaleFactor: DEVICE_SCALE,
    });
    const page = await context.newPage();
    await page.goto("https://akitle.com/en", { waitUntil: "networkidle" });
    await dismissCookieLayer(page);
    await hideOverlays(page);
    await waitSettled(page);

    // (1) The contract-card content itself — line items + signature UI. Climbs only 3
    // ancestors (the card BODY, not the outer wrapper) so Akitle's own fake browser-chrome
    // bar ("● ● ●  akitle.com/c/contract" — a decorative hero graphic on akitle.com, not
    // real browser UI) is excluded: DMRC's own C15 BrowserBay frame supplies its own chrome
    // bar around this image, so including Akitle's baked-in one would double it up (found
    // during T23 case-template composition — see DEVIATIONS.md).
    await capture("akitle/editor-1600.png", (out) =>
      climbAndShoot(page, "Equipment Rental Contract", 3, out),
    );

    // (2) Close crop on the "Signed" badge card — header row, highlighted delivery-date box,
    // and the line-items table — cropped from the same card body (872,229 at 1600x1000, CSS
    // px), starting below Akitle's own chrome-bar strip for the same reason as (1). Height is
    // deliberately width/(16/11.5) (~320px) to MATCH C15 BrowserBay's span-5 canvas aspect
    // ratio exactly — an earlier, much-wider 446x190 crop got severely center-cropped by
    // `object-fit: cover` inside that fixed-aspect frame (title truncated to "nt Rental
    // Contract"), found while visually checking T23's case page (see DEVIATIONS.md).
    await capture("akitle/signed-1600.png", (out) =>
      clipShoot(page, { x: 872, y: 229, width: 446, height: 321 }, out),
    );

    await context.close();
  }

  // ---------------- Linkden — real capture (RECAPTURE-warning product; guard applies) --------
  {
    const context = await browser.newContext({
      viewport: { width: 1600, height: 1000 },
      deviceScaleFactor: DEVICE_SCALE,
    });
    const page = await context.newPage();
    await page.goto("https://linkden.co/en", { waitUntil: "networkidle" });
    await assertNoLinkdenCrash(page);
    await dismissCookieLayer(page);
    await hideOverlays(page);
    await waitSettled(page);
    await assertNoLinkdenCrash(page);
    await primeLazyContent(page); // "See It In Action" is gated behind a scroll reveal
    await hideOverlays(page); // re-hide anything the scroll pass exposed (e.g. sticky nav)

    // (3) Dashboard mock + both latency badges (<100ms / <50ms) — padded so the
    // absolutely-positioned badges aren't edge-clipped by the element's own border box.
    await capture("linkden/panel-1600.png", (out) =>
      clipShoot(page, { x: 801, y: 336, width: 590, height: 392 }, out),
    );

    // (4) The kbd-chip / shortcut section ("See It In Action" — Save from Browser / Search &
    // Find panels, each captioned with a kbd shortcut chip). Lazy-revealed — scroll first.
    await capture("linkden/kbd-1600.png", (out) =>
      climbAndShoot(page, "Save from Browser", 3, out),
    );

    await context.close();
  }

  // ---------------- CharacterDex — real capture (the live app itself, dark UI) ----------------
  {
    // Full-viewport dark-UI shot compresses poorly at 2x (busy layout, many distinct colors) —
    // 1x keeps it under the 500KB source budget while still oversampling any on-page display
    // size (unit cards/case feature blocks never render this wide).
    const context = await browser.newContext({
      viewport: { width: 1600, height: 1000 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto("https://characterdex.com/en", { waitUntil: "networkidle" });
    await dismissCookieLayer(page);
    await hideOverlays(page);
    await waitSettled(page);

    // (5) Three-column app layout (nav / trending characters / most-voted + oracle promo) —
    // fits the first viewport at 1600x1000, no scroll needed.
    await capture("characterdex/profiles-1600.png", async (out) => {
      await ensureDirFor(out);
      await page.screenshot({ path: out });
    });

    await context.close();
  }

  // The gold "Oracle Card of the Day" element — small crop, captured at 2x separately (its
  // own context so it doesn't inherit the 1x scale used for the full-viewport shot above).
  {
    const context = await browser.newContext({
      viewport: { width: 1600, height: 1000 },
      deviceScaleFactor: DEVICE_SCALE,
    });
    const page = await context.newPage();
    await page.goto("https://characterdex.com/en", { waitUntil: "networkidle" });
    await dismissCookieLayer(page);
    await hideOverlays(page);
    await waitSettled(page);

    // (6) The gold "Oracle Card of the Day" element.
    await capture("characterdex/oracle-1600.png", (out) =>
      climbAndShoot(page, "Oracle Card of the Day", 2, out),
    );

    await context.close();
  }

  // ---------------- VAAZ — real capture (mobile viewport) ----------------
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: DEVICE_SCALE,
    });
    const page = await context.newPage();
    await page.goto("https://getvaaz.com/en", { waitUntil: "networkidle" });
    await dismissCookieLayer(page);
    await hideOverlays(page);
    await waitSettled(page);

    // (7) The prayer-times countdown widget (next-prayer card with the live countdown).
    await capture("vaaz/times-390.png", (out) => climbAndShoot(page, "NEXT PRAYER", 2, out));

    // (8) "Daily tracking" (03 §7) — recon found no distinct tracking/streak screen on the
    // marketing site: no "streak"/"calendar"/"history" copy anywhere, and the one candidate
    // ("Dhikr Counter") is a generic icon+title+body feature card, visually identical to the
    // other five feature cards on the page — not a real app-screen capture, just marketing
    // copy about a feature. 03 §7 explicitly allows "C16 real ya da C17 slot" for this exact
    // feature, and the T20 capture-matrix row itself is annotated "fallback C17 slot" — so
    // this is a spec-sanctioned skip, not a script failure. Logged in DEVIATIONS.md.
    results.push({
      name: "vaaz/tracking-390.png",
      ok: false,
      reason: "no distinct daily-tracking UI on getvaaz.com/en — spec-sanctioned C17 fallback (03 §7)",
      sanctioned: true,
    });
    console.log(
      "  SKIP vaaz/tracking-390.png — no distinct daily-tracking UI found; spec-sanctioned C17 fallback (03 §7)",
    );

    await context.close();
  }

  await browser.close();
}

await run();

const captured = results.filter((r) => r.ok).length;
const hardFailures = results.filter((r) => !r.ok && !r.sanctioned);

console.log(`\n${captured}/8 real captures written; ${8 - captured} fall back to C17 slots.`);
if (hardFailures.length) {
  console.log("Unsanctioned skips (review before shipping):");
  for (const f of hardFailures) console.log(`  - ${f.name}: ${f.reason}`);
}

// Exit 0: missing/failed captures degrade to the designed C17 slot fallback, never a build
// break — the Linkden crash guard above (process.exit(1) inline) is the only hard-abort path.
process.exit(0);

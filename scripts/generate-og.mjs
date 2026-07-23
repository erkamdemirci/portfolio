#!/usr/bin/env node
/**
 * Generates public/og-tr.png + public/og-en.png (04-tasks.md T31) by screenshotting
 * app/[lang]/dev/og/page.tsx at exactly 1200×630 (03-screens-and-flows.md §Meta OG spec) via
 * Playwright — same tool the shot-runner (scripts/shoot.mjs, T07) uses, kept as a separate
 * script since this one asserts exact pixel dimensions and writes into public/ rather than
 * the RUN's verification-artifact tree.
 *
 * ALSO generates app/favicon.ico (T31's other new binary asset; no separate script exists in
 * the card's file list, so it lives here rather than inventing a second file) — Next's own
 * `favicon`/`icon` file conventions (app-icons.md) auto-wire `<link rel="icon">` tags from
 * BOTH app/icon.svg (modern browsers, already a static asset) and app/favicon.ico (the
 * `.ico`-only legacy convention, and the literal audit landmine: the old cached favicon.ico
 * this replaces) — the mark is redrawn on a `<canvas>` (see `generateFavicon`'s doc comment
 * for why: a screenshot's PNG encoder drops the alpha channel this build's ICO decoder
 * requires) and wrapped in a hand-built, single-image ICO container (the modern ICO spec
 * allows a directory entry to point straight at PNG bytes — no BMP/DIB re-encoding needed).
 *
 * Usage: node scripts/generate-og.mjs [--base http://localhost:3000]
 */
import { chromium } from "playwright";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

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

const TARGETS = [
  { lang: "tr", route: "/tr/dev/og", out: path.join(REPO_ROOT, "public", "og-tr.png") },
  { lang: "en", route: "/en/dev/og", out: path.join(REPO_ROOT, "public", "og-en.png") },
];

/** Reads a PNG's width/height straight from its IHDR chunk (no image-decoding dependency). */
async function readPngDimensions(filePath) {
  const buf = await readFile(filePath);
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height };
}

const FAVICON_SIZE = 32;
const FAVICON_OUT_PATH = path.join(REPO_ROOT, "app", "favicon.ico");

/** Wraps a single PNG buffer in a minimal, single-image ICO container (ICONDIR + one
 *  ICONDIRENTRY pointing straight at the PNG bytes — valid since Windows Vista's ICO format
 *  extension; every modern browser reading favicon.ico accepts this). */
function pngToIco(pngBuffer, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(1, 4); // image count

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 means 256)
  entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // color count (0 = no palette)
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8); // bytes in resource
  entry.writeUInt32LE(header.length + entry.length, 12); // offset to image data

  return Buffer.concat([header, entry, pngBuffer]);
}

// Mirrors app/icon.svg's exact geometry (32×32 canvas; cobalt ground; the one-stroke
// "Tek Kalemde" swoosh M6 21.5 C12 9.5, 18 26.5, 26 11.5 at 3.2px round-cap) — kept in
// sync by hand since it's a handful of numbers; update both files together if the mark's
// proportions ever change.
const FAVICON_BG = "#2B39E2";
const FAVICON_MARK = "#F7F5F0";

async function generateFavicon(browser) {
  // Drawn on a <canvas> and exported via toDataURL rather than screenshotted — a full-page
  // screenshot's PNG encoder drops the alpha channel whenever every pixel is fully opaque
  // (confirmed empirically: `pnpm build` failed processing app/favicon.ico with "The PNG is
  // not in RGBA format!" even with Playwright's `omitBackground: true`), while `<canvas>`
  // pixel storage — and therefore `toDataURL('image/png')` — is always RGBA internally,
  // regardless of content, guaranteeing the RGBA payload this Next.js build's ICO decoder
  // requires.
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setContent(`<canvas id="c" width="${FAVICON_SIZE}" height="${FAVICON_SIZE}"></canvas>`);
  const dataUrl = await page.evaluate(
    ({ size, bg, mark }) => {
      const canvas = document.getElementById("c");
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = mark;
      ctx.lineWidth = 3.2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(6, 21.5);
      ctx.bezierCurveTo(12, 9.5, 18, 26.5, 26, 11.5);
      ctx.stroke();
      return canvas.toDataURL("image/png");
    },
    { size: FAVICON_SIZE, bg: FAVICON_BG, mark: FAVICON_MARK },
  );
  await context.close();

  const pngBuffer = Buffer.from(dataUrl.split(",")[1], "base64");

  await writeFile(FAVICON_OUT_PATH, pngToIco(pngBuffer, FAVICON_SIZE));

  // Belt-and-suspenders: re-parse the PNG bytes just wrapped (straight out of the in-memory
  // buffer) rather than trusting the canvas element's own width/height attributes.
  const width = pngBuffer.readUInt32BE(16);
  const height = pngBuffer.readUInt32BE(20);
  if (width !== FAVICON_SIZE || height !== FAVICON_SIZE) {
    console.error(`FAIL: favicon PNG payload is ${width}x${height}, expected ${FAVICON_SIZE}x${FAVICON_SIZE}`);
    process.exitCode = 1;
    return;
  }

  console.log(`ok: ${FAVICON_OUT_PATH} (embedded PNG ${width}x${height})`);
}

async function main() {
  const browser = await chromium.launch();

  await generateFavicon(browser);

  for (const target of TARGETS) {
    const context = await browser.newContext({
      viewport: { width: 1200, height: 630 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto(`${baseUrl}${target.route}`, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(50);

    // fullPage: false (default) — captures exactly the 1200×630 viewport, matching the
    // template's `fixed inset-0` composition.
    await page.screenshot({ path: target.out });
    await context.close();

    const { width, height } = await readPngDimensions(target.out);
    if (width !== 1200 || height !== 630) {
      console.error(`FAIL: ${target.out} is ${width}x${height}, expected 1200x630`);
      process.exitCode = 1;
    } else {
      console.log(`ok: ${target.out} (${width}x${height})`);
    }
  }

  await browser.close();

  if (process.exitCode === 1) {
    process.exit(1);
  }
}

await main();

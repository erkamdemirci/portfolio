"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";
import manifest from "@/lib/film-manifest.json";

/**
 * "Tek Kalemde / In One Stroke" — the footage scroll-film. The page IS a generated
 * cinematic shot (fal Seedance, 5 chained chapters, one night-ink world): an ink drop
 * births a cobalt filament → a corridor of glass screens (web) → an obsidian slab
 * (mobile) → a dive through woven light-circuits (custom) → the line writes the
 * signature. Scroll scrubs it frame-by-frame on a canvas; the DOM type system rides on
 * top as beat overlays.
 *
 * Engine law (skill references/engine.md + playbook §6):
 * - Canvas + pre-extracted JPEGs, never <video> scrubbing. Lerped playhead
 *   (current += (target-current)*0.14). DPR capped at 1.5.
 * - ImageBitmap sliding window (±18 decode-ahead, evict beyond ±28, close() on evict)
 *   so every draw is a pure GPU blit — no main-thread JPEG decode spikes.
 * - Two-pass loader: a coarse spread first (every 6th frame) so the scrub works within
 *   ~1s, then the fill; nearestFrame() fallback so a missing frame never blanks.
 * - ONE server-rendered DOM, two layouts: without `.film-enhanced` (no JS, reduced
 *   motion, data-saver) the beats stack as normal full-height sections with the chapter
 *   keyframes as art — fully readable, crawler-visible. With it, the driver grows to
 *   170vh/chapter, the stage goes sticky, beats become absolute overlays with
 *   progress envelopes.
 * - Dev contract: ?jump=<y> lands pre-scrolled + force-settled (Lenis skipped);
 *   window.__ready fires only after fonts + ALL frames are loaded and drawn.
 */

gsap.registerPlugin(ScrollTrigger, useGSAP);

declare global {
  interface Window {
    __ready?: boolean;
  }
}

interface ScrollFilmProps {
  lang: Lang;
  dict: Dictionary;
}

const CONTACT_HREF: Record<Lang, string> = { tr: "/iletisim", en: "/en/contact" };
const SERVICES_HREF: Record<Lang, string> = { tr: "/hizmetler", en: "/en/services" };
const BLOG_HREF = "/blog";

const FRAME_COUNT = manifest.count;
const SEAM = manifest.seam;
const frameSrc = (i: number) => `/film/frames/f_${String(i + 1).padStart(4, "0")}.jpg`;

/* Beat envelopes on film progress p (0..1). Chapters: birth .0–.2, web .2–.4,
   mobile .4–.6, custom .6–.8, signature .8–1. */
const ENVELOPES: Record<string, { in: number; peak: number; out: number }> = {
  hero: { in: -0.1, peak: 0, out: 0.09 },
  web: { in: 0.21, peak: 0.27, out: 0.38 },
  mobile: { in: 0.41, peak: 0.47, out: 0.58 },
  custom: { in: 0.61, peak: 0.67, out: 0.78 },
  sign: { in: 0.845, peak: 0.9, out: 0.975 },
};

function beatAlpha(env: { in: number; peak: number; out: number }, p: number) {
  if (p < env.in || p > env.out) return 0;
  if (p < env.peak) return (p - env.in) / Math.max(1e-4, env.peak - env.in);
  return 1 - (p - env.peak) / Math.max(1e-4, env.out - env.peak);
}

/* ---------- split helpers (deterministic — identical on server and client) ---------- */

function SplitChars({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, wi, arr) => (
        <span key={wi}>
          <span className="word">
            {Array.from(word).map((ch, ci) => (
              <span key={ci} className="ch">
                {ch}
              </span>
            ))}
          </span>
          {wi < arr.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

function SplitHeading({
  as: Tag,
  text,
  className,
}: {
  as: "h2" | "p";
  text: string;
  className?: string;
}) {
  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        <SplitChars text={text} />
      </span>
    </Tag>
  );
}

/* ---------- the film ---------- */

export function ScrollFilm({ lang, dict }: ScrollFilmProps) {
  const h = dict.home;
  const root = useRef<HTMLDivElement>(null);
  const driverRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderBarRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLDivElement>(null);
  const readoutLabelRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      const driver = driverRef.current;
      const canvas = canvasRef.current;
      if (!rootEl || !driver || !canvas) return;

      document.documentElement.classList.add("film-js");

      const params = new URLSearchParams(window.location.search);
      const jumpParam = params.get("jump");
      const hasJump = jumpParam !== null;
      if (hasJump) history.scrollRestoration = "manual";

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cleanups: (() => void)[] = [];

      /* ---------- dev jank meter (judge max, never average) ---------- */
      if (process.env.NODE_ENV === "development") {
        let alive = true;
        cleanups.push(() => {
          alive = false;
        });
        let last = performance.now();
        let max = 0;
        let windowStart = last;
        const tick = (t: number) => {
          if (!alive) return;
          max = Math.max(max, t - last);
          last = t;
          if (t - windowStart > 2000) {
            console.log(`[jank] max frame ${max.toFixed(1)}ms`);
            max = 0;
            windowStart = t;
          }
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }

      /* ---------- reduced motion: the stacked editorial page, no engine ---------- */
      if (reduced || FRAME_COUNT === 0) {
        const settle = () => {
          if (hasJump) window.scrollTo(0, Number(jumpParam) || 0);
          window.__ready = true;
        };
        if (document.fonts?.ready) {
          document.fonts.ready.then(settle);
        } else {
          settle();
        }
        return () => {
          cleanups.forEach((fn) => fn());
          document.documentElement.classList.remove("film-js");
        };
      }

      /* ---------- enhanced mode: flipped on ONLY once frame 0 is drawable, so the
         stacked page never gives way to a black canvas or a blinked-out hero. ---------- */
      let enhanced = false;

      let lenis: Lenis | null = null;
      if (!hasJump) {
        lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((t) => lenis?.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      }

      /* ---------- frame store + two-pass loader ---------- */
      const isNarrow = window.matchMedia("(max-width: 767px)").matches;
      const stride = isNarrow ? 2 : 1; // phones load every 2nd frame (half payload)
      const wanted: number[] = [];
      for (let i = 0; i < FRAME_COUNT; i += stride) wanted.push(i);
      if (wanted[wanted.length - 1] !== FRAME_COUNT - 1) wanted.push(FRAME_COUNT - 1);

      const images: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);
      const bitmaps = new Map<number, ImageBitmap>();
      const decoding = new Set<number>();
      let loadedCount = 0;
      let coarseReady = false;
      let allReady = false;

      // Coarse pass = every 6th wanted frame (scrub works almost immediately),
      // then the fill pass completes the set.
      const coarse = wanted.filter((_, idx) => idx % 6 === 0);
      const fill = wanted.filter((_, idx) => idx % 6 !== 0);
      const coarseSet = new Set(coarse);
      let coarseLoaded = 0;

      const loaderEl = loaderRef.current!;
      const loaderBar = loaderBarRef.current!;

      const onFrameLoaded = (i: number) => {
        loadedCount++;
        if (coarseSet.has(i)) coarseLoaded++;
        const pct = loadedCount / wanted.length;
        loaderBar.style.transform = `scaleX(${pct})`;
        if (!coarseReady && coarseLoaded >= coarse.length) {
          coarseReady = true;
          gsap.to(loaderEl, { autoAlpha: 0, duration: 0.5, delay: 0.15 });
        }
        if (loadedCount >= wanted.length) {
          allReady = true;
          loaderEl.style.display = "none";
        }
        if (!enhanced && images[0]) enhance();
        else if (enhanced && i === displayed) drawFrame(i, true);
      };

      let pumpAlive = true;
      cleanups.push(() => {
        pumpAlive = false;
      });
      const queue = [...coarse, ...fill];
      let inFlight = 0;
      const pump = () => {
        if (!pumpAlive) return;
        while (inFlight < 10 && queue.length) {
          const i = queue.shift()!;
          inFlight++;
          const img = new window.Image();
          img.decoding = "async";
          img.onload = () => {
            inFlight--;
            images[i] = img;
            onFrameLoaded(i);
            pump();
          };
          img.onerror = () => {
            inFlight--;
            onFrameLoaded(i);
            pump();
          };
          img.src = frameSrc(i);
        }
      };
      pump();

      /* ---------- ImageBitmap sliding window (the anti-jank core) ---------- */
      /* createImageBitmap does REAL synchronous work on the calling thread in Chromium
         (profiled here: it was the whole jank budget when 30+ fired in one burst). So
         window refills are AMORTIZED: ensureBitmaps only computes the want-list; the
         tick drains at most 2 creations per frame — a few ms each, never a spike. */
      const B_AHEAD = 18;
      const B_KEEP = 28;
      let bmpCenter = -999;
      let wantQueue: number[] = [];
      function ensureBitmaps(center: number) {
        if (Math.abs(center - bmpCenter) < 6) return;
        bmpCenter = center;
        const lo = Math.max(0, center - B_AHEAD);
        const hi = Math.min(FRAME_COUNT - 1, center + B_AHEAD);
        const want: number[] = [];
        for (let d = 0; d <= hi - lo; d++) {
          // center-out order so the playhead's neighbourhood decodes first
          const a = center + d;
          const b = center - d;
          if (a <= hi && !bitmaps.has(a) && !decoding.has(a) && images[a]) want.push(a);
          if (d > 0 && b >= lo && !bitmaps.has(b) && !decoding.has(b) && images[b]) want.push(b);
        }
        wantQueue = want;
        for (const k of Array.from(bitmaps.keys())) {
          if (k < center - B_KEEP || k > center + B_KEEP) {
            bitmaps.get(k)!.close();
            bitmaps.delete(k);
          }
        }
      }
      function drainDecodes(budget: number) {
        while (budget > 0 && wantQueue.length) {
          const i = wantQueue.shift()!;
          if (bitmaps.has(i) || decoding.has(i) || !images[i]) continue;
          budget--;
          decoding.add(i);
          createImageBitmap(images[i]!)
            .then((b) => {
              decoding.delete(i);
              if (Math.abs(i - bmpCenter) > B_KEEP) {
                b.close();
                return;
              }
              bitmaps.set(i, b);
            })
            .catch(() => decoding.delete(i));
        }
      }
      cleanups.push(() => {
        bitmaps.forEach((b) => b.close());
        bitmaps.clear();
      });

      function nearestFrame(i: number): number {
        if (images[i]) return i;
        for (let d = 1; d < FRAME_COUNT; d++) {
          if (i - d >= 0 && images[i - d]) return i - d;
          if (i + d < FRAME_COUNT && images[i + d]) return i + d;
        }
        return -1;
      }

      /* ---------- canvas ---------- */
      const ctx = canvas.getContext("2d")!;
      let cw = 0;
      let chh = 0;
      const resizeCanvas = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        cw = canvas.clientWidth;
        chh = canvas.clientHeight;
        canvas.width = Math.round(cw * dpr);
        canvas.height = Math.round(chh * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (displayed >= 0) drawFrame(displayed, true);
      };

      /** Nearest already-decoded bitmap — a fast scrub must NEVER sync-decode a JPEG
          on the main thread (that decode spike IS the jank); a neighbouring frame for
          one tick is invisible at speed, and the exact frame swaps in on decode. */
      function nearestBitmap(i: number): { idx: number; bmp: ImageBitmap } | null {
        const hit = bitmaps.get(i);
        if (hit) return { idx: i, bmp: hit };
        for (let d = 1; d <= B_KEEP; d++) {
          const lo = bitmaps.get(i - d);
          if (lo) return { idx: i - d, bmp: lo };
          const hi = bitmaps.get(i + d);
          if (hi) return { idx: i + d, bmp: hi };
        }
        return null;
      }

      let displayed = -1;
      function drawFrame(i: number, force = false) {
        if (!enhanced || i < 0 || (!force && i === displayed)) return;
        const near = nearestBitmap(i);
        const src = near?.bmp ?? images[i];
        if (!src) return;
        displayed = near ? near.idx : i;
        // cover-fit
        const sw = manifest.width;
        const sh = manifest.height;
        const scale = Math.max(cw / sw, chh / sh);
        const dw = sw * scale;
        const dh = sh * scale;
        ctx.clearRect(0, 0, cw, chh);
        ctx.drawImage(src, (cw - dw) / 2, (chh - dh) / 2, dw, dh);
      }

      window.addEventListener("resize", resizeCanvas);
      cleanups.push(() => window.removeEventListener("resize", resizeCanvas));

      /* ---------- beats ---------- */
      const beats = Array.from(rootEl.querySelectorAll<HTMLElement>("[data-beat]")).map(
        (el) => ({
          el,
          env: ENVELOPES[el.dataset.beat!],
        }),
      );
      const labelEl = readoutLabelRef.current!;
      const labels = [h.openingLabel, h.web.label, h.mobile.label, h.custom.label, h.sign.label];
      let lastLabel = -1;

      const setProgressBar = gsap.quickSetter(progressRef.current!, "scaleX") as (
        v: number,
      ) => void;

      /* ---------- the scrub loop ---------- */
      let p = 0;
      let current = 0;
      let rafAlive = true;
      cleanups.push(() => {
        rafAlive = false;
      });

      const computeP = () => {
        const r = driver.getBoundingClientRect();
        p = Math.max(0, Math.min(1, -r.top / (r.height - window.innerHeight)));
      };

      const applyBeats = (instant = false) => {
        for (const b of beats) {
          if (!b.env) continue;
          const a = beatAlpha(b.env, p);
          b.el.style.opacity = String(a);
          const dir = p < b.env.peak ? 1 : -1;
          b.el.style.transform = `translateY(${(1 - a) * 18 * dir}px)`;
          b.el.style.visibility = a <= 0.001 ? "hidden" : "visible";
          if (instant) b.el.style.transition = "none";
        }
        // readout + progress + vignette handoff
        const li = Math.min(4, Math.floor(p * 5));
        if (li !== lastLabel) {
          lastLabel = li;
          labelEl.textContent = labels[li];
        }
        setProgressBar(p);
        const fade = p > 0.92 ? 1 - (p - 0.92) / 0.08 : 1;
        vignetteRef.current!.style.opacity = String(0.8 * fade);
        const grain = rootEl.querySelector<HTMLElement>(".film-grain");
        if (grain) grain.style.opacity = String(0.05 * fade);
      };

      const tick = () => {
        if (!rafAlive) return;
        computeP();
        const target = p * (FRAME_COUNT - 1);
        const vel = Math.abs(target - current);
        current += (target - current) * 0.14;
        if (vel < 0.4) current = target;
        const idx = nearestFrame(Math.round(current));
        ensureBitmaps(Math.round(current));
        drainDecodes(2);
        drawFrame(idx);
        applyBeats();
        requestAnimationFrame(tick);
      };

      /** The upgrade moment: stacked page → live film, with frame 0 already drawable. */
      function enhance() {
        if (enhanced) return;
        enhanced = true;
        rootEl!.classList.add("film-enhanced");
        resizeCanvas();
        drawFrame(0, true);
        ensureBitmaps(0);
        computeP();
        current = p * (FRAME_COUNT - 1);
        applyBeats(true);
        ScrollTrigger.refresh();
        requestAnimationFrame(tick);
      }

      /* ---------- chrome fades (readout/progress appear after the opening) ---------- */
      gsap.to([readoutRef.current, progressRef.current], {
        opacity: 1,
        scrollTrigger: { trigger: driver, start: "3% top", end: "8% top", scrub: true },
      });
      gsap.to([readoutRef.current, progressRef.current], {
        opacity: 0,
        scrollTrigger: { trigger: driver, start: "94% bottom", end: "99% bottom", scrub: true },
      });

      /* ---------- after-film entrances (below the fold — T71-safe) ---------- */
      const afterSections = rootEl.querySelectorAll<HTMLElement>(".after-block");
      afterSections.forEach((sec) => {
        gsap.set(sec, { autoAlpha: 0, y: 24 });
        ScrollTrigger.create({
          trigger: sec,
          start: "top 82%",
          once: true,
          onEnter: () => {
            const tl = gsap.to(sec, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" });
            if (hasJump) tl.progress(1);
          },
        });
      });

      // Marquee drift + velocity skew.
      const marqueeRow = rootEl.querySelector<HTMLElement>(".film-marquee .row");
      if (marqueeRow) {
        const drift = gsap.to(marqueeRow, { xPercent: -50, duration: 26, ease: "none", repeat: -1 });
        const skewTo = gsap.quickTo(marqueeRow, "skewX", { duration: 0.4, ease: "power2.out" });
        ScrollTrigger.create({
          trigger: rootEl,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => skewTo(gsap.utils.clamp(-4, 4, self.getVelocity() / -260)),
        });
        const slow = () => drift.timeScale(0.25);
        const fast = () => drift.timeScale(1);
        marqueeRow.parentElement!.addEventListener("mouseenter", slow);
        marqueeRow.parentElement!.addEventListener("mouseleave", fast);
        cleanups.push(() => {
          marqueeRow.parentElement?.removeEventListener("mouseenter", slow);
          marqueeRow.parentElement?.removeEventListener("mouseleave", fast);
        });
      }

      // Magnetic CTA (fine pointers only).
      const cta = rootEl.querySelector<HTMLElement>(".film-cta");
      if (cta && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const xTo = gsap.quickTo(cta, "x", { duration: 0.35, ease: "power3.out" });
        const yTo = gsap.quickTo(cta, "y", { duration: 0.35, ease: "power3.out" });
        const onMove = (e: MouseEvent) => {
          const r = cta.getBoundingClientRect();
          xTo(gsap.utils.clamp(-14, 14, (e.clientX - (r.left + r.width / 2)) * 0.25));
          yTo(gsap.utils.clamp(-10, 10, (e.clientY - (r.top + r.height / 2)) * 0.25));
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };
        cta.addEventListener("mousemove", onMove);
        cta.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          cta.removeEventListener("mousemove", onMove);
          cta.removeEventListener("mouseleave", onLeave);
        });
      }

      // Custom cursor — hidden until the first real mousemove (screenshot contract).
      const cursor = cursorRef.current!;
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const cx = gsap.quickTo(cursor, "x", { duration: 0.16, ease: "power2.out" });
        const cy = gsap.quickTo(cursor, "y", { duration: 0.16, ease: "power2.out" });
        let shown = false;
        const onMove = (e: MouseEvent) => {
          if (!shown) {
            shown = true;
            gsap.to(cursor, { opacity: 1, duration: 0.25 });
          }
          cx(e.clientX);
          cy(e.clientY);
        };
        const onOver = (e: MouseEvent) => {
          const t = (e.target as HTMLElement).closest("a, button, [data-cursor]");
          gsap.to(cursor, { scale: t ? 2.6 : 1, duration: 0.2 });
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        window.addEventListener("mouseover", onOver, { passive: true });
        cleanups.push(() => {
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseover", onOver);
        });
      }

      /* ---------- settle + ready (the verification contract) ---------- */
      const settle = async () => {
        if (document.fonts?.ready) await document.fonts.ready;
        ScrollTrigger.refresh();
        if (hasJump) {
          const y = Number(jumpParam) || 0;
          window.scrollTo(0, y);
          ScrollTrigger.update();
          computeP();
          current = p * (FRAME_COUNT - 1);
          applyBeats(true);
        }
        // __ready only when EVERY wanted frame is in — screenshots must never race the pump.
        const waitAll = () =>
          new Promise<void>((resolve) => {
            const check = () => {
              if (allReady || !pumpAlive) resolve();
              else setTimeout(check, 120);
            };
            check();
          });
        await waitAll();
        if (hasJump) {
          // Re-issue the jump on the FINAL layout — a scrollTo that raced enhance()
          // clamped against the short pre-enhance page.
          const y = Number(jumpParam) || 0;
          window.scrollTo(0, y);
          ScrollTrigger.update();
          computeP();
          current = p * (FRAME_COUNT - 1);
          ensureBitmaps(Math.round(current));
          drainDecodes(40); // one-off pre-screenshot fill; no user is scrolling yet
          await new Promise((r) => setTimeout(r, 250));
          drawFrame(nearestFrame(Math.round(current)), true);
          applyBeats(true);
        }
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.__ready = true;
          });
        });
      };
      void settle();

      return () => {
        cleanups.forEach((fn) => fn());
        lenis?.destroy();
        rootEl.classList.remove("film-enhanced");
        document.documentElement.classList.remove("film-js");
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="film" aria-label={h.filmAria}>
      {/* Pre-paint gate — fixed repo-owned constant, nothing interpolated. */}
      <script
        dangerouslySetInnerHTML={{
          __html: "document.documentElement.classList.add('film-js')",
        }}
      />

      <div className="film-grain" aria-hidden="true" />
      <div ref={cursorRef} className="film-cursor" aria-hidden="true" />
      <div ref={readoutRef} className="film-readout" aria-hidden="true">
        <span className="mono text-[0.78rem] text-[var(--film-accent-text)]">
          <span ref={readoutLabelRef} />
        </span>
      </div>
      <div ref={progressRef} className="film-progress" aria-hidden="true" />
      <div ref={loaderRef} className="film-loader" aria-hidden="true">
        <span className="mono text-[0.75rem] text-[var(--film-soft)]">{h.loader}</span>
        <span className="film-loader-track">
          <span ref={loaderBarRef} className="film-loader-bar" />
        </span>
      </div>

      {/* ================= THE FILM DRIVER ================= */}
      <section ref={driverRef} className="film-driver">
        <div ref={stageRef} className="film-stage">
          <canvas ref={canvasRef} className="film-canvas" aria-hidden="true" />
          <div ref={vignetteRef} className="film-vignette" aria-hidden="true" />

          {/* CH1 — opening / brand */}
          <div data-beat="hero" className="fbeat fbeat-hero">
            <img src="/film/k/K0.jpg" alt="" aria-hidden="true" className="fbeat-kf" />
            <div className="wrap w-full">
              <p className="label-cond text-[var(--film-accent-text)]">{h.eyebrow}</p>
              <p
                aria-hidden="true"
                className="film-word mt-4 text-[clamp(4.2rem,15vw,13.5rem)] text-[var(--film-ink)]"
              >
                DMRC
              </p>
              <h1 className="mt-6 max-w-[34ch] text-[clamp(1.2rem,2vw,1.6rem)] font-medium leading-[1.35] text-[var(--film-ink)]">
                {h.h1}
              </h1>
              <p className="hero-cue mono mt-9 flex items-center gap-3 text-[0.78rem] text-[var(--film-soft)]">
                <span className="hero-cue-line inline-block h-[26px] w-px bg-[var(--film-accent)]" />
                {h.scrollCue}
              </p>
            </div>
          </div>

          {/* CH2 — WEB (the glass-screen corridor) */}
          <div data-beat="web" className="fbeat fbeat-left">
            <img src="/film/k/K2.jpg" alt="" aria-hidden="true" className="fbeat-kf" />
            <div className="wrap w-full">
              <p className="label-cond text-[var(--film-accent-text)]">{h.web.label}</p>
              <SplitHeading
                as="h2"
                text={h.web.word}
                className="film-word mt-3 max-w-[10ch] text-[clamp(2.6rem,6.4vw,5.6rem)] text-[var(--film-ink)]"
              />
              <p className="film-beat mt-5 max-w-[38ch]">{h.web.beat}</p>
              <p className="film-tags mt-3">{h.web.tags}</p>
            </div>
          </div>

          {/* CH3 — MOBILE (the obsidian slab) */}
          <div data-beat="mobile" className="fbeat fbeat-right">
            <img src="/film/k/K3.jpg" alt="" aria-hidden="true" className="fbeat-kf" />
            <div className="wrap flex w-full justify-end">
              <div className="max-w-[44ch] text-right">
                <p className="label-cond text-[var(--film-accent-text)]">{h.mobile.label}</p>
                <SplitHeading
                  as="h2"
                  text={h.mobile.word}
                  className="film-word mt-3 text-[clamp(2rem,4.2vw,3.7rem)] text-[var(--film-ink)]"
                />
                <p className="film-beat mt-5 ml-auto max-w-[36ch]">{h.mobile.beat}</p>
                <p className="film-tags mt-3">{h.mobile.tags}</p>
              </div>
            </div>
          </div>

          {/* CH4 — CUSTOM (the woven circuit dive) */}
          <div data-beat="custom" className="fbeat fbeat-low">
            <img src="/film/k/K4.jpg" alt="" aria-hidden="true" className="fbeat-kf" />
            <div className="wrap w-full">
              <p className="label-cond text-[var(--film-accent-text)]">{h.custom.label}</p>
              <SplitHeading
                as="h2"
                text={h.custom.word}
                className="film-word mt-3 max-w-[12ch] text-[clamp(2.6rem,6.4vw,5.6rem)] text-[var(--film-ink)]"
              />
              <p className="film-beat mt-5 max-w-[40ch]">{h.custom.beat}</p>
              <p className="film-tags mt-3">{h.custom.tags}</p>
            </div>
          </div>

          {/* CH5 — THE SIGNATURE */}
          <div data-beat="sign" className="fbeat fbeat-center">
            <img src="/film/k/K5.jpg" alt="" aria-hidden="true" className="fbeat-kf" />
            <div className="wrap w-full text-center">
              <p className="label-cond text-[var(--film-accent-text)]">{h.sign.label}</p>
              <SplitHeading
                as="p"
                text={h.sign.line}
                className="film-word mx-auto mt-3 max-w-[16ch] text-[clamp(2rem,4.4vw,3.6rem)] text-[var(--film-ink)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= AFTER THE FILM ================= */}
      <div className="film-after" style={{ background: `linear-gradient(${SEAM}, var(--film-bg) 320px)` }}>
        {/* WHO */}
        <section className="after-block wrap grid items-center gap-[clamp(28px,5vw,64px)] py-[clamp(72px,10vh,128px)] min-[900px]:grid-cols-[auto_1fr]">
          <div className="relative mx-auto w-fit">
            <Image
              src="/portrait/erkam-demirci.jpg"
              alt={h.who.portraitAlt}
              width={400}
              height={400}
              quality={82}
              sizes="(max-width: 900px) 128px, 176px"
              className="who-portrait"
            />
            <svg className="stroke-svg who-ring" viewBox="0 0 200 200" aria-hidden="true">
              <circle cx="100" cy="100" r="96" />
            </svg>
          </div>
          <div>
            <p className="label-cond text-[var(--film-accent-text)]">{h.who.label}</p>
            <p className="film-word mt-3 text-[clamp(2rem,4.4vw,3.6rem)] text-[var(--film-ink)]">
              {h.who.name}
            </p>
            <p className="mt-3 text-[1.02rem] font-medium text-[var(--film-ink)]">{h.who.role}</p>
            <p className="film-beat mt-2">{h.who.line}</p>
          </div>
        </section>

        {/* HOW — principles */}
        <section className="after-block wrap border-t border-[var(--film-line)] py-[clamp(64px,9vh,112px)]">
          <p className="label-cond text-[var(--film-accent-text)]">{h.how.label}</p>
          <h2 className="film-word mt-3 text-[clamp(1.8rem,3.4vw,2.8rem)] text-[var(--film-ink)]">
            {h.how.heading}
          </h2>
          <div className="mt-[clamp(28px,4vh,48px)] grid gap-x-[clamp(24px,3vw,44px)] gap-y-9 min-[700px]:grid-cols-2 min-[1080px]:grid-cols-4">
            {h.how.stations.map((st) => (
              <article key={st.idx} className="border-t border-[var(--film-line)] pt-5">
                <span className="mono text-[0.85rem] text-[var(--film-accent-text)]">{st.idx}</span>
                <h3 className="mt-3 text-[1.25rem] leading-[1.15] text-[var(--film-ink)]">
                  {st.title}
                </h3>
                <p className="film-beat mt-2 text-[0.95rem]">{st.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* FINALE — the client's turn */}
        <section className="after-block wrap border-t border-[var(--film-line)] py-[clamp(72px,10vh,128px)]">
          <p className="label-cond text-[var(--film-accent-text)]">{h.finale.label}</p>
          <SplitHeading
            as="h2"
            text={h.finale.display}
            className="film-word mt-4 max-w-[14ch] text-[clamp(2.8rem,7.5vw,6.6rem)] text-[var(--film-ink)]"
          />
          <p className="film-beat mt-7 max-w-[46ch]">{h.finale.lede}</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-5">
            <Link href={CONTACT_HREF[lang]} prefetch={false} className="film-cta" data-cursor>
              {h.finale.cta}
            </Link>
            <p className="text-[0.95rem] text-[var(--film-soft)]">
              {h.finale.emailLead}{" "}
              <a
                href={`mailto:${h.finale.email}`}
                className="text-[var(--film-accent-text)] underline decoration-1 underline-offset-[3px]"
              >
                {h.finale.email}
              </a>
            </p>
          </div>
          <p className="mono mt-8 text-[0.8rem] text-[var(--film-soft)]">{h.finale.capacity}</p>
        </section>

        {/* marquee + the film's own footer */}
        <div className="film-marquee" aria-hidden="true">
          <div className="row">
            {[0, 1, 2, 3].map((i) => (
              <span key={i}>{h.finale.marquee}</span>
            ))}
          </div>
        </div>
        <footer role="contentinfo" className="film-scope">
          <div className="wrap flex flex-wrap items-center justify-between gap-5 py-8">
            <p className="text-[0.95rem] text-[var(--film-soft)]">{dict.footer.brand}</p>
            <nav aria-label="Footer" className="flex items-center gap-6">
              <Link
                href={SERVICES_HREF[lang]}
                prefetch={false}
                className="text-[0.92rem] font-medium text-[var(--film-soft)] transition-colors [@media(hover:hover)_and_(pointer:fine)]:hover:text-[var(--film-ink)]"
              >
                {dict.nav.services}
              </Link>
              {lang === "tr" && (
                <Link
                  href={BLOG_HREF}
                  prefetch={false}
                  className="text-[0.92rem] font-medium text-[var(--film-soft)] transition-colors [@media(hover:hover)_and_(pointer:fine)]:hover:text-[var(--film-ink)]"
                >
                  {dict.nav.blog}
                </Link>
              )}
              <Link
                href={CONTACT_HREF[lang]}
                prefetch={false}
                className="text-[0.92rem] font-medium text-[var(--film-soft)] transition-colors [@media(hover:hover)_and_(pointer:fine)]:hover:text-[var(--film-ink)]"
              >
                {dict.nav.contact}
              </Link>
            </nav>
            <p className="text-[0.82rem] text-[var(--film-soft)]">
              © 2026 DMRC · <span className="mono">erkamdemirci.com</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

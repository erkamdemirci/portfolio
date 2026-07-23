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

/**
 * "Tek Kalemde / In One Stroke" — the home scroll-film. One cobalt stroke travels the
 * whole page and never lifts: hero underline → web baseline + frame → phone outline →
 * custom route → principles rail → portrait ring + signature (the pen lifts for the first
 * time) → the finale hands the turn to the client.
 *
 * Engineering law honored here:
 * - Progressive enhancement: server HTML is a fully readable stacked page. Strokes are
 *   fully drawn by default; ONLY when JS is present (`.film-js`, added by a pre-paint
 *   inline script) do the hero's chars/stroke start hidden. Below-fold initial states are
 *   set post-hydration (below-fold hiding is T71-safe). Reduced motion gets the complete
 *   editorial page with zero pinning.
 * - LCP: the h1 is plain text, never animated, painted with the first HTML.
 * - Stroke drawing: every path carries pathLength=1 and animates stroke-dashoffset
 *   1.02 → 0 (manual dash technique; the .02 hides the round-cap dot of an undrawn path).
 * - The pen: position:fixed, placed per frame via path.getPointAtLength + getScreenCTM
 *   (viewport coords — valid under pin transforms and non-uniform viewBox scaling).
 * - Pin order: pinned scenes are created strictly in DOM order, ambient triggers after
 *   (creation order IS refresh order).
 * - Dev contract: `?jump=<y>` lands pre-scrolled with Lenis skipped and triggers settled;
 *   `window.__ready = true` only fires once everything is loaded and settled.
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
          {wi < arr.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

/** Heading whose visual layer is char-split; screen readers get the plain string. */
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
  const penRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const readoutLabelRef = useRef<HTMLSpanElement>(null);
  const readoutRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      if (!rootEl) return;

      // Belt-and-suspenders for client-side navigation (the inline pre-paint script only
      // runs on the initial document parse).
      document.documentElement.classList.add("film-js");

      const params = new URLSearchParams(window.location.search);
      const jumpParam = params.get("jump");
      const hasJump = jumpParam !== null;
      if (hasJump) history.scrollRestoration = "manual";

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Non-GSAP teardown (window listeners, rAF loops) — the gsap context only reverts
      // its own tweens/triggers.
      const cleanups: (() => void)[] = [];

      /* ---------- dev jank meter (judge p95/max, never average) ---------- */
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

      /* ---------- reduced motion: the complete editorial page, no engine ---------- */
      if (reduced) {
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

      /* ---------- smooth scroll (skipped under ?jump per the dev contract) ---------- */
      let lenis: Lenis | null = null;
      if (!hasJump) {
        lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((t) => lenis?.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      }

      const $ = (sel: string) => rootEl.querySelector<HTMLElement>(sel);
      const $$ = (sel: string) => Array.from(rootEl.querySelectorAll<HTMLElement>(sel));

      /* ---------- the pen ---------- */
      const pen = penRef.current!;
      const penX = gsap.quickSetter(pen, "x", "px") as (v: number) => void;
      const penY = gsap.quickSetter(pen, "y", "px") as (v: number) => void;

      /** Returns a dash-draw tween config for a stroke path + keeps the pen on its tip. */
      const draw = (path: SVGPathElement | SVGCircleElement, vars: gsap.TweenVars = {}) => {
        const geo = path as SVGPathElement;
        const total = geo.getTotalLength();
        const proxy = { p: 0 };
        return gsap.fromTo(
          proxy,
          { p: 0 },
          {
            p: 1,
            ease: "none",
            ...vars,
            onUpdate() {
              gsap.set(path, { strokeDashoffset: 1.02 * (1 - proxy.p) });
              const pt = geo.getPointAtLength(proxy.p * total);
              const m = geo.getScreenCTM();
              if (m) {
                penX(m.a * pt.x + m.c * pt.y + m.e);
                penY(m.b * pt.x + m.d * pt.y + m.f);
              }
            },
          },
        );
      };

      /** Sets a path to its undrawn state (JS-owned; CSS only pre-hides the hero). */
      const undraw = (sel: string) => {
        $$(sel).forEach((el) =>
          gsap.set(el, { strokeDasharray: "1.02 1.02", strokeDashoffset: 1.02 }),
        );
      };

      const scenes: { el: HTMLElement; label: string }[] = [];

      /* ================= HERO (no pin — the opening frame) =================
         The eyebrow + h1 are NEVER hidden (T71: entrance must not un-paint above-fold
         content; the h1 is the LCP). Only the wordmark chars, the stroke, and the cue
         start hidden — via `.film-js` CSS, applied pre-paint, so nothing ever flashes.
         The chars' CSS state is translateY(118%), which computes to a px matrix — tween
         `y: 0` (px), not yPercent, or GSAP would tween a separate, still-zero unit. */
      const heroStroke = $(".hero-stroke path") as SVGPathElement | null;
      const heroTl = gsap.timeline({ delay: 0.15 });
      heroTl.to(".film-hero .ch", {
        y: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.045,
      });
      if (heroStroke) {
        heroTl.add(draw(heroStroke, { duration: 0.7, ease: "power2.inOut" }), "-=0.35");
        heroTl.to(pen, { opacity: 1, duration: 0.2 }, "<");
      }
      heroTl.to(".film-hero .hero-cue", { autoAlpha: 1, duration: 0.5 }, "-=0.2");

      // As the opening frame scrolls away, the pen bows out (next scene re-introduces it).
      gsap.to(pen, {
        opacity: 0,
        scrollTrigger: { trigger: ".film-hero", start: "8% top", end: "30% top", scrub: true },
      });

      /* ================= SCENE 1 — WEB (pin) ================= */
      {
        const scene = $(".scene-web")!;
        scenes.push({ el: scene, label: h.web.label });
        const base = scene.querySelector<SVGPathElement>(".web-base")!;
        const frame = scene.querySelector<SVGPathElement>(".web-frame")!;
        undraw(".scene-web .stroke-svg path");
        gsap.set(scene.querySelectorAll(".film-word .ch"), { yPercent: 118 });
        gsap.set(scene.querySelectorAll(".scene-copy"), { autoAlpha: 0, y: 16 });
        gsap.set(scene.querySelector(".scene-label"), { autoAlpha: 0, y: 10 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scene,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
          },
        });
        tl.to(pen, { opacity: 1, duration: 0.08 }, 0)
          .to(scene.querySelector(".scene-label"), { autoAlpha: 1, y: 0, duration: 0.1 }, 0.04)
          .add(draw(base, { duration: 0.3 }), 0.02)
          .to(
            scene.querySelectorAll(".film-word .ch"),
            { yPercent: 0, stagger: 0.012, duration: 0.34, ease: "power3.out" },
            0.1,
          )
          .add(draw(frame, { duration: 0.28 }), 0.42)
          .to(scene.querySelectorAll(".scene-copy"), { autoAlpha: 1, y: 0, duration: 0.18, stagger: 0.05 }, 0.5)
          .to(scene.querySelector(".scene-inner"), { yPercent: -5, autoAlpha: 0, duration: 0.16 }, 0.84)
          .to(pen, { opacity: 0, duration: 0.08 }, 0.86);
      }

      /* ================= SCENE 2 — MOBILE (pin) ================= */
      {
        const scene = $(".scene-mobile")!;
        scenes.push({ el: scene, label: h.mobile.label });
        const outline = scene.querySelector<SVGPathElement>(".phone-outline")!;
        undraw(".scene-mobile .stroke-svg path");
        gsap.set(scene.querySelectorAll(".film-word .ch"), { yPercent: 118 });
        gsap.set(scene.querySelectorAll(".scene-copy"), { autoAlpha: 0, y: 16 });
        gsap.set(scene.querySelector(".scene-label"), { autoAlpha: 0, y: 10 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scene,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
          },
        });
        tl.to(pen, { opacity: 1, duration: 0.08 }, 0)
          .to(scene.querySelector(".scene-label"), { autoAlpha: 1, y: 0, duration: 0.1 }, 0.04)
          .add(draw(outline, { duration: 0.34 }), 0.02)
          .fromTo(
            scene.querySelector(".phone-feed"),
            { yPercent: 16 },
            { yPercent: -16, duration: 0.6, ease: "none" },
            0.2,
          )
          .to(
            scene.querySelectorAll(".film-word .ch"),
            { yPercent: 0, stagger: 0.012, duration: 0.3, ease: "power3.out" },
            0.3,
          )
          .to(scene.querySelectorAll(".scene-copy"), { autoAlpha: 1, y: 0, duration: 0.18, stagger: 0.05 }, 0.52)
          .to(scene.querySelector(".scene-inner"), { yPercent: -5, autoAlpha: 0, duration: 0.16 }, 0.84)
          .to(pen, { opacity: 0, duration: 0.08 }, 0.86);
      }

      /* ================= SCENE 3 — CUSTOM SOFTWARE (pin) ================= */
      {
        const scene = $(".scene-custom")!;
        scenes.push({ el: scene, label: h.custom.label });
        const desktopRoute = scene.querySelector<SVGPathElement>(".route-desktop")!;
        const mobileRoute = scene.querySelector<SVGPathElement>(".route-mobile")!;
        const isNarrow = window.matchMedia("(max-width: 899px)").matches;
        const route = isNarrow ? mobileRoute : desktopRoute;
        undraw(".scene-custom .stroke-svg path");
        const chars = scene.querySelectorAll<HTMLElement>(".film-word .ch");
        chars.forEach((ch, i) => {
          gsap.set(ch, {
            yPercent: 118,
            rotation: Math.sin(i * 2.7) * 10,
          });
        });
        gsap.set(scene.querySelectorAll(".scene-copy"), { autoAlpha: 0, y: 16 });
        gsap.set(scene.querySelector(".scene-label"), { autoAlpha: 0, y: 10 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scene,
            start: "top top",
            end: "+=160%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
          },
        });
        tl.to(pen, { opacity: 1, duration: 0.08 }, 0)
          .to(scene.querySelector(".scene-label"), { autoAlpha: 1, y: 0, duration: 0.1 }, 0.04)
          .add(draw(route, { duration: 0.52 }), 0.02)
          .to(
            chars,
            { yPercent: 0, rotation: 0, stagger: 0.014, duration: 0.34, ease: "back.out(1.4)" },
            0.18,
          )
          .to(scene.querySelectorAll(".scene-copy"), { autoAlpha: 1, y: 0, duration: 0.18, stagger: 0.05 }, 0.58)
          .to(scene.querySelector(".scene-inner"), { yPercent: -5, autoAlpha: 0, duration: 0.16 }, 0.84)
          .to(pen, { opacity: 0, duration: 0.08 }, 0.86);
      }

      /* ================= SCENE 4 — HOW (horizontal rail, pin) ================= */
      {
        const scene = $(".scene-how")!;
        scenes.push({ el: scene, label: h.how.label });
        const track = scene.querySelector<HTMLElement>(".rail-track")!;
        const railLine = scene.querySelector<SVGPathElement>(".rail-line path")!;
        undraw(".scene-how .stroke-svg path");
        gsap.set(scene.querySelectorAll(".rail-station"), { autoAlpha: 0.25 });

        const distance = () => track.scrollWidth - window.innerWidth;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scene,
            start: "top top",
            end: () => "+=" + Math.max(distance() * 1.15, window.innerHeight),
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to(pen, { opacity: 1, duration: 0.04 }, 0)
          .to(track, { x: () => -distance(), ease: "none", duration: 0.94 }, 0.02)
          .add(draw(railLine, { duration: 0.94 }), 0.02)
          .to(
            scene.querySelectorAll(".rail-station"),
            { autoAlpha: 1, stagger: 0.16, duration: 0.12 },
            0.04,
          )
          .to(pen, { opacity: 0, duration: 0.06 }, 0.96);
      }

      /* ================= SCENE 5 — WHO (pin) ================= */
      {
        const scene = $(".scene-who")!;
        scenes.push({ el: scene, label: h.who.label });
        const ring = scene.querySelector<SVGCircleElement>(".who-ring circle")!;
        const sig = scene.querySelector<SVGPathElement>(".who-signature path")!;
        gsap.set(ring, { strokeDasharray: "1.02 1.02", strokeDashoffset: 1.02 });
        gsap.set(sig, { strokeDasharray: "1.02 1.02", strokeDashoffset: 1.02 });
        gsap.set(scene.querySelector(".who-portrait-wrap"), { autoAlpha: 0, scale: 0.92 });
        gsap.set(scene.querySelectorAll(".who-copy"), { autoAlpha: 0, y: 16 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scene,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
          },
        });
        tl.to(pen, { opacity: 1, duration: 0.08 }, 0)
          .add(draw(ring, { duration: 0.24 }), 0.02)
          .to(
            scene.querySelector(".who-portrait-wrap"),
            { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power2.out" },
            0.08,
          )
          .to(scene.querySelectorAll(".who-copy"), { autoAlpha: 1, y: 0, duration: 0.16, stagger: 0.06 }, 0.28)
          .add(draw(sig, { duration: 0.3 }), 0.52)
          // The pen lifts — the only lift on the whole page.
          .to(pen, { scale: 2.1, opacity: 0, duration: 0.12, ease: "power2.in" }, 0.9);
      }

      /* ================= ambient (created AFTER all pins — refresh-order law) ========= */

      // Finale entrance (once, not scrubbed — the film hands over to normal scroll).
      const finale = $(".film-finale")!;
      gsap.set(finale.querySelectorAll(".film-word .ch"), { yPercent: 118 });
      gsap.set(finale.querySelectorAll(".finale-copy"), { autoAlpha: 0, y: 18 });
      ScrollTrigger.create({
        trigger: finale,
        start: "top 72%",
        once: true,
        onEnter: () => {
          const tl = gsap
            .timeline()
            .to(finale.querySelectorAll(".film-word .ch"), {
              yPercent: 0,
              stagger: 0.03,
              duration: 0.8,
              ease: "power4.out",
            })
            .to(
              finale.querySelectorAll(".finale-copy"),
              { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.08 },
              "-=0.45",
            );
          // Screenshot contract: a ?jump landing must never catch a mid-flight entrance.
          if (hasJump) tl.progress(1);
        },
      });

      // Marquee drift + velocity skew.
      const marqueeRow = $(".film-marquee .row");
      if (marqueeRow) {
        gsap.to(marqueeRow, { xPercent: -50, duration: 26, ease: "none", repeat: -1 });
        const skewTo = gsap.quickTo(marqueeRow, "skewX", { duration: 0.4, ease: "power2.out" });
        ScrollTrigger.create({
          trigger: rootEl,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => skewTo(gsap.utils.clamp(-4, 4, self.getVelocity() / -260)),
        });
      }

      // Chapter readout + film progress hairline.
      const readout = readoutRef.current!;
      const progressBar = progressRef.current!;
      const label = readoutLabelRef.current!;
      const setProgress = gsap.quickSetter(progressBar, "scaleX") as (v: number) => void;
      scenes.forEach((s) => {
        ScrollTrigger.create({
          trigger: s.el,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) label.textContent = s.label;
          },
        });
      });
      ScrollTrigger.create({
        trigger: rootEl,
        start: "top top",
        end: () => "+=" + (rootEl.scrollHeight - window.innerHeight),
        onUpdate: (self) => setProgress(self.progress),
      });
      gsap.to([readout, progressBar], {
        opacity: 1,
        scrollTrigger: { trigger: rootEl, start: "4% top", end: "9% top", scrub: true },
      });
      gsap.to([readout, progressBar], {
        opacity: 0,
        scrollTrigger: { trigger: finale, start: "top 60%", end: "top 30%", scrub: true },
      });

      // Magnetic CTA (fine pointers only).
      const cta = $(".film-cta");
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
          heroTl.progress(1); // entrance is not scroll-owned; settle it FIRST so the
          // active scene's scrubbed onUpdate (fired by the update() below) owns the pen.
          const y = Number(jumpParam) || 0;
          window.scrollTo(0, y);
          ScrollTrigger.update();
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
        document.documentElement.classList.remove("film-js");
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="film" aria-label={h.filmAria}>
      {/* Pre-paint gate: hero starts in its undrawn state ONLY when JS will animate it.
          Fixed repo-owned constant — nothing interpolated, no injection surface. */}
      <script
        dangerouslySetInnerHTML={{
          __html: "document.documentElement.classList.add('film-js')",
        }}
      />

      <div className="film-grain" aria-hidden="true" />
      <div ref={penRef} className="film-pen" aria-hidden="true" />
      <div ref={cursorRef} className="film-cursor" aria-hidden="true" />

      <div ref={readoutRef} className="film-readout" aria-hidden="true">
        <span className="mono text-[0.78rem] text-[var(--film-accent-text)]">
          <span ref={readoutLabelRef} />
        </span>
      </div>
      <div ref={progressRef} className="film-progress" aria-hidden="true" />

      {/* ================= HERO ================= */}
      <section className="film-hero film-scene items-start justify-end min-h-[100svh]">
        <div className="wrap w-full pb-[clamp(48px,9vh,110px)]">
          <p className="hero-copy label-cond text-[var(--film-accent-text)]">{h.eyebrow}</p>
          <p
            aria-hidden="true"
            className="film-word mt-4 text-[clamp(4.6rem,17vw,15.5rem)] text-[var(--film-ink)]"
          >
            <SplitChars text="DMRC" />
          </p>
          <div className="relative mt-1 h-[clamp(18px,4vw,40px)] w-[min(92%,760px)]">
            <svg
              className="stroke-svg hero-stroke"
              viewBox="0 0 600 40"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path pathLength={1} d="M 3 31 C 150 23, 380 35, 597 17" />
            </svg>
          </div>
          <h1 className="hero-copy mt-7 max-w-[34ch] text-[clamp(1.25rem,2.1vw,1.7rem)] font-medium leading-[1.35] text-[var(--film-ink)]">
            {h.h1}
          </h1>
          <p className="hero-cue mono mt-10 flex items-center gap-3 text-[0.78rem] text-[var(--film-soft)]">
            <span className="hero-cue-line inline-block h-[26px] w-px bg-[var(--film-accent)]" />
            {h.scrollCue}
          </p>
        </div>
      </section>

      {/* ================= 01 WEB ================= */}
      <section className="scene-web film-scene">
        <div className="scene-inner wrap grid w-full items-end gap-10 min-[900px]:grid-cols-[1.5fr_1fr]">
          <div className="relative">
            <svg
              className="stroke-svg"
              viewBox="0 0 1000 600"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path className="web-base" pathLength={1} d="M -20 470 L 1020 470" />
              <path
                className="web-frame"
                pathLength={1}
                d="M 15 470 L 15 60 L 960 60 L 960 470"
              />
            </svg>
            <p className="label-cond scene-label text-[var(--film-accent-text)]">{h.web.label}</p>
            <SplitHeading
              as="h2"
              text={h.web.word}
              className="film-word relative mt-4 pb-[clamp(20px,4vh,44px)] text-[clamp(2.6rem,7.2vw,6.4rem)] text-[var(--film-ink)]"
            />
          </div>
          <div className="pb-[clamp(20px,4vh,44px)]">
            <p className="film-beat scene-copy">{h.web.beat}</p>
            <p className="film-tags scene-copy mt-4">{h.web.tags}</p>
          </div>
        </div>
      </section>

      {/* ================= 02 MOBILE ================= */}
      <section className="scene-mobile film-scene">
        <div className="scene-inner wrap grid w-full items-center gap-[clamp(28px,4vw,56px)] min-[900px]:grid-cols-[minmax(0,1.2fr)_auto_minmax(0,1fr)]">
          <div className="order-2 min-w-0 min-[900px]:order-1">
            <p className="label-cond scene-label text-[var(--film-accent-text)]">{h.mobile.label}</p>
            <SplitHeading
              as="h2"
              text={h.mobile.word}
              className="film-word mt-4 text-[clamp(2rem,3.4vw,3.2rem)] text-[var(--film-ink)]"
            />
          </div>
          <div className="phone order-1 relative mx-auto h-[min(56svh,540px)] aspect-[300/620] min-[900px]:order-2">
            <svg className="stroke-svg" viewBox="0 0 300 620" aria-hidden="true">
              <path
                className="phone-outline"
                pathLength={1}
                d="M 150 8 H 222 Q 292 8 292 78 V 542 Q 292 612 222 612 H 78 Q 8 612 8 542 V 78 Q 8 8 78 8 H 150"
              />
            </svg>
            <div className="phone-mask absolute inset-[7px] overflow-hidden rounded-[34px]">
              <div className="phone-feed flex h-[130%] flex-col justify-center gap-5 px-6 opacity-60">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} aria-hidden="true">
                    <div className="h-2 w-1/2 rounded-full bg-[var(--film-line-strong)]" />
                    <div className="mt-2 h-2 w-5/6 rounded-full bg-[var(--film-line)]" />
                    <div className="mt-2 h-2 w-2/3 rounded-full bg-[var(--film-line)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="order-3 min-w-0 max-w-[36ch]">
            <p className="film-beat scene-copy">{h.mobile.beat}</p>
            <p className="film-tags scene-copy mt-4">{h.mobile.tags}</p>
          </div>
        </div>
      </section>

      {/* ================= 03 CUSTOM ================= */}
      <section className="scene-custom film-scene">
        <svg
          className="stroke-svg"
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="route-desktop max-[899px]:hidden"
            pathLength={1}
            d="M -20 120 L 240 120 L 305 262 L 560 262 L 622 140 L 800 140 L 862 430 L 1020 430"
          />
          <path
            className="route-mobile min-[900px]:hidden"
            pathLength={1}
            d="M -20 90 L 300 90 L 380 250 L 700 250 L 780 460 L 1020 460"
          />
        </svg>
        <div className="scene-inner wrap w-full">
          <p className="label-cond scene-label text-[var(--film-accent-text)]">{h.custom.label}</p>
          <SplitHeading
            as="h2"
            text={h.custom.word}
            className="film-word mt-4 text-[clamp(2.6rem,7.2vw,6.4rem)] text-[var(--film-ink)]"
          />
          <div className="mt-[clamp(20px,4vh,40px)] max-w-[52ch]">
            <p className="film-beat scene-copy">{h.custom.beat}</p>
            <p className="film-tags scene-copy mt-4">{h.custom.tags}</p>
          </div>
        </div>
      </section>

      {/* ================= 04 HOW — the rail ================= */}
      <section className="scene-how film-scene justify-center overflow-hidden">
        <div className="wrap w-full">
          <p className="label-cond text-[var(--film-accent-text)]">{h.how.label}</p>
          <SplitHeading
            as="h2"
            text={h.how.heading}
            className="film-word mt-3 text-[clamp(1.9rem,3.6vw,3rem)] text-[var(--film-ink)]"
          />
        </div>
        <div className="rail-viewport relative mt-[clamp(24px,5vh,48px)]">
          <svg
            className="stroke-svg rail-line"
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path pathLength={1} d="M 0 1 L 100 1" />
          </svg>
          <div className="rail-track pt-[clamp(28px,5vh,52px)]">
            {h.how.stations.map((st) => (
              <article key={st.idx} className="rail-station">
                <span className="idx">{st.idx}</span>
                <h3 className="text-[clamp(1.5rem,2.6vw,2.2rem)] leading-[1.05] text-[var(--film-ink)]">
                  {st.title}
                </h3>
                <p className="film-beat text-[0.98rem]">{st.body}</p>
              </article>
            ))}
            <div className="rail-station" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ================= 05 WHO ================= */}
      <section className="scene-who film-scene">
        <div className="wrap grid w-full items-center gap-[clamp(32px,5vw,72px)] min-[900px]:grid-cols-[auto_1fr]">
          <div className="who-portrait-wrap relative mx-auto w-fit">
            <Image
              src="/portrait/erkam-demirci.jpg"
              alt={h.who.portraitAlt}
              width={400}
              height={400}
              quality={82}
              sizes="(max-width: 900px) 128px, 190px"
              className="who-portrait"
            />
            <svg className="stroke-svg who-ring" viewBox="0 0 200 200" aria-hidden="true">
              <circle cx="100" cy="100" r="96" pathLength={1} />
            </svg>
          </div>
          <div>
            <p className="label-cond who-copy text-[var(--film-accent-text)]">{h.who.label}</p>
            <SplitHeading
              as="p"
              text={h.who.name}
              className="film-word mt-4 text-[clamp(2.2rem,5vw,4.2rem)] text-[var(--film-ink)]"
            />
            <p className="who-copy mt-3 text-[1.05rem] font-medium text-[var(--film-ink)]">{h.who.role}</p>
            <p className="who-copy film-beat mt-2">{h.who.line}</p>
            <div className="who-signature relative mt-[clamp(20px,4vh,36px)] h-[clamp(64px,10vw,110px)] w-[min(88%,380px)]">
              <svg className="stroke-svg" viewBox="0 0 400 120" preserveAspectRatio="xMinYMid meet" aria-hidden="true">
                <path
                  pathLength={1}
                  d="M 18 82 C 55 18, 105 108, 148 58 S 226 20, 258 68 C 274 94, 300 96, 330 56 L 374 38"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINALE — the client's turn ================= */}
      <section className="film-finale film-scene min-h-[92svh]">
        <div className="wrap w-full">
          <p className="label-cond finale-copy text-[var(--film-accent-text)]">{h.finale.label}</p>
          <SplitHeading
            as="h2"
            text={h.finale.display}
            className="film-word mt-4 max-w-[14ch] text-[clamp(2.8rem,8vw,7rem)] text-[var(--film-ink)]"
          />
          <p className="finale-copy film-beat mt-7 max-w-[46ch]">{h.finale.lede}</p>
          <div className="finale-copy mt-9 flex flex-wrap items-center gap-x-7 gap-y-5">
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
          <p className="finale-copy mono mt-8 text-[0.8rem] text-[var(--film-soft)]">
            {h.finale.capacity}
          </p>
        </div>
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
  );
}

# Polish backlog — post-launch (2026-07-23)

Distilled from the overnight research pass, audited against the shipped "Tek Kalemde"
scroll-film. The live build already complies with the anti-cliché list (native cursor
never hidden; magnetism on the one primary CTA only, fine-pointer gated; marquee carries
real capability words; chapters scrub-driven, no wheel-lock/snap; `smoothTouch` off;
reduced-motion collapses to a static editorial page; accent TEXT on dark uses the AA-safe
`--film-accent-text`; chapter readout + progress hairline give the one-pager a spine;
branded `::selection` and OG cards shipped). What remains:

## Code polish (small, no content decisions needed)

- [ ] Marquee: pause (or slow to ~30%) on hover — decorative loops that ignore the user
      read as template. One `mouseenter/leave` timeScale tween on the existing gsap loop.
- [ ] `caret-color: var(--ever)` next to the `::selection` rule (form fields, dark theme).
- [ ] Tab-title swap on `blur` (TR: "Bir çizgi sizi bekliyor — DMRC" / EN: "The stroke is
      waiting — DMRC"), restore on focus. Tiny inline script; skip under reduced motion? No —
      it's not motion; ship for both.
- [ ] 404 in the film world: draw a short broken stroke + "Aradığınız sayfa burada değil."
      Current 404 is coherent (inner-page style) but doesn't sell the brand.
- [ ] One hidden interaction, restrained: candidate — after the WHO signature completes,
      clicking the portrait replays the signature draw. No Konami dumps.

## Content decisions (Erkam's call — need real material)

- [ ] 1–2 attributed client testimonials (named person + company). Highest-leverage trust
      signal for a solo studio; even one measurably helps.
- [ ] A quiet numbers line for the finale (years shipping / projects delivered / countries
      served) — only real, measured numbers (house rule: no unmeasured claims).
- [ ] "Recently shipped" row — 3 clickable live client URLs. NOTE: interacts with the
      standing "no apps/projects shown" decision; revisit when the projects section returns.
- [ ] Booking affordance that operationalizes the 48h promise (Cal.com link or similar)
      + a timezone-overlap note for worldwide clients + a continuity/solo-risk answer
      (what happens if you're unavailable) on services or contact.

## Already-tracked elsewhere

- SMTP_* env + phone/WhatsApp in `lib/site-config.ts` (SHIP-READINESS + memory).
- IndexNow route, EN blog (SHIP-READINESS backlog).

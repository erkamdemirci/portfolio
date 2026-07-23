# SHIP-READINESS — erkamdemirci.com scroll-film rebuild

Run: 2026-07-23 (pre-deploy gate, `/seo ship` house procedure).
Stack: Next.js 16.2.10 App Router — first-class gate set.
Measured against source + the built production server at `http://localhost:3001`
(every row's evidence captured this run; nothing constructed).

| # | Gate | Result | Evidence (measured this run) |
|---|------|--------|------------------------------|
| 1 | Sitemap dates not `now()` | PASS | `grep "new Date()\|Date.now()\|statSync" app/sitemap.ts lib/seo.ts` → 0 matches; sitemap emits URL + hreflang alternates only (17 `<loc>` live) |
| 2 | JSON-LD server-rendered | PASS | 0 `next/script` JSON-LD combos in `app/`+`components/`; Googlebot-UA curl of `/` shows 3 `<script type="application/ld+json">` in raw HTML (Organization, WebSite, Person) |
| 2b | Film content renderable without JS (GEO renderability) | PASS | Googlebot-UA curl of `/` contains the full film copy ("ÖZEL YAZILIM", finale display); page is server-rendered text, GSAP only enhances |
| 3 | Stable-date floor | N/A | No date-stamped crawler surfaces beyond blog posts, whose dates are literals in `lib/blog/posts/*` (verified: no dynamic dates, gate 1) |
| 4 | Robots / AI-crawler posture | PASS | `/robots.txt` → `User-Agent: * / Allow: /` + `Disallow: /dev, /en/dev`; no AI-crawler blocks; sitemap declared |
| 5 | Hreflang from one canonical locale array | PASS | Every emission site (`app/[lang]/{page,services,contact}` + `lib/seo.ts`) imports `localePairs`/`alternatesFor`; live `/` emits exactly `tr`, `en`, `x-default`; blog emits `tr`+`x-default` only (TR-only surface, A11) |
| 6 | noindex on listing variants | N/A | No paginated/filtered routes exist; `/dev/*` noindex + robots-disallowed; 404 noindex (T28) |
| 7 | OG images + favicon respond | PASS | `og-tr.png`, `og-en.png` (1200×630, regenerated this run in the new brand), `icon.svg`, `favicon.ico`, `portrait/erkam-demirci.jpg` — all HTTP 200 with correct content-types |
| 8 | llms.txt | PASS (added this run) | `public/llms.txt` written (studio summary + page map + facts). Labeled honestly: navigation value for AI agents, not a visibility lever |
| 9 | IndexNow endpoint | NOT SHIPPED | Deliberate: 17-URL site, low churn. Backlog item, not a blocker |
| 10 | Internal-link hubs on programmatic templates | N/A | No programmatic route families |
| 11 | Title/description lengths | PASS | Measured live: titles 27–52 ch (≤65), descriptions 125–158 ch (≤160) across all 7 indexable page types |
| 12 | Canonicals | PASS | Live `<link rel="canonical">` absolute + self-referencing on `/`, `/en`, `/hizmetler`, `/en/services`, `/iletisim`, `/blog` |
| 13 | Retired-route redirects | PASS | `/isler`, `/isler/:path*`, `/studyo` (+ EN twins) → 308 permanent to locale home (next.config.ts); verified live (`/isler/vaaz` → `/`) |
| 14 | Junk/extension paths return 404, not 500 | PASS (fixed this run) | Pre-existing bug: proxy-bypassed unmatched paths (`/foo.txt`, `/wp-login.php`) matched `[lang]` with the filename → 500. Fixed two-part: layout falls back to TR chrome (a layout-thrown notFound bubbles past the segment boundary — the original 500), and the index page throws `notFound()`, caught by `app/[lang]/not-found.tsx`. Verified live: both probes now 404 |
| 15 | Heading + lang hygiene | PASS | Exactly one `<h1>` on `/`, `/en`, `/hizmetler`, `/blog` (film chapters are h2); `<html lang="tr">` / `lang="en"` per locale |
| 16 | Structured data per template | PASS | Home: Org + WebSite + Person (with portrait image + sameAs). Services: Service×4 + FAQPage (kept for AI-citation value per May-2026 FAQ policy — not for SERP rich results). Blog post: Article + BreadcrumbList |
| 17 | Ranking meta preserved through rebuild | PASS | `metaFor` home/services/contact titles byte-identical to the pre-rebuild ranking table (locked by lib/seo.test.ts) |

## Blockers

None. Gates 8 and 14 were the only FAILs found and both were fixed within this run
(llms.txt added; invalid-lang 500 guard). Gate 9 (IndexNow) is deliberate backlog.

## Notes for the next SEO pass (backlog, not blockers)

- IndexNow route + key (instant Bing/Yandex pings) — pattern 7.
- The retired work/studio URLs now 308 → home; Search Console will show them as
  redirects. If projects return later, prefer resurrecting the same URLs.
- EN blog remains unshipped (recorded in the 2026-07-12 run's deferred list).
- Per-page OG variants remain out of scope (one OG per locale, by prior decision).

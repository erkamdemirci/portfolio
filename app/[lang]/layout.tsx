import type { Metadata } from "next";
import type { ReactNode } from "react";
import { archivo, geistMono } from "@/app/fonts";
import { Footer } from "@/components/chrome/footer";
import { Header } from "@/components/chrome/header";
import { SkipLink } from "@/components/chrome/skip-link";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";
import { setRequestLang } from "@/lib/i18n/request-lang";
import { SITE_URL } from "@/lib/seo";
import { JsonLd, organizationSchema, websiteSchema } from "@/components/seo/json-ld";
import { THEME_SCRIPT } from "@/lib/theme-script";
import "../globals.css";

// metadataBase (T30) — every URL-based field below this segment (alternates.canonical,
// alternates.languages, openGraph.images) can use a relative path and still resolve to a
// fully-qualified URL (04-tasks.md T30/T31; A4 deploy target, 06-risks-and-assumptions.md).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "DMRC",
  description:
    "DMRC — Erkam Demirci's software studio. Websites, mobile apps, and custom software — end to end.",
};

export function generateStaticParams() {
  return [{ lang: "tr" }, { lang: "en" }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  // Unmatched asset-extension paths bypass the locale proxy (matcher excludes dotted
  // paths), so the router matches [lang] with e.g. "foo.txt" — getDictionary(undefined)
  // then 500'd every junk probe (/wp-login.php, /foo.txt). The layout falls back to TR
  // chrome; the PAGE throws notFound() (a layout-thrown notFound bubbles PAST this
  // segment's boundary to the nonexistent root one — that's the 500, see T28).
  const lang: Lang = rawLang === "en" ? "en" : "tr";
  const dict = getDictionary(lang);
  // Relay lang to app/[lang]/not-found.tsx, which receives no params of its own (T28
  // deviation, see DEVIATIONS.md and lib/i18n/request-lang.ts).
  setRequestLang(lang);

  return (
    <html
      lang={lang}
      data-theme="light"
      suppressHydrationWarning
      className={`${archivo.variable} ${geistMono.variable}`}
    >
      <body>
        {/*
          Pre-hydration theme script — MUST run before any content paints (C4, 01 no-flash rule).
          Safe use of dangerouslySetInnerHTML: THEME_SCRIPT is a fixed, repo-owned constant
          (lib/theme-script.ts) containing no user/request input — nothing here is ever
          interpolated from external data, so there is no injection surface to sanitize.
        */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {/* Sitewide structured data — Organization (Bursa, contactPoint from site-config) + WebSite. */}
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema(lang)} />
        <SkipLink label={dict.skipLink} />
        <Header lang={lang} dict={dict} />
        <main id="main">{children}</main>
        <Footer lang={lang} dict={dict} />
      </body>
    </html>
  );
}

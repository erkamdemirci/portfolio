import type { Metadata } from "next";
import type { ReactNode } from "react";
import { generalSans, plexMono } from "@/app/fonts";
import { Footer } from "@/components/chrome/footer";
import { Header } from "@/components/chrome/header";
import { SkipLink } from "@/components/chrome/skip-link";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";
import { setRequestLang } from "@/lib/i18n/request-lang";
import { THEME_SCRIPT } from "@/lib/theme-script";
import "../globals.css";

export const metadata: Metadata = {
  title: "DMRC",
  description: "DMRC — Erkam Demirci's product studio.",
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
  const { lang } = (await params) as { lang: Lang };
  const dict = getDictionary(lang);
  // Relay lang to app/[lang]/not-found.tsx, which receives no params of its own (T28
  // deviation, see DEVIATIONS.md and lib/i18n/request-lang.ts).
  setRequestLang(lang);

  return (
    <html
      lang={lang}
      data-theme="dark"
      suppressHydrationWarning
      className={`${generalSans.variable} ${plexMono.variable}`}
    >
      <body>
        {/*
          Pre-hydration theme script — MUST run before any content paints (C4, 01 no-flash rule).
          Safe use of dangerouslySetInnerHTML: THEME_SCRIPT is a fixed, repo-owned constant
          (lib/theme-script.ts) containing no user/request input — nothing here is ever
          interpolated from external data, so there is no injection surface to sanitize.
        */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <SkipLink label={dict.skipLink} />
        <Header lang={lang} dict={dict} />
        <main id="main">{children}</main>
        <Footer lang={lang} dict={dict} />
      </body>
    </html>
  );
}

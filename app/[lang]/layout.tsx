import type { Metadata } from "next";
import type { ReactNode } from "react";
import { generalSans, plexMono } from "@/app/fonts";
import type { Lang } from "@/lib/i18n/routes";
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
        {/* G1 header (skip link + nav + mode/locale chips) mounts here — T10 */}
        <main id="main">{children}</main>
        {/* G2 footer title block mounts here — T12 */}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { generalSans, plexMono } from "@/app/fonts";
import type { Lang } from "@/lib/i18n/routes";
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
      className={`${generalSans.variable} ${plexMono.variable}`}
    >
      <body>
        {/* G1 header (skip link + nav + mode/locale chips) mounts here — T10 */}
        <main id="main">{children}</main>
        {/* G2 footer title block mounts here — T12 */}
      </body>
    </html>
  );
}

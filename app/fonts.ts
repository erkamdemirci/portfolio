import localFont from 'next/font/local';
import { IBM_Plex_Mono } from 'next/font/google';

export const generalSans = localFont({
  src: './fonts/GeneralSans-Variable.woff2',
  weight: '400 700',
  display: 'swap',
  variable: '--font-general-sans',
});

export const plexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-plex-mono',
  // preload: false — T32 perf fix (see DEVIATIONS.md). Every declared font subset/weight gets
  // an eager <link rel="preload"> by default; IBM Plex Mono (4 weight x subset files) isn't
  // the LCP element's font (the hero h1 is General Sans) but was competing for the same
  // throttled-connection bandwidth priority as GeneralSans-Variable.woff2, delaying it (and,
  // per Chrome's LCP algorithm, text using a still-loading web font defers its LCP timestamp
  // to font-load completion) past the 2500ms budget on Lighthouse's mobile preset. Mono text
  // still loads (via the normal @font-face discovery path, just without the early preload
  // hint) — display: 'swap' keeps a visible fallback in the meantime either way.
  preload: false,
});

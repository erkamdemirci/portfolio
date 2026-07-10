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
});

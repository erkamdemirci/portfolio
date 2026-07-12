import type { Post } from "./types";
import { post as kurumsalWebSitesiNasilOlmali } from "./posts/kurumsal-web-sitesi-nasil-olmali";
import { post as webSitesiYaptirmaMaliyeti } from "./posts/web-sitesi-yaptirma-maliyeti";
import { post as mobilUygulamaYaptirmaSureci } from "./posts/mobil-uygulama-yaptirma-sureci";
import { post as kurumsalKimlikNedir } from "./posts/kurumsal-kimlik-nedir";
import { post as webSitesiHiziCoreWebVitals } from "./posts/web-sitesi-hizi-core-web-vitals";
import { post as nextjsIleKurumsalWebSitesi } from "./posts/nextjs-ile-kurumsal-web-sitesi";
import { post as webSitesiYenilemeNeZaman } from "./posts/web-sitesi-yenileme-ne-zaman";
import { post as seoUyumluWebSitesi } from "./posts/seo-uyumlu-web-sitesi";
import { post as tasarimSistemiNedir } from "./posts/tasarim-sistemi-nedir";
import { post as bursaWebTasarimAjansiSecerken } from "./posts/bursa-web-tasarim-ajansi-secerken";

/**
 * Blog registry (04-tasks.md T51). Static imports of all 10 post modules, ordered newest-first.
 * Every v1 post shares datePublished 2026-07-12, so this array IS the editorial display order
 * (the flagship 2026 guide leads). Consumed by the index (T55), the [slug] template + its
 * generateStaticParams (T56), and the sitemap (T69).
 */
export const posts: Post[] = [
  kurumsalWebSitesiNasilOlmali,
  webSitesiYaptirmaMaliyeti,
  mobilUygulamaYaptirmaSureci,
  kurumsalKimlikNedir,
  webSitesiHiziCoreWebVitals,
  nextjsIleKurumsalWebSitesi,
  webSitesiYenilemeNeZaman,
  seoUyumluWebSitesi,
  tasarimSistemiNedir,
  bursaWebTasarimAjansiSecerken,
];

/** All post slugs, in display order — for generateStaticParams (T56) and the sitemap (T69). */
export const postSlugs: string[] = posts.map((p) => p.meta.slug);

/** Look up one post by slug (the [slug] template + generateMetadata, T56). */
export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.meta.slug === slug);
}

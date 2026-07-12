import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/seo";
import { posts } from "@/lib/blog/posts";
import type { Lang } from "@/lib/i18n/routes";

/**
 * 7 — Blog index (03 §7). TR-only (A11): only /tr/blog is generated, so /en/blog is not a
 * generated param and 404s (dynamicParams=false). hreflang emits tr + x-default only — the blog
 * has no EN pair, so the KEEP-listed hreflang-links.tsx (which always emits an EN alternate) is
 * NOT reused here; the two links are rendered inline. Full PostCard composition lands in T55.
 */

export const dynamicParams = false;

export function generateStaticParams(): { lang: string }[] {
  return [{ lang: "tr" }];
}

export default async function BlogIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: Lang };
  if (lang !== "tr") notFound();

  return (
    <>
      <link rel="alternate" href={`${SITE_URL}/blog`} {...({ hreflang: "tr" } as Record<string, string>)} />
      <link rel="alternate" href={`${SITE_URL}/blog`} {...({ hreflang: "x-default" } as Record<string, string>)} />

      <section className="wrap pt-[var(--hero-top)] pb-[var(--pad-section)]">
        <h1 className="max-w-[16ch] font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.05] text-ink text-balance">
          Rehberler ve yazılar.
        </h1>
        <ul className="mt-10 flex flex-col divide-y divide-line border-t border-line">
          {posts.map((p) => (
            <li key={p.meta.slug} className="py-5">
              <Link href={`/blog/${p.meta.slug}`} className="font-display text-[1.35rem] leading-[1.2] text-ink">
                {p.meta.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

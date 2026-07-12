import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/seo";
import { getPost, postSlugs } from "@/lib/blog/posts";
import type { Lang } from "@/lib/i18n/routes";

/**
 * 8 — Blog post (03 §8). TR-only (A11): generateStaticParams yields only tr×slug pairs, so
 * /en/blog/<slug> and any unknown slug 404 (dynamicParams=false). hreflang tr + x-default only.
 * Full composition (breadcrumb, PostMeta, PostProse, ContactBand, back-link) + generateMetadata +
 * JSON-LD land in T56/T68.
 */

export const dynamicParams = false;

export function generateStaticParams(): { lang: string; slug: string }[] {
  return postSlugs.map((slug) => ({ lang: "tr", slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = (await params) as { lang: Lang; slug: string };
  if (lang !== "tr") notFound();
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <link rel="alternate" href={`${SITE_URL}/blog/${slug}`} {...({ hreflang: "tr" } as Record<string, string>)} />
      <link rel="alternate" href={`${SITE_URL}/blog/${slug}`} {...({ hreflang: "x-default" } as Record<string, string>)} />

      <article className="wrap pt-[var(--hero-top)] pb-[var(--pad-section)]">
        <h1 className="max-w-[20ch] font-display text-[clamp(2.2rem,4.5vw,3.2rem)] leading-[1.08] text-ink text-balance">
          {post.meta.title}
        </h1>
      </article>
    </>
  );
}

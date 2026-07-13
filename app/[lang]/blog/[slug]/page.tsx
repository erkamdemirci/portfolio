import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/seo";
import { getPost, postSlugs } from "@/lib/blog/posts";
import { JsonLd } from "@/components/seo/json-ld";
import { PostMeta } from "@/components/blog/post-meta";
import { PostProse } from "@/components/blog/post-prose";
import { TextLink } from "@/components/ui/text-link";
import { ArrowLink } from "@/components/ui/arrow-link";
import { ContactBand } from "@/components/bands/contact-band";
import { Reveal } from "@/components/motion/reveal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";

/**
 * 8 — Blog post (03 §8). TR-only (A11): generateStaticParams yields only tr×slug, dynamicParams=
 * false, so /en/blog/<slug> + unknown slugs 404. Order: breadcrumb (Blog → title) → PostMeta →
 * h1 → PostProse → ContactBand compact → back-link "Tüm yazılar →". No prev/next pager.
 * generateMetadata comes from post.meta (title "… | DMRC", description = excerpt), hreflang
 * tr + x-default only. Article + BreadcrumbList JSON-LD is added in T68.
 */

export const dynamicParams = false;

export function generateStaticParams(): { lang: string; slug: string }[] {
  return postSlugs.map((slug) => ({ lang: "tr", slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = (await params) as { slug: string };
  const post = getPost(slug);
  if (!post) return {};
  const canonical = `/blog/${slug}`;
  const title = `${post.meta.title} | DMRC`;
  const description = post.meta.excerpt;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      images: [{ url: "/og-tr.png", width: 1200, height: 630 }],
    },
  };
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

  const dict = getDictionary(lang);
  const cb = dict.home.contactBand;
  const url = `${SITE_URL}/blog/${slug}`;

  // Article + BreadcrumbList (03 §SEO table). The breadcrumb itemListElement mirrors the visible
  // "Blog → <title>" trail exactly.
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.meta.title,
    description: post.meta.excerpt,
    datePublished: post.meta.datePublished,
    dateModified: post.meta.datePublished,
    inLanguage: "tr",
    mainEntityOfPage: url,
    author: { "@type": "Person", name: "Erkam Demirci", url: `${SITE_URL}/studyo` },
    publisher: { "@type": "Organization", name: "DMRC", url: SITE_URL },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 2, name: post.meta.title, item: url },
    ],
  };

  return (
    <>
      <link rel="alternate" href={`${SITE_URL}/blog/${slug}`} {...({ hreflang: "tr" } as Record<string, string>)} />
      <link rel="alternate" href={`${SITE_URL}/blog/${slug}`} {...({ hreflang: "x-default" } as Record<string, string>)} />
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* ---------- Breadcrumb (matches BreadcrumbList JSON-LD, T68) ---------- */}
      <nav aria-label="breadcrumb" className="wrap pt-[var(--hero-top)]">
        <ol className="flex flex-wrap items-center gap-2 text-[0.86rem] leading-[1.4] text-ink-soft">
          <li>
            <TextLink href="/blog">Blog</TextLink>
          </li>
          <li aria-hidden="true">→</li>
          <li aria-current="page" className="text-ink">
            {post.meta.title}
          </li>
        </ol>
      </nav>

      {/* ---------- Header: PostMeta → h1 ---------- */}
      <header className="wrap pt-[clamp(20px,3vw,32px)] pb-[clamp(24px,3vw,40px)]">
        <PostMeta datePublished={post.meta.datePublished} readingTime={post.meta.readingTime} />
        <h1 className="mt-4 max-w-[24ch] font-display text-[clamp(2.2rem,4.5vw,3.2rem)] leading-[1.08] text-ink text-balance">
          {post.meta.title}
        </h1>
      </header>

      {/* ---------- Prose ---------- */}
      <section className="wrap pb-[var(--pad-section)]">
        <PostProse body={post.body} />
      </section>

      {/* ---------- Contact (compact) ---------- */}
      <Reveal>
        <ContactBand
          variant="compact"
          headingLevel="h2"
          heading={cb.heading}
          turn={cb.headingTurn}
          accentHref="/iletisim"
          accentLabel={cb.accentLabel}
        />
      </Reveal>

      {/* ---------- Back-link (no pager) ---------- */}
      <section className="wrap py-[clamp(32px,4vw,48px)]">
        <ArrowLink href="/blog">Tüm yazılar</ArrowLink>
      </section>
    </>
  );
}

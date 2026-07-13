import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/seo";
import { posts } from "@/lib/blog/posts";
import { SectionHead } from "@/components/layout/section-head";
import { PostCard } from "@/components/blog/post-card";
import { ContactBand } from "@/components/bands/contact-band";
import { Reveal } from "@/components/motion/reveal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";

/**
 * 7 — Blog index (03 §7). TR-only (A11): only /tr/blog is generated; /en/blog 404s
 * (dynamicParams=false). SectionHead H1 + intro → PostCard list (newest first, from the registry)
 * → ContactBand compact. hreflang tr + x-default only. The chrome strings are the 03 §7/§SEO TR
 * copy, placed here rather than the bilingual dict because the surface is TR-only.
 */

export const dynamicParams = false;

export function generateStaticParams(): { lang: string }[] {
  return [{ lang: "tr" }];
}

export function generateMetadata(): Metadata {
  const canonical = "/blog";
  const title = "Blog — Web Tasarım ve Dijital Ürün Rehberleri | DMRC";
  const description =
    "Kurumsal web siteleri, web sitesi maliyetleri, mobil uygulama ve tasarım sistemleri üzerine profesyonel rehberler. DMRC blog.";
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, images: [{ url: "/og-tr.png", width: 1200, height: 630 }] },
  };
}

export default async function BlogIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: Lang };
  if (lang !== "tr") notFound();

  const dict = getDictionary(lang);
  const cb = dict.home.contactBand;

  return (
    <>
      <link rel="alternate" href={`${SITE_URL}/blog`} {...({ hreflang: "tr" } as Record<string, string>)} />
      <link rel="alternate" href={`${SITE_URL}/blog`} {...({ hreflang: "x-default" } as Record<string, string>)} />

      {/* ---------- Head: H1 + one-line intro ---------- */}
      <Reveal>
        <section className="wrap pt-[var(--hero-top)] pb-[var(--pad-section)]">
          <SectionHead heading="Rehberler ve yazılar." headingLevel="h1" />
          <p className="mt-6 max-w-[60ch] text-[clamp(1.08rem,1.4vw,1.22rem)] leading-[1.6] text-ink-soft text-pretty">
            Kurumsal web sitesi, web sitesi maliyeti, mobil uygulama, SEO ve tasarım sistemleri
            üzerine profesyonel rehberler.
          </p>
        </section>
      </Reveal>

      {/* ---------- PostCard list (newest first) ---------- */}
      <section className="wrap pb-[var(--pad-section)]">
        <div className="flex flex-col">
          {posts.map((p) => (
            <Reveal key={p.meta.slug}>
              <PostCard
                href={`/blog/${p.meta.slug}`}
                title={p.meta.title}
                datePublished={p.meta.datePublished}
                readingTime={p.meta.readingTime}
                excerpt={p.meta.excerpt}
              />
            </Reveal>
          ))}
        </div>
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
    </>
  );
}

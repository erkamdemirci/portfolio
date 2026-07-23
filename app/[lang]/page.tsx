import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { alternatesFor, pageMetadata } from "@/lib/seo";
import { HreflangLinks } from "@/components/seo/hreflang-links";
import { JsonLd, personSchema } from "@/components/seo/json-ld";
import { ScrollFilm } from "@/components/film/scroll-film";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Lang } from "@/lib/i18n/routes";

/**
 * 1 — Home = the scroll-film ("Tek Kalemde / In One Stroke"). The page IS one continuous
 * cinematic shot: a cobalt stroke that never lifts travels hero → web → mobile → custom
 * software → principles rail → founder signature, then hands the turn to the client.
 * All copy is server-rendered (the film only enhances); the h1 is plain text and the LCP.
 * Person JSON-LD lives here now — the founder chapter replaced the retired studio page.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Lang };
  if (lang !== "tr" && lang !== "en") return { robots: "noindex" };
  return pageMetadata("home", lang);
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params) as { lang: Lang };
  // Single-segment junk paths (/foo.txt — proxy matcher excludes dotted paths) land
  // here with the filename as [lang]; the layout already fell back to TR chrome, and
  // this notFound() is caught by app/[lang]/not-found.tsx (a proper 404, not a 500).
  if (lang !== "tr" && lang !== "en") notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <HreflangLinks alt={alternatesFor("home")} />
      <JsonLd data={personSchema(lang)} />
      <ScrollFilm lang={lang} dict={dict} />
    </>
  );
}

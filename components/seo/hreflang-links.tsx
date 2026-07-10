import { SITE_URL, type PageAlternates } from "@/lib/seo";

/**
 * Renders the three `<link rel="alternate" hreflang=... href=...>` tags for a page's TR/EN/
 * x-default alternates (03-screens-and-flows.md §Locale routes: "Every page emits `hreflang`
 * alternates: `tr` -> TR URL, `en` -> EN URL, `x-default` -> the TR URL").
 *
 * T30 deviation (see DEVIATIONS.md and lib/seo.ts's `pageMetadata` doc comment): rendered by
 * hand instead of via `Metadata["alternates"]["languages"]`, because this Next.js 16.2.10
 * build serializes that metadata field's `<link>` tags with the literal JSX prop casing
 * (`hrefLang="tr"`) instead of the correct lowercase HTML attribute (`hreflang="tr"`) — a
 * framework artifact, not a design decision. The spread-with-a-plain-object trick below is
 * required because `hreflang` (all-lowercase) is not `React.LinkHTMLAttributes`' recognized
 * prop name for this attribute (that's `hrefLang`, camelCase) — spreading an untyped object
 * bypasses TypeScript's JSX prop-name check for the one attribute this component exists to
 * get right, and react-dom passes an unrecognized-name attribute through to the DOM verbatim,
 * unmodified, exactly as given.
 *
 * <link> anywhere in a Server Component's tree is hoisted into `<head>` automatically (React
 * 19's built-in resource-hoisting) — no `next/head`, no custom `<Head>` wrapper needed; every
 * consuming page just renders this once, anywhere in its returned JSX.
 */
export function HreflangLinks({ alt }: { alt: PageAlternates }) {
  const links: Array<{ hreflang: string; href: string }> = [
    { hreflang: "tr", href: `${SITE_URL}${alt.tr}` },
    { hreflang: "en", href: `${SITE_URL}${alt.en}` },
    { hreflang: "x-default", href: `${SITE_URL}${alt.xDefault}` },
  ];

  return (
    <>
      {links.map((link) => (
        // eslint-disable-next-line -- see the module doc comment: intentional lowercase-attribute passthrough
        <link key={link.hreflang} rel="alternate" href={link.href} {...({ hreflang: link.hreflang } as Record<string, string>)} />
      ))}
    </>
  );
}

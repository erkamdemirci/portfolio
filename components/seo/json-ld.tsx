import { SITE_URL } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

/**
 * JSON-LD (03 §SEO table; 04-tasks.md T67/T68). One tiny emitter + the schema builders. The
 * `<script type="application/ld+json">` sink is the standard, sanctioned JSON-LD pattern (Next
 * docs; same mechanism as the repo's pre-hydration theme script) — the payload is our OWN
 * structured data, never user input, and `<` is escaped to < so a string can never break out
 * of the script element. Organization reads lib/site-config.ts: email now; phone/whatsapp flow in
 * only when set (A10 — absent while empty).
 */

type Schema = Record<string, unknown>;

export function JsonLd({ data }: { data: Schema | Schema[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

const ORG_REF = { "@type": "Organization", name: "DMRC", url: SITE_URL };

export function organizationSchema(): Schema {
  const contactPoint: Schema = {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: siteConfig.email,
    availableLanguage: ["Turkish", "English"],
    ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
  };
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DMRC",
    alternateName: "Erkam Demirci",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bursa",
      addressRegion: "Bursa",
      addressCountry: "TR",
    },
    contactPoint,
  };
}

export function websiteSchema(lang: string): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DMRC",
    url: SITE_URL,
    inLanguage: lang === "en" ? "en" : "tr",
    publisher: ORG_REF,
  };
}

export function personSchema(lang: string): Schema {
  // The studio page retired with the 2026-07 scroll-film rebuild — the founder chapter
  // lives on the home film now, so Person anchors to the locale home.
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Erkam Demirci",
    url: `${SITE_URL}${lang === "en" ? "/en" : "/"}`,
    image: `${SITE_URL}/portrait/erkam-demirci.jpg`,
    jobTitle: lang === "en" ? "Full-stack developer & UI designer" : "Full-stack geliştirici ve arayüz tasarımcısı",
    worksFor: ORG_REF,
    sameAs: ["https://github.com/erkamdemirci"],
    address: { "@type": "PostalAddress", addressLocality: "Bursa", addressCountry: "TR" },
  };
}

export function serviceSchemas(offerings: readonly { title: string; body: string }[]): Schema[] {
  return offerings.map((offer) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: offer.title,
    serviceType: offer.title,
    description: offer.body,
    provider: ORG_REF,
    areaServed: "TR",
  }));
}

export function faqPageSchema(items: readonly { q: string; a: string }[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

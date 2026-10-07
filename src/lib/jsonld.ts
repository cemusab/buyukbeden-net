/**
 * JSON-LD üreticileri. İzinli tipler: Article, BreadcrumbList, Organization, Person, ItemList, FAQPage, WebSite.
 * Ürün/teklif/puan tipleri bu sitede kullanılmaz (testle doğrulanır).
 */
import type { AuthorEntry, DocMeta, RouteEntry } from "./content-types";
import type { SiteSettings } from "@/content/schema";

export const ALLOWED_JSONLD_TYPES = ["Article", "BreadcrumbList", "Organization", "Person", "ItemList", "FAQPage", "WebSite", "Question", "Answer", "ListItem", "WebPage"] as const;

const abs = (s: SiteSettings, p: string) => new URL(p, s.siteUrl).toString();

export function organizationLd(s: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: s.organization.name,
    url: s.siteUrl,
    ...(s.organization.sameAs.length ? { sameAs: s.organization.sameAs } : {}),
  };
}

export function websiteLd(s: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: s.siteName,
    url: s.siteUrl,
    inLanguage: "tr-TR",
  };
}

export function breadcrumbLd(s: SiteSettings, chain: RouteEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: chain.map((e, i) => ({ "@type": "ListItem", position: i + 1, name: e.label, item: abs(s, e.path) })),
  };
}

export function itemListLd(s: SiteSettings, items: { path: string; title: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, url: abs(s, it.path), name: it.title })),
  };
}

export function articleLd(s: SiteSettings, d: DocMeta, author: AuthorEntry | undefined, extra: Record<string, unknown> = {}) {
  const image = d.featuredImage?.src ?? d.seo.ogImage?.src;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: d.title,
    description: d.seo.description,
    ...(image ? { image: abs(s, image) } : {}),
    datePublished: d.publishedAt,
    dateModified: d.updatedAt,
    inLanguage: "tr-TR",
    mainEntityOfPage: abs(s, d.path),
    author: author
      ? author.isTeam
        ? { "@type": "Organization", name: author.name, url: abs(s, author.path) }
        : { "@type": "Person", name: author.name, url: abs(s, author.path) }
      : { "@type": "Organization", name: s.organization.name },
    publisher: { "@type": "Organization", name: s.organization.name, url: s.siteUrl },
    ...extra,
  };
}

export function faqLd(faq: { q: string; aText: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.aText } })),
  };
}

export function personLd(s: SiteSettings, a: AuthorEntry) {
  if (a.isTeam) {
    return { "@context": "https://schema.org", "@type": "Organization", name: a.name, url: abs(s, a.path), description: a.bio };
  }
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: a.name,
    url: abs(s, a.path),
    description: a.bio,
    jobTitle: a.role,
    ...(a.sameAs.length ? { sameAs: a.sameAs } : {}),
    worksFor: { "@type": "Organization", name: s.organization.name },
  };
}

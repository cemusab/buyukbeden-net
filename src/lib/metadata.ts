import "server-only";
import type { Metadata } from "next";
import { getSettings } from "./content";
import type { DocMeta } from "./content-types";

/** Varsayılan paylaşım görseli: src/app/og-varsayilan.png/route.tsx (build'de üretilir) */
export const DEFAULT_OG = { src: "/og-varsayilan.png", alt: "buyukbeden.net – Türkiye'nin büyük beden moda ve stil rehberi" };

/** Belge metadata'sı (mimari §16.1): benzersiz title/description, self canonical, OG, Twitter, robots. */
export function docMetadata(d: DocMeta, opts: { absoluteTitle?: boolean } = {}): Metadata {
  const s = getSettings();
  const title = d.seo.title ?? d.title;
  const image = d.seo.ogImage ?? d.featuredImage ?? s.defaultOgImage ?? DEFAULT_OG;
  const canonical = d.seo.canonical ?? d.path;
  const isArticle = !["sayfalar", "hublar"].includes(d.collection);
  return {
    title: opts.absoluteTitle ? { absolute: title } : title,
    description: d.seo.description,
    alternates: { canonical },
    robots: d.seo.index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: isArticle ? "article" : "website",
      locale: "tr_TR",
      siteName: s.siteName,
      title,
      description: d.seo.description,
      url: canonical,
      ...(image ? { images: [{ url: image.src, alt: image.alt }] } : {}),
      ...(isArticle ? { publishedTime: d.publishedAt, modifiedTime: d.updatedAt } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description: d.seo.description,
      ...(image ? { images: [image.src] } : {}),
    },
  };
}

export function simpleMetadata(p: { title: string; description: string; path: string; index?: boolean; absoluteTitle?: boolean }): Metadata {
  const s = getSettings();
  return {
    title: p.absoluteTitle ? { absolute: p.title } : p.title,
    description: p.description,
    alternates: { canonical: p.path },
    robots: p.index === false ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { type: "website", locale: "tr_TR", siteName: s.siteName, title: p.title, description: p.description, url: p.path, images: [{ url: DEFAULT_OG.src, alt: DEFAULT_OG.alt }] },
    twitter: { card: "summary_large_image", title: p.title, description: p.description, images: [DEFAULT_OG.src] },
  };
}

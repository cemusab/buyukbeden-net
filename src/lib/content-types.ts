/** Üretilmiş içerik indeksinin tipleri (src/generated/content-index.json). Saf tipler – server/istemci/script paylaşır. */
import type { Author, Collection, DocType, Homepage, SiteSettings, SizeChart, Source, Image } from "../content/schema";
import type { Silo, Topic } from "./taxonomy";

/** Markdoc `RenderableTreeNode` JSON hali (Tag nesneleri düz obje olarak serileşir). */
export type Tree = unknown;

export type RouteGroup = "pages" | "women" | "men" | "size-guides" | "brands" | "fabrics" | "guides" | "utility";
export type RouteKind = "home" | "landing" | "hub" | "doc" | "entity" | "author" | "utility";

export type RouteEntry = {
  path: string;
  parent: string | null;
  label: string;
  group: RouteGroup;
  kind: RouteKind;
  silo: Silo;
  index: boolean;
  lastModified?: string;
  ref?: { collection: Collection | "yazarlar"; id: string };
};

export type TocItem = { id: string; text: string; level: number };

export type DocMeta = {
  key: string; // `${collection}/${id}`
  collection: Collection;
  id: string;
  type: DocType;
  path: string;
  silo: Silo;
  status: "published" | "archived";
  title: string;
  label: string;
  excerpt: string;
  author: string;
  reviewedBy?: string;
  publishedAt: string;
  updatedAt: string;
  featuredImage?: Image;
  topics: Topic[];
  tags: string[];
  sizes: string[];
  fabrics: string[];
  brands: string[];
  related: string[];
  hub?: string; // hub id (kadin-elbise)
  category?: string; // hub kategorisi (hub'ın kendisi veya çocuğu için)
  subtopic?: string;
  faq: { q: string; a: Tree; aText: string }[];
  sources: Source[];
  primaryKeyword?: string;
  seo: { title?: string; description: string; canonical?: string; index: boolean; ogImage?: Image };
  shoppingCta?: { enabled: boolean; url: string; label: string; context?: string; verifiedAt: string };
  index: boolean;
  readingMinutes: number;
  wordCount: number;
  toc: TocItem[];
  headingIds: string[];
  hasFaqSlot: boolean;
  hasCtaSlot: boolean;
  /** Satır içi Markdoc alanları (shortAnswer, intro, whyItWorks, plusSizeNotes) render ağacı olarak */
  inline: Record<string, Tree>;
  /** Türe özgü frontmatter alanları (zod çıktısı) */
  fm: Record<string, unknown>;
  /** Related skorlaması sonucu (key listesi, sıralı) */
  relatedAuto: string[];
};

export type AuthorEntry = Author & { id: string; path: string };

export type ContentIndex = {
  generatedAt: string;
  settings: SiteSettings;
  homepage: Homepage;
  docs: DocMeta[];
  authors: AuthorEntry[];
  sizeCharts: (SizeChart & { id: string })[];
  manifest: RouteEntry[];
  redirects: { source: string; destination: string }[];
};

/**
 * Uygulamanın tek içerik erişim katmanı (mimari §7.4). Veriler build'de üretilen
 * src/generated/content-index.json'dan gelir; runtime'da dosya sistemi kullanılmaz.
 */
import "server-only";
import { cacheLife } from "next/cache";
import raw from "@/generated/content-index.json";
import { bodyLoaders } from "@/generated/bodies";
import type { AuthorEntry, ContentIndex, DocMeta, RouteEntry, Tree } from "./content-types";
import type { Collection } from "@/content/schema";

const index = raw as unknown as ContentIndex;

const byKey = new Map(index.docs.map((d) => [d.key, d]));
const byPath = new Map(index.docs.map((d) => [d.path, d]));
const manifestByPath = new Map(index.manifest.map((e) => [e.path, e]));

export const getSettings = () => index.settings;
export const getHomepage = () => index.homepage;
export const getManifest = (): RouteEntry[] => index.manifest;
export const getRoute = (path: string) => manifestByPath.get(path);
export const hasRoute = (path: string) => manifestByPath.has(path.split("#")[0]);

export function getDoc(collection: Collection, id: string): DocMeta | undefined {
  return byKey.get(`${collection}/${id}`);
}
export const getDocByKey = (key: string) => byKey.get(key);
export const getByPath = (path: string) => byPath.get(path);

export function listDocs(filter: (d: DocMeta) => boolean = () => true): DocMeta[] {
  return index.docs.filter(filter);
}

/** Yayın listeleri: arşiv hariç, yeni → eski */
export function listLive(filter: (d: DocMeta) => boolean = () => true): DocMeta[] {
  return index.docs
    .filter((d) => d.status !== "archived" && filter(d))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.title.localeCompare(b.title, "tr"));
}

export function getHubs(silo: "kadin" | "erkek"): DocMeta[] {
  return index.docs
    .filter((d) => d.collection === "hublar" && d.silo === silo)
    .sort((a, b) => ((a.fm.order as number) ?? 100) - ((b.fm.order as number) ?? 100) || a.title.localeCompare(b.title, "tr"));
}

export function getHubChildren(hubId: string): DocMeta[] {
  return listLive((d) => d.hub === hubId && d.collection !== "hublar");
}

export function getAuthor(id: string): AuthorEntry | undefined {
  return index.authors.find((a) => a.id === id);
}
export const getAuthors = () => index.authors;

export function getSizeChart(id: string) {
  return index.sizeCharts.find((c) => c.id === id);
}
export const getSizeCharts = () => index.sizeCharts;

export function getRelated(doc: DocMeta): DocMeta[] {
  return doc.relatedAuto.map((k) => byKey.get(k)).filter((d): d is DocMeta => !!d);
}

export function getManualRelated(doc: DocMeta): DocMeta[] {
  return doc.related.map((p) => byPath.get(p)).filter((d): d is DocMeta => !!d);
}

/** Markdoc gövde ağacı (build'de üretilmiş JSON) */
export async function getBody(key: string): Promise<Tree> {
  "use cache";
  cacheLife("max");
  const loader = bodyLoaders[key];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}

/** Bir rota ailesi için statik parametreler. Boşsa yer tutucu döner (sayfa notFound() verir). */
export const PLACEHOLDER = "__yok";
export function paramsFor<T extends Record<string, string>>(re: RegExp, map: (m: RegExpMatchArray) => T, placeholder: T): T[] {
  const out: T[] = [];
  for (const e of index.manifest) {
    const m = e.path.match(re);
    if (m) out.push(map(m));
  }
  return out.length ? out : [placeholder];
}

/**
 * Saf route fonksiyonları: URL üretimi (pathFor) ve manifest kurulumu.
 * Hem build script'i (scripts/build-content.ts) hem uygulama (src/lib/routes.ts) kullanır.
 */
import type { Collection } from "../content/schema";
import type { AuthorEntry, DocMeta, RouteEntry, RouteGroup } from "./content-types";
import { LANDING_PATHS, type LandingKey, type Silo } from "./taxonomy";

type PathInput = {
  collection: Collection;
  id: string;
  silo: Silo;
  fm: Record<string, unknown>;
};

/** Tek URL üretici. Hub'a bağlı belgelerde hub'ın kategorisi gerekir. */
export function computePath(doc: PathInput, hubCategory: (hubId: string) => string | undefined): string {
  const fm = doc.fm;
  const seg = fm.segment as string | undefined;
  const hubId = fm.hub as string | undefined;
  const silo = doc.silo;
  const inHub = () => {
    const cat = hubId ? hubCategory(hubId) : undefined;
    if (!cat) throw new Error(`hub "${hubId}" bulunamadı`);
    return `/${silo}/giyim/${cat}/${seg}`;
  };
  switch (doc.collection) {
    case "sayfalar":
      return LANDING_PATHS[fm.key as LandingKey];
    case "hublar":
      return `/${silo}/giyim/${fm.category as string}`;
    case "makaleler":
      if (silo === "ortak") return `/${(fm.section as string) ?? "rehberler"}/${seg}`;
      if (fm.section === "ayakkabi") return `/${silo}/ayakkabi/${seg}`;
      return inHub();
    case "beden-rehberleri":
      if (hubId) return inHub();
      return silo === "ortak" ? `/beden-rehberi/${seg}` : `/${silo}/beden-rehberi/${seg}`;
    case "stil-rehberleri":
      if (hubId) return inHub();
      return silo === "ortak" ? `/stil/${seg}` : `/${silo}/stil/${seg}`;
    case "kombinler":
      return `/${silo}/kombinler/${seg}`;
    case "alisveris-rehberleri":
      return `/alisveris-rehberi/${seg}`;
    case "trendler":
      return `/trendler/${seg}`;
    case "gundem":
      return `/gundem/${seg}`;
    case "markalar":
      return `/marka/${doc.id}`;
    case "kumaslar":
      return `/kumas-rehberi/${doc.id}`;
  }
}

export function groupFor(path: string): RouteGroup {
  if (path.startsWith("/kadin")) return "women";
  if (path.startsWith("/erkek")) return "men";
  if (path.startsWith("/beden-rehberi")) return "size-guides";
  if (path.startsWith("/marka")) return "brands";
  if (path.startsWith("/kumas-rehberi")) return "fabrics";
  if (
    path === "/stil" ||
    path === "/kombinler" ||
    path === "/rehberler" ||
    ["/hakkimizda", "/iletisim", "/editoryal-ilkeler", "/gizlilik", "/cerez-politikasi", "/kvkk"].includes(path)
  )
    return "pages";
  return "guides";
}

/** Belge ve yazarlardan manifest kurar. Ebeveyn = manifest'te var olan en yakın üst yol. */
export function buildRouteManifest(docs: DocMeta[], authors: AuthorEntry[]): RouteEntry[] {
  const entries: RouteEntry[] = [];
  entries.push({ path: "/", parent: null, label: "Ana Sayfa", group: "pages", kind: "home", silo: "ortak", index: true });
  for (const d of docs) {
    const kind =
      d.collection === "sayfalar"
        ? "landing"
        : d.collection === "hublar"
          ? "hub"
          : d.collection === "markalar" || d.collection === "kumaslar"
            ? "entity"
            : "doc";
    entries.push({
      path: d.path,
      parent: null,
      label: d.label,
      group: groupFor(d.path),
      kind,
      silo: d.silo,
      index: d.index,
      lastModified: d.updatedAt,
      ref: { collection: d.collection, id: d.id },
    });
  }
  for (const a of authors) {
    entries.push({
      path: a.path,
      parent: null,
      label: a.name,
      group: "guides",
      kind: "author",
      silo: "ortak",
      index: true,
      ref: { collection: "yazarlar", id: a.id },
    });
  }
  entries.push({ path: "/arama", parent: "/", label: "Arama", group: "utility", kind: "utility", silo: "ortak", index: false });

  const paths = new Set(entries.map((e) => e.path));
  // Beden Bulucu: koddan üretilen araç sayfası (src/app/(site)/beden-bulucu); veri kaynaklı beden tablolarıdır.
  entries.push({ path: "/beden-bulucu", parent: paths.has("/beden-rehberi") ? "/beden-rehberi" : "/", label: "Beden Bulucu", group: "size-guides", kind: "utility", silo: "ortak", index: true });
  paths.add("/beden-bulucu");
  for (const e of entries) {
    if (e.path === "/" || e.parent) continue;
    e.parent = parentOf(e.path, paths);
  }
  return entries;
}

export function parentOf(path: string, paths: Set<string>): string {
  if (path.startsWith("/marka/")) return paths.has("/markalar") ? "/markalar" : "/";
  if (path.startsWith("/yazar/")) return paths.has("/hakkimizda") ? "/hakkimizda" : "/";
  const parts = path.split("/").filter(Boolean);
  for (let i = parts.length - 1; i > 0; i--) {
    const p = "/" + parts.slice(0, i).join("/");
    if (paths.has(p)) return p;
  }
  return "/";
}

export function breadcrumbChain(path: string, byPath: Map<string, RouteEntry>): RouteEntry[] {
  const chain: RouteEntry[] = [];
  let cur = byPath.get(path);
  const guard = new Set<string>();
  while (cur && !guard.has(cur.path)) {
    guard.add(cur.path);
    chain.unshift(cur);
    cur = cur.parent ? byPath.get(cur.parent) : undefined;
  }
  return chain;
}

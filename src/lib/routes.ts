/**
 * Route manifest – tek kaynak (mimari §4.5). Sitemap, breadcrumb, menü ve testler bunu kullanır.
 * Saf kurulum: src/lib/routes-core.ts (build script'i de kullanır).
 */
import "server-only";
import { getManifest } from "./content";
import type { DocMeta, RouteEntry } from "./content-types";
import { breadcrumbChain } from "./routes-core";

let cache: Map<string, RouteEntry> | null = null;
const map = () => (cache ??= new Map(getManifest().map((e) => [e.path, e])));

export const routeManifest = (): RouteEntry[] => getManifest();
export const pathFor = (doc: Pick<DocMeta, "path">): string => doc.path;
export const hasRoute = (path: string): boolean => map().has(path.split("#")[0]);
export const getRouteEntry = (path: string) => map().get(path);
export const breadcrumbFor = (path: string): RouteEntry[] => breadcrumbChain(path, map());
export const indexableRoutes = () => getManifest().filter((e) => e.index);

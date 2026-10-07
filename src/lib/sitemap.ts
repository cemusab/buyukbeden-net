import "server-only";
import { getSettings } from "./content";
import type { RouteGroup } from "./content-types";
import { indexableRoutes } from "./routes";

export const SITEMAP_GROUPS = ["pages", "women", "men", "size-guides", "brands", "fabrics", "guides"] as const satisfies readonly RouteGroup[];
export type SitemapGroup = (typeof SITEMAP_GROUPS)[number];

const xmlEsc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function entries(group: SitemapGroup) {
  return indexableRoutes().filter((e) => e.group === group);
}

export function renderUrlset(group: SitemapGroup): string {
  const base = getSettings().siteUrl;
  const urls = entries(group)
    .map((e) => `  <url><loc>${xmlEsc(new URL(e.path, base).toString())}</loc>${e.lastModified ? `<lastmod>${e.lastModified}</lastmod>` : ""}</url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function renderIndex(): string {
  const base = getSettings().siteUrl;
  const items = SITEMAP_GROUPS.filter((g) => entries(g).length)
    .map((g) => {
      const last = entries(g)
        .map((e) => e.lastModified)
        .filter(Boolean)
        .sort()
        .pop();
      return `  <sitemap><loc>${base}/sitemap-${g}.xml</loc>${last ? `<lastmod>${last}</lastmod>` : ""}</sitemap>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`;
}

export const xmlResponse = (xml: string) => new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });

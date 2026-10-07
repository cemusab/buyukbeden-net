import fs from "node:fs";
import path from "node:path";
import type { ContentIndex } from "../src/lib/content-types";

export const index: ContentIndex = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "src", "generated", "content-index.json"), "utf8"));
export const manifest = index.manifest;
export const SITE = index.settings.siteUrl;
export const pagePaths = manifest.map((e) => e.path);
export const indexable = manifest.filter((e) => e.index).map((e) => e.path);
export const ALLOWED_LD = new Set(["Article", "BreadcrumbList", "Organization", "Person", "ItemList", "FAQPage", "WebSite", "Question", "Answer", "ListItem", "WebPage"]);
export const FORBIDDEN_LD = ["Product", "Offer", "AggregateRating", "Review"];
export const byType = (t: string) => index.docs.filter((d) => d.type === t);

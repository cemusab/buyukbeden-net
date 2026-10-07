/**
 * Rota dosyaları için yardımcılar: her page.tsx 3–5 satırlık sarmalayıcıdır.
 * Bilinmeyen parametre → notFound(); boş aile → yer tutucu parametre (yine 404).
 */
import "server-only";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getByPath, getManifest } from "./content";
import { docMetadata } from "./metadata";
import { DocView } from "@/components/templates/DocView";

export const PLACEHOLDER = "__yok";

/** prefix altındaki tek segmentli belge yolları için params (ör. "/kumas-rehberi" → [{slug}]) */
export function slugParams(prefix: string, key = "slug"): Record<string, string>[] {
  const re = new RegExp(`^${prefix.replace(/[-/]/g, (c) => "\\" + c)}/([^/]+)$`);
  const out = getManifest()
    .map((e) => e.path.match(re))
    .filter((m): m is RegExpMatchArray => !!m && !!getByPath(m[0]))
    .map((m) => ({ [key]: m[1] }));
  return out.length ? out : [{ [key]: PLACEHOLDER }];
}

export function docOr404(path: string) {
  const d = getByPath(path);
  if (!d) notFound();
  return d;
}

export function metaFor(path: string): Metadata {
  const d = getByPath(path);
  if (!d) return { title: "Sayfa bulunamadı", robots: { index: false, follow: true } };
  return docMetadata(d);
}

export function renderPath(path: string) {
  const d = docOr404(path);
  return <DocView doc={d} />;
}

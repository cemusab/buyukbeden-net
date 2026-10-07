/**
 * İstemci arama motoru: public/search-index.json + MiniSearch (yalnız arama kullanılınca yüklenir).
 * Türkçe normalizasyon indeks ve sorguda aynıdır (search-normalize.ts).
 */
import type MiniSearchT from "minisearch";
import { tokenizeTr } from "./search-normalize";

export type SearchDoc = { id: string; t: string; u: string; g: string; s: string; x: string; k: string; h: string };
export type SearchHit = { id: string; t: string; u: string; g: string; s: string; x: string; score: number };

export const GROUP_LABEL: Record<string, string> = {
  kadin: "Kadın",
  erkek: "Erkek",
  beden: "Beden Rehberi",
  stil: "Stil",
  kombin: "Kombinler",
  marka: "Markalar",
  kumas: "Kumaş Rehberi",
  alisveris: "Alışveriş Rehberleri",
  trend: "Trendler",
  rehber: "Rehberler",
};
export const GROUP_ORDER = ["kadin", "erkek", "beden", "stil", "kombin", "kumas", "marka", "alisveris", "trend", "rehber"];

let enginePromise: Promise<MiniSearchT<SearchDoc>> | null = null;

export function loadEngine(): Promise<MiniSearchT<SearchDoc>> {
  enginePromise ??= (async () => {
    const [{ default: MiniSearch }, res] = await Promise.all([import("minisearch"), fetch("/search-index.json")]);
    if (!res.ok) throw new Error("Arama dizini yüklenemedi");
    const docs = (await res.json()) as SearchDoc[];
    const ms = new MiniSearch<SearchDoc>({
      fields: ["t", "k", "h", "x"],
      storeFields: ["t", "u", "g", "s", "x"],
      tokenize: (text) => tokenizeTr(text),
      processTerm: (term) => term || null,
      searchOptions: {
        boost: { t: 3, k: 2.5, h: 1.5, x: 1 },
        prefix: true,
        fuzzy: (term) => (term.length > 5 ? 0.25 : term.length > 3 ? 1 : 0),
      },
    });
    ms.addAll(docs);
    return ms;
  })();
  enginePromise.catch(() => {
    enginePromise = null;
  });
  return enginePromise;
}

export function runSearch(ms: MiniSearchT<SearchDoc>, query: string, limit = 30): SearchHit[] {
  let tokens = tokenizeTr(query);
  if (!tokens.length) return [];
  let silo: string | null = null;
  if (tokens.includes("kadin")) silo = "kadin";
  else if (tokens.includes("erkek")) silo = "erkek";
  if (silo && tokens.length > 1) tokens = tokens.filter((t) => t !== silo);
  const q = tokens.join(" ");
  const opts = {
    boostDocument: (_id: unknown, _term: string, stored?: Record<string, unknown>) => (silo && stored?.s === silo ? 2 : 1),
  };
  let res = ms.search(q, { ...opts, combineWith: "AND" });
  if (!res.length) res = ms.search(q, { ...opts, combineWith: "OR" });
  if (silo) res = res.filter((r) => r.s === silo || r.s === "ortak");
  return res.slice(0, limit).map((r) => ({ id: String(r.id), t: r.t, u: r.u, g: r.g, s: r.s, x: r.x, score: r.score }));
}

export function groupHits(hits: SearchHit[], perGroup = 5) {
  const groups = new Map<string, SearchHit[]>();
  for (const h of hits) {
    const arr = groups.get(h.g) ?? [];
    if (arr.length < perGroup) arr.push(h);
    groups.set(h.g, arr);
  }
  // Grup sırası: en iyi sonucun grubu önce, ardından sabit sıra
  const first = hits[0]?.g;
  return [...groups.entries()]
    .sort(([a], [b]) => (a === first ? -1 : b === first ? 1 : GROUP_ORDER.indexOf(a) - GROUP_ORDER.indexOf(b)))
    .map(([g, items]) => ({ group: g, label: GROUP_LABEL[g] ?? g, items }));
}

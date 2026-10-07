/**
 * Arama için Türkçe normalizasyon (mimari "Site içi arama"). İndeks (build) ve istemci aynı fonksiyonu kullanır.
 */
import { foldTr } from "./slugify";

const STOP = new Set(["ve", "ile", "icin", "bir", "mi", "mu", "nasil", "ne", "nedir", "da", "de"]);

const PHRASES: [RegExp, string][] = [
  [/\bt[\s-]?shirt\b/g, "tisort"],
  [/\btshirt\b/g, "tisort"],
  [/\bplus\s*size\b/g, "buyuk beden"],
  [/\bbattal\b/g, "buyuk beden"],
  [/\bbayan\b/g, "kadin"],
  [/\bbay\b/g, "erkek"],
  [/\besofman takimi\b/g, "esofman"],
  [/\blikra\b/g, "elastan"],
  [/\blycra\b/g, "elastan"],
  [/\bxxxxl\b/g, "4xl"],
  [/\bxxxl\b/g, "3xl"],
  [/\bxxl\b/g, "2xl"],
];

/** Metni normalize eder (birleşik boşluklu dize). */
export function normalizeTr(input: string): string {
  let s = foldTr(input).replace(/[^a-z0-9\s]+/g, " ");
  s = s.replace(/(\d)\s*x\s*l\b/g, "$1xl");
  for (const [re, rep] of PHRASES) s = s.replace(re, rep);
  return s.replace(/\s+/g, " ").trim();
}

/** Sorgu/indeks terimlerine böler, durak kelimeleri atar. */
export function tokenizeTr(input: string): string[] {
  return normalizeTr(input)
    .split(" ")
    .filter((t) => t && !STOP.has(t));
}

/**
 * Marka ↔ beden verisi (saf; sunucu bileşenleri, istemci filtresi ve build script'i ortak kullanır).
 * Marka sayfası özeti, marka dizini filtresi, {% marka-filtresi %} ve kategori bloğu aynı türetmeyi kullanır:
 * – Kaynak 1: markaya bağlı kaynaklı beden tabloları (content/beden-tablolari, `brand` alanı ya da birebir marka adı).
 * – Kaynak 2: marka dosyasındaki `sizeRange` (yalnız `unverified` içinde değilse).
 * Harf ↔ numara arasında çeviri yapılmaz (uydurma olur); yalnız tablonun kendi satırındaki karşılık kullanılır.
 */
import {
  chartConfidence,
  CONFIDENCE_LEVELS,
  euNumber,
  isFootwear,
  isMeasure,
  normLetter,
  numericParts,
  type ChartWithId,
  type Confidence,
  type Gender,
  type MeasureChartWithId,
  type MeasurementType,
} from "./size-core";

/** Marka belgesinin bu modülün kullandığı kısmı (DocMeta ile uyumlu). */
export type BrandInput = { id: string; path: string; label: string; tags: string[]; fm: Record<string, unknown> };

export const LETTER_ORDER = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL", "10XL", "11XL", "12XL", "13XL"] as const;

export function letterIndex(s: string, g: Gender): number | undefined {
  const i = (LETTER_ORDER as readonly string[]).indexOf(normLetter(s, g));
  return i >= 0 ? i : undefined;
}

export type SizeCover = {
  gender: Gender;
  system: "num" | "harf";
  /** Numara sisteminin adı (TR, EU, DE) – yalnız num */
  numSystem?: string;
  lo: number;
  hi: number;
  from: string;
  to: string;
  basis: "chart" | "brand";
  chartId?: string;
  productType?: string;
  measurementType?: MeasurementType;
  confidence: Confidence;
  sourceLabel: string;
  /** chart: kaynağın dış URL'si; brand: marka sayfasındaki kaynaklar bölümü */
  sourceUrl: string;
  checkedAt: string;
};

const norm = (s: string) => s.toLocaleLowerCase("tr").replace(/[^a-z0-9ğüşıöç&]/g, "");

export const hiddenFields = (b: BrandInput) => new Set((b.fm.unverified as string[] | undefined) ?? []);
export const brandGenders = (b: BrandInput) => ((b.fm.genders as Gender[] | undefined) ?? []).filter((g) => g === "kadin" || g === "erkek");
/** Ayakkabı markası: beden aralığı ayakkabı numarasıdır, giyim bedeniyle eşleştirilmez. */
export const isFootwearBrand = (b: BrandInput) => b.tags.includes("buyuk-numara") || b.tags.includes("ayakkabi");
/** Doğrulanmış kategoriler (unverified'da değilse) */
export function brandCategories(b: BrandInput): string[] {
  return hiddenFields(b).has("categories") ? [] : ((b.fm.categories as string[] | undefined) ?? []);
}

/** Markaya bağlı tablolar: `brand` alanı ya da (alan yoksa) marka adıyla birebir eşleşen tablo adı. */
export function brandCharts(b: BrandInput, charts: ChartWithId[]): ChartWithId[] {
  const name = norm(String(b.fm.name ?? b.label));
  return charts.filter((c) => (c.brand ? c.brand === b.id : norm(c.brandName) === name));
}

function chartCovers(c: MeasureChartWithId, today: string): SizeCover[] {
  if (isFootwear(c) || c.productType === "ic-giyim") return [];
  const src = c.sources.find((s) => s.url === c.sourceUrl) ?? c.sources[0];
  const base = {
    gender: c.gender,
    basis: "chart" as const,
    chartId: c.id,
    productType: c.productType,
    measurementType: c.measurementType,
    confidence: chartConfidence(c, today),
    sourceLabel: src.label,
    sourceUrl: c.sourceUrl,
    checkedAt: c.lastVerifiedAt,
  };
  const out: SizeCover[] = [];
  const nums = c.rows.flatMap((r) => {
    const e = euNumber(c, r);
    return e ? numericParts(e) : [];
  });
  if (nums.length) {
    const sys = ["TR", "EU", "DE"].includes(c.countrySystem) ? c.countrySystem : c.rows.some((r) => r.equivalents?.EU) ? "EU" : "TR";
    const lo = Math.min(...nums);
    const hi = Math.max(...nums);
    out.push({ ...base, system: "num", numSystem: sys, lo, hi, from: String(lo), to: String(hi) });
  }
  const letters = c.rows.map((r) => (r.letterSize ? letterIndex(r.letterSize, c.gender) : undefined)).filter((x): x is number => x !== undefined);
  if (letters.length) {
    const lo = Math.min(...letters);
    const hi = Math.max(...letters);
    out.push({ ...base, system: "harf", lo, hi, from: LETTER_ORDER[lo], to: LETTER_ORDER[hi] });
  }
  return out;
}

/** Markanın tüm doğrulanmış beden kapsamları (önce tablolar, sonra marka beden aralığı). */
export function brandCovers(b: BrandInput, charts: ChartWithId[], today: string): SizeCover[] {
  const out: SizeCover[] = [];
  for (const c of brandCharts(b, charts)) if (isMeasure(c)) out.push(...chartCovers(c, today));
  const range = b.fm.sizeRange as Record<string, { from: string; to: string; system: string }> | null | undefined;
  if (range && !hiddenFields(b).has("sizeRange") && !isFootwearBrand(b)) {
    for (const g of brandGenders(b)) {
      const r = range[g];
      if (!r) continue;
      const base = {
        gender: g,
        basis: "brand" as const,
        confidence: "orta" as const,
        sourceLabel: "Marka dosyası (markanın resmi sitesindeki beden bilgisi)",
        sourceUrl: `${b.path}#kaynaklar`,
        checkedAt: String(b.fm.lastVerifiedAt),
      };
      if (r.system === "harf") {
        const lo = letterIndex(r.from, g);
        const hi = letterIndex(r.to, g);
        if (lo !== undefined && hi !== undefined && lo <= hi) out.push({ ...base, system: "harf", lo, hi, from: r.from, to: r.to });
      } else {
        const lo = Number(r.from);
        const hi = Number(r.to);
        if (Number.isFinite(lo) && Number.isFinite(hi) && lo <= hi) out.push({ ...base, system: "num", numSystem: r.system, lo, hi, from: r.from, to: r.to });
      }
    }
  }
  return out;
}

/** Kullanıcının yazdığı beden: "52" → numara, "4xl" / "XXXL" → harf. Tanınmazsa undefined. */
export function parseSizeQuery(raw: string, g?: Gender): { system: "num" | "harf"; value: number; label: string } | undefined {
  const s = raw.trim().toUpperCase().replace(/\s+/g, "");
  if (!s) return undefined;
  if (/^\d{2,3}$/.test(s)) return { system: "num", value: Number(s), label: s };
  const i = letterIndex(s, g ?? "kadin") ?? letterIndex(s, "erkek");
  return i === undefined ? undefined : { system: "harf", value: i, label: LETTER_ORDER[i] };
}

const rank = (c: SizeCover) => CONFIDENCE_LEVELS.indexOf(c.confidence) * 2 + (c.basis === "chart" ? 0 : 1);

/** Kapsamlar içinde bedeni içeren en güvenilir kapsam. */
export function matchCover(covers: SizeCover[], size: string, g?: Gender): SizeCover | undefined {
  const q = parseSizeQuery(size, g);
  if (!q) return undefined;
  return covers
    .filter((c) => (!g || c.gender === g) && c.system === q.system && q.value >= c.lo && q.value <= c.hi)
    .sort((a, b) => rank(a) - rank(b))[0];
}

export function coverText(c: Pick<SizeCover, "from" | "to" | "system" | "numSystem">): string {
  const r = c.from === c.to ? c.from : `${c.from}–${c.to}`;
  return c.system === "num" ? `${r} (${c.numSystem ?? "numara"})` : r;
}

export function coverKind(c: SizeCover): string {
  if (c.basis === "brand") return "Marka beden aralığı (tablo yok)";
  return c.measurementType === "garment" ? "Ürün ölçüsü tablosu" : "Vücut ölçüsü tablosu";
}

/** Marka kategori içeriyor mu: doğrulanmış kategori listesi ya da bu ürün tipinde kaynaklı tablo. */
export function brandHasCategory(b: BrandInput, charts: ChartWithId[], cat: string, g?: Gender): boolean {
  return brandCategories(b).includes(cat) || brandCharts(b, charts).some((c) => c.productType === cat && (!g || c.gender === g));
}

export type SizeMatch = { brand: BrandInput; cover: SizeCover; category: boolean };

/** Bedeni (ve varsa cinsiyeti) doğrulanmış kapsamlarla içeren markalar; kategori eşleşenler önce. */
export function brandsForSize(brands: BrandInput[], charts: ChartWithId[], q: { size: string; gender?: Gender; kategori?: string }, today: string): SizeMatch[] {
  const out: SizeMatch[] = [];
  for (const b of brands) {
    if (q.gender && !brandGenders(b).includes(q.gender)) continue;
    const cover = matchCover(brandCovers(b, charts, today), q.size, q.gender);
    if (!cover) continue;
    out.push({ brand: b, cover, category: q.kategori ? brandHasCategory(b, charts, q.kategori, q.gender) : false });
  }
  return out.sort((a, b) => Number(b.category) - Number(a.category) || rank(a.cover) - rank(b.cover) || a.brand.label.localeCompare(b.brand.label, "tr"));
}

/** Kategori bloğu: kategori tablosu > genel tablo > marka beden aralığı. */
export function brandsForCategory(brands: BrandInput[], charts: ChartWithId[], g: Gender, cat: string, today: string): { brand: BrandInput; cover: SizeCover }[] {
  const out: { brand: BrandInput; cover: SizeCover }[] = [];
  for (const b of brands) {
    if (!brandGenders(b).includes(g) || !brandHasCategory(b, charts, cat, g)) continue;
    const covers = brandCovers(b, charts, today).filter((c) => c.gender === g);
    const pick =
      covers.filter((c) => c.basis === "chart" && c.productType === cat).sort((a, c) => rank(a) - rank(c))[0] ??
      covers.filter((c) => c.basis === "chart" && c.productType === "genel").sort((a, c) => rank(a) - rank(c))[0] ??
      covers.find((c) => c.basis === "brand");
    if (pick) out.push({ brand: b, cover: pick });
  }
  return out.sort((a, b) => rank(a.cover) - rank(b.cover) || a.brand.label.localeCompare(b.brand.label, "tr"));
}

/** Türkiye erişimi metni (yalnız doğrulanmış alanlar). */
export function trAccess(b: BrandInput): string | null {
  const a = (b.fm.availabilityTR as { online: boolean | null; stores: boolean | null } | undefined) ?? { online: null, stores: null };
  const h = hiddenFields(b);
  const parts = [a.online === true && !h.has("online") && !h.has("availabilityTR") ? "Online" : null, a.stores === true && !h.has("stores") ? "Mağaza" : null].filter(Boolean);
  return parts.length ? parts.join(" + ") : null;
}

/**
 * Beden verisi çekirdeği (saf; sunucu, build script'i ve istemci bileşeni ortak kullanır).
 * CLAUDE.md "Beden Kuralları" 2–6, docs/beden-veri-migrasyonu.md.
 * – Ölçüler aralık olarak tutulur ({min,max}); kaynak tek değer veriyorsa min = max.
 * – Kaynak birimi saklanır (cm | inch); arayüz cm'ye çevirir ve çeviriyi belirtir.
 * – Markalar arası karşılaştırmalar elle değil, aynı ölçü türündeki marka tablolarından türetilir.
 */
import type { SizeChart } from "../content/schema";

export const GENDERS = ["kadin", "erkek"] as const;
export type Gender = (typeof GENDERS)[number];

/** Aralık olarak tutulan ölçü alanları (satır düzeyi). */
export const RANGE_FIELDS = [
  "bust",
  "chest",
  "underbust",
  "cupDifference",
  "waist",
  "hip",
  "neck",
  "shoulder",
  "sleeve",
  "inseam",
  "upperArm",
  "chestWidth",
  "length",
] as const;
export type RangeField = (typeof RANGE_FIELDS)[number];
export type Range = { min: number; max: number };

/** Yalnız ürün (giysi) ölçüsü tablolarında anlamlı alanlar. */
export const GARMENT_ONLY_FIELDS: readonly RangeField[] = ["chestWidth", "length"];

export const FIELD_LABEL: Record<RangeField, { kadin: string; erkek: string }> = {
  bust: { kadin: "Göğüs", erkek: "Göğüs" },
  chest: { kadin: "Göğüs", erkek: "Göğüs" },
  underbust: { kadin: "Göğüs altı", erkek: "Göğüs altı" },
  cupDifference: { kadin: "Göğüs − göğüs altı farkı", erkek: "Göğüs − göğüs altı farkı" },
  waist: { kadin: "Bel", erkek: "Bel" },
  hip: { kadin: "Basen", erkek: "Kalça" },
  neck: { kadin: "Boyun", erkek: "Yaka (boyun)" },
  shoulder: { kadin: "Omuz", erkek: "Omuz" },
  sleeve: { kadin: "Kol", erkek: "Kol" },
  inseam: { kadin: "İç bacak", erkek: "İç bacak" },
  upperArm: { kadin: "Üst kol", erkek: "Üst kol" },
  chestWidth: { kadin: "Göğüs eni (tek kat)", erkek: "Göğüs eni (tek kat)" },
  length: { kadin: "Boy (giysi)", erkek: "Boy (giysi)" },
};

export const PRODUCT_TYPES = ["genel", "ust-giyim", "alt-giyim", "elbise", "pantolon", "jean", "gomlek", "ceket", "triko", "tisort", "ic-giyim"] as const;
export const PRODUCT_TYPE_LABEL: Record<(typeof PRODUCT_TYPES)[number], string> = {
  genel: "Genel",
  "ust-giyim": "Üst giyim",
  "alt-giyim": "Alt giyim",
  elbise: "Elbise",
  pantolon: "Pantolon",
  jean: "Jean",
  gomlek: "Gömlek",
  ceket: "Ceket",
  triko: "Triko",
  tisort: "Tişört",
  "ic-giyim": "İç giyim",
};

/** Satırdaki numerik bedenin sistemi. */
export const COUNTRY_SYSTEMS = ["TR", "EU", "DE", "UK", "US", "IT", "harf", "marka"] as const;
export type CountrySystem = (typeof COUNTRY_SYSTEMS)[number];

/** Satırda numerik bedenin yanında verilen diğer karşılıklar (kaynakta yazdığı gibi). */
export const EQUIV_KEYS = ["TR", "EU", "DE", "UK", "US", "IT", "jean", "kisa", "uzun", "normal", "marka"] as const;
export type EquivKey = (typeof EQUIV_KEYS)[number];
export const EQUIV_LABEL: Record<EquivKey, string> = {
  TR: "TR",
  EU: "EU",
  DE: "DE",
  UK: "UK",
  US: "US",
  IT: "IT",
  jean: "Jean bedeni",
  kisa: "Kısa boy bedeni",
  uzun: "Uzun boy bedeni",
  normal: "Normal beden karşılığı",
  marka: "Markanın kendi bedeni",
};

export const MEASUREMENT_TYPES = ["body", "garment"] as const;
export type MeasurementType = (typeof MEASUREMENT_TYPES)[number];
export const MEASUREMENT_TYPE_LABEL: Record<MeasurementType, string> = {
  body: "Vücut ölçüsü",
  garment: "Ürün (giysi) ölçüsü",
};

/** Öncelik sırası: official_brand > manufacturer > distributor > generic */
export const CHART_SOURCE_TYPES = ["official_brand", "manufacturer", "distributor", "generic"] as const;
export type ChartSourceType = (typeof CHART_SOURCE_TYPES)[number];
export const CHART_SOURCE_TYPE_LABEL: Record<ChartSourceType, string> = {
  official_brand: "Markanın resmi tablosu",
  manufacturer: "Üretici tablosu",
  distributor: "Distribütör / satıcı tablosu",
  generic: "Genel / yaklaşık referans tablo",
};

export const FIT_TYPES = ["regular", "slim", "comfort", "relaxed", "tall", "short", "curve"] as const;
export const FIT_TYPE_LABEL: Record<(typeof FIT_TYPES)[number], string> = {
  regular: "Normal kalıp",
  slim: "Dar kalıp",
  comfort: "Rahat kalıp",
  relaxed: "Bol kalıp",
  tall: "Uzun boy serisi",
  short: "Kısa boy serisi",
  curve: "Curve serisi",
};
export const STRETCH_LEVELS = ["none", "low", "high"] as const;
export const STRETCH_LABEL: Record<(typeof STRETCH_LEVELS)[number], string> = { none: "Esnemez", low: "Az esner", high: "Çok esner" };

export const INCH_CM = 2.54;
/** Kaynak tarihi bu kadar günden eskiyse validate uyarır (≈ 6 ay). */
export const FRESHNESS_DAYS = 183;

type MeasureChart = Extract<SizeChart, { kind: "olcu" }>;
type ChartRow = MeasureChart["rows"][number];
export type ChartWithId = SizeChart & { id: string };
export type MeasureChartWithId = MeasureChart & { id: string };

export const isMeasure = (c: ChartWithId): c is MeasureChartWithId => c.kind === "olcu";

export function toCm(v: number, unit: "cm" | "inch"): number {
  return unit === "inch" ? v * INCH_CM : v;
}
export function rangeCm(r: Range, unit: "cm" | "inch"): Range {
  return { min: toCm(r.min, unit), max: toCm(r.max, unit) };
}

/** Türkçe sayı: virgül, en çok bir ondalık. */
export function fmtNum(n: number, digits = 1): string {
  const f = 10 ** digits;
  const r = Math.round(n * f) / f;
  return String(r).replace(".", ",");
}

/** "118–122" (tek değerse "118"); inç kaynak cm'ye yuvarlanır. */
export function fmtRangeValue(r: Range, unit: "cm" | "inch" = "cm"): string {
  const digits = unit === "inch" ? 0 : 1;
  const a = fmtNum(toCm(r.min, unit), digits);
  const b = fmtNum(toCm(r.max, unit), digits);
  return a === b ? a : `${a}–${b}`;
}
export function fmtRange(r: Range, unit: "cm" | "inch" = "cm"): string {
  return `${fmtRangeValue(r, unit)} cm`;
}
export function fmtInch(r: Range): string {
  const a = fmtNum(r.min, 2);
  const b = fmtNum(r.max, 2);
  return a === b ? `${a} in` : `${a}–${b} in`;
}

export function fieldLabel(chart: Pick<MeasureChart, "gender" | "fieldLabels">, f: RangeField): string {
  return chart.fieldLabels?.[f] ?? FIELD_LABEL[f][chart.gender];
}

/** Satırın kısa adı: "48 / 4XL", "UK 20", "4XL". */
export function rowLabel(chart: Pick<MeasureChart, "countrySystem">, row: Pick<ChartRow, "numericSize" | "letterSize">): string {
  const prefix = chart.countrySystem === "UK" || chart.countrySystem === "US" || chart.countrySystem === "IT" ? `${chart.countrySystem} ` : "";
  const num = row.numericSize ? `${prefix}${row.numericSize}` : "";
  if (num && row.letterSize) return `${num} / ${row.letterSize}`;
  return num || row.letterSize || "–";
}

/** Harf bedeni karşılaştırma için normalleştirir: XXL ≡ 2XL, XXXL ≡ 3XL; erkekte "4X" ≡ 4XL (Kiğılı yazımı). */
export function normLetter(s: string, gender: Gender): string {
  let x = s.toUpperCase().replace(/\s+/g, "");
  const m = x.match(/^(X+)L$/);
  if (m && m[1].length >= 2) x = `${m[1].length}XL`;
  if (gender === "erkek" && /^\d+X$/.test(x)) x = `${x}L`;
  return x;
}

/** "48–50", "46/48", "48" → [48, 50] / [46, 48] / [48] */
function numericParts(s: string): number[] {
  return s
    .split(/[–\-/]/)
    .map((p) => Number(p.trim().replace(",", ".")))
    .filter((n) => Number.isFinite(n));
}

/** Satırın EU/TR numerik karşılığı (yalnız kaynak verdiyse). */
function euNumber(chart: Pick<MeasureChart, "countrySystem">, row: ChartRow): string | undefined {
  if (["TR", "EU", "DE"].includes(chart.countrySystem)) return row.numericSize;
  return row.equivalents?.EU ?? row.equivalents?.TR ?? row.equivalents?.DE;
}

/** Bir satır verilen bedene (numara ya da harf) denk geliyor mu? */
export function rowMatchesSize(chart: MeasureChart, row: ChartRow, size: string, allRows: ChartRow[]): boolean {
  const s = size.trim();
  if (/^\d+$/.test(s)) {
    const n = Number(s);
    const eu = euNumber(chart, row);
    if (!eu) return false;
    return numericParts(eu).includes(n);
  }
  if (!row.letterSize) return false;
  // Aynı tabloda hem "XXL" hem "2XL" varsa (ör. Duke: normal seri XXL ≠ king seri 2XL) yalnız birebir eşleşme
  const exact = allRows.some((r) => r.letterSize?.toUpperCase() === s.toUpperCase());
  if (exact) return row.letterSize.toUpperCase() === s.toUpperCase();
  return normLetter(row.letterSize, chart.gender) === normLetter(s, chart.gender);
}

/**
 * Aralık örtüşmesi: aralıklarda uç noktaya değmek (ve inç çevirisinden doğan 0,5 cm'den küçük taşma) sayılmaz;
 * tek değerli satırlarda uç dahil.
 */
export function overlaps(row: Range, band: Range): boolean {
  const eps = 0.5;
  if (row.min === row.max) return row.min >= band.min && row.min <= band.max;
  if (band.min === band.max) return band.min >= row.min && band.min <= row.max;
  return row.min < band.max - eps && row.max > band.min + eps;
}

/* ------------------------------------------------------------------ */
/* Türetilmiş karşılaştırma ({% beden-karsilastirma %} / sizeComparisons) */
/* ------------------------------------------------------------------ */

export type ComparisonSpec = {
  gender: Gender;
  measurementType: MeasurementType;
  /** Gösterilecek ölçüler; ilki eşleştirme ve sıralama ölçüsüdür. */
  olcu: RangeField[];
  /** Tek beden: satırlar markalar */
  size?: string;
  /** Beden listesi: satırlar bedenler, sütunlar markalar (tek ölçü) */
  sizes?: string[];
  /** Tek ölçü değeri (cm) ± tolerans: satırlar markaların bu ölçüye değen bedenleri */
  value?: number;
  tolerans?: number;
  /** Ölçü bantları (cm): satırlar bantlar, sütunlar markalar */
  values?: Range[];
  /** Yalnız bu tablolar (id listesi) */
  charts?: string[];
  productType?: string;
  /** Giysi eni varsa "en × 2" yaklaşık çevre sütunu (bizim hesabımız) */
  cevre?: boolean;
  baslik?: string;
};

export type ComparisonSource = { n: number; chartId: string; brandName: string; label: string; url: string; sourceType: ChartSourceType; lastVerifiedAt: string; unit: "cm" | "inch" };
export type ComparisonCell = { field: RangeField; range: Range; text: string; inch?: string };
export type ComparisonListRow = {
  chartId: string;
  brandName: string;
  sizeLabel: string;
  productType: string;
  cells: Partial<Record<RangeField, ComparisonCell>>;
  source: number;
  uncertain: boolean;
  sortKey: number;
};
export type ComparisonMatrix = {
  rowLabels: string[];
  columns: { chartId: string; brandName: string; source: number; uncertain: boolean; productType: string }[];
  /** cells[satır][sütun] = o markanın bu satıra denk gelen bedenleri */
  cells: { sizeLabel?: string; cell: ComparisonCell }[][][];
};
export type ComparisonResult = {
  mode: "list" | "matrix";
  spec: ComparisonSpec;
  title: string;
  fields: RangeField[];
  list: ComparisonListRow[];
  matrix?: ComparisonMatrix;
  sources: ComparisonSource[];
  hasInch: boolean;
  hasUncertain: boolean;
};

function cellOf(chart: MeasureChart, f: RangeField, r: Range): ComparisonCell {
  return { field: f, range: rangeCm(r, chart.unit), text: fmtRange(r, chart.unit), inch: chart.unit === "inch" ? fmtInch(r) : undefined };
}

export function parseBands(s: string): Range[] {
  return s
    .split(",")
    .map((p) => numericParts(p))
    .filter((p) => p.length)
    .map((p) => ({ min: p[0], max: p[p.length - 1] }));
}

/** Etiket özniteliklerinden (string) spec üretir; hatalı ise mesaj döner. */
export function specFromAttrs(a: Record<string, unknown>): { spec?: ComparisonSpec; error?: string } {
  const gender = a.gender as Gender;
  const measurementType = a.measurementType as MeasurementType;
  if (!GENDERS.includes(gender)) return { error: `gender "${String(a.gender)}" kadin veya erkek olmalı` };
  if (!MEASUREMENT_TYPES.includes(measurementType)) return { error: `measurementType "${String(a.measurementType)}" body veya garment olmalı` };
  const olcu = String(a.olcu ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean) as RangeField[];
  if (!olcu.length) return { error: "olcu boş" };
  for (const f of olcu) if (!RANGE_FIELDS.includes(f)) return { error: `olcu "${f}" tanımlı değil (${RANGE_FIELDS.join(", ")})` };
  const list = (v: unknown) =>
    v == null || v === ""
      ? undefined
      : Array.isArray(v)
        ? (v as string[]).map(String)
        : String(v)
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean);
  const spec: ComparisonSpec = {
    gender,
    measurementType,
    olcu,
    size: a.size != null && a.size !== "" ? String(a.size) : undefined,
    sizes: list(a.sizes),
    value: a.value != null && a.value !== "" ? Number(a.value) : undefined,
    tolerans: a.tolerans != null && a.tolerans !== "" ? Number(a.tolerans) : undefined,
    values: a.values ? (Array.isArray(a.values) ? (a.values as Range[]) : parseBands(String(a.values))) : undefined,
    charts: list(a.charts),
    productType: a.productType ? String(a.productType) : undefined,
    cevre: a.cevre === true || a.cevre === "true",
    baslik: a.baslik ? String(a.baslik) : undefined,
  };
  const modes = [spec.size, spec.sizes, spec.value, spec.values].filter((x) => x !== undefined).length;
  if (modes !== 1) return { error: "size, sizes, value veya values özniteliklerinden tam biri verilmeli" };
  if ((spec.sizes || spec.values) && olcu.length !== 1) return { error: "sizes / values (matris) için tek olcu verilmeli" };
  if (spec.value !== undefined && !Number.isFinite(spec.value)) return { error: "value sayı olmalı" };
  return { spec };
}

function defaultTitle(spec: ComparisonSpec): string {
  const g = spec.gender === "kadin" ? "Kadın" : "Erkek";
  const f = FIELD_LABEL[spec.olcu[0]][spec.gender].toLocaleLowerCase("tr");
  const t = MEASUREMENT_TYPE_LABEL[spec.measurementType].toLocaleLowerCase("tr");
  if (spec.size) return `${g} ${spec.size} beden, markalara göre (${t})`;
  if (spec.value !== undefined) return `${g}: yaklaşık ${fmtNum(spec.value)} cm ${f}, markaya göre beden (${t})`;
  if (spec.values) return `${g}: aynı ${f} ölçüsü, markaya göre beden (${t})`;
  return `${g} ${f} ölçüsü, markalara göre (${t})`;
}

/**
 * Karşılaştırmayı türetir. Hatalar (karışık ölçü türü, bilinmeyen tablo, boş sonuç) `errors` ile döner;
 * build bunları içerik hatası sayar, render tarafı boş sonucu göstermez.
 */
export function buildComparison(all: ChartWithId[], spec: ComparisonSpec): { result?: ComparisonResult; errors: string[] } {
  const errors: string[] = [];
  let pool = all.filter(isMeasure);
  if (spec.charts) {
    const picked: MeasureChartWithId[] = [];
    for (const id of spec.charts) {
      const c = all.find((x) => x.id === id);
      if (!c) errors.push(`charts: "${id}" content/beden-tablolari/ içinde yok`);
      else if (!isMeasure(c)) errors.push(`charts: "${id}" bir dönüşüm tablosu; karşılaştırmaya alınamaz`);
      else {
        if (c.measurementType !== spec.measurementType)
          errors.push(`charts: "${id}" ölçü türü ${c.measurementType}; karşılaştırma ${spec.measurementType} (vücut ve ürün ölçüsü karıştırılamaz)`);
        if (c.gender !== spec.gender) errors.push(`charts: "${id}" ${c.gender} tablosu; karşılaştırma ${spec.gender}`);
        picked.push(c);
      }
    }
    pool = picked;
  }
  pool = pool.filter(
    (c) => c.gender === spec.gender && c.measurementType === spec.measurementType && (!spec.productType || c.productType === spec.productType),
  );
  const main = spec.olcu[0];
  // Tek beden listesinde istenen ölçülerden biri yeterli (ör. aynı markanın yalnız bel veren pantolon tablosu);
  // ölçüye göre eşleşen modlarda ana ölçü zorunlu.
  const needsMain = spec.size === undefined;
  pool = pool.filter((c) => c.rows.some((r) => (needsMain ? r[main] : spec.olcu.some((f) => r[f]))));
  const sources: ComparisonSource[] = [];
  const srcOf = (c: MeasureChartWithId) => {
    let s = sources.find((x) => x.chartId === c.id);
    if (!s) {
      const src = c.sources.find((x) => x.url === c.sourceUrl) ?? c.sources[0];
      s = { n: sources.length + 1, chartId: c.id, brandName: c.brandName, label: src.label, url: c.sourceUrl, sourceType: c.sourceType, lastVerifiedAt: c.lastVerifiedAt, unit: c.unit };
      sources.push(s);
    }
    return s.n;
  };
  const fields = spec.olcu.filter((f) => pool.some((c) => c.rows.some((r) => r[f])));
  const list: ComparisonListRow[] = [];
  let matrix: ComparisonMatrix | undefined;

  if (spec.size !== undefined || spec.value !== undefined) {
    const band = spec.value !== undefined ? { min: spec.value - (spec.tolerans ?? 2), max: spec.value + (spec.tolerans ?? 2) } : undefined;
    for (const c of pool) {
      for (const r of c.rows) {
        const m = r[main];
        if (!m && (needsMain || !fields.some((f) => r[f]))) continue;
        const hit = spec.size !== undefined ? rowMatchesSize(c, r, spec.size, c.rows) : overlaps(rangeCm(m!, c.unit), band!);
        if (!hit) continue;
        const cells: ComparisonListRow["cells"] = {};
        for (const f of fields) {
          const v = r[f];
          if (v) cells[f] = cellOf(c, f, v);
        }
        list.push({
          chartId: c.id,
          brandName: c.brandName,
          sizeLabel: rowLabel(c, r),
          productType: c.productType,
          cells,
          source: srcOf(c),
          uncertain: !c.measurementTypeVerified,
          sortKey: m ? rangeCm(m, c.unit).min : Number.MAX_SAFE_INTEGER,
        });
      }
    }
    list.sort((a, b) => a.sortKey - b.sortKey || a.brandName.localeCompare(b.brandName, "tr"));
    // kaynak numaralarını tablo sırasına göre yeniden ver
    const order = [...new Set(list.map((r) => r.chartId))];
    sources.sort((a, b) => order.indexOf(a.chartId) - order.indexOf(b.chartId));
    sources.forEach((s, i) => (s.n = i + 1));
    for (const r of list) r.source = sources.find((s) => s.chartId === r.chartId)!.n;
  } else {
    const rowsSpec: { label: string; match: (c: MeasureChartWithId, r: ChartRow) => boolean }[] = spec.sizes
      ? spec.sizes.map((s) => ({ label: s, match: (c, r) => rowMatchesSize(c, r, s, c.rows) }))
      : spec.values!.map((b) => ({ label: `${fmtNum(b.min)}–${fmtNum(b.max)} cm`, match: (c, r) => !!r[main] && overlaps(rangeCm(r[main]!, c.unit), b) }));
    const columns = pool.map((c) => ({ chartId: c.id, brandName: c.brandName, source: srcOf(c), uncertain: !c.measurementTypeVerified, productType: c.productType }));
    const cells = rowsSpec.map((rs) =>
      pool.map((c) =>
        c.rows
          .filter((r) => r[main] && rs.match(c, r))
          .map((r) => ({ sizeLabel: spec.sizes ? undefined : (r.letterSize ?? rowLabel(c, r)), cell: cellOf(c, main, r[main]!) })),
      ),
    );
    matrix = { rowLabels: rowsSpec.map((r) => r.label), columns, cells };
    // hiç hücresi olmayan sütunlar gösterilmez
    const keep = columns.map((_, j) => cells.some((row) => row[j].length > 0));
    matrix.columns = columns.filter((_, j) => keep[j]);
    matrix.cells = cells.map((row) => row.filter((_, j) => keep[j]));
    const used = new Set(matrix.columns.map((c) => c.chartId));
    for (let i = sources.length - 1; i >= 0; i--) if (!used.has(sources[i].chartId)) sources.splice(i, 1);
    sources.forEach((s, i) => (s.n = i + 1));
    for (const col of matrix.columns) col.source = sources.find((s) => s.chartId === col.chartId)!.n;
  }

  const empty = matrix ? matrix.columns.length === 0 : list.length === 0;
  if (empty) errors.push("karşılaştırma boş: bu ölçütlere uyan kaynaklı marka tablosu satırı yok");
  const result: ComparisonResult = {
    mode: matrix ? "matrix" : "list",
    spec,
    title: spec.baslik ?? defaultTitle(spec),
    fields: matrix ? [main] : fields,
    list,
    matrix,
    sources,
    hasInch: sources.some((s) => s.unit === "inch"),
    hasUncertain: matrix ? matrix.columns.some((c) => c.uncertain) : list.some((r) => r.uncertain),
  };
  return { result: empty ? undefined : result, errors };
}

/* ------------------------------------------------------------------ */
/* Beden Bulucu (istemci): ölçüyü kaynaklı vücut tablolarıyla karşılaştırır */
/* ------------------------------------------------------------------ */

export type FinderField = "bust" | "chest" | "waist" | "hip";
export type FinderChart = {
  id: string;
  brandName: string;
  gender: Gender;
  productType: string;
  unit: "cm" | "inch";
  heightRange?: Range;
  heightNote?: string;
  sourceUrl: string;
  sourceLabel: string;
  sourceType: ChartSourceType;
  lastVerifiedAt: string;
  rows: { label: string; m: Partial<Record<FinderField, Range>>; kisa?: string; uzun?: string }[];
};

/** Bulucuya yalnız doğrulanmış vücut ölçüsü tabloları girer (ürün ölçüsü ve ölçü türü belirsiz tablolar hariç). */
export function finderCharts(all: ChartWithId[]): FinderChart[] {
  const out: FinderChart[] = [];
  for (const c of all) {
    if (!isMeasure(c) || c.measurementType !== "body" || !c.measurementTypeVerified || c.partialRows || c.productType === "ic-giyim") continue;
    const fields: FinderField[] = c.gender === "kadin" ? ["bust", "waist", "hip"] : ["chest", "waist", "hip"];
    const rows = c.rows
      .map((r) => ({
        label: rowLabel(c, r),
        m: Object.fromEntries(fields.filter((f) => r[f]).map((f) => [f, rangeCm(r[f]!, c.unit)])) as FinderChart["rows"][number]["m"],
        kisa: r.equivalents?.kisa,
        uzun: r.equivalents?.uzun,
      }))
      .filter((r) => Object.keys(r.m).length > 0);
    if (!rows.length) continue;
    const src = c.sources.find((s) => s.url === c.sourceUrl) ?? c.sources[0];
    out.push({
      id: c.id,
      brandName: c.brandName,
      gender: c.gender,
      productType: c.productType,
      unit: c.unit,
      heightRange: c.heightRange,
      heightNote: c.heightNote,
      sourceUrl: c.sourceUrl,
      sourceLabel: src.label,
      sourceType: c.sourceType,
      lastVerifiedAt: c.lastVerifiedAt,
      rows,
    });
  }
  return out;
}

export type FieldMatch = { field: FinderField; from: number; to: number; status: "in" | "between" | "below" | "above" };
export type FinderResult = { chart: FinderChart; matches: FieldMatch[]; from: number; to: number; outOfRange: boolean; noFit: boolean; heightHint?: string };

function matchField(rows: FinderChart["rows"], f: FinderField, v: number): FieldMatch | undefined {
  const idx = rows.map((r, i) => [r.m[f], i] as const).filter((x): x is readonly [Range, number] => !!x[0]);
  if (!idx.length) return undefined;
  const inside = idx.filter(([r]) => v >= r.min - 0.5 && v <= r.max + 0.5).map(([, i]) => i);
  if (inside.length) return { field: f, from: Math.min(...inside), to: Math.max(...inside), status: "in" };
  const first = idx[0];
  const last = idx[idx.length - 1];
  if (v < first[0].min) return { field: f, from: first[1], to: first[1], status: "below" };
  if (v > last[0].max) return { field: f, from: last[1], to: last[1], status: "above" };
  for (let k = 1; k < idx.length; k++) {
    if (v > idx[k - 1][0].max && v < idx[k][0].min) return { field: f, from: idx[k - 1][1], to: idx[k][1], status: "between" };
  }
  return undefined;
}

export function runFinder(charts: FinderChart[], input: Partial<Record<FinderField, number>>, height?: number): FinderResult[] {
  const out: FinderResult[] = [];
  for (const c of charts) {
    const matches: FieldMatch[] = [];
    for (const [f, v] of Object.entries(input) as [FinderField, number][]) {
      if (!Number.isFinite(v) || v <= 0) continue;
      const m = matchField(c.rows, f, v);
      if (m) matches.push(m);
    }
    if (!matches.length) continue;
    const from = Math.min(...matches.map((m) => m.from));
    const to = Math.max(...matches.map((m) => m.to));
    let heightHint: string | undefined;
    if (height && c.heightRange) {
      const hr = c.heightRange;
      const span = hr.min === hr.max ? `${fmtNum(hr.min)} cm` : `${fmtNum(hr.min)}–${fmtNum(hr.max)} cm`;
      if (height < hr.min - 2 || height > hr.max + 2) {
        const alt = height < hr.min ? c.rows[from].kisa : c.rows[from].uzun;
        heightHint =
          `Bu tablo ${span} boy için. Boyunuz bu aralığın ${height < hr.min ? "altında" : "üstünde"}; çevre ölçüleri aynı kalsa da boy ve kol uzunluğu farklı oturabilir.` +
          (alt ? ` Markanın ${height < hr.min ? "kısa" : "uzun"} boy serisindeki karşılığı: ${alt}.` : "");
      }
    }
    const off = (m: FieldMatch) => m.status === "below" || m.status === "above";
    out.push({ chart: c, matches, from, to, outOfRange: matches.some(off), noFit: matches.every(off), heightHint });
  }
  // Önce ölçüyü kapsayan tablolar, sonra kısmen ya da hiç kapsamayanlar; her grupta marka adına göre
  const rank = (r: FinderResult) => (r.noFit ? 2 : r.outOfRange ? 1 : 0);
  return out.sort((a, b) => rank(a) - rank(b) || a.chart.brandName.localeCompare(b.chart.brandName, "tr") || a.chart.productType.localeCompare(b.chart.productType));
}

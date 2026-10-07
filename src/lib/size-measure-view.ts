/**
 * Ölçü öncelikli karşılaştırma görünümü ({% beden-karsilastirma %} varsayılanı).
 * buildComparison sonucunun seçtiği tablolar ve bedenler üzerinden, her beden için ölçü satırları üretir:
 * "Göğüs 118–125 cm" = kaynaklardaki en küçük alt değer – en büyük üst değer (ortalama değil).
 * Ölçü türü kaynakta doğrulanmamış (†) tablolar aralığa katılmaz; marka dökümünde † ile listelenir.
 * Saf modül: veri okumaz, sunucu bileşeni ve testler ortak kullanır.
 */
import type { ChartWithId, ComparisonCell, ComparisonResult, MeasureChartWithId, Range, RangeField } from "./size-core";
import { FIELD_LABEL, fmtInch, fmtNum, isMeasure, RANGE_FIELDS, rangeCm, rowLabel, rowMatchesSize } from "./size-core";

type Row = MeasureChartWithId["rows"][number];

/** Kartta okunur ad; diğerleri FIELD_LABEL. */
const VIEW_LABEL: Partial<Record<RangeField, string>> = { sleeve: "Kol boyu" };

export type MeasureBrandValue = {
  chartId: string;
  brandName: string;
  productType: string;
  source: number;
  uncertain: boolean;
  /** Markanın kendi alan adı farklıysa (ör. "Pantolon beli (harf beden)") */
  brandFieldLabel?: string;
  /** Aynı tabloda birden çok satır eşleştiyse satır adı */
  sizeLabel?: string;
  cell: ComparisonCell;
};

export type MeasureRow = {
  field: RangeField;
  label: string;
  /** Doğrulanmış kaynakların birleşik aralığı (cm); yalnız † kaynak varsa yok */
  range?: Range;
  text?: string;
  /** Aralığa katılan tablo ve marka sayısı */
  sourceCount: number;
  brandCount: number;
  values: MeasureBrandValue[];
};

export type MeasureCard = {
  sizeLabel: string;
  /** Diğer gösterimdeki karşılıklar (harf bedende numara, numarada harf), markaya göre */
  equivalents: string[];
  rows: MeasureRow[];
};

export function fieldViewLabel(f: RangeField, g: "kadin" | "erkek"): string {
  return VIEW_LABEL[f] ?? FIELD_LABEL[f][g];
}

/** "Kaynaklardaki aralık · 2 marka" / "1 kaynak" / "3 kaynak, 2 marka" */
export function aggregateNote(r: Pick<MeasureRow, "sourceCount" | "brandCount">): string {
  if (r.sourceCount <= 1) return "1 kaynak";
  return r.brandCount === r.sourceCount ? `${r.brandCount} marka` : `${r.sourceCount} kaynak, ${r.brandCount} marka`;
}

function cellFor(chart: MeasureChartWithId, f: RangeField, r: Range): ComparisonCell {
  const cm = rangeCm(r, chart.unit);
  const digits = chart.unit === "inch" ? 0 : 1;
  const a = fmtNum(cm.min, digits);
  const b = fmtNum(cm.max, digits);
  return { field: f, range: cm, text: `${a === b ? a : `${a}–${b}`} cm`, inch: chart.unit === "inch" ? fmtInch(r) : undefined };
}

/**
 * Yalnız beden modları (size / sizes) için üretilir; ölçüye göre eşleşen modlarda (value / values)
 * satırlar zaten markaların bedenleridir, marka görünümü kullanılır.
 */
export function buildMeasureView(all: ChartWithId[], result: ComparisonResult): MeasureCard[] | undefined {
  const { spec } = result;
  const g = spec.gender;
  const sizeLabels = spec.size !== undefined ? [spec.size] : spec.sizes;
  if (!sizeLabels) return undefined;

  const srcByChart = new Map(result.sources.map((s) => [s.chartId, s.n]));
  const charts = all.filter(isMeasure).filter((c) => srcByChart.has(c.id));
  // Kaynak sırası korunur
  charts.sort((a, b) => srcByChart.get(a.id)! - srcByChart.get(b.id)!);
  const isLetter = (s: string) => !/^\d+$/.test(s.trim());

  const cards: MeasureCard[] = [];
  for (const size of sizeLabels) {
    const matched = charts.map((c) => ({ c, rows: c.rows.filter((r) => rowMatchesSize(c, r, size, c.rows)) })).filter((m) => m.rows.length);
    if (!matched.length) continue;

    const present = new Set<RangeField>();
    for (const m of matched) for (const r of m.rows) for (const f of RANGE_FIELDS) if (r[f]) present.add(f);
    const order = [...spec.olcu.filter((f) => present.has(f)), ...RANGE_FIELDS.filter((f) => present.has(f) && !spec.olcu.includes(f))];

    const rows: MeasureRow[] = order.map((f) => {
      const values: MeasureBrandValue[] = [];
      for (const { c, rows: rs } of matched) {
        const withF = rs.filter((r) => r[f]);
        for (const r of withF) {
          const custom = c.fieldLabels?.[f];
          values.push({
            chartId: c.id,
            brandName: c.brandName,
            productType: c.productType,
            source: srcByChart.get(c.id)!,
            uncertain: !c.measurementTypeVerified,
            brandFieldLabel: custom && custom !== FIELD_LABEL[f][g] ? custom : undefined,
            sizeLabel: withF.length > 1 ? rowLabel(c, r as Row) : undefined,
            cell: cellFor(c, f, r[f]!),
          });
        }
      }
      const agg = values.filter((v) => !v.uncertain);
      const row: MeasureRow = {
        field: f,
        label: fieldViewLabel(f, g),
        sourceCount: new Set(agg.map((v) => v.chartId)).size,
        brandCount: new Set(agg.map((v) => v.brandName)).size,
        values,
      };
      if (agg.length) {
        const min = Math.min(...agg.map((v) => v.cell.range.min));
        const max = Math.max(...agg.map((v) => v.cell.range.max));
        const digits = agg.some((v) => v.cell.inch) ? 0 : 1;
        const a = fmtNum(min, digits);
        const b = fmtNum(max, digits);
        row.range = { min, max };
        row.text = `${a === b ? a : `${a}–${b}`} cm`;
      }
      return row;
    });

    const eq = new Set<string>();
    for (const { c, rows: rs } of matched)
      for (const r of rs) {
        if (isLetter(size) && r.numericSize) {
          const pre = ["UK", "US", "IT"].includes(c.countrySystem) ? `${c.countrySystem} ` : "";
          eq.add(`${pre}${r.numericSize}`);
        } else if (!isLetter(size) && r.letterSize) eq.add(r.letterSize);
      }
    cards.push({ sizeLabel: size, equivalents: [...eq], rows });
  }
  return cards.length ? cards : undefined;
}

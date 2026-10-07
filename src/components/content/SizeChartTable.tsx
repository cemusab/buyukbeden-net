import type { ReactNode } from "react";
import type { SizeChart, SizeChartRow } from "@/content/schema";
import { SOURCE_TYPE_LABEL } from "@/lib/taxonomy";
import { formatDate } from "@/lib/present";
import {
  CHART_SOURCE_TYPE_LABEL,
  EQUIV_KEYS,
  EQUIV_LABEL,
  FIT_TYPE_LABEL,
  fieldLabel,
  fmtInch,
  fmtRange,
  MEASUREMENT_TYPE_LABEL,
  PRODUCT_TYPE_LABEL,
  RANGE_FIELDS,
  STRETCH_LABEL,
  type MeasurementType,
} from "@/lib/size-core";

type Chart = SizeChart & { id: string };
type Col = { key: string; label: string; hl?: boolean; cell: (i: number) => ReactNode; text: (i: number) => string };

const NUMERIC_LABEL: Record<string, string> = { TR: "Beden", EU: "EU", DE: "Beden", UK: "UK", US: "US", IT: "IT", harf: "Beden", marka: "Beden" };

/** Ölçü türü rozeti: vücut / ürün (giysi) ölçüsü; belirsizse ayrıca uyarı. */
export function MeasurementBadge({ type, verified = true }: { type: MeasurementType; verified?: boolean }) {
  return (
    <span className="inline-flex flex-wrap gap-1.5">
      <span
        data-measurement-badge={type}
        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${type === "body" ? "border-tip-line bg-tip text-ok" : "border-warn-line bg-warn text-[#8a4512]"}`}
      >
        {MEASUREMENT_TYPE_LABEL[type]}
      </span>
      {!verified ? (
        <span className="inline-flex items-center rounded-full border border-note-line bg-note px-2.5 py-1 text-xs font-bold text-ink-2">Ölçü türü kaynakta belirtilmemiş</span>
      ) : null}
    </span>
  );
}

function measureColumns(chart: Extract<Chart, { kind: "olcu" }>): Col[] {
  const rows = chart.rows;
  const cols: Col[] = [];
  const hasNum = rows.some((r) => r.numericSize);
  const hasLetter = rows.some((r) => r.letterSize);
  if (hasNum) cols.push({ key: "numericSize", label: NUMERIC_LABEL[chart.countrySystem], cell: (i) => rows[i].numericSize ?? "–", text: (i) => rows[i].numericSize ?? "–" });
  if (hasLetter) cols.push({ key: "letterSize", label: hasNum ? "Harf" : "Beden", cell: (i) => rows[i].letterSize ?? "–", text: (i) => rows[i].letterSize ?? "–" });
  for (const k of EQUIV_KEYS) {
    if (rows.some((r) => r.equivalents?.[k]))
      cols.push({ key: `eq-${k}`, label: EQUIV_LABEL[k], cell: (i) => rows[i].equivalents?.[k] ?? "–", text: (i) => rows[i].equivalents?.[k] ?? "–" });
  }
  for (const f of RANGE_FIELDS) {
    if (!rows.some((r) => r[f])) continue;
    cols.push({
      key: f,
      label: fieldLabel(chart, f),
      hl: chart.highlight === f,
      text: (i) => (rows[i][f] ? fmtRange(rows[i][f]!, chart.unit) : "–"),
      cell: (i) => {
        const v = rows[i][f];
        if (!v) return "–";
        return (
          <>
            <span className="whitespace-nowrap">{fmtRange(v, chart.unit)}</span>
            {chart.unit === "inch" ? <span className="block text-xs font-normal text-muted">({fmtInch(v)})</span> : null}
          </>
        );
      },
    });
  }
  const extra: [keyof SizeChartRow, string, (r: SizeChartRow) => string | undefined][] = [
    ["waistInch", "Jean bel (W, inç)", (r) => (r.waistInch ? `W${r.waistInch}` : undefined)],
    ["lengthInch", "Jean boy (L, inç)", (r) => (r.lengthInch ? `L${r.lengthInch}` : undefined)],
    ["stretch", "Esneme", (r) => (r.stretch ? STRETCH_LABEL[r.stretch] : undefined)],
    ["note", "Not", (r) => r.note],
  ];
  for (const [k, label, get] of extra) {
    if (rows.some((r) => get(r))) cols.push({ key: String(k), label, cell: (i) => get(rows[i]) ?? "–", text: (i) => get(rows[i]) ?? "–" });
  }
  return cols;
}

function conversionColumns(chart: Extract<Chart, { kind: "donusum" }>): Col[] {
  return chart.columns.map((c) => ({
    key: c.key,
    label: c.label,
    hl: chart.highlight === c.key,
    cell: (i) => chart.rows[i].systems[c.key] ?? "–",
    text: (i) => chart.rows[i].systems[c.key] ?? "–",
  }));
}

/** Kaynaklı beden tablosu: ölçü türü rozeti, aralıklar "118–122 cm", mobilde kart görünümü, kaynak türü ve son doğrulama tarihi. */
export function SizeChartTable({ chart, headingLevel }: { chart: Chart; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  const cols = chart.kind === "olcu" ? measureColumns(chart) : conversionColumns(chart);
  const n = chart.rows.length;
  const wide = cols.length > 4;
  const measure = chart.kind === "olcu" ? chart : undefined;
  return (
    <figure className="not-prose my-6" data-size-chart={chart.id} data-measurement-type={measure?.measurementType ?? "donusum"}>
      {H ? <H className="mb-2 text-h3 font-bold text-ink">{chart.title}</H> : null}
      <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-muted">
        {measure ? <MeasurementBadge type={measure.measurementType} verified={measure.measurementTypeVerified} /> : <span className="inline-flex items-center rounded-full border border-line bg-soft px-2.5 py-1 font-bold text-ink-2">Beden çevirme (ölçü değil)</span>}
        <span className="inline-flex items-center rounded-full border border-line px-2.5 py-1">{PRODUCT_TYPE_LABEL[chart.productType]}</span>
        {measure?.fitType ? <span className="inline-flex items-center rounded-full border border-line px-2.5 py-1">{FIT_TYPE_LABEL[measure.fitType]}</span> : null}
        {measure?.unit === "inch" ? <span className="inline-flex items-center rounded-full border border-line px-2.5 py-1">Kaynak inç; cm çevirisi bizim</span> : null}
      </div>
      {wide ? (
        <ul className="space-y-2 sm:hidden" aria-label={chart.caption} data-chart-cards>
          {Array.from({ length: n }, (_, i) => (
            <li key={i}>
              <details className="group rounded-card border border-line bg-surface" open={i === 0}>
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 font-bold text-ink [&::-webkit-details-marker]:hidden">
                  <span>
                    {cols[0].label}: {cols[0].text(i)}
                  </span>
                  <span aria-hidden="true" className="text-primary transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-line px-4 py-3 text-sm">
                  {cols.slice(1).map((c) => (
                    <div key={c.key} className={c.hl ? "font-bold text-primary" : ""}>
                      <dt className="text-xs text-muted">{c.label}</dt>
                      <dd className="tabular-nums text-ink">{c.cell(i)}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            </li>
          ))}
        </ul>
      ) : null}
      <div role="region" aria-label={chart.caption} tabIndex={0} className={`table-scroll rt overflow-x-auto rounded-card border border-line ${wide ? "hidden sm:block" : ""}`}>
        <table className="w-full border-collapse text-left text-[0.9375rem] tabular-nums">
          <caption className="sr-only">{chart.caption}</caption>
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c.key} scope="col" className={c.hl ? "is-hl" : undefined}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: n }, (_, i) => (
              <tr key={i}>
                {cols.map((c, j) =>
                  j === 0 ? (
                    <th key={c.key} scope="row">
                      {c.cell(i)}
                    </th>
                  ) : (
                    <td key={c.key} className={c.hl ? "is-hl" : undefined}>
                      {c.cell(i)}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="mt-2 space-y-1 text-sm text-muted">
        <span className="block font-medium text-ink-2">{chart.caption}</span>
        {measure?.heightNote ? <span className="block">{measure.heightNote}</span> : null}
        {chart.approximate ? <span className="block">Yaklaşık değerler; markaya ve ürüne göre değişir. Satın almadan önce ürünün kendi tablosunu kontrol edin.</span> : null}
        {measure?.unit === "inch" ? <span className="block">Kaynak tablo inç (in) cinsindendir; cm değerleri bizim çevirimizdir (1 inç = 2,54 cm, yuvarlanmış).</span> : null}
        {chart.notes.map((note, i) => (
          <span key={i} className="block">
            {note}
          </span>
        ))}
        {chart.inconsistencyNote ? <span className="block">{chart.inconsistencyNote}</span> : null}
        <span className="block text-xs" data-chart-meta>
          Kaynak türü: {CHART_SOURCE_TYPE_LABEL[chart.sourceType]} · Son doğrulama: <time dateTime={chart.lastVerifiedAt}>{formatDate(chart.lastVerifiedAt)}</time>
        </span>
        <span className="block text-xs">
          Kaynak:{" "}
          {chart.sources.map((s, i) => (
            <span key={s.url}>
              {i ? "; " : ""}
              <a href={s.url} rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">
                {s.label}
              </a>{" "}
              ({SOURCE_TYPE_LABEL[s.type]}, kontrol: <time dateTime={s.checkedAt}>{formatDate(s.checkedAt)}</time>)
            </span>
          ))}
        </span>
      </figcaption>
    </figure>
  );
}

import type { ComparisonResult, ComparisonCell, RangeField } from "@/lib/size-core";
import { CHART_SOURCE_TYPE_LABEL, FIELD_LABEL, fmtNum, PRODUCT_TYPE_LABEL } from "@/lib/size-core";
import { formatDate } from "@/lib/present";
import { MeasurementBadge } from "./SizeChartTable";

function hash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

function Cell({ c }: { c?: ComparisonCell }) {
  if (!c) return <>–</>;
  return (
    <>
      <span className="whitespace-nowrap">{c.text}</span>
      {c.inch ? <span className="block text-xs font-normal text-muted">({c.inch})</span> : null}
    </>
  );
}

function SrcRef({ n, id }: { n: number; id: string }) {
  return (
    <a href={`#${id}-k${n}`} className="ml-0.5 align-super text-[0.7rem] font-semibold text-primary underline-offset-2 hover:underline" aria-label={`Kaynak ${n}`}>
      [{n}]
    </a>
  );
}

/**
 * Markalar arası karşılaştırma: marka tablolarının satırlarından türetilir (src/lib/size-core.ts > buildComparison).
 * Ortalama alınmaz; her hücre kendi markasının tablosundan gelir ve kaynağı numarayla gösterilir.
 */
export function SizeComparisonTable({ result, headingLevel = "h3" }: { result: ComparisonResult; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  const id = `karsilastirma-${hash(JSON.stringify(result.spec))}`;
  const { spec } = result;
  const g = spec.gender;
  const label = (f: RangeField) => FIELD_LABEL[f][g];
  const cevre = spec.cevre && result.fields.includes("chestWidth");
  const caption = result.title;
  const productTypes = new Set(result.mode === "list" ? result.list.map((r) => r.productType) : (result.matrix?.columns ?? []).map((c) => c.productType));
  const showPt = productTypes.size > 1;
  const brandText = (name: string, pt: string, uncertain: boolean) => `${name}${showPt && pt !== "genel" ? ` · ${PRODUCT_TYPE_LABEL[pt as keyof typeof PRODUCT_TYPE_LABEL] ?? pt}` : ""}${uncertain ? " †" : ""}`;

  return (
    <figure className="not-prose my-6" data-size-comparison={id} data-measurement-type={spec.measurementType}>
      <H className="mb-2 text-h3 font-bold text-ink">{result.title}</H>
      <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-muted">
        <MeasurementBadge type={spec.measurementType} />
        <span className="inline-flex items-center rounded-full border border-line px-2.5 py-1">Marka tablolarından türetildi</span>
      </div>

      {result.mode === "list" ? (
        <>
          <ul className="space-y-2 sm:hidden" aria-label={caption} data-chart-cards>
            {result.list.map((r, i) => (
              <li key={i} className="rounded-card border border-line bg-surface px-4 py-3">
                <p className="font-bold text-ink">
                  {brandText(r.brandName, r.productType, r.uncertain)} <SrcRef n={r.source} id={id} />
                </p>
                <p className="text-sm text-muted">Beden: {r.sizeLabel}</p>
                <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                  {result.fields.map((f) => (
                    <div key={f}>
                      <dt className="text-xs text-muted">{label(f)}</dt>
                      <dd className="tabular-nums text-ink">
                        <Cell c={r.cells[f]} />
                      </dd>
                    </div>
                  ))}
                  {cevre ? (
                    <div>
                      <dt className="text-xs text-muted">Yaklaşık giysi çevresi (en × 2)</dt>
                      <dd className="tabular-nums text-ink">{r.cells.chestWidth ? `${fmtNum(r.cells.chestWidth.range.min * 2, 0)} cm` : "–"}</dd>
                    </div>
                  ) : null}
                </dl>
              </li>
            ))}
          </ul>
          <div role="region" aria-label={caption} tabIndex={0} className="table-scroll rt hidden overflow-x-auto rounded-card border border-line sm:block">
            <table className="w-full border-collapse text-left text-[0.9375rem] tabular-nums">
              <caption className="sr-only">{caption}</caption>
              <thead>
                <tr>
                  <th scope="col">Marka</th>
                  <th scope="col">Beden</th>
                  {result.fields.map((f, j) => (
                    <th key={f} scope="col" className={j === 0 ? "is-hl" : undefined}>
                      {label(f)}
                    </th>
                  ))}
                  {cevre ? <th scope="col">Yaklaşık giysi çevresi (en × 2)</th> : null}
                  <th scope="col">Kaynak</th>
                </tr>
              </thead>
              <tbody>
                {result.list.map((r, i) => (
                  <tr key={i}>
                    <th scope="row">{brandText(r.brandName, r.productType, r.uncertain)}</th>
                    <td>{r.sizeLabel}</td>
                    {result.fields.map((f, j) => (
                      <td key={f} className={j === 0 ? "is-hl" : undefined}>
                        <Cell c={r.cells[f]} />
                      </td>
                    ))}
                    {cevre ? <td>{r.cells.chestWidth ? `${fmtNum(r.cells.chestWidth.range.min * 2, 0)} cm` : "–"}</td> : null}
                    <td>
                      <SrcRef n={r.source} id={id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : result.matrix ? (
        <>
          <ul className="space-y-2 sm:hidden" aria-label={caption} data-chart-cards>
            {result.matrix.rowLabels.map((rl, i) => (
              <li key={rl}>
                <details className="group rounded-card border border-line bg-surface" open={i === 0}>
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 font-bold text-ink [&::-webkit-details-marker]:hidden">
                    <span>{spec.sizes ? `Beden: ${rl}` : `${label(result.fields[0])}: ${rl}`}</span>
                    <span aria-hidden="true" className="text-primary transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-line px-4 py-3 text-sm">
                    {result.matrix!.columns.map((col, j) => (
                      <div key={col.chartId}>
                        <dt className="text-xs text-muted">
                          {brandText(col.brandName, col.productType, col.uncertain)} <SrcRef n={col.source} id={id} />
                        </dt>
                        <dd className="tabular-nums text-ink">
                          {result.matrix!.cells[i][j].length
                            ? result.matrix!.cells[i][j].map((x, k) => (
                                <span key={k} className="block">
                                  {x.sizeLabel ? `${x.sizeLabel} (${x.cell.text})` : x.cell.text}
                                </span>
                              ))
                            : "–"}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </details>
              </li>
            ))}
          </ul>
          <div role="region" aria-label={caption} tabIndex={0} className="table-scroll rt hidden overflow-x-auto rounded-card border border-line sm:block">
            <table className="w-full border-collapse text-left text-[0.9375rem] tabular-nums">
              <caption className="sr-only">{caption}</caption>
              <thead>
                <tr>
                  <th scope="col">{spec.sizes ? "Beden" : `${label(result.fields[0])} aralığı`}</th>
                  {result.matrix.columns.map((col) => (
                    <th key={col.chartId} scope="col">
                      {brandText(col.brandName, col.productType, col.uncertain)} <SrcRef n={col.source} id={id} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.matrix.rowLabels.map((rl, i) => (
                  <tr key={rl}>
                    <th scope="row">{rl}</th>
                    {result.matrix!.columns.map((col, j) => (
                      <td key={col.chartId}>
                        {result.matrix!.cells[i][j].length
                          ? result.matrix!.cells[i][j].map((x, k) => (
                              <span key={k} className="block">
                                {x.sizeLabel ? (
                                  <>
                                    <strong className="text-ink">{x.sizeLabel}</strong> <span className="whitespace-nowrap text-muted">({x.cell.text})</span>
                                  </>
                                ) : (
                                  <span className="whitespace-nowrap">{x.cell.text}</span>
                                )}
                              </span>
                            ))
                          : "–"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}

      <figcaption className="mt-2 space-y-1 text-sm text-muted">
        <span className="block">
          Bu tablo sitedeki kaynaklı marka tablolarından otomatik türetilir; ortalama alınmadı, her değer o markanın kendi tablosudur ve yalnız aynı türde ölçü ({spec.measurementType === "body" ? "vücut" : "ürün"} ölçüsü) yan yana konur.
          {spec.value !== undefined ? ` ${label(result.fields[0])} değeri ${fmtNum(spec.value - (spec.tolerans ?? 2))}–${fmtNum(spec.value + (spec.tolerans ?? 2))} cm'ye değen bedenler listelendi.` : ""}
          {spec.values ? " Her hücrede, o ölçü aralığına değen bedenler ve markanın verdiği aralık yazar." : ""}
        </span>
        {cevre ? <span className="block">“Yaklaşık giysi çevresi” tek kat enin iki katıdır ve bizim hesabımızdır; giysinin bolluk payını içerir.</span> : null}
        {result.hasInch ? <span className="block">İnç yayımlayan markaların cm değerleri bizim çevirimizdir (1 inç = 2,54 cm, yuvarlanmış).</span> : null}
        {result.hasUncertain ? <span className="block">† Bu markanın tablosu, değerlerin vücut ölçüsü mü ürün ölçüsü mü olduğunu belirtmiyor.</span> : null}
        <span className="block">Yaklaşık bir karşılaştırmadır; beden markaya ve ürüne göre değişir. Satın almadan önce ürünün kendi tablosunu kendi ölçünüzle karşılaştırın.</span>
        <span className="block text-xs">Kaynaklar:</span>
        <ol className="space-y-0.5 text-xs">
          {result.sources.map((s) => (
            <li key={s.chartId} id={`${id}-k${s.n}`}>
              [{s.n}] {s.brandName}:{" "}
              <a href={s.url} rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">
                {s.label}
              </a>{" "}
              ({CHART_SOURCE_TYPE_LABEL[s.sourceType]}, son doğrulama: <time dateTime={s.lastVerifiedAt}>{formatDate(s.lastVerifiedAt)}</time>)
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}

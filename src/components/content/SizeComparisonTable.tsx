import type { ComparisonResult, ComparisonCell, RangeField } from "@/lib/size-core";
import { CHART_SOURCE_TYPE_LABEL, FIELD_LABEL, fmtNum, PRODUCT_TYPE_LABEL } from "@/lib/size-core";
import { aggregateNote, type MeasureCard, type MeasureRow } from "@/lib/size-measure-view";
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

type Ctx = {
  result: ComparisonResult;
  id: string;
  caption: string;
  cevre: boolean;
  label: (f: RangeField) => string;
  brandText: (name: string, pt: string, uncertain: boolean) => string;
};

/** Marka öncelikli kartlar (mobil): satırlar markalar ya da bedenler, hücreler markanın kendi değeri. */
function BrandCards({ ctx }: { ctx: Ctx }) {
  const { result, id, caption, cevre, label, brandText } = ctx;
  const { spec } = result;
  if (result.mode === "list")
    return (
      <ul className="space-y-2 sm:hidden" aria-label={caption} data-chart-cards data-view-part="brand-cards">
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
    );
  const m = result.matrix!;
  return (
    <ul className="space-y-2 sm:hidden" aria-label={caption} data-chart-cards data-view-part="brand-cards">
      {m.rowLabels.map((rl, i) => (
        <li key={rl}>
          <details className="group rounded-card border border-line bg-surface" open={i === 0}>
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 font-bold text-ink [&::-webkit-details-marker]:hidden">
              <span>{spec.sizes ? `Beden: ${rl}` : `${label(result.fields[0])}: ${rl}`}</span>
              <span aria-hidden="true" className="text-primary transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-line px-4 py-3 text-sm">
              {m.columns.map((col, j) => (
                <div key={col.chartId}>
                  <dt className="text-xs text-muted">
                    {brandText(col.brandName, col.productType, col.uncertain)} <SrcRef n={col.source} id={id} />
                  </dt>
                  <dd className="tabular-nums text-ink">
                    {m.cells[i][j].length
                      ? m.cells[i][j].map((x, k) => (
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
  );
}

/** Marka öncelikli tablo (masaüstü). */
function BrandTable({ ctx, className }: { ctx: Ctx; className: string }) {
  const { result, id, caption, cevre, label, brandText } = ctx;
  const { spec } = result;
  return (
    <div role="region" aria-label={caption} tabIndex={0} className={`table-scroll rt overflow-x-auto rounded-card border border-line ${className}`} data-view-part="brand-table">
      <table className="w-full border-collapse text-left text-[0.9375rem] tabular-nums">
        <caption className="sr-only">{caption}</caption>
        {result.mode === "list" ? (
          <>
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
          </>
        ) : (
          <>
            <thead>
              <tr>
                <th scope="col">{spec.sizes ? "Beden" : `${label(result.fields[0])} aralığı`}</th>
                {result.matrix!.columns.map((col) => (
                  <th key={col.chartId} scope="col">
                    {brandText(col.brandName, col.productType, col.uncertain)} <SrcRef n={col.source} id={id} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.matrix!.rowLabels.map((rl, i) => (
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
          </>
        )}
      </table>
    </div>
  );
}

/** "en × 2" türetilmiş satırı (bizim hesabımız), göğüs eni satırından. */
function cevreRow(rows: MeasureRow[]): { text?: string; row: MeasureRow } | undefined {
  const cw = rows.find((r) => r.field === "chestWidth");
  if (!cw) return undefined;
  return { row: cw, text: cw.range ? `${fmtNum(cw.range.min * 2, 0)}${cw.range.min === cw.range.max ? "" : `–${fmtNum(cw.range.max * 2, 0)}`} cm` : undefined };
}

function AggValue({ r }: { r: MeasureRow }) {
  return r.text ? (
    <>
      <span className="whitespace-nowrap font-bold text-ink">{r.text}</span>
      <span className="block text-xs font-normal text-muted" data-agg-note>
        Kaynaklardaki aralık · {aggregateNote(r)}
      </span>
    </>
  ) : (
    <>
      <span className="text-ink">–</span>
      <span className="block text-xs font-normal text-muted" data-agg-note>
        Yalnız ölçü türü belirtilmemiş (†) kaynakta var
      </span>
    </>
  );
}

/** Kart içindeki marka dökümü: ölçü → marka → değer [kaynak]; † kaynaklar aralığa katılmaz ama burada görünür. */
function BrandBreakdown({ card, ctx }: { card: MeasureCard; ctx: Ctx }) {
  const { id, brandText } = ctx;
  return (
    <details className="group border-t border-line" data-brand-breakdown>
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold text-primary [&::-webkit-details-marker]:hidden">
        <span>Markalara göre</span>
        <span aria-hidden="true" className="transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="space-y-3 px-4 pb-3 text-sm">
        {card.rows.map((r) => (
          <div key={r.field} data-breakdown-field={r.field}>
            <p className="text-xs font-semibold text-muted">{r.label}</p>
            <ul className="mt-1 space-y-1">
              {r.values.map((v, k) => (
                <li key={k} className="flex flex-wrap items-baseline justify-between gap-x-3" data-brand-value={v.chartId} data-min={v.cell.range.min} data-max={v.cell.range.max} data-uncertain={v.uncertain || undefined}>
                  <span className="min-w-0 text-ink-2">
                    {brandText(v.brandName, v.productType, v.uncertain)}
                    {v.sizeLabel ? ` · ${v.sizeLabel}` : ""} <SrcRef n={v.source} id={id} />
                    {v.brandFieldLabel ? <span className="block text-xs text-muted">Markada: {v.brandFieldLabel}</span> : null}
                  </span>
                  <span className="tabular-nums text-ink">
                    <Cell c={v.cell} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}

/** Ölçü öncelikli kartlar (mobil): her beden için ölçü → kaynaklardaki birleşik aralık. */
function MeasureCards({ cards, ctx }: { cards: MeasureCard[]; ctx: Ctx }) {
  return (
    <ul className="space-y-3 sm:hidden" aria-label={ctx.caption} data-chart-cards data-view-part="measure-cards">
      {cards.map((card) => {
        const cv = ctx.cevre ? cevreRow(card.rows) : undefined;
        return (
          <li key={card.sizeLabel} className="rounded-card border border-line bg-surface" data-measure-card>
            <div className="px-4 pt-3">
              <p className="font-bold text-ink">Beden: {card.sizeLabel}</p>
              {card.equivalents.length ? <p className="text-xs text-muted">Karşılığı (markaya göre): {card.equivalents.join(" · ")}</p> : null}
            </div>
            <dl className="divide-y divide-line px-4 py-1 text-sm">
              {card.rows.map((r) => (
                <div key={r.field} className="flex items-baseline justify-between gap-3 py-2" data-measure-row={r.field} data-min={r.range?.min} data-max={r.range?.max}>
                  <dt className="text-ink-2">{r.label}</dt>
                  <dd className="text-right tabular-nums">
                    <AggValue r={r} />
                  </dd>
                </div>
              ))}
              {cv ? (
                <div className="flex items-baseline justify-between gap-3 py-2">
                  <dt className="text-ink-2">Yaklaşık giysi çevresi (en × 2)</dt>
                  <dd className="text-right tabular-nums text-ink">{cv.text ?? "–"}</dd>
                </div>
              ) : null}
            </dl>
            <BrandBreakdown card={card} ctx={ctx} />
          </li>
        );
      })}
    </ul>
  );
}

/** Ölçü öncelikli tablo (masaüstü): satırlar bedenler, sütunlar ölçüler (birleşik aralık). */
function MeasureTable({ cards, ctx }: { cards: MeasureCard[]; ctx: Ctx }) {
  const fields: MeasureRow[] = [];
  for (const c of cards) for (const r of c.rows) if (!fields.some((x) => x.field === r.field)) fields.push(r);
  const hasEq = cards.some((c) => c.equivalents.length);
  return (
    <div role="region" aria-label={ctx.caption} tabIndex={0} className="table-scroll rt hidden overflow-x-auto rounded-card border border-line sm:block" data-view-part="measure-table">
      <table className="w-full border-collapse text-left text-[0.9375rem] tabular-nums">
        <caption className="sr-only">{ctx.caption}</caption>
        <thead>
          <tr>
            <th scope="col">Beden</th>
            {fields.map((f, j) => (
              <th key={f.field} scope="col" className={j === 0 ? "is-hl" : undefined}>
                {f.label}
              </th>
            ))}
            {ctx.cevre && fields.some((f) => f.field === "chestWidth") ? <th scope="col">Yaklaşık giysi çevresi (en × 2)</th> : null}
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => {
            const cv = ctx.cevre ? cevreRow(card.rows) : undefined;
            return (
              <tr key={card.sizeLabel}>
                <th scope="row">
                  {card.sizeLabel}
                  {hasEq && card.equivalents.length ? <span className="block text-xs font-normal text-muted">{card.equivalents.join(" · ")}</span> : null}
                </th>
                {fields.map((f, j) => {
                  const r = card.rows.find((x) => x.field === f.field);
                  return (
                    <td key={f.field} className={j === 0 ? "is-hl" : undefined}>
                      {r ? <AggValue r={r} /> : "–"}
                    </td>
                  );
                })}
                {ctx.cevre && fields.some((f) => f.field === "chestWidth") ? <td>{cv?.text ?? "–"}</td> : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Markalar arası karşılaştırma: marka tablolarının satırlarından türetilir (src/lib/size-core.ts > buildComparison).
 * Varsayılan görünüm ölçü önceliklidir (src/lib/size-measure-view.ts): her beden için ölçü → kaynaklardaki
 * birleşik aralık (en küçük alt – en büyük üst; ortalama değil), marka dökümü açılır bölümde kaynak numarasıyla.
 * `gorunum="marka"` (veya ölçüye göre eşleşen value/values modları) marka öncelikli eski görünümü verir.
 */
export function SizeComparisonTable({
  result,
  cards,
  headingLevel = "h3",
}: {
  result: ComparisonResult;
  /** Verilirse ölçü öncelikli görünüm */
  cards?: MeasureCard[];
  headingLevel?: "h2" | "h3";
}) {
  const H = headingLevel;
  const id = `karsilastirma-${hash(JSON.stringify(result.spec))}`;
  const { spec } = result;
  const g = spec.gender;
  const label = (f: RangeField) => FIELD_LABEL[f][g];
  const cevre = !!spec.cevre && result.fields.includes("chestWidth");
  const caption = result.title;
  const productTypes = new Set(result.mode === "list" ? result.list.map((r) => r.productType) : (result.matrix?.columns ?? []).map((c) => c.productType));
  const showPt = productTypes.size > 1;
  const brandText = (name: string, pt: string, uncertain: boolean) => `${name}${showPt && pt !== "genel" ? ` · ${PRODUCT_TYPE_LABEL[pt as keyof typeof PRODUCT_TYPE_LABEL] ?? pt}` : ""}${uncertain ? " †" : ""}`;
  const ctx: Ctx = { result, id, caption, cevre, label, brandText };
  const view = cards ? "olcu" : "marka";

  return (
    <figure className="not-prose my-6" data-size-comparison={id} data-measurement-type={spec.measurementType} data-view={view}>
      <H className="mb-2 text-h3 font-bold text-ink">{result.title}</H>
      <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-muted">
        <MeasurementBadge type={spec.measurementType} />
        <span className="inline-flex items-center rounded-full border border-line px-2.5 py-1">Marka tablolarından türetildi</span>
      </div>

      {cards ? (
        <>
          <MeasureCards cards={cards} ctx={ctx} />
          <MeasureTable cards={cards} ctx={ctx} />
          <details className="group mt-2 hidden sm:block" data-brand-breakdown>
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm font-semibold text-primary [&::-webkit-details-marker]:hidden">
              <span aria-hidden="true" className="transition-transform group-open:rotate-45">
                +
              </span>
              Markalara göre
            </summary>
            <BrandTable ctx={ctx} className="mt-1" />
          </details>
        </>
      ) : (
        <>
          <BrandCards ctx={ctx} />
          <BrandTable ctx={ctx} className="hidden sm:block" />
        </>
      )}

      <figcaption className="mt-2 space-y-1 text-sm text-muted">
        <span className="block">
          {cards
            ? `Bu tablo sitedeki kaynaklı marka tablolarından otomatik türetilir. Gösterilen aralık ortalama değildir: o bedende kaynakların verdiği en küçük alt değerden en büyük üst değere uzanır; her markanın kendi değeri "Markalara göre" bölümündedir. Yalnız aynı türde ölçü (${spec.measurementType === "body" ? "vücut" : "ürün"} ölçüsü) birleştirilir.`
            : `Bu tablo sitedeki kaynaklı marka tablolarından otomatik türetilir; ortalama alınmadı, her değer o markanın kendi tablosudur ve yalnız aynı türde ölçü (${spec.measurementType === "body" ? "vücut" : "ürün"} ölçüsü) yan yana konur.`}
          {spec.value !== undefined ? ` ${label(result.fields[0])} değeri ${fmtNum(spec.value - (spec.tolerans ?? 2))}–${fmtNum(spec.value + (spec.tolerans ?? 2))} cm'ye değen bedenler listelendi.` : ""}
          {spec.values ? " Her hücrede, o ölçü aralığına değen bedenler ve markanın verdiği aralık yazar." : ""}
        </span>
        {cards && cards.some((c) => c.rows.some((r) => r.sourceCount === 1)) ? (
          <span className="block">“1 kaynak” yazan ölçüler tek markanın tablosuna dayanır; zayıf veridir.</span>
        ) : null}
        {cevre ? <span className="block">“Yaklaşık giysi çevresi” tek kat enin iki katıdır ve bizim hesabımızdır; giysinin bolluk payını içerir.</span> : null}
        {result.hasInch ? <span className="block">İnç yayımlayan markaların cm değerleri bizim çevirimizdir (1 inç = 2,54 cm, yuvarlanmış).</span> : null}
        {result.hasUncertain ? (
          <span className="block">
            † Bu markanın tablosu, değerlerin vücut ölçüsü mü ürün ölçüsü mü olduğunu belirtmiyor.{cards ? " Bu yüzden aralığa katılmadı; yalnız marka dökümünde gösterilir." : ""}
          </span>
        ) : null}
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

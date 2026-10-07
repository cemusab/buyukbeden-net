import type { SizeChart } from "@/content/schema";
import { SOURCE_TYPE_LABEL } from "@/lib/taxonomy";
import { formatDate } from "@/lib/present";

/** Kaynaklı beden tablosu: mobilde tablo kabı içinde yatay kaydırma, ilk sütun sabit. */
export function SizeChartTable({ chart, headingLevel }: { chart: SizeChart & { id: string }; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  const wide = chart.columns.length > 4;
  return (
    <figure className="not-prose my-6" data-size-chart={chart.id}>
      {H ? <H className="mb-2 text-h3 font-bold text-ink">{chart.title}</H> : null}
      {wide ? (
        <ul className="space-y-2 sm:hidden" aria-label={chart.caption} data-chart-cards>
          {chart.rows.map((row, i) => (
            <li key={i}>
              <details className="group rounded-card border border-line bg-surface" open={i === 0}>
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 font-bold text-ink [&::-webkit-details-marker]:hidden">
                  <span>
                    {chart.columns[0].label}: {row[0]}
                  </span>
                  <span aria-hidden="true" className="text-primary transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-line px-4 py-3 text-sm">
                  {chart.columns.slice(1).map((c, j) => (
                    <div key={c.key} className={chart.highlightColumn === c.key ? "font-bold text-primary" : ""}>
                      <dt className="text-xs text-muted">
                        {c.label}
                        {c.unit ? ` (${c.unit})` : ""}
                      </dt>
                      <dd className="tabular-nums text-ink">{row[j + 1]}</dd>
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
              {chart.columns.map((c) => (
                <th key={c.key} scope="col" className={chart.highlightColumn === c.key ? "is-hl" : undefined}>
                  {c.label}
                  {c.unit ? <span className="font-normal text-muted"> ({c.unit})</span> : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) =>
                  j === 0 ? (
                    <th key={j} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={j} className={chart.highlightColumn === chart.columns[j]?.key ? "is-hl" : undefined}>
                      {cell}
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
        {chart.approximate ? <span className="block">Yaklaşık değerler; markaya ve ürüne göre değişir. Satın almadan önce ürünün kendi tablosunu kontrol edin.</span> : null}
        {chart.notes.map((n, i) => (
          <span key={i} className="block">
            {n}
          </span>
        ))}
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

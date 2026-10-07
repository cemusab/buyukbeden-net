import Link from "next/link";
import { getByPath, getSizeChart, hasRoute } from "@/lib/content";
import { ScaledBodyFigure, BODY_TYPE_SWATCHES } from "@/components/illustrations";

type Silo = "kadin" | "erkek";
type R = { min: number; max: number } | undefined;
const mid = (r: R) => (r ? (r.min + r.max) / 2 : undefined);
const fmt = (r: R) => (r ? (r.min === r.max ? `${r.min}` : `${r.min}–${r.max}`) : "");

/**
 * Tek bir markanın kaynaklı vücut ölçüsü tablosu. Figür genişlikleri bu tablodaki
 * çevre ölçülerinin orta beden satırına oranıyla ölçeklenir (illüstrasyon).
 */
const CONFIG: Record<Silo, { chart: string; sizes: string[]; ref: string; key: "numericSize" | "letterSize"; upper: "bust" | "chest"; lower?: "hip"; garment: string; color: string }> = {
  kadin: {
    chart: "kadin-ulla-popken-vucut",
    sizes: ["44", "46", "48", "50", "52", "54", "56", "58", "60"],
    ref: "52",
    key: "numericSize",
    upper: "bust",
    lower: "hip",
    garment: "elbise",
    color: BODY_TYPE_SWATCHES.sage.garment,
  },
  erkek: {
    chart: "erkek-jp1880-ust",
    sizes: ["XL", "XXL", "3XL", "4XL", "5XL", "6XL"],
    ref: "3XL",
    key: "letterSize",
    upper: "chest",
    garment: "tisort-pantolon",
    color: BODY_TYPE_SWATCHES.blue.garment,
  },
};

type Row = Record<string, unknown> & { numericSize?: string; letterSize?: string; bust?: R; chest?: R; waist?: R; hip?: R };

/** "Aynı kıyafet, farklı bedenler" illüstrasyon şeridi. Kaynak tablo yoksa hiçbir şey basmaz. */
export function SizeRangeStrip({ silo, headingLevel = "h2" }: { silo: Silo; headingLevel?: "h2" | "h3" }) {
  const cfg = CONFIG[silo];
  const chart = cfg ? getSizeChart(cfg.chart) : undefined;
  if (!cfg || !chart || chart.kind !== "olcu" || chart.measurementType !== "body" || chart.unit !== "cm") return null;
  const rows = chart.rows as Row[];
  const find = (s: string) => rows.find((r) => String(r[cfg.key] ?? "").toUpperCase() === s.toUpperCase());
  const ref = find(cfg.ref);
  const refU = mid(ref?.[cfg.upper]);
  const refW = mid(ref?.waist);
  const refL = cfg.lower ? mid(ref?.[cfg.lower]) : undefined;
  if (!ref || !refU || !refW) return null;
  const items = cfg.sizes
    .map((s) => ({ s, row: find(s) }))
    .filter((x): x is { s: string; row: Row } => !!x.row && !!mid(x.row[cfg.upper]) && !!mid(x.row.waist))
    .map(({ s, row }) => {
      const upper = mid(row[cfg.upper])! / refU;
      const waist = mid(row.waist)! / refW;
      const lowerM = cfg.lower ? mid(row[cfg.lower]) : undefined;
      // Tabloda kalça yoksa alt gövde, göğüs ve bel oranlarının ortalamasıyla ölçeklenir.
      const lower = lowerM && refL ? lowerM / refL : (upper + waist) / 2;
      return { s, row, ratios: { upper, waist, lower } };
    });
  if (items.length < 3) return null;
  const H = headingLevel;
  const brandPath = chart.brand ? `/marka/${chart.brand}` : undefined;
  const brand = brandPath && hasRoute(brandPath) ? getByPath(brandPath) : undefined;
  const id = `ayni-kiyafet-${silo}`;
  return (
    <section aria-labelledby={id} className="mt-10" data-size-range-strip={silo}>
      <H id={id} className="text-h2 font-bold text-ink">
        Aynı kıyafet, farklı bedenler
      </H>
      <p className="mt-2 max-w-prose text-[0.9375rem] text-ink-2">
        {silo === "kadin"
          ? `Aynı elbise ${items[0].s}'ten ${items[items.length - 1].s}'a kadar her bedende böyle görünür: bedenler büyüdükçe göğüs, bel ve basen birlikte genişler, boy aynı kalır.`
          : `Aynı tişört ve pantolon ${items[0].s}'den ${items[items.length - 1].s}'e kadar her bedende böyle görünür: bedenler büyüdükçe göğüs ve bel birlikte genişler, boy aynı kalır.`}
      </p>
      <figure className={`mt-4 ${items.length <= 6 ? "max-w-3xl" : "max-w-5xl"}`}>
        <div
          className="-mx-1 overflow-x-auto px-1 pb-2 md:mx-0 md:overflow-visible md:px-0 md:pb-0"
          tabIndex={0}
          role="region"
          aria-label={`${silo === "kadin" ? "Kadın" : "Erkek"} beden illüstrasyonları, yatay kaydırılabilir`}
        >
          <ol className="flex w-max gap-2 md:grid md:w-auto" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
            {items.map((x) => (
              <li key={x.s} className="relative flex w-[5.75rem] shrink-0 flex-col items-center rounded-card bg-[#F5F2EE] px-1 pb-2 pt-2 md:w-auto">
                <span className="text-sm font-extrabold text-[#8a2146]">
                  <span className="sr-only">Beden </span>
                  {x.s}
                </span>
                <ScaledBodyFigure silo={silo} ratios={x.ratios} garment={cfg.garment} color={cfg.color} className="mt-1 h-auto w-full" />
                <span className="mt-1 text-center text-[0.6875rem] leading-tight text-muted">
                  Göğüs {fmt(x.row[cfg.upper])}
                  <span className="sr-only"> cm</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <figcaption className="mt-2 text-xs text-muted">
          İllüstrasyondur; ölçüler {chart.brandName} vücut tablosundan orantılanmıştır, kişiden kişiye değişir.
          {cfg.lower ? null : " Tabloda kalça ölçüsü olmadığı için alt gövde, göğüs ve bel oranlarının ortalamasıyla çizildi."} Göğüs değerleri cm, vücut ölçüsüdür. Kaynak:{" "}
          <a href={chart.sourceUrl} rel="noopener noreferrer" className="underline underline-offset-2">
            {chart.brandName} resmi beden tablosu
          </a>
          {brand ? (
            <>
              {" · "}
              <Link href={brand.path} className="underline underline-offset-2">
                {chart.brandName} marka dosyası
              </Link>
            </>
          ) : null}
          .
        </figcaption>
      </figure>
    </section>
  );
}

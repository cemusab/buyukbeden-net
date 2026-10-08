/**
 * Marka ↔ beden bileşenleri (sunucu): {% marka-filtresi %} CTA'sı, kategori bloğu ve marka sayfası özet kartı.
 * Türetme: src/lib/brand-sizes.ts. Yalnız doğrulanmış (kaynaklı) veri gösterilir; veri yoksa bölüm hiç basılmaz.
 */
import Link from "next/link";
import { getBrands, getSizeCharts, getToday } from "@/lib/content";
import type { DocMeta } from "@/lib/content-types";
import { hasRoute } from "@/lib/routes";
import { formatDate } from "@/lib/present";
import {
  brandCategories,
  brandCharts,
  brandCovers,
  brandGenders,
  brandsForCategory,
  brandsForSize,
  coverKind,
  coverText,
  hiddenFields,
  parseSizeQuery,
  trAccess,
  } from "@/lib/brand-sizes";
import { CHART_KIND_LABEL, FINDER_WARNING, isFootwear, isMeasure, PRODUCT_TYPE_LABEL, type Gender } from "@/lib/size-core";
import { CATEGORIES, categoryLabel } from "@/lib/taxonomy";
import { ConfidenceBadge, ConfidenceLegend } from "./Confidence";

const G_LABEL: Record<Gender, string> = { kadin: "Kadın", erkek: "Erkek" };

/** /markalar?cinsiyet=…&beden=… (yalnız dizin sayfası varsa) */
export function directoryHref(q: { gender?: Gender; size?: string; kategori?: string }): string | undefined {
  if (!hasRoute("/markalar")) return undefined;
  const p = new URLSearchParams();
  if (q.gender) p.set("cinsiyet", q.gender);
  if (q.size) p.set("beden", q.size);
  if (q.kategori) p.set("kategori", q.kategori);
  const s = p.toString();
  return s ? `/markalar?${s}` : "/markalar";
}

/** {% marka-filtresi cinsiyet="kadin" beden="52" kategori="elbise" /%} */
export function BrandFilterCta({ cinsiyet, beden, kategori }: { cinsiyet: Gender; beden: string; kategori?: string }) {
  const q = parseSizeQuery(beden, cinsiyet);
  if (!q) return null;
  const matches = brandsForSize(getBrands(), getSizeCharts(), { size: beden, gender: cinsiyet, kategori }, getToday());
  if (!matches.length) return null;
  const inCat = kategori ? matches.filter((m) => m.category) : [];
  const useCat = inCat.length > 0;
  const preview = (useCat ? inCat : matches).slice(0, 5);
  const total = useCat ? inCat.length : matches.length;
  const catLabel = kategori ? categoryLabel(cinsiyet, kategori).toLocaleLowerCase("tr") : undefined;
  const href = directoryHref({ gender: cinsiyet, size: q.label, kategori: useCat ? kategori : undefined });
  return (
    <aside className="not-prose my-8 rounded-card border border-primary/20 bg-primary-soft p-5" data-marka-filtresi={`${cinsiyet}-${q.label}`}>
      <p className="text-eyebrow font-bold uppercase tracking-[0.12em] text-primary">Marka dizini · {G_LABEL[cinsiyet]}</p>
      <p className="mt-1 text-h3 font-bold text-ink">
        {q.label} bedeni doğrulanmış {useCat ? `${catLabel} kategorili ` : ""}markalar
      </p>
      <p className="mt-1 text-sm text-ink-2">
        Kaynaklı beden tablosuna ya da markanın resmi beden bilgisine göre {G_LABEL[cinsiyet].toLocaleLowerCase("tr")} {q.label} bedeni kapsayan {total} marka
        {kategori && !useCat ? ` (${catLabel} kategorisinde doğrulanmış marka yok; tüm kategoriler gösteriliyor)` : ""}. Bu, markanın genel beden aralığıdır; her ürün ve kategori aynı aralığı sunmayabilir.
      </p>
      <ul className="mt-3 divide-y divide-line rounded-card border border-line bg-surface">
        {preview.map((m) => (
          <li key={m.brand.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-sm">
            <Link href={m.brand.path} className="font-bold text-ink underline-offset-4 hover:text-primary hover:underline">
              {m.brand.label}
            </Link>
            <span className="tabular-nums text-ink-2">{coverText(m.cover)}</span>
            <span className="text-xs text-muted">{coverKind(m.cover)}</span>
            <ConfidenceBadge level={m.cover.confidence} className="ml-auto" />
          </li>
        ))}
      </ul>
      {href ? (
        <Link href={href} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-white hover:bg-primary-hover">
          {q.label} bedeni doğrulanmış markaları gör <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </aside>
  );
}

/** Kategori hub'ı: "Bu kategoride doğrulanmış beden aralığı olan markalar" */
export function CategoryBrands({ silo, category }: { silo: Gender; category: string }) {
  const rows = brandsForCategory(getBrands(), getSizeCharts(), silo, category, getToday());
  if (!rows.length) return null;
  const label = categoryLabel(silo, category).toLocaleLowerCase("tr");
  return (
    <section aria-labelledby="dogrulanmis-markalar" className="mt-12" data-kategori-markalari>
      <h2 id="dogrulanmis-markalar" className="text-h2 font-bold text-ink">
        Bu kategoride doğrulanmış beden aralığı olan markalar
      </h2>
      <p className="mt-1 max-w-prose text-sm text-muted">
        {G_LABEL[silo]} {label} kategorisi olan ya da bu ürün tipinde kaynaklı beden tablosu yayımlayan markalar. Aralıklar markanın tablosundan veya resmi beden bilgisinden türetilir; ürün stoğu
        değildir, her ürün aynı aralığı sunmayabilir. Sıralama güven düzeyine ve ada göredir, bir öneri sıralaması değildir.
      </p>
      <div role="region" aria-label="Doğrulanmış beden aralığı olan markalar" tabIndex={0} className="table-scroll mt-4 overflow-x-auto rounded-card border border-line">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <thead className="bg-soft text-xs uppercase tracking-wide text-muted">
            <tr>
              <th scope="col" className="px-4 py-2">
                Marka
              </th>
              <th scope="col" className="px-4 py-2">
                Beden aralığı
              </th>
              <th scope="col" className="px-4 py-2">
                Tablo türü
              </th>
              <th scope="col" className="px-4 py-2">
                Türkiye erişimi
              </th>
              <th scope="col" className="px-4 py-2">
                Güven
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map(({ brand, cover }) => (
              <tr key={brand.id}>
                <th scope="row" className="px-4 py-2.5 font-bold">
                  <Link href={brand.path} className="text-ink underline-offset-4 hover:text-primary hover:underline">
                    {brand.label}
                  </Link>
                </th>
                <td className="px-4 py-2.5 tabular-nums text-ink">
                  {coverText(cover)}
                  {cover.basis === "chart" && cover.productType && cover.productType !== category ? (
                    <span className="block text-xs text-muted">{PRODUCT_TYPE_LABEL[cover.productType as keyof typeof PRODUCT_TYPE_LABEL] ?? cover.productType} tablosu</span>
                  ) : null}
                </td>
                <td className="px-4 py-2.5 text-ink-2">{coverKind(cover)}</td>
                <td className="px-4 py-2.5 text-ink-2">{trAccess(brand) ?? "Doğrulanmadı"}</td>
                <td className="px-4 py-2.5">
                  <ConfidenceBadge level={cover.confidence} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfidenceLegend className="mt-3 max-w-prose" />
    </section>
  );
}

/** Marka sayfası üst özet kartı: yalnız doğrulanmış alanlar. */
export function BrandSummaryCard({ doc }: { doc: DocMeta }) {
  const today = getToday();
  const charts = getSizeCharts();
  const hide = hiddenFields(doc);
  const genders = brandGenders(doc);
  const covers = brandCovers(doc, charts, today);
  const linked = brandCharts(doc, charts).filter(isMeasure);
  const cats = brandCategories(doc);
  const access = trAccess(doc);
  const kinds = [...new Set(linked.filter((c) => !isFootwear(c)).map((c) => CHART_KIND_LABEL[c.measurementType]))];
  const brandRange = covers.filter((c) => c.basis === "brand");
  // Kategori bazlı: her tablo için (cinsiyet + ürün tipi) bir satır; harf varsa harf, yoksa numara
  const perChart = linked
    .map((c) => {
      const cs = covers.filter((x) => x.chartId === c.id);
      const cover = cs.find((x) => x.system === (c.gender === "erkek" ? "harf" : "num")) ?? cs[0];
      return cover ? { chart: c, cover } : null;
    })
    .filter((x): x is NonNullable<typeof x> => !!x);
  const catLinks = genders.flatMap((g) =>
    cats
      .filter((c) => CATEGORIES[g].some((x) => x.key === c))
      .map((c) => ({ key: `${g}-${c}`, href: `/${g}/giyim/${c}`, label: `${G_LABEL[g]} ${categoryLabel(g, c).toLocaleLowerCase("tr")}` })),
  );
  const row = (k: string, v: React.ReactNode) => (
    <div className="bg-surface p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{k}</dt>
      <dd className="mt-1 text-[0.9375rem] text-ink">{v}</dd>
    </div>
  );
  return (
    <section aria-labelledby="marka-ozeti" className="rounded-card border border-line bg-soft p-4 sm:p-5" data-marka-ozeti>
      <h2 id="marka-ozeti" className="text-h3 font-bold text-ink">
        Marka özeti
      </h2>
      <dl className="mt-3 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
        {row("Kime", genders.map((g) => G_LABEL[g]).join(" ve "))}
        {row(
          "Doğrulanmış beden aralığı",
          brandRange.length || perChart.length ? (
            <ul className="space-y-0.5" data-ozet-beden>
              {genders.map((g) => {
                const b = brandRange.find((c) => c.gender === g);
                const fromCharts = perChart.filter((p) => p.chart.gender === g && !isFootwear(p.chart));
                if (!b && !fromCharts.length) return null;
                return (
                  <li key={g}>
                    <strong>{G_LABEL[g]}:</strong> {b ? `${coverText(b)} (marka beden aralığı)` : `${fromCharts.length > 1 ? "tablolara göre " : "tabloya göre "}${fromCharts.map((p) => coverText(p.cover)).join(", ")}`}
                  </li>
                );
              })}
            </ul>
          ) : (
            "Doğrulanmadı"
          ),
        )}
        {row("Türkiye erişimi", access ?? "Doğrulanmadı")}
        {row("Son kontrol", <time dateTime={String(doc.fm.lastVerifiedAt)}>{formatDate(String(doc.fm.lastVerifiedAt))}</time>)}
        {row("Tablo türü", kinds.length ? kinds.join(" · ") : "Kaynaklı beden tablosu yok")}
        {row(
          "Kategori kapsamı",
          catLinks.length ? (
            <span className="flex flex-wrap gap-x-2 gap-y-1">
              {catLinks.map((c) =>
                hasRoute(c.href) ? (
                  <Link key={c.key} href={c.href} className="text-primary underline underline-offset-2">
                    {c.label}
                  </Link>
                ) : (
                  <span key={c.key}>{c.label}</span>
                ),
              )}
            </span>
          ) : hide.has("categories") ? (
            "Doğrulanıyor"
          ) : (
            "Belirtilmedi"
          ),
        )}
      </dl>
      {perChart.length ? (
        <div className="mt-4">
          <h3 className="text-sm font-bold text-ink">Kategori bazlı doğrulanmış aralık</h3>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-2" data-ozet-kategori>
            {perChart.map(({ chart, cover }) => (
              <li key={chart.id} className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <a href={`#tablo-${chart.id}`} className="font-semibold text-ink underline underline-offset-2 hover:text-primary">
                  {G_LABEL[chart.gender]} {(PRODUCT_TYPE_LABEL[chart.productType] ?? chart.productType).toLocaleLowerCase("tr")}
                  {chart.productType === "genel" ? " (genel tablo)" : ""}: {coverText(cover)}
                </a>
                <span className="text-muted">({CHART_KIND_LABEL[chart.measurementType].toLocaleLowerCase("tr")})</span>
                <ConfidenceBadge level={cover.confidence} />
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted">{FINDER_WARNING}</p>
        </div>
      ) : null}
      {perChart.length ? <ConfidenceLegend className="mt-3" /> : null}
    </section>
  );
}

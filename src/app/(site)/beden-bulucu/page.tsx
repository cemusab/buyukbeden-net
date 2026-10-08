import Link from "next/link";
import { getSettings, getToday } from "@/lib/content";
import { webApplicationLd } from "@/lib/jsonld";
import { simpleMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/present";
import { FINDER_WARNING } from "@/lib/size-core";
import { hasRoute } from "@/lib/routes";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { BedenBulucuSection, finderChartsWithLinks } from "@/components/content/BedenBulucuSection";
import { ConfidenceLegend } from "@/components/content/Confidence";
import { JsonLd } from "@/components/ui/primitives";

const TITLE = "Beden Bulucu: Ölçünüze Göre Marka Marka Beden";
const DESCRIPTION = "Göğüs, bel ve basen ölçünüzü girin; kaynaklı marka beden tablolarıyla karşılaştırıp marka marka yaklaşık bedeninizi, kaynağını ve güven düzeyini görün.";

export const metadata = simpleMetadata({ title: TITLE, description: DESCRIPTION, path: "/beden-bulucu" });

/** Beden Bulucu araç sayfası (docs/seo-analizi-2026-10-08.md P0-1). Veriler kaynaklı vücut ölçüsü tablolarıdır; ölçüler saklanmaz ve URL'ye yazılmaz. */
export default function BedenBulucuPage() {
  const charts = finderChartsWithLinks();
  const brands = new Set(charts.map((c) => c.brandName)).size;
  const byGender = (g: "kadin" | "erkek") => [...new Set(charts.filter((c) => c.gender === g).map((c) => c.brandName))].sort((a, b) => a.localeCompare(b, "tr"));
  const today = getToday();
  const oldest = charts.map((c) => c.lastVerifiedAt).sort()[0];
  const links = [
    { href: "/beden-rehberi/olcu-alma-rehberi", label: "Ölçü nasıl alınır?" },
    { href: "/markalar", label: "Marka dizini (beden filtreli)" },
    { href: "/kadin/beden-rehberi", label: "Kadın beden rehberi" },
    { href: "/erkek/beden-rehberi", label: "Erkek beden rehberi" },
    { href: "/beden-rehberi/boy-kilo-beden-neden-yaniltir", label: "Boy ve kilo bedeni neden belirlemez?" },
  ].filter((l) => hasRoute(l.href));
  return (
    <div className="container-page pb-16 pt-4" data-template="BEDEN_BULUCU">
      <Breadcrumbs path="/beden-bulucu" />
      <header className="mt-4 max-w-prose">
        <h1 className="text-h1 font-extrabold text-ink">Beden Bulucu</h1>
        <p className="mt-3 text-[1.0625rem] text-ink-2">
          Çevre ölçünüzü santim olarak girin; araç {brands} markanın ve referans kaynağın {charts.length} kaynaklı <strong>vücut ölçüsü</strong> tablosuyla karşılaştırır. Her sonuçta önerilen beden aralığı, veri türü, son kontrol
          tarihi, güven düzeyi ve kaynak görünür. Satış yapmayız; amaç doğru bedeni ve markayı bulmanıza yardım etmektir.
        </p>
      </header>
      <BedenBulucuSection title="Ölçülerinizi girin" className="mt-8" />
      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section aria-labelledby="nasil-calisir" className="max-w-prose">
          <h2 id="nasil-calisir" className="text-h2 font-bold text-ink">
            Nasıl çalışır?
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-[0.9375rem] text-ink-2">
            <li>Girdiğiniz göğüs, bel ve basen (erkekte kalça) ölçüsü, markaların resmi sitelerinde yayımladığı vücut ölçüsü tablolarının satırlarıyla karşılaştırılır.</li>
            <li>Ölçünüz bir satırın aralığına düşüyorsa o beden, iki satırın arasına düşüyorsa iki beden birlikte önerilir. Ölçüleriniz farklı bedenlere düşerse aralık genişler.</li>
            <li>Ürün (giysi) ölçüsü tabloları, ölçü türü kaynakta açıkça yazmayan tablolar ve yalnız bir bölümü aktarılmış tablolar bu araca girmez; marka sayfalarında ayrıca gösterilir.</li>
            <li>Boy yalnız tablonun tanımlandığı boy aralığına göre kısa/uzun boy notu için kullanılır. Yalnız boy ve kilo girilirse beden önerilmez; sonuç &quot;Tahmini&quot; etiketlenir.</li>
          </ol>
          <p className="mt-4 rounded-card border border-warn-line bg-warn px-4 py-3 text-sm font-semibold text-ink">{FINDER_WARNING}</p>
          <h2 id="guven-duzeyi" className="mt-10 text-h2 font-bold text-ink">
            Güven düzeyi
          </h2>
          <p className="mt-2 text-[0.9375rem] text-ink-2">
            Her sonuç, verinin kaynağına ve güncelliğine göre şeffaf bir kuralla etiketlenir. Kural bütün sitede (marka sayfaları, kategori listeleri, marka dizini) aynıdır.
          </p>
          <ConfidenceLegend className="mt-3" open />
          <h2 id="gizlilik" className="mt-10 text-h2 font-bold text-ink">
            Gizlilik
          </h2>
          <p className="mt-2 text-[0.9375rem] text-ink-2">
            Hesaplama tamamen tarayıcınızda yapılır. Ölçüleriniz bir sunucuya gönderilmez, kaydedilmez ve sayfa adresine (URL) yazılmaz; çerez kullanılmaz. Sayfayı kapattığınızda değerler silinir.
          </p>
        </section>
        <aside className="space-y-4">
          <section aria-labelledby="kapsam" className="rounded-card border border-line bg-surface p-5">
            <h2 id="kapsam" className="text-h3 font-bold text-ink">
              Kapsanan tablolar
            </h2>
            {(["kadin", "erkek"] as const).map((g) =>
              byGender(g).length ? (
                <p key={g} className="mt-2 text-sm text-ink-2">
                  <strong className="text-ink">{g === "kadin" ? "Kadın" : "Erkek"}:</strong> {byGender(g).join(", ")}
                </p>
              ) : null,
            )}
            {oldest ? (
              <p className="mt-3 text-xs text-muted">
                En eski kontrol: <time dateTime={oldest}>{formatDate(oldest)}</time> · Veri derlemesi: <time dateTime={today}>{formatDate(today)}</time>
              </p>
            ) : null}
          </section>
          {links.length ? (
            <nav aria-label="İlgili rehberler" className="rounded-card border border-line bg-surface p-5">
              <h2 className="text-h3 font-bold text-ink">İlgili rehberler</h2>
              <ul className="mt-2 space-y-0.5">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline-offset-4 hover:underline">
                      {l.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </aside>
      </div>
      <JsonLd data={[webApplicationLd(getSettings(), { path: "/beden-bulucu", name: "Beden Bulucu", description: DESCRIPTION })]} />
    </div>
  );
}

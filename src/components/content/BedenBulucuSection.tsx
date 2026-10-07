import Link from "next/link";
import { getSizeCharts, hasRoute } from "@/lib/content";
import { finderCharts, type Gender } from "@/lib/size-core";
import { BedenBulucu } from "./BedenBulucu";

const pick = (...paths: string[]) => paths.find((p) => hasRoute(p));

/**
 * Beden Bulucu bölümü. JS olmadan da anlamlıdır (aşamalı geliştirme): açıklama ve ölçü/tablo linkleri sunucuda basılır,
 * etkileşimli form yalnız tarayıcıda görünür. Veri saklanmaz, çerez ve ağ isteği yoktur.
 */
export function BedenBulucuSection({ gender }: { gender?: Gender }) {
  const charts = finderCharts(getSizeCharts()).filter((c) => !gender || c.gender === gender);
  if (!charts.length) return null;
  const links = {
    kadin: { measure: pick("/kadin/beden-rehberi/olcu-nasil-alinir", "/beden-rehberi/olcu-alma-rehberi"), tables: pick("/kadin/beden-rehberi/beden-tablosu") },
    erkek: { measure: pick("/erkek/beden-rehberi/olcu-nasil-alinir", "/beden-rehberi/olcu-alma-rehberi"), tables: pick("/erkek/beden-rehberi/beden-tablosu") },
  };
  const brands = new Set(charts.map((c) => c.brandName)).size;
  const fieldText = gender === "erkek" ? "göğüs, bel ve kalça" : gender === "kadin" ? "göğüs, bel ve basen" : "göğüs, bel ve basen (erkekte kalça)";
  const shown = gender ? [gender] : (["kadin", "erkek"] as const);
  return (
    <section aria-labelledby="beden-bulucu" className="mt-10 rounded-card border border-line bg-soft p-5 sm:p-6" data-beden-bulucu-bolum>
      <h2 id="beden-bulucu" className="text-h2 font-bold text-ink">
        Beden Bulucu
      </h2>
      <p className="mt-2 max-w-prose text-[0.9375rem] text-ink-2">
        {fieldText[0].toLocaleUpperCase("tr") + fieldText.slice(1)} çevrenizi santim olarak girin; araç ölçünüzü {brands} markanın kaynaklı <strong>vücut ölçüsü</strong> tablosuyla karşılaştırır ve marka marka
        yaklaşık beden aralığını, kaynağıyla birlikte gösterir. Boy ve kilo tek başına bedeni belirlemediği için yalnız boy/kilo ile beden önermez. Hesaplama tarayıcınızda yapılır; girdiğiniz değerler kaydedilmez ve gönderilmez.
      </p>
      <noscript>
        <p className="mt-3 max-w-prose rounded-card border border-line bg-surface p-4 text-sm text-ink-2">
          Beden Bulucu tarayıcınızda JavaScript ile çalışır. JavaScript kapalıysa ölçünüzü aşağıdaki bağlantılardaki marka tablolarıyla kendiniz karşılaştırabilirsiniz.
        </p>
      </noscript>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {shown.flatMap((g) => {
          const l = links[g];
          const who = g === "kadin" ? "Kadın" : "Erkek";
          return [
            l.measure ? (
              <li key={`${g}-m`}>
                <Link href={l.measure} className="inline-flex min-h-11 items-center font-semibold text-primary underline-offset-4 hover:underline">
                  {gender ? "Ölçü nasıl alınır?" : `${who}: ölçü nasıl alınır?`}
                </Link>
              </li>
            ) : null,
            l.tables ? (
              <li key={`${g}-t`}>
                <Link href={l.tables} className="inline-flex min-h-11 items-center font-semibold text-primary underline-offset-4 hover:underline">
                  {gender ? "Marka beden tabloları" : `${who} beden tabloları`}
                </Link>
              </li>
            ) : null,
          ];
        })}
      </ul>
      <BedenBulucu charts={charts} gender={gender} links={links} />
    </section>
  );
}

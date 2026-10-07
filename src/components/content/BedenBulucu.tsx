"use client";

/**
 * Beden Bulucu (CLAUDE.md Beden Kuralları 6). Tamamen tarayıcıda çalışır:
 * veri saklanmaz, çerez yok, ağ isteği yok. Ölçüler sayfaya gömülü, kaynaklı vücut ölçüsü tablolarıyla karşılaştırılır.
 * Yalnız boy/kilo girilirse beden önerilmez; sonuç "Tahmini" etiketlenir ve ölçü almaya yönlendirilir.
 */
import { useId, useState, useSyncExternalStore } from "react";
import { CHART_SOURCE_TYPE_LABEL, fmtNum, PRODUCT_TYPE_LABEL, runFinder, type FinderChart, type FinderField, type Gender } from "@/lib/size-core";

const noop = () => () => {};
const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

type Links = { measure?: string; tables?: string };

function parse(v: string, min: number, max: number): number | undefined {
  const n = Number(v.replace(",", "."));
  return v.trim() && Number.isFinite(n) && n >= min && n <= max ? n : undefined;
}

export function BedenBulucu({ charts, gender: fixed, links }: { charts: FinderChart[]; gender?: Gender; links: Record<Gender, Links> }) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const uid = useId();
  const [gender, setGender] = useState<Gender>(fixed ?? "kadin");
  const [v, setV] = useState({ gogus: "", bel: "", basen: "", boy: "", kilo: "" });
  if (!mounted) return null;

  const g = fixed ?? gender;
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV((s) => ({ ...s, [k]: e.target.value }));
  const main: FinderField = g === "kadin" ? "bust" : "chest";
  const input: Partial<Record<FinderField, number>> = {};
  const gogus = parse(v.gogus, 50, 260);
  const bel = parse(v.bel, 40, 260);
  const basen = parse(v.basen, 50, 280);
  if (gogus) input[main] = gogus;
  if (bel) input.waist = bel;
  if (basen) input.hip = basen;
  const boy = parse(v.boy, 120, 230);
  const kilo = parse(v.kilo, 30, 350);
  const hasMeasure = Object.keys(input).length > 0;
  const pool = charts.filter((c) => c.gender === g);
  const results = hasMeasure ? runFinder(pool, input, boy) : [];
  const onlyHeightWeight = !hasMeasure && (boy !== undefined || kilo !== undefined);
  const outside = boy ? pool.filter((c) => c.heightRange && (boy < c.heightRange.min - 2 || boy > c.heightRange.max + 2)) : [];
  const l = links[g];
  const FIELD = { bust: "Göğüs", chest: "Göğüs", waist: "Bel", hip: g === "kadin" ? "Basen" : "Kalça" } as const;
  const inputCls = "mt-1 block min-h-11 w-full rounded-lg border border-line-strong bg-surface px-3 text-base text-ink tabular-nums focus:border-primary focus:outline-2 focus:outline-primary";

  return (
    <div data-beden-bulucu className="mt-5">
      <form onSubmit={(e) => e.preventDefault()} aria-describedby={`${uid}-not`} noValidate>
        {fixed ? null : (
          <fieldset className="mb-4">
            <legend className="text-sm font-bold text-ink">Kimin için?</legend>
            <div className="mt-2 inline-flex rounded-full border border-line bg-soft p-1">
              {(["kadin", "erkek"] as const).map((x) => (
                <label key={x} className={`inline-flex min-h-11 cursor-pointer items-center rounded-full px-5 text-sm font-bold ${g === x ? "bg-primary text-white" : "text-ink-2"}`}>
                  <input type="radio" name={`${uid}-cinsiyet`} value={x} checked={g === x} onChange={() => setGender(x)} className="sr-only" />
                  {x === "kadin" ? "Kadın" : "Erkek"}
                </label>
              ))}
            </div>
          </fieldset>
        )}
        <div className="grid gap-3 sm:grid-cols-3">
          {(
            [
              ["gogus", "Göğüs çevresi", "cm"],
              ["bel", g === "kadin" ? "Bel çevresi" : "Bel / karın çevresi", "cm"],
              ["basen", g === "kadin" ? "Basen çevresi" : "Kalça çevresi", "cm"],
            ] as const
          ).map(([k, label, unit]) => (
            <label key={k} className="block text-sm font-semibold text-ink">
              {label} ({unit})
              <input type="number" inputMode="decimal" min={40} max={280} step={0.5} name={k} value={v[k]} onChange={set(k)} className={inputCls} autoComplete="off" />
            </label>
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="block text-sm font-semibold text-ink">
            Boy (cm, isteğe bağlı)
            <input type="number" inputMode="numeric" min={120} max={230} step={1} name="boy" value={v.boy} onChange={set("boy")} className={inputCls} autoComplete="off" />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Kilo (kg, isteğe bağlı)
            <input type="number" inputMode="numeric" min={30} max={350} step={1} name="kilo" value={v.kilo} onChange={set("kilo")} className={inputCls} autoComplete="off" aria-describedby={`${uid}-kilo`} />
            <span id={`${uid}-kilo`} className="mt-1 block text-xs font-normal text-muted">
              Kilo bedeni belirlemez; yalnız ölçü girmediyseniz tahmini yönlendirme için.
            </span>
          </label>
          <div className="flex items-end">
            <button type="button" onClick={() => setV({ gogus: "", bel: "", basen: "", boy: "", kilo: "" })} className="min-h-11 rounded-full border border-line-strong px-5 text-sm font-bold text-ink-2 hover:border-primary hover:text-primary">
              Temizle
            </button>
          </div>
        </div>
        <p id={`${uid}-not`} className="mt-3 text-xs text-muted">
          Girdiğiniz değerler yalnız bu sayfada, tarayıcınızda hesaplanır; hiçbir yere gönderilmez ve kaydedilmez.
        </p>
      </form>

      <div aria-live="polite" className="mt-5" data-bulucu-sonuc>
        {hasMeasure ? (
          results.length ? (
            <>
              <p className="text-sm text-ink-2">
                <strong className="text-ink">{results.filter((r) => !r.noFit).length} tabloda</strong> ölçünüze karşılık bulundu. Bunlar yaklaşık önerilerdir; beden markaya ve ürüne göre değişir, satın almadan önce ürünün kendi tablosuna bakın.
              </p>
              <ul className="mt-3 grid gap-3 md:grid-cols-2">
                {results.map((r) => {
                  const rows = r.chart.rows;
                  const size = r.from === r.to ? rows[r.from].label : `${rows[r.from].label} – ${rows[r.to].label}`;
                  return (
                    <li key={r.chart.id} className="rounded-card border border-line bg-surface p-4" data-bulucu-marka={r.chart.id}>
                      <p className="font-bold text-ink">
                        {r.chart.brandName} <span className="font-normal text-muted">· {PRODUCT_TYPE_LABEL[r.chart.productType as keyof typeof PRODUCT_TYPE_LABEL] ?? r.chart.productType}</span>
                      </p>
                      {r.noFit ? (
                        <p className="mt-1 text-ink">Bu markanın tablosu ölçünüzü kapsamıyor.</p>
                      ) : (
                        <p className="mt-1 text-ink">
                          Önerilen beden aralığı: <strong className="text-primary">{size}</strong>
                        </p>
                      )}
                      <ul className="mt-2 space-y-0.5 text-sm text-ink-2">
                        {r.matches.map((m) => (
                          <li key={m.field}>
                            {FIELD[m.field]}:{" "}
                            {m.status === "below"
                              ? `tablonun en küçük bedeninden (${rows[m.from].label}) küçük`
                              : m.status === "above"
                                ? `tablonun en büyük bedenini (${rows[m.from].label}) aşıyor`
                                : m.from === m.to
                                  ? rows[m.from].label
                                  : `${rows[m.from].label} ile ${rows[m.to].label} arası`}
                          </li>
                        ))}
                      </ul>
                      {r.outOfRange && !r.noFit ? <p className="mt-2 text-sm text-ink-2">Ölçülerinizden biri markanın tablosunun dışında kalıyor; bu markada uygun beden olmayabilir.</p> : null}
                      {r.matches.length > 1 && r.from !== r.to ? <p className="mt-2 text-sm text-ink-2">Ölçüleriniz farklı bedenlere düşüyor: üst giyimde göğse, alt giyimde basen/kalçaya ve bele göre seçin.</p> : null}
                      {r.heightHint ? <p className="mt-2 text-sm text-ink-2">{r.heightHint}</p> : null}
                      <p className="mt-2 text-xs text-muted">
                        Kaynak:{" "}
                        <a href={r.chart.sourceUrl} rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">
                          {r.chart.sourceLabel}
                        </a>{" "}
                        ({CHART_SOURCE_TYPE_LABEL[r.chart.sourceType]}, son doğrulama {fmtDate(r.chart.lastVerifiedAt)}){r.chart.unit === "inch" ? "; inç tablosu, cm çevirisi bizim" : ""}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <p className="text-sm text-ink-2">Girilen ölçüler kaynaklı tabloların hiçbirinde karşılık bulmadı. Ölçüyü yeniden alıp kontrol edin.</p>
          )
        ) : onlyHeightWeight ? (
          <div className="rounded-card border border-note-line bg-note p-4" data-bulucu-tahmini>
            <p>
              <span className="inline-flex items-center rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-white">Tahmini</span>
            </p>
            <p className="mt-2 text-sm text-ink-2">
              Boy ve kilo bedeni belirlemez: aynı kilodaki iki kişi, kilonun vücuda dağılımına göre çoğu zaman farklı beden giyer. Bu yüzden boy ve kiloyla beden önermiyoruz; doğru sonuç için göğüs, bel ve {g === "kadin" ? "basen" : "kalça"} çevrenizi ölçüp yukarıya girin.
            </p>
            {boy !== undefined ? (
              outside.length ? (
                <p className="mt-2 text-sm text-ink-2">
                  Boyunuz ({fmtNum(boy, 0)} cm) bazı tabloların tanımlandığı boy aralığının dışında:{" "}
                  {outside.map((c) => `${c.brandName} (${c.heightRange!.min === c.heightRange!.max ? fmtNum(c.heightRange!.min, 0) : `${fmtNum(c.heightRange!.min, 0)}–${fmtNum(c.heightRange!.max, 0)}`} cm)`).join(", ")}. Bu markalarda boy ve kol uzunluğu farklı oturabilir; varsa kısa veya uzun boy serisine bakın.
                </p>
              ) : (
                <p className="mt-2 text-sm text-ink-2">Boyunuz, boy aralığı yayımlayan tabloların aralığında; yine de beden için çevre ölçüsü gerekir.</p>
              )
            ) : null}
            {l.measure ? (
              <p className="mt-3">
                <a href={l.measure} className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-bold text-white hover:bg-primary-hover">
                  Ölçü nasıl alınır? →
                </a>
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-muted">Sonuç için en az bir çevre ölçüsü girin. Ölçü almayı bilmiyorsanız {l.measure ? <a href={l.measure} className="font-semibold text-primary underline underline-offset-2">ölçü alma rehberine</a> : "ölçü alma rehberine"} bakın.</p>
        )}
      </div>
    </div>
  );
}

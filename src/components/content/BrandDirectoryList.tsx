"use client";

/**
 * Marka dizini + cinsiyet/beden/kategori filtresi (?cinsiyet=kadin&beden=52&kategori=elbise).
 * JS yoksa (ve sunucu çıktısında) tüm markalar listelenir; filtre tarayıcıda URL parametrelerinden uygulanır.
 * Filtreli görünümler ayrı indekslenmez: canonical /markalar, robots.txt "Disallow: /markalar?", ayrıca filtre açıkken noindex meta.
 * Eşleştirme kuralı marka sayfası ve {% marka-filtresi %} ile aynıdır (src/lib/brand-sizes.ts).
 */
import Link from "next/link";
import { useEffect, useId, useSyncExternalStore } from "react";
import { coverKind, coverText, matchCover, parseSizeQuery, type SizeCover } from "@/lib/brand-sizes";
import type { Gender } from "@/lib/size-core";
import { ConfidenceBadge } from "./Confidence";

export type DirectoryBrand = {
  id: string;
  label: string;
  path: string;
  genders: Gender[];
  tags: string[];
  intl: boolean;
  covers: SizeCover[];
  /** Doğrulanmış kategoriler (kategori listesi + tablo ürün tipleri), cinsiyete göre */
  cats: Record<Gender, string[]>;
};
type Filter = { id: string; label: string };

const EVENT = "bb:marka-filtresi";
const subscribe = (cb: () => void) => {
  window.addEventListener("popstate", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(EVENT, cb);
  };
};
const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};
const G_LABEL: Record<Gender, string> = { kadin: "Kadın", erkek: "Erkek" };

function go(url: string) {
  window.history.pushState(null, "", url);
  window.dispatchEvent(new Event(EVENT));
}

export function BrandDirectoryList({ brands, filters, categoryLabels }: { brands: DirectoryBrand[]; filters: Filter[]; categoryLabels: Record<string, string> }) {
  const uid = useId();
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );
  const p = new URLSearchParams(search);
  const gRaw = p.get("cinsiyet");
  const g = gRaw === "kadin" || gRaw === "erkek" ? gRaw : undefined;
  const bedenRaw = (p.get("beden") ?? "").trim().slice(0, 8);
  const q = bedenRaw ? parseSizeQuery(bedenRaw, g) : undefined;
  const kRaw = p.get("kategori") ?? "";
  const kategori = categoryLabels[kRaw] ? kRaw : undefined;
  const active = !!(g || q || kategori);

  // Filtreli görünüm ayrı sayfa olarak indekslenmesin
  useEffect(() => {
    let m = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!m) {
      m = document.createElement("meta");
      m.name = "robots";
      document.head.appendChild(m);
    }
    const prev = m.content;
    if (active) m.content = "noindex, follow";
    return () => {
      if (m) m.content = prev;
    };
  }, [active]);

  const rows = brands.map((b) => {
    const genderOk = !g || b.genders.includes(g);
    const cover = q ? matchCover(b.covers, q.label, g) : undefined;
    const catOk = !kategori || (g ? b.cats[g] : [...b.cats.kadin, ...b.cats.erkek]).includes(kategori);
    return { b, cover, show: genderOk && (!q || !!cover) && catOk };
  });
  const shown = rows.filter((r) => r.show);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const n = new URLSearchParams();
    for (const k of ["cinsiyet", "beden", "kategori"]) {
      const v = String(fd.get(k) ?? "").trim();
      if (v) n.set(k, v);
    }
    const s = n.toString();
    go(s ? `/markalar?${s}` : "/markalar");
  };
  const summary = [g ? G_LABEL[g] : null, q ? `${q.label} beden` : null, kategori ? categoryLabels[kategori] : null].filter(Boolean).join(" · ");
  const field = "mt-1 block min-h-11 w-full rounded-lg border border-line-strong bg-surface px-3 text-base text-ink focus:border-primary focus:outline-2 focus:outline-primary";

  return (
    <>
      <form action="/markalar" method="get" onSubmit={onSubmit} className="mb-5 grid gap-3 rounded-card border border-line bg-soft p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end" role="search" aria-label="Markaları cinsiyete ve bedene göre filtrele" data-marka-filtre-form>
        <label className="block text-sm font-semibold text-ink">
          Kimin için?
          <select name="cinsiyet" defaultValue={g ?? ""} key={`g-${g ?? ""}`} className={field}>
            <option value="">Kadın ve erkek</option>
            <option value="kadin">Kadın</option>
            <option value="erkek">Erkek</option>
          </select>
        </label>
        <label className="block text-sm font-semibold text-ink">
          Beden (ör. 52 veya 4XL)
          <input name="beden" type="text" inputMode="text" autoComplete="off" maxLength={8} defaultValue={q?.label ?? bedenRaw} key={`b-${bedenRaw}`} className={field} aria-describedby={`${uid}-not`} />
        </label>
        {kategori ? <input type="hidden" name="kategori" value={kategori} /> : null}
        <button type="submit" className="min-h-11 rounded-full bg-primary px-6 text-sm font-bold text-white hover:bg-primary-hover">
          Filtrele
        </button>
        <p id={`${uid}-not`} className="text-xs text-muted sm:col-span-3">
          Yalnız kaynaklı beden tablosu ya da markanın resmi beden bilgisiyle doğrulanmış aralıklar eşleşir. Harf ve numara birbirine çevrilmez; 52 için numara, 4XL için harf arayın.
        </p>
      </form>

      {active ? (
        <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-card border border-primary/20 bg-primary-soft px-4 py-3 text-sm" role="status" data-filtre-ozeti>
          <span>
            <strong className="text-ink">{shown.length} marka</strong> <span className="text-ink-2">· {summary}</span>
          </span>
          {bedenRaw && !q ? <span className="text-bad">&quot;{bedenRaw}&quot; tanınmadı; ör. 52 ya da 4XL yazın.</span> : null}
          <a
            href="/markalar"
            onClick={(e) => {
              e.preventDefault();
              go("/markalar");
            }}
            className="ml-auto inline-flex min-h-11 items-center font-semibold text-primary underline-offset-4 hover:underline"
          >
            Filtreyi temizle
          </a>
          {q ? <span className="basis-full text-xs text-ink-2">Bu, markanın genel beden aralığıdır; her ürün ve kategori aynı beden aralığını sunmayabilir.</span> : null}
        </div>
      ) : null}

      {filters.map((f) => (
        <span key={f.id} id={f.id} className="bf-target block scroll-mt-28" />
      ))}
      {!active && filters.length > 2 ? (
        <nav aria-label="Marka filtresi" className="scroll-strip -mx-4 px-4">
          <ul className="flex w-max gap-2 pb-1">
            {filters.map((f) => (
              <li key={f.id}>
                <a href={`#${f.id}`} className={`bf-pill bf-pill-${f.id} inline-flex min-h-11 items-center whitespace-nowrap rounded-full border border-line-strong px-4 text-sm font-semibold`}>
                  {f.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
      {active && !shown.length ? <p className="mt-5 text-ink-2">Bu ölçütlerle doğrulanmış beden verisi olan marka bulunamadı. Bedeni farklı yazmayı (numara / harf) ya da cinsiyet filtresini kaldırmayı deneyin.</p> : null}
      <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {rows.map(({ b, cover, show }) => (
          <li key={b.id} data-brand={b.id} data-g={b.tags.join(" ")} hidden={!show}>
            <article className="group relative flex h-full flex-col rounded-card border border-line bg-surface p-4 hover:border-primary/40">
              <div className="flex h-16 items-center justify-center rounded-md bg-soft px-2 text-center text-lg font-extrabold tracking-tight text-ink" aria-hidden="true">
                {b.label}
              </div>
              <h3 className="mt-3 font-bold text-ink">
                <Link href={b.path} className="after:absolute after:inset-0 group-hover:underline underline-offset-4">
                  {b.label}
                </Link>
              </h3>
              <p className="mt-1 text-xs text-muted">
                {b.genders.map((x) => G_LABEL[x]).join(" · ")}
                {b.intl ? " · Uluslararası" : ""}
              </p>
              {cover ? (
                <div className="mt-2 space-y-1 border-t border-line pt-2 text-xs text-ink-2" data-eslesen-aralik>
                  <p>
                    <strong className="text-ink">
                      {G_LABEL[cover.gender]} {coverText(cover)}
                    </strong>
                  </p>
                  <p>{coverKind(cover)}</p>
                  <ConfidenceBadge level={cover.confidence} />
                  <p>
                    Kaynak:{" "}
                    {cover.basis === "chart" ? (
                      <a href={cover.sourceUrl} rel="noopener noreferrer" className="relative z-10 underline underline-offset-2 hover:text-primary">
                        {cover.sourceLabel}
                      </a>
                    ) : (
                      <a href={cover.sourceUrl} className="relative z-10 underline underline-offset-2 hover:text-primary">
                        marka dosyası
                      </a>
                    )}{" "}
                    · kontrol {fmtDate(cover.checkedAt)}
                  </p>
                </div>
              ) : null}
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}

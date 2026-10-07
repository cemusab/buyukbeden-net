"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { groupHits, loadEngine, runSearch, type SearchHit } from "@/lib/search-client";

/** /arama sonuçları: ?q= okunur, aynı motor (gruplu, tüm sonuçlar). */
export function SearchResults({ popular }: { popular: string[] }) {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const [hits, setHits] = useState<SearchHit[] | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let cancel = false;
    if (!q) {
      setHits([]);
      return;
    }
    setHits(null);
    loadEngine()
      .then((ms) => !cancel && setHits(runSearch(ms, q, 60)))
      .catch(() => !cancel && setErr(true));
    return () => {
      cancel = true;
    };
  }, [q]);

  const groups = hits ? groupHits(hits, 20) : [];
  return (
    <div className="mt-6">
      <form action="/arama" method="get" role="search" aria-label="Sitede ara" className="flex max-w-xl gap-2">
        <label htmlFor="arama-sayfa" className="sr-only">
          Aranacak ifade
        </label>
        <input
          id="arama-sayfa"
          name="q"
          type="search"
          defaultValue={q}
          key={q}
          placeholder="Ör. 52 beden, 4XL, viskon"
          className="h-12 min-w-0 flex-1 rounded-full border border-line-strong px-5 text-base focus:border-primary focus:outline-none"
        />
        <button type="submit" className="h-12 rounded-full bg-primary px-6 text-sm font-semibold text-white hover:bg-primary-hover">
          Ara
        </button>
      </form>
      <noscript>
        <p className="mt-6 text-ink-2">Arama sonuçlarını görmek için tarayıcınızda JavaScript açık olmalı. Aşağıdaki rehberlerden de başlayabilirsiniz.</p>
      </noscript>
      <div aria-live="polite" className="mt-8" data-search-results>
        {err ? <p className="text-bad">Arama şu anda yüklenemedi. Lütfen sayfayı yenileyin.</p> : null}
        {q && hits === null && !err ? <p className="text-muted">Aranıyor…</p> : null}
        {q && hits && hits.length === 0 ? (
          <p className="text-ink-2">
            “{q}” için sonuç bulunamadı. Yazımı kontrol edin veya aşağıdaki aramalardan birini deneyin.
          </p>
        ) : null}
        {q && hits && hits.length ? (
          <p className="text-sm text-muted">
            “{q}” için {hits.length} sonuç
          </p>
        ) : null}
        <div className="mt-4 space-y-8">
          {groups.map((g) => (
            <section key={g.group} aria-label={g.label} data-group={g.group}>
              <h2 className="text-h3 font-bold text-ink">{g.label}</h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {g.items.map((h) => (
                  <li key={h.id} className="relative rounded-card border border-line p-4 hover:border-primary/40">
                    <Link href={h.u} className="font-semibold text-ink after:absolute after:inset-0 hover:underline underline-offset-4">
                      {h.t}
                    </Link>
                    <p className="mt-1 text-sm text-muted">{h.x}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        {(!q || (hits && hits.length === 0)) && popular.length ? (
          <div className="mt-8">
            <h2 className="text-h3 font-bold text-ink">Sık aranan</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {popular.map((p) => (
                <li key={p}>
                  <Link href={`/arama?q=${encodeURIComponent(p)}`} className="inline-flex min-h-11 items-center rounded-full bg-soft px-4 text-sm font-semibold hover:bg-primary-soft">
                    {p}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

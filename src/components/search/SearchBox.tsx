"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { groupHits, loadEngine, runSearch, type SearchHit } from "@/lib/search-client";

/**
 * Header arama kutusu. JS'siz: GET /arama?q=…  JS'li: ARIA combobox + gruplu otomatik tamamlama.
 */
export function SearchBox({ className = "", inputId }: { className?: string; inputId: string }) {
  const router = useRouter();
  const listId = useId();
  const [q, setQ] = useState("");
  const [result, setResult] = useState<{ q: string; hits: SearchHit[] }>({ q: "", hits: [] });
  const hits = useMemo(() => (q.trim() && result.q === q ? result.hits : []), [q, result]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [ready, setReady] = useState(false);
  const boxRef = useRef<HTMLFormElement>(null);

  const groups = useMemo(() => groupHits(hits, 5), [hits]);
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  useEffect(() => {
    let cancelled = false;
    if (!q.trim()) return;
    loadEngine()
      .then((ms) => {
        if (cancelled) return;
        setReady(true);
        setResult({ q, hits: runSearch(ms, q, 30) });
        setActive(-1);
      })
      .catch(() => setResult({ q, hits: [] }));
    return () => {
      cancelled = true;
    };
  }, [q]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const showList = open && q.trim().length > 0 && ready;

  return (
    <form
      ref={boxRef}
      action="/arama"
      method="get"
      role="search"
      aria-label="Sitede ara"
      className={`relative ${className}`}
      onSubmit={(e) => {
        if (active >= 0 && flat[active]) {
          e.preventDefault();
          setOpen(false);
          router.push(flat[active].u);
        }
      }}
    >
      <label htmlFor={inputId} className="sr-only">
        Sitede ara
      </label>
      <input
        id={inputId}
        name="q"
        type="search"
        autoComplete="off"
        enterKeyHint="search"
        placeholder="Ara: 52 beden, 4XL, viskon…"
        value={q}
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        onFocus={() => {
          setOpen(true);
          loadEngine().then(() => setReady(true)).catch(() => {});
        }}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActive((a) => Math.min(flat.length - 1, a + 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(-1, a - 1));
          } else if (e.key === "Escape") {
            setOpen(false);
            setActive(-1);
          }
        }}
        className="h-11 w-full rounded-full border border-line-strong bg-soft pl-10 pr-4 text-[0.9375rem] text-ink placeholder:text-muted focus:border-primary focus:bg-white focus:outline-none focus-visible:outline-2 focus-visible:outline-primary"
      />
      <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted">
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div
        id={listId}
        role="listbox"
        aria-label="Arama önerileri"
        hidden={!showList}
        className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-panel border border-line bg-surface p-2 shadow-panel"
      >
        {flat.length === 0 ? (
          <p className="px-3 py-3 text-sm text-muted">Sonuç bulunamadı. Enter ile tüm arama sonuçlarına bakın.</p>
        ) : (
          groups.map((g) => (
            <div key={g.group} role="group" aria-label={g.label} className="py-1">
              <p className="px-3 pb-1 pt-2 text-eyebrow font-bold uppercase tracking-[0.12em] text-muted">{g.label}</p>
              {g.items.map((h) => {
                const i = flat.indexOf(h);
                return (
                  <a
                    key={h.id}
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={i === active}
                    href={h.u}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => setOpen(false)}
                    className={`block rounded-md px-3 py-2 text-sm ${i === active ? "bg-primary-soft" : "hover:bg-soft"}`}
                  >
                    <span className="block font-semibold text-ink">{h.t}</span>
                    <span className="block truncate text-xs text-muted">{h.x}</span>
                  </a>
                );
              })}
            </div>
          ))
        )}
        <button type="submit" className="mt-1 w-full rounded-md px-3 py-2.5 text-left text-sm font-semibold text-primary hover:bg-soft">
          “{q}” için tüm sonuçlar →
        </button>
      </div>
    </form>
  );
}

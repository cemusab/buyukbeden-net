"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { NavItem } from "@/lib/nav";

/**
 * Mobil çekmece menü. Yerel <dialog> (showModal): odak hapsi ve Escape tarayıcıdan gelir.
 * Kadın/Erkek alt menüleri <details> akordeon – JS olmadan da açılır.
 */
export function MobileMenu({ items }: { items: NavItem[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    ref.current?.close();
  }, [pathname]);

  return (
    <div className="lg:hidden">
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="dialog"
        aria-controls="mobil-menu"
        aria-label="Menüyü aç"
        onClick={() => ref.current?.showModal()}
        className="flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-soft"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <dialog
        ref={ref}
        id="mobil-menu"
        aria-label="Site menüsü"
        onClose={() => btnRef.current?.focus()}
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
        className="m-0 ml-auto h-dvh max-h-dvh w-[min(100vw,420px)] max-w-full overflow-y-auto bg-surface p-0 text-ink backdrop:bg-ink/40 open:flex open:flex-col"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-line bg-surface px-4 py-2">
          <span className="font-extrabold">buyukbeden.net</span>
          <button
            type="button"
            aria-label="Menüyü kapat"
            onClick={() => ref.current?.close()}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-soft"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav aria-label="Mobil menü" className="px-4 pb-10 pt-2">
          <ul className="divide-y divide-line">
            {items.map((it) =>
              it.mega ? (
                <li key={it.href}>
                  <details className="group" data-mobile-mega={it.mega.silo}>
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-base font-bold uppercase tracking-wide [&::-webkit-details-marker]:hidden">
                      {it.label}
                      <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3.5 w-3.5 transition-transform group-open:rotate-180">
                        <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </summary>
                    <div className="pb-4">
                      <Link href={it.mega.home.href} className="flex min-h-11 items-center font-semibold text-primary">
                        {it.mega.home.label} →
                      </Link>
                      <ul className="grid grid-cols-2 gap-x-3">
                        {it.mega.categories.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} className="flex min-h-11 items-center text-sm">
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {it.mega.guides.length ? (
                        <ul className="mt-2 border-t border-line pt-2">
                          {it.mega.guides.map((c) => (
                            <li key={c.href}>
                              <Link href={c.href} className="flex min-h-11 items-center text-sm font-medium">
                                {c.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {it.mega.sizes.length ? (
                        <>
                          <p className="mt-3 text-eyebrow font-bold uppercase tracking-[0.12em] text-muted">Bedene göre</p>
                          <ul className="mt-2 flex flex-wrap gap-2">
                            {it.mega.sizes.map((s) => (
                              <li key={s.label}>
                                <Link href={s.href} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm font-semibold">
                                  {s.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : null}
                    </div>
                  </details>
                </li>
              ) : (
                <li key={it.href}>
                  <Link href={it.href} className="flex min-h-12 items-center text-base font-bold uppercase tracking-wide">
                    {it.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
      </dialog>
    </div>
  );
}

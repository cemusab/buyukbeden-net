"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { MegaData, NavItem } from "@/lib/nav";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/") || (href === "/markalar" && pathname.startsWith("/marka/"));
}

/** Masaüstü ana menü + Kadın/Erkek mega menüleri (klavye, Escape, aria-expanded). */
export function DesktopNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = useCallback((focusButton?: string) => {
    setOpen(null);
    if (focusButton) navRef.current?.querySelector<HTMLButtonElement>(`[data-mega-btn="${focusButton}"]`)?.focus();
  }, []);

  // Sayfa değişince menüyü kapat (render sırasında türetilmiş durum)
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(null);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(open);
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, close]);

  const hoverOpen = (key: string) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(key), 120);
  };
  const hoverClose = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(null), 200);
  };

  return (
    <nav ref={navRef} aria-label="Ana menü" className="relative hidden lg:block">
      <ul className="flex items-stretch gap-1 xl:gap-2">
        {items.map((it) => {
          const active = isActive(pathname, it.href);
          if (!it.mega) {
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  aria-current={pathname === it.href ? "page" : undefined}
                  className={`relative flex min-h-12 items-center px-2 text-[0.8125rem] font-bold uppercase tracking-wide text-ink-2 hover:text-primary ${active ? "text-primary after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-primary" : ""}`}
                >
                  {it.label}
                </Link>
              </li>
            );
          }
          const key = it.mega.silo;
          const isOpen = open === key;
          return (
            <li key={it.href} className="flex items-stretch" onMouseEnter={() => hoverOpen(key)} onMouseLeave={hoverClose}>
              <Link
                href={it.href}
                aria-current={pathname === it.href ? "page" : undefined}
                className={`relative flex min-h-12 items-center pl-2 text-[0.8125rem] font-bold uppercase tracking-wide text-ink-2 hover:text-primary ${active ? "text-primary after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-primary" : ""}`}
              >
                {it.label}
              </Link>
              <button
                type="button"
                data-mega-btn={key}
                aria-expanded={isOpen}
                aria-controls={`mega-${key}`}
                aria-label={`${it.label} menüsünü ${isOpen ? "kapat" : "aç"}`}
                onClick={() => setOpen(isOpen ? null : key)}
                className="flex min-h-12 min-w-8 items-center justify-center rounded text-ink-2 hover:text-primary"
              >
                <svg aria-hidden="true" viewBox="0 0 12 12" className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                  <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <MegaPanel data={it.mega} open={isOpen} onClose={() => close(key)} />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function MegaPanel({ data, open, onClose }: { data: MegaData; open: boolean; onClose: () => void }) {
  const id = useId();
  return (
    <div
      id={`mega-${data.silo}`}
      role="region"
      aria-label={`${data.label} menüsü`}
      hidden={!open}
      className="absolute inset-x-0 top-full z-40 rounded-b-panel border border-line bg-surface p-6 shadow-panel"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onClose();
        }
      }}
    >
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-5">
          <p id={`${id}-giyim`} className="mb-3 text-eyebrow font-bold uppercase tracking-[0.12em] text-muted">
            {data.label} giyim
          </p>
          <ul aria-labelledby={`${id}-giyim`} className="grid grid-cols-2 gap-x-4">
            {data.categories.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="flex min-h-11 items-center text-sm font-medium text-ink hover:text-primary hover:underline underline-offset-4">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-3">
          {data.guides.length ? (
            <>
              <p id={`${id}-rehber`} className="mb-3 text-eyebrow font-bold uppercase tracking-[0.12em] text-muted">
                Rehberler
              </p>
              <ul aria-labelledby={`${id}-rehber`}>
                {data.guides.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href} className="flex min-h-11 items-center text-sm font-medium text-ink hover:text-primary hover:underline underline-offset-4">
                      {c.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={data.home.href} className="flex min-h-11 items-center text-sm font-semibold text-primary hover:underline underline-offset-4">
                    {data.home.label} →
                  </Link>
                </li>
              </ul>
            </>
          ) : null}
          {data.sizes.length ? (
            <>
              <p id={`${id}-beden`} className="mb-2 mt-5 text-eyebrow font-bold uppercase tracking-[0.12em] text-muted">
                Bedene göre
              </p>
              <ul aria-labelledby={`${id}-beden`} className="flex flex-wrap gap-2">
                {data.sizes.map((s) => (
                  <li key={s.label}>
                    <Link href={s.href} className="inline-flex min-h-11 items-center rounded-full border border-line px-3 text-xs font-semibold text-ink hover:border-primary hover:text-primary">
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
        <div className="col-span-4">
          {data.featured ? (
            <div className="relative rounded-card bg-soft p-5">
              <p className="text-eyebrow font-bold uppercase tracking-[0.12em] text-primary">Öne çıkan</p>
              <p className="mt-2 font-bold leading-snug text-ink">
                <Link href={data.featured.href} className="after:absolute after:inset-0 hover:underline underline-offset-4">
                  {data.featured.title}
                </Link>
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{data.featured.excerpt}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

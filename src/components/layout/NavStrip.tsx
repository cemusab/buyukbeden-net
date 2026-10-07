"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/nav";

/** Mobil/tablet yatay kaydırılabilir ana menü şeridi. */
export function NavStrip({ items }: { items: NavItem[] }) {
  const pathname = usePathname() ?? "/";
  return (
    <nav aria-label="Bölümler" className="scroll-strip -mx-4 lg:hidden">
      <ul className="flex w-max gap-1 px-2">
        {items.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + "/") || (it.href === "/markalar" && pathname.startsWith("/marka/"));
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                aria-current={pathname === it.href ? "page" : undefined}
                className={`relative flex min-h-11 items-center whitespace-nowrap px-2.5 text-[0.8125rem] font-bold uppercase tracking-wide ${active ? "text-primary after:absolute after:inset-x-2.5 after:bottom-0 after:h-0.5 after:bg-primary" : "text-ink-2"}`}
              >
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

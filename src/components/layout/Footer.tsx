import Link from "next/link";
import { getSettings } from "@/lib/content";
import { footerColumns } from "@/lib/nav";

export function Footer() {
  const s = getSettings();
  const cols = footerColumns();
  return (
    <footer className="mt-auto border-t border-line bg-soft">
      <div className="container-page grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <p className="text-xl font-extrabold tracking-tight text-ink">
            buyukbeden<span className="text-primary">.net</span>
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted">{s.tagline}.</p>
          <p className="mt-4 max-w-sm text-sm text-ink-2">
            Bağımsız bir içerik ve rehber sitesidir; ürün satışı yapmaz. Beden tabloları ve teknik bilgiler kaynağıyla birlikte verilir.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h2 className="text-eyebrow font-bold uppercase tracking-[0.12em] text-muted">{c.title}</h2>
            <ul className="mt-3">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex min-h-11 items-center text-sm text-ink-2 hover:text-primary hover:underline underline-offset-4">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <p className="container-page py-5 text-xs text-muted">© 2026 {s.siteName}. İçerikler bilgilendirme amaçlıdır; satın almadan önce markanın kendi beden tablosunu kontrol edin.</p>
      </div>
    </footer>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { hasRoute } from "@/lib/routes";

export const metadata: Metadata = { title: "Sayfa bulunamadı", robots: { index: false, follow: true } };

export default function NotFound() {
  const links = [
    { href: "/", label: "Ana sayfa" },
    { href: "/beden-rehberi", label: "Beden rehberi" },
    { href: "/kadin/giyim", label: "Kadın giyim" },
    { href: "/erkek/giyim", label: "Erkek giyim" },
    { href: "/kumas-rehberi", label: "Kumaş rehberi" },
  ].filter((l) => hasRoute(l.href));
  return (
    <>
      <SkipLink />
      <Header />
      <main id="icerik" className="flex-1">
        <div className="container-page py-16 sm:py-24">
          <p className="text-eyebrow font-bold uppercase tracking-[0.12em] text-primary">404</p>
          <h1 className="mt-2 text-h1 font-extrabold text-ink">Aradığınız sayfa bulunamadı</h1>
          <p className="mt-3 max-w-xl text-lg text-ink-2">Sayfa taşınmış ya da adres yanlış yazılmış olabilir. Aramayı kullanabilir veya aşağıdaki rehberlerden devam edebilirsiniz.</p>
          <form action="/arama" method="get" role="search" aria-label="Sitede ara" className="mt-6 flex max-w-lg gap-2">
            <label htmlFor="arama-404" className="sr-only">
              Aranacak ifade
            </label>
            <input id="arama-404" name="q" type="search" placeholder="Ör. 52 beden, viskon" className="h-12 min-w-0 flex-1 rounded-full border border-line-strong px-5 focus:border-primary focus:outline-none" />
            <button type="submit" className="h-12 rounded-full bg-primary px-6 text-sm font-semibold text-white">
              Ara
            </button>
          </form>
          <ul className="mt-8 flex flex-wrap gap-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-4 text-sm font-semibold hover:border-primary hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}

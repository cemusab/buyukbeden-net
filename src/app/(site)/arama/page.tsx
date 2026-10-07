import { Suspense } from "react";
import Link from "next/link";
import { getSettings } from "@/lib/content";
import { simpleMetadata } from "@/lib/metadata";
import { hasRoute } from "@/lib/routes";
import { SearchResults } from "@/components/search/SearchResults";

export const metadata = simpleMetadata({
  title: "Arama",
  description: "Buyukbeden.net içinde beden, stil, kombin, kumaş, marka ve alışveriş rehberlerinde arama yapın.",
  path: "/arama",
  index: false,
});

export default function SearchPage() {
  const s = getSettings();
  const doors = [
    { href: "/beden-rehberi", label: "Beden Rehberi" },
    { href: "/kadin/beden-rehberi", label: "Kadın Beden Rehberi" },
    { href: "/erkek/beden-rehberi", label: "Erkek Beden Rehberi" },
    { href: "/kumas-rehberi", label: "Kumaş Rehberi" },
  ].filter((d) => hasRoute(d.href));
  return (
    <div className="container-page pb-16 pt-8" data-template="SEARCH">
      <h1 className="text-h1 font-extrabold text-ink">Arama</h1>
      <Suspense fallback={<p className="mt-6 text-muted">Arama hazırlanıyor…</p>}>
        <SearchResults popular={s.popularSearches} />
      </Suspense>
      {doors.length ? (
        <nav aria-label="Beden rehberi kapıları" className="mt-12">
          <h2 className="text-h3 font-bold text-ink">Buradan başlayın</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {doors.map((d) => (
              <li key={d.href}>
                <Link href={d.href} className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-4 text-sm font-semibold hover:border-primary hover:text-primary">
                  {d.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}

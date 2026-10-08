import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getByPath, getHomepage, getHubs, getSettings, getSizeCharts, getToday, listLive } from "@/lib/content";
import { finderCharts, isMeasure } from "@/lib/size-core";
import type { DocMeta } from "@/lib/content-types";
import { itemListLd, organizationLd, websiteLd } from "@/lib/jsonld";
import { simpleMetadata } from "@/lib/metadata";
import { hasRoute } from "@/lib/routes";
import { categoryLabel } from "@/lib/taxonomy";
import { GarmentArt, QuickIcon } from "@/components/media/Illustration";
import { CardGrid, CategoryCard, CategoryGrid, CompactCard, EditorialCard, MiniCard, SizeBandCard } from "@/components/ui/Cards";
import { ButtonLink, JsonLd, SectionHeader } from "@/components/ui/primitives";
import { BodyTypeSwitch } from "@/components/content/BodyTypeTiles";

/** Ana sayfa "büyük beden giyim" / "büyük beden" baş terimlerinin sahibi (docs/seo-anahtar-kelime-haritasi.md). */
export function generateMetadata(): Metadata {
  const s = getSettings();
  return simpleMetadata({
    title: `Büyük Beden Giyim, Beden ve Stil Rehberi | ${s.siteName}`,
    description: "Büyük beden giyimde doğru bedeni ve markayı bulun. Kadın ve erkek için ölçü tabloları, beden karşılıkları, stil, kumaş ve kaynaklı marka rehberleri.",
    path: "/",
    absoluteTitle: true,
  });
}

function rangeLine(): string | null {
  const parts: string[] = [];
  const charts = getSizeCharts();
  const kNums = charts
    .filter(isMeasure)
    .filter((c) => c.gender === "kadin" && c.productType !== "ic-giyim" && ["TR", "EU", "DE"].includes(c.countrySystem))
    .flatMap((c) => c.rows.map((r) => Number(r.numericSize)))
    .filter((n) => Number.isInteger(n) && n >= 32 && n <= 80);
  if (kNums.length && hasRoute("/kadin/beden-rehberi")) parts.push(`Kadın ${Math.min(...kNums)}–${Math.max(...kNums)}`);
  const order = ["XL", "XXL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL", "10XL"];
  const eLetters = charts
    .filter(isMeasure)
    .filter((c) => c.gender === "erkek")
    .flatMap((c) => c.rows.map((r) => (r.letterSize ?? "").toUpperCase()))
    .filter((x) => order.includes(x))
    .sort((a, b) => order.indexOf(a) - order.indexOf(b));
  if (eLetters.length && hasRoute("/erkek/beden-rehberi")) parts.push(`Erkek ${eLetters[0]}–${eLetters[eLetters.length - 1]}`);
  return parts.length ? `${parts.join(" · ")} beden rehberleri` : null;
}

const QUICK = [
  { path: "/beden-rehberi", icon: "beden-rehberi", title: "Beden Rehberi", text: "Doğru bedeni bulun" },
  { path: "/stil", icon: "stil", title: "Stil Önerileri", text: "Kalıp ve oran rehberleri" },
  { path: "/kombinler", icon: "kombin", title: "Kombin Fikirleri", text: "Ortama göre kombinler" },
  { path: "/markalar", icon: "marka", title: "Marka Rehberi", text: "Doğrulanmış marka bilgileri" },
  { path: "/alisveris-rehberi", icon: "alisveris", title: "Alışveriş Rehberi", text: "Almadan önce bilinmesi gerekenler" },
  { path: "/kumas-rehberi", icon: "kumas", title: "Kumaş Rehberi", text: "Viskon, pamuk, elastan ve dahası" },
];

function Section({ id, title, docs, more, compact = false }: { id: string; title: string; docs: DocMeta[]; more?: string; compact?: boolean }) {
  if (docs.length < 2) return null;
  return (
    <section aria-labelledby={id} className="container-page mt-9 md:mt-12 lg:mt-14">
      <SectionHeader id={id} title={title} more={more && hasRoute(more) ? { href: more, label: "Tümünü gör" } : undefined} />
      {compact ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {docs.map((d) => (
            <CompactCard key={d.key} doc={d} />
          ))}
        </div>
      ) : (
        <CardGrid cols={4}>
          {docs.map((d) => (
            <EditorialCard key={d.key} doc={d} />
          ))}
        </CardGrid>
      )}
    </section>
  );
}

/** "Bedenimi Bul": sitenin ana aracı, hero'nun hemen üstünde (ilk ekranda). */
function FinderBand() {
  if (!hasRoute("/beden-bulucu")) return null;
  const charts = finderCharts(getSizeCharts(), getToday());
  const brands = new Set(charts.map((c) => c.brandName)).size;
  return (
    <section aria-labelledby="bedenimi-bul" className="mb-4 flex flex-col gap-3 rounded-card border border-primary/20 bg-primary-soft p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5" data-bedenimi-bul>
      <QuickIcon name="beden-rehberi" className="hidden h-10 w-10 shrink-0 text-primary sm:block" />
      <div className="min-w-0 flex-1">
        <h2 id="bedenimi-bul" className="text-h3 font-bold text-ink">
          Bedenini ölçünle bul
        </h2>
        <p className="mt-0.5 text-sm text-ink-2">
          Göğüs, bel ve basen ölçünü gir; {brands} markanın kaynaklı beden tablosuyla karşılaştıralım. Sonuçta beden aralığı, kaynak, son kontrol tarihi ve güven düzeyi görünür. Ölçülerin kaydedilmez.
        </p>
      </div>
      <ButtonLink href="/beden-bulucu" className="shrink-0 self-start sm:self-center">
        Bedenimi Bul <span aria-hidden="true">→</span>
      </ButtonLink>
    </section>
  );
}

export default function HomePage() {
  const s = getSettings();
  const h = getHomepage();
  const range = rangeLine();
  const live = (f: (d: DocMeta) => boolean) => listLive((d) => d.index && d.collection !== "sayfalar" && f(d));
  const used = new Set<string>();
  const pick = (items: string[], fallback: DocMeta[], n: number) => {
    const manual = items.map((p) => getByPath(p)).filter((d): d is DocMeta => !!d);
    const out: DocMeta[] = [];
    for (const d of [...manual, ...fallback]) {
      if (out.length >= n) break;
      if (used.has(d.key) || d.status === "archived") continue;
      used.add(d.key);
      out.push(d);
    }
    return out;
  };

  const doors = (["kadin", "erkek"] as const).filter((x) => hasRoute(`/${x}`));
  // Mockup: Kadın Elbise / Pantolon / Tişört, Erkek Tişört / Pantolon / Gömlek (yayımlanmış olanlar; eksikse sıradakiler)
  const prefer = (silo: "kadin" | "erkek", cats: string[]) => {
    const hubs = getHubs(silo);
    const first = cats.map((c) => hubs.find((h) => h.category === c)).filter((h): h is DocMeta => !!h);
    return [...first, ...hubs.filter((h) => !first.includes(h))].slice(0, 3);
  };
  const popular = [...prefer("kadin", ["elbise", "pantolon", "tisort"]), ...prefer("erkek", ["tisort", "pantolon", "gomlek"])];

  const sections: { key: string; node: React.ReactNode }[] = [];
  for (const sec of h.sections) {
    if (sec.enabled === false) continue;
    const t = sec.title;
    switch (sec.key) {
      case "editorun-sectikleri":
        sections.push({ key: sec.key, node: <Section id="one-cikan" title={t ?? "Öne Çıkan İçerikler"} docs={pick(sec.items, live((d) => d.collection !== "hublar"), 4)} /> });
        break;
      case "stil":
        sections.push({ key: sec.key, node: <Section id="stil" title={t ?? "Stil Rehberleri"} docs={pick(sec.items, live((d) => d.type === "STYLE_GUIDE"), 4)} more="/stil" /> });
        break;
      case "kombinler":
        sections.push({ key: sec.key, node: <Section id="kombinler" title={t ?? "Kombinler"} docs={pick(sec.items, live((d) => d.type === "OUTFIT_GUIDE"), 4)} more="/kombinler" /> });
        break;
      case "trendler":
        sections.push({ key: sec.key, node: <Section id="trendler" title={t ?? "Trendler"} docs={pick(sec.items, live((d) => d.type === "TREND"), 4)} more="/trendler" /> });
        break;
      case "marka-dosyalari":
        sections.push({ key: sec.key, node: <Section id="markalar" title={t ?? "Marka Dosyaları"} docs={pick(sec.items, live((d) => d.type === "BRAND_GUIDE"), 4)} more="/markalar" compact /> });
        break;
      case "kumas":
        sections.push({ key: sec.key, node: <Section id="kumas" title={t ?? "Kumaş Rehberi"} docs={pick(sec.items, live((d) => d.type === "FABRIC_GUIDE"), 4)} more="/kumas-rehberi" compact /> });
        break;
      case "alisveris":
        sections.push({ key: sec.key, node: <Section id="alisveris" title={t ?? "Alışveriş Rehberleri"} docs={pick(sec.items, live((d) => d.type === "SHOPPING_GUIDE"), 4)} more="/alisveris-rehberi" /> });
        break;
      case "yeni-icerikler":
        sections.push({ key: sec.key, node: <Section id="yeni" title={t ?? "Yeni İçerikler"} docs={pick([], live((d) => d.collection !== "hublar"), 8)} compact /> });
        break;
      case "temel-rehberler": {
        const docs = pick(sec.items, live((d) => ["SIZE_GUIDE", "ARTICLE", "FABRIC_GUIDE", "SHOPPING_GUIDE"].includes(d.type)), 6);
        if (docs.length >= 2)
          sections.push({
            key: sec.key,
            node: (
              <section aria-labelledby="temel-rehberler" className="container-page mt-9 md:mt-12 lg:mt-14">
                <SectionHeader id="temel-rehberler" title={t ?? "Temel Rehberler"} more={hasRoute("/rehberler") ? { href: "/rehberler", label: "Tüm rehberler" } : undefined} />
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {docs.map((d) => (
                    <li key={d.key}>
                      <MiniCard doc={d} />
                    </li>
                  ))}
                </ul>
              </section>
            ),
          });
        break;
      }
      case "bedenini-tani":
        sections.push({
          key: sec.key,
          node: (
            <section aria-labelledby="bedenini-tani" className="container-page mt-9 md:mt-12 lg:mt-14">
              <h2 id="bedenini-tani" className="sr-only">
                Bedenini tanı
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {hasRoute("/kadin/beden-rehberi") ? <SizeBandCard href="/kadin/beden-rehberi" title="Kadın Beden Rehberi" text="Numara bedenler, göğüs–bel–basen" image={h.sizeBand.kadinImage} silo="kadin" /> : null}
                <div className="flex flex-col items-center justify-center rounded-card border border-line bg-soft p-6 text-center">
                  <h3 className="text-h3 font-bold text-ink">{h.manifesto?.title ?? "Her bedende doğru seçim"}</h3>
                  <p className="mt-2 text-sm text-ink-2">{h.manifesto?.text}</p>
                  {hasRoute("/hakkimizda") ? (
                    <ButtonLink href="/hakkimizda" variant="secondary" className="mt-4">
                      Hakkımızda
                    </ButtonLink>
                  ) : null}
                </div>
                {hasRoute("/erkek/beden-rehberi") ? <SizeBandCard href="/erkek/beden-rehberi" title="Erkek Beden Rehberi" text="Harf bedenler, göğüs ve yaka ölçüleri" image={h.sizeBand.erkekImage} silo="erkek" /> : null}
              </div>
            </section>
          ),
        });
        break;
      default:
        break;
    }
  }

  return (
    <>
      <section aria-labelledby="anasayfa-baslik" className="container-page pt-5">
        <h1 id="anasayfa-baslik" className="mb-4 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
          {h.hero.title}
        </h1>
        <FinderBand />
        <div className="grid gap-4 md:grid-cols-2">
          {doors.map((x) => {
            const c = h.hero[x];
            return (
              <Link
                key={x}
                href={`/${x}`}
                className={`group relative flex min-h-[17rem] flex-col justify-end overflow-hidden rounded-card p-6 sm:min-h-[22rem] sm:p-8 lg:min-h-[25rem] ${x === "kadin" ? "bg-[#7a3550]" : "bg-primary"} text-white`}
              >
                {c.image ? (
                  <>
                    <Image src={c.image.src} alt={c.image.alt} fill preload fetchPriority="high" sizes="(min-width: 1240px) 600px, (min-width: 768px) 50vw, calc(100vw - 32px)" className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                    <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                    {c.image.aiGenerated || c.image.credit ? (
                      <span className="absolute right-3 top-3 rounded bg-black/45 px-2 py-0.5 text-[0.6875rem] text-white/90">
                        {[c.image.aiGenerated ? "Yapay zekâ ile üretilmiş görsel" : null, c.image.credit].filter(Boolean).join(" · ")}
                      </span>
                    ) : null}
                  </>
                ) : (
                  <div aria-hidden="true" className="absolute -right-6 top-4 h-[85%] w-1/2 opacity-90 sm:right-2">
                    <div className="h-full w-full rounded-card bg-white/10 p-3">
                      <GarmentArt silo={x} category={x === "kadin" ? "elbise" : "gomlek"} className="h-full w-full" />
                    </div>
                  </div>
                )}
                <p className="relative text-h2 font-extrabold leading-tight">{c.title}</p>
                <p className="relative mt-1 max-w-md text-white/90">{c.text}</p>
                <span className="relative mt-4 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink group-hover:bg-soft">
                  {c.cta} <span aria-hidden="true">→</span>
                </span>
              </Link>
            );
          })}
        </div>
        <p className="mt-4 text-center text-sm text-muted">
          {h.hero.lead}
          {range ? (
            <>
              {" "}
              <span className="font-semibold text-ink-2">{range}.</span>
            </>
          ) : null}
        </p>
      </section>

      <nav aria-label="Hızlı erişim" className="container-page mt-6 md:mt-8">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {QUICK.filter((q) => hasRoute(q.path)).map((q) => (
            <li key={q.path}>
              <Link href={q.path} className="flex h-full min-h-11 items-start gap-3 rounded-card border border-line p-4 hover:border-primary/40 hover:bg-soft">
                <QuickIcon name={q.icon} className="mt-0.5 h-7 w-7 shrink-0 text-primary" />
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-ink">{q.title}</span>
                  <span className="mt-0.5 block text-xs text-muted">{q.text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {sections.slice(0, 1).map((x) => (
        <div key={x.key}>{x.node}</div>
      ))}

      {popular.length >= 2 ? (
        <section aria-labelledby="populer-kategoriler" className="container-page mt-9 md:mt-12 lg:mt-14">
          <SectionHeader id="populer-kategoriler" title="Popüler Kategoriler" />
          <CategoryGrid cols={6}>
            {popular.map((p) => (
              <CategoryCard key={p.key} hub={p} label={`${p.silo === "kadin" ? "Kadın" : "Erkek"} ${categoryLabel(p.silo as "kadin" | "erkek", p.category!)}`} sizes="(min-width: 1024px) 16vw, 33vw" />
            ))}
          </CategoryGrid>
        </section>
      ) : null}

      <BodyTypeSwitch />

      {sections.slice(1).map((x) => (
        <div key={x.key}>{x.node}</div>
      ))}

      <div className="h-16" />
      <JsonLd data={[organizationLd(s), websiteLd(s), itemListLd(s, popular.map((p) => ({ path: p.path, title: p.title })))]} />
    </>
  );
}

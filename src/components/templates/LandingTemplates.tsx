import Link from "next/link";
import type { ReactNode } from "react";
import { getBody, getByPath, getHubChildren, getHubs, getSettings, getSizeCharts, listLive } from "@/lib/content";
import type { DocMeta } from "@/lib/content-types";
import { faqLd, itemListLd } from "@/lib/jsonld";
import { sizeLinks } from "@/lib/nav";
import { hasRoute } from "@/lib/routes";
import { categoryLabel, OCCASIONS, type GenderSilo } from "@/lib/taxonomy";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MarkdocContent } from "@/components/content/Markdoc";
import { FaqList } from "@/components/content/Faq";
import { AuthorBox, PageHero, ShortAnswer, SourcesList } from "@/components/content/DocParts";
import { SizeChartTable } from "@/components/content/SizeChartTable";
import { FabricArt, MeasureArt, QuickIcon } from "@/components/media/Illustration";
import { CardGrid, CategoryCard, CompactCard, EditorialCard } from "@/components/ui/Cards";
import { Badge, ButtonLink, JsonLd, SectionHeader } from "@/components/ui/primitives";

const SILO_LABEL = { kadin: "Kadın", erkek: "Erkek" } as const;

function Shell({ doc, children, hero, ld = [] }: { doc: DocMeta; children?: ReactNode; hero?: ReactNode; ld?: object[] }) {
  const all = [...ld];
  if (doc.faq.length >= 2) all.push(faqLd(doc.faq));
  return (
    <div className="container-page pb-16 pt-4" data-template={`LANDING:${String(doc.fm.key)}`}>
      <Breadcrumbs path={doc.path} />
      <div className="mt-4">{hero}</div>
      {children}
      <JsonLd data={all} />
    </div>
  );
}

function Lead({ doc }: { doc: DocMeta }) {
  return doc.inline.intro ? <MarkdocContent tree={doc.inline.intro} inline /> : <p>{doc.excerpt}</p>;
}

function siloTone(doc: DocMeta): "plain" | "kadin" | "erkek" {
  return doc.silo === "erkek" ? "erkek" : doc.silo === "kadin" ? "plain" : "plain";
}

async function Body({ doc, className = "" }: { doc: DocMeta; className?: string }) {
  const body = await getBody(doc.key);
  return (
    <div className={`max-w-prose ${className}`}>
      <MarkdocContent tree={body} doc={doc} />
    </div>
  );
}

function Tail({ doc }: { doc: DocMeta }) {
  return (
    <div className="max-w-prose">
      {!doc.hasFaqSlot ? <FaqList doc={doc} /> : null}
      <SourcesList doc={doc} />
      {doc.fm.kind === "landing" ? <AuthorBox doc={doc} /> : null}
    </div>
  );
}

function Grid({ docs, compact = false }: { docs: DocMeta[]; compact?: boolean }) {
  if (!docs.length) return null;
  return compact ? (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}

/** Belgeleri durum (occasion) gruplarına ayırır; grupsuzlar "Diğer" altında. */
function ByOccasion({ docs, idPrefix }: { docs: DocMeta[]; idPrefix: string }) {
  if (!docs.length) return null;
  const used = new Set<string>();
  const groups = OCCASIONS.map((o) => {
    const items = docs.filter((d) => ((d.fm.occasion as string[]) ?? []).includes(o.key) && !used.has(d.key));
    items.forEach((d) => used.add(d.key));
    return { ...o, items };
  }).filter((g) => g.items.length);
  const rest = docs.filter((d) => !used.has(d.key));
  return (
    <div className="space-y-10">
      {groups.map((g) => (
        <section key={g.key} aria-labelledby={`${idPrefix}-${g.key}`}>
          <SectionHeader id={`${idPrefix}-${g.key}`} title={g.label} lead={g.description} />
          <Grid docs={g.items} />
        </section>
      ))}
      {rest.length ? (
        <section aria-labelledby={`${idPrefix}-diger`}>
          <SectionHeader id={`${idPrefix}-diger`} title={groups.length ? "Diğer" : "Tüm içerikler"} />
          <Grid docs={rest} />
        </section>
      ) : null}
    </div>
  );
}

/* ---------------- /kadin, /erkek ---------------- */
function SiloHome({ doc }: { doc: DocMeta }) {
  const silo = doc.silo as GenderSilo;
  const L = SILO_LABEL[silo];
  const gates = [
    { path: `/${silo}/giyim`, title: `${L} giyim`, text: "Kategoriler, kalıp ve kumaş rehberleri", filter: (d: DocMeta) => d.silo === silo && !!d.hub, icon: "rehber" },
    { path: `/${silo}/beden-rehberi`, title: `${L} beden rehberi`, text: "Beden tabloları ve ölçü alma", filter: (d: DocMeta) => d.silo === silo && d.type === "SIZE_GUIDE", icon: "beden-rehberi" },
    { path: `/${silo}/stil`, title: `${L} stil`, text: "Kalıp, oran ve tarz önerileri", filter: (d: DocMeta) => d.silo === silo && d.type === "STYLE_GUIDE", icon: "stil" },
    { path: `/${silo}/kombinler`, title: `${L} kombinler`, text: "Ortama ve mevsime göre kombinler", filter: (d: DocMeta) => d.silo === silo && d.type === "OUTFIT_GUIDE", icon: "kombin" },
  ].filter((g) => hasRoute(g.path));
  const hubs = getHubs(silo);
  return (
    <Shell
      doc={doc}
      hero={<PageHero tone={siloTone(doc)} eyebrow={<Badge tone={silo}>{L}</Badge>} title={doc.title} lead={<Lead doc={doc} />} />}
      ld={[itemListLd(getSettings(), gates.map((g) => ({ path: g.path, title: g.title })))]}
    >
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {gates.map((g) => {
          const recent = listLive((d) => d.collection !== "sayfalar" && d.collection !== "hublar" && g.filter(d)).slice(0, 3);
          return (
            <section key={g.path} className="group relative flex flex-col rounded-card border border-line bg-surface p-5">
              <QuickIcon name={g.icon} className="h-8 w-8 text-primary" />
              <h2 className="mt-3 text-h3 font-bold text-ink">
                <Link href={g.path} className="hover:underline underline-offset-4">
                  {g.title}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-muted">{g.text}</p>
              {recent.length ? (
                <ul className="mt-3 space-y-1 border-t border-line pt-3">
                  {recent.map((d) => (
                    <li key={d.key}>
                      <Link href={d.path} className="flex min-h-11 items-center text-sm text-ink-2 hover:text-primary">
                        {d.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          );
        })}
      </div>
      {hubs.length ? (
        <section aria-labelledby="kategoriler" className="mt-12">
          <SectionHeader id="kategoriler" title="Kategoriler" more={hasRoute(`/${silo}/giyim`) ? { href: `/${silo}/giyim`, label: "Tüm giyim" } : undefined} />
          <CardGrid cols={6}>
            {hubs.map((h) => (
              <CategoryCard key={h.key} hub={h} label={(h.fm.menuLabel as string) ?? categoryLabel(silo, h.category!)} />
            ))}
          </CardGrid>
        </section>
      ) : null}
      <Body doc={doc} className="mt-12" />
      <Tail doc={doc} />
    </Shell>
  );
}

/* ---------------- /kadin/giyim, /erkek/giyim ---------------- */
function ClothingHub({ doc }: { doc: DocMeta }) {
  const silo = doc.silo as GenderSilo;
  const L = SILO_LABEL[silo];
  const hubs = getHubs(silo);
  const sizes = sizeLinks(silo);
  const featured = (doc.fm.featured as string[]).map((p) => getByPath(p)).filter((d): d is DocMeta => !!d);
  const recent = listLive((d) => d.silo === silo && d.collection !== "sayfalar" && d.collection !== "hublar" && !featured.some((f) => f.key === d.key)).slice(0, 6);
  const mini = [
    { title: "Stil", href: `/${silo}/stil`, docs: listLive((d) => d.silo === silo && d.type === "STYLE_GUIDE").slice(0, 3) },
    { title: "Kombin", href: `/${silo}/kombinler`, docs: listLive((d) => d.silo === silo && d.type === "OUTFIT_GUIDE").slice(0, 3) },
    { title: "Kumaş", href: "/kumas-rehberi", docs: listLive((d) => d.type === "FABRIC_GUIDE").slice(0, 3) },
    { title: "Marka", href: "/markalar", docs: listLive((d) => d.type === "BRAND_GUIDE" && ((d.fm.genders as string[]) ?? []).includes(silo)).slice(0, 3) },
  ].filter((m) => m.docs.length);
  return (
    <Shell
      doc={doc}
      hero={
        <PageHero
          tone={siloTone(doc)}
          eyebrow={<Badge tone={silo}>{`${L} · Giyim`}</Badge>}
          title={doc.title}
          lead={<Lead doc={doc} />}
        />
      }
      ld={[itemListLd(getSettings(), hubs.map((h) => ({ path: h.path, title: h.title })))]}
    >
      <div className="mt-6 max-w-prose">
        <ShortAnswer doc={doc} />
      </div>
      {hubs.length ? (
        <section aria-labelledby="kategoriler" className="mt-10">
          <SectionHeader id="kategoriler" title="Kategoriler" />
          <CardGrid cols={5}>
            {hubs.map((h) => (
              <CategoryCard key={h.key} hub={h} label={(h.fm.menuLabel as string) ?? categoryLabel(silo, h.category!)} count={getHubChildren(h.id).length} />
            ))}
          </CardGrid>
        </section>
      ) : null}
      {sizes.length ? (
        <section aria-labelledby="bedenini-sec" className="mt-10 rounded-card bg-soft p-5 sm:p-6">
          <h2 id="bedenini-sec" className="text-h3 font-bold text-ink">
            Bedenini seç
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {sizes.map((s) => (
              <li key={s.label}>
                <Link href={s.href} className="inline-flex min-h-11 items-center rounded-full border border-line-strong bg-white px-4 text-sm font-semibold hover:border-primary hover:text-primary">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
          {hasRoute(`/${silo}/beden-rehberi`) ? (
            <ButtonLink href={`/${silo}/beden-rehberi`} className="mt-4">
              {L} beden rehberi →
            </ButtonLink>
          ) : null}
        </section>
      ) : null}
      <Body doc={doc} className="mt-10" />
      {featured.length ? (
        <section aria-labelledby="populer-rehberler" className="mt-12">
          <SectionHeader id="populer-rehberler" title="Öne çıkan rehberler" />
          <Grid docs={featured.slice(0, 4)} />
        </section>
      ) : null}
      {recent.length ? (
        <section aria-labelledby="yeni-eklenenler" className="mt-12">
          <SectionHeader id="yeni-eklenenler" title="Yeni eklenenler" />
          <Grid docs={recent} compact />
        </section>
      ) : null}
      {mini.length ? (
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mini.map((m) => (
            <section key={m.title} className="rounded-card border border-line p-5">
              <h2 className="font-bold text-ink">{m.title}</h2>
              <ul className="mt-2 space-y-1">
                {m.docs.map((d) => (
                  <li key={d.key}>
                    <Link href={d.path} className="flex min-h-11 items-center text-sm text-ink-2 hover:text-primary">
                      {d.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {hasRoute(m.href) ? (
                <Link href={m.href} className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-primary">
                  Tümü →
                </Link>
              ) : null}
            </section>
          ))}
        </div>
      ) : null}
      <Tail doc={doc} />
    </Shell>
  );
}

/* ---------------- silo bölüm landing'leri ---------------- */
function SectionLanding({ doc, type }: { doc: DocMeta; type: "SIZE_GUIDE" | "STYLE_GUIDE" | "OUTFIT_GUIDE" }) {
  const silo = doc.silo as GenderSilo;
  const docs = listLive((d) => d.type === type && d.silo === silo && !d.hub);
  const shared = type === "SIZE_GUIDE" ? listLive((d) => d.type === "SIZE_GUIDE" && d.silo === "ortak") : type === "STYLE_GUIDE" ? listLive((d) => d.type === "STYLE_GUIDE" && d.silo === "ortak") : [];
  const main = type === "SIZE_GUIDE" ? primaryChart(silo) : undefined;
  const charts = main ? [main] : [];
  return (
    <Shell
      doc={doc}
      hero={<PageHero tone={siloTone(doc)} eyebrow={<Badge tone={type === "SIZE_GUIDE" ? "beden" : "stil"}>{`${SILO_LABEL[silo]} · ${type === "SIZE_GUIDE" ? "Beden Rehberi" : type === "STYLE_GUIDE" ? "Stil" : "Kombinler"}`}</Badge>} title={doc.title} lead={<Lead doc={doc} />} />}
      ld={[itemListLd(getSettings(), docs.map((d) => ({ path: d.path, title: d.title })))]}
    >
      <div className="mt-6 max-w-prose">
        <ShortAnswer doc={doc} />
      </div>
      {charts.length ? (
        <div className="mt-8 max-w-4xl">
          {charts.map((c) => (
            <SizeChartTable key={c.id} chart={c} headingLevel="h2" />
          ))}
        </div>
      ) : null}
      <div className="mt-10">
        {type === "SIZE_GUIDE" ? (
          docs.length ? (
            <section aria-labelledby="rehberler">
              <SectionHeader id="rehberler" title="Beden rehberleri" />
              <Grid docs={docs} />
            </section>
          ) : null
        ) : (
          <ByOccasion docs={docs} idPrefix="grup" />
        )}
      </div>
      {shared.length ? (
        <section aria-labelledby="ortak-rehberler" className="mt-12">
          <SectionHeader id="ortak-rehberler" title="Herkes için temel rehberler" />
          <Grid docs={shared} compact />
        </section>
      ) : null}
      <Body doc={doc} className="mt-12" />
      <Tail doc={doc} />
    </Shell>
  );
}

/* ---------------- /stil, /kombinler (kadın/erkek kapısı) ---------------- */
function SplitLanding({ doc, type }: { doc: DocMeta; type: "STYLE_GUIDE" | "OUTFIT_GUIDE" }) {
  const seg = type === "STYLE_GUIDE" ? "stil" : "kombinler";
  const doors = (["kadin", "erkek"] as const)
    .map((s) => ({ silo: s, path: `/${s}/${seg}`, docs: listLive((d) => d.type === type && d.silo === s).slice(0, 4) }))
    .filter((d) => hasRoute(d.path));
  const shared = listLive((d) => d.type === type && d.silo === "ortak");
  return (
    <Shell doc={doc} hero={<PageHero eyebrow={<Badge tone="stil">{type === "STYLE_GUIDE" ? "Stil" : "Kombinler"}</Badge>} title={doc.title} lead={<Lead doc={doc} />} />} ld={[itemListLd(getSettings(), doors.map((d) => ({ path: d.path, title: `${SILO_LABEL[d.silo]} ${seg}` })))]}>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {doors.map((d) => (
          <section key={d.silo} className={`rounded-card p-6 ${d.silo === "erkek" ? "bg-primary text-white" : "bg-soft"}`}>
            <h2 className={`text-h2 font-extrabold ${d.silo === "erkek" ? "text-white" : "text-ink"}`}>
              {SILO_LABEL[d.silo]} {type === "STYLE_GUIDE" ? "stil rehberi" : "kombinleri"}
            </h2>
            {d.docs.length ? (
              <ul className="mt-3 space-y-1">
                {d.docs.map((x) => (
                  <li key={x.key}>
                    <Link href={x.path} className={`flex min-h-11 items-center text-[0.9375rem] hover:underline underline-offset-4 ${d.silo === "erkek" ? "text-white/90" : "text-ink-2"}`}>
                      {x.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            <ButtonLink href={d.path} variant={d.silo === "erkek" ? "light" : "primary"} className="mt-4">
              {SILO_LABEL[d.silo]} bölümüne git →
            </ButtonLink>
          </section>
        ))}
      </div>
      {shared.length ? (
        <section aria-labelledby="ortak" className="mt-12">
          <SectionHeader id="ortak" title="Temel kavramlar" />
          <ByOccasion docs={shared} idPrefix="ortak" />
        </section>
      ) : null}
      <Body doc={doc} className="mt-12" />
      <Tail doc={doc} />
    </Shell>
  );
}

/** Bölümün ana ölçü tablosu: vücut ölçüsü (cm) tablosu, göğüs + bel sütunlu, en çok satırlı. */
function primaryChart(silo: GenderSilo) {
  const cands = getSizeCharts().filter((c) => c.silo === silo && c.kind === "olcu-cm" && c.columns.some((x) => x.key.startsWith("gogus")));
  const pref = cands.filter((c) => c.scope === "genel" || c.scope === "ust-giyim");
  return (pref.length ? pref : cands).sort((a, b) => b.rows.length - a.rows.length)[0];
}

/* ---------------- /beden-rehberi (Kadın/Erkek toggle, JS'siz :target) ---------------- */
function SharedSizeLanding({ doc }: { doc: DocMeta }) {
  const k = primaryChart("kadin");
  const e = primaryChart("erkek");
  const guides = listLive((d) => d.type === "SIZE_GUIDE" && d.silo === "ortak");
  const articles = listLive((d) => d.collection === "makaleler" && d.fm.section === "beden-rehberi");
  const measure = guides.find((g) => (g.fm.measurementSteps as unknown[]).length);
  return (
    <Shell doc={doc} hero={<PageHero eyebrow={<Badge tone="beden">Beden Rehberi</Badge>} title={doc.title} lead={<Lead doc={doc} />} />} ld={[itemListLd(getSettings(), guides.map((g) => ({ path: g.path, title: g.title })))]}>
      <div className="mt-6 max-w-prose">
        <ShortAnswer doc={doc} />
      </div>
      {k || e ? (
        <section aria-labelledby="beden-tablosu" className="sg mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]" data-size-toggle>
          <div className="min-w-0">
            <h2 id="beden-tablosu" className="text-h2 font-bold text-ink">
              Beden tablosu
            </h2>
            <div role="group" aria-label="Cinsiyet seçimi" className="mt-4 inline-flex rounded-full border border-line bg-soft p-1">
              {k ? (
                <a href="#tablo-kadin" className="sg-tab sg-tab-kadin inline-flex min-h-11 items-center rounded-full px-5 text-sm font-bold">
                  Kadın
                </a>
              ) : null}
              {e ? (
                <a href="#tablo-erkek" className="sg-tab sg-tab-erkek inline-flex min-h-11 items-center rounded-full px-5 text-sm font-bold">
                  Erkek
                </a>
              ) : null}
            </div>
            {k ? (
              <div id="tablo-kadin" className="sg-panel sg-panel-kadin" aria-label="Kadın beden tablosu">
                <SizeChartTable chart={k} />
                {hasRoute("/kadin/beden-rehberi") ? <ButtonLink href="/kadin/beden-rehberi">Kadın beden rehberi →</ButtonLink> : null}
              </div>
            ) : null}
            {e ? (
              <div id="tablo-erkek" className="sg-panel sg-panel-erkek" aria-label="Erkek beden tablosu">
                <SizeChartTable chart={e} />
                {hasRoute("/erkek/beden-rehberi") ? <ButtonLink href="/erkek/beden-rehberi">Erkek beden rehberi →</ButtonLink> : null}
              </div>
            ) : null}
          </div>
          <aside className="rounded-card border border-line bg-surface p-5">
            <h2 className="text-h3 font-bold text-ink">Beden ölçüsü nasıl alınır?</h2>
            <div className="mx-auto mt-3 w-48">
              <MeasureArt silo="kadin" title="Göğüs, bel ve basen ölçü noktaları" show={["gogus", "bel", "basen"]} />
            </div>
            <p className="mt-3 text-sm text-ink-2">Mezurayı yere paralel tutun; göğüs, bel ve basen ölçülerini sıkmadan alın. Bedeni kilodan değil bu ölçülerden belirleyin.</p>
            {measure ? (
              <ButtonLink href={measure.path} className="mt-4">
                Detaylı rehber →
              </ButtonLink>
            ) : null}
          </aside>
        </section>
      ) : null}
      {guides.length || articles.length ? (
        <section aria-labelledby="temel" className="mt-12">
          <SectionHeader id="temel" title="Temel beden rehberleri" />
          <Grid docs={[...guides, ...articles]} />
        </section>
      ) : null}
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {(["kadin", "erkek"] as const)
          .filter((s) => hasRoute(`/${s}/beden-rehberi`))
          .map((s) => (
            <section key={s} className={`rounded-card p-6 ${s === "erkek" ? "bg-primary text-white" : "bg-soft"}`}>
              <h2 className={`text-h2 font-extrabold ${s === "erkek" ? "text-white" : "text-ink"}`}>{SILO_LABEL[s]} beden rehberi</h2>
              <p className={`mt-2 text-sm ${s === "erkek" ? "text-white/85" : "text-ink-2"}`}>{s === "kadin" ? "Numara bedenler, göğüs–bel–basen ölçüleri" : "Harf bedenler, göğüs ve yaka ölçüleri"}</p>
              <ButtonLink href={`/${s}/beden-rehberi`} variant={s === "erkek" ? "light" : "primary"} className="mt-4">
                Bedeni keşfet →
              </ButtonLink>
            </section>
          ))}
      </div>
      <Body doc={doc} className="mt-12" />
      <Tail doc={doc} />
    </Shell>
  );
}

/* ---------------- Dizinler ---------------- */
function FabricDirectory({ doc }: { doc: DocMeta }) {
  const fabrics = listLive((d) => d.type === "FABRIC_GUIDE").sort((a, b) => a.label.localeCompare(b.label, "tr"));
  const articles = listLive((d) => d.collection === "makaleler" && d.fm.section === "kumas-rehberi");
  return (
    <Shell doc={doc} hero={<PageHero eyebrow={<Badge tone="kumas">Kumaş Rehberi</Badge>} title={doc.title} lead={<Lead doc={doc} />} />} ld={[itemListLd(getSettings(), fabrics.map((d) => ({ path: d.path, title: d.title })))]}>
      <div className="mt-6 max-w-prose">
        <ShortAnswer doc={doc} />
      </div>
      {fabrics.length ? (
        <section aria-labelledby="kumaslar" className="mt-10">
          <SectionHeader id="kumaslar" title="Kumaşlar" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fabrics.map((f) => (
              <article key={f.key} className="group relative flex gap-4 rounded-card border border-line bg-surface p-4 hover:border-primary/40">
                <FabricArt slug={f.id} className="h-16 w-16 shrink-0 rounded-md" />
                <div className="min-w-0">
                  <h3 className="font-bold text-ink">
                    <Link href={f.path} className="after:absolute after:inset-0 group-hover:underline underline-offset-4">
                      {f.label}
                    </Link>
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{f.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
      {articles.length ? (
        <section aria-labelledby="karsilastirmalar" className="mt-12">
          <SectionHeader id="karsilastirmalar" title="Karşılaştırmalar ve bakım" />
          <Grid docs={articles} compact />
        </section>
      ) : null}
      <Body doc={doc} className="mt-12" />
      <Tail doc={doc} />
    </Shell>
  );
}

function BrandDirectory({ doc }: { doc: DocMeta }) {
  const brands = listLive((d) => d.type === "BRAND_GUIDE").sort((a, b) => a.label.localeCompare(b.label, "tr"));
  const filters = [
    { id: "tumu", label: "Tümü" },
    { id: "kadin-markalari", label: "Kadın Markaları", match: "kadin" },
    { id: "erkek-markalari", label: "Erkek Markaları", match: "erkek" },
    { id: "uluslararasi", label: "Uluslararası Markalar", match: "intl" },
  ].filter((f) => !f.match || brands.some((b) => tagsOf(b).includes(f.match!)));
  return (
    <Shell doc={doc} hero={<PageHero eyebrow={<Badge tone="marka">Markalar</Badge>} title={doc.title} lead={<Lead doc={doc} />} />} ld={[itemListLd(getSettings(), brands.map((d) => ({ path: d.path, title: d.label })))]}>
      <div className="mt-6 max-w-prose">
        <ShortAnswer doc={doc} />
      </div>
      {brands.length ? (
        <section aria-labelledby="marka-dizini" className="bf mt-10" data-brand-filter>
          <SectionHeader id="marka-dizini" title="Marka dizini" />
          {filters.map((f) => (
            <span key={f.id} id={f.id} className="bf-target block scroll-mt-28" />
          ))}
          {filters.length > 2 ? (
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
          <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {brands.map((b) => (
              <li key={b.key} data-brand data-g={tagsOf(b).join(" ")}>
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
                    {((b.fm.genders as string[]) ?? []).map((g) => (g === "kadin" ? "Kadın" : "Erkek")).join(" · ")}
                    {b.fm.international ? " · Uluslararası" : ""}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <Body doc={doc} className="mt-12" />
      <Tail doc={doc} />
    </Shell>
  );
}
function tagsOf(b: DocMeta): string[] {
  return [...((b.fm.genders as string[]) ?? []), ...(b.fm.international ? ["intl"] : [])];
}

function SimpleDirectory({ doc, filter, title, badge }: { doc: DocMeta; filter: (d: DocMeta) => boolean; title: string; badge: "alisveris" | "trend" | "marka" }) {
  const docs = listLive(filter);
  const toptan = docs.filter((d) => d.topics.includes("toptan-pazar"));
  const rest = docs.filter((d) => !toptan.includes(d));
  return (
    <Shell doc={doc} hero={<PageHero eyebrow={<Badge tone={badge}>{title}</Badge>} title={doc.title} lead={<Lead doc={doc} />} />} ld={[itemListLd(getSettings(), docs.map((d) => ({ path: d.path, title: d.title })))]}>
      <div className="mt-6 max-w-prose">
        <ShortAnswer doc={doc} />
      </div>
      {rest.length ? (
        <section aria-labelledby="rehberler" className="mt-10">
          <SectionHeader id="rehberler" title={`${title} içerikleri`} />
          <Grid docs={rest} />
        </section>
      ) : null}
      {toptan.length ? (
        <section aria-labelledby="toptan" className="mt-12">
          <SectionHeader id="toptan" title="Toptan pazarlar" lead="Merter, Laleli ve Osmanbey gibi toptan pazarlar hakkında bilgilendirici rehberler" />
          <Grid docs={toptan} />
        </section>
      ) : null}
      <Body doc={doc} className="mt-12" />
      <Tail doc={doc} />
    </Shell>
  );
}

function GuidesDirectory({ doc }: { doc: DocMeta }) {
  const sections: { title: string; id: string; docs: DocMeta[] }[] = [
    { id: "kadin", title: "Kadın", docs: listLive((d) => d.silo === "kadin" && d.collection !== "sayfalar" && d.collection !== "markalar") },
    { id: "erkek", title: "Erkek", docs: listLive((d) => d.silo === "erkek" && d.collection !== "sayfalar" && d.collection !== "markalar") },
    { id: "beden", title: "Beden rehberleri", docs: listLive((d) => d.silo === "ortak" && d.type === "SIZE_GUIDE") },
    { id: "kumas", title: "Kumaş rehberleri", docs: listLive((d) => d.type === "FABRIC_GUIDE") },
    { id: "genel", title: "Genel rehberler", docs: listLive((d) => d.silo === "ortak" && ["ARTICLE", "STYLE_GUIDE", "SHOPPING_GUIDE", "TREND"].includes(d.type)) },
    { id: "markalar", title: "Marka dosyaları", docs: listLive((d) => d.type === "BRAND_GUIDE") },
  ].filter((s) => s.docs.length);
  const all = sections.flatMap((s) => s.docs);
  return (
    <Shell doc={doc} hero={<PageHero eyebrow={<Badge tone="marka">Rehberler</Badge>} title={doc.title} lead={<Lead doc={doc} />} />} ld={[itemListLd(getSettings(), all.map((d) => ({ path: d.path, title: d.title })))]}>
      {sections.length > 1 ? (
        <nav aria-label="Bölümler" className="scroll-strip -mx-4 mt-6 px-4">
          <ul className="flex w-max gap-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full border border-line-strong px-4 text-sm font-semibold hover:border-primary hover:text-primary">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
      {sections.map((s) => (
        <section key={s.id} aria-labelledby={s.id} className="mt-10 scroll-mt-28">
          <SectionHeader id={s.id} title={s.title} />
          <Grid docs={s.docs} compact />
        </section>
      ))}
      <Body doc={doc} className="mt-12" />
      <Tail doc={doc} />
    </Shell>
  );
}

/* ---------------- Kurumsal / yasal ---------------- */
async function StaticPage({ doc }: { doc: DocMeta }) {
  const body = await getBody(doc.key);
  return (
    <div className="container-page pb-16 pt-4" data-template={`STATIC:${String(doc.fm.key)}`}>
      <Breadcrumbs path={doc.path} />
      <div className="mx-auto mt-6 max-w-prose">
        <h1 className="text-h1 font-extrabold text-ink">{doc.title}</h1>
        <p className="mt-2 text-sm text-muted">
          Son güncelleme: <time dateTime={doc.updatedAt}>{doc.updatedAt.split("-").reverse().join(".")}</time>
        </p>
        <div className="mt-8">
          <MarkdocContent tree={body} doc={doc} />
        </div>
        {!doc.hasFaqSlot ? <FaqList doc={doc} /> : null}
      </div>
    </div>
  );
}

export function LandingTemplate({ doc }: { doc: DocMeta }) {
  const key = String(doc.fm.key);
  if (doc.fm.kind === "kurumsal" || doc.fm.kind === "yasal") return <StaticPage doc={doc} />;
  switch (key) {
    case "kadin":
    case "erkek":
      return <SiloHome doc={doc} />;
    case "kadin-giyim":
    case "erkek-giyim":
      return <ClothingHub doc={doc} />;
    case "kadin-beden-rehberi":
    case "erkek-beden-rehberi":
      return <SectionLanding doc={doc} type="SIZE_GUIDE" />;
    case "kadin-stil":
    case "erkek-stil":
      return <SectionLanding doc={doc} type="STYLE_GUIDE" />;
    case "kadin-kombinler":
    case "erkek-kombinler":
      return <SectionLanding doc={doc} type="OUTFIT_GUIDE" />;
    case "beden-rehberi":
      return <SharedSizeLanding doc={doc} />;
    case "stil":
      return <SplitLanding doc={doc} type="STYLE_GUIDE" />;
    case "kombinler":
      return <SplitLanding doc={doc} type="OUTFIT_GUIDE" />;
    case "kumas-rehberi":
      return <FabricDirectory doc={doc} />;
    case "markalar":
      return <BrandDirectory doc={doc} />;
    case "alisveris-rehberi":
      return <SimpleDirectory doc={doc} filter={(d) => d.type === "SHOPPING_GUIDE"} title="Alışveriş Rehberi" badge="alisveris" />;
    case "trendler":
      return <SimpleDirectory doc={doc} filter={(d) => d.type === "TREND"} title="Trendler" badge="trend" />;
    case "rehberler":
      return <GuidesDirectory doc={doc} />;
    default:
      return <StaticPage doc={doc} />;
  }
}

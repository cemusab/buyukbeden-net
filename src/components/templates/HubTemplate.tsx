import Link from "next/link";
import { getBody, getByPath, getDocByKey, getHubChildren, getSettings, listLive } from "@/lib/content";
import type { DocMeta } from "@/lib/content-types";
import { faqLd, itemListLd } from "@/lib/jsonld";
import type { GenderSilo } from "@/lib/taxonomy";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MarkdocContent } from "@/components/content/Markdoc";
import { FaqList } from "@/components/content/Faq";
import { AuthorBox, DocEyebrow, ShortAnswer, SourcesList, Toc } from "@/components/content/DocParts";
import { RelatedShoppingCTA } from "@/components/content/RelatedShoppingCTA";
import { CroquisArt, croquisTile, GarmentArt, hasCroquisArt } from "@/components/media/Illustration";
import { DocImage } from "@/components/media/Media";
import { CardGrid, EditorialCard } from "@/components/ui/Cards";
import { JsonLd } from "@/components/ui/primitives";

function MiniList({ title, docs, more, id }: { title: string; docs: DocMeta[]; more?: { href: string; label: string }; id: string }) {
  if (!docs.length) return null;
  return (
    <section aria-labelledby={id} className="rounded-card border border-line bg-surface p-5">
      <h2 id={id} className="text-h3 font-bold text-ink">
        {title}
      </h2>
      <ul className="mt-3 space-y-1">
        {docs.map((d) => (
          <li key={d.key}>
            <Link href={d.path} className="flex min-h-11 items-center text-[0.9375rem] text-ink-2 hover:text-primary hover:underline underline-offset-4">
              {d.title}
            </Link>
          </li>
        ))}
      </ul>
      {more ? (
        <Link href={more.href} className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline underline-offset-4">
          {more.label} →
        </Link>
      ) : null}
    </section>
  );
}

/** Kategori hub'ı (mimari §12). */
export async function HubTemplate({ doc }: { doc: DocMeta }) {
  const s = getSettings();
  const silo = doc.silo as GenderSilo;
  const cat = doc.category!;
  const fm = doc.fm as { subtopics: { key: string; label: string; description?: string }[]; featured: string[]; sizeGuides: string[]; relatedHubs: string[]; image?: DocMeta["featuredImage"] };
  const body = await getBody(doc.key);
  const children = getHubChildren(doc.id);
  const featured = fm.featured.map((p) => getByPath(p)).filter((d): d is DocMeta => !!d);
  const quick = (featured.length ? featured : children).slice(0, 6);
  const groups = fm.subtopics
    .map((st) => ({ ...st, docs: children.filter((c) => c.subtopic === st.key) }))
    .filter((g) => g.docs.length);
  const ungrouped = children.filter((c) => !c.subtopic || !fm.subtopics.some((st) => st.key === c.subtopic));
  const sizeGuides = [
    ...fm.sizeGuides.map((p) => getByPath(p)),
    ...listLive((d) => d.type === "SIZE_GUIDE" && !d.hub && (d.silo === silo || d.silo === "ortak")),
  ]
    .filter((d, i, arr): d is DocMeta => !!d && arr.findIndex((x) => x?.key === d.key) === i)
    .slice(0, 4);
  const outfits = listLive(
    (d) => d.type === "OUTFIT_GUIDE" && d.silo === silo && ((d.fm.pieces as { hub?: string }[]) ?? []).some((p) => p.hub === doc.id),
  ).slice(0, 4);
  const styles = listLive((d) => d.type === "STYLE_GUIDE" && d.silo === silo).slice(0, 3);
  const fabrics = listLive((d) => d.type === "FABRIC_GUIDE" && ((d.fm.uses as string[]) ?? []).includes(cat)).slice(0, 6);
  const brands = listLive(
    (d) => d.type === "BRAND_GUIDE" && ((d.fm.categories as string[]) ?? []).includes(cat) && ((d.fm.genders as string[]) ?? []).includes(silo),
  ).slice(0, 6);
  const relatedHubs = fm.relatedHubs.map((id) => getDocByKey(`hublar/${id}`)).filter((d): d is DocMeta => !!d);
  const ld: object[] = [itemListLd(s, children.map((c) => ({ path: c.path, title: c.title })))];
  if (doc.faq.length >= 2) ld.push(faqLd(doc.faq));

  return (
    <div className="container-page pb-16 pt-4" data-template="CATEGORY_HUB">
      <Breadcrumbs path={doc.path} />
      <header className={`mt-4 grid items-center gap-6 overflow-hidden rounded-card px-5 py-8 sm:px-8 md:grid-cols-[minmax(0,1fr)_240px] lg:px-12 ${silo === "erkek" ? "bg-primary text-white" : "bg-soft"}`}>
        <div className="min-w-0">
          <DocEyebrow doc={doc} />
          <h1 className={`mt-3 text-h1 font-extrabold ${silo === "erkek" ? "text-white" : "text-ink"}`}>{doc.title}</h1>
          <div className={`prose-tight mt-3 max-w-2xl text-lg ${silo === "erkek" ? "text-white/85 [&_a]:text-white" : "text-ink-2"}`}>
            <MarkdocContent tree={doc.inline.intro} inline />
          </div>
        </div>
        <div className="hidden md:block">
          {fm.image && doc.fm.tileStyle === "photo" ? (
            <DocImage image={fm.image} sizes="240px" ratio="1/1" priority captionClassName={silo === "erkek" ? "text-white/85" : "text-ink-2"} />
          ) : hasCroquisArt(silo, cat) ? (
            <div className="mx-auto flex aspect-square w-52 items-end justify-center overflow-hidden rounded-card pt-2" style={{ backgroundColor: croquisTile(silo, cat) }} aria-hidden="true">
              <CroquisArt silo={silo} category={cat} className="h-full w-auto" />
            </div>
          ) : (
            <div className="mx-auto aspect-square w-52 rounded-card bg-white/90 p-4" aria-hidden="true">
              <GarmentArt silo={silo} category={cat} className="h-full w-full" />
            </div>
          )}
        </div>
      </header>

      <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
        <div className="min-w-0 max-w-prose space-y-6">
          <ShortAnswer doc={doc} />
          {quick.length ? (
            <nav aria-label="Hızlı yollar">
              <ul className="flex flex-wrap gap-2">
                {quick.map((q) => (
                  <li key={q.key}>
                    <Link href={q.path} className="inline-flex min-h-11 items-center rounded-full border border-line bg-surface px-4 text-sm font-semibold text-ink hover:border-primary hover:text-primary">
                      {q.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          <Toc doc={doc} className="lg:hidden" />
          <MarkdocContent tree={body} doc={doc} />
        </div>
        <aside className="hidden lg:block" aria-label="Sayfa içi gezinme">
          <div className="sticky top-28">
            <Toc doc={doc} />
          </div>
        </aside>
      </div>

      {children.length ? (
        <section aria-labelledby="bu-kategorideki-rehberler" className="mt-12">
          <h2 id="bu-kategorideki-rehberler" className="mb-5 text-h2 font-bold text-ink">
            Bu kategorideki rehberler
          </h2>
          <div className="space-y-8">
            {groups.map((g) => (
              <div key={g.key}>
                <h3 className="mb-3 text-h3 font-bold text-ink">{g.label}</h3>
                <CardGrid cols={3}>
                  {g.docs.map((d) => (
                    <EditorialCard key={d.key} doc={d} as="h4" />
                  ))}
                </CardGrid>
              </div>
            ))}
            {ungrouped.length ? (
              <CardGrid cols={3}>
                {ungrouped.map((d) => (
                  <EditorialCard key={d.key} doc={d} />
                ))}
              </CardGrid>
            ) : null}
          </div>
        </section>
      ) : null}

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <MiniList id="ilgili-beden-rehberleri" title="İlgili beden rehberleri" docs={sizeGuides} more={getByPath(`/${silo}/beden-rehberi`) ? { href: `/${silo}/beden-rehberi`, label: "Beden rehberi" } : undefined} />
        <MiniList id="stil" title="Stil önerileri" docs={styles} more={getByPath(`/${silo}/stil`) ? { href: `/${silo}/stil`, label: "Tüm stil rehberleri" } : undefined} />
        <MiniList id="kombinler" title="Kombinler" docs={outfits} more={getByPath(`/${silo}/kombinler`) ? { href: `/${silo}/kombinler`, label: "Tüm kombinler" } : undefined} />
        <MiniList id="kumaslar" title="Kumaşlar" docs={fabrics} more={getByPath("/kumas-rehberi") ? { href: "/kumas-rehberi", label: "Kumaş rehberi" } : undefined} />
        <MiniList id="markalar" title="Markalar" docs={brands} more={getByPath("/markalar") ? { href: "/markalar", label: "Marka dizini" } : undefined} />
        <MiniList id="ilgili-kategoriler" title="İlgili kategoriler" docs={relatedHubs} />
      </div>

      <div className="max-w-prose">
        {!doc.hasFaqSlot ? <FaqList doc={doc} /> : null}
        <RelatedShoppingCTA doc={doc} />
        <SourcesList doc={doc} />
        <AuthorBox doc={doc} />
      </div>
      <JsonLd data={ld} />
    </div>
  );
}

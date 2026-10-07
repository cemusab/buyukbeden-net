import Link from "next/link";
import type { ReactNode } from "react";
import { getAuthor, getBody, getDocByKey, getSettings } from "@/lib/content";
import type { DocMeta } from "@/lib/content-types";
import { articleLd, faqLd } from "@/lib/jsonld";
import { breadcrumbFor } from "@/lib/routes";
import { OCCASIONS, SEASON_LABEL } from "@/lib/taxonomy";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DocImage } from "@/components/media/Media";
import { MarkdocContent } from "@/components/content/Markdoc";
import { FaqList } from "@/components/content/Faq";
import { RelatedShoppingCTA } from "@/components/content/RelatedShoppingCTA";
import {
  ArchiveBanner,
  AuthorBox,
  AuthorByline,
  BackToParent,
  DocEyebrow,
  RelatedBlocks,
  ShortAnswer,
  SourcesList,
  Toc,
} from "@/components/content/DocParts";
import { JsonLd } from "@/components/ui/primitives";

const ROLE_LABEL: Record<string, string> = {
  ust: "Üst",
  alt: "Alt",
  "tek-parca": "Tek parça",
  "dis-giyim": "Dış giyim",
  ayakkabi: "Ayakkabı",
  aksesuar: "Aksesuar",
};

/** Makale iskeleti: tüm editoryal türler (mimari §13). `top`/`beforeBody`/`afterBody` türe özgü bölümler. */
export async function DocShell({
  doc,
  beforeBody,
  afterBody,
  extraLd,
}: {
  doc: DocMeta;
  beforeBody?: ReactNode;
  afterBody?: ReactNode;
  extraLd?: Record<string, unknown>;
}) {
  const s = getSettings();
  const body = await getBody(doc.key);
  const chain = breadcrumbFor(doc.path);
  const parent = chain.length > 1 ? chain[chain.length - 2] : null;
  const ld: object[] = [articleLd(s, doc, getAuthor(doc.author), extraLd)];
  if (doc.faq.length >= 2) ld.push(faqLd(doc.faq));
  return (
    <article className="container-page pb-16 pt-4" data-template={doc.type}>
      <Breadcrumbs path={doc.path} />
      <div className="mt-4 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
        <div className="min-w-0 max-w-prose">
          <header className="space-y-3">
            <DocEyebrow doc={doc} />
            <h1 className="text-h1 font-extrabold text-ink">{doc.title}</h1>
            <AuthorByline doc={doc} />
          </header>
          <div className="mt-5 space-y-5">
            <ArchiveBanner doc={doc} />
            <ShortAnswer doc={doc} />
            {doc.featuredImage ? <DocImage image={doc.featuredImage} sizes="(min-width: 1024px) 720px, 100vw" priority /> : null}
            <Toc doc={doc} className="lg:hidden" />
          </div>
          {beforeBody ? <div className="mt-8">{beforeBody}</div> : null}
          <div className="mt-8">
            <MarkdocContent tree={body} doc={doc} />
          </div>
          {afterBody}
          {!doc.hasFaqSlot ? <FaqList doc={doc} /> : null}
          {!doc.hasCtaSlot ? <RelatedShoppingCTA doc={doc} /> : null}
          <SourcesList doc={doc} />
          <AuthorBox doc={doc} />
        </div>
        <aside className="hidden lg:block" aria-label="Sayfa içi gezinme">
          <div className="sticky top-28">
            <Toc doc={doc} />
          </div>
        </aside>
      </div>
      <RelatedBlocks doc={doc} />
      {parent && parent.path !== "/" ? <BackToParent href={parent.path} label={`${parent.label} rehberinin tamamı`} /> : null}
      <JsonLd data={ld} />
    </article>
  );
}

function OutfitBlock({ doc }: { doc: DocMeta }) {
  const fm = doc.fm as {
    pieces: { role: string; name: string; hub?: string; fabric?: string; color?: string; alternatives: string[] }[];
    season: string[];
    occasion: string[];
    fitFor?: string;
  };
  return (
    <section aria-labelledby="parcalar" className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {fm.season.map((s) => (
          <span key={s} className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink-2">
            {SEASON_LABEL[s as keyof typeof SEASON_LABEL] ?? s}
          </span>
        ))}
        {fm.occasion.map((o) => (
          <span key={o} className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink-2">
            {OCCASIONS.find((x) => x.key === o)?.label ?? o}
          </span>
        ))}
      </div>
      <h2 id="parcalar" className="text-h2 font-bold text-ink">
        Parçalar
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {fm.pieces.map((p, i) => {
          const hub = p.hub ? getDocByKey(`hublar/${p.hub}`) : undefined;
          const fabric = p.fabric ? getDocByKey(`kumaslar/${p.fabric}`) : undefined;
          return (
            <li key={i} className="rounded-card border border-line bg-surface p-4">
              <p className="text-eyebrow font-bold uppercase tracking-[0.12em] text-muted">{ROLE_LABEL[p.role] ?? p.role}</p>
              <p className="mt-1 font-bold text-ink">{p.name}</p>
              <dl className="mt-2 space-y-1 text-sm text-ink-2">
                {p.color ? (
                  <div className="flex gap-1">
                    <dt className="text-muted">Renk:</dt>
                    <dd>{p.color}</dd>
                  </div>
                ) : null}
                {fabric ? (
                  <div className="flex gap-1">
                    <dt className="text-muted">Kumaş:</dt>
                    <dd>
                      <Link href={fabric.path} className="text-primary underline underline-offset-2">
                        {fabric.label}
                      </Link>
                    </dd>
                  </div>
                ) : null}
                {hub ? (
                  <div className="flex gap-1">
                    <dt className="text-muted">Kategori:</dt>
                    <dd>
                      <Link href={hub.path} className="text-primary underline underline-offset-2">
                        {hub.label}
                      </Link>
                    </dd>
                  </div>
                ) : null}
                {p.alternatives.length ? (
                  <div>
                    <dt className="text-muted">Alternatifler:</dt>
                    <dd>{p.alternatives.join(", ")}</dd>
                  </div>
                ) : null}
              </dl>
            </li>
          );
        })}
      </ul>
      <div className="rounded-card border border-note-line bg-note p-5">
        <h2 className="font-bold text-ink">Neden uyumlu?</h2>
        <div className="prose-tight mt-1 text-ink-2">
          <MarkdocContent tree={doc.inline.whyItWorks} inline />
        </div>
        {fm.fitFor ? <p className="mt-2 text-sm text-ink-2">Kimler için: {fm.fitFor}</p> : null}
      </div>
    </section>
  );
}

function ShoppingBlock({ doc }: { doc: DocMeta }) {
  const fm = doc.fm as {
    criteria: { label: string; description: string }[];
    picks: { brand: string; why: string; bestFor: string; caveats?: string; sources: { url: string; label: string }[] }[];
  };
  return (
    <section aria-labelledby="nasil-degerlendirdik" className="space-y-6">
      <div className="rounded-card border border-line bg-soft p-5">
        <h2 id="nasil-degerlendirdik" className="text-h3 font-bold text-ink">
          Nasıl değerlendirdik?
        </h2>
        <ul className="mt-3 space-y-2 text-[0.9375rem] text-ink-2">
          {fm.criteria.map((c) => (
            <li key={c.label}>
              <strong className="text-ink">{c.label}:</strong> {c.description}
            </li>
          ))}
        </ul>
      </div>
      {fm.picks.length ? (
        <div className="grid gap-4">
          {fm.picks.map((p) => {
            const b = getDocByKey(`markalar/${p.brand}`);
            return (
              <div key={p.brand} className="rounded-card border border-line bg-surface p-5">
                <h3 className="text-h3 font-bold text-ink">
                  {b ? (
                    <Link href={b.path} className="hover:underline underline-offset-4">
                      {b.label}
                    </Link>
                  ) : (
                    p.brand
                  )}
                </h3>
                <p className="mt-2 text-[0.9375rem] text-ink-2">{p.why}</p>
                <p className="mt-2 text-sm text-ink-2">
                  <strong className="text-ink">Kimler için:</strong> {p.bestFor}
                </p>
                {p.caveats ? (
                  <p className="mt-1 text-sm text-ink-2">
                    <strong className="text-ink">Dikkat:</strong> {p.caveats}
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-muted">
                  Kaynak:{" "}
                  {p.sources.map((s, i) => (
                    <span key={s.url}>
                      {i ? "; " : ""}
                      <a href={s.url} rel="noopener noreferrer" className="underline underline-offset-2">
                        {s.label}
                      </a>
                    </span>
                  ))}
                </p>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

export async function ArticleTemplate({ doc }: { doc: DocMeta }) {
  const before = doc.type === "OUTFIT_GUIDE" ? <OutfitBlock doc={doc} /> : doc.type === "SHOPPING_GUIDE" ? <ShoppingBlock doc={doc} /> : null;
  return <DocShell doc={doc} beforeBody={before} />;
}


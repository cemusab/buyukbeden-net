import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getAuthor, getDocByKey, getManualRelated, getRelated, listLive } from "@/lib/content";
import type { DocMeta } from "@/lib/content-types";
import { eyebrowFor, formatDate } from "@/lib/present";
import { SOURCE_TYPE_LABEL } from "@/lib/taxonomy";
import { Badge } from "@/components/ui/primitives";
import { CardGrid, CompactCard, EditorialCard } from "@/components/ui/Cards";
import { MarkdocContent } from "./Markdoc";

export function DocEyebrow({ doc }: { doc: DocMeta }) {
  const eb = eyebrowFor(doc);
  return <Badge tone={eb.tone}>{eb.label}</Badge>;
}

/** Yazar · yayın · güncelleme · okuma süresi */
export function AuthorByline({ doc }: { doc: DocMeta }) {
  const a = getAuthor(doc.author);
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted" data-byline>
      {a ? (
        <Link href={a.path} className="inline-flex min-h-11 items-center font-semibold text-ink-2 hover:text-primary hover:underline underline-offset-4">
          {a.name}
        </Link>
      ) : null}
      <span aria-hidden="true">·</span>
      <span>
        Yayın <time dateTime={doc.publishedAt}>{formatDate(doc.publishedAt)}</time>
      </span>
      {doc.updatedAt !== doc.publishedAt ? (
        <>
          <span aria-hidden="true">·</span>
          <span>
            Güncelleme <time dateTime={doc.updatedAt}>{formatDate(doc.updatedAt)}</time>
          </span>
        </>
      ) : null}
      <span aria-hidden="true">·</span>
      <span>{doc.readingMinutes} dk okuma</span>
    </p>
  );
}

export function ShortAnswer({ doc, label = "Kısa cevap" }: { doc: DocMeta; label?: string }) {
  const tree = doc.inline.shortAnswer;
  if (!tree) return null;
  return (
    <div className="rounded-card border border-primary/15 bg-primary-soft p-4 sm:p-5" data-short-answer>
      <p className="text-eyebrow font-bold uppercase tracking-[0.12em] text-primary">{label}</p>
      <div className="prose-tight mt-1.5 text-[1.0625rem] leading-relaxed text-ink">
        <MarkdocContent tree={tree} inline />
      </div>
    </div>
  );
}

export function ArchiveBanner({ doc }: { doc: DocMeta }) {
  if (doc.status !== "archived") return null;
  return (
    <p className="rounded-card border border-warn-line bg-warn px-4 py-3 text-sm text-ink-2">
      Bu içerik arşivlenmiştir; bilgiler yayın tarihindeki durumu yansıtır.
    </p>
  );
}

/** "Bu Yazıda" içindekiler (H2'ler). Mobilde açılır-kapanır; `top` makale başındaki görselin yanındaki kutu (md+ açık). */
export function Toc({ doc, className = "", top = false, open, label = "Bu yazıda" }: { doc: DocMeta; className?: string; top?: boolean; open?: boolean; label?: string }) {
  const items = doc.toc.filter((t) => t.level === 2);
  const hasFaq = doc.faq.length > 0;
  if (items.length + (hasFaq ? 1 : 0) < 2) return null;
  const isTop = top || open;
  const link = "flex min-h-11 items-center py-1 text-ink-2 hover:text-primary hover:underline underline-offset-4";
  const list = (
    <ol className={`relative mt-3 space-y-0.5 border-l-2 border-line text-sm ${isTop ? "pl-0" : "pl-4"}`}>
      {items.map((t) => (
        <li key={t.id} className={isTop ? "relative pl-4 before:absolute before:-left-[5px] before:top-1/2 before:h-2 before:w-2 before:-translate-y-1/2 before:rounded-full before:bg-line-strong" : ""}>
          <a href={`#${t.id}`} className={link}>
            {t.text}
          </a>
        </li>
      ))}
      {hasFaq ? (
        <li className={isTop ? "relative pl-4 before:absolute before:-left-[5px] before:top-1/2 before:h-2 before:w-2 before:-translate-y-1/2 before:rounded-full before:bg-line-strong" : ""}>
          <a href="#sss" className={link}>
            Sık sorulan sorular
          </a>
        </li>
      ) : null}
    </ol>
  );
  const bp = isTop ? "md" : "lg";
  return (
    <nav aria-label={label} className={className} data-toc>
      <details className={`rounded-card border border-line bg-surface p-4 ${bp === "md" ? "md:hidden" : "lg:hidden"}`}>
        <summary className="flex min-h-11 cursor-pointer items-center font-bold text-ink">Bu Yazıda</summary>
        {list}
      </details>
      <div className={`hidden rounded-card border border-line bg-surface p-5 ${bp === "md" ? "md:block" : "lg:block"}`}>
        <p className="font-bold text-ink">Bu Yazıda</p>
        {list}
      </div>
    </nav>
  );
}

export function SourcesList({ doc }: { doc: DocMeta }) {
  if (!doc.sources.length) return null;
  return (
    <section aria-labelledby="kaynaklar" className="my-10">
      <h2 id="kaynaklar" className="text-h3 font-bold text-ink">
        Kaynaklar
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink-2">
        {doc.sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-2">
              {s.label}
            </a>{" "}
            <span className="text-muted">
              · {SOURCE_TYPE_LABEL[s.type]} · kontrol: <time dateTime={s.checkedAt}>{formatDate(s.checkedAt)}</time>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function AuthorBox({ doc }: { doc: DocMeta }) {
  const a = getAuthor(doc.author);
  if (!a) return null;
  return (
    <section aria-label="Yazar" className="my-10 rounded-card border border-line bg-soft p-5">
      <p className="text-eyebrow font-bold uppercase tracking-[0.12em] text-muted">Hazırlayan</p>
      <p className="mt-1 font-bold text-ink">
        <Link href={a.path} className="hover:underline underline-offset-4">
          {a.name}
        </Link>
      </p>
      <p className="mt-1 text-sm text-ink-2">{a.bio}</p>
      <p className="mt-2 text-xs text-muted">
        Son güncelleme: <time dateTime={doc.updatedAt}>{formatDate(doc.updatedAt)}</time>
      </p>
    </section>
  );
}

function Block({ title, docs, compact = false, id }: { title: string; docs: DocMeta[]; compact?: boolean; id: string }) {
  if (!docs.length) return null;
  return (
    <section aria-labelledby={id} className="mt-12" data-related-block={id}>
      <h2 id={id} className="mb-4 text-h2 font-bold text-ink">
        {title}
      </h2>
      {compact ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((d) => (
            <CompactCard key={d.key} doc={d} />
          ))}
        </div>
      ) : (
        <CardGrid cols={4}>
          {docs.map((d) => (
            <EditorialCard key={d.key} doc={d} showExcerpt={false} />
          ))}
        </CardGrid>
      )}
    </section>
  );
}

/** İlgili içerik blokları (mimari §8.2) – silo öncelikli, her belge bir kez. */
export function RelatedBlocks({ doc, exclude = [] }: { doc: DocMeta; exclude?: string[] }) {
  const used = new Set<string>([doc.key, ...exclude]);
  const take = (list: DocMeta[], n: number) => {
    const out: DocMeta[] = [];
    for (const d of list) {
      if (out.length >= n) break;
      if (used.has(d.key) || d.status === "archived") continue;
      used.add(d.key);
      out.push(d);
    }
    return out;
  };
  const auto = getRelated(doc);
  const siblingsSource = doc.hub && doc.collection !== "hublar" ? listLive((d) => d.hub === doc.hub && d.collection !== "hublar") : [];
  const siloOk = (d: DocMeta) => doc.silo === "ortak" || d.silo === doc.silo || d.silo === "ortak";
  const blocks = [
    { id: "bunu-da-okuyun", title: "Bunu da okuyun", docs: take([...getManualRelated(doc), ...auto], 4) },
    { id: "ayni-kategoriden", title: "Aynı kategoriden", docs: take(siblingsSource, 4) },
    {
      id: "ilgili-beden-rehberleri",
      title: "İlgili beden rehberleri",
      docs: take(
        auto.filter((d) => d.type === "SIZE_GUIDE"),
        3,
      ),
    },
    {
      id: "kombin-onerileri",
      title: "Kombin önerileri",
      docs: take(
        auto.filter((d) => d.type === "OUTFIT_GUIDE" && (doc.silo === "ortak" || d.silo === doc.silo)),
        3,
      ),
    },
    {
      id: "ilgili-kumaslar",
      title: "İlgili kumaşlar",
      docs: take(
        doc.fabrics.map((f) => getDocByKey(`kumaslar/${f}`)).filter((d): d is DocMeta => !!d),
        4,
      ),
    },
    {
      id: "ilgili-markalar",
      title: "İlgili markalar",
      docs: take(
        doc.brands.map((f) => getDocByKey(`markalar/${f}`)).filter((d): d is DocMeta => !!d && siloOk(d)),
        4,
      ),
    },
  ];
  return (
    <>
      {blocks.map((b) => (
        <Block key={b.id} id={b.id} title={b.title} docs={b.docs} compact={b.id !== "bunu-da-okuyun"} />
      ))}
    </>
  );
}

export function BackToParent({ href, label }: { href: string; label: string }) {
  return (
    <p className="mt-10">
      <Link href={href} className="inline-flex min-h-11 items-center font-semibold text-primary hover:underline underline-offset-4">
        {label} <span aria-hidden="true">&nbsp;→</span>
      </Link>
    </p>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  tone = "plain",
  image,
}: {
  eyebrow?: ReactNode;
  title: string;
  lead?: ReactNode;
  children?: ReactNode;
  tone?: "plain" | "kadin" | "erkek";
  image?: DocMeta["featuredImage"];
}) {
  const bg = tone === "erkek" ? "bg-primary text-white" : tone === "kadin" ? "bg-badge-kadin-bg/60" : "bg-soft";
  const leadCls = tone === "erkek" ? "text-white/85" : "text-ink-2";
  return (
    <div className={`relative grid overflow-hidden rounded-card ${bg} ${image ? "md:grid-cols-[minmax(0,1fr)_minmax(0,42%)]" : ""}`}>
      <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
        {eyebrow ? <div className="mb-3">{eyebrow}</div> : null}
        <h1 className={`text-h1 font-extrabold ${tone === "erkek" ? "text-white" : "text-ink"}`}>{title}</h1>
        {lead ? <div className={`prose-tight mt-3 max-w-2xl text-lg ${leadCls} ${tone === "erkek" ? "[&_a]:text-white" : ""}`}>{lead}</div> : null}
        {children}
      </div>
      {image ? (
        <figure className="relative min-h-56 md:min-h-full">
          <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 768px) 42vw, 100vw" className="object-cover" />
          {image.credit || image.aiGenerated ? (
            <figcaption className="absolute bottom-2 right-2 rounded bg-black/45 px-2 py-0.5 text-[0.6875rem] text-white/90">
              {[image.aiGenerated ? "Yapay zekâ ile üretilmiş görsel" : null, image.credit].filter(Boolean).join(" · ")}
            </figcaption>
          ) : null}
        </figure>
      ) : null}
    </div>
  );
}

/**
 * Kompakt bölüm hero'su (giyim hub'ı, silo ana sayfası): solda başlık + tek satır alt başlık + 1–2 satır metin,
 * sağda görsel. Kategori ızgarası hemen altından başlar (docs/tasarim-referansi.md).
 */
export function CompactHero({
  eyebrow,
  title,
  subtitle,
  lead,
  visual,
  tone = "plain",
}: {
  eyebrow?: ReactNode;
  title: string;
  subtitle?: string;
  lead?: ReactNode;
  visual?: ReactNode;
  tone?: "plain" | "erkek";
}) {
  const dark = tone === "erkek";
  return (
    <div
      className={`relative grid overflow-hidden rounded-card ${dark ? "bg-[#1b2433] text-white" : "bg-[#f6f1ee]"} ${visual ? "md:grid-cols-[minmax(0,1fr)_minmax(0,44%)]" : ""}`}
      data-compact-hero
    >
      <div className="relative px-5 py-6 sm:px-8 sm:py-7 lg:px-10 lg:py-9">
        {eyebrow ? <div className="mb-2.5">{eyebrow}</div> : null}
        <h1 className={`text-h1 font-extrabold ${dark ? "text-white" : "text-ink"}`}>{title}</h1>
        {subtitle ? <p className={`mt-1.5 text-lg font-semibold ${dark ? "text-white/90" : "text-ink-2"}`}>{subtitle}</p> : null}
        {lead ? <div className={`prose-tight mt-2 line-clamp-3 max-w-xl text-[0.9375rem] ${dark ? "text-white/80 [&_a]:text-white" : "text-muted"}`}>{lead}</div> : null}
      </div>
      {visual ? <div className="relative hidden min-h-48 md:block">{visual}</div> : null}
    </div>
  );
}

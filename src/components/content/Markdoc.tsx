import Markdoc, { type RenderableTreeNodes } from "@markdoc/markdoc";
import Link from "next/link";
import Image from "next/image";
import React, { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { getByPath, getSizeChart } from "@/lib/content";
import type { DocMeta, Tree } from "@/lib/content-types";
import { hasRoute } from "@/lib/routes";
import { eyebrowFor } from "@/lib/present";
import { Badge } from "@/components/ui/primitives";
import { SizeChartTable } from "./SizeChartTable";
import { FaqList } from "./Faq";
import { RelatedShoppingCTA } from "./RelatedShoppingCTA";

export function SmartLink({ href, children, title }: { href: string; children: ReactNode; title?: string }) {
  if (href.startsWith("/") || href.startsWith("#")) {
    if (href.startsWith("#")) return <a href={href}>{children}</a>;
    if (!hasRoute(href)) return <span>{children}</span>;
    return (
      <Link href={href} title={title}>
        {children}
      </Link>
    );
  }
  if (href.startsWith("mailto:")) return <a href={href}>{children}</a>;
  return (
    <a href={href} rel="noopener noreferrer" title={title}>
      {children}
    </a>
  );
}

function Heading({ level, id, children }: { level: number; id: string; children: ReactNode }) {
  const H = `h${Math.min(Math.max(level, 2), 4)}` as "h2" | "h3" | "h4";
  return <H id={id}>{children}</H>;
}

export function ResponsiveTable({ caption, kaynak, children }: { caption?: string; kaynak?: string; children: ReactNode }) {
  return (
    <figure className="not-prose my-6">
      <div
        role="region"
        aria-label={caption ?? "Tablo"}
        tabIndex={0}
        className="table-scroll rt overflow-x-auto rounded-card border border-line"
      >
        <table className="w-full min-w-[32rem] border-collapse text-left text-[0.9375rem] tabular-nums">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          {children}
        </table>
      </div>
      {caption || kaynak ? (
        <figcaption className="mt-2 text-sm text-muted">
          {caption}
          {kaynak ? <span className="block text-xs">Kaynak: {kaynak}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

const CALLOUT: Record<string, { cls: string; label: string }> = {
  bilgi: { cls: "bg-note border-note-line", label: "Not" },
  ipucu: { cls: "bg-tip border-tip-line", label: "İpucu" },
  dikkat: { cls: "bg-warn border-warn-line", label: "Dikkat" },
};

export function Callout({ tip = "bilgi", baslik, children }: { tip?: string; baslik?: string; children: ReactNode }) {
  const c = CALLOUT[tip] ?? CALLOUT.bilgi;
  return (
    <aside className={`not-prose my-6 rounded-card border p-4 text-[0.9375rem] leading-relaxed text-ink-2 sm:p-5 ${c.cls}`}>
      <p className="font-bold text-ink">{baslik ?? `${c.label}:`}</p>
      <div className="prose-tight mt-1">{children}</div>
    </aside>
  );
}

function listsOf(children: ReactNode): ReactElement[] {
  return Children.toArray(children).filter((c): c is ReactElement => isValidElement(c) && (c.type === "ul" || c.type === "ol"));
}
function itemsOf(list: ReactElement): ReactNode[] {
  return Children.toArray((list.props as { children?: ReactNode }).children).filter(isValidElement).map((li) => (li.props as { children?: ReactNode }).children);
}

export function ProsCons({ artiBaslik = "Artıları", eksiBaslik = "Eksileri", children }: { artiBaslik?: string; eksiBaslik?: string; children: ReactNode }) {
  const [pros, cons] = listsOf(children);
  return (
    <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">
      {[
        { title: artiBaslik, list: pros, sign: "+", cls: "text-ok" },
        { title: eksiBaslik, list: cons, sign: "−", cls: "text-bad" },
      ].map((col) => (
        <div key={col.title} className="rounded-card border border-line bg-surface p-4 sm:p-5">
          <p className="font-bold text-ink">{col.title}</p>
          <ul className="mt-2 space-y-2 text-[0.9375rem] text-ink-2">
            {col.list
              ? itemsOf(col.list).map((it, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden="true" className={`font-bold ${col.cls}`}>
                      {col.sign}
                    </span>
                    <span>{it}</span>
                  </li>
                ))
              : null}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  const list = listsOf(children)[0];
  if (!list) return <>{children}</>;
  return (
    <ol className="not-prose my-6 space-y-3">
      {itemsOf(list).map((it, i) => (
        <li key={i} className="flex gap-3 rounded-card border border-line bg-surface p-4">
          <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {i + 1}
          </span>
          <div className="prose-tight pt-1 text-[0.9375rem] text-ink-2">{it}</div>
        </li>
      ))}
    </ol>
  );
}

export function InlineRelated({ yol }: { yol: string }) {
  const d = getByPath(yol.split("#")[0]);
  if (!d) return null;
  const eb = eyebrowFor(d);
  return (
    <aside className="not-prose group relative my-6 rounded-card border border-line bg-soft p-4 sm:p-5">
      <p className="text-xs font-semibold text-muted">İlgili rehber</p>
      <div className="mt-2">
        <Badge tone={eb.tone}>{eb.label}</Badge>
      </div>
      <p className="mt-2 font-bold text-ink">
        <Link href={yol} className="after:absolute after:inset-0 group-hover:underline underline-offset-4">
          {d.title}
        </Link>
      </p>
      <p className="mt-1 line-clamp-2 text-sm text-muted">{d.excerpt}</p>
    </aside>
  );
}

function BodyImage({ src, alt }: { src: string; alt?: string }) {
  return (
    <span className="not-prose my-6 block">
      <Image src={src} alt={alt ?? ""} width={1200} height={800} sizes="(min-width: 768px) 720px, 100vw" className="h-auto w-full rounded-card" />
    </span>
  );
}

/** Belge bağlamıyla Markdoc ağacını React'e çevirir. */
export function MarkdocContent({ tree, doc, inline = false }: { tree: Tree; doc?: DocMeta; inline?: boolean }) {
  if (!tree) return null;
  const components = {
    Heading,
    SmartLink,
    ResponsiveTable,
    Callout,
    ProsCons,
    Steps,
    InlineRelated,
    BodyImage,
    SizeChartTable: ({ id }: { id: string }) => {
      const chart = getSizeChart(id);
      return chart ? <SizeChartTable chart={chart} /> : null;
    },
    FaqSlot: () => (doc && doc.faq.length ? <FaqList doc={doc} /> : null),
    ShoppingCtaSlot: () => (doc ? <RelatedShoppingCTA doc={doc} /> : null),
  };
  const node = Markdoc.renderers.react(tree as RenderableTreeNodes, React, { components });
  return inline ? <>{node}</> : <div className="prose-bb">{node}</div>;
}

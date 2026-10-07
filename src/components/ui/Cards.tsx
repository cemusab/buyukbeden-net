import Image from "next/image";
import Link from "next/link";
import type { DocMeta } from "@/lib/content-types";
import { eyebrowFor, formatDate } from "@/lib/present";
import { Cover } from "@/components/media/Media";
import { DocVisual } from "@/components/media/DocVisual";
import { CroquisArt, croquisTile, MeasureArt } from "@/components/media/Illustration";
import { Badge } from "./primitives";

type HeadingLevel = "h2" | "h3" | "h4";

const TYPE_ICON: Record<string, string> = {
  SIZE_GUIDE: "beden-rehberi",
  STYLE_GUIDE: "stil",
  OUTFIT_GUIDE: "kombin",
  BRAND_GUIDE: "marka",
  SHOPPING_GUIDE: "alisveris",
  FABRIC_GUIDE: "kumas",
  TREND: "trend",
  NEWS: "trend",
};
export const iconFor = (d: DocMeta) => TYPE_ICON[d.type] ?? "rehber";

/** Görselli editoryal kart. Tüm kart tek link (başlıktaki link genişletilir). */
export function EditorialCard({
  doc,
  as: H = "h3",
  ratio = "4/3",
  showExcerpt = true,
  priority = false,
}: {
  doc: DocMeta;
  as?: HeadingLevel;
  ratio?: string;
  showExcerpt?: boolean;
  priority?: boolean;
}) {
  const eb = eyebrowFor(doc);
  return (
    <article className="group relative flex h-full flex-row overflow-hidden rounded-card border border-line bg-surface shadow-card transition-shadow hover:shadow-panel sm:flex-col">
      <div className="w-[7.5rem] shrink-0 p-3 pr-0 sm:w-auto sm:p-0">
        <div className="overflow-hidden rounded-lg sm:rounded-none">
          <DocVisual doc={doc} ratio={ratio} priority={priority} rounded={false} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 120px" />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-4">
        <div>
          <Badge tone={eb.tone}>{eb.label}</Badge>
        </div>
        <H className="text-[0.9375rem] font-bold leading-snug text-ink sm:text-h3">
          <Link href={doc.path} className="after:absolute after:inset-0 after:content-[''] group-hover:underline underline-offset-4">
            {doc.title}
          </Link>
        </H>
        {showExcerpt ? <p className="hidden text-sm text-muted sm:line-clamp-2">{doc.excerpt}</p> : null}
        <p className="mt-auto pt-1 text-xs text-muted">
          <span className="hidden sm:inline">Güncellendi </span>
          <time dateTime={doc.updatedAt}>{formatDate(doc.updatedAt)}</time> · {doc.readingMinutes} dk
        </p>
      </div>
    </article>
  );
}

/** Küçük görselli liste kartı (sol küçük görsel + başlık + özet). */
export function CompactCard({ doc, as: H = "h3", showExcerpt = true }: { doc: DocMeta; as?: HeadingLevel; index?: number; showExcerpt?: boolean }) {
  const eb = eyebrowFor(doc);
  return (
    <article className="group relative flex items-start gap-3 rounded-card border border-line bg-surface p-3 transition-colors hover:border-primary/40">
      <DocVisual doc={doc} ratio="1/1" sizes="96px" className="w-20 shrink-0 sm:w-24" />
      <div className="min-w-0 flex-1 py-0.5">
        <Badge tone={eb.tone}>{eb.label}</Badge>
        <H className="mt-1.5 text-[0.9375rem] font-bold leading-snug text-ink">
          <Link href={doc.path} className="after:absolute after:inset-0 after:content-[''] group-hover:underline underline-offset-4">
            {doc.title}
          </Link>
        </H>
        {showExcerpt ? <p className="mt-1 line-clamp-2 text-sm text-muted">{doc.excerpt}</p> : null}
      </div>
    </article>
  );
}

/** Küçük dikey görsel kart (ana sayfa "Temel Rehberler" şeridi vb.). */
export function MiniCard({ doc, as: H = "h3" }: { doc: DocMeta; as?: HeadingLevel }) {
  return (
    <article className="group relative h-full overflow-hidden rounded-card border border-line bg-surface transition-shadow hover:shadow-card">
      <DocVisual doc={doc} ratio="4/3" sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw" rounded={false} />
      <H className="p-3 text-sm font-bold leading-snug text-ink">
        <Link href={doc.path} className="after:absolute after:inset-0 after:content-[''] group-hover:underline underline-offset-4">
          {doc.title}
        </Link>
      </H>
    </article>
  );
}

/** Kategori kartı (hub): kroki/görsel + ad. Izgarada sık dizilir (mockup: 5 sütun). */
export function CategoryCard({ hub, label, count, as: H = "h3", sizes = "(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 33vw" }: { hub: DocMeta; label: string; count?: number; as?: HeadingLevel; sizes?: string }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface transition-shadow hover:shadow-panel">
      <Cover
        image={hub.fm.tileStyle === "photo" ? (hub.fm.image as DocMeta["featuredImage"]) : undefined}
        title={label}
        silo={hub.silo}
        category={hub.category}
        ratio="1/1"
        sizes={sizes}
      />
      <div className="flex flex-1 items-center justify-between gap-1 px-2.5 py-2 sm:px-3 sm:py-2.5">
        <H className="min-w-0 text-[0.8125rem] font-bold leading-tight text-ink sm:text-sm">
          <Link href={hub.path} className="after:absolute after:inset-0 after:content-[''] group-hover:underline underline-offset-4">
            {label}
          </Link>
        </H>
        <span aria-hidden="true" className="hidden text-primary sm:inline">
          →
        </span>
      </div>
      {typeof count === "number" && count > 1 ? <p className="sr-only">{count} rehber</p> : null}
    </article>
  );
}

/** Izgaranın sonundaki "Ayakkabı" karosu (giyim dışı ayrı bölüme gider). */
export function FootwearCard({ silo, href, label = "Ayakkabı", as: H = "h3" }: { silo: "kadin" | "erkek"; href: string; label?: string; as?: HeadingLevel }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface transition-shadow hover:shadow-panel" data-footwear-tile>
      <div aria-hidden="true" className="flex items-end justify-center overflow-hidden rounded-card pt-2" style={{ aspectRatio: "1/1", backgroundColor: croquisTile(silo, "ayakkabi") }}>
        <CroquisArt silo={silo} category="ayakkabi" className="h-full w-auto" />
      </div>
      <div className="flex flex-1 items-center justify-between gap-1 px-2.5 py-2 sm:px-3 sm:py-2.5">
        <H className="min-w-0 text-[0.8125rem] font-bold leading-tight text-ink sm:text-sm">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] group-hover:underline underline-offset-4">
            {label}
          </Link>
        </H>
        <span aria-hidden="true" className="hidden text-primary sm:inline">
          →
        </span>
      </div>
    </article>
  );
}

/** Kategori ızgarası: masaüstü 5–6, tablet 4, mobil 3 sütun. */
export function CategoryGrid({ children, cols = 5 }: { children: React.ReactNode; cols?: 5 | 6 }) {
  return <div className={`grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 ${cols === 6 ? "lg:grid-cols-6" : "lg:grid-cols-5"} lg:gap-4`}>{children}</div>;
}

export function CardGrid({ children, cols = 4 }: { children: React.ReactNode; cols?: 2 | 3 | 4 | 5 | 6 }) {
  const c =
    cols === 2
      ? "sm:grid-cols-2"
      : cols === 3
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : cols === 5
          ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
          : cols === 6
            ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
            : "sm:grid-cols-2 lg:grid-cols-4";
  return <div className={`grid gap-4 md:gap-5 ${c}`}>{children}</div>;
}

/** Liste satırı: küçük kare görsel + başlık (mini listelerde görselsiz satır kalmasın). */
export function ThumbLink({ doc, label, dark = false }: { doc: DocMeta; label?: string; dark?: boolean }) {
  return (
    <Link href={doc.path} className={`group flex min-h-11 items-center gap-3 py-1 text-[0.9375rem] ${dark ? "text-white/90 hover:text-white" : "text-ink-2 hover:text-primary"}`}>
      <DocVisual doc={doc} ratio="1/1" sizes="48px" className="w-12 shrink-0" />
      <span className="min-w-0 leading-snug group-hover:underline underline-offset-4">{label ?? doc.title}</span>
    </Link>
  );
}

/** Beden rehberi bandı kartı: kişisiz ölçü fotoğrafı üstünde başlık + buton (mockup orta bant). */
export function SizeBandCard({ href, title, text, image, silo, cta = "Bedeni Keşfet" }: { href: string; title: string; text: string; cta?: string; image?: { src: string; alt: string; credit?: string }; silo: "kadin" | "erkek" }) {
  return (
    <Link href={href} className={`group relative flex min-h-52 flex-col justify-end overflow-hidden rounded-card p-6 text-white md:min-h-72 ${silo === "kadin" ? "bg-[#5d3a46]" : "bg-primary"}`}>
      {image ? (
        <>
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#111318]/90 via-[#111318]/55 to-[#111318]/10" />
          {image.credit ? <span className="absolute right-2 top-2 rounded bg-black/50 px-2 py-0.5 text-[0.6875rem] text-white">{image.credit}</span> : null}
        </>
      ) : (
        <div aria-hidden="true" className="absolute inset-y-4 right-4 w-28 rounded-md bg-white/95 p-1">
          <MeasureArt silo={silo} show={["gogus", "bel", "basen"]} />
        </div>
      )}
      <span className="relative text-h3 font-bold">{title}</span>
      <span className="relative mt-1 text-sm text-white/90">{text}</span>
      <span className="relative mt-4 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink group-hover:bg-soft">
        {cta} <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}


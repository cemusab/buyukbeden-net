import Link from "next/link";
import type { DocMeta } from "@/lib/content-types";
import { eyebrowFor, formatDate } from "@/lib/present";
import { Cover } from "@/components/media/Media";
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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card transition-shadow hover:shadow-panel">
      <Cover image={doc.featuredImage} title={doc.title} silo={doc.silo} category={doc.category} ratio={ratio} priority={priority} icon={iconFor(doc)} />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <Badge tone={eb.tone}>{eb.label}</Badge>
        </div>
        <H className="text-h3 font-bold leading-snug text-ink">
          <Link href={doc.path} className="after:absolute after:inset-0 after:content-[''] group-hover:underline underline-offset-4">
            {doc.title}
          </Link>
        </H>
        {showExcerpt ? <p className="line-clamp-2 text-sm text-muted">{doc.excerpt}</p> : null}
        <p className="mt-auto pt-1 text-xs text-muted">
          Güncellendi <time dateTime={doc.updatedAt}>{formatDate(doc.updatedAt)}</time> · {doc.readingMinutes} dk
        </p>
      </div>
    </article>
  );
}

/** Görselsiz liste kartı. */
export function CompactCard({ doc, as: H = "h3", index }: { doc: DocMeta; as?: HeadingLevel; index?: number }) {
  const eb = eyebrowFor(doc);
  return (
    <article className="group relative flex gap-3 rounded-card border border-line bg-surface p-4 transition-colors hover:border-primary/40">
      {typeof index === "number" ? (
        <span aria-hidden="true" className="text-2xl font-extrabold leading-none text-primary/30">
          {String(index + 1).padStart(2, "0")}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <Badge tone={eb.tone}>{eb.label}</Badge>
        <H className="mt-2 font-bold leading-snug text-ink">
          <Link href={doc.path} className="after:absolute after:inset-0 after:content-[''] group-hover:underline underline-offset-4">
            {doc.title}
          </Link>
        </H>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{doc.excerpt}</p>
      </div>
    </article>
  );
}

/** Kategori kartı (hub): görsel/çizim + ad. */
export function CategoryCard({ hub, label, count, as: H = "h3" }: { hub: DocMeta; label: string; count?: number; as?: HeadingLevel }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface transition-shadow hover:shadow-panel">
      <Cover
        image={hub.fm.image as DocMeta["featuredImage"]}
        title={label}
        silo={hub.silo}
        category={hub.category}
        ratio="1/1"
        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
      />
      <div className="flex items-center justify-between gap-2 p-3">
        <H className="font-bold text-ink">
          <Link href={hub.path} className="after:absolute after:inset-0 after:content-[''] group-hover:underline underline-offset-4">
            {label}
          </Link>
        </H>
        <span aria-hidden="true" className="text-primary">
          →
        </span>
      </div>
      {typeof count === "number" && count > 0 ? <p className="-mt-2 px-3 pb-3 text-xs text-muted">{count} rehber</p> : null}
    </article>
  );
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

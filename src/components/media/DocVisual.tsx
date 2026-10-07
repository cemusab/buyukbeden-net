/**
 * Her kart ve makale kapağı için tek görsel sistemi (docs/tasarim-referansi.md: görselsiz kart yok).
 * Sıra: içerikteki fotoğraf (featuredImage) → içeriğe uygun pastel zeminli illüstrasyon → tür ikonu.
 * İllüstrasyon karoları dekoratiftir (aria-hidden); kartın adı başlıktaki linkten gelir.
 */
import type { ReactNode } from "react";
import { getDocByKey } from "@/lib/content";
import type { DocMeta } from "@/lib/content-types";
import { BodyTypeFigure, bodyTypeSwatch, CareSymbol, FabricSwatch, FitSilhouette, MeasureFigure } from "@/components/illustrations";
import { bodyTypeOf, BODY_TYPE_OVERVIEW } from "@/components/content/BodyTypeTiles";
import { CroquisArt, croquisTile, hasCroquisArt, hasFabricSwatch, QuickIcon } from "./Illustration";
import { DocImage } from "./Media";

type Silo = "kadin" | "erkek";

/** Pastel karo zeminleri (rozet tonlarıyla uyumlu; yalnız görsel karolarında). */
export const TILE = {
  beden: "#EFEAF8",
  kumas: "#EAF4EE",
  bakim: "#FBF5E6",
  alisveris: "#FFF6DD",
  trend: "#E7F4F6",
  marka: "#EEF0F3",
  stil: "#FDF0E6",
  kadin: "#FBEDF2",
  erkek: "#E8EFF8",
  neutral: "#F2F1EF",
} as const;

export type VisualKind =
  | { kind: "photo" }
  | { kind: "body"; silo: Silo; shape: string }
  | { kind: "body-group"; silo: Silo }
  | { kind: "fit"; silo: Silo }
  | { kind: "croquis"; silo: Silo; category: string }
  | { kind: "measure"; silo: Silo }
  | { kind: "fabric"; slugs: string[] }
  | { kind: "care" }
  | { kind: "brand"; label: string }
  | { kind: "icon"; icon: string; bg: string };

const siloOf = (d: DocMeta): Silo | null => (d.silo === "kadin" || d.silo === "erkek" ? d.silo : null);

const ICON: Record<string, { icon: string; bg: string }> = {
  SIZE_GUIDE: { icon: "beden-rehberi", bg: TILE.beden },
  STYLE_GUIDE: { icon: "stil", bg: TILE.stil },
  OUTFIT_GUIDE: { icon: "kombin", bg: TILE.stil },
  BRAND_GUIDE: { icon: "marka", bg: TILE.marka },
  SHOPPING_GUIDE: { icon: "alisveris", bg: TILE.alisveris },
  FABRIC_GUIDE: { icon: "kumas", bg: TILE.kumas },
  TREND: { icon: "trend", bg: TILE.trend },
  NEWS: { icon: "trend", bg: TILE.trend },
};

/** Belgenin illüstrasyon türü (fotoğraf yoksa ya da `ignorePhoto` ile). */
export function visualKindOf(doc: DocMeta, ignorePhoto = false): VisualKind {
  if (doc.featuredImage && !ignorePhoto) return { kind: "photo" };
  const silo = siloOf(doc);
  const path = doc.path;
  const slug = path.split("/").pop() ?? "";

  // Vücut tipi rehberleri
  if (silo && path === BODY_TYPE_OVERVIEW[silo]) return { kind: "body-group", silo };
  const bt = bodyTypeOf(doc);
  if (bt) return { kind: "body", silo: bt.silo, shape: bt.shape };
  // Kalıp (pantolon/jean) rehberleri
  if (silo && /kalip-rehberi$/.test(path) && (doc.category === "pantolon" || doc.category === "jean")) return { kind: "fit", silo };
  // Ayakkabı
  if (/ayakkabi|ayak-olcusu|cizme/.test(path)) return { kind: "croquis", silo: silo ?? "kadin", category: "ayakkabi" };
  // Bakım / yıkama / etiket
  if (doc.type !== "FABRIC_GUIDE" && /bakim|yikama|etiket/.test(slug)) return { kind: "care" };
  // Kumaş
  if (doc.type === "FABRIC_GUIDE") return hasFabricSwatch(doc.id) ? { kind: "fabric", slugs: [doc.id] } : { kind: "icon", ...ICON.FABRIC_GUIDE };
  if (doc.topics.includes("kumas") && (doc.fm.section === "kumas-rehberi" || doc.type === "TREND") && !silo) return { kind: "fabric", slugs: ["pamuk", "viskon", "denim"] };
  // Kategoriye bağlı içerik (hub ve çocukları)
  if (silo && doc.category && hasCroquisArt(silo, doc.category)) return { kind: "croquis", silo, category: doc.category };
  // Kombin: ilk parçanın kategorisi
  if (silo && doc.type === "OUTFIT_GUIDE") {
    const pieces = (doc.fm.pieces as { hub?: string }[] | undefined) ?? [];
    for (const p of pieces) {
      const cat = p.hub ? getDocByKey(`hublar/${p.hub}`)?.category : undefined;
      if (cat && hasCroquisArt(silo, cat)) return { kind: "croquis", silo, category: cat };
    }
    return { kind: "croquis", silo, category: silo === "kadin" ? "elbise" : "gomlek" };
  }
  // Beden rehberleri
  if (doc.type === "SIZE_GUIDE") return { kind: "measure", silo: silo ?? "kadin" };
  if (doc.type === "BRAND_GUIDE") return { kind: "brand", label: doc.label };
  // Stil ve trend: silonun temsilî kategorisi
  if (silo && doc.type === "STYLE_GUIDE") return { kind: "croquis", silo, category: /gogus|yaka/.test(slug) ? "bluz" : silo === "kadin" ? "elbise" : "gomlek" };
  if (silo && doc.type === "TREND") return { kind: "croquis", silo, category: silo === "kadin" ? "kaban" : "mont" };
  if (doc.type === "TREND") return { kind: "fabric", slugs: ["triko", "keten", "denim"] };
  return { kind: "icon", ...(ICON[doc.type] ?? { icon: "rehber", bg: silo ? TILE[silo] : TILE.neutral }) };
}

function Tile({ bg, ratio, className = "", align = "end", rounded = true, children }: { bg: string; ratio: string; className?: string; align?: "end" | "center"; rounded?: boolean; children: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className={`flex justify-center overflow-hidden ${rounded ? "rounded-card" : ""} ${align === "end" ? "items-end pt-[6%]" : "items-center"} ${className}`}
      style={{ aspectRatio: ratio, backgroundColor: bg }}
    >
      {children}
    </div>
  );
}

const BODY_GROUP: Record<Silo, string[]> = { kadin: ["kum-saati", "armut", "elma"], erkek: ["oval", "dikdortgen", "ters-ucgen"] };
const FIT_PAIR: Record<Silo, [string, string]> = { kadin: ["wide-leg", "slim"], erkek: ["regular", "slim"] };
const CARE: string[] = ["yikama-30", "agartma-yok", "utu-2", "asarak-kurutma"];

/** İllüstrasyon karosu (fotoğrafsız). Tüm karolar dekoratiftir. */
export function VisualTile({ v, ratio = "4/3", className = "", rounded = true }: { v: VisualKind; ratio?: string; className?: string; rounded?: boolean }) {
  switch (v.kind) {
    case "body":
      return (
        <Tile bg={bodyTypeSwatch(v.silo, v.shape).tile} ratio={ratio} rounded={rounded} className={className}>
          <BodyTypeFigure silo={v.silo} shape={v.shape} tile={false} className="h-full w-auto" />
        </Tile>
      );
    case "body-group":
      return (
        <Tile bg={bodyTypeSwatch(v.silo, BODY_GROUP[v.silo][1]).tile} ratio={ratio} rounded={rounded} className={`gap-[2%] px-[4%] ${className}`}>
          {BODY_GROUP[v.silo].map((s) => (
            <BodyTypeFigure key={s} silo={v.silo} shape={s} tile={false} className="h-full w-auto" />
          ))}
        </Tile>
      );
    case "fit":
      return (
        <Tile bg={croquisTile(v.silo, "jean")} ratio={ratio} rounded={rounded} className={`gap-[4%] ${className}`}>
          {FIT_PAIR[v.silo].map((f) => (
            <FitSilhouette key={f} silo={v.silo} fit={f} guides={false} aria-hidden className="h-full w-auto" />
          ))}
        </Tile>
      );
    case "croquis":
      return (
        <Tile bg={croquisTile(v.silo, v.category)} ratio={ratio} rounded={rounded} className={className}>
          <CroquisArt silo={v.silo} category={v.category} className="h-full w-auto" />
        </Tile>
      );
    case "measure":
      return (
        <Tile bg={TILE.beden} ratio={ratio} rounded={rounded} className={className}>
          <MeasureFigure silo={v.silo} show={v.silo === "kadin" ? ["gogus", "bel", "basen"] : ["gogus", "bel", "omuz"]} labels={false} className="h-full w-auto" />
        </Tile>
      );
    case "fabric":
      return (
        <Tile bg={TILE.kumas} ratio={ratio} rounded={rounded} align="center" className={`gap-[5%] ${className}`}>
          {v.slugs.length === 1 ? (
            <FabricSwatch slug={v.slugs[0]} className="h-[62%] w-auto drop-shadow-sm" />
          ) : (
            v.slugs.map((s, i) => <FabricSwatch key={s} slug={s} className={`h-[42%] w-auto drop-shadow-sm ${i === 1 ? "-translate-y-[12%]" : ""}`} />)
          )}
        </Tile>
      );
    case "care":
      return (
        <Tile bg={TILE.bakim} ratio={ratio} rounded={rounded} align="center" className={className}>
          <div className="grid h-[70%] grid-cols-2 gap-[8%] text-ink-2">
            {CARE.map((n) => (
              <CareSymbol key={n} name={n} aria-hidden className="h-full w-auto" />
            ))}
          </div>
        </Tile>
      );
    case "brand": {
      const mono = v.label.replace(/[^\p{L}\p{N}&]+/gu, " ").trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 3).toLocaleUpperCase("tr");
      return (
        <Tile bg={TILE.marka} ratio={ratio} align="center" rounded={rounded} className={`@container px-[8%] ${className}`}>
          <span className="hidden text-center text-[length:min(1.35rem,13cqw)] font-extrabold leading-tight tracking-tight text-ink @min-[9rem]:block">{v.label}</span>
          <span className="text-center text-[length:34cqw] font-extrabold leading-none tracking-tight text-ink/80 @min-[9rem]:hidden">{v.label.length <= 4 ? v.label : mono}</span>
        </Tile>
      );
    }
    case "icon":
      return (
        <Tile bg={v.bg} ratio={ratio} rounded={rounded} align="center" className={className}>
          <QuickIcon name={v.icon} className="h-[38%] w-auto text-primary/55" />
        </Tile>
      );
    default:
      return null;
  }
}

/** Kart/makale görseli: fotoğraf varsa fotoğraf, yoksa uygun illüstrasyon karosu. */
export function DocVisual({
  doc,
  ratio = "4/3",
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  className = "",
  caption = false,
  rounded = true,
}: {
  doc: DocMeta;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  caption?: boolean;
  rounded?: boolean;
}) {
  if (doc.featuredImage) return <DocImage image={doc.featuredImage} sizes={sizes} ratio={ratio} priority={priority} caption={caption} className={className} rounded={rounded} />;
  return <VisualTile v={visualKindOf(doc)} ratio={ratio} className={className} rounded={rounded} />;
}

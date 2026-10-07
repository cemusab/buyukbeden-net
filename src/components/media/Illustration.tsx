/**
 * İllüstrasyon adaptörü: src/components/illustrations (ayrı ekip) bileşenlerini güvenli biçimde kullanır.
 * Çizim yoksa null döner; çağıran tipografik yedeğe düşer.
 */
import * as Illu from "@/components/illustrations";

const keys = (Illu as unknown as { GARMENT_KEYS?: Record<string, readonly string[]> }).GARMENT_KEYS;

export function hasGarmentArt(silo: string, category: string): boolean {
  return !!keys?.[silo]?.includes(category);
}

export function GarmentArt({ category, silo, className = "h-full w-auto max-h-full" }: { category: string; silo: "kadin" | "erkek"; className?: string }) {
  if (!hasGarmentArt(silo, category)) return null;
  return <Illu.GarmentIllustration silo={silo} category={category} className={className} />;
}

export function hasCroquisArt(silo: string, category: string): boolean {
  return Illu.hasGarmentCroquis(silo, category);
}

/** Kategori krokisi (kıyafeti giyen yüzsüz manken / iç giyim ve ayakkabıda natürmort). Zemin rengi `croquisTile` ile. */
export function CroquisArt({ silo, category, className = "h-full w-auto max-h-full" }: { silo: "kadin" | "erkek"; category: string; className?: string }) {
  if (!hasCroquisArt(silo, category)) return null;
  return <Illu.GarmentCroquis silo={silo} category={category} tile={false} tight className={className} />;
}

export function croquisTile(silo: "kadin" | "erkek", category: string): string {
  return Illu.garmentCroquisTile(silo, category);
}

export function MeasureArt({ silo, className, title, show }: { silo: "kadin" | "erkek"; className?: string; title?: string; show?: readonly string[] }) {
  return <Illu.MeasureFigure silo={silo} className={className} title={title} show={show} />;
}

/** Vücut tipi figürü (moda krokisi tarzı). Eski `BodyShape` dışa açık kalır ama burada yeni figür kullanılır. */
export function BodyShapeArt({ silo, shape, className, title }: { silo: "kadin" | "erkek"; shape: string; className?: string; title?: string }) {
  return <Illu.BodyTypeFigure silo={silo} shape={shape} guides className={className} title={title} />;
}

export function QuickIcon({ name, className }: { name: string; className?: string }) {
  return <Illu.QuickIcon name={name} className={className} />;
}

export function hasFabricSwatch(slug: string): boolean {
  return (Illu.FABRIC_SLUGS as readonly string[]).includes(slug);
}

export function FabricArt({ slug, className }: { slug: string; className?: string }) {
  if (!hasFabricSwatch(slug)) return null;
  return <Illu.FabricSwatch slug={slug} className={className} />;
}

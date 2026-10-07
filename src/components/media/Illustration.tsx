/**
 * İllüstrasyon adaptörü: src/components/illustrations (ayrı ekip) bileşenlerini güvenli biçimde kullanır.
 * Çizim yoksa null döner; çağıran tipografik yedeğe düşer.
 */
import fs from "node:fs";
import type { ReactNode } from "react";
import path from "node:path";
import * as Illu from "@/components/illustrations";
import { bodyTypeFile, croquisFile, type IlluFile } from "@/components/illustrations/static-files";

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

const fileExists = new Map<string, boolean>();
function hasFile(src: string): boolean {
  let ok = fileExists.get(src);
  if (ok === undefined) {
    ok = fs.existsSync(path.join(process.cwd(), "public", src));
    fileExists.set(src, ok);
  }
  return ok;
}

/**
 * Büyük çizimi önbelleğe alınabilir statik SVG dosyası olarak `<img>` ile basar (scripts/build-illustrations.tsx üretir);
 * dosya yoksa aynı çizim satır içi basılır. `alt` yoksa dekoratif (alt=""). Boyut öznitelikleri yerleşim kaymasını önler.
 */
function SvgFile({ file, className, alt, eager = false, inline }: { file: IlluFile; className?: string; alt?: string; eager?: boolean; inline: () => ReactNode }) {
  if (!hasFile(file.src)) return <>{inline()}</>;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- statik SVG; next/image optimizasyonu SVG'de işlemez
    <img
      src={file.src}
      width={file.width}
      height={file.height}
      alt={alt ?? ""}
      className={className}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      data-illu=""
    />
  );
}

/** Kategori krokisi (kıyafeti giyen yüzsüz manken / iç giyim ve ayakkabıda natürmort). Zemin rengi `croquisTile` ile. */
export function CroquisArt({ silo, category, className = "h-full w-auto max-h-full", eager = false }: { silo: "kadin" | "erkek"; category: string; className?: string; eager?: boolean }) {
  if (!hasCroquisArt(silo, category)) return null;
  return (
    <SvgFile
      file={croquisFile(silo, category)}
      className={className}
      eager={eager}
      inline={() => <Illu.GarmentCroquis silo={silo} category={category} tile={false} tight className={className} />}
    />
  );
}

/** Vücut tipi figürü, zeminsiz ve yardımcı çizgisiz (dosya olarak). `title` verilirse anlamlı görsel (alt). */
export function BodyTypeArt({ silo, shape, garment, className, title, eager = false }: { silo: "kadin" | "erkek"; shape: string; garment?: string; className?: string; title?: string; eager?: boolean }) {
  return (
    <SvgFile
      file={bodyTypeFile(silo, shape, garment)}
      className={className}
      alt={title}
      eager={eager}
      inline={() => <Illu.BodyTypeFigure silo={silo} shape={shape} garment={garment} tile={false} className={className} title={title} />}
    />
  );
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

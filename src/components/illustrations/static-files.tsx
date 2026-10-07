/**
 * Büyük kroki çizimlerinin statik SVG dosyası karşılıkları (performans).
 *
 * Kroki/vücut tipi figürleri 10–20 KB'lık SVG'ler; satır içi basıldıklarında hem HTML'de hem RSC yükünde
 * iki kez taşınıyor ve tarayıcı önbelleğine giremiyordu (ana sayfa ~1,2 MB HTML). Bu dosya her varyantın
 * dosya adını ve üreticisini tek yerde tanımlar: `scripts/build-illustrations.tsx` build öncesi hepsini
 * `public/cizim/` altına yazar; bileşenler (`media/Illustration.tsx > SvgFile`) dosya varsa `<img>` basar,
 * yoksa aynı çizimi satır içi basar. Metin içeren (ölçü çizgili) varyantlar burada yoktur; satır içi kalır.
 */
import type { ReactElement } from "react";
import { BODY_TYPE_GARMENTS, BODY_TYPES, BodyTypeFigure, VB_H, VB_W } from "./body-type";
import { GARMENT_CROQUIS_KEYS, GarmentCroquis } from "./garment-croquis";
import type { Silo } from "./shared";

export const ILLU_FILE_DIR = "cizim";

export type IlluFile = { src: string; width: number; height: number; render: () => ReactElement };

/** Kategori krokisi, `tight` görünüm, zeminsiz (kartlarda zemin rengi kapsayıcıdan gelir). */
export function croquisFile(silo: Silo, category: string): IlluFile {
  return {
    src: `/${ILLU_FILE_DIR}/kroki-${silo}-${category}.svg`,
    width: VB_W - 16,
    height: VB_H - 50,
    render: () => <GarmentCroquis silo={silo} category={category} tile={false} tight />,
  };
}

/** Vücut tipi figürü, zeminsiz, yardımcı çizgisiz (metin içermez). Kıyafet verilmezse siloya göre ilk kıyafet. */
export function bodyTypeFile(silo: Silo, shape: string, garment?: string): IlluFile {
  const list = BODY_TYPE_GARMENTS[silo] as readonly string[];
  const g = garment && list.includes(garment) ? garment : list[0];
  return {
    src: `/${ILLU_FILE_DIR}/vucut-${silo}-${shape}-${g}.svg`,
    width: VB_W,
    height: VB_H,
    render: () => <BodyTypeFigure silo={silo} shape={shape} garment={g} tile={false} />,
  };
}

/** Üretilecek tüm dosyalar (build-illustrations betiği kullanır). */
export function allIlluFiles(): IlluFile[] {
  const out: IlluFile[] = [];
  for (const silo of ["kadin", "erkek"] as const) {
    for (const c of GARMENT_CROQUIS_KEYS[silo]) out.push(croquisFile(silo, c));
    for (const s of BODY_TYPES[silo]) for (const g of BODY_TYPE_GARMENTS[silo]) out.push(bodyTypeFile(silo, s, g));
  }
  return out;
}

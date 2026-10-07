/**
 * Özgün SVG illüstrasyonları (sunucu bileşenleri, istemci JS'i yok).
 * Renkler `--illu-*` CSS değişkenleriyle ezilebilir (bkz. shared.tsx > C).
 * Bilinmeyen anahtarlar hata fırlatmaz; nötr yedek görsel döner.
 */
export { BodyShape, MeasureFigure, BODY_SHAPES, BODY_SHAPE_LABELS, MEASURE_KEYS, MEASURE_LABELS } from "./body";
export type { BodyShapeProps, MeasureFigureProps, BodyShapeKey, KadinShape, ErkekShape, MeasureKey } from "./body";
export { GarmentIllustration, GARMENT_KEYS } from "./garments";
export type { GarmentIllustrationProps, KadinGarment, ErkekGarment } from "./garments";
export { QuickIcon, QUICK_ICON_NAMES } from "./icons";
export type { QuickIconProps, QuickIconName } from "./icons";
export { FabricSwatch, FABRIC_SLUGS } from "./fabrics";
export type { FabricSwatchProps, FabricSlug } from "./fabrics";
export { CareSymbol, CARE_SYMBOL_NAMES, CARE_SYMBOL_LABELS } from "./care";
export type { CareSymbolProps, CareSymbolName } from "./care";
export { TONES, C as ILLU_COLORS } from "./shared";
export type { Silo, Tone } from "./shared";

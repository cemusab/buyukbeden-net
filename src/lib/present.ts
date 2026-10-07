/** Sunum yardımcıları: eyebrow rozeti, tarih biçimi, tür etiketleri. Saf fonksiyonlar. */
import type { DocMeta } from "./content-types";
import { categoryLabel, type GenderSilo } from "./taxonomy";

export type BadgeTone = "kadin" | "erkek" | "beden" | "kumas" | "stil" | "marka" | "alisveris" | "trend";

const TYPE_LABEL: Record<string, string> = {
  ARTICLE: "Rehber",
  SIZE_GUIDE: "Beden Rehberi",
  STYLE_GUIDE: "Stil",
  OUTFIT_GUIDE: "Kombin",
  SHOPPING_GUIDE: "Alışveriş Rehberi",
  TREND: "Trend",
  NEWS: "Gündem",
  BRAND_GUIDE: "Marka Dosyası",
  FABRIC_GUIDE: "Kumaş Rehberi",
  CATEGORY_HUB: "Giyim",
  LANDING: "Rehber",
};

export function eyebrowFor(d: Pick<DocMeta, "type" | "silo" | "category" | "collection">): { label: string; tone: BadgeTone } {
  const silo = d.silo === "kadin" ? "Kadın" : d.silo === "erkek" ? "Erkek" : null;
  let kind = TYPE_LABEL[d.type] ?? "Rehber";
  if ((d.type === "ARTICLE" || d.type === "CATEGORY_HUB") && d.category && d.silo !== "ortak")
    kind = categoryLabel(d.silo as GenderSilo, d.category);
  const tone: BadgeTone =
    d.type === "SIZE_GUIDE"
      ? "beden"
      : d.type === "FABRIC_GUIDE"
        ? "kumas"
        : d.type === "STYLE_GUIDE" || d.type === "OUTFIT_GUIDE"
          ? "stil"
          : d.type === "BRAND_GUIDE"
            ? "marka"
            : d.type === "SHOPPING_GUIDE"
              ? "alisveris"
              : d.type === "TREND" || d.type === "NEWS"
                ? "trend"
                : d.silo === "erkek"
                  ? "erkek"
                  : d.silo === "kadin"
                    ? "kadin"
                    : "marka";
  return { label: silo ? `${silo} · ${kind}` : kind, tone };
}

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
/** "2026-10-07" → "7 Ekim 2026" (saat dilimi etkisiz) */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function trUpper(s: string): string {
  return s.toLocaleUpperCase("tr");
}

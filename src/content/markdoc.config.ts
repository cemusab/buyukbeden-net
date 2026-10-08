/**
 * Markdoc gövde sözleşmesi (mimari §6.4). Build tarafı: validate + transform.
 * Render tarafı: src/components/content/MarkdocRenderer.tsx aynı bileşen adlarını eşler.
 */
import Markdoc, { type Config, type Node, type Schema, Tag } from "@markdoc/markdoc";
import { slugifyTr } from "../lib/slugify";
import { FIT_KEYS, isFitKey } from "../components/illustrations/fit-keys";

export function nodeText(node: Node): string {
  let out = "";
  for (const child of node.walk()) {
    if (child.type === "text" && typeof child.attributes.content === "string") out += child.attributes.content;
    if (child.type === "code" && typeof child.attributes.content === "string") out += child.attributes.content;
  }
  return out;
}

const heading: Schema = {
  children: ["inline"],
  attributes: { level: { type: Number, required: true, render: false } },
  validate(node) {
    const level = node.attributes.level as number;
    if (level === 1) {
      return [{ id: "h1-yasak", level: "error", message: "Gövdede '#' (H1) kullanılamaz; H1 başlıktan gelir. '##' kullanın." }];
    }
    return [];
  },
  transform(node, config) {
    const level = node.attributes.level as number;
    const text = nodeText(node);
    return new Tag("Heading", { level, id: slugifyTr(text) }, node.transformChildren(config));
  },
};

const link: Schema = {
  render: "SmartLink",
  children: ["strong", "em", "s", "code", "text", "tag"],
  attributes: { href: { type: String, required: true }, title: { type: String } },
};

const image: Schema = {
  render: "BodyImage",
  attributes: { src: { type: String, required: true }, alt: { type: String }, title: { type: String } },
};

const tableNode: Schema = {
  render: "ResponsiveTable",
  attributes: { caption: { type: String }, kaynak: { type: String } },
};

export const markdocConfig: Config = {
  nodes: {
    heading,
    link,
    image,
    table: tableNode,
    document: { ...Markdoc.nodes.document, render: undefined },
  },
  tags: {
    table: {
      ...Markdoc.tags.table,
      attributes: { caption: { type: String }, kaynak: { type: String } },
    },
    not: {
      render: "Callout",
      attributes: {
        tip: { type: String, default: "bilgi", matches: ["bilgi", "ipucu", "dikkat"] },
        baslik: { type: String },
      },
    },
    "arti-eksi": {
      render: "ProsCons",
      attributes: { artiBaslik: { type: String }, eksiBaslik: { type: String } },
      validate(node) {
        const lists = node.children.filter((c) => c.type === "list");
        if (lists.length !== 2) {
          return [{ id: "arti-eksi", level: "error", message: "{% arti-eksi %} içinde tam 2 liste olmalı (önce artılar, sonra eksiler)." }];
        }
        return [];
      },
    },
    adimlar: {
      render: "Steps",
      validate(node) {
        if (!node.children.some((c) => c.type === "list" && c.attributes.ordered)) {
          return [{ id: "adimlar", level: "error", message: "{% adimlar %} içinde numaralı liste (1. 2. 3.) olmalı." }];
        }
        return [];
      },
    },
    ilgili: {
      render: "InlineRelated",
      selfClosing: true,
      attributes: { yol: { type: String, required: true } },
    },
    sss: { render: "FaqSlot", selfClosing: true },
    "alisveris-cta": { render: "ShoppingCtaSlot", selfClosing: true },
    "beden-tablosu": {
      render: "SizeChartTable",
      selfClosing: true,
      attributes: { id: { type: String, required: true } },
    },
    /** Marka tablolarından türetilen karşılaştırma (src/lib/size-core.ts > buildComparison). Elle tablo yazılmaz. */
    "beden-karsilastirma": {
      render: "SizeComparison",
      selfClosing: true,
      attributes: {
        gender: { type: String, required: true, matches: ["kadin", "erkek"] },
        measurementType: { type: String, required: true, matches: ["body", "garment"] },
        olcu: { type: String, required: true },
        size: { type: String },
        sizes: { type: String },
        value: { type: Number },
        tolerans: { type: Number },
        values: { type: String },
        charts: { type: String },
        productType: { type: String },
        cevre: { type: Boolean },
        baslik: { type: String },
        /** "olcu" (varsayılan): ölçü öncelikli kartlar; "marka": marka öncelikli (amacı marka karşılaştırması olan sayfalar) */
        gorunum: { type: String, matches: ["olcu", "marka"] },
      },
    },
    /**
     * Filtreli marka dizini CTA'sı: "52 bedeni doğrulanmış markaları gör" + build'de hesaplanan en çok 5 marka önizlemesi.
     * {% marka-filtresi cinsiyet="kadin" beden="52" kategori="elbise" /%}
     */
    "marka-filtresi": {
      render: "BrandFilterCta",
      selfClosing: true,
      attributes: {
        cinsiyet: { type: String, required: true, matches: ["kadin", "erkek"] },
        beden: { type: String, required: true },
        kategori: { type: String },
      },
    },
    /** Pantolon kalıbı çizimi + etiket (src/components/illustrations/fits.tsx). */
    kalip: {
      render: "FitFigure",
      selfClosing: true,
      attributes: {
        silo: { type: String, required: true, matches: ["kadin", "erkek"] },
        fit: { type: String, required: true },
        baslik: { type: String },
      },
      validate(node) {
        const { silo, fit } = node.attributes as { silo?: string; fit?: string };
        if (silo && fit && !isFitKey(silo, fit)) {
          const keys = (FIT_KEYS as Record<string, readonly string[]>)[silo] ?? [];
          return [{ id: "kalip-bilinmeyen", level: "error", message: `{% kalip %}: "${fit}" ${silo} için tanımlı değil. Geçerli: ${keys.join(", ")}` }];
        }
        return [];
      },
    },
    /** Kalıp ızgarası: fits="mom,palazzo,wide-leg" (virgülle). */
    kaliplar: {
      render: "FitGrid",
      selfClosing: true,
      attributes: {
        silo: { type: String, required: true, matches: ["kadin", "erkek"] },
        fits: { type: String, required: true },
        baslik: { type: String },
      },
      validate(node) {
        const { silo, fits } = node.attributes as { silo?: string; fits?: string };
        if (!silo || !fits) return [];
        const list = fits.split(",").map((f) => f.trim()).filter(Boolean);
        const bad = list.filter((f) => !isFitKey(silo, f));
        const errs = [];
        if (!list.length) errs.push({ id: "kaliplar-bos", level: "error" as const, message: "{% kaliplar %}: fits boş olamaz." });
        if (bad.length) {
          const keys = (FIT_KEYS as Record<string, readonly string[]>)[silo] ?? [];
          errs.push({ id: "kaliplar-bilinmeyen", level: "error" as const, message: `{% kaliplar %}: ${bad.join(", ")} ${silo} için tanımlı değil. Geçerli: ${keys.join(", ")}` });
        }
        return errs;
      },
    },
  },
};

/** Gövde + satır içi alanlar için ortak transform. Döndürülen ağaç JSON-serileştirilebilir. */
export function transformMarkdoc(ast: Node) {
  return Markdoc.transform(ast, markdocConfig);
}

export { Markdoc };

/**
 * İçerik boru hattı (mimari §7.4).
 *   tsx scripts/build-content.ts          → doğrula + src/generated/* ve public/search-index.json yaz
 *   tsx scripts/build-content.ts --check  → yalnız doğrula (npm run validate)
 * Hata varsa çıkış kodu 1 (build başlamaz). Uyarılar build'i durdurmaz.
 */
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import type { Node } from "@markdoc/markdoc";
import { z } from "zod";
import {
  AuthorSchema,
  COLLECTIONS,
  type Collection,
  HomepageSchema,
  SiteSettingsSchema,
  SizeChartSchema,
} from "../src/content/schema";
import { buildComparison, FOOT_BODY_ONLY_FIELDS, FOOTWEAR_FIELDS, FRESHNESS_DAYS, GARMENT_ONLY_FIELDS, isFootwear, RANGE_FIELDS, specFromAttrs } from "../src/lib/size-core";
import { checkLanguage } from "./check-language";
import { Markdoc, markdocConfig, nodeText, transformMarkdoc } from "../src/content/markdoc.config";
import type { AuthorEntry, ContentIndex, DocMeta, RouteEntry, TocItem } from "../src/lib/content-types";
import { buildRouteManifest, computePath } from "../src/lib/routes-core";
import { normalizeTr } from "../src/lib/search-normalize";
import {
  CATEGORIES,
  categoryLabel,
  type GenderSilo,
  LANDING_PATHS,
  RESERVED_SEGMENTS,
  SILO_ARTICLE_SECTIONS,
  SIZE_LANDING_PATTERN,
} from "../src/lib/taxonomy";

const ROOT = path.resolve(__dirname, "..");
const CONTENT = process.env.CONTENT_DIR ? path.resolve(process.env.CONTENT_DIR) : path.join(ROOT, "content");
const GENERATED = path.join(ROOT, "src", "generated");
const PUBLIC = path.join(ROOT, "public");
const CHECK_ONLY = process.argv.includes("--check");
const QUIET = process.argv.includes("--quiet");
const TODAY = new Date().toISOString().slice(0, 10);

const errors: string[] = [];
const warnings: string[] = [];
const err = (file: string, msg: string) => errors.push(`${file} → ${msg}`);
const warn = (file: string, msg: string) => warnings.push(`${file} → ${msg}`);
const rel = (p: string) => path.relative(ROOT, p);

function zodIssues(file: string, e: z.ZodError) {
  for (const i of e.issues) err(file, `${i.path.join(".") || "(kök)"}: ${i.message}`);
}

function readYaml(file: string): unknown {
  try {
    return YAML.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    err(rel(file), `YAML okunamadı: ${(e as Error).message}`);
    return undefined;
  }
}

/**
 * Keystatic boş alanları "" / null / { src: null } olarak yazabilir: şemadan önce temizlenir.
 * Anlamlı null'lar (doğrulanamayan marka/kumaş alanları) korunur.
 */
const NULL_OK = new Set(["website", "country", "sizeRange", "priceSegment", "fitNotes", "origin", "stretch", "breathability", "warmth", "wrinkle", "washMaxC", "tumbleDry", "iron", "online", "stores", "email", "ga4Id", "editorialEmail"]);
function cleanEmpty(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(cleanEmpty).filter((x) => x !== undefined);
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    if ("src" in o && (o.src === null || o.src === "" || o.src === undefined)) return undefined;
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(o)) {
      if (val === "") continue;
      if (val === null && !NULL_OK.has(k)) continue;
      const c = cleanEmpty(val);
      if (c !== undefined) out[k] = c;
    }
    return out;
  }
  return v;
}

function splitFrontmatter(src: string): { fm: string; body: string } | null {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return null;
  return { fm: m[1], body: m[2] };
}

// ---------- 1. Ayarlar, yazarlar, tablolar ----------
const settingsRaw = readYaml(path.join(CONTENT, "ayarlar", "site.yaml"));
const settingsParsed = SiteSettingsSchema.safeParse(cleanEmpty(settingsRaw));
if (!settingsParsed.success) zodIssues("content/ayarlar/site.yaml", settingsParsed.error);
const settings = settingsParsed.success ? settingsParsed.data : (null as never);

const homeRaw = readYaml(path.join(CONTENT, "ayarlar", "anasayfa.yaml"));
const homeParsed = HomepageSchema.safeParse(cleanEmpty(homeRaw));
if (!homeParsed.success) zodIssues("content/ayarlar/anasayfa.yaml", homeParsed.error);
const homepage = homeParsed.success ? homeParsed.data : (null as never);

function listDir(dir: string): string[] {
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => !f.startsWith(".")).sort() : [];
}

const authors: AuthorEntry[] = [];
for (const f of listDir(path.join(CONTENT, "yazarlar"))) {
  if (!f.endsWith(".yaml")) continue;
  const id = f.replace(/\.yaml$/, "");
  const r = AuthorSchema.safeParse(cleanEmpty(readYaml(path.join(CONTENT, "yazarlar", f))));
  if (!r.success) zodIssues(`content/yazarlar/${f}`, r.error);
  else authors.push({ ...r.data, id, path: `/yazar/${id}` });
}
const authorIds = new Set(authors.map((a) => a.id));

const sizeCharts: ContentIndex["sizeCharts"] = [];
/** Keystatic boş aralıkları {min: null} / {} yazabilir: eksik aralık silinir, yalnız min ya da max varsa tek değer sayılır. */
function cleanChart(raw: unknown): unknown {
  const c = cleanEmpty(raw) as Record<string, unknown> | undefined;
  if (!c || !Array.isArray(c.rows)) return c;
  if (c.kind === "donusum") for (const k of ["measurementType", "measurementTypeVerified", "partialRows", "unit", "fitType", "heightNote", "heightRange", "fieldLabels"]) delete c[k];
  if (c.heightRange && typeof (c.heightRange as { min?: unknown }).min !== "number") delete c.heightRange;
  c.rows = (c.rows as Record<string, unknown>[]).map((row) => {
    const r = { ...row };
    for (const f of RANGE_FIELDS) {
      const v = r[f] as { min?: number; max?: number } | undefined;
      if (v === undefined) continue;
      const min = typeof v.min === "number" ? v.min : undefined;
      const max = typeof v.max === "number" ? v.max : undefined;
      if (min === undefined && max === undefined) delete r[f];
      else r[f] = { min: min ?? max, max: max ?? min };
    }
    if (r.equivalents && !Object.keys(r.equivalents as object).length) delete r.equivalents;
    return r;
  });
  return c;
}
const daysSince = (iso: string) => (Date.parse(TODAY) - Date.parse(iso)) / 864e5;

for (const f of listDir(path.join(CONTENT, "beden-tablolari"))) {
  if (!f.endsWith(".yaml")) continue;
  const id = f.replace(/\.yaml$/, "");
  const file = `content/beden-tablolari/${f}`;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) err(file, `dosya adı (id) slug olmalı: "${id}"`);
  const r = SizeChartSchema.safeParse(cleanChart(readYaml(path.join(CONTENT, "beden-tablolari", f))));
  if (!r.success) {
    zodIssues(file, r.error);
    continue;
  }
  const c = r.data;
  if (!c.sources.some((s) => s.url === c.sourceUrl)) err(file, "sourceUrl, sources listesinde de yer almalı");
  if (c.lastVerifiedAt > TODAY) err(file, "lastVerifiedAt gelecekte olamaz");
  if (daysSince(c.lastVerifiedAt) > FRESHNESS_DAYS) warn(file, `lastVerifiedAt ${c.lastVerifiedAt}: 6 aydan eski; tabloyu kaynağından yeniden doğrulayın`);
  if (c.sourceType === "generic" && !c.notes.some((n) => /genel|yaklaşık/i.test(n)))
    err(file, 'sourceType generic: notes içinde tablonun "genel / yaklaşık" bir referans olduğu yazılmalı');
  if (c.kind === "donusum") {
    const keys = new Set(c.columns.map((x) => x.key));
    c.rows.forEach((row, i) => {
      for (const k of Object.keys(row.systems)) if (!keys.has(k)) err(file, `rows[${i}].systems.${k}: columns içinde yok`);
      if (!row.systems[c.columns[0].key]) err(file, `rows[${i}]: ilk sütun (${c.columns[0].key}) boş olamaz`);
    });
    if (c.highlight && !keys.has(c.highlight)) err(file, `highlight "${c.highlight}" columns içinde yok`);
  } else {
    if (!c.measurementTypeVerified && !c.notes.length) err(file, "measurementTypeVerified: false ise notes içinde belirsizlik açıklanmalı");
    // Cinsiyete göre göğüs alanı: kadında bust, erkekte chest (Beden Kuralları 3)
    const wrong = c.gender === "kadin" ? "chest" : "bust";
    const foot = isFootwear(c);
    c.rows.forEach((row, i) => {
      // Ayakkabı ve giyim alanları karışmaz; ayak ölçüleri yalnız vücut (ayak) ölçüsü tablosunda
      for (const x of RANGE_FIELDS) {
        if (!row[x]) continue;
        const isFoot = FOOTWEAR_FIELDS.includes(x);
        if (foot && !isFoot) err(file, `rows[${i}].${x}: ayakkabı tablosunda (productType ${c.productType}) giyim ölçüsü kullanılamaz`);
        if (!foot && isFoot) err(file, `rows[${i}].${x}: yalnız ayakkabı/çizme tablolarında (productType ayakkabi | cizme) kullanılır`);
        if (FOOT_BODY_ONLY_FIELDS.includes(x) && c.measurementType !== "body") err(file, `rows[${i}].${x}: ayak ölçüsü yalnız measurementType: body tablosunda`);
      }
      if (row.widthLetter && !foot) err(file, `rows[${i}].widthLetter: yalnız ayakkabı tablolarında`);
      if (row[wrong]) err(file, `rows[${i}].${wrong}: ${c.gender} tablosunda ${wrong === "chest" ? "bust" : "chest"} kullanılır`);
      if (!row.numericSize && !row.letterSize) err(file, `rows[${i}]: numericSize veya letterSize zorunlu`);
      for (const g of GARMENT_ONLY_FIELDS) if (row[g] && c.measurementType !== "garment") err(file, `rows[${i}].${g}: yalnız ürün (garment) ölçüsü tablolarında kullanılır`);
      // Ölçüsüz satır yalnız markanın harf ↔ numara eşlemesini taşıyorsa kabul edilir (ör. Koton 2XL = 44)
      if (!RANGE_FIELDS.some((x) => row[x]) && !row.waistInch && !(row.numericSize && row.letterSize)) err(file, `rows[${i}]: hiç ölçü yok`);
    });
    if (c.highlight && !c.rows.some((row) => row[c.highlight!])) err(file, `highlight "${c.highlight}" hiçbir satırda yok`);
    // Bedene göre artan: her alan satır satır küçülmemeli (kaynak hatalarını yakalar).
    // Ayakkabı genişlik tablolarında (widthLetter) her genişlik harfi kendi içinde artmalı.
    if (!c.inconsistencyNote) {
      const groups = [...new Set(c.rows.map((r) => r.widthLetter ?? ""))];
      for (const g of groups) {
        for (const fld of RANGE_FIELDS) {
          let prev: { min: number; max: number } | undefined;
          c.rows.forEach((row, i) => {
            if ((row.widthLetter ?? "") !== g) return;
            const v = row[fld];
            if (!v) return;
            if (prev && (v.min < prev.min || v.max < prev.max))
              err(file, `rows[${i}].${fld}: değer önceki satırdan küçük (${v.min}–${v.max}); kaynağı kontrol edin veya inconsistencyNote ekleyin`);
            prev = v;
          });
        }
      }
      // Aynı numarada genişlik harfi büyüdükçe genişlik küçülmemeli (sıra kaynaktaki gibi: dar → geniş)
      const bySize = new Map<string, { min: number; max: number }[]>();
      c.rows.forEach((row) => {
        if (row.widthLetter && row.numericSize && row.footWidth) bySize.set(row.numericSize, [...(bySize.get(row.numericSize) ?? []), row.footWidth]);
      });
      for (const [size, ws] of bySize)
        for (let k = 1; k < ws.length; k++) if (ws[k].min < ws[k - 1].min) err(file, `numara ${size}: genişlik harfleri dar → geniş sırada değil ya da değerler azalıyor`);
    }
  }
  sizeCharts.push({ ...c, id });
}
const chartIds = new Set(sizeCharts.map((c) => c.id));

// ---------- 2. Belgeler ----------
type Work = {
  meta: DocMeta;
  file: string;
  ast: Node;
  links: { href: string; where: string }[];
  images: { src: string; alt?: string }[];
  chartRefs: string[];
  comparisons: { attrs: Record<string, unknown>; where: string }[];
  bodyLinkCount: number;
};
const works: Work[] = [];
const rawStatusDraft = new Set<string>();

function walkCollect(ast: Node, where: string, w: Pick<Work, "links" | "images" | "chartRefs" | "comparisons">) {
  for (const n of ast.walk()) {
    if (n.type === "link") w.links.push({ href: String(n.attributes.href), where });
    if (n.type === "image") w.images.push({ src: String(n.attributes.src), alt: n.attributes.alt as string | undefined });
    if (n.type === "tag" && n.tag === "ilgili") w.links.push({ href: String(n.attributes.yol), where: `${where} {% ilgili %}` });
    if (n.type === "tag" && n.tag === "beden-tablosu") w.chartRefs.push(String(n.attributes.id));
    if (n.type === "tag" && n.tag === "beden-karsilastirma") w.comparisons.push({ attrs: n.attributes, where: `${where} satır ${(n.lines?.[0] ?? 0) + 1}` });
  }
}

function parseMd(src: string, file: string, where: string): Node {
  const ast = Markdoc.parse(src);
  for (const e of Markdoc.validate(ast, markdocConfig)) {
    const msg = `${where} satır ${(e.lines?.[0] ?? 0) + 1}: ${e.error.message}`;
    if (e.error.level === "error" || e.error.level === "critical") err(file, msg);
    else warn(file, msg);
  }
  return ast;
}

function words(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

const INLINE_FIELDS = ["shortAnswer", "intro", "whyItWorks", "plusSizeNotes"] as const;

for (const collection of Object.keys(COLLECTIONS) as Collection[]) {
  const { type, schema } = COLLECTIONS[collection];
  for (const id of listDir(path.join(CONTENT, collection))) {
    const dir = path.join(CONTENT, collection, id);
    if (!fs.statSync(dir).isDirectory()) {
      err(`content/${collection}/${id}`, "her belge kendi klasöründe olmalı: content/" + collection + "/{id}/index.mdoc");
      continue;
    }
    const file = `content/${collection}/${id}/index.mdoc`;
    const abs = path.join(dir, "index.mdoc");
    if (!fs.existsSync(abs)) {
      // Boş klasör (git'te zaten yer almaz) içerik sayılmaz; içinde başka dosya varsa hata
      if (fs.readdirSync(dir).filter((f) => !f.startsWith(".")).length === 0) warn(file, "boş klasör atlandı");
      else err(file, "index.mdoc bulunamadı");
      continue;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) err(file, `klasör adı (id) slug olmalı: "${id}"`);
    const split = splitFrontmatter(fs.readFileSync(abs, "utf8"));
    if (!split) {
      err(file, "frontmatter bulunamadı (dosya '---' ile başlamalı ve '---' ile kapanmalı)");
      continue;
    }
    let fmRaw: Record<string, unknown>;
    try {
      fmRaw = (YAML.parse(split.fm) ?? {}) as Record<string, unknown>;
    } catch (e) {
      err(file, `frontmatter YAML hatası: ${(e as Error).message}`);
      continue;
    }
    if (fmRaw.status === "draft") {
      rawStatusDraft.add(`${collection}/${id}`);
      continue;
    }
    const parsed = (schema as z.ZodType).safeParse(cleanEmpty(fmRaw));
    if (!parsed.success) {
      zodIssues(file, parsed.error as z.ZodError);
      continue;
    }
    const fm = parsed.data as Record<string, unknown> & z.infer<(typeof COLLECTIONS)["makaleler"]["schema"]>;
    const w: Work = {
      meta: null as never,
      file,
      ast: parseMd(split.body, file, "gövde"),
      links: [],
      images: [],
      chartRefs: [],
      comparisons: [],
      bodyLinkCount: 0,
    };
    walkCollect(w.ast, "gövde", w);
    w.bodyLinkCount = w.links.filter((l) => l.href.startsWith("/")).length;

    // TOC + başlık id'leri
    const toc: TocItem[] = [];
    const headingIds: string[] = [];
    let hasFaqSlot = false;
    let hasCtaSlot = false;
    for (const n of w.ast.walk()) {
      if (n.type === "heading") {
        const text = nodeText(n);
        const hid = (transformMarkdoc(n) as { attributes: { id: string } }).attributes.id;
        if (headingIds.includes(hid)) err(file, `aynı başlık iki kez: "${text}" (anchor çakışır)`);
        headingIds.push(hid);
        const level = n.attributes.level as number;
        if (level <= 3) toc.push({ id: hid, text, level });
      }
      if (n.type === "tag" && n.tag === "sss") hasFaqSlot = true;
      if (n.type === "tag" && n.tag === "alisveris-cta") hasCtaSlot = true;
    }

    // Satır içi alanlar
    const inline: Record<string, unknown> = {};
    let text = nodeText(w.ast);
    for (const f of INLINE_FIELDS) {
      const v = fm[f as keyof typeof fm];
      if (typeof v === "string") {
        const ast = parseMd(v, file, f);
        walkCollect(ast, f, w);
        inline[f] = transformMarkdoc(ast);
        text += " " + nodeText(ast);
      }
    }
    const faq = (fm.faq ?? []).map((item, i) => {
      const ast = parseMd(item.a, file, `faq[${i}].a`);
      walkCollect(ast, `faq[${i}].a`, w);
      const aText = nodeText(ast).trim();
      text += " " + item.q + " " + aText;
      return { q: item.q, a: transformMarkdoc(ast), aText };
    });
    const wc = words(text);

    const silo = fm.silo;
    const { segment, hub, subtopic, section, ...rest } = fm as Record<string, unknown>;
    void section;
    const label =
      (fm.breadcrumbTitle as string | undefined) ??
      (fm as Record<string, unknown>).menuLabel ??
      (fm as Record<string, unknown>).name ??
      fm.title;
    w.meta = {
      key: `${collection}/${id}`,
      collection,
      id,
      type,
      path: "",
      silo,
      status: fm.status === "archived" ? "archived" : "published",
      title: fm.title,
      label: String(label),
      excerpt: fm.excerpt,
      author: fm.author,
      reviewedBy: fm.reviewedBy,
      publishedAt: fm.publishedAt,
      updatedAt: fm.updatedAt,
      featuredImage: fm.featuredImage,
      topics: fm.topics,
      tags: fm.tags,
      sizes: fm.sizes,
      fabrics: fm.fabrics,
      brands: fm.brands,
      related: fm.related,
      hub: (collection === "hublar" ? id : (hub as string | undefined)) ?? undefined,
      category: collection === "hublar" ? ((fm as Record<string, unknown>).category as string) : undefined,
      subtopic: subtopic as string | undefined,
      faq,
      sources: fm.sources,
      primaryKeyword: fm.primaryKeyword,
      seo: fm.seo,
      shoppingCta: fm.shoppingCta,
      index: fm.seo.index && !fm.seo.canonical,
      readingMinutes: Math.max(1, Math.ceil(wc / 200)),
      wordCount: wc,
      toc,
      headingIds,
      hasFaqSlot,
      hasCtaSlot,
      inline,
      fm: { ...rest, segment, section },
      relatedAuto: [],
    };
    void segment;
    works.push(w);
  }
}

// ---------- 3. Hub ilişkileri ve URL'ler ----------
const hubs = new Map(works.filter((w) => w.meta.collection === "hublar").map((w) => [w.meta.id, w.meta]));
for (const w of works) {
  const m = w.meta;
  if (m.collection === "hublar") {
    const cat = m.category!;
    if (m.silo === "ortak") err(w.file, "hub silosu kadin veya erkek olmalı");
    else {
      if (!CATEGORIES[m.silo as GenderSilo].some((c) => c.key === cat))
        err(w.file, `"${cat}" ${m.silo} taksonomisinde yok (src/lib/taxonomy.ts)`);
      if (m.id !== `${m.silo}-${cat}`) err(w.file, `hub klasör adı "${m.silo}-${cat}" olmalı (şu an "${m.id}")`);
    }
  }
  if (m.hub && m.collection !== "hublar") {
    const h = hubs.get(m.hub);
    if (!h) err(w.file, `hub "${m.hub}" bulunamadı (content/hublar/${m.hub})`);
    else {
      if (h.silo !== m.silo) err(w.file, `hub silosu (${h.silo}) belge silosundan (${m.silo}) farklı`);
      m.category = h.category;
      const subs = (h.fm.subtopics as { key: string }[] | undefined) ?? [];
      if (m.subtopic && !subs.some((s) => s.key === m.subtopic)) err(w.file, `subtopic "${m.subtopic}" hub'da tanımlı değil`);
    }
  }
  if (m.collection === "makaleler") {
    const sec = m.fm.section as string | undefined;
    const siloSection = !!sec && (SILO_ARTICLE_SECTIONS as readonly string[]).includes(sec);
    if (m.silo !== "ortak" && !m.hub && !siloSection) err(w.file, "kadin/erkek makalede hub (ya da section: ayakkabi) zorunlu");
    if (m.silo !== "ortak" && m.hub && sec) err(w.file, "hub'a bağlı makalede section kullanılmaz");
    if (m.silo !== "ortak" && sec && !siloSection) err(w.file, `section "${sec}" yalnız ortak makalede kullanılır (kadin/erkek: ${SILO_ARTICLE_SECTIONS.join(", ")})`);
    if (m.silo === "ortak" && m.hub) err(w.file, "ortak makalede hub olamaz");
    if (m.silo === "ortak" && siloSection) err(w.file, `section "${sec}" yalnız kadin/erkek makalede kullanılır`);
  }
  if (m.hub && ["kombinler", "alisveris-rehberleri", "trendler", "gundem", "markalar", "kumaslar", "sayfalar"].includes(m.collection))
    err(w.file, "bu koleksiyonda hub alanı kullanılmaz");
  if (m.collection === "kombinler" && m.silo === "ortak") err(w.file, "kombin silosu ortak olamaz (kadin veya erkek)");
  if (m.hub && m.silo === "ortak") err(w.file, "ortak belge bir giyim hub'ına bağlanamaz");

  const seg = m.fm.segment as string | undefined;
  if (seg) {
    if (RESERVED_SEGMENTS.includes(seg)) err(w.file, `segment "${seg}" rezerve`);
    if (m.hub && m.silo !== "ortak" && CATEGORIES[m.silo as GenderSilo].some((c) => c.key === seg))
      err(w.file, `segment "${seg}" bir kategori adı; hub ile karışır`);
    if (m.hub && m.silo !== "ortak" && SIZE_LANDING_PATTERN[m.silo as GenderSilo].test(seg) && m.type !== "SIZE_GUIDE")
      err(w.file, `segment "${seg}" beden landing deseni; yalnız beden-rehberleri koleksiyonunda kullanılabilir`);
    if (m.silo !== "ortak" && seg.startsWith("buyuk-beden-")) warn(w.file, `segment "buyuk-beden-" ile başlıyor; URL zaten bağlam veriyor`);
  }
  if (["kombinler", "alisveris-rehberleri", "trendler", "gundem"].includes(m.collection) || m.collection === "makaleler" || m.collection === "beden-rehberleri" || m.collection === "stil-rehberleri") {
    if (!seg) err(w.file, "segment zorunlu");
  }
  if (m.collection === "sayfalar" && m.id !== m.fm.key) err(w.file, `sayfa klasör adı key ile aynı olmalı ("${m.fm.key}")`);
  if (m.collection === "markalar" || m.collection === "kumaslar") {
    if (RESERVED_SEGMENTS.includes(m.id)) err(w.file, `id "${m.id}" rezerve`);
  }
  try {
    m.path = computePath({ collection: m.collection, id: m.id, silo: m.silo, fm: { ...m.fm, hub: m.hub } }, (hid) => hubs.get(hid)?.category);
  } catch (e) {
    err(w.file, (e as Error).message);
    m.path = `/__hatali/${m.key}`;
  }
}

// ---------- 4. Manifest + benzersizlik ----------
const docs = works.map((w) => w.meta);
const manifest: RouteEntry[] = buildRouteManifest(docs, authors);
const byPath = new Map<string, RouteEntry>();
for (const e of manifest) {
  if (byPath.has(e.path)) {
    const other = byPath.get(e.path)!;
    err(`URL ${e.path}`, `iki kayıt aynı URL'yi üretiyor: ${other.ref?.collection}/${other.ref?.id} ve ${e.ref?.collection}/${e.ref?.id}`);
  }
  byPath.set(e.path, e);
}
const docByPath = new Map(docs.map((d) => [d.path, d]));
const docByKey = new Map(docs.map((d) => [d.key, d]));

function uniq(field: string, get: (d: DocMeta) => string | undefined, normalize = (s: string) => s.trim().toLocaleLowerCase("tr")) {
  const seen = new Map<string, string>();
  for (const w of works) {
    const v = get(w.meta);
    if (!v) continue;
    const k = normalize(v);
    if (seen.has(k)) err(w.file, `${field} benzersiz olmalı; "${v}" zaten ${seen.get(k)} içinde`);
    else seen.set(k, w.file);
  }
}
uniq("title", (d) => d.title);
uniq("seo.title", (d) => d.seo.title ?? d.title);
uniq("seo.description", (d) => d.seo.description);
uniq("primaryKeyword", (d) => d.primaryKeyword, normalizeTr);

// ---------- 5. Ref, link, görsel, kalite kontrolleri ----------
const brandIds = new Set(docs.filter((d) => d.collection === "markalar").map((d) => d.id));
const fabricIds = new Set(docs.filter((d) => d.collection === "kumaslar").map((d) => d.id));
for (const c of sizeCharts) if (c.brand && !brandIds.has(c.brand)) err(`content/beden-tablolari/${c.id}.yaml`, `brand "${c.brand}" content/markalar/ içinde yok`);
const FORBIDDEN = [/çok yakında/i, /yapım aşamasında/i, /coming soon/i, /lorem ipsum/i, /\bTODO\b/, /href="#"/];
const shoppingDomain = settings?.shoppingCta?.domain ?? "buyukbedengiyim.com";
const ctaLabels = new Map<string, number>();
const anchorPairs = new Map<string, number>();

function checkInternal(file: string, href: string, where: string, from?: DocMeta) {
  const [p, hash] = href.split("#");
  const targetPath = p === "" ? from?.path ?? "" : p;
  if (!byPath.has(targetPath)) {
    err(file, `${where}: kırık iç link ${href} (manifest'te yok – hedef yayımlanmadan link verilmez)`);
    return;
  }
  if (hash) {
    const target = docByPath.get(targetPath);
    const ids = new Set([...(target?.headingIds ?? []), "sss", "kaynaklar", "icindekiler"]);
    if (!ids.has(hash)) err(file, `${where}: ${href} anchor "#${hash}" hedef sayfada yok`);
  }
  if (from && from.silo !== "ortak") {
    const t = byPath.get(targetPath)!;
    if (t.silo !== "ortak" && t.silo !== from.silo) warn(file, `${where}: ${from.silo} belgesinden ${t.silo} silosuna gövde linki (${href})`);
  }
}

function checkLink(file: string, href: string, where: string, from?: DocMeta) {
  if (!href || href === "#") return err(file, `${where}: boş veya '#' link`);
  if (/^javascript:/i.test(href)) return err(file, `${where}: javascript: link yasak`);
  if (/^https?:\/\/(www\.)?buyukbeden\.net/i.test(href)) return err(file, `${where}: mutlak iç link (${href}); '/…' biçiminde yazın`);
  if (/buyukbedengiyim/i.test(href) && !settings?.shoppingCta?.enabled)
    return err(file, `${where}: ${shoppingDomain} linki yalnız shoppingCta alanıyla ve bayrak açıkken verilebilir`);
  if (href.startsWith("/") || href.startsWith("#")) return checkInternal(file, href, where, from);
  if (/^mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(href)) return;
  try {
    const u = new URL(href);
    if (u.protocol !== "https:" && u.protocol !== "http:") err(file, `${where}: desteklenmeyen link protokolü ${href}`);
    else if (!u.hostname.includes(".")) err(file, `${where}: geçersiz dış link ${href}`);
    else if (u.protocol === "http:") warn(file, `${where}: dış link https olmalı (${href})`);
  } catch {
    err(file, `${where}: geçersiz link "${href}" (iç linkler / ile başlar, dış linkler https:// ile)`);
  }
}

function checkImage(file: string, img: { src: string; alt?: string }, where: string) {
  if (!img.src.startsWith("/images/")) return err(file, `${where}: görsel /images/ altında olmalı (${img.src})`);
  if (!fs.existsSync(path.join(PUBLIC, img.src))) err(file, `${where}: görsel dosyası yok: public${img.src}`);
  if (!img.alt || img.alt.trim().length < 5) err(file, `${where}: görsel alt metni en az 5 karakter olmalı (${img.src})`);
}

function hasTechnicalFabricValues(fm: Record<string, unknown>) {
  const care = (fm.care ?? {}) as Record<string, unknown>;
  return (
    ["stretch", "breathability", "warmth", "wrinkle", "origin"].some((k) => fm[k] != null) ||
    care.washMaxC != null ||
    care.tumbleDry != null ||
    care.iron != null
  );
}

const publishedPaths = new Set(manifest.map((e) => e.path));
const childrenOfHub = new Map<string, DocMeta[]>();
for (const d of docs) if (d.hub && d.collection !== "hublar") childrenOfHub.set(d.hub, [...(childrenOfHub.get(d.hub) ?? []), d]);

for (const w of works) {
  const m = w.meta;
  const f = w.file;
  const fm = m.fm as Record<string, unknown>;
  if (!authorIds.has(m.author)) err(f, `author "${m.author}" content/yazarlar/ içinde yok`);
  if (m.reviewedBy) {
    const r = authors.find((a) => a.id === m.reviewedBy);
    if (!r) err(f, `reviewedBy "${m.reviewedBy}" yok`);
    else if (r.isTeam) err(f, "reviewedBy yalnız gerçek kişi olabilir (ekip hesabı değil)");
  }
  for (const b of m.brands) if (!brandIds.has(b)) err(f, `brands: "${b}" content/markalar/ içinde yok`);
  for (const x of m.fabrics) if (!fabricIds.has(x)) err(f, `fabrics: "${x}" content/kumaslar/ içinde yok`);
  if (m.updatedAt < m.publishedAt) err(f, "updatedAt, publishedAt'ten önce olamaz");
  if (m.publishedAt > TODAY || m.updatedAt > TODAY) err(f, "tarih gelecekte olamaz");
  if (!m.primaryKeyword && m.index) {
    if (m.collection === "sayfalar") {
      if (fm.kind === "landing") warn(f, "primaryKeyword önerilir");
    } else err(f, "indekslenen belgede primaryKeyword zorunlu");
  }
  const shortAnswerRequired = ["ARTICLE", "SIZE_GUIDE", "STYLE_GUIDE", "FABRIC_GUIDE", "SHOPPING_GUIDE"];
  if (shortAnswerRequired.includes(m.type) && !m.inline.shortAnswer) err(f, "shortAnswer zorunlu (sayfanın üstündeki kısa cevap)");

  // Metin yasakları
  const allText = fs.readFileSync(path.join(CONTENT, f.replace(/^content\//, "")), "utf8");
  for (const re of FORBIDDEN) if (re.test(allText)) err(f, `yasak ifade: ${re.source}`);
  // Blok etiketler kendi satırında açılıp kapanmalı; aynı satırda kalırsa paragraf içine düşer (<p><aside>) → hydration hatası
  if (/^\{% (not|arti-eksi|adimlar)\b[^%]*%\}[^\n]*\S/m.test(allText))
    err(f, "blok etiket ({% not %}, {% arti-eksi %}, {% adimlar %}) açılışından sonra içerik yeni satırda başlamalı");
  const ctaFree = allText.replace(/shoppingCta:[\s\S]*?(?=\n\S|\n---)/, "");
  if (/buyukbedengiyim/i.test(ctaFree) && !settings?.shoppingCta?.enabled)
    err(f, `${shoppingDomain} adı içerikte geçemez (site sahibi açana kadar görünmez)`);

  // Linkler
  for (const l of w.links) {
    checkLink(f, l.href, l.where, m);
    if (l.href.startsWith("/")) {
      const k = `${l.href}`;
      anchorPairs.set(k, (anchorPairs.get(k) ?? 0) + 1);
    }
  }
  for (const r of m.related) {
    checkLink(f, r, "related");
    const t = byPath.get(r.split("#")[0]);
    if (t && m.silo !== "ortak" && t.silo !== "ortak" && t.silo !== m.silo) err(f, `related: karşı silo hedefi yasak (${r})`);
    if (r === m.path) err(f, "related kendini gösteremez");
  }
  for (const key of ["featured", "sizeGuides", "relatedGuides"]) {
    for (const p of (fm[key] as string[] | undefined) ?? []) checkLink(f, p, key);
  }
  if (w.bodyLinkCount < 3 && m.collection !== "sayfalar") warn(f, `gövdede ${w.bodyLinkCount} bağlamsal iç link var (en az 3 önerilir)`);

  // Görseller
  for (const img of w.images) checkImage(f, img, "gövde görseli");
  if (m.featuredImage) checkImage(f, m.featuredImage, "featuredImage");
  if (m.seo.ogImage) checkImage(f, m.seo.ogImage, "seo.ogImage");
  if (fm.image) checkImage(f, fm.image as { src: string; alt?: string }, "image");

  // Beden tabloları
  const charts = [...((fm.sizeCharts as string[] | undefined) ?? []), ...w.chartRefs];
  for (const c of charts) if (!chartIds.has(c)) err(f, `beden tablosu "${c}" content/beden-tablolari/ içinde yok`);
  // Türetilmiş karşılaştırmalar: aynı ölçü türü, kaynaklı satır, boş olmamalı
  const comparisons = [
    ...((fm.sizeComparisons as Record<string, unknown>[] | undefined) ?? []).map((attrs, i) => ({ attrs, where: `sizeComparisons[${i}]` })),
    ...w.comparisons,
  ];
  for (const cmp of comparisons) {
    const { spec, error } = specFromAttrs(cmp.attrs);
    if (!spec) {
      err(f, `${cmp.where}: beden karşılaştırması: ${error}`);
      continue;
    }
    for (const e of buildComparison(sizeCharts, spec).errors) err(f, `${cmp.where}: beden karşılaştırması: ${e}`);
    charts.push(`karsilastirma:${cmp.where}`);
  }

  // CTA
  if (m.shoppingCta) {
    try {
      const host = new URL(m.shoppingCta.url).hostname.replace(/^www\./, "");
      if (host !== shoppingDomain) err(f, `shoppingCta.url alan adı ${shoppingDomain} olmalı`);
    } catch {
      err(f, "shoppingCta.url geçersiz");
    }
    ctaLabels.set(m.shoppingCta.label, (ctaLabels.get(m.shoppingCta.label) ?? 0) + 1);
  }

  // Redirect
  for (const r of (fm.redirectFrom as string[] | undefined) ?? []) {
    if (publishedPaths.has(r)) err(f, `redirectFrom ${r} yayımlı bir URL; yönlendirilemez`);
  }

  // Tür bazlı
  if (m.collection === "hublar") {
    const kids = childrenOfHub.get(m.id) ?? [];
    if (m.wordCount < 600 && kids.length < 3)
      err(f, `ince hub: gövde ${m.wordCount} kelime ve ${kids.length} yayımlı alt içerik (gerekli: ≥600 kelime veya ≥3 alt içerik)`);
    for (const rh of (fm.relatedHubs as string[]) ?? []) {
      const h = hubs.get(rh);
      if (!h) err(f, `relatedHubs: "${rh}" yok`);
      else if (h.silo !== m.silo) err(f, `relatedHubs: "${rh}" başka silo`);
    }
  }
  if (m.collection === "beden-rehberleri" && m.hub) {
    if (m.wordCount < 900) err(f, `beden landing'i en az 900 kelime olmalı (şu an ${m.wordCount})`);
    if (charts.length < 1) err(f, "beden landing'inde en az 1 kaynaklı beden tablosu (sizeCharts) olmalı");
    if (m.faq.length < 3) err(f, "beden landing'inde en az 3 SSS olmalı");
    if (w.bodyLinkCount < 5) err(f, "beden landing'inde en az 5 iç link olmalı");
    if (m.sizes.length < 1) err(f, "beden landing'inde sizes zorunlu");
  }
  if ((m.collection === "beden-rehberleri" || charts.length) && charts.length && m.sources.length === 0) {
    // tablo kaynakları tablo dosyasında; belgede ek kaynak önerilir
    warn(f, "sources boş; tablo kaynakları sayfada gösterilir, metindeki iddialar için ayrıca kaynak ekleyin");
  }
  if (m.collection === "markalar") {
    if (fm.sizeRange && m.sources.length === 0) err(f, "sizeRange yazıldıysa sources zorunlu");
    if (fm.priceSegment && m.sources.length === 0 && !fm.priceBasis) err(f, "priceSegment için sources veya priceBasis zorunlu");
    for (const a of (fm.alternatives as string[]) ?? []) if (!brandIds.has(a)) err(f, `alternatives: "${a}" yok`);
    if (fm.logo) checkImage(f, fm.logo as { src: string; alt?: string }, "logo");
    for (const e of (fm.socialEmbeds as { platform: string; url: string }[]) ?? []) {
      const host = new URL(e.url).hostname.replace(/^www\./, "");
      if (e.platform === "instagram" && host !== "instagram.com") err(f, `socialEmbeds: instagram url'si instagram.com olmalı (${e.url})`);
      if (e.platform === "youtube" && !["youtube.com", "youtu.be"].includes(host)) err(f, `socialEmbeds: youtube url'si youtube.com/youtu.be olmalı (${e.url})`);
    }
    if (daysSince(fm.lastVerifiedAt as string) > FRESHNESS_DAYS) warn(f, "lastVerifiedAt 6 aydan eski; marka bilgilerini yeniden doğrulayın");
  }
  if (m.collection === "kumaslar" && hasTechnicalFabricValues(fm) && m.sources.length === 0)
    err(f, "kumaş teknik değerleri (esneme, bakım vb.) için sources zorunlu");
  if (m.collection === "kombinler") {
    for (const p of (fm.pieces as { hub?: string; fabric?: string }[]) ?? []) {
      if (p.hub) {
        const h = hubs.get(p.hub);
        if (!h) err(f, `pieces.hub "${p.hub}" yok`);
        else if (h.silo !== m.silo) err(f, `pieces.hub "${p.hub}" başka silo`);
      }
      if (p.fabric && !fabricIds.has(p.fabric)) err(f, `pieces.fabric "${p.fabric}" yok`);
    }
  }
  if (m.collection === "alisveris-rehberleri") {
    for (const p of (fm.picks as { brand: string }[]) ?? []) if (!brandIds.has(p.brand)) err(f, `picks.brand "${p.brand}" yok`);
  }
  if (m.collection === "trendler" && fm.validUntil && (fm.validUntil as string) < TODAY && m.status !== "archived")
    warn(f, "validUntil geçti; trend arşivlenmeli (status: archived)");
  const density = (allText.match(/büyük beden/gi)?.length ?? 0) / Math.max(1, m.wordCount / 120);
  if (density > 1.2) warn(f, `"büyük beden" ifadesi sık (her 120 kelimede ${density.toFixed(1)}); doğal dil kullanın`);
  if (m.faq.length === 1) warn(f, "tek SSS sorusu var; FAQPage şeması için en az 2 gerekir");
}
for (const [label, n] of ctaLabels) if (n > 3) errors.push(`shoppingCta.label "${label}" ${n} kez kullanılmış (en fazla 3)`);
for (const [href, n] of anchorPairs) if (n > 12) warnings.push(`(site) ${href} hedefine ${n} gövde linki var; anchor çeşitliliğine dikkat`);

// Ana sayfa / ayarlar
if (homepage) {
  for (const s of homepage.sections) {
    for (const p of s.items) checkLink("content/ayarlar/anasayfa.yaml", p, `sections.${s.key}.items`);
    if (s.key === "cok-okunanlar" && s.enabled && (!s.items.length || !settings?.analytics.ga4Id))
      err("content/ayarlar/anasayfa.yaml", "cok-okunanlar gerçek trafik verisi (analytics) olmadan açılamaz");
    if (s.key === "buyukbedengiyim-secimler" && s.enabled && !settings?.shoppingCta.homepageSection)
      err("content/ayarlar/anasayfa.yaml", "buyukbedengiyim-secimler bölümü site bayrağı kapalıyken açılamaz");
  }
  for (const [k, p] of Object.entries(homepage.megaMenuFeatured)) if (p) checkLink("content/ayarlar/anasayfa.yaml", p, `megaMenuFeatured.${k}`);
  const homeImgs = [homepage.hero.kadin.image, homepage.hero.erkek.image, homepage.sizeBand.kadinImage, homepage.sizeBand.erkekImage];
  for (const img of homeImgs) if (img) checkImage("content/ayarlar/anasayfa.yaml", img, "görsel");
}

// Redirect döngüsü / çakışması
const redirects: { source: string; destination: string }[] = [];
const redirectSources = new Set<string>();
for (const d of docs) {
  for (const r of (d.fm.redirectFrom as string[] | undefined) ?? []) {
    if (redirectSources.has(r)) errors.push(`redirectFrom ${r} birden fazla belgede`);
    redirectSources.add(r);
    redirects.push({ source: r, destination: d.path });
  }
}
// Yayımlı hub'ların kısa biçimleri: /kadin/elbise → /kadin/giyim/elbise (+ yaygın takma adlar)
const HUB_ALIASES: Record<string, string[]> = { tisort: ["tshirt", "t-shirt"], "ev-giyimi": ["pijama"] };
for (const h of hubs.values()) {
  const cat = h.category!;
  if (RESERVED_SEGMENTS.includes(cat)) errors.push(`kategori "${cat}" rezerve bir bölüm adıyla çakışıyor (kısa yönlendirme üretilemez)`);
  for (const alias of [cat, ...(HUB_ALIASES[cat] ?? [])]) {
    const source = `/${h.silo}/${alias}`;
    if (byPath.has(source)) {
      errors.push(`kısa yönlendirme ${source} yayımlı bir sayfayla çakışıyor`);
      continue;
    }
    if (redirectSources.has(source)) continue;
    redirectSources.add(source);
    redirects.push({ source, destination: h.path });
  }
}
for (const r of redirects) if (redirectSources.has(r.destination)) errors.push(`redirect zinciri: ${r.source} → ${r.destination}`);
for (const r of redirects) if (!byPath.has(r.destination)) errors.push(`redirect hedefi yayımlı değil: ${r.source} → ${r.destination}`);

// Rota aileleri ve statik sayfa içerikleri
const appDir = path.join(ROOT, "src", "app", "(site)");
if (docs.some((d) => d.collection === "gundem") && !fs.existsSync(path.join(appDir, "gundem")))
  errors.push("gundem içeriği var ama src/app/(site)/gundem rotası yok (ilk haberle klasör eklenir)");
const families: [string, RegExp][] = [
  ["/kadin/giyim/[kategori]", /^\/kadin\/giyim\/[^/]+$/],
  ["/kadin/giyim/[kategori]/[slug]", /^\/kadin\/giyim\/[^/]+\/[^/]+$/],
  ["/erkek/giyim/[kategori]", /^\/erkek\/giyim\/[^/]+$/],
  ["/erkek/giyim/[kategori]/[slug]", /^\/erkek\/giyim\/[^/]+\/[^/]+$/],
  ["/kadin/beden-rehberi/[slug]", /^\/kadin\/beden-rehberi\/[^/]+$/],
  ["/erkek/beden-rehberi/[slug]", /^\/erkek\/beden-rehberi\/[^/]+$/],
  ["/kadin/stil/[slug]", /^\/kadin\/stil\/[^/]+$/],
  ["/erkek/stil/[slug]", /^\/erkek\/stil\/[^/]+$/],
  ["/kadin/kombinler/[slug]", /^\/kadin\/kombinler\/[^/]+$/],
  ["/erkek/kombinler/[slug]", /^\/erkek\/kombinler\/[^/]+$/],
  ["/kadin/ayakkabi/[slug]", /^\/kadin\/ayakkabi\/[^/]+$/],
  ["/erkek/ayakkabi/[slug]", /^\/erkek\/ayakkabi\/[^/]+$/],
  ["/beden-rehberi/[slug]", /^\/beden-rehberi\/[^/]+$/],
  ["/stil/[slug]", /^\/stil\/[^/]+$/],
  ["/kumas-rehberi/[slug]", /^\/kumas-rehberi\/[^/]+$/],
  ["/marka/[slug]", /^\/marka\/[^/]+$/],
  ["/alisveris-rehberi/[slug]", /^\/alisveris-rehberi\/[^/]+$/],
  ["/trendler/[slug]", /^\/trendler\/[^/]+$/],
  ["/rehberler/[slug]", /^\/rehberler\/[^/]+$/],
];
const emptyFamilies = families.filter(([, re]) => !docs.some((d) => re.test(d.path))).map(([n]) => n);
if (emptyFamilies.length && !QUIET)
  warnings.push(`(bilgi) henüz içeriği olmayan rota aileleri (404 döner, link verilmez): ${emptyFamilies.join(", ")}`);
const missingLandings = Object.keys(LANDING_PATHS).filter((k) => !docs.some((d) => d.collection === "sayfalar" && d.id === k));
if (missingLandings.length) warnings.push(`(bilgi) içeriği olmayan statik sayfalar (menüde görünmez): ${missingLandings.join(", ")}`);

// ---------- 6. Related skorlama (§8.2) ----------
const MONTH = 30 * 864e5;
function relatedFor(s: DocMeta): string[] {
  const sHub = s.hub ? hubs.get(s.hub) : undefined;
  const sRelHubs = new Set((sHub?.fm.relatedHubs as string[] | undefined) ?? []);
  const manual = new Set(s.related);
  const scored: { d: DocMeta; tier: number; score: number }[] = [];
  for (const c of docs) {
    if (c.key === s.key || c.status === "archived" || !c.index || c.collection === "sayfalar" || manual.has(c.path)) continue;
    let tier: number;
    if (s.silo === "ortak") tier = c.silo === "ortak" ? 0 : 1;
    else if (c.silo === s.silo) tier = 0;
    else if (c.silo === "ortak") tier = 1;
    else continue;
    let score = 0;
    if (s.hub && c.hub === s.hub) score += 40;
    const cHub = c.hub ? hubs.get(c.hub) : undefined;
    if (c.hub && (sRelHubs.has(c.hub) || ((cHub?.fm.relatedHubs as string[] | undefined) ?? []).includes(s.hub ?? ""))) score += 25;
    score += 12 * Math.min(3, c.topics.filter((t) => s.topics.includes(t)).length);
    score += 15 * c.brands.filter((b) => s.brands.includes(b)).length;
    score += 15 * c.fabrics.filter((b) => s.fabrics.includes(b)).length;
    if (c.collection === "markalar" && s.brands.includes(c.id)) score += 15;
    if (c.collection === "kumaslar" && s.fabrics.includes(c.id)) score += 15;
    score += 12 * c.sizes.filter((b) => s.sizes.includes(b)).length;
    const union = new Set([...s.tags, ...c.tags]);
    if (union.size) score += 20 * (c.tags.filter((t) => s.tags.includes(t)).length / union.size);
    if (c.type !== s.type) score += 5;
    if (Date.parse(TODAY) - Date.parse(c.updatedAt) > 18 * MONTH) score -= 10;
    if (score < 15) continue;
    scored.push({ d: c, tier, score });
  }
  const cmp = (a: (typeof scored)[number], b: (typeof scored)[number]) =>
    b.score - a.score || b.d.updatedAt.localeCompare(a.d.updatedAt) || a.d.title.localeCompare(b.d.title, "tr");
  const t0 = scored.filter((x) => x.tier === 0).sort(cmp);
  let t1 = scored.filter((x) => x.tier === 1).sort(cmp);
  if (s.silo === "ortak") {
    const k = t1.filter((x) => x.d.silo === "kadin");
    const e = t1.filter((x) => x.d.silo === "erkek");
    t1 = [];
    for (let i = 0; i < Math.max(k.length, e.length); i++) {
      if (k[i]) t1.push(k[i]);
      if (e[i]) t1.push(e[i]);
    }
  }
  return [...t0, ...t1].slice(0, 16).map((x) => x.d.key);
}
for (const d of docs) d.relatedAuto = relatedFor(d);

// ---------- 7. Arama indeksi ----------
function searchGroup(d: DocMeta): string {
  switch (d.type) {
    case "SIZE_GUIDE":
      return "beden";
    case "STYLE_GUIDE":
      return "stil";
    case "OUTFIT_GUIDE":
      return "kombin";
    case "BRAND_GUIDE":
      return "marka";
    case "FABRIC_GUIDE":
      return "kumas";
    case "SHOPPING_GUIDE":
      return "alisveris";
    case "TREND":
    case "NEWS":
      return "trend";
    default:
      if (d.silo === "kadin") return "kadin";
      if (d.silo === "erkek") return "erkek";
      return "rehber";
  }
}
const searchDocs = docs
  .filter((d) => d.index && !(d.collection === "sayfalar" && d.fm.kind === "yasal"))
  .map((d) => {
    const fm = d.fm as Record<string, unknown>;
    const k = [
      ...d.tags.map((t) => t.replace(/-/g, " ")),
      ...d.sizes,
      d.category && d.silo !== "ortak" ? categoryLabel(d.silo as GenderSilo, d.category) : "",
      d.silo === "kadin" ? "kadın" : d.silo === "erkek" ? "erkek" : "",
      ...d.fabrics.map((x) => docByKey.get(`kumaslar/${x}`)?.label ?? x),
      ...d.brands.map((x) => docByKey.get(`markalar/${x}`)?.label ?? x),
      ...(((fm.aliases as string[]) ?? []) as string[]),
      d.primaryKeyword ?? "",
    ]
      .filter(Boolean)
      .join(" ");
    return {
      id: d.key,
      t: d.title,
      u: d.path,
      g: searchGroup(d),
      s: d.silo,
      x: d.excerpt.length > 140 ? d.excerpt.slice(0, 137).trimEnd() + "…" : d.excerpt,
      k,
      h: d.toc.filter((t) => t.level === 2).map((t) => t.text).join(" · "),
    };
  });

// ---------- 7b. Kesinlik dili (Beden Kuralları 7) – uyarı düzeyi, dosya:satır ----------
for (const hit of checkLanguage(CONTENT)) warnings.push(`${hit.file}:${hit.line} → kesinlik dili "${hit.match}" (${hit.rule}); "çoğu markada", "yaklaşık", "markaya göre değişir" gibi yazın`);

// ---------- 8. Çıktı ----------
const summary: Record<string, number> = {};
for (const d of docs) summary[d.collection] = (summary[d.collection] ?? 0) + 1;
if (!QUIET || errors.length) {
  console.log(`İçerik: ${docs.length} belge, ${authors.length} yazar, ${sizeCharts.length} beden tablosu, ${manifest.length} URL`);
  console.log("  " + Object.entries(summary).map(([k, v]) => `${k}: ${v}`).join(" · "));
  if (rawStatusDraft.size) console.log(`  taslak (üretilmedi): ${rawStatusDraft.size}`);
}
if (warnings.length && !QUIET) {
  console.log(`\nUyarılar (${warnings.length}):`);
  for (const w of warnings) console.log("  ⚠ " + w);
}
if (errors.length) {
  console.error(`\nHatalar (${errors.length}):`);
  for (const e of errors) console.error("  ✖ " + e);
  console.error("\nİçerik doğrulaması başarısız. Hataları düzeltip tekrar çalıştırın.");
  process.exit(1);
}

if (!CHECK_ONLY) {
  fs.rmSync(GENERATED, { recursive: true, force: true });
  fs.mkdirSync(path.join(GENERATED, "bodies"), { recursive: true });
  const loaders: string[] = [];
  for (const w of works) {
    const fileName = `${w.meta.collection}__${w.meta.id}.json`;
    fs.writeFileSync(path.join(GENERATED, "bodies", fileName), JSON.stringify(transformMarkdoc(w.ast)));
    loaders.push(`  ${JSON.stringify(w.meta.key)}: () => import("./bodies/${fileName}"),`);
  }
  fs.writeFileSync(
    path.join(GENERATED, "bodies.ts"),
    `// Otomatik üretildi (scripts/build-content.ts). Elle düzenlemeyin.\nexport const bodyLoaders: Record<string, () => Promise<{ default: unknown }>> = {\n${loaders.join("\n")}\n};\n`,
  );
  const index: ContentIndex = {
    generatedAt: new Date().toISOString(),
    settings,
    homepage,
    docs,
    authors,
    sizeCharts,
    manifest,
    redirects,
  };
  fs.writeFileSync(path.join(GENERATED, "content-index.json"), JSON.stringify(index));
  fs.writeFileSync(path.join(GENERATED, "redirects.json"), JSON.stringify(redirects, null, 2));
  fs.writeFileSync(path.join(PUBLIC, "search-index.json"), JSON.stringify(searchDocs));
  if (!QUIET) console.log(`\nYazıldı: src/generated/ (${works.length} gövde), public/search-index.json (${searchDocs.length} kayıt)`);
} else if (!QUIET) {
  console.log("\nDoğrulama başarılı (--check: dosya yazılmadı).");
}

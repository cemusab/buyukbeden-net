/**
 * İçerik şeması (zod v4) – mimari.md §6. `scripts/build-content.ts` her dosyayı bununla doğrular.
 * Ayrıntılı, kopyala-yapıştır örnekler: docs/icerik-format.md
 */
import { z } from "zod";
import {
  ALL_CATEGORY_KEYS,
  LANDING_KEYS,
  LANDING_KINDS,
  OCCASION_KEYS,
  SEASONS,
  SHARED_ARTICLE_SECTIONS,
  SILOS,
  SOURCE_TYPES,
  TOPICS,
} from "../lib/taxonomy";
import {
  CHART_SOURCE_TYPES,
  COUNTRY_SYSTEMS,
  EQUIV_KEYS,
  FIT_TYPES,
  GENDERS,
  MEASUREMENT_TYPES,
  PRODUCT_TYPES,
  RANGE_FIELDS,
  STRETCH_LEVELS,
} from "../lib/size-core";

export const Silo = z.enum(SILOS);
export const Slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "yalnız küçük harf a-z, 0-9 ve tire (Türkçe karakter yok)")
  .max(60);
export const IsoDate = z.iso.date("tarih YYYY-AA-GG biçiminde olmalı");
export const Path = z
  .string()
  .regex(/^\/[a-z0-9\-/]*(#[a-z0-9-]+)?$/, "iç yol '/' ile başlamalı, küçük harf ve tire içermeli");
export const Topic = z.enum(TOPICS);
export const CategoryKey = z.enum(ALL_CATEGORY_KEYS as [string, ...string[]]);
export const Season = z.enum(SEASONS);

export const Source = z.object({
  url: z.url(),
  type: z.enum(SOURCE_TYPES),
  label: z.string().min(3),
  checkedAt: IsoDate,
});
export type Source = z.infer<typeof Source>;

export const Image = z.object({
  src: z.string().startsWith("/images/", "görsel yolu /images/ ile başlamalı"),
  alt: z.string().min(5),
  credit: z.string().optional(),
  /** true → görselin altında "Yapay zekâ ile üretilmiş görsel" notu gösterilir (şeffaflık) */
  aiGenerated: z.boolean().default(false),
});
export type Image = z.infer<typeof Image>;

export const Faq = z.object({ q: z.string().min(8).max(160), a: z.string().min(20) });

export const Seo = z.object({
  title: z.string().max(60).optional(),
  description: z.string().min(70).max(160),
  canonical: Path.optional(),
  index: z.boolean().default(true),
  ogImage: Image.optional(),
});

export const ShoppingCta = z.object({
  enabled: z.boolean().default(false),
  url: z.url(),
  label: z.string().min(10),
  context: z.string().max(200).optional(),
  verifiedAt: IsoDate,
});

const Status = z.enum(["draft", "published", "archived"]);

/** Tüm editoryal belgelerin ortak alanları (§6.1). */
const base = {
  status: Status.default("published"),
  title: z.string().min(10).max(110),
  breadcrumbTitle: z.string().max(40).optional(),
  excerpt: z.string().min(80).max(220),
  shortAnswer: z.string().min(40).max(400).optional(),
  author: Slug,
  reviewedBy: Slug.optional(),
  publishedAt: IsoDate,
  updatedAt: IsoDate,
  featuredImage: Image.optional(),
  silo: Silo,
  topics: z.array(Topic).min(1).max(4),
  tags: z.array(Slug).max(10).default([]),
  sizes: z.array(z.string()).max(8).default([]),
  fabrics: z.array(Slug).default([]),
  brands: z.array(Slug).default([]),
  related: z.array(Path).max(8).default([]),
  faq: z.array(Faq).max(10).default([]),
  sources: z.array(Source).default([]),
  primaryKeyword: z.string().min(3).optional(),
  seo: Seo,
  shoppingCta: ShoppingCta.optional(),
  redirectFrom: z.array(Path).default([]),
};

const segmentDoc = { ...base, segment: Slug, hub: Slug.optional(), subtopic: Slug.optional() };

export const ArticleSchema = z.strictObject({
  ...segmentDoc,
  section: z.enum(SHARED_ARTICLE_SECTIONS).optional(),
});

/* ---------------- Beden tabloları (docs/beden-veri-migrasyonu.md, CLAUDE.md Beden Kuralları) ---------------- */
export const SizeRange = z
  .strictObject({ min: z.number().positive(), max: z.number().positive() })
  .refine((r) => r.min <= r.max, "min, max'tan büyük olamaz");

const rangeFields = Object.fromEntries(RANGE_FIELDS.map((f) => [f, SizeRange.optional()])) as Record<
  (typeof RANGE_FIELDS)[number],
  z.ZodOptional<typeof SizeRange>
>;

export const SizeChartRowSchema = z.strictObject({
  /** Tablonun countrySystem'indeki numara (ör. "48", "UK 20" için "20", çift numara "52/54") */
  numericSize: z.string().min(1).optional(),
  /** Harf beden, kaynakta yazdığı gibi (ör. "XXL", "4X", "1X") */
  letterSize: z.string().min(1).optional(),
  /** Kaynağın aynı satırda verdiği diğer karşılıklar */
  equivalents: z.partialRecord(z.enum(EQUIV_KEYS), z.string().min(1)).optional(),
  ...rangeFields,
  /** Jean bel bedeni (W, inç) ve boy (L, inç) – etiket değeri, ölçü değil */
  waistInch: z.number().positive().optional(),
  lengthInch: z.number().positive().optional(),
  /** Esneme (elastan/likra oranına göre, kaynaklı) */
  stretch: z.enum(STRETCH_LEVELS).nullable().optional(),
  note: z.string().min(3).optional(),
});

const chartBase = {
  title: z.string().min(5),
  caption: z.string().min(5),
  gender: z.enum(GENDERS),
  /** content/markalar/{id} (marka sayfası varsa) */
  brand: Slug.optional(),
  /** Tabloda görünen ad (marka ya da referans tablonun adı) */
  brandName: z.string().min(2),
  productType: z.enum(PRODUCT_TYPES),
  countrySystem: z.enum(COUNTRY_SYSTEMS),
  sourceType: z.enum(CHART_SOURCE_TYPES),
  /** Tablonun alındığı ana kaynak; sources içinde de yer almalı */
  sourceUrl: z.url(),
  lastVerifiedAt: IsoDate,
  /** true → "Yaklaşık değerler; markaya ve ürüne göre değişir" notu */
  approximate: z.boolean().default(false),
  notes: z.array(z.string()).default([]),
  /** Kaynaktaki tablo kendi içinde tutarsızsa (sayılar satır satır artmıyorsa) açıklama zorunlu; yoksa validate hatası */
  inconsistencyNote: z.string().min(10).optional(),
  sources: z.array(Source).min(1, "kaynaksız beden tablosu yayımlanamaz"),
};

export const SizeMeasureChartSchema = z.strictObject({
  ...chartBase,
  kind: z.literal("olcu"),
  /** body = kişinin vücut ölçüsü, garment = kıyafetin kendi ölçüsü. Asla karıştırılmaz. */
  measurementType: z.enum(MEASUREMENT_TYPES),
  /** Kaynak ölçü türünü açıkça yazmıyorsa false: tabloda uyarı rozeti, Beden Bulucu'ya girmez, notes zorunlu */
  measurementTypeVerified: z.boolean().default(true),
  /** Kaynağın yalnız bazı satırları aktarıldıysa true (aradaki bedenler eksik): Beden Bulucu'ya girmez */
  partialRows: z.boolean().default(false),
  unit: z.enum(["cm", "inch"]).default("cm"),
  fitType: z.enum(FIT_TYPES).optional(),
  heightNote: z.string().min(5).optional(),
  /** Tablonun tanımlandığı boy aralığı (cm); Beden Bulucu kısa/uzun boy notu için */
  heightRange: SizeRange.optional(),
  /** Alan başlığını kaynağın terimiyle değiştirmek için (ör. hip: "Basen (alçak kalça)") */
  fieldLabels: z.partialRecord(z.enum(RANGE_FIELDS), z.string().min(2)).optional(),
  highlight: z.enum(RANGE_FIELDS).optional(),
  rows: z.array(SizeChartRowSchema).min(1),
});

export const SizeConversionChartSchema = z.strictObject({
  ...chartBase,
  kind: z.literal("donusum"),
  columns: z.array(z.object({ key: z.string().min(1), label: z.string().min(1) })).min(2).max(10),
  highlight: z.string().optional(),
  rows: z.array(z.strictObject({ systems: z.record(z.string(), z.string()) })).min(1),
});

export const SizeChartSchema = z.discriminatedUnion("kind", [SizeMeasureChartSchema, SizeConversionChartSchema]);

/** Türetilmiş karşılaştırma ({% beden-karsilastirma %} ile aynı öznitelikler; virgüllü listeler metin) */
export const SizeComparisonSchema = z.strictObject({
  gender: z.enum(GENDERS),
  measurementType: z.enum(MEASUREMENT_TYPES),
  olcu: z.string().min(3),
  size: z.string().optional(),
  sizes: z.string().optional(),
  value: z.number().optional(),
  tolerans: z.number().optional(),
  values: z.string().optional(),
  charts: z.string().optional(),
  productType: z.enum(PRODUCT_TYPES).optional(),
  cevre: z.boolean().optional(),
  baslik: z.string().min(5).optional(),
});

export const SizeGuideSchema = z.strictObject({
  ...segmentDoc,
  sizeSystem: z.array(z.enum(["TR", "EU", "UK", "US", "IT", "harf"])).default([]),
  sizeCharts: z.array(Slug).default([]),
  /** Sayfa üstünde gösterilen, marka tablolarından türetilen karşılaştırmalar */
  sizeComparisons: z.array(SizeComparisonSchema).default([]),
  measurementSteps: z
    .array(
      z.object({
        part: z.enum(["gogus", "bel", "basen", "omuz", "ic-bacak", "kol", "yaka", "boy"]),
        text: z.string().min(10),
      }),
    )
    .default([]),
});

export const StyleGuideSchema = z.strictObject({
  ...segmentDoc,
  bodyFocus: z.array(z.string()).default([]),
  occasion: z.array(z.enum(OCCASION_KEYS)).default([]),
});

export const OutfitSchema = z.strictObject({
  ...segmentDoc,
  season: z.array(Season).min(1),
  occasion: z.array(z.enum(OCCASION_KEYS)).default([]),
  pieces: z
    .array(
      z.object({
        role: z.enum(["ust", "alt", "tek-parca", "dis-giyim", "ayakkabi", "aksesuar"]),
        name: z.string().min(3),
        hub: Slug.optional(),
        fabric: Slug.optional(),
        color: z.string().optional(),
        alternatives: z.array(z.string()).default([]),
      }),
    )
    .min(2),
  whyItWorks: z.string().min(40),
  fitFor: z.string().optional(),
});

export const ShoppingGuideSchema = z.strictObject({
  ...segmentDoc,
  criteria: z.array(z.object({ label: z.string().min(3), description: z.string().min(10) })).min(3),
  picks: z
    .array(
      z.object({
        brand: Slug,
        why: z.string().min(20),
        bestFor: z.string().min(5),
        caveats: z.string().optional(),
        sources: z.array(Source).min(1),
      }),
    )
    .default([]),
});

export const TrendSchema = z.strictObject({
  ...segmentDoc,
  season: z.string().min(4),
  validUntil: IsoDate.optional(),
});

export const NewsSchema = z.strictObject({ ...segmentDoc, eventDate: IsoDate });

export const HubSchema = z.strictObject({
  ...base,
  category: CategoryKey,
  order: z.number().int().default(100),
  menuLabel: z.string().max(30).optional(),
  /** Kategori kartı görseli (yoksa kıyafet çizimi) */
  image: Image.optional(),
  intro: z.string().min(40).max(600),
  subtopics: z
    .array(z.object({ key: Slug, label: z.string().min(3), description: z.string().optional() }))
    .default([]),
  featured: z.array(Path).max(6).default([]),
  sizeGuides: z.array(Path).default([]),
  relatedHubs: z.array(Slug).default([]),
});

export const LandingSchema = z.strictObject({
  ...base,
  topics: z.array(Topic).max(4).default([]),
  excerpt: z.string().min(40).max(220),
  key: z.enum(LANDING_KEYS as [string, ...string[]]),
  kind: z.enum(LANDING_KINDS).default("landing"),
  menuLabel: z.string().max(30).optional(),
  intro: z.string().min(20).max(600).optional(),
  featured: z.array(Path).max(12).default([]),
});

const Level = z.enum(["dusuk", "orta", "yuksek"]).nullable().default(null);

export const BrandSchema = z.strictObject({
  ...base,
  name: z.string().min(2),
  website: z.url().nullable().default(null),
  country: z.string().nullable().default(null),
  international: z.boolean().default(false),
  genders: z.array(z.enum(["kadin", "erkek"])).min(1),
  sizeRange: z
    .object({
      kadin: z.object({ from: z.string(), to: z.string(), system: z.enum(["TR", "EU", "harf"]) }).optional(),
      erkek: z.object({ from: z.string(), to: z.string(), system: z.enum(["TR", "EU", "harf"]) }).optional(),
    })
    .nullable()
    .default(null),
  priceSegment: z.enum(["ekonomik", "orta", "ust", "premium"]).nullable().default(null),
  priceBasis: z.string().optional(),
  categories: z.array(CategoryKey).default([]),
  fitNotes: z.string().nullable().default(null),
  availabilityTR: z
    .object({ online: z.boolean().nullable(), stores: z.boolean().nullable(), notes: z.string().optional() })
    .default({ online: null, stores: null }),
  highlights: z.array(z.string()).default([]),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  alternatives: z.array(Slug).default([]),
  relatedGuides: z.array(Path).default([]),
  /** Marka logosu (yalnız izinli/resmi dosya); yoksa tipografik kart */
  logo: Image.optional(),
  /** Resmi hesap gömmeleri – tıklayana kadar üçüncü taraf isteği yapılmaz */
  socialEmbeds: z
    .array(z.object({ platform: z.enum(["instagram", "youtube"]), url: z.url(), title: z.string().optional() }))
    .max(6)
    .default([]),
  unverified: z.array(z.string()).default([]),
  lastVerifiedAt: IsoDate,
});

export const FabricSchema = z.strictObject({
  ...base,
  name: z.string().min(2),
  aliases: z.array(z.string()).default([]),
  kind: z.enum(["lif", "kumas-yapisi", "apre"]),
  origin: z.enum(["dogal", "yari-sentetik", "sentetik", "karisim"]).nullable().default(null),
  feel: z.string().optional(),
  stretch: Level,
  breathability: Level,
  warmth: Level,
  wrinkle: Level,
  seasons: z.array(Season).default([]),
  care: z
    .object({
      washMaxC: z.number().nullable().default(null),
      tumbleDry: z.boolean().nullable().default(null),
      iron: z.enum(["dusuk", "orta", "yuksek"]).nullable().default(null),
      notes: z.string().optional(),
    })
    .default({ washMaxC: null, tumbleDry: null, iron: null }),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  uses: z.array(CategoryKey).default([]),
  plusSizeNotes: z.string().min(20),
});

export const AuthorSchema = z.strictObject({
  name: z.string().min(3),
  isTeam: z.boolean().default(false),
  role: z.string().min(3),
  bio: z.string().min(60).max(600),
  avatar: Image.optional(),
  sameAs: z.array(z.url()).default([]),
  expertiseTopics: z.array(Topic).default([]),
});

export const SiteSettingsSchema = z.strictObject({
  siteName: z.string(),
  siteUrl: z.url(),
  tagline: z.string(),
  defaultOgImage: Image.optional(),
  organization: z.object({
    name: z.string(),
    legalName: z.string().optional(),
    sameAs: z.array(z.url()).default([]),
    email: z.email().nullable().default(null),
  }),
  shoppingCta: z.object({
    enabled: z.boolean().default(false),
    domain: z.string().default("buyukbedengiyim.com"),
    homepageSection: z.boolean().default(false),
  }),
  popularSearches: z.array(z.string()).max(8).default([]),
  analytics: z.object({ ga4Id: z.string().nullable().default(null) }).default({ ga4Id: null }),
  editorialEmail: z.email().nullable().default(null),
});

export const HOME_SECTION_KEYS = [
  "kadin",
  "erkek",
  "bedenini-tani",
  "editorun-sectikleri",
  "cok-okunanlar",
  "stil",
  "kombinler",
  "trendler",
  "marka-dosyalari",
  "kumas",
  "alisveris",
  "yeni-icerikler",
  "temel-rehberler",
  "buyukbedengiyim-secimler",
] as const;

export const HomepageSchema = z.strictObject({
  hero: z.object({
    title: z.string().min(10),
    lead: z.string().min(20),
    kadin: z.object({ title: z.string(), text: z.string(), cta: z.string(), image: Image.optional() }),
    erkek: z.object({ title: z.string(), text: z.string(), cta: z.string(), image: Image.optional() }),
  }),
  /** Orta bant beden rehberi kart görselleri (yoksa ölçü çizimi) */
  sizeBand: z.object({ kadinImage: Image.optional(), erkekImage: Image.optional() }).default({}),
  manifesto: z.object({ title: z.string(), text: z.string() }).optional(),
  sections: z
    .array(
      z.object({
        key: z.enum(HOME_SECTION_KEYS),
        enabled: z.boolean().default(true),
        title: z.string().optional(),
        items: z.array(Path).default([]),
      }),
    )
    .default([]),
  megaMenuFeatured: z.object({ kadin: Path.optional(), erkek: Path.optional() }).default({}),
});

/** Koleksiyon dizini → tür ve şema. */
export const COLLECTIONS = {
  sayfalar: { type: "LANDING", schema: LandingSchema },
  hublar: { type: "CATEGORY_HUB", schema: HubSchema },
  makaleler: { type: "ARTICLE", schema: ArticleSchema },
  "beden-rehberleri": { type: "SIZE_GUIDE", schema: SizeGuideSchema },
  "stil-rehberleri": { type: "STYLE_GUIDE", schema: StyleGuideSchema },
  kombinler: { type: "OUTFIT_GUIDE", schema: OutfitSchema },
  "alisveris-rehberleri": { type: "SHOPPING_GUIDE", schema: ShoppingGuideSchema },
  trendler: { type: "TREND", schema: TrendSchema },
  gundem: { type: "NEWS", schema: NewsSchema },
  markalar: { type: "BRAND_GUIDE", schema: BrandSchema },
  kumaslar: { type: "FABRIC_GUIDE", schema: FabricSchema },
} as const;
export type Collection = keyof typeof COLLECTIONS;
export type DocType = (typeof COLLECTIONS)[Collection]["type"];

export type Landing = z.infer<typeof LandingSchema>;
export type Hub = z.infer<typeof HubSchema>;
export type Article = z.infer<typeof ArticleSchema>;
export type SizeGuide = z.infer<typeof SizeGuideSchema>;
export type StyleGuide = z.infer<typeof StyleGuideSchema>;
export type Outfit = z.infer<typeof OutfitSchema>;
export type ShoppingGuide = z.infer<typeof ShoppingGuideSchema>;
export type Trend = z.infer<typeof TrendSchema>;
export type News = z.infer<typeof NewsSchema>;
export type Brand = z.infer<typeof BrandSchema>;
export type Fabric = z.infer<typeof FabricSchema>;
export type SizeChart = z.infer<typeof SizeChartSchema>;
export type SizeChartRow = z.infer<typeof SizeChartRowSchema>;
export type SizeComparison = z.infer<typeof SizeComparisonSchema>;
export type Author = z.infer<typeof AuthorSchema>;
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;
export type Homepage = z.infer<typeof HomepageSchema>;

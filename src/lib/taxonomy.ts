/**
 * Sabit taksonomi: silolar, kategori key'leri, konu listesi, sayfa (landing) anahtarları.
 * Tek kaynak: içerik şeması, Keystatic seçenekleri, route manifest ve menüler buradan okur.
 * Bu dosya saf TypeScript'tir (server-only değil); build script'i ve istemci de kullanabilir.
 */

export const SILOS = ["kadin", "erkek", "ortak"] as const;
export type Silo = (typeof SILOS)[number];
export type GenderSilo = Exclude<Silo, "ortak">;

export const SILO_LABEL: Record<Silo, string> = { kadin: "Kadın", erkek: "Erkek", ortak: "Ortak" };

export type CategoryDef = { key: string; label: string };

/** Sıra = menü sırası (brief §3). Hub'ı yayımlanmamış kategori menüde görünmez. */
export const CATEGORIES: Record<GenderSilo, readonly CategoryDef[]> = {
  kadin: [
    { key: "elbise", label: "Elbise" },
    { key: "tunik", label: "Tunik" },
    { key: "pantolon", label: "Pantolon" },
    { key: "jean", label: "Jean" },
    { key: "tayt", label: "Tayt" },
    { key: "etek", label: "Etek" },
    { key: "sort", label: "Şort" },
    { key: "tisort", label: "Tişört" },
    { key: "gomlek", label: "Gömlek" },
    { key: "bluz", label: "Bluz" },
    { key: "triko", label: "Triko" },
    { key: "hirka", label: "Hırka" },
    { key: "sweatshirt", label: "Sweatshirt" },
    { key: "ceket", label: "Ceket" },
    { key: "mont", label: "Mont" },
    { key: "kaban", label: "Kaban" },
    { key: "abiye", label: "Abiye" },
    { key: "tesettur", label: "Tesettür" },
    { key: "mayo-hasema", label: "Mayo ve Haşema" },
    { key: "esofman", label: "Eşofman" },
    { key: "spor-giyim", label: "Spor Giyim" },
    { key: "ic-giyim", label: "İç Giyim" },
    { key: "ev-giyimi", label: "Pijama ve Ev Giyimi" },
  ],
  erkek: [
    { key: "tisort", label: "Tişört" },
    { key: "polo", label: "Polo" },
    { key: "gomlek", label: "Gömlek" },
    { key: "pantolon", label: "Pantolon" },
    { key: "jean", label: "Jean" },
    { key: "esofman", label: "Eşofman" },
    { key: "sweatshirt", label: "Sweatshirt" },
    { key: "triko", label: "Triko" },
    { key: "hirka", label: "Hırka" },
    { key: "mont", label: "Mont" },
    { key: "takim-elbise", label: "Takım Elbise" },
    { key: "sort-deniz-sortu", label: "Şort ve Deniz Şortu" },
    { key: "spor-giyim", label: "Spor Giyim" },
    { key: "ic-giyim", label: "İç Giyim" },
    { key: "ev-giyimi", label: "Pijama ve Ev Giyimi" },
  ],
};

export const ALL_CATEGORY_KEYS = Array.from(
  new Set([...CATEGORIES.kadin, ...CATEGORIES.erkek].map((c) => c.key)),
) as string[];

export function categoryLabel(silo: GenderSilo, key: string): string {
  return CATEGORIES[silo].find((c) => c.key === key)?.label ?? key;
}

export const TOPICS = [
  "beden-olcu",
  "kalip",
  "kumas",
  "stil",
  "kombin",
  "marka",
  "alisveris",
  "toptan-pazar",
  "trend",
  "bakim",
  "ozel-gun",
  "vucut-tipi",
  "terim",
] as const;
export type Topic = (typeof TOPICS)[number];

export const TOPIC_LABEL: Record<Topic, string> = {
  "beden-olcu": "Beden ve ölçü",
  kalip: "Kalıp",
  kumas: "Kumaş",
  stil: "Stil",
  kombin: "Kombin",
  marka: "Marka",
  alisveris: "Alışveriş",
  "toptan-pazar": "Toptan pazarlar",
  trend: "Trend",
  bakim: "Bakım",
  "ozel-gun": "Özel gün",
  "vucut-tipi": "Vücut tipi",
  terim: "Terim",
};

export const SEASONS = ["ilkbahar", "yaz", "sonbahar", "kis", "4-mevsim"] as const;
export const SEASON_LABEL: Record<(typeof SEASONS)[number], string> = {
  ilkbahar: "İlkbahar",
  yaz: "Yaz",
  sonbahar: "Sonbahar",
  kis: "Kış",
  "4-mevsim": "4 mevsim",
};

/**
 * Durum (occasion) grupları – kombin ve stil içeriklerinde ana gruplama (rapor-notlari §7).
 * Belgede `occasion: ["davet-abiye"]` gibi bu anahtarlar kullanılır; landing'ler bu sırayla gruplar.
 */
export const OCCASIONS = [
  { key: "davet-abiye", label: "Davet ve Abiye", description: "Düğün, nişan, mezuniyet ve özel davetler" },
  { key: "ise-uygun", label: "İşe Uygun", description: "Ofis ve iş toplantıları" },
  { key: "gunluk", label: "Günlük", description: "Gün boyu rahat ve şık" },
  { key: "tatil-deniz", label: "Tatil ve Deniz", description: "Yaz tatili, plaj ve seyahat" },
  { key: "spor-konfor", label: "Spor ve Konfor", description: "Hareket ve rahatlık odaklı" },
] as const;
export const OCCASION_KEYS = OCCASIONS.map((o) => o.key) as [string, ...string[]];

/** Kaynak türleri. kaynaklar-beden.md İngilizce anahtarları ve mimari.md Türkçe anahtarları kabul edilir. */
export const SOURCE_TYPES = [
  "brand-official",
  "standard",
  "regulation",
  "reference",
  "academic",
  "retailer",
  "editorial",
  "stock-photo",
  "resmi-marka",
  "standart",
  "uretici",
  "arastirma",
  "perakende",
  "editoryal-olcum",
  "diger",
] as const;

export const SOURCE_TYPE_LABEL: Record<(typeof SOURCE_TYPES)[number], string> = {
  "brand-official": "Markanın resmi sitesi",
  standard: "Standart",
  regulation: "Mevzuat",
  reference: "Başvuru kaynağı",
  academic: "Akademik",
  retailer: "Perakendeci",
  editorial: "Editoryal",
  "stock-photo": "Stok fotoğraf",
  "resmi-marka": "Markanın resmi sitesi",
  standart: "Standart",
  uretici: "Üretici",
  arastirma: "Araştırma",
  perakende: "Perakendeci",
  "editoryal-olcum": "Editoryal ölçüm",
  diger: "Diğer",
};

/**
 * Statik sayfa anahtarları → URL. `sayfalar/{key}/index.mdoc` içeriği yoksa
 * sayfa manifest'e girmez (link verilmez, rota 404 döner).
 */
export const LANDING_PATHS = {
  kadin: "/kadin",
  erkek: "/erkek",
  "kadin-giyim": "/kadin/giyim",
  "erkek-giyim": "/erkek/giyim",
  "kadin-beden-rehberi": "/kadin/beden-rehberi",
  "erkek-beden-rehberi": "/erkek/beden-rehberi",
  "kadin-stil": "/kadin/stil",
  "erkek-stil": "/erkek/stil",
  "kadin-kombinler": "/kadin/kombinler",
  "erkek-kombinler": "/erkek/kombinler",
  "kadin-ayakkabi": "/kadin/ayakkabi",
  "erkek-ayakkabi": "/erkek/ayakkabi",
  "beden-rehberi": "/beden-rehberi",
  stil: "/stil",
  kombinler: "/kombinler",
  "kumas-rehberi": "/kumas-rehberi",
  markalar: "/markalar",
  "alisveris-rehberi": "/alisveris-rehberi",
  trendler: "/trendler",
  rehberler: "/rehberler",
  hakkimizda: "/hakkimizda",
  iletisim: "/iletisim",
  "editoryal-ilkeler": "/editoryal-ilkeler",
  gizlilik: "/gizlilik",
  "cerez-politikasi": "/cerez-politikasi",
  kvkk: "/kvkk",
} as const;
export type LandingKey = keyof typeof LANDING_PATHS;
export const LANDING_KEYS = Object.keys(LANDING_PATHS) as LandingKey[];

export const LANDING_KINDS = ["landing", "kurumsal", "yasal"] as const;

/** Hiçbir segment/slug bunları alamaz (mimari §4.4.3). */
export const RESERVED_SEGMENTS = [
  "sayfa",
  "etiket",
  "arama",
  "beden-bulucu",
  "api",
  "keystatic",
  "giyim",
  "beden-rehberi",
  "stil",
  "kombinler",
  "ayakkabi",
  "index",
];

/** Ortak (silo dışı) makalelerin yerleşebileceği bölümler. */
export const SHARED_ARTICLE_SECTIONS = ["rehberler", "beden-rehberi", "kumas-rehberi"] as const;
/**
 * Silo (kadın/erkek) makalelerinin giyim hub'ı dışındaki bölümleri: `ayakkabi` → /{silo}/ayakkabi/{segment}.
 * Ayakkabı giyim dışı ayrı bir silo bölümüdür (CLAUDE.md "Ayakkabı"); bölüm landing'i `sayfalar/{silo}-ayakkabi`.
 */
export const SILO_ARTICLE_SECTIONS = ["ayakkabi"] as const;
export const ARTICLE_SECTIONS = [...SHARED_ARTICLE_SECTIONS, ...SILO_ARTICLE_SECTIONS] as const;

/** Ana navigasyon (brief §3) – hedefi manifest'te olmayan öğe gösterilmez. */
export const MAIN_NAV: { label: string; path: string; mega?: GenderSilo }[] = [
  { label: "Kadın", path: "/kadin", mega: "kadin" },
  { label: "Erkek", path: "/erkek", mega: "erkek" },
  { label: "Beden Rehberi", path: "/beden-rehberi" },
  { label: "Stil", path: "/stil" },
  { label: "Kombinler", path: "/kombinler" },
  { label: "Trendler", path: "/trendler" },
  { label: "Markalar", path: "/markalar" },
  { label: "Alışveriş Rehberi", path: "/alisveris-rehberi" },
  { label: "Kumaş Rehberi", path: "/kumas-rehberi" },
  { label: "Rehberler", path: "/rehberler" },
];

/** Kadın beden landing'i (kategori dolu SIZE_GUIDE) segment deseni. */
export const SIZE_LANDING_PATTERN: Record<GenderSilo, RegExp> = {
  kadin: /^(4[2-9]|5\d|6[0-6])-beden$/,
  erkek: /^([2-8]?xl|\d{2}-beden)$/,
};

export const SITE_URL_FALLBACK = "https://www.buyukbeden.net";

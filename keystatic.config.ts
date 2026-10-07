/**
 * Keystatic yönetim paneli (/keystatic) – mimari K3, §7.2.
 * Dev: yerel dosyalar. Prod: GitHub (cemusab/buyukbeden-net) – env: KEYSTATIC_GITHUB_CLIENT_ID,
 * KEYSTATIC_GITHUB_CLIENT_SECRET, KEYSTATIC_SECRET, NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG.
 * Site Keystatic okuyucusunu KULLANMAZ: içerik scripts/build-content.ts ile doğrulanır (bkz. docs/icerik-format.md).
 * Panelde karşılığı olmayan karmaşık alanlar `fields.ignored()` ile dosyada korunur (dosyadan düzenlenir).
 */
import { collection, config, fields, singleton } from "@keystatic/core";
import { block, wrapper } from "@keystatic/core/content-components";
import {
  ALL_CATEGORY_KEYS,
  CATEGORIES,
  LANDING_KEYS,
  OCCASIONS,
  SEASONS,
  SEASON_LABEL,
  SHARED_ARTICLE_SECTIONS,
  SOURCE_TYPES,
  TOPICS,
  TOPIC_LABEL,
} from "./src/lib/taxonomy";

const opt = (values: readonly string[], labels?: Record<string, string>) => values.map((v) => ({ label: labels?.[v] ?? v, value: v }));
const slugRule = { regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, message: "küçük harf, rakam ve tire (Türkçe karakter yok)" };
const pathRule = { regex: /^\/[a-z0-9\-/]*(#[a-z0-9-]+)?$/, message: "/ ile başlayan iç yol" };
const categoryLabels = Object.fromEntries([...CATEGORIES.kadin, ...CATEGORIES.erkek].map((c) => [c.key, c.label]));

const image = (dir: string, label = "Görsel") =>
  fields.object(
    {
      src: fields.image({ label: "Dosya", directory: `public/images/${dir}`, publicPath: `/images/${dir}/` }),
      alt: fields.text({ label: "Alt metin (en az 5 karakter)" }),
      credit: fields.text({ label: "Kredi / kaynak" }),
      aiGenerated: fields.checkbox({ label: "Yapay zekâ ile üretildi (altında not gösterilir)", defaultValue: false }),
    },
    { label },
  );

const sources = fields.array(
  fields.object({
    url: fields.url({ label: "URL" }),
    type: fields.select({ label: "Tür", options: opt(SOURCE_TYPES), defaultValue: "brand-official" }),
    label: fields.text({ label: "Etiket" }),
    checkedAt: fields.date({ label: "Kontrol tarihi" }),
  }),
  { label: "Kaynaklar", itemLabel: (p) => p.fields.label.value || "Kaynak" },
);

const faq = fields.array(
  fields.object({ q: fields.text({ label: "Soru" }), a: fields.text({ label: "Cevap (satır içi Markdoc)", multiline: true }) }),
  { label: "SSS", itemLabel: (p) => p.fields.q.value || "Soru" },
);

const paths = (label: string) => fields.array(fields.text({ label: "Yol", validation: { pattern: pathRule } }), { label, itemLabel: (p) => p.value });

const body = (dir: string) =>
  fields.markdoc({
    label: "Gövde",
    options: { image: { directory: `public/images/${dir}`, publicPath: `/images/${dir}/` } },
    components: {
      not: wrapper({
        label: "Not kutusu",
        schema: {
          tip: fields.select({ label: "Tür", options: opt(["bilgi", "ipucu", "dikkat"]), defaultValue: "bilgi" }),
          baslik: fields.text({ label: "Başlık" }),
        },
      }),
      "arti-eksi": wrapper({ label: "Artı / eksi (2 liste, aralarında ---)", schema: {} }),
      adimlar: wrapper({ label: "Adımlar (numaralı liste)", schema: {} }),
      ilgili: block({ label: "İlgili içerik kartı", schema: { yol: fields.text({ label: "Yol (/…)", validation: { pattern: pathRule } }) } }),
      sss: block({ label: "SSS bu noktada", schema: {} }),
      "alisveris-cta": block({ label: "Alışveriş CTA konumu", schema: {} }),
      "beden-tablosu": block({ label: "Beden tablosu", schema: { id: fields.relationship({ label: "Tablo", collection: "bedenTablolari" }) } }),
    },
  });

/** Tüm editoryal belgelerin ortak alanları (src/content/schema.ts > base) */
const base = (dir: string) => ({
  title: fields.slug({ name: { label: "Başlık (H1)" }, slug: { label: "Klasör adı (id)", validation: { pattern: slugRule } } }),
  status: fields.select({ label: "Durum", options: opt(["published", "draft", "archived"]), defaultValue: "published" }),
  breadcrumbTitle: fields.text({ label: "Breadcrumb başlığı (≤ 40)" }),
  excerpt: fields.text({ label: "Özet (80–220)", multiline: true }),
  shortAnswer: fields.text({ label: "Kısa cevap (40–400, satır içi Markdoc)", multiline: true }),
  author: fields.relationship({ label: "Yazar", collection: "yazarlar" }),
  reviewedBy: fields.relationship({ label: "Gözden geçiren (gerçek kişi)", collection: "yazarlar" }),
  publishedAt: fields.date({ label: "Yayın tarihi" }),
  updatedAt: fields.date({ label: "Güncelleme tarihi" }),
  featuredImage: image(dir, "Öne çıkan görsel"),
  silo: fields.select({ label: "Silo", options: opt(["kadin", "erkek", "ortak"]), defaultValue: "kadin" }),
  topics: fields.multiselect({ label: "Konular (1–4)", options: opt(TOPICS, TOPIC_LABEL) }),
  tags: fields.array(fields.text({ label: "Etiket", validation: { pattern: slugRule } }), { label: "Etiketler", itemLabel: (p) => p.value }),
  sizes: fields.array(fields.text({ label: "Beden" }), { label: "Bedenler (52, 4XL…)", itemLabel: (p) => p.value }),
  fabrics: fields.multiRelationship({ label: "Kumaşlar", collection: "kumaslar" }),
  brands: fields.multiRelationship({ label: "Markalar", collection: "markalar" }),
  related: paths("İlgili içerikler (elle, ≤ 8)"),
  faq,
  sources,
  primaryKeyword: fields.text({ label: "Birincil anahtar kelime (benzersiz)" }),
  seo: fields.object(
    {
      title: fields.text({ label: "SEO başlığı (≤ 60)" }),
      description: fields.text({ label: "Meta açıklama (70–160)", multiline: true }),
      index: fields.checkbox({ label: "İndekslensin", defaultValue: true }),
      canonical: fields.ignored(),
      ogImage: fields.ignored(),
    },
    { label: "SEO" },
  ),
  shoppingCta: fields.ignored(),
  redirectFrom: paths("Eski yollar (308 yönlendirme)"),
  body: body(dir),
});

const segmented = (dir: string) => ({
  ...base(dir),
  segment: fields.text({ label: "URL son parçası (segment)", validation: { pattern: slugRule } }),
  hub: fields.relationship({ label: "Kategori hub'ı", collection: "hublar" }),
  subtopic: fields.text({ label: "Hub alt grubu (subtopic key)" }),
});

const occasion = fields.multiselect({ label: "Durum", options: OCCASIONS.map((o) => ({ label: o.label, value: o.key })) });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const doc = (label: string, dir: string, schema: Record<string, any>) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  collection({ label, path: `content/${dir}/*/`, slugField: "title", format: { contentField: "body" }, entryLayout: "content", columns: ["title"], schema } as any);

const isProd = process.env.NODE_ENV === "production" && !!process.env.KEYSTATIC_GITHUB_CLIENT_ID;

export default config({
  storage: isProd ? { kind: "github", repo: "cemusab/buyukbeden-net" } : { kind: "local" },
  ui: {
    brand: { name: "Buyukbeden.net" },
    navigation: {
      Ayarlar: ["site", "anasayfa"],
      Sayfalar: ["sayfalar", "hublar"],
      İçerik: ["makaleler", "bedenRehberleri", "stilRehberleri", "kombinler", "alisverisRehberleri", "trendler"],
      Varlıklar: ["markalar", "kumaslar", "bedenTablolari", "yazarlar"],
    },
  },
  singletons: {
    site: singleton({
      label: "Site Ayarları",
      path: "content/ayarlar/site",
      format: "yaml",
      schema: {
        siteName: fields.text({ label: "Site adı" }),
        siteUrl: fields.url({ label: "Site URL" }),
        tagline: fields.text({ label: "Slogan" }),
        organization: fields.ignored(),
        shoppingCta: fields.ignored(),
        popularSearches: fields.array(fields.text({ label: "Arama" }), { label: "Sık aramalar (≤ 8)", itemLabel: (p) => p.value }),
        analytics: fields.ignored(),
        editorialEmail: fields.ignored(),
        defaultOgImage: fields.ignored(),
      },
    }),
    anasayfa: singleton({
      label: "Ana Sayfa",
      path: "content/ayarlar/anasayfa",
      format: "yaml",
      schema: {
        hero: fields.ignored(),
        manifesto: fields.ignored(),
        sizeBand: fields.ignored(),
        sections: fields.array(
          fields.object({
            key: fields.select({
              label: "Bölüm",
              options: opt(["kadin", "erkek", "bedenini-tani", "editorun-sectikleri", "cok-okunanlar", "stil", "kombinler", "trendler", "marka-dosyalari", "kumas", "alisveris", "yeni-icerikler", "temel-rehberler", "buyukbedengiyim-secimler"]),
              defaultValue: "editorun-sectikleri",
            }),
            enabled: fields.checkbox({ label: "Açık", defaultValue: true }),
            title: fields.text({ label: "Başlık" }),
            items: paths("Elle seçilen içerikler (boşsa otomatik)"),
          }),
          { label: "Bölümler (sıra = görünüm sırası)", itemLabel: (p) => p.fields.key.value },
        ),
        megaMenuFeatured: fields.object({ kadin: fields.text({ label: "Kadın öne çıkan yol" }), erkek: fields.text({ label: "Erkek öne çıkan yol" }) }, { label: "Mega menü öne çıkan" }),
      },
    }),
  },
  collections: {
    sayfalar: doc("Sayfalar", "sayfalar", {
      ...base("sayfalar"),
      key: fields.select({ label: "Sayfa anahtarı", options: opt(LANDING_KEYS), defaultValue: "hakkimizda" }),
      kind: fields.select({ label: "Tür", options: opt(["landing", "kurumsal", "yasal"]), defaultValue: "landing" }),
      menuLabel: fields.text({ label: "Menü etiketi" }),
      intro: fields.text({ label: "Giriş (≤ 600)", multiline: true }),
      featured: paths("Öne çıkanlar"),
    }),
    hublar: doc("Kategori Hub'ları", "hublar", {
      ...base("hublar"),
      category: fields.select({ label: "Kategori", options: opt(ALL_CATEGORY_KEYS, categoryLabels), defaultValue: "elbise" }),
      order: fields.integer({ label: "Sıra", defaultValue: 100 }),
      menuLabel: fields.text({ label: "Menü etiketi" }),
      image: image("hublar", "Kategori kartı görseli"),
      intro: fields.text({ label: "Giriş (40–600)", multiline: true }),
      subtopics: fields.array(
        fields.object({ key: fields.text({ label: "Anahtar", validation: { pattern: slugRule } }), label: fields.text({ label: "Etiket" }), description: fields.text({ label: "Açıklama" }) }),
        { label: "Alt gruplar", itemLabel: (p) => p.fields.label.value },
      ),
      featured: paths("Hızlı yollar (≤ 6)"),
      sizeGuides: paths("Beden rehberleri"),
      relatedHubs: fields.multiRelationship({ label: "İlgili hub'lar (aynı silo)", collection: "hublar" }),
    }),
    makaleler: doc("Makaleler", "makaleler", { ...segmented("makaleler"), section: fields.select({ label: "Ortak bölüm", options: opt(SHARED_ARTICLE_SECTIONS), defaultValue: "rehberler" }) }),
    bedenRehberleri: doc("Beden Rehberleri", "beden-rehberleri", {
      ...segmented("beden-rehberleri"),
      sizeSystem: fields.multiselect({ label: "Beden sistemleri", options: opt(["TR", "EU", "UK", "US", "IT", "harf"]) }),
      sizeCharts: fields.multiRelationship({ label: "Beden tabloları", collection: "bedenTablolari" }),
      measurementSteps: fields.array(
        fields.object({
          part: fields.select({ label: "Ölçü", options: opt(["gogus", "bel", "basen", "omuz", "ic-bacak", "kol", "yaka", "boy"]), defaultValue: "gogus" }),
          text: fields.text({ label: "Açıklama", multiline: true }),
        }),
        { label: "Ölçü adımları", itemLabel: (p) => p.fields.part.value },
      ),
    }),
    stilRehberleri: doc("Stil Rehberleri", "stil-rehberleri", { ...segmented("stil-rehberleri"), bodyFocus: fields.array(fields.text({ label: "Odak" }), { label: "Vücut odağı", itemLabel: (p) => p.value }), occasion }),
    kombinler: doc("Kombinler", "kombinler", {
      ...segmented("kombinler"),
      season: fields.multiselect({ label: "Mevsim", options: opt(SEASONS, SEASON_LABEL) }),
      occasion,
      pieces: fields.ignored(),
      whyItWorks: fields.text({ label: "Neden uyumlu (satır içi Markdoc)", multiline: true }),
      fitFor: fields.text({ label: "Kimler için" }),
    }),
    alisverisRehberleri: doc("Alışveriş Rehberleri", "alisveris-rehberleri", { ...segmented("alisveris-rehberleri"), criteria: fields.ignored(), picks: fields.ignored() }),
    trendler: doc("Trendler", "trendler", { ...segmented("trendler"), season: fields.text({ label: "Sezon (ör. 2026 Sonbahar-Kış)" }), validUntil: fields.ignored() }),
    markalar: doc("Markalar", "markalar", {
      ...base("markalar"),
      name: fields.text({ label: "Marka adı" }),
      website: fields.ignored(),
      country: fields.ignored(),
      international: fields.checkbox({ label: "Uluslararası marka", defaultValue: false }),
      genders: fields.multiselect({ label: "Kime", options: opt(["kadin", "erkek"]) }),
      sizeRange: fields.ignored(),
      priceSegment: fields.ignored(),
      priceBasis: fields.ignored(),
      categories: fields.multiselect({ label: "Kategoriler", options: opt(ALL_CATEGORY_KEYS, categoryLabels) }),
      fitNotes: fields.ignored(),
      availabilityTR: fields.ignored(),
      highlights: fields.array(fields.text({ label: "Madde" }), { label: "Öne çıkanlar", itemLabel: (p) => p.value }),
      pros: fields.array(fields.text({ label: "Madde" }), { label: "Artılar", itemLabel: (p) => p.value }),
      cons: fields.array(fields.text({ label: "Madde" }), { label: "Eksiler", itemLabel: (p) => p.value }),
      alternatives: fields.multiRelationship({ label: "Alternatif markalar", collection: "markalar" }),
      relatedGuides: paths("İlgili rehberler"),
      logo: fields.ignored(),
      socialEmbeds: fields.ignored(),
      unverified: fields.array(fields.text({ label: "Alan adı" }), { label: "Doğrulanamayan alanlar", itemLabel: (p) => p.value }),
      lastVerifiedAt: fields.date({ label: "Son doğrulama" }),
    }),
    kumaslar: doc("Kumaşlar", "kumaslar", {
      ...base("kumaslar"),
      name: fields.text({ label: "Kumaş adı" }),
      aliases: fields.array(fields.text({ label: "Ad" }), { label: "Diğer adları", itemLabel: (p) => p.value }),
      kind: fields.select({ label: "Tür", options: opt(["lif", "kumas-yapisi", "apre"]), defaultValue: "lif" }),
      origin: fields.ignored(),
      feel: fields.text({ label: "His" }),
      stretch: fields.ignored(),
      breathability: fields.ignored(),
      warmth: fields.ignored(),
      wrinkle: fields.ignored(),
      seasons: fields.multiselect({ label: "Mevsim", options: opt(SEASONS, SEASON_LABEL) }),
      care: fields.ignored(),
      pros: fields.array(fields.text({ label: "Madde" }), { label: "Artılar", itemLabel: (p) => p.value }),
      cons: fields.array(fields.text({ label: "Madde" }), { label: "Eksiler", itemLabel: (p) => p.value }),
      uses: fields.multiselect({ label: "Kullanıldığı kategoriler", options: opt(ALL_CATEGORY_KEYS, categoryLabels) }),
      plusSizeNotes: fields.text({ label: "Giysi seçimine etkisi (satır içi Markdoc)", multiline: true }),
    }),
    bedenTablolari: collection({
      label: "Beden Tabloları",
      path: "content/beden-tablolari/*",
      slugField: "title",
      format: "yaml",
      schema: {
        title: fields.slug({ name: { label: "Başlık" }, slug: { label: "id", validation: { pattern: slugRule } } }),
        caption: fields.text({ label: "Tablo açıklaması (caption)" }),
        silo: fields.select({ label: "Silo", options: opt(["kadin", "erkek", "ortak"]), defaultValue: "kadin" }),
        scope: fields.select({ label: "Kapsam", options: opt(["genel", "ust-giyim", "alt-giyim", "elbise", "ic-giyim", "gomlek", "jean"]), defaultValue: "genel" }),
        kind: fields.select({ label: "Tür", options: opt(["olcu-cm", "donusum"]), defaultValue: "olcu-cm" }),
        brand: fields.ignored(),
        columns: fields.ignored(),
        rows: fields.ignored(),
        highlightColumn: fields.ignored(),
        approximate: fields.checkbox({ label: "Yaklaşık değerler notu", defaultValue: true }),
        notes: fields.array(fields.text({ label: "Not" }), { label: "Notlar", itemLabel: (p) => p.value }),
        inconsistencyNote: fields.ignored(),
        sources,
      },
    }),
    yazarlar: collection({
      label: "Yazarlar",
      path: "content/yazarlar/*",
      slugField: "name",
      format: "yaml",
      schema: {
        name: fields.slug({ name: { label: "Ad" } }),
        isTeam: fields.checkbox({ label: "Ekip hesabı (gerçek kişi değil)", defaultValue: false }),
        role: fields.text({ label: "Gerçek unvan / rol" }),
        bio: fields.text({ label: "Biyografi (60–600)", multiline: true }),
        avatar: fields.ignored(),
        sameAs: fields.array(fields.url({ label: "Profil URL" }), { label: "Gerçek profiller", itemLabel: (p) => p.value ?? "" }),
        expertiseTopics: fields.multiselect({ label: "Uzmanlık konuları", options: opt(TOPICS, TOPIC_LABEL) }),
      },
    }),
  },
});

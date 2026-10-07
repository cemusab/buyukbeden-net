# İçerik formatı – yazarlar için kopyala-yapıştır rehberi

> Tek doğruluk kaynağı: `src/content/schema.ts` (zod) + `src/content/markdoc.config.ts` + `scripts/build-content.ts`.
> Her değişiklikten sonra: `npm run validate` (hızlı, dosya yazmaz). Kırmızıysa içerik yayımlanamaz.
> Sayısal beden/kumaş verisi **yalnız** `docs/kaynaklar-beden.md`'den ve kaynağıyla alınır. Kaynağı olmayan sayı yazılmaz.

## 0. Hızlı kurallar (validate bunları hata sayar)

| Kural | Ayrıntı |
|---|---|
| Dosya yeri | `content/{koleksiyon}/{id}/index.mdoc` (YAML frontmatter `---` … `---` + Markdoc gövde). Yazar ve beden tablosu `.yaml`. |
| `id` (klasör adı) | `^[a-z0-9]+(-[a-z0-9]+)*$`, Türkçe karakter yok (ı→i, ş→s, ğ→g, ü→u, ö→o, ç→c). |
| URL | Koleksiyon + `silo` + `hub` + `segment`'ten **otomatik** hesaplanır (aşağıdaki tablo). URL'yi elle yazmazsınız. |
| Benzersizlik | URL, `title`, `seo.title` (yoksa `title`), `seo.description`, `primaryKeyword` (Türkçe normalize) **site genelinde benzersiz**. |
| Uzunluklar | `title` 10–110 · `excerpt` 80–220 (sayfalarda 40–220) · `seo.description` 70–160 · `seo.title` ≤ 60 · `shortAnswer` 40–400 · `breadcrumbTitle` ≤ 40 · SSS sorusu 8–160, cevap ≥ 20. |
| Zorunlu `shortAnswer` | makale, beden rehberi, stil rehberi, kumaş, alışveriş rehberi. |
| Zorunlu `primaryKeyword` | indekslenen tüm belgeler (sayfalar hariç; orada önerilir). |
| Tarihler | `YYYY-AA-GG`; `updatedAt ≥ publishedAt`; gelecekte olamaz. |
| Gövdede `#` (H1) | **Yasak.** H1 = `title`. Bölümler `##`, alt bölümler `###`. |
| İç linkler | `/…` ile başlar, hedef **yayımlanmış** olmalı (manifest). Anchor (`/kumas-rehberi/viskon#bakim`) hedefte başlık olarak bulunmalı. `https://buyukbeden.net/...` mutlak iç link yasak. |
| Dış linkler | `https://…` geçerli URL. `javascript:`, `#`, boş link yasak. |
| Yasak ifadeler | "çok yakında", "yapım aşamasında", "coming soon", "lorem ipsum", "TODO". |
| Buyukbedengiyim.com | Site sahibi açana kadar **hiçbir metinde/linkte geçmez** (yalnız `shoppingCta` alanı, o da şimdilik kapalı). |
| Silo | `kadin` / `erkek` / `ortak`. Kadın belgesinin `related` listesine erkek URL'si (ve tersi) konamaz; ortak serbest. Gövdede karşı siloya link uyarı verir. |
| Referanslar | `author`, `hub`, `brands`, `fabrics`, `sizeCharts`, `relatedHubs`, `alternatives` → var olan id olmalı. |
| Görseller | `/images/{koleksiyon}/{id}/dosya.webp` (`public/` altında gerçekten olmalı), `alt` ≥ 5 karakter. Rakip/stok görsel yok. Görsel yoksa tipografik kapak otomatik. |
| İnce içerik | Kategori hub'ı: gövde ≥ 600 kelime **veya** ≥ 3 yayımlı alt içerik. Kategori beden landing'i (`/kadin/giyim/elbise/52-beden`): ≥ 900 kelime, ≥ 1 kaynaklı beden tablosu, ≥ 3 SSS, ≥ 5 iç link. |
| Rezerve segmentler | `sayfa, etiket, arama, api, keystatic, giyim, beden-rehberi, stil, kombinler, index` ve aynı silodaki kategori adları. |
| Beden landing deseni | Kategori altında `52-beden` (kadın 42–66) veya `4xl`/`xl`…`8xl` (erkek) segmenti **yalnız** `beden-rehberleri` koleksiyonunda olabilir. |
| Taslak | `status: draft` → hiç üretilmez, link verilemez. `archived` → sayfa kalır, öneri/ana sayfa dışı. |

Uyarılar (build'i durdurmaz ama düzeltin): gövdede < 3 iç link · "büyük beden" ifadesinin sık tekrarı (> ~1/120 kelime) · tek SSS (FAQPage için ≥ 2) · marka `lastVerifiedAt` > 365 gün · trend `validUntil` geçmiş.

### URL hesaplama tablosu

| Koleksiyon (klasör) | Tür | URL |
|---|---|---|
| `sayfalar/{key}` | Statik sayfa | sabit (aşağıda `key` listesi) |
| `hublar/{silo}-{kategori}` | Kategori hub | `/{silo}/giyim/{kategori}` |
| `makaleler/{id}` silo kadin/erkek (+`hub` zorunlu) | Makale | `/{silo}/giyim/{kategori}/{segment}` |
| `makaleler/{id}` silo ortak | Makale | `/{section}/{segment}` — `section`: `rehberler` (varsayılan) \| `beden-rehberi` \| `kumas-rehberi` |
| `beden-rehberleri/{id}` + `hub` | Beden landing | `/{silo}/giyim/{kategori}/{segment}` |
| `beden-rehberleri/{id}` silo kadin/erkek | Beden rehberi | `/{silo}/beden-rehberi/{segment}` |
| `beden-rehberleri/{id}` silo ortak | Beden rehberi | `/beden-rehberi/{segment}` |
| `stil-rehberleri/{id}` | Stil | `/{silo}/stil/{segment}` · ortak: `/stil/{segment}` · `hub` verilirse `/{silo}/giyim/{kategori}/{segment}` |
| `kombinler/{id}` (ortak yasak) | Kombin | `/{silo}/kombinler/{segment}` |
| `alisveris-rehberleri/{id}` | Alışveriş | `/alisveris-rehberi/{segment}` (toptan pazar rehberleri de burada; `topics: [toptan-pazar]`) |
| `trendler/{id}` | Trend | `/trendler/{segment}` |
| `markalar/{slug}` | Marka | `/marka/{slug}` |
| `kumaslar/{slug}` | Kumaş | `/kumas-rehberi/{slug}` |
| `yazarlar/{slug}.yaml` | Yazar | `/yazar/{slug}` |
| `beden-tablolari/{id}.yaml` | Beden tablosu | (URL yok; gövdede `{% beden-tablosu %}` ile) |

`id` (klasör adı) URL değildir (marka, kumaş, hub, sayfa hariç); aynı `segment` farklı kategorilerde kullanılabilsin diye klasör adını açıklayıcı verin: `makaleler/kadin-elbise-nasil-secilir` → `segment: nasil-secilir`.

### Kontrollü listeler (`src/lib/taxonomy.ts`)

- **topics** (1–4 adet): `beden-olcu, kalip, kumas, stil, kombin, marka, alisveris, toptan-pazar, trend, bakim, ozel-gun, vucut-tipi, terim`
- **Kadın kategorileri:** `elbise, tunik, pantolon, jean, tayt, etek, tisort, gomlek, bluz, triko, hirka, sweatshirt, ceket, mont, kaban, abiye, tesettur, mayo-hasema, spor-giyim, ic-giyim, ev-giyimi`
- **Erkek kategorileri:** `tisort, polo, gomlek, pantolon, jean, esofman, sweatshirt, triko, hirka, mont, takim-elbise, sort-deniz-sortu, spor-giyim, ic-giyim`
- **occasion** (stil + kombin; landing'ler bu sırayla gruplar): `davet-abiye` (Davet ve Abiye), `ise-uygun` (İşe Uygun), `gunluk` (Günlük), `tatil-deniz` (Tatil ve Deniz), `spor-konfor` (Spor ve Konfor)
- **season:** `ilkbahar, yaz, sonbahar, kis, 4-mevsim`
- **sources[].type:** `brand-official, standard, regulation, reference, academic, retailer, editorial` (Türkçe eşdeğerleri de kabul: `resmi-marka, standart, uretici, arastirma, perakende, editoryal-olcum, diger`)
- **sayfalar key:** `kadin, erkek, kadin-giyim, erkek-giyim, kadin-beden-rehberi, erkek-beden-rehberi, kadin-stil, erkek-stil, kadin-kombinler, erkek-kombinler, beden-rehberi, stil, kombinler, kumas-rehberi, markalar, alisveris-rehberi, trendler, rehberler, hakkimizda, iletisim, editoryal-ilkeler, gizlilik, cerez-politikasi, kvkk`

Yeni kategori gerekiyorsa önce `taxonomy.ts`'e eklenir (frontend). Hub'ı yayımlanmayan kategori menüde görünmez.

---

## 1. Ortak alanlar (tüm `.mdoc` belgeleri)

```yaml
---
status: published            # published (varsayılan) | draft | archived
title: "Büyük Beden Elbise Nasıl Seçilir?"      # H1, benzersiz
breadcrumbTitle: Nasıl Seçilir                   # opsiyonel, ≤ 40
excerpt: "Kart ve meta açıklaması yedeği; 80–220 karakter, özgün ve doğal bir özet cümlesi."
shortAnswer: "Sayfanın en üstündeki kısa cevap (1–3 cümle). Satır içi Markdoc: [link](/beden-rehberi) ve **vurgu** olur."
author: editor-ekibi         # content/yazarlar/editor-ekibi.yaml
# reviewedBy: ad-soyad       # yalnız gerçek kişi
publishedAt: 2026-10-07
updatedAt: 2026-10-07
# featuredImage: { src: /images/makaleler/kadin-elbise-nasil-secilir/kapak.webp, alt: "Açıklayıcı alt metin", credit: "Buyukbeden.net", aiGenerated: true }
#   aiGenerated: true → görsel altında "Yapay zekâ ile üretilmiş görsel" notu. Erotik / iç çamaşırı mankeni görseli yok.
silo: kadin                  # kadin | erkek | ortak
topics: [kalip, kumas]       # 1–4, kontrollü liste
tags: [elbise, a-kesim, viskon]   # slug, ≤ 10 (arama + öneri)
sizes: ["52", "4XL"]         # ≤ 8 (öneri + arama)
fabrics: [viskon]            # content/kumaslar/{slug}
brands: []                   # content/markalar/{slug}
related: [/kumas-rehberi/viskon]  # elle öneriler (≤ 8, yayımlı yol; karşı silo yasak)
primaryKeyword: büyük beden elbise nasıl seçilir   # benzersiz
faq:
  - q: "Soru metni soru işaretiyle biter mi?"
    a: "Cevap en az 20 karakter. Satır içi link olabilir: [ölçü alma rehberi](/beden-rehberi/olcu-alma-rehberi)."
sources:
  - url: https://www.ornek-marka.com/beden-tablosu
    type: brand-official
    label: Marka X resmi beden tablosu
    checkedAt: 2026-10-07
seo:
  # title: "≤ 60 karakter, verilmezse title kullanılır"
  description: "70–160 karakter, benzersiz meta açıklaması; sayfanın vaadini doğal dille anlatır."
  # index: false             # noindex (sitemap dışı)
  # canonical: /baska/yol    # yalnız manifest'teki başka bir yol
# redirectFrom: [/eski/yol]  # slug değişince eski yol (308)
---
```

Gövde Markdoc'tur (bkz. §12).

---

## 2. Statik sayfa – `content/sayfalar/{key}/index.mdoc`

Klasör adı = `key`. `kind`: `landing` (bölüm kapısı), `kurumsal`, `yasal`.

```yaml
---
title: "Büyük Beden Kadın Giyim Rehberi"
breadcrumbTitle: Giyim
key: kadin-giyim
kind: landing
menuLabel: Giyim             # opsiyonel, menü etiketi
excerpt: "Kadın giyim kategorileri, beden seçimi, kalıp ve kumaş rehberleri tek yerde."
shortAnswer: "Opsiyonel kısa cevap."
intro: "Opsiyonel giriş paragrafı (≤ 600, satır içi Markdoc)."
author: editor-ekibi
publishedAt: 2026-10-07
updatedAt: 2026-10-07
silo: kadin                  # bölümün silosu (ortak bölümlerde ortak)
topics: []                   # opsiyonel
featured: [/kadin/giyim/elbise]   # öne çıkan yollar (≤ 12, yayımlı)
primaryKeyword: büyük beden kadın giyim
faq: []
seo:
  description: "Büyük beden kadın giyim rehberi: elbise, pantolon, jean ve daha fazlası için beden, kalıp ve kumaş seçimi."
---
Gövde metni (Markdoc).
```

Hub/landing sayfaları çocuklarını **otomatik listeler** (kategori ızgarası, rehber kartları); gövdeye liste kopyalamayın.

---

## 3. Kategori hub – `content/hublar/{silo}-{kategori}/index.mdoc`

```yaml
---
title: "Büyük Beden Elbise Rehberi"
breadcrumbTitle: Elbise
silo: kadin
category: elbise             # taksonomideki key; klasör adı kadin-elbise olmalı
order: 10                    # menü/ızgara sırası (küçük önce)
menuLabel: Elbise
# image: { src: /images/hublar/kadin-elbise/kart.webp, alt: "…", aiGenerated: true }   # kategori kartı (yoksa çizim)
intro: "Hub başlığının altındaki giriş (40–600 karakter, satır içi Markdoc)."
excerpt: "Elbise seçerken beden, kalıp ve kumaş: kullanım alanlarına göre rehberler ve sık sorulanlar."
shortAnswer: "Opsiyonel kısa cevap."
author: editor-ekibi
publishedAt: 2026-10-07
updatedAt: 2026-10-07
topics: [kalip, kumas]
tags: [elbise]
subtopics:                   # hub içi gruplama; çocuklar `subtopic: kullanim` ile bağlanır
  - key: secim
    label: Seçim rehberleri
  - key: kullanim
    label: Kullanım alanına göre
featured: []                 # ≤ 6 yayımlı yol (hızlı yollar)
sizeGuides: []               # ilgili beden rehberi yolları
relatedHubs: [kadin-abiye]   # aynı silodaki hub id'leri
fabrics: [viskon]
primaryKeyword: büyük beden elbise
faq: []
seo:
  description: "Büyük beden elbise rehberi: kalıplar, beden seçimi, kumaşlar ve kullanım alanlarına göre öneriler."
---
## Elbise seçerken nereden başlamalı?
… (≥ 600 kelime veya ≥ 3 yayımlı alt içerik)
```

Bir belgeyi hub'a bağlamak: belgeye `hub: kadin-elbise` (+ opsiyonel `subtopic: kullanim`).

---

## 4. Makale – `content/makaleler/{id}/index.mdoc`

Silo içi (hub zorunlu):

```yaml
---
title: "Büyük Beden Elbise Nasıl Seçilir?"
segment: nasil-secilir       # URL'nin son parçası → /kadin/giyim/elbise/nasil-secilir
hub: kadin-elbise
subtopic: secim
silo: kadin
excerpt: "…"
shortAnswer: "…"
author: editor-ekibi
publishedAt: 2026-10-07
updatedAt: 2026-10-07
topics: [kalip]
primaryKeyword: büyük beden elbise nasıl seçilir
seo: { description: "…" }
---
```

Ortak (silo dışı) makale – `section` ile yerleşim:

```yaml
---
title: "Büyük Beden Kaç Bedenden Başlar?"
segment: buyuk-beden-kac-bedenden-baslar
silo: ortak
section: beden-rehberi       # rehberler (varsayılan) | beden-rehberi | kumas-rehberi → /beden-rehberi/buyuk-beden-kac-bedenden-baslar
…
---
```

Örn. `/kumas-rehberi/viskon-mu-pamuk-mu` = `makaleler/viskon-mu-pamuk-mu`, `silo: ortak`, `section: kumas-rehberi`, `segment: viskon-mu-pamuk-mu`.

---

## 5. Beden rehberi – `content/beden-rehberleri/{id}/index.mdoc`

```yaml
---
title: "52 Beden Kaç XL? Ölçüler ve Markalara Göre Karşılıklar"
breadcrumbTitle: 52 Beden
segment: 52-beden-kac-xl     # → /kadin/beden-rehberi/52-beden-kac-xl  (hub yok)
silo: kadin                  # ortak → /beden-rehberi/{segment}
# hub: kadin-elbise          # verilirse kategori beden landing'i: /kadin/giyim/elbise/52-beden (eşikler §0)
sizes: ["52"]
sizeSystem: [TR, EU, UK, US, harf]
sizeCharts: [kadin-ulla-popken-vucut]   # content/beden-tablolari/{id}.yaml (sayfa üstünde gösterilir)
measurementSteps:            # opsiyonel; "Ölçü nasıl alınır" adımları (silüet çizimiyle)
  - part: gogus              # gogus | bel | basen | omuz | ic-bacak | kol | yaka | boy
    text: "Göğsün en dolgun yerinden, mezura yere paralel ve sıkmadan ölçülür."
excerpt: "…"
shortAnswer: "52 beden, markaya göre değişmekle birlikte … (yalnız kaynaklı tablo değerleriyle)."
author: editor-ekibi
publishedAt: 2026-10-07
updatedAt: 2026-10-07
topics: [beden-olcu]
primaryKeyword: 52 beden kaç xl
sources: [ … ]               # metindeki iddiaların kaynakları
faq: [ … ]
seo: { description: "…" }
---
```

Proporsiyon kuralı: beden kiloya göre değil vücut ölçüsü ve boya göre belirlenir; kilo→beden tablosu veya BMI hesabı yazılmaz.

---

## 6. Beden tablosu – `content/beden-tablolari/{id}.yaml`

```yaml
title: Ulla Popken kadın vücut ölçüleri
caption: Ulla Popken kadın beden tablosu (vücut ölçüsü, cm)
silo: kadin
scope: genel                 # genel | ust-giyim | alt-giyim | elbise | ic-giyim | gomlek | jean
kind: olcu-cm                # olcu-cm (ölçü tablosu) | donusum (beden çevirme)
brand: ulla-popken           # opsiyonel (markalar'da varsa)
columns:                     # 2–10 sütun; ilk sütun satır başlığı
  - { key: beden, label: Beden }
  - { key: gogus, label: Göğüs, unit: cm }
  - { key: bel, label: Bel, unit: cm }
  - { key: basen, label: Basen, unit: cm }
rows:                        # her satır = sütun sayısı kadar hücre (metin)
  - ["42", "99–102", "82–85", "105–108"]
  - ["44", "103–106", "86–89", "109–112"]
highlightColumn: gogus       # opsiyonel vurgulu sütun
approximate: true            # true → "Yaklaşık değerler; markaya göre değişir" notu
notes:
  - Normal boy 167–174 cm için verilmiştir.
sources:                     # en az 1 – kaynaksız tablo yok
  - url: https://www.ullapopken.at/de/guides/size-guide
    type: brand-official
    label: Ulla Popken beden rehberi
    checkedAt: 2026-10-07
```

Kullanım: gövdede `{% beden-tablosu id="kadin-ulla-popken-vucut" /%}` veya beden rehberinde `sizeCharts: [...]`. Vücut tablosu ile giysi (ürün) tablosu karıştırılmaz; `caption`'da hangisi olduğunu yazın.

---

## 7. Stil rehberi – `content/stil-rehberleri/{id}/index.mdoc`

```yaml
---
title: "Basenli Vücut İçin Pantolon Seçimi"
segment: basenli-pantolon-secimi   # → /kadin/stil/basenli-pantolon-secimi
silo: kadin
bodyFocus: [basen]           # saygılı dil; "kusur/gizle" yok
occasion: [gunluk, ise-uygun]
excerpt: "…"
shortAnswer: "…"
author: editor-ekibi
publishedAt: 2026-10-07
updatedAt: 2026-10-07
topics: [stil, vucut-tipi]
primaryKeyword: basenli pantolon seçimi
seo: { description: "…" }
---
```

---

## 8. Kombin – `content/kombinler/{id}/index.mdoc` (silo `ortak` olamaz)

```yaml
---
title: "Ofis İçin Büyük Beden Kadın Kombini"
segment: ofis                # → /kadin/kombinler/ofis
silo: kadin
season: [sonbahar, kis]
occasion: [ise-uygun]
fitFor: "Bel çizgisini belirginleştirmek isteyenler için"
whyItWorks: "Neden uyumlu (≥ 40 karakter, satır içi Markdoc): uzun hırka dikey çizgi oluşturur, [viskon](/kumas-rehberi/viskon) bluz dökümlü durur."
pieces:                      # en az 2
  - role: ust                # ust | alt | tek-parca | dis-giyim | ayakkabi | aksesuar
    name: Viskon bluz
    fabric: viskon           # opsiyonel → kumaş linki
    color: Ekru
    alternatives: [Pamuklu gömlek]
  - role: alt
    name: Yüksek bel kumaş pantolon
    hub: kadin-pantolon      # opsiyonel, aynı silodaki hub → kategori linki
    alternatives: [Midi kalem etek]
excerpt: "…"
author: editor-ekibi
publishedAt: 2026-10-07
updatedAt: 2026-10-07
topics: [kombin]
primaryKeyword: büyük beden ofis kombini kadın
seo: { description: "…" }
---
```

---

## 9. Alışveriş rehberi – `content/alisveris-rehberleri/{id}/index.mdoc`

Fiyat, puan, "en ucuz", stok bilgisi **yok**. Toptan pazar (Merter, Laleli, Osmanbey) rehberleri de buradadır (`topics: [alisveris, toptan-pazar]`).

```yaml
---
title: "Türkiye'de Büyük Beden Markaları: Kadın ve Erkek"
segment: buyuk-beden-markalari     # → /alisveris-rehberi/buyuk-beden-markalari
silo: ortak
criteria:                    # en az 3: nasıl değerlendirdik
  - { label: Beden aralığı, description: "Resmi sitede görülen beden aralığı." }
  - { label: Erişilebilirlik, description: "Türkiye'den online veya mağazadan erişim." }
  - { label: Kategori çeşitliliği, description: "Büyük bedende sunulan ürün grupları." }
picks:                       # opsiyonel; her biri bir marka + en az 1 kaynak
  - brand: kigili
    why: "Erkek büyük beden koleksiyonunda takım elbiseden trikoya geniş ürün grubu bulunuyor."
    bestFor: Klasik ve ofis giyimi
    caveats: "Beden aralığı ürüne göre değişir."
    sources:
      - { url: https://www.kigili.com/buyuk-beden-urunler/, type: brand-official, label: Kiğılı büyük beden ürünleri, checkedAt: 2026-10-07 }
excerpt: "…"
shortAnswer: "…"
author: editor-ekibi
publishedAt: 2026-10-07
updatedAt: 2026-10-07
topics: [alisveris, marka]
primaryKeyword: büyük beden markaları
seo: { description: "…" }
---
```

---

## 10. Marka – `content/markalar/{slug}/index.mdoc`

Doğrulanamayan alan `null` bırakılır ve adı `unverified` listesine yazılır → arayüzde gösterilmez. Logo kullanılmaz.

```yaml
---
title: "Kiğılı: Büyük Beden Erkek Giyim Rehberi"
name: Kiğılı
breadcrumbTitle: Kiğılı
website: https://www.kigili.com
country: Türkiye
international: false         # true → "Uluslararası" filtresi
genders: [erkek]
sizeRange:                   # null olabilir; doluysa sources zorunlu
  erkek: { from: XL, to: 7XL, system: harf }
priceSegment: null           # ekonomik | orta | ust | premium | null (doluysa sources veya priceBasis)
categories: [takim-elbise, gomlek, pantolon, triko]
fitNotes: null
availabilityTR: { online: true, stores: null }
highlights: ["Ayrı bir büyük beden erkek koleksiyonu var."]
pros: []
cons: []
alternatives: []             # marka slug'ları
relatedGuides: []            # yayımlı yollar
unverified: [stores, priceSegment]
lastVerifiedAt: 2026-10-07
excerpt: "…"
shortAnswer: "…"             # opsiyonel (yoksa excerpt)
author: editor-ekibi
publishedAt: 2026-10-07
updatedAt: 2026-10-07
silo: erkek                  # kadın+erkek marka → ortak
topics: [marka]
primaryKeyword: kiğılı büyük beden
sources:
  - { url: https://www.kigili.com/buyuk-beden-urunler/, type: brand-official, label: Kiğılı büyük beden ürünleri sayfası, checkedAt: 2026-10-07 }
seo: { description: "…" }
---
Hakkında (özgün metin; rakip/marka metni kopyalanmaz).
```

---

## 11. Kumaş – `content/kumaslar/{slug}/index.mdoc`

Teknik değer (esneme, nefes alma, sıcaklık, kırışma, köken, bakım) yazıldıysa `sources` zorunlu. Bilinmeyen değer `null`.

```yaml
---
title: "Viskon Nedir? Özellikleri, Bakımı ve Kullanımı"
name: Viskon
breadcrumbTitle: Viskon
aliases: [rayon, viskoz]     # arama eşanlamlıları
kind: lif                    # lif | kumas-yapisi | apre
origin: yari-sentetik        # dogal | yari-sentetik | sentetik | karisim | null
feel: Yumuşak, dökümlü ve serin
stretch: null                # dusuk | orta | yuksek | null
breathability: null
warmth: null
wrinkle: null
seasons: [ilkbahar, yaz]
care: { washMaxC: null, tumbleDry: null, iron: orta, notes: "…" }
pros: ["…"]
cons: ["…"]
uses: [elbise, bluz]         # kategori key'leri → iki silodaki hub'lara link
plusSizeNotes: "Editör notu: … (≥ 20 karakter, satır içi Markdoc)"
excerpt: "…"
shortAnswer: "…"
author: editor-ekibi
publishedAt: 2026-10-07
updatedAt: 2026-10-07
silo: ortak
topics: [kumas]
primaryKeyword: viskon nedir
sources: [ … ]
faq: [ … ]
seo: { description: "…" }
---
```

Örnek tam dosya: `content/kumaslar/viskon/index.mdoc`.

## 11b. Trend – `content/trendler/{id}/index.mdoc`

`segment`, `season: "2026 Sonbahar-Kış"`, opsiyonel `validUntil: 2027-03-01`; iddialar kaynaklı (`sources`). Diğer alanlar §1.

## 11c. Yazar – `content/yazarlar/{slug}.yaml`

```yaml
name: Buyukbeden.net Editör Ekibi
isTeam: true                 # gerçek kişi değilse true
role: Editör ekibi           # gerçek unvan; uydurma uzmanlık yok
bio: "60–600 karakter."
sameAs: []                   # yalnız gerçek profiller
expertiseTopics: [beden-olcu, kumas, stil]
```

---

## 12. Markdoc gövde etiketleri

```markdoc
## Soru biçimli bir H2 başlık mı?

Paragraf, **kalın**, _italik_, [iç link](/beden-rehberi/olcu-alma-rehberi), [başlığa link](#bakim), [dış link](https://www.iso.org/standard/61686.html).

### Alt başlık

- madde
- madde

{% not tip="bilgi" baslik="Not" %}
Markaya göre değişebilir; satın almadan önce markanın kendi tablosunu kontrol edin.
{% /not %}

{% not tip="ipucu" %}İpucu metni.{% /not %}
{% not tip="dikkat" baslik="Dikkat" %}Uyarı metni.{% /not %}

{% arti-eksi %}
- artı 1
- artı 2

---

- eksi 1
- eksi 2
{% /arti-eksi %}

{% adimlar %}
1. Mezurayı yere paralel tutun.
2. Nefesinizi tutmadan ölçün.
3. İki beden arasında kalırsanız büyük olanı seçin.
{% /adimlar %}

{% table caption="Kalıp sözlüğü" %}
* Kalıp
* Nasıl durur
* Kime uygun
---
* A kesim
* Belden aşağı genişler
* Bel çizgisini göstermek isteyenler
---
* Düz kesim
* Gövdeye paralel iner
* Rahat ve sade görünüm isteyenler
{% /table %}

{% beden-tablosu id="kadin-ulla-popken-vucut" /%}

{% ilgili yol="/kumas-rehberi/viskon" /%}

{% sss /%}

{% alisveris-cta /%}

![Ölçü alma çizimi açıklaması](/images/makaleler/olcu-alma/olcu.webp)
```

| Etiket | Ne yapar | Kural |
|---|---|---|
| `##`, `###` | Başlık (otomatik anchor id: "Göğüs nasıl ölçülür?" → `#gogus-nasil-olculur`) | H2 ≥ 2 ise "Bu Yazıda" içindekiler otomatik. Aynı başlık iki kez olamaz. |
| `{% not %}` | Bej "Not" kutusu | `tip`: bilgi \| ipucu \| dikkat; `baslik` opsiyonel |
| `{% arti-eksi %}` | Artı / eksi iki sütun | Tam 2 liste, aralarında `---` |
| `{% adimlar %}` | Numaralı adımlar | İçinde `1.` listesi |
| `{% table %}` | Mobilde yatay kaydırılabilir tablo, ilk sütun sabit | Satırlar `---` ile ayrılır; `caption` önerilir |
| `{% beden-tablosu id="…" /%}` | Kaynaklı beden tablosu + kaynak satırı | id `content/beden-tablolari/`'da olmalı |
| `{% ilgili yol="…" /%}` | İçerik kartı | Yol yayımlı olmalı |
| `{% sss /%}` | `faq` alanını bu noktada gösterir | Yoksa sayfa sonunda |
| `{% alisveris-cta /%}` | Alışveriş CTA konumu | Şimdilik kapalı; görünmez |
| `![alt](/images/…)` | Görsel | Dosya `public/` altında, alt ≥ 5 |

Markdown pipe tablosu (`| a | b |`) **desteklenmez**; `{% table %}` kullanın.

## 13. Akış

1. Dosyayı oluşturun → `npm run validate` (hataları satır/alan adıyla gösterir).
2. Yerel önizleme: `npm run dev` (içerik değişince otomatik yeniden üretir) veya `/keystatic` editörü.
3. Teslim öncesi: `npm run qa`.

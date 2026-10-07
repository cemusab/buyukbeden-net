# Buyukbeden.net – Mimari (v2)

> Kaynak: `docs/brief.md` (çelişkide brief geçerli). Bu dosya brief §53'teki 1, 2, 3, 4, 6, 7, 8, 9–15, 16, 17, 19, 20 numaralı maddeleri ve tasarım sistemini kapsar. §5 (topic cluster/keyword haritası) ve §18 (ilk 40 cornerstone) `docs/icerik-plani.md` içindedir.
> Frontend bu dosyadan doğrudan uygular. Küçük kararlar burada verilmiştir; değiştirmek için önce bu dosya güncellenir.

---

## §0 Temel kararlar (özet + gerekçe)

| # | Karar | Gerekçe |
|---|---|---|
| K1 | **Next.js 16.4 App Router, `cacheComponents: true` + `partialPrefetching: true` (scaffold'daki gibi kalır).** Tüm site rotaları `(site)` route group'u altında; `(site)/layout.tsx` içinde `export const ensureStatic = "navigation"`. | `ensureStatic="navigation"` build sırasında her site sayfasının tamamen statik üretildiğini **doğrular** (runtime veri kullanan kod build'i düşürür). SSG garantisi derleyici seviyesinde. |
| K2 | **`dynamicParams` KULLANILMAZ.** (Cache Components ile build hatası: *"dynamicParams is not compatible with cacheComponents"*.) Bilinmeyen parametre → sayfada `notFound()`. Her dinamik rota `generateStaticParams()` ile **en az 1** parametre döndürmek zorunda (boş dizi build hatası). | Next 16 dokümanı (`02-guides/migrating-to-cache-components.md`). CLAUDE.md'deki "`dynamicParams = false`" ifadesi bu şekilde okunmalı. Doğrulandı: `/kadin/giyim/yokboyle` → 404. |
| K3 | **CMS: Keystatic** (`@keystatic/core` 0.6.9 + `@keystatic/next` 5.0.5, git tabanlı). Dev'de `local`, prod'da `github` storage (repo `cemusab/buyukbeden-net`). Admin: `/keystatic`, API: `/api/keystatic/[...params]`. | Peer deps: `next >=14`, `react ^19`. **Bu repo kopyasında test edildi** (Next 16.4.0 + React 19.3 + cacheComponents): build geçti, `/keystatic` 200 + editör render, local API ağaç döndürdü, site rotaları statik kaldı. İçerik repo'da dosya → DB yok, hosting maliyeti yok, git geçmişi = sürüm geçmişi. |
| K4 | **CMS opsiyonel ve değiştirilebilir.** Site Keystatic reader API'sini kullanmaz; kendi `scripts/build-content.ts` dosyaları okur, zod ile doğrular, `src/generated/*.json` üretir. Sayfalar yalnız `src/lib/content.ts` üzerinden okur. | Keystatic kaldırılsa site çalışmaya devam eder (dosyalar elle/başka CMS ile düzenlenir). Üretilen JSON bundle'a gömülür → runtime'da `fs` yok, Vercel'de dosya izleme (tracing) sorunu yok, `ensureStatic` ile uyumlu. |
| K5 | **Gövde formatı: Markdoc (`.mdoc`).** Frontmatter YAML + Markdoc gövde. | Keystatic'in yerel zengin editör formatı; MDX'in aksine içerikte JS çalışmaz; özel etiketler (kısa cevap, beden tablosu, SSS konumu, artı/eksi) şema ile doğrulanır; AST üzerinden iç link doğrulaması kolay. |
| K6 | **Alternatifler elendi:** TinaCMS (Tina Cloud bağımlılığı/self-host GraphQL katmanı – fazla), Decap (SPA admin, React 19 peer'i var ama editör deneyimi zayıf, Markdoc/özel blok desteği zayıf), Payload + Postgres (DB + sunucu + yedekleme = overengineering; brief §46). | Brief: "gereksiz overengineering yok, büyümeye uygun". Postgres'e geçiş gerekirse yalnız `build-content.ts` kaynağı değişir. |
| K7 | **Site içi arama:** build'de `public/search-index.json`; istemcide **MiniSearch** (7.x, ~6 KB gzip) yalnız arama açıldığında `import()` ile yüklenir. Türkçe normalizasyon `src/lib/search-normalize.ts` (indeks ve istemci aynı fonksiyonu kullanır). `/arama` noindex. | Sayfa yükünde 0 KB arama JS'i; bulanık + prefix + alan ağırlığı hazır; elle yazılan Levenshtein'a göre daha az hata riski. |
| K8 | **Route manifest:** `src/lib/routes.ts` tek kaynak (saf fonksiyon, üretilmiş indeks üzerinde). Sitemap, breadcrumb, menü, iç link doğrulaması ve Playwright testleri bunu kullanır. | Brief §38; kardeş proje (`motorcukiyafeti/src/lib/catalog.ts > routeManifest`) deseni. |
| K9 | **Sitemap:** route handler'lar (`/sitemap-index.xml` + grup sitemap'leri). `app/sitemap.ts` **kullanılmaz** (Next'in yerleşik sitemap'i index dosyası üretmez). | Brief §42 grupları; Cache Components'ta `GET` handler'lar runtime verisi okumadıkça prerender edilir. |
| K10 | **Görseller:** yalnız özgün/lisanslı görseller `public/images/{koleksiyon}/{id}/`. Görsel yoksa **tipografik kapak** (SVG/CSS) gösterilir; stok/rakip görseli yok. | Brief §17, §48. Kırık görsel riski 0. |
| K11 | **Analitik/çerez V1'de yok.** Bu yüzden çerez banner'ı yok. Eklenecekse önce `sayfalar/cerez-politikasi`, `kvkk`, `gizlilik` güncellenir ve rıza olmadan çalışmaz (Consent Mode). | CLAUDE.md kural 9. |
| K12 | **Sayfalama V1'de yok** (içerik hacmi küçük; hub'lar tüm çocukları gruplu listeler). `sayfa` segmenti ileride `/…/sayfa/[n]` için **rezerve**. | Çalışmayan sayfalama riski 0; ileride çakışma yok. |

---

## §1 Information Architecture

### 1.1 Seviyeler

```
Ana Sayfa (/)
├── KADIN silo (/kadin)                         ── kadın içerikleri burada yaşar
│   ├── Giyim hub (/kadin/giyim)
│   │   └── Kategori hub (/kadin/giyim/{kategori})
│   │       └── Spoke (/kadin/giyim/{kategori}/{segment})  ← makale veya beden landing'i
│   ├── Beden rehberi (/kadin/beden-rehberi[/{segment}])
│   ├── Stil (/kadin/stil[/{segment}])
│   └── Kombinler (/kadin/kombinler[/{segment}])
├── ERKEK silo (/erkek)  ── kadınla birebir simetrik, bağımsız
├── ORTAK alanlar (silo dışı, cinsiyet-nötr veya iki siloya köprü)
│   ├── /beden-rehberi[/{segment}]   (genel beden sistemleri, ölçü alma)
│   ├── /stil, /kombinler            (yalnız landing: kadın/erkek'e ayrılan kapı; /stil/{segment} ortak stil temelleri)
│   ├── /kumas-rehberi[/{slug}]
│   ├── /markalar, /marka/{slug}
│   ├── /alisveris-rehberi[/{segment}]
│   ├── /trendler[/{segment}]
│   ├── /rehberler[/{segment}]       (tüm rehberlerin dizini + ortak makaleler)
│   ├── /gundem[/{segment}]          (NEWS; yalnız ilk haber yayımlanınca açılır)
│   └── /yazar/{slug}
├── Kurumsal: /hakkimizda /iletisim /editoryal-ilkeler
├── Yasal:    /gizlilik /cerez-politikasi /kvkk
└── Yardımcı: /arama (noindex), 404
```

Maksimum derinlik: 5 segment (`/kadin/giyim/elbise/52-beden` = 4). Her sayfa ana sayfadan ≤ 3 tıkla erişilir (menü → hub → spoke).

### 1.2 Ana navigasyon (brief §3)

| Menü | Hedef | Tip |
|---|---|---|
| KADIN | `/kadin` + mega menü | silo |
| ERKEK | `/erkek` + mega menü | silo |
| BEDEN REHBERİ | `/beden-rehberi` | ortak landing (kadın/erkek'e köprü) |
| STİL | `/stil` | ortak landing (kadın/erkek ayrımı) |
| KOMBİNLER | `/kombinler` | ortak landing (kadın/erkek ayrımı) |
| TRENDLER | `/trendler` | ortak |
| MARKALAR | `/markalar` | ortak dizin |
| ALIŞVERİŞ REHBERİ | `/alisveris-rehberi` | ortak |
| KUMAŞ REHBERİ | `/kumas-rehberi` | ortak |
| REHBERLER | `/rehberler` | ortak dizin |

**Mega menü kuralı:** Menü, taksonomi listesinden değil **route manifest'ten** üretilir. Hub'ı yayımlanmamış kategori menüde görünmez (brief §36: hedefsiz link yok). Örn. V1'de Kadın menüsü yalnız 8 cornerstone kategoriyi gösterir; "Tayt" hub'ı yayımlanınca otomatik eklenir.

Kadın mega menü sütunları: **Giyim** (kategori hub'ları, `order`'a göre) · **Rehberler** (Kadın Beden Rehberi, Kadın Stil, Kadın Kombinler) · **Öne çıkan** (1 kart, `ayarlar/anasayfa.yaml > megaMenuFeatured.kadin`). Erkek aynı yapı.

### 1.3 Kullanıcı yolculukları (iç link tasarımının hedefi)

| Giriş sorusu | Yolculuk |
|---|---|
| "52 beden kaç XL?" | `/kadin/beden-rehberi/52-beden-kac-xl` → `/kadin/beden-rehberi` → `/kadin/giyim/elbise/52-beden` → `/kadin/giyim/elbise/nasil-secilir` → `/kumas-rehberi/viskon` → `/kadin/kombinler/yazlik-…` |
| "4XL hangi bedene denk gelir?" | `/erkek/beden-rehberi/4xl-kac-beden` → `/erkek/giyim/tisort/4xl` → `/erkek/stil/…` → `/marka/{x}` |
| "Viskon mu pamuk mu?" | `/kumas-rehberi/viskon` → `/kumas-rehberi/pamuk` → ilgili kategori hub'ları (silo bağımsız) |
| "Düğünde ne giyebilirim?" | `/kadin/kombinler/dugun-…` → `/kadin/giyim/abiye` → `/kadin/stil/…` |

### 1.4 İçerik yerleşim karar tablosu (hangi içerik nereye?)

| Sorgunun merkezi | Tür | URL |
|---|---|---|
| Tek bir giyim kategorisi ("büyük beden elbise nasıl seçilir") | ARTICLE (silo + kategori) | `/{silo}/giyim/{kategori}/{segment}` |
| Kategori + beden ("52 beden elbise", "4XL tişört") | SIZE_GUIDE (kategori dolu = beden landing) | `/{silo}/giyim/{kategori}/{52-beden \| 4xl}` |
| Beden/ölçü, kategoriden bağımsız ("52 beden kaç XL") | SIZE_GUIDE (kategori boş) | `/{silo}/beden-rehberi/{segment}` veya `/beden-rehberi/{segment}` |
| Vücut tipi / durum / kategoriler arası stil ("basenli pantolon seçimi", "göbekli erkek") | STYLE_GUIDE | `/{silo}/stil/{segment}` |
| Tam kombin (parçalar + neden uyumlu) | OUTFIT_GUIDE | `/{silo}/kombinler/{segment}` |
| Kumaş | FABRIC_GUIDE | `/kumas-rehberi/{slug}` |
| Marka | BRAND_GUIDE | `/marka/{slug}` |
| "Nereden alınır / en iyi markalar" | SHOPPING_GUIDE | `/alisveris-rehberi/{segment}` |
| Sezon trendi | TREND | `/trendler/{segment}` |
| Cinsiyet-nötr terim/kavram ("oversize ne demek") | ARTICLE (silo `ortak`) | `/rehberler/{segment}` |
| Tarihli haber | NEWS | `/gundem/{segment}` |

**Kanibalizasyon kuralı:** Her indekslenebilir belgenin zorunlu `primaryKeyword` alanı normalize edilip site genelinde **benzersiz** olmalı (validate hatası). Örn. "abiye elbise" `/kadin/giyim/abiye` hub'ına aittir; `/kadin/giyim/elbise/abiye` spoke'u açılmaz, elbise hub'ı abiye hub'ına link verir.

---

## §2 Kadın silo haritası

Taksonomi `src/lib/taxonomy.ts` içinde sabit (sıra = menü sırası). ★ = V1 cornerstone hub (brief §34). Diğerleri hub içeriği yazıldığında açılır.

| Key | Etiket | V1 | Örnek spoke'lar (`/kadin/giyim/{key}/…`) |
|---|---|---|---|
| `elbise` | Elbise | ★ | `nasil-secilir`, `52-beden`, `yazlik`, `kislik`, `ofis`, `gobek-bolgesi`, `basenli`, `kisa-boylu`, `dugun` |
| `pantolon` | Pantolon | ★ | `nasil-secilir`, `basenli`, `kumas-pantolon`, `yuksek-bel` |
| `jean` | Jean | ★ | `nasil-secilir`, `kalip-rehberi`, `50-beden` |
| `tayt` | Tayt | | `nasil-secilir` |
| `etek` | Etek | | `nasil-secilir`, `kalem-etek` |
| `tisort` | Tişört | ★ | `nasil-secilir`, `oversize` |
| `gomlek` | Gömlek | ★ | `nasil-secilir`, `ofis` |
| `bluz` | Bluz | | `nasil-secilir` |
| `triko` | Triko | ★ | `nasil-secilir`, `kislik` |
| `hirka` | Hırka | ★ | `nasil-secilir`, `uzun-hirka` |
| `sweatshirt` | Sweatshirt | | `nasil-secilir` |
| `ceket` | Ceket | | `nasil-secilir`, `blazer` |
| `mont` | Mont | | `nasil-secilir` |
| `kaban` | Kaban | | `nasil-secilir` |
| `abiye` | Abiye | ★ | `nasil-secilir`, `dugun`, `nisan`, `54-beden` |
| `ic-giyim` | İç Giyim | | `sutyen-beden-olcusu` |
| `ev-giyimi` | Ev Giyimi | | `pijama-takimi` |

Silo bölümleri (sabit, kod): `/kadin/beden-rehberi` (örn. `42-66-beden-tablosu`, `52-beden-kac-xl`, `olcu-nasil-alinir`), `/kadin/stil` (`basenli`, `buyuk-gogus`, `kisa-boylu`, `uzun-boylu`, `ofis-stili`, `dugun-stili`, `pantolon-secimi`), `/kadin/kombinler` (`gunluk`, `ofis`, `yaz`, `kis`, `dugun`, `jean`, `triko`, `abiye`).

Örnek breadcrumb: Ana Sayfa › Kadın › Giyim › Elbise › 52 Beden Elbise.

## §3 Erkek silo haritası

| Key | Etiket | V1 | Örnek spoke'lar (`/erkek/giyim/{key}/…`) |
|---|---|---|---|
| `tisort` | Tişört | ★ | `nasil-secilir`, `4xl`, `5xl`, `6xl`, `oversize` |
| `polo` | Polo | | `nasil-secilir` |
| `gomlek` | Gömlek | ★ | `nasil-secilir`, `4xl`, `ofis`, `kisa-kollu` |
| `pantolon` | Pantolon | ★ | `nasil-secilir`, `yuksek-bel`, `kumas-pantolon` |
| `jean` | Jean | ★ | `nasil-secilir`, `kalip-rehberi` |
| `esofman` | Eşofman | | `nasil-secilir` |
| `sweatshirt` | Sweatshirt | | `nasil-secilir` |
| `triko` | Triko | ★ | `nasil-secilir`, `kazak-mi-hirka-mi` |
| `hirka` | Hırka | ★ | `nasil-secilir` |
| `mont` | Mont | ★ | `nasil-secilir`, `kislik` |
| `takim-elbise` | Takım Elbise | | `nasil-secilir`, `dugun` |

Silo bölümleri: `/erkek/beden-rehberi` (`xl-8xl-beden-tablosu`, `4xl-kac-beden`, `olcu-nasil-alinir`), `/erkek/stil` (`gobekli-erkek`, `gomlek-secimi`, `smart-casual`, `ofis`, `gunluk`), `/erkek/kombinler` (`gunluk`, `ofis`, `smart-casual`, `yaz`, `kis`, `jean`, `gomlek`).

Örnek breadcrumb: Ana Sayfa › Erkek › Giyim › Tişört › 4XL Tişört.

**Simetri ama kopya değil:** Erkek hub'ları kadın metinlerinden türetilmez; aynı şablon, ayrı içerik. Aynı `segment` iki siloda kullanılabilir (`/kadin/giyim/jean/nasil-secilir` ve `/erkek/giyim/jean/nasil-secilir`), başlık/primaryKeyword farklı olmak zorunda.

---

## §4 URL / route haritası

### 4.1 Genel URL kuralları
- Yalnız küçük harf ASCII, `-` ayraç: `^[a-z0-9]+(?:-[a-z0-9]+)*$`, segment ≤ 60 karakter. Türkçe karakter translitere (ı→i, ş→s, ğ→g, ü→u, ö→o, ç→c).
- Sonda `/` yok (Next varsayılanı, `/x/` → `/x` 308). Query parametreli URL'ler indekslenmez (`?q=` yalnız `/arama`).
- Canonical: `https://buyukbeden.net` + path, her zaman self. `canonical` override yalnız manifest'teki başka bir URL'ye izinli; override'lı sayfa sitemap'e girmez.
- Slug değişirse eski path belgeye `redirectFrom[]` olarak eklenir → `next.config.ts > redirects()` (308) üretilmiş `src/generated/redirects.json`'dan okur. Legacy: `/index.html`→`/`, `/kadin.html`→`/kadin`, `/erkek.html`→`/erkek`, `/markalar.html`→`/markalar`, `/rehber.html`→`/rehberler`.

### 4.2 Dosya yapısı (`src/app`)

```
src/app/
  layout.tsx                 # kök: <html lang="tr">, fontlar, globals.css. Runtime veri YOK.
  not-found.tsx              # 404 (Header/Footer'ı kendisi render eder)
  robots.ts
  sitemap-index.xml/route.ts # + sitemap.xml/route.ts (aynı index, alias)
  sitemap-{pages,women,men,size-guides,brands,fabrics,guides}.xml/route.ts
  (site)/
    layout.tsx               # export const ensureStatic = "navigation"; Header, Footer, SkipLink
    page.tsx                 # /
    kadin/ ...  erkek/ ...   # aşağıdaki tablo (iki klasör ayrı; sayfalar ortak şablonu silo sabitiyle çağırır)
    beden-rehberi/ stil/ kombinler/ kumas-rehberi/ markalar/ marka/ alisveris-rehberi/ trendler/ rehberler/ yazar/ arama/
    hakkimizda/ iletisim/ editoryal-ilkeler/ gizlilik/ cerez-politikasi/ kvkk/
  keystatic/                 # admin (ensureStatic YOK, (site) dışında)
    layout.tsx               # metadata.robots = noindex,nofollow; <KeystaticApp/>
    keystatic.tsx            # "use client"; makePage(config)
    [[...params]]/page.tsx   # return null
  api/keystatic/[...params]/route.ts   # makeRouteHandler({ config })
keystatic.config.ts          # repo kökünde
```

`kadin/` ve `erkek/` klasörleri ayrı tutulur (kökte `[silo]` dinamik segmenti **yok**; statik rotalarla çakışma ve 404 riski olmasın). Her `page.tsx` 3–5 satırlık sarmalayıcıdır: `export default (p) => <CategoryHubPage silo="kadin" {...p} />`.

### 4.3 Rota tablosu

S = statik (parametresiz) · G = `generateStaticParams` + bilinmeyende `notFound()` · İçerik kaynağı parantezde.

| Route | Tür | Şablon | İçerik kaynağı | Sitemap grubu | Index |
|---|---|---|---|---|---|
| `/` | S | Home | `ayarlar/anasayfa.yaml` | pages | ✔ |
| `/kadin`, `/erkek` | S | SiloHome | `sayfalar/kadin`, `sayfalar/erkek` | women / men | ✔ |
| `/kadin/giyim`, `/erkek/giyim` | S | ClothingHub | `sayfalar/kadin-giyim`, `sayfalar/erkek-giyim` | women / men | ✔ |
| `/kadin/giyim/[kategori]` | G | CategoryHub | `hublar/kadin-{kategori}` | women | ✔ |
| `/kadin/giyim/[kategori]/[slug]` | G | Article / SizeLanding | `makaleler`, `beden-rehberleri` (silo=kadin, hub=kategori) | women | ✔ |
| `/kadin/beden-rehberi` | S | SectionLanding | `sayfalar/kadin-beden-rehberi` | women | ✔ |
| `/kadin/beden-rehberi/[slug]` | G | SizeGuide | `beden-rehberleri` (silo=kadin, hub boş) | women | ✔ |
| `/kadin/stil` · `/kadin/stil/[slug]` | S · G | SectionLanding · Article(STYLE) | `sayfalar/kadin-stil` · `stil-rehberleri` | women | ✔ |
| `/kadin/kombinler` · `/kadin/kombinler/[slug]` | S · G | SectionLanding · Outfit | `sayfalar/kadin-kombinler` · `kombinler` | women | ✔ |
| `/erkek/...` | — | kadınla birebir aynı 7 desen | silo=erkek | men | ✔ |
| `/beden-rehberi` · `/beden-rehberi/[slug]` | S · G | SharedLanding · SizeGuide | `sayfalar/beden-rehberi` · `beden-rehberleri` (silo=ortak) | size-guides | ✔ |
| `/stil` · `/stil/[slug]` | S · G | SplitLanding · Article(STYLE) | `sayfalar/stil` · `stil-rehberleri` (silo=ortak) | guides | ✔ |
| `/kombinler` | S | SplitLanding (kadın/erkek'e ayrılır; ortak kombin yok) | `sayfalar/kombinler` | guides | ✔ |
| `/kumas-rehberi` · `/kumas-rehberi/[slug]` | S · G | Directory · Fabric | `sayfalar/kumas-rehberi` · `kumaslar` | fabrics | ✔ |
| `/markalar` · `/marka/[slug]` | S · G | Directory · Brand | `sayfalar/markalar` · `markalar` | brands | ✔ |
| `/alisveris-rehberi` · `/[slug]` | S · G | Directory · Article(SHOPPING) | `sayfalar/alisveris-rehberi` · `alisveris-rehberleri` | guides | ✔ |
| `/trendler` · `/trendler/[slug]` | S · G | Directory · Article(TREND) | `sayfalar/trendler` · `trendler` | guides | ✔ |
| `/rehberler` · `/rehberler/[slug]` | S · G | Directory (tüm türler) · Article | `sayfalar/rehberler` · `makaleler` (silo=ortak) | guides | ✔ |
| `/gundem` · `/gundem/[slug]` | S · G | Directory · Article(NEWS) | `gundem` | guides | ✔ — **klasör ilk haberle eklenir** |
| `/yazar/[slug]` | G | Author | `yazarlar` | guides | ✔ |
| `/hakkimizda` `/iletisim` `/editoryal-ilkeler` | S | Static | `sayfalar/{key}` | pages | ✔ |
| `/gizlilik` `/cerez-politikasi` `/kvkk` | S | Legal | `sayfalar/{key}` | pages | ✔ |
| `/arama` | S | Search (istemci `useSearchParams` Suspense içinde) | `public/search-index.json` | — | ✘ noindex |
| `/keystatic/**`, `/api/keystatic/**` | dinamik | Admin | — | — | ✘ (robots + meta) |

**Dinamik rota zorunluluğu:** `generateStaticParams` boş dönemez → validate, manifest'teki her dinamik rota ailesi için ≥1 yayımlanmış belge arar; yoksa açıklayıcı hata ("`/erkek/kombinler/[slug]` için içerik yok: içerik ekle veya klasörü kaldır"). V1'de tüm aileler seed içerikle başlar; `/gundem` hariç (klasör ilk NEWS ile eklenir; NEWS belgesi varken klasör yoksa validate hata verir).

### 4.4 Slug / çakışma kuralları (validate hatası)

1. **Hesaplanan URL site genelinde benzersiz** (tüm türler, tüm silolar tek Set).
2. Kategori spoke'u: `(silo, kategori, segment)` benzersiz. Farklı silo/kategoride aynı segment serbest.
3. Rezerve segmentler (hiçbir `segment`/`slug` bunları alamaz): `sayfa`, `etiket`, `arama`, `api`, `keystatic`, `giyim`, `beden-rehberi`, `stil`, `kombinler`, `index`, ve aynı silodaki tüm kategori key'leri (`/kadin/giyim/elbise/abiye` gibi hub ile karışan spoke yasak).
4. Beden landing segment deseni (kategori dolu SIZE_GUIDE): kadın `^(4[2-9]|5\d|6[0-6])-beden$`; erkek `^([2-8]?xl)$` veya `^\d{2}-beden$`. Bu desene uyan segment **yalnız** SIZE_GUIDE olabilir.
5. Keystatic dizin adı (`id`) koleksiyon içinde benzersizdir ve URL değildir; URL'nin son parçası ayrı `segment` alanıdır (aynı `nasil-secilir` birden fazla kategoride kullanılabilsin diye). Marka, kumaş, yazar, hub ve sayfalarda `id` = URL slug'ı.
6. Hub id biçimi zorunlu: `{silo}-{kategori}` (örn. `kadin-elbise`). Sayfa id'leri sabit listeden (`taxonomy.ts > LANDING_KEYS`).
7. `redirectFrom` path'leri manifest'te olamaz, zincir/döngü olamaz.
8. Uyarı: silo yollarında segment `buyuk-beden-` ile başlıyorsa (URL zaten bağlam veriyor).

### 4.5 `src/lib/routes.ts` (tek kaynak)

```ts
type RouteGroup = "pages" | "women" | "men" | "size-guides" | "brands" | "fabrics" | "guides" | "utility";
type RouteEntry = {
  path: string;            // "/kadin/giyim/elbise/52-beden"
  parent: string | null;   // breadcrumb zinciri buradan (ör. "/kadin/giyim/elbise")
  label: string;           // breadcrumb/menü etiketi (breadcrumbTitle ?? title)
  group: RouteGroup;       // sitemap dosyası
  kind: "home" | "landing" | "hub" | "doc" | "entity" | "author" | "utility";
  silo: "kadin" | "erkek" | "ortak";
  index: boolean;          // false → sitemap'e girmez, meta noindex
  lastModified?: string;   // ISO, updatedAt
  ref?: { collection: Collection; id: string };
};
export function buildRouteManifest(index: ContentIndex): RouteEntry[]; // saf; script + app paylaşır
export const routeManifest: () => RouteEntry[];   // app: üretilmiş indeks üzerinde memo
export function pathFor(doc: AnyDoc): string;     // tek URL üretici (Link'ler bunu kullanır, elle string yok)
export function breadcrumbFor(path: string): RouteEntry[];
export function hasRoute(path: string): boolean;
```

Kural: Bileşenlerde elle URL string'i yazılmaz; `pathFor()`/`hasRoute()` kullanılır. `<SmartLink>` hedef manifest'te değilse **dev'de hata fırlatır**, prod build'de link yerine düz metin basar (ama validate zaten build öncesi düşürür).

---

## §6 İçerik tipi şeması (zod düzeyi)

Dosya: `src/content/schema.ts` (zod v4). `build-content.ts` her dosyayı bununla parse eder. Ortak tipler:

```ts
Silo   = z.enum(["kadin","erkek","ortak"])
Slug   = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(60)
IsoDate= z.iso.date()                     // "2026-10-07"
Path   = z.string().regex(/^\/[a-z0-9\-\/]*$/)   // iç path, manifest'te doğrulanır
Source = z.object({ url: z.url(), type: z.enum(["resmi-marka","standart","uretici","arastirma","perakende","editoryal-olcum","diger"]), label: z.string().min(3), checkedAt: IsoDate })
Image  = z.object({ src: z.string().startsWith("/images/"), alt: z.string().min(5), credit: z.string().optional() })  // dosya varlığı validate'te
Faq    = z.object({ q: z.string().min(8).max(160), a: z.string().min(20) /* inline Markdoc: link + vurgu */ })
Seo    = z.object({ title: z.string().max(60).optional(), description: z.string().min(70).max(160), canonical: Path.optional(), index: z.boolean().default(true), ogImage: Image.optional() })
ShoppingCta = z.object({ enabled: z.boolean().default(false), url: z.url(), label: z.string().min(10), context: z.string().max(200), verifiedAt: IsoDate })  // url host = settings.shoppingCta.domain
```

### 6.1 Base (tüm editoryal belgeler: ARTICLE, SIZE_GUIDE, STYLE_GUIDE, OUTFIT_GUIDE, SHOPPING_GUIDE, TREND, NEWS, CATEGORY_HUB, LANDING, BRAND_GUIDE, FABRIC_GUIDE)

| Alan | Tip | Zorunlu | Not |
|---|---|---|---|
| `id` | Slug (dizin adı) | ✔ | Dosyadan türetilir |
| `type` | enum | ✔ | Koleksiyondan türetilir (frontmatter'da yazılmaz) |
| `status` | `draft \| published \| archived` | ✔ | draft → hiç üretilmez; archived → 200 kalır, ana sayfa/related dışı, "Arşiv" bandı |
| `title` | string 10–110 | ✔ | H1. Site genelinde benzersiz |
| `breadcrumbTitle` | string ≤ 40 | | Örn. "52 Beden Elbise" |
| `segment` | Slug | ✔* | *Yalnız id ≠ URL olan türlerde (makale, beden/stil/alışveriş rehberi, kombin, trend, gündem) |
| `excerpt` | string 80–220 | ✔ | Kart + meta description yedeği |
| `shortAnswer` | string 40–400 (inline Markdoc) | ARTICLE, SIZE_GUIDE, STYLE_GUIDE, FABRIC_GUIDE, SHOPPING_GUIDE'da ✔ | Sayfa başında "Kısa cevap" kutusu; AEO |
| `body` | Markdoc | ✔ | §6.4 |
| `author` | ref `yazarlar` | ✔ | |
| `reviewedBy` | ref `yazarlar` | | Yalnız gerçek kişi |
| `publishedAt` / `updatedAt` | IsoDate | ✔ | `updatedAt ≥ publishedAt`, gelecekte olamaz |
| `featuredImage` | Image | | Yoksa tipografik kapak |
| `silo` | Silo | ✔ | |
| `hub` | ref `hublar` | koşullu | Kategori spoke'unda ✔; hub'ın silosu = belgenin silosu |
| `topics` | `z.array(Topic).min(1).max(4)` | ✔ | Kontrollü liste: `beden-olcu, kalip, kumas, stil, kombin, marka, alisveris, trend, bakim, ozel-gun, vucut-tipi, terim` |
| `tags` | `z.array(Slug).max(10)` | | Serbest ama normalize; arama + related |
| `sizes` | `z.array(z.string()).max(8)` | | `"52"`, `"4XL"` – related + arama |
| `fabrics` / `brands` | ref[] `kumaslar` / `markalar` | | Related + otomatik "ilgili kumaş/marka" blokları |
| `related` | `z.array(Path).max(8)` | | Elle seçim (URL path yapıştırılır); manifest'te olmalı; karşı silo yasak (ortak hariç) |
| `faq` | `z.array(Faq).max(10)` | | ≥2 ise FAQPage JSON-LD |
| `sources` | `z.array(Source)` | koşullu | sizeCharts/teknik/marka verisi varsa min 1 |
| `primaryKeyword` | string | index'liyse ✔ | Site genelinde benzersiz (normalize) |
| `seo` | Seo | ✔ (description) | |
| `shoppingCta` | ShoppingCta | | Global flag kapalıysa render edilmez |
| `redirectFrom` | `Path[]` | | 308 |

### 6.2 Tür bazlı ek alanlar

| Tür | Koleksiyon | Ek alanlar |
|---|---|---|
| **ARTICLE** | `makaleler` | `silo` kadin/erkek ise `hub` ✔; ortak ise hub yok → `/rehberler/{segment}` |
| **CATEGORY_HUB** | `hublar` | `category: CategoryKey` (taxonomy), `order: int`, `menuLabel`, `intro` (inline Markdoc ≤ 600), `subtopics: {key, label, description}[]` (hub içi gruplama: "Kullanım alanına göre", "Kalıba göre"…; çocuklar `subtopic` alanıyla bağlanır), `featured: Path[] ≤ 6`, `sizeGuides: Path[]`, `relatedHubs: ref[]` (aynı silo) |
| **LANDING** | `sayfalar` | `key: LandingKey` (sabit liste), `intro`, `featured: Path[]`. Kurumsal/yasal sayfalar da burada (`kind: "landing" \| "kurumsal" \| "yasal"`) |
| **SIZE_GUIDE** | `beden-rehberleri` | `hub` (doluysa beden landing), `sizes` ✔, `sizeSystem: ("TR"\|"EU"\|"UK"\|"US"\|"harf")[]`, `sizeCharts: ref[] beden-tablolari` (landing'de ≥1), `measurementSteps: {part: "gogus"\|"bel"\|"basen"\|"omuz"\|"ic-bacak"\|"kol", text}[]` |
| **STYLE_GUIDE** | `stil-rehberleri` | `bodyFocus: string[]` (ör. "basen", "göbek" – saygılı dil), `occasion: string[]` |
| **OUTFIT_GUIDE** | `kombinler` | silo ✔ (ortak yasak), `season: ("ilkbahar"\|"yaz"\|"sonbahar"\|"kis"\|"4-mevsim")[]`, `occasion: string[]`, `pieces: {role: "ust"\|"alt"\|"tek-parca"\|"dis-giyim"\|"ayakkabi"\|"aksesuar", name, hub?: ref, fabric?: ref, color?: string, alternatives: string[]}[]` (min 2), `whyItWorks` (inline Markdoc ✔), `fitFor` (string) |
| **SHOPPING_GUIDE** | `alisveris-rehberleri` | `criteria: {label, description}[]` (min 3), `picks: {brand: ref markalar, why, bestFor, caveats?, sources: Source[] min 1}[]` — fiyat/puan alanı **yok** |
| **TREND** | `trendler` | `season: string` ("2026 Sonbahar-Kış"), `validUntil?: IsoDate` (geçince validate uyarı → arşivle) |
| **NEWS** | `gundem` | `eventDate: IsoDate`, `sources` min 1 |
| **BRAND_GUIDE** | `markalar` | Brand varlığı (§6.3) + Base gövde |
| **FABRIC_GUIDE** | `kumaslar` | Fabric varlığı (§6.3) + Base gövde |

### 6.3 Varlıklar

**Brand** (`content/markalar/{slug}/index.mdoc`) – doğrulanamayan alan `null` + `unverified[]`'a eklenir; UI'da alan **gizlenir** (uydurma yok).

| Alan | Tip | Not |
|---|---|---|
| `name` | string | |
| `website` | url \| null | resmi site |
| `country` | string \| null | menşe |
| `genders` | `("kadin"\|"erkek")[]` | min 1 |
| `sizeRange` | `{ kadin?: {from, to, system: "TR"\|"harf"}, erkek?: {...} }` \| null | `sources` zorunlu |
| `priceSegment` | `"ekonomik"\|"orta"\|"ust"\|"premium"` \| null | editoryal sınıflama; `sources` veya `basis` metni |
| `categories` | CategoryKey[] | |
| `fitNotes` | string \| null | kalıp karakteri |
| `availabilityTR` | `{ online: boolean\|null, stores: boolean\|null, notes?: string }` | |
| `highlights`, `pros`, `cons` | string[] | özgün cümle |
| `alternatives` | ref[] markalar | |
| `relatedGuides` | Path[] | |
| `unverified` | string[] | alan adları |
| `lastVerifiedAt` | IsoDate | 365 gün uyarısı |

**Fabric** (`content/kumaslar/{slug}/index.mdoc`)

| Alan | Tip | Not |
|---|---|---|
| `name`, `aliases[]` | string | "likra" ↔ "elastan" ilişkisi `aliases` + gövdede açıklanır |
| `kind` | `"lif"\|"kumas-yapisi"\|"apre"` | viskon=lif, penye/scuba/gabardin/denim=yapı, şardonlu=apre |
| `origin` | `"dogal"\|"yari-sentetik"\|"sentetik"\|"karisim"` \| null | |
| `feel` | string | his |
| `stretch`, `breathability`, `warmth`, `wrinkle` | `"dusuk"\|"orta"\|"yuksek"` \| null | nitel; kaynaklı |
| `seasons` | Season[] | |
| `care` | `{ washMaxC: number\|null, tumbleDry: boolean\|null, iron: "dusuk"\|"orta"\|"yuksek"\|null, notes? }` | |
| `pros`, `cons`, `uses` (CategoryKey[]) | | |
| `plusSizeNotes` | inline Markdoc ✔ | büyük beden seçimine etkisi |
| `sources` | Source[] min 1 | teknik değer varsa |

**SizeChart** (`content/beden-tablolari/{id}.yaml`)

| Alan | Tip | Not |
|---|---|---|
| `id`, `title`, `caption` | | caption tabloya `<caption>` |
| `silo` | Silo | |
| `scope` | `"genel"\|"ust-giyim"\|"alt-giyim"\|"elbise"\|"ic-giyim"` | |
| `kind` | `"donusum"\|"olcu-cm"` | |
| `columns` | `{ key, label, unit?: "cm"\|"inch" }[]` (2–10) | ilk sütun satır başlığı (`<th scope=row>`) |
| `rows` | `string[][]` | her satır uzunluğu = columns |
| `approximate` | boolean | true → "Yaklaşık değerler; markaya göre değişir" notu zorunlu render |
| `notes` | string[] | |
| `sources` | Source[] **min 1** | kaynaksız tablo yok |

**Author** (`content/yazarlar/{slug}.yaml`): `name`, `isTeam: boolean` (Editör Ekibi), `role` (gerçek unvan; uydurma uzmanlık yok), `bio` (60–600), `avatar?: Image`, `sameAs: url[]` (yalnız gerçek profiller), `expertiseTopics: Topic[]`.

### 6.4 Markdoc gövde sözleşmesi (`src/content/markdoc.config.ts`)

| Yapı | Sözdizimi | Render | Kural |
|---|---|---|---|
| Başlık | `##`, `###`, `####` | `<h2 id>` (Türkçe slugify id) | `#` (H1) yasak; H2 ≥ 2 ise İçindekiler |
| Paragraf, liste, vurgu, alıntı | standart | | |
| Link | `[metin](/kadin/giyim/elbise)` veya `(#baslik-id)` | `<Link>` / dış: `rel="noopener"` + yeni sekme **değil** | İç path manifest'te, anchor belgede yoksa **hata**; `http://buyukbeden.net/...` mutlak iç link hata (relative zorunlu) |
| Tablo | `{% table %}` (Keystatic tablo editörü) | `<ResponsiveTable>` | `caption` attr önerilir; ilk sütun sticky |
| Beden tablosu | `{% beden-tablosu id="kadin-ust-tr-eu" /%}` | `<SizeChartTable>` + kaynak satırı | id `beden-tablolari`'nda olmalı |
| Not kutusu | `{% not tip="bilgi\|ipucu\|dikkat" baslik="…" %}…{% /not %}` | `<Callout>` | |
| Artı / eksi | `{% arti-eksi %}` (içinde 2 liste) `{% /arti-eksi %}` | `<ProsCons>` | tam 2 liste |
| Adımlar | `{% adimlar %}` (numaralı liste) | `<Steps>` | |
| İlgili kart | `{% ilgili yol="/kumas-rehberi/viskon" /%}` | `<InlineRelated>` | manifest'te olmalı |
| SSS konumu | `{% sss /%}` | `faq` alanını burada render eder | yoksa gövde sonunda |
| Alışveriş CTA konumu | `{% alisveris-cta /%}` | `<RelatedShoppingCTA>` | yoksa CTA (açıksa) "İlgili içerikler" öncesinde |
| Görsel | `![alt](/images/...)` | `next/image` | dosya var + alt ≥ 5 karakter |

Keystatic tarafında aynı etiketler `@keystatic/core/content-components` (`block`, `wrapper`) ile tanımlanır; build tarafında `Markdoc.validate()` + kendi kontrollerimiz. `build-content` gövdeyi `Markdoc.transform()` ile **serileştirilebilir renderable tree**'ye çevirir; RSC'de `Markdoc.renderers.react(tree, React, { components })`.

### 6.5 Site ayarları ve ana sayfa (singleton)

**`content/ayarlar/site.yaml`**

| Alan | Tip | Varsayılan |
|---|---|---|
| `siteName` | string | "Buyukbeden.net" |
| `siteUrl` | url | `https://buyukbeden.net` |
| `tagline` | string | "Türkiye'nin büyük beden moda ve stil rehberi" |
| `defaultOgImage` | Image | `/images/og/varsayilan.png` |
| `organization` | `{ name, legalName?, logo: Image, sameAs: url[], email }` | |
| `shoppingCta` | `{ enabled: boolean, domain: "buyukbedengiyim.com", homepageSection: boolean, utm?: {source, medium} }` | **`enabled: false`, `homepageSection: false`** |
| `popularSearches` | string[] ≤ 8 | arama boş durum önerileri |
| `analytics` | `{ ga4Id: string \| null }` | `null` (K11) |
| `editorialEmail` | email | iletişim |

`RelatedShoppingCTA` render koşulu: `site.shoppingCta.enabled && doc.shoppingCta?.enabled && host(doc.shoppingCta.url) === site.shoppingCta.domain`. Link `rel="noopener"`, anchor `doc.shoppingCta.label` (validate: aynı label site genelinde ≤ 3 kez – anchor çeşitliliği).

**`content/ayarlar/anasayfa.yaml`**

| Alan | Tip |
|---|---|
| `hero` | `{ primary: Path, secondary: Path[] (2) }` |
| `sections` | `{ key: HomeSectionKey, enabled: boolean, title?: string, items: Path[] }[]` (sıra = dizideki sıra) |
| `megaMenuFeatured` | `{ kadin?: Path, erkek?: Path }` |

`HomeSectionKey`: `kadin`, `erkek`, `bedenini-tani`, `editorun-sectikleri`, `cok-okunanlar`, `stil`, `kombinler`, `trendler`, `marka-dosyalari`, `kumas`, `alisveris`, `yeni-icerikler`, `buyukbedengiyim-secimler`.
- `items` boşsa otomatik doldurulur (tür/silo filtresi + `updatedAt` sırası); `yeni-icerikler` her zaman otomatik.
- `cok-okunanlar` gerçek trafik verisi olmadan **açılamaz** (validate: `enabled: true` ise `items` dolu ve `site.analytics.ga4Id` dolu olmalı) → sahte popülerlik yok.
- `buyukbedengiyim-secimler` yalnız `site.shoppingCta.homepageSection` true ise.
- Bölümde < 2 öğe varsa bölüm render edilmez (boş bölüm yok).

---

## §7 CMS şeması (Keystatic) ve içerik dizini

### 7.1 Dizin yapısı

```
content/
  ayarlar/
    site.yaml                         singleton  "Site Ayarları"
    anasayfa.yaml                     singleton  "Ana Sayfa"
  sayfalar/{key}/index.mdoc           LANDING + kurumsal + yasal (key sabit liste)
  hublar/{silo}-{kategori}/index.mdoc CATEGORY_HUB
  makaleler/{id}/index.mdoc           ARTICLE
  beden-rehberleri/{id}/index.mdoc    SIZE_GUIDE
  stil-rehberleri/{id}/index.mdoc     STYLE_GUIDE
  kombinler/{id}/index.mdoc           OUTFIT_GUIDE
  alisveris-rehberleri/{id}/index.mdoc SHOPPING_GUIDE
  trendler/{id}/index.mdoc            TREND
  gundem/{id}/index.mdoc              NEWS
  markalar/{slug}/index.mdoc          BRAND_GUIDE (+ Brand)
  kumaslar/{slug}/index.mdoc          FABRIC_GUIDE (+ Fabric)
  beden-tablolari/{id}.yaml           SizeChart
  yazarlar/{slug}.yaml                Author
public/images/{koleksiyon}/{id}/*.{avif,webp,jpg}   (Keystatic image alanlarının hedefi)
src/generated/                        (gitignore) content-index.json, docs/*.json, redirects.json
public/search-index.json              (gitignore) arama indeksi
```

`.mdoc` dosyası = YAML frontmatter + Markdoc gövde (Keystatic `format: { contentField: "body" }`). `LandingKey` listesi: `kadin, erkek, kadin-giyim, erkek-giyim, kadin-beden-rehberi, erkek-beden-rehberi, kadin-stil, erkek-stil, kadin-kombinler, erkek-kombinler, beden-rehberi, stil, kombinler, kumas-rehberi, markalar, alisveris-rehberi, trendler, rehberler, hakkimizda, iletisim, editoryal-ilkeler, gizlilik, cerez-politikasi, kvkk` (+ `gundem` ilk haberle). Statik sayfa varsa içeriği zorunlu (validate).

### 7.2 `keystatic.config.ts` eşlemesi

| Keystatic | Ad (admin) | path | slugField / özel |
|---|---|---|---|
| singleton | Site Ayarları | `content/ayarlar/site` | `format: "yaml"` |
| singleton | Ana Sayfa | `content/ayarlar/anasayfa` | |
| collection | Sayfalar | `content/sayfalar/*/` | `key` = `fields.select(LANDING_KEYS)`; yeni kayıt oluşturma yalnız listedeki key'ler |
| collection | Kategori Hub'ları | `content/hublar/*/` | `silo` + `category` select (taksonomi); id `{silo}-{kategori}` |
| collection | Makaleler / Beden Rehberleri / Stil Rehberleri / Kombinler / Alışveriş Rehberleri / Trendler / Gündem | `content/{dir}/*/` | `title` = `fields.slug` (id) + ayrı `segment` (`fields.text`, slug validasyonu) |
| collection | Markalar / Kumaşlar | `content/{dir}/*/` | `name` = `fields.slug` (id = URL) |
| collection | Beden Tabloları | `content/beden-tablolari/*` | `format: "yaml"`; `columns` = array(object); `rows` = array(array(text)) |
| collection | Yazarlar | `content/yazarlar/*` | `format: "yaml"` |

Alan eşleme: string→`fields.text`, enum→`fields.select/multiselect`, tarih→`fields.date`, ref→`fields.relationship({ collection })`, Path[]→`fields.array(fields.text({ validation: { pattern } }))`, Image→`fields.image({ directory: "public/images/{koleksiyon}", publicPath: "/images/{koleksiyon}/" })` + alt `fields.text`, gövde→`fields.markdoc({ options: { table: true, image: {...} }, components })`, koşullu (hub sadece kadin/erkek'te)→ validate'te kontrol (Keystatic `conditional` yerine; dosya biçimi sade kalsın). `columns.label` ve `entryLayout: "content"` editörde gövdeyi öne çıkarır.

Keystatic select seçenekleri `src/lib/taxonomy.ts`'ten import edilir (tek kaynak). Yeni kategori key'i eklemek = taksonomiye 1 satır (nadiren); hub açmak/kapatmak, menü sırası, tüm içerik = CMS'ten.

### 7.3 Yayın akışı

```
Editör /keystatic (prod, GitHub OAuth)  →  commit (main veya dal)  →  Vercel build
  └ npm run build = prebuild: build-content (zod + link + ref + thin kontrol) → next build (ensureStatic doğrular)
      ├ hata → deploy başarısız, canlı site önceki sürümde kalır (bozuk içerik canlıya çıkamaz)
      └ yeşil → canlı
```
- Prod storage: `{ kind: "github", repo: "cemusab/buyukbeden-net" }`; dev: `{ kind: "local" }` (`process.env.NODE_ENV` ile seçilir). Env: `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` (Keystatic kurulum sihirbazı GitHub App'i oluşturur).
- Büyük değişiklikler Keystatic'in dal özelliğiyle → PR → Vercel preview (preview'da robots `Disallow: /` + `X-Robots-Tag: noindex`).
- GitHub Action (`.github/workflows/validate.yml`): push/PR'da `npm run validate` – editöre hızlı geri bildirim.
- Admin güvenliği: GitHub yazma yetkisi olmayan kimse kayıt yapamaz. Admin hiçbir sayfadan linklenmez; `robots.txt` Disallow + layout `noindex,nofollow`; sitemap'te yok; crawler testinde hariç.

### 7.4 Build boru hattı (`scripts/build-content.ts`, `tsx`)

1. `content/**` oku → frontmatter (yaml) + gövde ayır.
2. zod parse (tür şeması). Hata mesajı: `dosya:alan → mesaj`.
3. Markdoc parse + `validate` (özel etiket şeması).
4. Ref çözümle (author, hub, brands, fabrics, sizeCharts) → kırık ref hata.
5. `pathFor` ile URL hesapla → `buildRouteManifest` → benzersizlik + rezerve + rota ailesi kontrolleri.
6. Tüm iç linkleri (gövde AST + `related` + `featured` + hero + FAQ cevapları) manifest'e ve anchor'lara karşı doğrula.
7. Kalite kontrolleri (§19.1).
8. Related skorlarını hesapla (§8.2), okuma süresi (kelime/200), TOC.
9. Yaz: `src/generated/content-index.json` (gövdesiz metadata + related + toc), `src/generated/docs/{collection}__{id}.json` (renderable tree), `src/generated/redirects.json`, `public/search-index.json`.
10. Çıktı: özet tablo (tür başına sayı, uyarılar). `--check` bayrağı: yazmadan yalnız doğrula (`npm run validate`).

`src/lib/content.ts` (`import "server-only"`): `getSettings()`, `getHomepage()`, `getDoc(collection,id)`, `getByPath(path)`, `listDocs(filter)`, `getHubChildren(hubId)`, `getRelated(doc)`, `getBrand/getFabric/getSizeChart/getAuthor`, `getBody(collection,id)` (statik `import()` haritası). Sayfalar yalnız bunu çağırır.

`package.json` scripts:
```
"content": "tsx scripts/build-content.ts",
"validate": "tsx scripts/build-content.ts --check",
"dev": "tsx scripts/dev.ts",            // content üret + content/ izle (fs.watch recursive) + next dev başlat
"prebuild": "npm run content",
"build": "next build",
"test:e2e": "playwright test",
"qa": "npm run validate && npm run build && playwright test"
```
Bağımlılıklar: `@keystatic/core`, `@keystatic/next`, `@markdoc/markdoc`, `yaml`, `minisearch`; dev: `@axe-core/playwright`.

---

## §8 Internal linking ve related-content motoru

### 8.1 Yapısal linkler (otomatik, orphan önleyici)

| Sayfa | Zorunlu çıkış linkleri |
|---|---|
| Her belge | Breadcrumb (manifest `parent` zinciri) · ebeveyn hub/landing · yazar |
| Kategori hub | Tüm yayımlanmış çocukları (subtopic gruplu) · silonun beden rehberi · silonun stil + kombin landing'i · `relatedHubs` · kategoriye `uses` ile bağlı kumaşlar · kategoriye bağlı markalar |
| Silo landing | Silodaki tüm hub'lar ve bölümler |
| Kumaş | `uses` kategorilerinin **her iki silodaki** hub'ları (ortak varlık → cross-link meşru) |
| Marka | `genders`'a göre ilgili silo hub'ları · alternatifler · `relatedGuides` |
| Ortak landing (`/stil`, `/kombinler`, `/beden-rehberi`) | Kadın ve erkek bölümüne eşit ağırlıkta iki kapı |

Her belge ebeveyninde listelendiği için **orphan yapısal olarak imkânsız**; validate yine de link grafiğinde gelen link sayısı 0 olan indekslenebilir URL'yi hata sayar.

Elle linkler (gövde): Bir belge en az 3 bağlamsal iç link içermeli (uyarı < 3). Anchor metni hedefin `primaryKeyword`'ünün birebir aynısı olmak zorunda değil; aynı anchor+hedef çifti site genelinde > 5 ise uyarı.

### 8.2 Related skorlama algoritması

Hesap build'de yapılır, sonuç `content-index.json`'a yazılır. Kaynak belge `s`, aday `c`:

```
aday havuzu: yayımlanmış, index=true, archived değil, c ≠ s, c ∉ s.related(elle)
1) SİLO KATMANI (sözlük sırasının ilk anahtarı – skorla aşılamaz)
   s.silo = kadin/erkek:  c.silo = s.silo → tier 0 · c.silo = ortak → tier 1 · karşı silo → ELENİR
   s.silo = ortak:        c.silo = ortak → tier 0 · kadin/erkek → tier 1 (sonuçta kadın/erkek dengeli: dönüşümlü sıralama)
2) KONU/KATEGORİ SKORU (topic)
   +40 aynı hub (kategori)
   +25 hub'lar birbirinin relatedHubs listesinde
   +12 × ortak topic sayısı (en fazla 3)
   +15 × ortak marka, +15 × ortak kumaş, +12 × ortak beden (sizes)
3) ETİKET SKORU
   +20 × Jaccard(s.tags, c.tags)
4) DÜZELTMELER
   +5  c.type ≠ s.type (çeşitlilik)
   −10 c.updatedAt > 18 ay önce
   eşitlikte: updatedAt yeni olan önce, sonra title (deterministik)
sıralama: (tier ASC, score DESC, updatedAt DESC, title ASC); score < 15 olan aday blok dışı
```

Bloklar (her biri boşsa **render edilmez**; aynı belge sayfada bir kez görünür – yukarıdan aşağı dağıtım):

| Blok | Kaynak | Adet |
|---|---|---|
| "Bunu da okuyun" | elle `related` önce, sonra skor sıralı karışık | 4 |
| "Aynı kategoriden" | aynı hub çocukları | 4 |
| "İlgili beden rehberleri" | type=SIZE_GUIDE (aynı silo → ortak) | 3 |
| "Kombin önerileri" | type=OUTFIT_GUIDE (yalnız aynı silo) | 3 |
| "İlgili kumaşlar" | `s.fabrics` + gövdede linklenen kumaşlar | 4 |
| "İlgili markalar" | `s.brands`, sonra hub kategorisinde bulunan markalar | 4 |

Elle `related`'de karşı silo hedefi **hata** (ortak hedef serbest). Gövdede kadın→erkek link uyarı (ortak rehberlerde mantıklı cross-link serbest).

---

## §T Tasarım sistemi (brief §30–32)

**Yön:** premium editoryal dergi; sıcak nötr zemin, mürekkep siyahı tipografi, tek marka vurgusu (kiremit). Pembe/mavi yok. Bol beyaz alan, ince çizgiler, gölge yok denecek kadar az.

### T.1 Renk token'ları

| Token | Hex | Kullanım | Kontrast |
|---|---|---|---|
| `paper` | `#FBF9F6` | sayfa zemini | – |
| `surface` | `#FFFFFF` | kart, menü paneli, tablo | – |
| `sand` | `#F1ECE4` | bant bölümler, tipografik kapak, tablo zebra | – |
| `line` | `#E4DED5` | ayraç, kart kenarı | – |
| `ink` | `#1C1B1A` | metin, başlık, birincil buton | 16.4:1 (paper) |
| `ink-2` | `#45413D` | ikincil metin | 9.6:1 |
| `muted` | `#6B665F` | meta, tarih | 5.4:1 (sand üstünde 4.8) |
| `accent` | `#9E3F2A` (kiremit) | marka vurgusu, link hover, eyebrow, focus halkası | 6.6:1 (white), 5.4 (accent-soft) |
| `accent-soft` | `#F5E6DF` | "Kısa cevap" kutusu zemini | – |
| `silo-kadin` | `#5B6236` (zeytin) | yalnız kadın alanı işaretleri | 6.5:1 (white) |
| `silo-erkek` | `#2F3E46` (gece mavisi-arduvaz) | yalnız erkek alanı işaretleri | 11.1:1 (white) |
| `ok` / `warn` | `#2E6B4F` / `#8A5A00` | not kutuları (ipucu/dikkat) | ≥ 5.6:1 |

Koyu tema V1'de yok (editoryal açık tema; kapsam dışı).

### T.2 Kadın / erkek ayrımı (renk klişesi olmadan)
1. Header'da **silo sekmesi**: Kadın/Erkek menü öğesinin altında 2 px çizgi (aktif silo).
2. Silo sayfalarında başlık üstünde **eyebrow**: `KADIN · GİYİM` / `ERKEK · STİL` (silo token rengi, büyük harf, `lang="tr"` sayesinde doğru İ).
3. Silo hub'larının hero'sunda sol kenarda 4 px dikey silo çizgisi; kartlarda eyebrow rengi silo tonu.
4. Breadcrumb her zaman "Kadın"/"Erkek" içerir. Ortak sayfalarda eyebrow `accent` rengindedir.
Silo tonu asla büyük zemin rengi olarak kullanılmaz.

### T.3 Tipografi (`next/font/google`, `subsets: ["latin", "latin-ext"]`, `display: "swap"`)
- **Display/başlık:** Fraunces (variable: `wght` 400–700, `opsz`), CSS değişkeni `--font-display`. H1–H3, pull quote, logo wordmark.
- **Gövde/UI:** Hanken Grotesk (variable `wght` 400–700), `--font-sans`.
- İkisi de `latin-ext` (ğ, ş, ı, İ) içerir — font-data ile doğrulandı.

| Ölçek | Değer | Font / satır yüksekliği |
|---|---|---|
| `display` | `clamp(2.25rem, 1.6rem + 3.2vw, 4rem)` | Fraunces 600 / 1.05, `-0.01em` |
| `h1` | `clamp(2rem, 1.5rem + 2.4vw, 3.25rem)` | Fraunces 600 / 1.1 |
| `h2` | `clamp(1.5rem, 1.25rem + 1.2vw, 2.125rem)` | Fraunces 600 / 1.2 |
| `h3` | `clamp(1.2rem, 1.1rem + .5vw, 1.5rem)` | Fraunces 600 / 1.3 |
| `lead` | `1.1875rem` | Hanken 400 / 1.6 |
| `body` (makale) | `1.0625rem` (17 px) | Hanken 400 / 1.7, ölçü `68ch` |
| `ui` | `0.9375rem` | Hanken 500 / 1.4 |
| `small` | `0.8125rem` | Hanken 400 / 1.5 |
| `eyebrow` | `0.75rem` | Hanken 600, uppercase, `0.14em` |

### T.4 Boşluk, ızgara, bileşen
- 4 px taban; bölüm arası `56 / 80 / 112 px` (mobil / tablet / masaüstü). Container `max-w 1240px`, gutter `16 / 24 / 32 px`. Okuma sütunu `720px`; makale masaüstünde `720px` + sağda `280px` yapışkan İçindekiler.
- Breakpoint'ler Tailwind varsayılan (`sm 640, md 768, lg 1024, xl 1280`); mega menü `lg`'den itibaren, altında çekmece.
- Radius: `2px` kart/görsel (editoryal keskin), `6px` input/panel, `999px` chip/etiket. Gölge yalnız açık menü panelinde (`0 12px 32px rgb(28 27 26 / .08)`).
- **EditorialCard:** görsel 4:5 (dikey, öne çıkan) veya 3:2 (liste); eyebrow (silo · tür) → başlık (Fraunces 1.25rem) → excerpt (2 satır kırpma) → meta (`Güncellendi 7 Eki 2026 · 6 dk`). Tüm kart tek `<a>` (stretched link), hover'da başlık altı çizgi.
- **CompactCard:** numara/küçük görsel + başlık (liste/sidebar).
- **TypeCover:** görsel yoksa `sand` zemin, büyük Fraunces başlık parçası, silo çizgisi — `aria-hidden`, alt gerekmez.
- **Button:** birincil `ink` zemin/`paper` metin; ikincil çerçeveli; link-buton altı çizili. Min dokunma alanı 44×44.
- **Focus:** `outline: 2px solid var(--color-accent); outline-offset: 2px` her etkileşimli öğede.
- **ResponsiveTable:** `<div role="region" aria-label={caption} tabIndex={0} class="overflow-x-auto">`, ilk sütun `sticky left-0 bg-surface`, sayılar `tabular-nums`, sağ kenarda kaydırma ipucu gölgesi; sayfa yatay taşmaz.

### T.5 Tailwind v4 token'ları (`src/app/globals.css`)

```css
@import "tailwindcss";
@theme {
  --color-paper: #FBF9F6;  --color-surface: #FFFFFF; --color-sand: #F1ECE4; --color-line: #E4DED5;
  --color-ink: #1C1B1A;    --color-ink-2: #45413D;   --color-muted: #6B665F;
  --color-accent: #9E3F2A; --color-accent-soft: #F5E6DF;
  --color-silo-kadin: #5B6236; --color-silo-erkek: #2F3E46;
  --color-ok: #2E6B4F; --color-warn: #8A5A00;
  --font-display: var(--font-fraunces), Georgia, serif;
  --font-sans: var(--font-hanken), system-ui, sans-serif;
  --text-display: clamp(2.25rem, 1.6rem + 3.2vw, 4rem);
  --text-h1: clamp(2rem, 1.5rem + 2.4vw, 3.25rem);
  --text-h2: clamp(1.5rem, 1.25rem + 1.2vw, 2.125rem);
  --text-h3: clamp(1.2rem, 1.1rem + .5vw, 1.5rem);
  --text-body: 1.0625rem; --text-eyebrow: 0.75rem;
  --radius-card: 2px; --radius-panel: 6px;
  --container-page: 1240px; --container-prose: 720px;
}
body { background: var(--color-paper); color: var(--color-ink); font-family: var(--font-sans); }
```
Scaffold'daki Geist ve `prefers-color-scheme: dark` kaldırılır; `<html lang="tr">`.

---

## §9 Ana sayfa wireframe (mobil önce; `lg` farkları köşeli parantezde)

```
┌───────────────────────────────────────────┐
│ [≡]   buyukbeden.net (Fraunces)     [⌕]   │ Header (sticky, 56px) [lg: logo sol, arama alanı sağ,
│                                           │  altında 10 öğeli nav satırı; Kadın/Erkek mega menü]
├───────────────────────────────────────────┤
│ Türkiye'nin büyük beden moda ve stil      │ <h1> (Fraunces, display ölçeği)
│ rehberi                                   │
│ ┌───────────────────────────────────────┐ │ HERO: hero.primary (4:5 görsel/TypeCover)
│ │  görsel                               │ │ [lg: 2/3 primary + 1/3 iki secondary dikey]
│ └───────────────────────────────────────┘ │
│ KADIN · BEDEN REHBERİ                     │
│ 52 beden kaç XL? Tüm karşılıklar          │ hero kart başlığı = H2
│ excerpt…                                  │
│ [secondary kart] [secondary kart]         │ secondary kart başlıkları = H3
├───────────────────────────────────────────┤
│ ( Kadın )( Erkek )  ← iki büyük kapı      │ Silo kapıları: her biri silo landing'e, altında
│  Elbise · Pantolon · Jean · Triko …       │  yayımlı hub chip'leri (yatay kaydırma)
├───────────────────────────────────────────┤
│ BEDENİNİ TANI                             │ sand bant: 3 kart (kadın tablo, erkek tablo,
│ [Kadın beden tablosu][Erkek XL–8XL][Ölçü] │  ölçü alma) + "Beden rehberine git →"
├───────────────────────────────────────────┤
│ EDİTÖRÜN SEÇTİKLERİ   (yatay kaydırmalı) │ 4–6 EditorialCard [lg: 4 sütun]
├───────────────────────────────────────────┤
│ ÇOK OKUNANLAR  (yalnız analitik varken)   │ numaralı CompactCard 1–5
├───────────────────────────────────────────┤
│ STİL REHBERLERİ  [Kadın | Erkek] sekme    │ sekme = iki <a> değil, aynı sayfada 2 liste
│ KOMBİNLER        [Kadın | Erkek]          │  (CSS/radio veya küçük client; JS'siz ikisi
│                                           │  alt alta görünür)  + "Tümünü gör →" landing'e
├───────────────────────────────────────────┤
│ TRENDLER · MARKA DOSYALARI · KUMAŞ        │ her biri 3 kart + "Tümünü gör →"
│ ALIŞVERİŞ REHBERLERİ                      │ [lg: 3 sütun]
├───────────────────────────────────────────┤
│ (BUYUKBEDENGİYİM.COM'DAN SEÇİMLER)        │ flag kapalı → DOM'da yok
├───────────────────────────────────────────┤
│ YENİ İÇERİKLER  (8, updatedAt sırası)     │ CompactCard liste
├───────────────────────────────────────────┤
│ Footer: Kadın / Erkek / Rehberler sütun-  │ yalnız manifest linkleri; yasal + kurumsal;
│ ları, kurumsal, yasal, © 2026             │  "Satış sitesi değiliz" editoryal not
└───────────────────────────────────────────┘
```
H1: hero üstündeki konumlandırma cümlesi ("Türkiye'nin büyük beden moda ve stil rehberi"); bölüm başlıkları H2, kart başlıkları H3.

## §10 Kadın giyim hub wireframe (`/kadin/giyim`)

```
┌───────────────────────────────────────────┐
│ Ana Sayfa › Kadın › Giyim                 │ Breadcrumb (yatay kaydırılabilir, son öğe aria-current)
│ ▌KADIN · GİYİM                            │ zeytin silo çizgisi + eyebrow
│ Büyük beden kadın giyim rehberi           │ H1
│ ┌ KISA CEVAP ───────────────────────────┐ │ shortAnswer (accent-soft)
│ └───────────────────────────────────────┘ │
├───────────────────────────────────────────┤
│ KATEGORİLER                               │ grid 2 sütun [md 3, lg 4]: hub kartı
│ [Elbise][Pantolon][Jean][Triko]…          │  (TypeCover/görsel + ad + "N rehber")
├───────────────────────────────────────────┤
│ Bedenini seç                              │ beden chip'leri: yalnız yayımlı beden
│ (46)(48)(50)(52)(54)… → landing/rehber    │  landing'leri/rehberleri (hedefsiz chip yok)
│ [Kadın beden rehberi →]                   │
├───────────────────────────────────────────┤
│ intro + gövde (Markdoc):                  │ "Büyük beden kadın giyim nedir", beden seçimi,
│  ## Doğru bedeni bulmak  ## Kalıp…        │  kalıp, kumaş (tablolar, not kutuları)
├───────────────────────────────────────────┤
│ POPÜLER REHBERLER (featured)              │ EditorialCard ×4
│ YENİ EKLENENLER (silo, updatedAt)         │ CompactCard ×6
├───────────────────────────────────────────┤
│ STİL  │ KOMBİN │ KUMAŞ │ MARKA            │ 4 mini blok, her biri 3 link + "Tümü →"
├───────────────────────────────────────────┤
│ SSS (accordion <details>)                 │ faq
│ Yazar kutusu · Son güncelleme             │
└───────────────────────────────────────────┘
```
`/kadin` (silo ana sayfası) farkı: kategori grid'i yerine 4 kapı (Giyim, Beden Rehberi, Stil, Kombinler), her kapının altında 3 güncel içerik; gövde kısa, "kadın alanında neler var" odaklı. İki sayfa arasında metin tekrarı yok.

## §11 Erkek giyim hub wireframe (`/erkek/giyim`)

Kadınla aynı iskelet, bağımsız içerik; farklar:
```
│ ▌ERKEK · GİYİM  (arduvaz silo çizgisi)    │
│ Büyük beden erkek giyim rehberi           │ H1
│ KISA CEVAP                                │
│ KATEGORİLER  [Tişört][Gömlek][Pantolon]…  │
│ Bedenini seç  (XL)(2XL)(3XL)(4XL)(5XL)(6XL)… │ harf bedenleri (yalnız yayımlı hedefler)
│ [Erkek beden rehberi →] [XL–8XL tablosu →]│
│ gövde: beden seçimi, kalıp (regular/rahat)│
│ öne çıkanlar: 4XL/5XL/6XL içerikleri       │ "4XL+ rehberleri" şeridi
│ STİL (smart casual, göbekli erkek…) │ KOMBİN │ KUMAŞ │ MARKA │
│ SSS · Yazar · Güncelleme                  │
```

## §12 Kategori hub şablonu (`/{silo}/giyim/{kategori}`)

```
Breadcrumb: Ana Sayfa › Kadın › Giyim › Elbise
eyebrow (silo · Giyim) · H1 (hub.title) · lead (hub.intro)
KISA CEVAP (shortAnswer)
İçindekiler (H2 ≥ 2; mobilde <details>, lg sağda yapışkan)
Hızlı yollar: [Nasıl seçilir] [52 beden] [Yazlık] … ← hub çocuklarından featured, chip
Gövde: nedir · nasıl seçilir · beden/kumaş/kalıp seçimi · kullanım alanları (tablo/callout)
"Bu kategorideki rehberler" — subtopic grupları (H2 her grup), her grupta EditorialCard/CompactCard
İlgili beden rehberleri (hub.sizeGuides + otomatik)
Kombinler (aynı silo, hub ile ilgili)
Kumaşlar (Fabric.uses ∋ kategori)
Markalar (Brand.categories ∋ kategori ve genders ∋ silo)
İlgili kategoriler (relatedHubs, aynı silo)
SSS → Yazar kutusu (yazar, yayın, güncelleme) → Kaynaklar (varsa)
(RelatedShoppingCTA – flag + belge açıksa)
JSON-LD: BreadcrumbList + ItemList (çocuk URL'leri) [+ FAQPage]
```
Thin hub kuralı: gövde ≥ 600 kelime **veya** ≥ 3 yayımlı çocuk; aksi validate hatası (hub yayımlanamaz → menüde de görünmez).

## §13 Makale şablonu (ARTICLE / STYLE / SHOPPING / TREND / NEWS / OUTFIT)

```
Breadcrumb
eyebrow (silo · tür/kategori)
H1
Meta satırı: Yazar (→ /yazar/x) · Yayın <time> · Güncelleme <time> · N dk okuma
[Arşiv bandı: status=archived | TREND validUntil geçti]
KISA CEVAP kutusu
Öne çıkan görsel (16:9 / TypeCover) + figcaption/credit
İçindekiler
Gövde (Markdoc; tablolar, notlar, artı/eksi, adımlar, ilgili kartlar)
  OUTFIT ek: "Parçalar" listesi (role, kumaş→link, hub→link, alternatifler) + "Neden uyumlu" + mevsim/etkinlik rozetleri
  SHOPPING ek: "Nasıl değerlendirdik" (criteria) + picks kartları (marka→/marka/x, neden, kime uygun, dikkat, kaynak) — fiyat/puan yok
SSS ({% sss /%} konumu veya sonda)
(RelatedShoppingCTA)
Kaynaklar (sources: etiket, tür, kontrol tarihi)
Yazar kutusu (bio, profil linki)
Related blokları (§8.2 sırası)
Ebeveyn hub'a dönüş linki ("Elbise rehberinin tamamı →")
JSON-LD: Article + BreadcrumbList [+ FAQPage]
```

## §14 Beden rehberi şablonu (SIZE_GUIDE; landing varyantı dahil)

```
Breadcrumb (… › Kadın › Beden Rehberi › 52 Beden Kaç XL)  |  landing: … › Elbise › 52 Beden Elbise
H1 · meta satırı
KISA CEVAP (örn. "52 beden çoğu markada 3XL–4XL aralığına denk gelir; …" — tablo kaynağına dayanır)
Hızlı karşılık kartı: sizes → [TR 52] [EU] [UK] [US] [Harf] (yalnız kaynaklı tablo değerleri; yoksa kart yok)
Beden tabloları (sizeCharts): ResponsiveTable + caption + "Yaklaşık" notu + kaynak satırı
Ölçü nasıl alınır (measurementSteps; numaralı adımlar + SVG şema)
Gövde: sistemler arası fark, markaya göre sapma, kalıp etkisi
Landing varyantı ek: kalıp önerileri · kumaş önerileri (→ kumaş) · stil önerileri (→ stil) · bu bedende kombinler
Komşu bedenler: ‹ 50 beden | 54 beden › (yalnız yayımlı olanlar)
SSS · Kaynaklar (zorunlu) · Yazar · Related
JSON-LD: Article + BreadcrumbList [+ FAQPage]
```
Beden landing kalite eşiği (validate hatası): gövde ≥ 900 kelime, `sizeCharts` ≥ 1, `faq` ≥ 3, iç link ≥ 5.

## §15 Marka sayfası şablonu (`/marka/{slug}`)

```
Breadcrumb: Ana Sayfa › Markalar › {Marka}
eyebrow MARKA DOSYASI · H1 "{Marka}: büyük beden rehberi" (title)
KISA CEVAP (yoksa excerpt)
Künye kartı (dl/dt/dd) — yalnız dolu ve doğrulanmış alanlar:
  Ülke · Kadın/Erkek · Beden aralığı (kaynak) · Fiyat segmenti · Kategoriler (→ hub) ·
  Kalıp karakteri · Türkiye'de erişim (online/mağaza) · Resmi site (dış link) · Son doğrulama
  unverified alanlar: gösterilmez; kartın altında "Bazı bilgiler doğrulanıyor" notu (alan adı listesi yok)
Hakkında (gövde)
Öne çıkanlar · Artı / Eksi (ProsCons)
Alternatif markalar (kartlar)
İlgili rehberler (relatedGuides + bu markayı brands'inde içeren belgeler, silo dengeli)
Kaynaklar · Yazar · Güncelleme
JSON-LD: Article (about: {@type: Organization, name, url: website}) + BreadcrumbList
```
Logo kullanılmaz (lisans); marka adı tipografik. `/markalar`: A–Z dizin + filtre chip'leri (Kadın / Erkek — istemci tarafı gizle/göster, URL değişmez) + ItemList JSON-LD.

---

## §16 SEO / AEO / GEO planı

### 16.1 Metadata (`generateMetadata`, `params` Promise – `await params`)
| Öğe | Kural |
|---|---|
| `metadataBase` | `new URL(settings.siteUrl)` (kök layout) |
| `title` | `seo.title ?? title`; şablon `"%s | Buyukbeden.net"` (ana sayfa `absolute`) ; site genelinde benzersiz (validate) |
| `description` | `seo.description` (70–160), benzersiz |
| `alternates.canonical` | `seo.canonical ?? path` |
| `robots` | `index && status!=="draft"` → `index,follow`; aksi `noindex,follow`; `/arama` noindex; preview ortamı global noindex |
| `openGraph` | `type: "article"` (belge) / `"website"`; `locale: "tr_TR"`, `siteName`, `images: [seo.ogImage ?? featuredImage ?? defaultOgImage]` (1200×630), `publishedTime`, `modifiedTime`, `authors` |
| `twitter` | `card: "summary_large_image"` |
| Tek H1 | Şablon garantisi; Markdoc'ta `#` yasak |

### 16.2 JSON-LD (yalnız izinli tipler)
`<script type="application/ld+json">` + `JSON.stringify(x).replace(/</g, "\\u003c")`; `src/lib/jsonld.ts` tip korumalı builder'lar. **İzinli:** `Article`, `BreadcrumbList`, `Organization`, `Person`, `ItemList`, `FAQPage`. **Yasak:** `Product`, `Offer`, `AggregateRating`, `Review` (+ test ile doğrulanır).

| Sayfa | Şema |
|---|---|
| `/` | Organization (name, url, logo, sameAs) |
| Belge sayfaları (tüm editoryal türler, marka, kumaş) | Article (headline, description, image, datePublished, dateModified, author → Person / Organization(Editör Ekibi), publisher → Organization, mainEntityOfPage, inLanguage "tr-TR") + BreadcrumbList |
| Hub / landing / dizin | BreadcrumbList + ItemList (listelenen URL'ler, position) |
| `/yazar/x` | Person (name, jobTitle yalnız gerçekse, sameAs, worksFor Organization) + BreadcrumbList |
| SSS | FAQPage yalnız sayfada görünür ≥ 2 soru varsa ve metin birebir aynıysa (rich result beklentisi yok; AEO için) |

### 16.3 AEO / GEO
- Her rehberde üstte **Kısa cevap** (1–3 cümle, doğrudan cevap); ardından tanım, tablo, adımlar, artı/eksi, karşılaştırma, SSS (uygun olanlar; robotik şablon yok).
- Tablolar gerçek `<table>` + `<caption>` + `<th scope>` (LLM ve snippet okunabilirliği).
- Görünür "Son güncelleme", yazar, kaynaklar listesi; `lastVerifiedAt` (marka/kumaş/tablo).
- `primaryKeyword` + soru biçimli H2'ler (§35 soruları); "büyük beden" yoğunluk uyarısı (> 1 / 120 kelime).
- `/llms.txt` (route handler, P4 opsiyonel): site açıklaması + ana hub ve cornerstone URL listesi manifest'ten.
- Faceted: `/markalar` filtreleri URL üretmez; `/arama?q=` noindex + robots Disallow.

### 16.4 robots.ts
```
production:  User-agent: *  Allow: /
             Disallow: /keystatic  Disallow: /api/  Disallow: /arama?
             Sitemap: https://buyukbeden.net/sitemap-index.xml
preview/dev: User-agent: *  Disallow: /     (+ next.config headers: X-Robots-Tag: noindex, VERCEL_ENV !== "production")
```
(`/arama` sayfasının kendisi taranabilir kalır ki `noindex` meta'sı görülsün; yalnız sorgulu URL'ler engellenir.)

## §17 Sitemap planı

| URL | İçerik (manifest `group`) |
|---|---|
| `/sitemap-index.xml` | `<sitemapindex>`: aşağıdaki 7 dosya, her biri `lastmod` = gruptaki en yeni `updatedAt` |
| `/sitemap.xml` | aynı index (alias; botların varsayılan tahmini) |
| `/sitemap-pages.xml` | `/`, kurumsal, yasal, `/rehberler`, `/stil`, `/kombinler` |
| `/sitemap-women.xml` | `/kadin/**` |
| `/sitemap-men.xml` | `/erkek/**` |
| `/sitemap-size-guides.xml` | `/beden-rehberi`, `/beden-rehberi/*` |
| `/sitemap-brands.xml` | `/markalar`, `/marka/*` |
| `/sitemap-fabrics.xml` | `/kumas-rehberi`, `/kumas-rehberi/*` |
| `/sitemap-guides.xml` | `/alisveris-rehberi/**`, `/trendler/**`, `/rehberler/*`, `/stil/*`, `/gundem/**`, `/yazar/*` |

Kurallar: yalnız `index === true`, canonical = self, status 200 olan manifest girdileri; mutlak URL; `lastmod` ISO tarih; `priority`/`changefreq` yok. Uygulama: `src/lib/sitemap.ts > renderUrlset(group)`/`renderIndex()`; her `app/sitemap-*.xml/route.ts` 3 satır `GET` → `new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } })`. Runtime veri okumadıkları için build'de prerender edilir. Grup boşsa dosya yine geçerli boş `<urlset>` döner ama index'e eklenmez.

---

## Site içi arama (brief §19) – uygulama notu

- **İndeks** (`public/search-index.json`, build): `{ id, t: title, u: url, g: group, s: silo, x: excerpt≤140, k: keywords (tags + sizes + kategori etiketi + kumaş/marka adları + aliases), h: H2 başlıkları }`. Gruplar: `kadin`, `erkek`, `beden`, `stil`, `kombin`, `marka`, `kumas`, `alisveris`, `trend`, `rehber`. Eşleme: silo giyim içeriği/hub → kadin/erkek; SIZE_GUIDE → beden; STYLE → stil; OUTFIT → kombin; BRAND → marka; FABRIC → kumas; SHOPPING → alisveris; TREND/NEWS → trend; diğer ortak → rehber.
- **Normalizasyon** (`normalizeTr`): `toLocaleLowerCase("tr")` → `ı,i̇→i ş→s ğ→g ü→u ö→o ç→c â→a î→i û→u` → noktalama boşluk. Beden birleştirme: `/(\d)\s*x\s*l\b/`→`$1xl`, `xxl→2xl`, `xxxl→3xl`, `xxxxl→4xl`; `"52 beden"` korunur. Eş anlamlılar (sorgu genişletme): `tshirt|t-shirt→tisort`, `plus size|battal→buyuk beden`, `bayan→kadin`, `bay→erkek`, `esofman takimi→esofman`. Durak kelimeler: `ve, ile, icin, bir, mi, mu`.
- **MiniSearch**: `fields: ["t","k","h","x"]`, `boost: { t: 3, k: 2.5, h: 1.5, x: 1 }`, `prefix: true`, `fuzzy: (term) => term.length > 5 ? 0.25 : term.length > 3 ? 1 : 0`, `processTerm: normalizeTr`, `combineWith: "AND"` (0 sonuçta otomatik `"OR"` ile tekrar). Sorguda `kadin`/`erkek` varsa token düşülür, o silo `boostDocument ×2` ve grup sırası başa.
- **UI:** Header'da `<form action="/arama" method="get" role="search">` + `<input name="q">` (JS'siz çalışır). JS ile: odaklanınca indeks `fetch` + `import("minisearch")`; ARIA combobox/listbox, ≤ 5 sonuç/grup, ≤ 30 toplam, ok tuşları + Enter, Esc kapatır; mobilde tam ekran dialog. `/arama`: aynı motor, tüm sonuçlar gruplu, boş/0 sonuçta `popularSearches` + beden rehberi kapıları.
- **Test sorguları** (search.spec): `52 beden`, `4XL`, `4 xl`, `büyük beden elbise`, `kadın 52 beden pantolon`, `erkek 5XL gömlek`, `erkek 5xl gomlek`, `viskon`, `viskn` (typo), `oversize`, `düğün kombini`, `dugun kombin`, `erkek smart casual`.

---

## §19 QA / test planı

### 19.1 `npm run validate` (build öncesi; hata = kırmızı)
**Hatalar:** zod şema · yinelenen id/URL/title/seo.title/seo.description/primaryKeyword · kırık ref (yazar, hub, marka, kumaş, tablo) · kırık iç link/anchor (gövde, related, featured, hero, FAQ) · mutlak iç link · eksik görsel dosyası/alt · Markdoc'ta H1 · rezerve/desen dışı slug · boş rota ailesi · statik sayfanın `sayfalar` içeriği eksik · hub silosu ≠ belge silosu · karşı silo elle related · OUTFIT silo=ortak · thin hub / beden landing eşiği · kaynaksız tablo/marka beden aralığı/kumaş teknik değeri · `updatedAt < publishedAt` veya gelecekte · yasak ifadeler (`çok yakında`, `yapım aşamasında`, `coming soon`, `lorem`, `TODO`, `href="#"`) · CTA url'si yanlış domain · redirect döngüsü/çakışması · `cok-okunanlar` analitiksiz açık · yasak JSON-LD tipi kaynak kodda (`grep Product|Offer|AggregateRating` src/lib/jsonld.ts).
**Uyarılar:** featuredImage yok · excerpt/description uzunluğu · < 3 bağlamsal iç link · "büyük beden" yoğunluğu · `lastVerifiedAt` > 365 gün · TREND `validUntil` geçti · aynı anchor+hedef > 5 · kadın→erkek gövde linki.

### 19.2 Playwright (`playwright.config.ts`: `desktop` = Desktop Chrome, `mobile` = Pixel 7; `webServer: next start` prod build üzerinde)

| Spec | Doğrular |
|---|---|
| `crawl.spec.ts` (yalnız desktop, seri) | Tohum: `/` + `sitemap-index.xml` → tüm alt sitemap'ler. Her iç URL: status 200 (manifest dışı 3xx yalnız `redirects.json`'dakiler), boş/`#`/`javascript:` href, kırık anchor, kırık görsel (`naturalWidth 0`), console error/pageerror, etiketsiz buton, **tek H1**, `<title>` + description var ve crawl genelinde benzersiz, canonical = self mutlak URL, manifest `index` ile `robots` meta uyumlu (kazara noindex yok), JSON-LD parse edilir ve `@type` ⊂ izinli liste, `Product/Offer/AggregateRating` yok, OG title/image var, `/keystatic` linki yok |
| `manifest.spec.ts` | `routeManifest()` (üretilmiş indeksten okunur) her path 200; sitemap URL kümesi = manifest'in index'li kümesi (fazla/eksik yok); rastgele 20 bilinmeyen slug (her dinamik aileden) → 404; `redirects.json` her kaynak → tek 308 → 200 |
| `seo.spec.ts` | `robots.txt` içeriği; `/sitemap-index.xml` geçerli XML; `/arama` noindex; `/keystatic` noindex meta; 404 sayfası `noindex` + 404 status |
| `nav.spec.ts` | Masaüstü: Kadın/Erkek mega menü klavye ile açılır (Enter/Space), Esc kapatır, focus geri döner, panel linkleri manifest'te; aktif silo göstergesi. Mobil: çekmece açılır/kapanır, focus trap, akordeon; body scroll kilidi |
| `silo.spec.ts` | Kadın belgelerinde related bloklarında `/erkek/` linki yok (ve tersi); breadcrumb zinciri manifest `parent` ile aynı; BreadcrumbList JSON-LD ile görünür breadcrumb eşleşir |
| `templates.spec.ts` | Hub / makale / beden rehberi / marka / kumaş / yazar: zorunlu bölümler (Kısa cevap, meta satırı, yazar linki, kaynaklar, related); mobilde `document.documentElement.scrollWidth <= innerWidth` (tablolar taşmaz), tablo bölgesi klavyeyle odaklanabilir |
| `search.spec.ts` | §Arama test sorguları beklenen grup + URL'yi ilk 5'te döndürür; JS kapalıyken form `/arama?q=` sonuç gösterir; klavye gezinmesi |
| `a11y.spec.ts` | `@axe-core/playwright` (wcag2a, wcag2aa) ana sayfa + her şablondan 1 örnek, 0 ihlal; görünür focus |
| `cta.spec.ts` | Flag kapalıyken `buyukbedengiyim.com` linki sitede **yok** |

### 19.3 Performans / erişilebilirlik (P5)
Mobil Lighthouse (ana sayfa, hub, makale, beden rehberi): Perf > 90, A11y > 95, BP > 95, SEO > 95 — `npx lighthouse` script'i (`scripts/lighthouse.ts`), sonuç `docs/durum.md`'ye. İstemci JS bütçesi: arama (lazy), mega menü/çekmece, sekmeler; başka `"use client"` yok. `next/image` AVIF/WebP, LCP görseli `priority`, diğerleri lazy. Fontlar 2 variable dosya.

### 19.4 Tamamlanma (brief §51)
`npm run qa` yeşil = 0 istenmeyen 404/500, 0 kırık link/anchor/görsel, 0 boş href, 0 placeholder, 0 console error; sitemap = manifest; robots doğru.

---

## §20 Geliştirme yol haritası

Paralel agent'lar: **A** = frontend, **C** = içerik, **S** = SEO, **Q** = QA. Her adımın sonunda `npm run qa` yeşil.

| Faz | İş | Sahip | Bitti tanımı |
|---|---|---|---|
| **P1a** Altyapı | Bağımlılıklar; `taxonomy.ts`, `content/schema.ts`, `markdoc.config.ts`, `build-content.ts` (+`--check`), `content.ts`, `routes.ts`, `scripts/dev.ts`; `.gitignore` (`src/generated`, `public/search-index.json`); `(site)` group + `ensureStatic`; kök layout (lang tr, fontlar, token'lar) | A | Boş-olmayan seed (1 yazar, site/anasayfa ayarları, 2 hub, 2 makale) ile build + validate yeşil |
| **P1b** CMS | `keystatic.config.ts` (tüm koleksiyonlar §7.2), `/keystatic` + API route, local mod; GitHub App kurulumu (sahip onayıyla) | A | Admin'den kayıt → dosya → `npm run dev` yeniden üretir; prod build geçer |
| **P1c** Kabuk | Header (logo, arama formu, nav), Kadın/Erkek mega menü, mobil çekmece, Footer, Breadcrumb, SkipLink, 404, EditorialCard/CompactCard/TypeCover, Callout/ProsCons/ResponsiveTable/SizeChartTable | A | nav.spec + a11y.spec yeşil |
| **P1d** Ana sayfa | §9, `anasayfa.yaml` bölümleri, otomatik doldurma, boş bölüm gizleme | A | crawl yeşil |
| **P2** Silolar | `/kadin`, `/erkek`, `/{silo}/giyim`, kategori hub, bölüm landing'leri, ortak landing'ler, makale/beden/marka/kumaş/yazar şablonları, related motoru, arama (indeks + dialog + `/arama`) | A | templates/silo/search spec'leri yeşil |
| **P3** Cornerstone | `docs/icerik-plani.md` §18'deki ~40 sayfa; marka dizini (doğrulanmış alanlarla), 14 kumaş, beden tabloları (kaynaklı), stil/kombin rehberleri | C | validate 0 hata, uyarılar gözden geçirilmiş |
| **P4** SEO | metadata, JSON-LD builder'ları, sitemap route'ları, robots, redirects (legacy dahil), llms.txt (ops.), internal link denetimi | S | seo.spec + manifest.spec yeşil |
| **P5** QA & yayın | Tam crawl (desktop+mobile), Lighthouse, axe, Vercel env (Keystatic GitHub), preview noindex, domain, `docs/durum.md` | Q | §19.4 kriterleri; production deploy |

Sonraki aşamalar (V1 sonrası): sayfalama (`/sayfa/[n]`, liste > 30), GA4 + rıza (yasal metinler önce), içerik kümeleri genişletme, buyukbedengiyim.com API ile "Seçimler" bölümü (flag; fiyat/stok gösterilmez), içerik hacmi büyürse Keystatic → Postgres geçişi yalnız `build-content.ts` kaynağını değiştirir.

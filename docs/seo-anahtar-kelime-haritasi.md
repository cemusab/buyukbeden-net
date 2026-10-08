# SEO / GEO anahtar kelime haritası

> Kural: her baş ve orta terim **tek bir kanonik sayfaya** atanır; başka sayfalar o terimle yarışmaz, gerekirse o sayfaya doğal bir anchor ile link verir. `primaryKeyword` site genelinde benzersizdir (validate). Yeni sayfa açmadan önce bu tabloya bakın; terim zaten bir sayfanındıysa yeni sayfa o terimi hedeflemez.
>
> Son güncelleme: 2026-10-08 · Sahibi: SEO/GEO · Rakip analizi: `docs/rakip-seo-analizi.md`

## 0. Konumlandırma ve niyet

Buyukbeden.net **bilgi sitesidir** (satış yok). Baş terimlerin çoğu (`büyük beden elbise`, `büyük beden erkek giyim` …) **ticari/karışık niyetli**: arayanın bir kısmı ürün listesi ister. Bu terimlerde sayfanın gerçekten işe yaraması için hub şunları vermelidir:

1. Kısa cevap: o giysi hangi ölçüyle seçilir (üstte, 1–3 cümle).
2. Kalıp ve kumaş seçimi, beden tablosu linki.
3. **Marka ve alışveriş köprüsü**: kaynaklı marka rehberleri (`/alisveris-rehberi/kadin-giyim-markalari`, `/alisveris-rehberi/erkek-giyim-markalari`, `/markalar`), online alışverişte beden seçimi, iade/cayma hakkı.

Niyet kısaltmaları: **B** = bilgi, **T** = ticari (ürün/mağaza arayışı), **K** = karışık, **N** = navigasyon.

Başlık kuralı: `seo.title` (yoksa `title`) şablonla `"%s | Buyukbeden.net"` olur (+17 karakter). Baş terim sayfalarında `seo.title` ≤ ~44 karakter tutulur ki toplam ≈ 60'ı aşmasın; terim başlığın başında. Ana sayfa `absolute` başlık kullanır (`src/app/(site)/page.tsx`).

## 1. Genel / ana sayfa

| Terim(ler) | Niyet | Kanonik sayfa |
|---|---|---|
| büyük beden giyim, büyük beden, büyük beden giyim siteleri | K | `/` (başlık: "Büyük Beden Giyim, Beden ve Stil Rehberi \| Buyukbeden.net") |
| büyük beden giyim markaları, türkiye'deki büyük beden markaları | T/B | `/alisveris-rehberi/turkiyedeki-buyuk-beden-markalari` |
| büyük beden markaları dizini | N | `/markalar` |
| büyük beden terimleri, curve, plus size ne demek | B | `/rehberler/buyuk-beden-terimleri` |
| toptan büyük beden (merter, laleli, osmanbey) | T/B | `/alisveris-rehberi/toptan-buyuk-beden-pazari` |

## 2. Kadın silosu

| Terim(ler) | Niyet | Kanonik sayfa |
|---|---|---|
| büyük beden kadın, kadın büyük beden | K | `/kadin` |
| büyük beden kadın giyim, kadın büyük beden giyim, büyük beden bayan giyim | K | `/kadin/giyim` |
| büyük beden kadın giyim markaları / siteleri / mağazaları | T | `/alisveris-rehberi/kadin-giyim-markalari` |
| büyük beden elbise, büyük beden kadın elbise, büyük beden elbiseler | T | `/kadin/giyim/elbise` |
| büyük beden elbise nasıl seçilir | B | `/kadin/giyim/elbise/nasil-secilir` |
| 52 beden elbise | K | `/kadin/giyim/elbise/52-beden` |
| 52 beden elbise nereden alınır | T | `/alisveris-rehberi/52-beden-elbise-nereden-alinir` |
| büyük beden abiye, büyük beden abiye elbise, büyük beden abiye modelleri | T | `/kadin/giyim/abiye` |
| düğün için büyük beden abiye | K | `/kadin/giyim/abiye/dugun` |
| büyük beden pantolon, büyük beden kadın pantolon | T | `/kadin/giyim/pantolon` (erkek varyantı → `/erkek/giyim/pantolon`) |
| büyük beden jean, büyük beden kadın jean | T | `/kadin/giyim/jean` (erkek varyantı → `/erkek/giyim/jean`) |
| büyük beden tunik | T | `/kadin/giyim/tunik` |
| büyük beden tesettür, büyük beden tesettür giyim | T | `/kadin/giyim/tesettur` |
| büyük beden tayt | T | `/kadin/giyim/tayt` |
| büyük beden iç giyim, büyük beden sütyen | T/B | `/kadin/giyim/ic-giyim` |
| büyük beden kadın tişört / gömlek / hırka / triko-kazak | T | ilgili `/kadin/giyim/{kategori}` hub'ı |
| kadın beden rehberi | B | `/kadin/beden-rehberi` |
| kadın beden tablosu | B | `/kadin/beden-rehberi/beden-tablosu` |
| 52 beden kaç xl | B | `/kadin/beden-rehberi/52-beden-kac-xl` |
| 54 beden kaç xl, 56 beden kaç xl, 54/56 beden ölçüleri | B | `/kadin/beden-rehberi/54-56-beden-kac-xl` (2026-10-08; 52 sayfasındaki 54–56 bölümü kısaltılıp buraya bağlandı) |
| sütyen bedeni nasıl ölçülür, büyük beden sütyen kaç numara | B | `/kadin/beden-rehberi/sutyen-beden-olcusu` |
| büyük beden kadın kombinleri | K | `/kadin/kombinler` |
| büyük beden tesettür kombin, tesettür kombin önerileri | B/K | `/kadin/kombinler/tesettur` |
| büyük beden kadınlar nasıl giyinmeli, büyük beden nasıl giyinmeli | B | `/kadin/stil/nasil-giyinmeli` |
| büyük beden pijama, büyük beden pijama takımı | T/B | `/kadin/giyim/ev-giyimi` (hub, başlıkta "pijama"); "pijama takımı seçimi" → `/kadin/giyim/ev-giyimi/pijama-takimi-secimi` makalesi (pk: büyük beden pijama takımı) |
| büyük beden ayakkabı (kadın) | K | `/kadin/ayakkabi` (SSS: numara + genişlik) |
| büyük beden kadın stil önerileri, vücut tipleri | B | `/kadin/stil`, `/kadin/stil/vucut-tipleri` |

## 3. Erkek silosu

| Terim(ler) | Niyet | Kanonik sayfa |
|---|---|---|
| büyük beden erkek, erkek büyük beden | K | `/erkek` |
| büyük beden erkek giyim, battal beden erkek giyim, erkek büyük beden giyim, 4xl erkek giyim (→ 4XL sayfasına link) | K | `/erkek/giyim` |
| büyük beden ayakkabı (erkek) | K | `/erkek/ayakkabi` |
| büyük beden erkek giyim markaları / mağazaları | T | `/alisveris-rehberi/erkek-giyim-markalari` |
| battal beden, battal beden nedir, battal beden kaç xl, süper battal, big & tall | B | `/erkek/beden-rehberi/battal-beden` |
| büyük beden erkek tişört, battal beden tişört | T | `/erkek/giyim/tisort` |
| 4xl tişört, 4xl erkek tişört | T | `/erkek/giyim/tisort/4xl` |
| 4xl erkek tişört nereden alınır | T | `/alisveris-rehberi/4xl-erkek-tisort-nereden-alinir` |
| büyük beden erkek gömlek | T | `/erkek/giyim/gomlek` |
| büyük beden erkek pantolon / jean / mont / hırka / kazak | T | ilgili `/erkek/giyim/{kategori}` hub'ı |
| büyük beden erkek polo, eşofman, sweatshirt, takım elbise | T | ilgili `/erkek/giyim/{kategori}` hub'ı |
| erkek beden rehberi | B | `/erkek/beden-rehberi` |
| erkek beden tablosu | B | `/erkek/beden-rehberi/beden-tablosu` |
| 4xl kaç beden, 4xl kaç beden erkek | B | `/erkek/beden-rehberi/4xl-kac-beden` |
| 5xl kaç beden (erkek), 5xl kaç numara, 5xl göğüs ölçüsü | B | `/erkek/beden-rehberi/5xl-kac-beden` (2026-10-08) |
| 6xl kaç beden, 6xl göğüs ölçüsü, süper battal kaç xl, 8xl / 10xl erkek giyim | B | `/erkek/beden-rehberi/6xl-kac-beden` (2026-10-08) |
| gömlek yaka ölçüsü | B | `/erkek/beden-rehberi/gomlek-yaka-kol-olcusu` |
| göbekli erkek nasıl giyinmeli | B | `/erkek/stil/gobekli-erkek-nasil-giyinmeli` |
| büyük beden erkek kombinleri | K | `/erkek/kombinler` |

## 4. Beden soruları (ortak)

| Terim(ler) | Niyet | Kanonik sayfa |
|---|---|---|
| büyük beden kaç bedenden başlar, büyük beden kaçtan başlar, büyük beden kaç oluyor | B | `/beden-rehberi/buyuk-beden-kac-bedenden-baslar` |
| büyük beden kaç kilodan başlar, kaç kilo kaç beden | B | `/beden-rehberi/boy-kilo-beden-neden-yaniltir` (kilo eşiği verilmez; ölçüye yönlendirir) |
| xl kaç beden, xxl / xxxl kaç beden, 2xl / 3xl kaç beden (genel, kadın+erkek), en büyük beden kaç xl, 4xl kaç beden kadın | B | `/beden-rehberi/harf-beden-karsiliklari` (erkek 4XL/5XL/6XL tekil sayfalara bağlanır) |
| beden çevirme tr eu uk us | B | `/beden-rehberi/beden-sistemleri` |
| vücut ölçüsü nasıl alınır | B | `/beden-rehberi/olcu-alma-rehberi` |
| beden neden markadan markaya değişir, markalara göre beden farkı | B | `/beden-rehberi/beden-neden-markadan-markaya-degisir`, `/alisveris-rehberi/markalar-arasi-beden-farki` |
| oversize ne demek | B | `/stil/oversize-ne-demek` |
| büyük gelen kıyafet nasıl küçültülür, elbise / pantolon nasıl küçültülür, terzi daraltma | B | `/rehberler/buyuk-gelen-kiyafet-nasil-kucultulur` |
| büyük beden kombin önerileri | K | `/kombinler` |
| viskon / akrilik / polyester … nedir | B | `/kumas-rehberi/{kumas}` |

## 5. SERP kontrolü (2026-10-07)

**Google TR SERP'i doğrudan gözlemlenemedi.** `google.com.tr/search?hl=tr&gl=tr` ilk sorguda "sıra dışı trafik" CAPTCHA sayfasına yönlendirdi; kurala uygun olarak aşılmaya çalışılmadı. SERP türleri (perakendeci kategori sayfası, blog, PAA, featured snippet) bu yüzden **doğrulanmış değildir**; site sahibi kendi tarayıcısından (gizli pencere, `hl=tr&gl=tr`) aşağıdaki 10 terimi kontrol edip bu bölümü güncellemelidir.

Yedek veri olarak Google'ın herkese açık otomatik tamamlama (`suggestqueries.google.com`, `hl=tr&gl=tr`) önerileri alındı. Bulgular:

| Sorgu kökü | Öne çıkan öneriler | Çıkarım |
|---|---|---|
| büyük beden kadın giyim | markaları, mağazaları, siteleri, tesettür, toptan, istanbul/ankara | Ticari ve yerel niyet ağır. Hub'da marka/alışveriş köprüsü şart (eklendi). Şehir/mağaza terimleri hedeflenmez. |
| büyük beden elbise | tesettür, abiye, yazlık, kadın, modelleri, markaları, trendyol | Ürün listesi niyeti. Hub'da kullanım alanına göre kalıp + marka rehberi linki. |
| büyük beden erkek giyim | mağazaları, markaları, yorumlar, şehirler | Ticari + yerel. `/alisveris-rehberi/erkek-giyim-markalari` köprüsü eklendi. |
| battal beden | **battal beden erkek giyim** (1.), nedir, tişört, deniz şortu, takım elbise, elbise, abiye | "battal beden erkek giyim" → `/erkek/giyim` (açıklamaya eklendi); "nedir" → battal sayfası. |
| büyük beden abiye | elbise, tesettür, modelleri, takım, kiralama | Ticari; kiralama hedeflenmez. |
| büyük beden pantolon | erkek, kadın, pantolonlu takımlar, etek | Cinsiyet belirsiz: kadın hub kanonik, erkek hub'a karşılıklı değil silo içi yönlendirme. |
| büyük beden erkek tişört | modelleri, fiyatları, markaları, cepli; lcw/trendyol/defacto | Fiyat/ürün niyeti; biz ölçü + marka tablosu ile cevaplıyoruz. |
| büyük beden kaç | **kaçtan başlar**, kaç oluyor, kaç kilodan başlar, en büyük beden kaç xl, sütyen kaç numara | Bilgi niyeti: mevcut beden rehberleri karşılıyor (Tablo 4). |
| büyük beden tesettür | abiye, elbise, mayo, takım | Tesettür hub'ı + abiye çapraz linki yeterli. |
| 4xl kaç beden | kadın, erkek, kaç kilo, pantolon, kadın elbise | Kadın varyantı harf karşılıkları sayfasına, erkek 4XL sayfasına; "kaç kilo" boy-kilo sayfasına. |

### Cevaplanması gereken sorular (PAA yerine otomatik tamamlamadan)

| Soru | Durum |
|---|---|
| Büyük beden kaçtan başlar / kaç oluyor? | Cevaplı: `/beden-rehberi/buyuk-beden-kac-bedenden-baslar`; `/kadin/giyim` SSS'sine kaynaklı kısa cevap eklendi. |
| Battal beden erkek giyim ne demek? | `/erkek/giyim` SSS'sine eklendi (battal sayfasındaki kaynaklı tanıma dayanır). |
| Büyük beden kaç kilodan başlar? | Cevaplı (kilo eşiği olmadığı, ölçüye yönlendirme): `/beden-rehberi/boy-kilo-beden-neden-yaniltir`. |
| En büyük beden kaç XL? | Kısmen: harf karşılıkları ve JP1880 10XL tablosu. Ayrı sayfa açılmaz; harf sayfasına SSS olarak eklenebilir (kaynaklı). |
| Büyük beden sütyen kaç numara? | Sütyen beden rehberi ve iç giyim hub'ı kapsıyor. |
| 4XL kaç beden kadın? | Harf karşılıkları sayfası kapsıyor; kadın 4XL'e ayrı landing yalnız yeterli kaynaklı veriyle. |

## 6. Bu turda yapılanlar

- `/kadin/giyim` "büyük beden kadın giyim"in sahibi oldu (title, primaryKeyword, açıklama, marka/alışveriş bölümü, SSS). `/kadin` ve `/erkek` başlıkları ("Büyük Beden Kadın/Erkek Rehberi") giyim hub'larıyla çakışmayacak şekilde ayrıldı.
- Ana sayfa başlığı ve açıklaması "büyük beden giyim" terimiyle.
- Kadın hub'larının `seo.title`'ları terimle başlayacak şekilde düzeltildi; elbise, abiye, pantolon, jean, erkek tişört açıklamaları terimi bir kez içeriyor.
- Aşırı tekrarlanan anchor'lar (erkek beden tablosu, ölçü nasıl alınır, markalar arası beden farkı) birkaç yerde çeşitlendirildi; giyim hub'larına baş terimli birkaç doğal anchor eklendi.
- `/llms.txt` route handler (`src/app/llms.txt/route.ts`), içerik indeksinden build'de üretilir.
- JSON-LD: ana sayfada Organization + WebSite zaten var; SearchAction eklenmedi (`/arama` noindex). FAQPage yalnız görünür SSS'den üretiliyor (mevcut davranış).

## 7. Anchor ve yoğunluk notları

- Validate, landing sayfalarında "büyük beden" yoğunluğunu frontmatter dahil sayar; kısa gövdeli landing'lerde terim yalnız `title` + `primaryKeyword` + açıklamada kalmalı, `shortAnswer`'da tekrar edilmez.
- Baş terimli anchor her linkte kullanılmaz; aynı hedefe giden linklerin küçük bir kısmı terimli, çoğu betimleyici olmalı.

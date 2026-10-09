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
| 48 beden kaç xl, 50 beden kaç xl (kadın), 48/50 beden ölçüleri | B | `/kadin/beden-rehberi/48-50-beden-kac-xl` (2026-10-09) |
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
| erkek pantolon beden tablosu, jean beden tablosu (erkek), W38 L32 ne demek, pantolon 40 beden kaç cm, bel 110 cm kaç beden (erkek), kot pantolon bedenleri erkek | B | `/erkek/beden-rehberi/pantolon-beden-tablosu` (2026-10-09) |
| gömlek yaka ölçüsü | B | `/erkek/beden-rehberi/gomlek-yaka-kol-olcusu` |
| göbekli erkek nasıl giyinmeli | B | `/erkek/stil/gobekli-erkek-nasil-giyinmeli` |
| büyük beden erkek kombinleri | K | `/erkek/kombinler` |

## 4. Beden soruları (ortak)

| Terim(ler) | Niyet | Kanonik sayfa |
|---|---|---|
| büyük beden kaç bedenden başlar, büyük beden kaçtan başlar, büyük beden kaç oluyor | B | `/beden-rehberi/buyuk-beden-kac-bedenden-baslar` |
| büyük beden kaç kilodan başlar, kaç kilo kaç beden | B | `/beden-rehberi/boy-kilo-beden-neden-yaniltir` (kilo eşiği verilmez; ölçüye yönlendirir) |
| xl kaç beden, xxl / xxxl kaç beden, 2xl / 3xl kaç beden (genel, kadın+erkek), en büyük beden kaç xl, 4xl kaç beden kadın | B | `/beden-rehberi/harf-beden-karsiliklari` (erkek 4XL/5XL/6XL tekil sayfalara bağlanır) |
| beden çevirme tr eu uk us, eu 50 / uk 20 / us 16 kaç beden (SSS) | B | `/beden-rehberi/beden-sistemleri` (ayrı "uluslararası beden çevirici" sayfası açılmadı: aynı niyet) |
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

## 8. 500 kelime eşlemesi (2026-10-09)

> Kaynak: site sahibinin 500 kelimelik listesi, sınıflandırma `docs/anahtar-kelimeler-500.md`. Her küme **tek** kanonik URL'ye gider; varyantlar (modelleri, çeşitleri, türleri, kadın/bayan) aynı sayfada H2/H3 veya SSS olarak karşılanır, ayrı sayfa açılmaz. "Yeni sayfa – agent B" yazan kümeler o sayfa yayımlanana kadar hedeflenmez; mevcut sayfalarda yalnız bağlam içinde geçer, link verilmez (yayımlanmamış hedefe link yasak).
>
> Not: Tablo 1–2'deki `/alisveris-rehberi/kadin-giyim-markalari`, `/alisveris-rehberi/erkek-giyim-markalari`, `/alisveris-rehberi/turkiyedeki-buyuk-beden-markalari` şu an yayımlı değil; marka kümeleri o sayfalar gelene kadar `/markalar`'a eşlenir.

### 8.1 Grup A – Kadın

| Küme (örnek kelimeler) | Kanonik URL |
|---|---|
| büyük beden kadın/bayan giyim, büyük beden kadın kıyafet(leri), 44–62 beden giyim | `/kadin/giyim` |
| büyük beden elbise, elbise modelleri, günlük/yazlık/kışlık/uzun/midi elbise | `/kadin/giyim/elbise` |
| büyük beden elbise nasıl seçilir, elbise kombini | `/kadin/giyim/elbise/nasil-secilir` |
| 52 beden elbise | `/kadin/giyim/elbise/52-beden` |
| büyük beden tunik, uzun/salaş/viskon/penye tunik, tunik modelleri | `/kadin/giyim/tunik` |
| tunik kombin, tunik nasıl seçilir | `/kadin/giyim/tunik/nasil-secilir` |
| büyük beden gömlek (kadın), beyaz/kot/uzun gömlek | `/kadin/giyim/gomlek` |
| büyük beden bluz, bluz modelleri | `/kadin/giyim/bluz` |
| büyük beden pantolon (kadın), palazzo, geniş paça, dar paça, yüksek bel, kumaş pantolon | `/kadin/giyim/pantolon` |
| pantolon kalıpları (mom, wide leg, bootcut) | `/kadin/giyim/pantolon/kalip-rehberi` |
| büyük beden jean / kot pantolon (kadın) | `/kadin/giyim/jean` |
| büyük beden etek, kalem/pileli/midi/uzun/kot etek | `/kadin/giyim/etek` |
| büyük beden ceket, blazer ceket | `/kadin/giyim/ceket` |
| büyük beden hırka | `/kadin/giyim/hirka` |
| büyük beden kazak, triko | `/kadin/giyim/triko` |
| büyük beden sweatshirt (kadın) | `/kadin/giyim/sweatshirt` |
| büyük beden mont, şişme mont (kadın) | `/kadin/giyim/mont` |
| büyük beden kaban (kadın) | `/kadin/giyim/kaban` |
| trençkot, yağmurluk, yelek (kadın) | yeni sayfa – agent B (kadın dış giyim türleri) |
| büyük beden abiye, abiye modelleri; düğün/nişan/söz/kına/mezuniyet abiyesi; uzun/kısa abiye | `/kadin/giyim/abiye` (düğün → `/kadin/giyim/abiye/dugun`) |
| şifon/dantel/saten/taşlı/payetli abiye | yeni sayfa – agent B (abiye kumaş/süsleme) |
| büyük beden tesettür giyim, tesettür elbise/tunik | `/kadin/giyim/tesettur` |
| ferace, kap, pardesü (tesettür) | yeni sayfa – agent B (ferace–kap rehberi) |
| büyük beden iç giyim, sütyen, sütyen takımı | `/kadin/giyim/ic-giyim` (takım → `/kadin/giyim/ic-giyim/sutyen-kulot-takimi`) |
| büyük beden tayt, eşofman, spor giyim, mayo/haşema, pijama | ilgili hub (`/kadin/giyim/{tayt,esofman,spor-giyim,mayo-hasema,ev-giyimi}`) |
| kadın beden tablosu, büyük beden ölçü tablosu | `/kadin/beden-rehberi/beden-tablosu` |
| büyük beden ölçü nasıl alınır (kadın) | `/kadin/beden-rehberi/olcu-nasil-alinir` |
| 52 / 54 / 56 beden kaç XL | `/kadin/beden-rehberi/52-beden-kac-xl`, `/kadin/beden-rehberi/54-56-beden-kac-xl` |
| büyük beden kombin (kadın), günlük/şık/ofis/yaz/kış kombin | `/kadin/kombinler` → ilgili kombin (`gunluk`, `ofis`, `yaz`, `kis`, `spor-sik`) |
| tesettür kombin, düğün kombini, mezuniyet kombini, nişan/kına kombini | `/kadin/kombinler/{tesettur,dugun-davet,mezuniyet,nisan-kina}` |
| büyük beden kadın nasıl giyinmeli, stil önerileri | `/kadin/stil/nasil-giyinmeli` |
| vücut tipine göre giyim | `/kadin/stil/vucut-tipleri` |
| büyük beden trendler (kadın) | `/trendler/kadin-2026-sonbahar-kis` |
| bayram kombini (kadın) | yeni sayfa – agent B |

### 8.2 Grup A – Erkek

| Küme (örnek kelimeler) | Kanonik URL |
|---|---|
| büyük beden / battal beden erkek giyim, erkek kıyafet | `/erkek/giyim` |
| büyük beden erkek tişört; basic, V yaka, oversize, uzun kollu, termal tişört | `/erkek/giyim/tisort` |
| polo yaka tişört | `/erkek/giyim/polo` |
| büyük beden erkek gömlek; keten, oduncu, kot, klasik, spor gömlek | `/erkek/giyim/gomlek` |
| büyük beden erkek pantolon; chino, kargo, jogger, kanvas, keten pantolon | `/erkek/giyim/pantolon` (kalıp adları → `/erkek/giyim/pantolon/kalip-rehberi`) |
| büyük beden erkek kot / jean | `/erkek/giyim/jean` |
| büyük beden erkek şort, bermuda, deniz şortu | `/erkek/giyim/sort-deniz-sortu` |
| büyük beden erkek sweatshirt, kapüşonlu, fermuarlı, polar | `/erkek/giyim/sweatshirt` |
| büyük beden erkek kazak, triko | `/erkek/giyim/triko` |
| büyük beden erkek hırka | `/erkek/giyim/hirka` |
| büyük beden erkek mont | `/erkek/giyim/mont` |
| mont türleri (şişme, parka, deri, kaban) | yeni sayfa – agent B (erkek mont türleri) |
| büyük beden erkek iç giyim, boxer, atlet, termal içlik | `/erkek/giyim/ic-giyim` (boxer → `/erkek/giyim/ic-giyim/boxer-secimi`) |
| büyük beden takım elbise, slim fit takım | `/erkek/giyim/takim-elbise` |
| düğün / nişan takım elbisesi | `/erkek/giyim/takim-elbise/dugun` |
| damatlık, smokin | yeni sayfa – agent B |
| ceket, blazer, yelek (erkek) | `/erkek/giyim/takim-elbise` (ceket–yelek bölümü) |
| eşofman takımı | `/erkek/giyim/esofman` |
| spor / fitness / yürüyüş kıyafeti | `/erkek/giyim/spor-giyim` |
| pijama, ev giyimi (erkek) | yeni sayfa – agent B (erkek ev giyimi hub'ı) |
| erkek beden tablosu, ölçü nasıl alınır | `/erkek/beden-rehberi/beden-tablosu`, `/erkek/beden-rehberi/olcu-nasil-alinir` |
| 4XL / 5XL / 6XL kaç beden, battal beden nedir | `/erkek/beden-rehberi/{4xl,5xl,6xl}-kac-beden`, `/erkek/beden-rehberi/battal-beden` |
| erkek 44–62 numerik beden | yeni sayfa – agent B (veri varsa) |
| erkek kombin, günlük/ofis/yaz/kış/düğün kombini | `/erkek/kombinler` → `/erkek/kombinler/{gunluk,ofis,yaz,kis,dugun-davetlisi}` |
| bayram kombini (erkek) | yeni sayfa – agent B |
| göbekli/kilolu erkek nasıl giyinmeli | `/erkek/stil/gobekli-erkek-nasil-giyinmeli` |
| erkek trendler | `/trendler/erkek-2026-sonbahar-kis` |

### 8.3 Grup A – Ortak (beden, marka, toptan)

| Küme | Kanonik URL |
|---|---|
| büyük beden kaç bedenden başlar / kaçtan başlar | `/beden-rehberi/buyuk-beden-kac-bedenden-baslar` |
| büyük beden kıyafet hangi bedene kadar, en büyük beden kaç XL | `/beden-rehberi/harf-beden-karsiliklari` (SSS) |
| büyük beden ölçü nasıl alınır (genel) | `/beden-rehberi/olcu-alma-rehberi` |
| büyük beden markaları, yerli markalar, en iyi markalar | `/markalar` (objektif dizin; "en iyi" sıralaması yapılmaz) |
| büyük beden toptan, toptancı, üretici | `/alisveris-rehberi/toptan-buyuk-beden-pazari` (nereden → `/alisveris-rehberi/toptan-buyuk-beden-nereden-alinir`) |
| güvenilir büyük beden sitesi nasıl anlaşılır | yeni sayfa – agent B |

### 8.4 Grup B – Yeniden çerçevelenen

| Aranan ifade | Nasıl karşılanır | URL |
|---|---|---|
| zayıf gösteren kıyafetler / elbise / kombin (kadın) | "dengeli siluet, dikey çizgi, oran" dili | yeni sayfa – agent B; o gelene kadar `/kadin/stil/nasil-giyinmeli` |
| zayıf gösteren kıyafet (erkek) | aynı dil | yeni sayfa – agent B; o gelene kadar `/erkek/stil/gobekli-erkek-nasil-giyinmeli` |
| büyük bedene hangi kıyafet yakışır | stil rehberi SSS | `/kadin/stil/nasil-giyinmeli`, `/erkek/stil` |
| renk seçimi | stil | yeni sayfa – agent B |

### 8.5 Grup C – Hariç (hedeflenmez)

| Kelime tipi | Neden |
|---|---|
| fiyat(ları), indirim, outlet, kampanya, sezon sonu, uygun fiyatlı, ucuz | Satış niyeti; site satış yapmaz, fiyat verisi yok. |
| satın al, sipariş ver, online satın al, kapıda ödeme, taksitli | İşlem niyeti; sepet/ödeme yok. |
| ücretsiz / hızlı kargo | Lojistik niyeti; doğrulanabilir veri yok. |
| İstanbul/Ankara/İzmir/Bursa/Antalya/Adana mağazası, yakınımdaki | Doğrulanmış mağaza verisi olmadan sayfa açılmaz (ileride şehir rehberi). |
| "… yorumları" | Uydurma yorum yok; alıcı temaları hub'larda kendi cümlemizle özetli. |
| "güvenilir site" (liste niyeti) | Liste yapılmaz; yalnız "nasıl anlaşılır" bilgi rehberi (agent B). |
| tekrar/bozuk ifadeler ("büyük beden büyük beden abiye elbise", "büyük beden erkek büyük beden kaban") | Doğal dil değil; asıl kümenin sayfası zaten karşılar. |

## 9. Beden long-tail turu (2026-10-09)

Google otomatik tamamlama (`hl=tr&gl=tr`) ile kontrol edildi. "48/50 beden kaç xl" (kadın/erkek, kaç kilo, kaç numara), "jean/kot pantolon beden tablosu", "erkek pantolon beden tablosu/numaraları", "pantolon 40 beden neye denk gelir", "34 beden kot hangi beden", "110 cm bel kaç beden" önerileri belirgin.

- Yeni: `/kadin/beden-rehberi/48-50-beden-kac-xl`, `/erkek/beden-rehberi/pantolon-beden-tablosu` (W/L + numara + harf + bel cm bantları).
- SSS olarak eklendi: "L beden kaç numara?" (harf karşılıkları), "EU 50 kaç beden?", "US 16 kaç beden?" (beden sistemleri).
- Açılmadı: ayrı uluslararası çevirici (beden-sistemleri ile aynı niyet), kadın XXL sayfası (harf karşılıkları kapsıyor), kadın jean W/L sayfası (resmi kaynaklı kadın jean inç tablosu yok; Mavi görselleri erişilemedi, ABD perakendeci tabloları birbirini tutmuyor). Kadın jean verisi bulunursa erkek pantolon sayfasının kadın karşılığı açılabilir.

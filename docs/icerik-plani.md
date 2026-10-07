# İçerik Planı – Buyukbeden.net

> Brief §53 madde 5 (topic cluster / keyword haritası) ve madde 18 (ilk ~40 cornerstone). Hazırlanma: 2026-10-07. Hazırlayan: içerik mimarı (Buyukbeden.net Editör Ekibi adına).
> Sayısal beden verileri **bu dosyada yazılmaz**; tek doğruluk kaynağı `docs/kaynaklar-beden.md` (her tablo URL + checkedAt ile). Bu dosya yalnız hangi sayfanın hangi veriye bağımlı olduğunu söyler.

## 0. Okuma kılavuzu

- **Niyet:** `bilgi` (bilgi edinme), `ticari` (satın almadan önce araştırma / marka, "nereden alınır"), `navigasyon` (belirli marka/sayfa arıyor).
- **Tip:** ARTICLE, CATEGORY_HUB, SIZE_GUIDE, STYLE_GUIDE, OUTFIT_GUIDE, BRAND_GUIDE, FABRIC_GUIDE, SHOPPING_GUIDE, TREND (brief §20).
- **Link verir →** sayfanın içinden bağlantı vermesi gereken sayfalar. **← Link alır** sayfaya bağlantı vermesi gereken sayfalar.
- Hedefi henüz üretilmemiş sayfaya link verilmez (CLAUDE.md kural 2). Aşağıdaki "link verir" listeleri hedef yayınlandıkça aktifleşir; route manifest bunu kontrol eder.
- Kadın sayfası önce kadın, erkek sayfası önce erkek içeriğe bağlanır. Ortak alanlar (`/beden-rehberi`, `/kumas-rehberi`, `/markalar`, `/stil`, `/kombinler`, `/trendler`, `/alisveris-rehberi`) iki siloya da dağıtır.

---

## 1. SERP / niyet araştırması (brief §35 öncelikli sorular)

**Yöntem ve sınırlama:** Arama, ajanın web arama aracıyla 2026-10-07'de yapıldı. Bu araç ABD konumlu sonuç döndürür; Google TR SERP'i birebir değildir. Sonuçlar "hangi tip sayfa görünür" düzeyinde yorumlandı; yayın öncesi Google Search Console / Türkiye konumlu bir SERP aracıyla tekrar kontrol edilmeli. Rakip metin kopyalanmadı; aşağıdaki gözlemler sayfa tipine ve yapısına dairdir.

### 1.1 Genel gözlemler (tüm beden sorgularında ortak)

1. **Görünen sayfa tipleri:** haber sitelerinin "X beden kaç XL, kaç kilo" açıklayıcı yazıları (ör. haberturk.com 42/48 beden yazıları), Yandex'in yapay zekâ derlemeli soru-cevap sayfaları (yandex.com.tr/yacevap), pazar yeri kategori sayfaları (Trendyol, Akakçe, Çiçeksepeti, n11), Ekşi Sözlük / Kızlar Soruyor gibi forumlar, birkaç akademik tez sayfası.
2. **Kalite boşluğu (bizim fırsatımız):**
   - İncelenen haber yazısı (haberturk 48 beden) tablo içermiyor, kaynak göstermiyor, **kadın/erkek ayrımı yapmıyor** ve "48 = 4XL, bazı markalarda 3XL" gibi tek bir sayı veriyor.
   - Arama özetlerinde "52-54 = L, 56-58 = XL" gibi **erkek Avrupa takım bedenine ait** karşılıklar kadın sorgusuna cevap gibi karışıyor. Kadında 52 numara ile erkekte 52 numara bambaşka bedenlerdir. Bu karışıklık sitenin en net farkı olabilir: her "kaç beden" sayfası en üstte **"kadın mı erkek mi?"** ayrımını yapmalı.
   - Yandex derlemesi kendi uyarısında hata içerebileceğini söylüyor; markalar arası farkı tablo halinde gösteren, kaynaklı bir sayfa yok.
   - "Kaç kilo" alt niyeti çok güçlü (başlıklarda geçiyor). Kilo→beden dönüşümü **güvenilir şekilde verilemez** (boy, vücut tipi değişkeni). Önerimiz: H2 olarak "Kaç kiloya denk gelir?" sorusunu açıkça ele alıp neden tek sayı verilemeyeceğini dürüstçe anlatmak ve ölçü almaya yönlendirmek. Uydurma kilo tablosu yok.
3. **Featured snippet / AEO formatı:** soru tipi başlık (H1 veya ilk H2) + 40–60 kelimelik kısa cevap kutusu + kaynaklı karşılaştırma tablosu (marka bazında) + "nasıl ölçülür" adım listesi + SSS (FAQ blokları; FAQPage schema şu an Google'da zengin sonuç vermese de AI özetleri için yapı faydalı).

### 1.2 Soru bazında

| Sorgu | Niyet | Şu an görünen sayfa tipi | Daha iyi cevabın ihtiyacı | Snippet / AEO formatı | Bizim URL |
|---|---|---|---|---|---|
| 52 beden kaç XL | bilgi | Haber açıklayıcı yazıları, Yandex AI derlemesi, pazar yeri ürün sayfaları; özetlerde erkek bedeniyle karışıklık | Kadın ve erkek ayrımı; markalara göre aralık tablosu (kaynaklı); göğüs/bel/basen cm aralıkları; "markaya göre değişir" açıklaması; ölçü alma | Kısa cevap (aralık + "markaya göre") → marka tablosu → adımlar → SSS | `/kadin/beden-rehberi/52-beden` (+ erkek kutusu → `/erkek/beden-rehberi`) |
| 54 / 56 beden kaç XL | bilgi | Aynı tip; tekil sayfa çok az | 52 sayfasıyla aynı şablon; yeterli marka verisi varsa ayrı sayfa, yoksa 52 sayfasının yanındaki "harf↔numara" tablosunda | Tablo | Önce `/beden-rehberi/harf-beden-karsiliklari` içinde; veri yeterliyse `/kadin/beden-rehberi/54-beden`, `56-beden` (2. dalga) |
| XL / 2XL / 3XL kaç beden | bilgi | İngilizce "what is XL" sayfaları, ABD odaklı; TR'de haber yazıları | Kadın ve erkek ayrı sütun; TR/EU numara karşılığı markalara göre aralık; US/UK karşılığı | Tablo (harf → kadın TR/EU → erkek TR/EU) + kısa cevap | `/beden-rehberi/harf-beden-karsiliklari` |
| 4XL kaç beden | bilgi (erkekte ticari geçiş: "4XL tişört") | Haber yazısı ("48 = 4XL"), pazar yeri "4XL sweatshirt erkek" kategorisi, ABD ürün sayfaları; DeFacto'ya atıfla "60-62" iddiası (doğrulanmalı) | Erkek ve kadın ayrı; erkekte göğüs cm aralığı; tişört vs gömlek vs pantolon farkı | Kısa cevap + erkek marka tablosu + "tişörtte / gömlekte" bölümleri | `/erkek/beden-rehberi/4xl` (+ kadın kutusu) |
| 5XL / 6XL / 7XL / 8XL kaç beden | bilgi | Çok zayıf TR içerik | 4XL sayfasıyla aynı şablon; marka sayısı az olduğundan önce ortak tabloda | Tablo | Önce `/beden-rehberi/harf-beden-karsiliklari`; veri yeterliyse `/erkek/beden-rehberi/5xl` vb. (2. dalga) |
| Büyük beden kaç bedenden başlar | bilgi | Haber ve Yandex derlemeleri ("42'den", "46'dan" gibi tutarsız cevaplar), akademik tez sayfaları | Markaların kendi büyük beden çizgisini nereden başlattığı (kaynaklı); akademik tanım (ör. İzmir Ekonomi Üniv. 2014 tezi kadın için 44 ve üzerini çalışma kapsamı olarak almış); kadın/erkek farkı | Kısa cevap: "Tek resmi eşik yok; markalar çoğunlukla … arası başlatır" + marka tablosu | `/beden-rehberi/buyuk-beden-kac-bedenden-baslar` |
| Kadın beden tablosu / erkek beden tablosu | bilgi + ticari | Marka beden tablosu sayfaları, pazar yeri yardım sayfaları, sorubak tarzı bloglar | Birden çok markanın kaynaklı tablosu yan yana; mobilde okunur tablo; ölçü alma | Tablo + adımlar | `/kadin/beden-rehberi`, `/erkek/beden-rehberi` (hub'ların kendisi) |
| Beden ölçüsü nasıl alınır | bilgi | Haber yazıları, blog, e-ticaret altyapı firması blogu | Kadın ve erkek ayrı ölçü noktaları; çizim (SVG); kaynaklı yöntem (ISO 8559-1 / marka ölçü kılavuzları) | Numaralı adımlar (HowTo yapısı) | `/beden-rehberi/olcu-alma-rehberi` |
| Viskon nedir | bilgi | Fiyat karşılaştırma kategori sayfası (Akakçe), ev tekstili ürün sayfaları, üniversite açık ders notu | Net tanım (rejenere selüloz lif), Lenzing/ansiklopedi kaynaklı; his, avantaj/dezavantaj, bakım, giysi seçiminde etkisi; viskon–pamuk karşılaştırması | Tanım kutusu + artı/eksi + bakım listesi + SSS | `/kumas-rehberi/viskon` |
| Akrilik nedir | bilgi | Yerel haber sitesi yazısı, üniversite tezleri (boncuklanma), Yandex derlemesi | Tanım, yün benzeri his, boncuklanma (tüylenme) bilgisi kaynaklı; bakım | Tanım + artı/eksi + bakım | `/kumas-rehberi/akrilik` |
| Oversize ne demek | bilgi | Sözlük sayfaları (İngilizce), Ekşi Sözlük, moda dergisi yazısı | Tanım (kalıp tercihi, beden değil); oversize ile bir beden büyük almak arasındaki fark; büyük bedende oversize nasıl dengelenir; kadın/erkek örnekleri | Tanım kutusu + "fark" tablosu + stil önerileri | `/stil/oversize-ne-demek` |
| Büyük beden elbise nasıl seçilir | bilgi | Haber siteleri liste yazıları (kaynaksız, bazen "zayıf gösterir" söylemi), pazar yeri kategori | Beden → kalıp → kumaş → boy → kullanım alanı sırasıyla karar akışı; vücut utandırmayan dil; elbise kalıp sözlüğü (A kesim, kruvaze, gömlek elbise…) | Adım adım + karşılaştırma tablosu (kalıp/kim için) | `/kadin/giyim/elbise/nasil-secilir` |
| Büyük beden pantolon / jean nasıl seçilir, basenli pantolon | bilgi | Haber yazıları, forum, pazar yeri | Bel–basen farkı, kalıp sözlüğü (straight, wide leg, mom, bootcut), yüksek bel, esneme payı (elastan oranı) | Adımlar + kalıp tablosu | `/kadin/giyim/pantolon` hub + `/kadin/giyim/jean` hub (spoke: `/kadin/stil/basenli-pantolon-secimi`, 2. dalga) |
| 4XL erkek tişört nasıl seçilir | bilgi + ticari | Pazar yeri kategorileri ağırlıkta | Göğüs ölçüsünden beden, boy uzunluğu, kumaş gramajı/penye, oversize vs regular | Adımlar + tablo | `/erkek/giyim/tisort/4xl` |
| Büyük beden erkek gömlek nasıl seçilir | bilgi + ticari | Pazar yeri ürün sayfaları, kaynaksız öneri özetleri | Yaka ölçüsü (cm), göğüs, kalıp (regular/comfort), kol boyu, kumaş (pamuk/pamuk-polyester), göbek bölgesinde düğme açılması | Adımlar + yaka ölçü tablosu (kaynaklı) | `/erkek/giyim/gomlek/nasil-secilir` |
| Smart casual erkek | bilgi | Köşe yazıları, moda dergisi, İngilizce rehberler | Büyük bedende uygulanabilir parça listesi, kalıp ve renk; örnek kombinler | Liste + kombin kartları | `/erkek/kombinler/smart-casual` (2. dalga) |
| Büyük beden markaları | ticari / navigasyon | Akademik tezler, eski magazin yazıları, Yandex derlemesi, fiyat karşılaştırma | Resmi siteden doğrulanmış marka dizini (kadın/erkek, beden aralığı, ülke, Türkiye'de erişim); objektif | ItemList + filtrelenebilir dizin | `/markalar`, `/alisveris-rehberi/buyuk-beden-markalari` |

---

## 2. Topic cluster / keyword haritası

Format: **Hub** → spoke'lar. Her satırda: hedef sorgu · niyet · URL · tip · link verir / link alır. Faz: **C** = ilk 40 cornerstone, **2** = ikinci dalga, **3** = veri/talep doğrulanınca.

### 2.1 Ortak: Beden Rehberi (sitenin çekirdeği)

**Hub:** `/beden-rehberi` · "beden rehberi, beden tablosu, beden ölçüleri" · bilgi · SIZE_GUIDE (hub) · **C**
- Link verir → `/kadin/beden-rehberi`, `/erkek/beden-rehberi`, tüm beden spoke'ları, `/kumas-rehberi/elastan` (esneme payı), `/markalar`
- Link alır ← ana sayfa "Bedenini Tanı", tüm kategori hub'ları, tüm beden landing'leri

| Spoke | Hedef sorgu | Niyet | URL | Tip | Faz | Link verir → / ← alır |
|---|---|---|---|---|---|---|
| Harf ↔ numara karşılıkları | xl kaç beden, 2xl kaç beden, 3xl kaç beden, 5xl kaç beden | bilgi | `/beden-rehberi/harf-beden-karsiliklari` | SIZE_GUIDE | C | → kadın/erkek beden rehberi, 52-beden, 4xl · ← tüm giyim hub'ları |
| Uluslararası beden çevirme (TR/EU/UK/US) | uk beden kaç, us beden kaç, avrupa beden tablosu | bilgi | `/beden-rehberi/uluslararasi-beden-cevirme` | SIZE_GUIDE | C | → harf karşılıkları, marka sayfaları (ASOS, M&S) · ← beden hub'ları |
| Ölçü alma rehberi | beden ölçüsü nasıl alınır, göğüs/bel/basen nasıl ölçülür, iç bacak boyu | bilgi | `/beden-rehberi/olcu-alma-rehberi` | SIZE_GUIDE | C | → kadın/erkek beden rehberi · ← her beden sayfası (zorunlu) |
| Büyük beden kaç bedenden başlar | büyük beden kaç bedenden başlar, battal beden nedir | bilgi | `/beden-rehberi/buyuk-beden-kac-bedenden-baslar` | ARTICLE | C | → kadın/erkek hub, markalar · ← ana sayfa, kadın/erkek giyim hub |
| Markalar arası beden farkı | neden her markada bedenim farklı | bilgi | `/beden-rehberi/markalara-gore-beden-farki` | ARTICLE | 2 | → marka sayfaları · ← harf karşılıkları |
| Online alışverişte beden seçimi | internetten kıyafet alırken beden | bilgi | `/beden-rehberi/online-beden-secimi` | ARTICLE | 2 | → ölçü alma, alışveriş rehberi |

### 2.2 Kadın silo

**Hub:** `/kadin` (silo girişi; navigasyon) → `/kadin/giyim` · "büyük beden kadın giyim" · bilgi+ticari · CATEGORY_HUB · **C**

**Kadın beden rehberi hub:** `/kadin/beden-rehberi` · "kadın beden tablosu, büyük beden kadın beden tablosu" · SIZE_GUIDE · **C**

| Spoke | Hedef sorgu | Niyet | URL | Tip | Faz |
|---|---|---|---|---|---|
| 52 beden | 52 beden kaç xl, 52 beden ölçüleri | bilgi | `/kadin/beden-rehberi/52-beden` | SIZE_GUIDE | C |
| 48 beden | 48 beden kaç xl | bilgi | `/kadin/beden-rehberi/48-beden` | SIZE_GUIDE | C (veri yeterliyse) |
| 50 beden | 50 beden kaç xl | bilgi | `/kadin/beden-rehberi/50-beden` | SIZE_GUIDE | 2 |
| 54 / 56 / 58 beden | 54 beden kaç xl … | bilgi | `/kadin/beden-rehberi/54-beden` … | SIZE_GUIDE | 2–3 (en az 4 kaynaklı marka tablosu şartı) |
| Kadın pantolon bedeni (bel/basen, boy) | kadın pantolon beden tablosu | bilgi | `/kadin/beden-rehberi/pantolon-beden` | SIZE_GUIDE | 2 |
| Kadın jean bedeni (W/L) | jean beden 32 kaç beden kadın | bilgi | `/kadin/beden-rehberi/jean-beden` | SIZE_GUIDE | 2 |
| Sütyen bedeni | büyük beden sütyen ölçüsü | bilgi | `/kadin/beden-rehberi/sutyen-bedeni` | SIZE_GUIDE | 3 (kaynak araştırması ayrı) |

Link modeli: beden spoke'ları → ilgili giyim hub'ı (52 beden → `/kadin/giyim/elbise`, `/kadin/giyim/pantolon`), → `/beden-rehberi/olcu-alma-rehberi`, → `/kumas-rehberi/elastan`. ← `/kadin/beden-rehberi`, `/beden-rehberi/harf-beden-karsiliklari`, kategori hub'larının "Beden" bölümü.

**Kadın giyim kategori hub'ları** (hepsi CATEGORY_HUB; brief §7 şablonu: nedir, nasıl seçilir, beden/kumaş/kalıp, kullanım alanları, ilgili beden/kombin/kumaş/marka, SSS)

| Hub | Hedef sorgu | Spoke'lar (faz) |
|---|---|---|
| `/kadin/giyim/elbise` (C) | büyük beden elbise | `/nasil-secilir` (C), `/52-beden` (2; yalnız kaynaklı içerikle), `/yazlik` (2), `/kislik` (2), `/ofis` (2), `/abiye` → kanonik `/kadin/giyim/abiye`'ye bağlanır, çift içerik yok |
| `/kadin/giyim/pantolon` (C) | büyük beden kadın pantolon | `/nasil-secilir` (2), `/kumas-pantolon` (2), `/yuksek-bel` (3) |
| `/kadin/giyim/jean` (C) | büyük beden jean kadın | `/kalip-rehberi` (2: mom, straight, wide leg, bootcut), `/nasil-secilir` (2) |
| `/kadin/giyim/triko` (C) | büyük beden triko kadın | `/kazak-secimi` (2) → `/kumas-rehberi/akrilik`, `/kumas-rehberi/triko` |
| `/kadin/giyim/hirka` (C) | büyük beden hırka | `/uzun-hirka` (3) |
| `/kadin/giyim/gomlek` (C) | büyük beden kadın gömlek | `/nasil-secilir` (2) |
| `/kadin/giyim/tisort` (C) | büyük beden kadın tişört | `/oversize` (2) → `/stil/oversize-ne-demek` |
| `/kadin/giyim/abiye` (C) | büyük beden abiye | `/dugun` (2), `/nasil-secilir` (2) |
| `/kadin/giyim/bluz`, `/ceket`, `/mont`, `/kaban`, `/ic-giyim`, `/ev-giyimi` | — | 2. dalga hub'lar (brief §1 listesinde var; cornerstone değil). Hub hazır olmadan menüde gösterilmez. |

**Kadın stil hub:** `/kadin/stil` (C) · STYLE_GUIDE · spoke (2): `/basenli-pantolon-secimi`, `/buyuk-gogus-icin-yaka-secimi`, `/kisa-boylu-stil`, `/uzun-boylu-stil`, `/ofis-stili`, `/dugun-stili`.
**Kadın kombin hub:** `/kadin/kombinler` (C) · OUTFIT_GUIDE · spoke (2): `/gunluk`, `/ofis`, `/yaz`, `/kis`, `/dugun`, `/jean`, `/triko`, `/abiye`. Her kombin: neden uyumlu, kalıp, kumaş, renk, mevsim, alternatif parçalar (brief §12).

Kadın örnek yolculuk (brief §29): `/kadin/beden-rehberi/52-beden` → `/kadin/giyim/elbise` → `/kadin/giyim/elbise/nasil-secilir` → `/kumas-rehberi/viskon` → `/kadin/kombinler/yaz`.

### 2.3 Erkek silo

**Hub:** `/erkek/giyim` · "büyük beden erkek giyim, battal beden erkek" · bilgi+ticari · CATEGORY_HUB · **C**

**Erkek beden rehberi hub:** `/erkek/beden-rehberi` · "erkek beden tablosu, büyük beden erkek beden tablosu" · SIZE_GUIDE · **C**

| Spoke | Hedef sorgu | Niyet | URL | Tip | Faz |
|---|---|---|---|---|---|
| 4XL | 4xl kaç beden, 4xl erkek kaç numara | bilgi | `/erkek/beden-rehberi/4xl` | SIZE_GUIDE | C |
| 3XL / 5XL / 6XL | 3xl/5xl/6xl kaç beden | bilgi | `/erkek/beden-rehberi/3xl`, `/5xl`, `/6xl` | SIZE_GUIDE | 2 (marka verisi yeterliyse; değilse harf tablosunda kalır) |
| Gömlek yaka ölçüsü | gömlek yaka numarası, 46 yaka kaç beden | bilgi | `/erkek/beden-rehberi/gomlek-yaka-olcusu` | SIZE_GUIDE | C |
| Pantolon / jean bel-boy | erkek pantolon beden tablosu, 40 beden jean kaç cm | bilgi | `/erkek/beden-rehberi/pantolon-jean-beden` | SIZE_GUIDE | 2 |
| Takım elbise bedeni (normal/untersetzt "göbekli kalıp" ölçüleri) | büyük beden takım elbise beden | bilgi | `/erkek/beden-rehberi/takim-elbise-beden` | SIZE_GUIDE | 3 |

**Erkek kategori hub'ları**

| Hub | Hedef sorgu | Spoke'lar (faz) |
|---|---|---|
| `/erkek/giyim/tisort` (C) | büyük beden erkek tişört, 4xl tişört | `/4xl` (C), `/oversize` (2), `/5xl` (3) |
| `/erkek/giyim/gomlek` (C) | büyük beden erkek gömlek | `/nasil-secilir` (C), `/kisa-kollu` (2) |
| `/erkek/giyim/pantolon` (C) | büyük beden erkek pantolon | `/gobekli-erkek-pantolon` (2, saygılı dille; "karın bölgesi rahat kalıp"), `/chino` (2) |
| `/erkek/giyim/jean` (C) | büyük beden erkek jean | `/kalip-rehberi` (2) |
| `/erkek/giyim/triko` (C) | büyük beden erkek kazak | `/kazak-secimi` (2) |
| `/erkek/giyim/hirka` (C) | büyük beden erkek hırka | — |
| `/erkek/giyim/mont` (C) | büyük beden erkek mont | `/kislik-mont-secimi` (2) |
| `/erkek/giyim/polo`, `/esofman`, `/sweatshirt`, `/takim-elbise` | — | 2. dalga hub'lar |

**Erkek stil hub:** `/erkek/stil` (C) · spoke (2): `/karin-bolgesi-icin-kalip-secimi`, `/gomlek-nasil-giyilir`, `/smart-casual`, `/ofis-stili`.
**Erkek kombin hub:** `/erkek/kombinler` (C) · spoke (2): `/gunluk`, `/ofis`, `/smart-casual`, `/yaz`, `/kis`, `/jean`, `/gomlek`.

Erkek örnek yolculuk (brief §27): `/erkek/giyim/tisort` → `/erkek/giyim/tisort/4xl` → `/erkek/beden-rehberi` → `/erkek/stil` → ilgili marka.

### 2.4 Ortak: Kumaş Rehberi

**Hub:** `/kumas-rehberi` (C) · "kumaş türleri, hangi kumaş terletmez" · FABRIC_GUIDE (hub). Tablolu karşılaştırma (lif türü, his, esneme, mevsim, bakım) + her kumaşa link.

| Spoke | Hedef sorgu | URL | Faz | Notlar |
|---|---|---|---|---|
| Viskon | viskon nedir, viskon terletir mi | `/kumas-rehberi/viskon` | C | → elbise, bluz hub; ← kadın elbise, kadın kombin yaz |
| Pamuk | pamuk kumaş özellikleri | `/kumas-rehberi/pamuk` | C | → tişört hub'ları (iki silo), penye |
| Polyester | polyester nedir, terletir mi | `/kumas-rehberi/polyester` | C | → scuba, abiye |
| Akrilik | akrilik nedir, tüylenir mi | `/kumas-rehberi/akrilik` | C | → triko hub'ları |
| Elastan / Likra | elastan nedir, likra nedir | `/kumas-rehberi/elastan` | C | "Likra" ayrı sayfa değil: LYCRA® bir elastan markasıdır; `likra` araması bu sayfaya yönlenir (301 veya arama eşanlamlısı) – çift içerik yok |
| Modal | modal kumaş nedir | `/kumas-rehberi/modal` | 2 | |
| Keten | keten nedir | `/kumas-rehberi/keten` | 2 | |
| Triko | triko nedir (örme yapı) | `/kumas-rehberi/triko` | 2 | lif değil yapı olduğu vurgulanır |
| Penye | penye nedir | `/kumas-rehberi/penye` | 2 | |
| Scuba | scuba kumaş nedir | `/kumas-rehberi/scuba` | 2 | |
| Şardonlu | şardonlu ne demek | `/kumas-rehberi/sardonlu` | 2 | |
| Gabardin | gabardin kumaş nedir | `/kumas-rehberi/gabardin` | 2 | |
| Denim | denim nedir | `/kumas-rehberi/denim` | 2 | → jean hub'ları (iki silo) |
| Karşılaştırma | viskon mu pamuk mu | `/kumas-rehberi/viskon-mu-pamuk-mu` | 2 | brief §52 sorusu |

### 2.5 Ortak: Stil, Kombinler, Trendler, Rehberler

- `/stil` (C) – STYLE_GUIDE hub: kadın/erkek stil hub'larına iki büyük giriş + ortak kavramlar. Spoke: `/stil/oversize-ne-demek` (C), `/stil/kalip-sozlugu` (2: regular, slim, relaxed, comfort, A kesim…), `/stil/renk-ve-desen` (2).
- `/kombinler` (C) – OUTFIT_GUIDE hub; iki siloya yönlendirir, ortak mevsim başlıkları.
- `/trendler` (C) – TREND hub; tarihli içerik, yayın + güncelleme tarihi zorunlu. İlk içerik: `/trendler/2026-sonbahar-kis` (2) – yalnız kaynaklı (podyum/marka koleksiyon duyurusu) bilgiyle.
- `/rehberler` – brief §3 navigasyonda var; ilk aşamada ayrı içerik üretmek yerine tüm rehber tiplerini listeleyen indeks sayfası olarak (boş kalmaması şartıyla) C listesinde değil; navigasyonda yer alacaksa tüm rehberleri listeleyen gerçek bir dizin olarak yayınlanır.

### 2.6 Ortak: Markalar ve Alışveriş Rehberi

- `/markalar` (C) – BRAND_GUIDE dizini, ItemList. Filtre: kadın/erkek/ikisi, Türk/yabancı. Filtre URL'leri noindex.
- `/marka/[slug]` – BRAND_GUIDE; yalnız §4'te doğrulanan alanlarla. İlk dalgada doğrulanmış alan sayısı en yüksek 4–6 marka (bkz. §4).
- `/alisveris-rehberi` (C) – SHOPPING_GUIDE hub. Spoke: `/alisveris-rehberi/buyuk-beden-markalari` (C), `/alisveris-rehberi/52-beden-elbise-nereden-alinir` (2), `/alisveris-rehberi/4xl-tisort-nereden-alinir` (2), `/alisveris-rehberi/buyuk-beden-jean-markalari` (2). Buyukbedengiyim.com linki yalnız `RelatedShoppingCTA` ile, doğal bağlamda (brief §16).

---

## 3. İlk ~40 cornerstone sayfa (brief §34 + en değerli spoke'lar)

Öncelik: **P1** önce yayınlanır (navigasyon iskeleti + beden çekirdeği), **P2** ardından, **P3** cornerstone setini tamamlar. "Veri bağımlılığı" sütunu `docs/kaynaklar-beden.md` ve marka doğrulama tablosundaki kayıtlara atıf yapar; bağımlılık karşılanmadan sayfa yayınlanmaz veya ilgili bölüm gösterilmez.

| # | Öncelik | URL | H1 | Amaç (tek satır) | Zorunlu bölümler | Veri bağımlılığı |
|---|---|---|---|---|---|---|
| 1 | P1 | `/beden-rehberi` | Beden Rehberi: Bedeninizi Doğru Bulun | Tüm beden içeriğinin kapısı; kadın/erkek ayrımına yönlendirir | Kısa cevap, kadın/erkek kartları, harf↔numara özeti, ölçü alma özeti, markaya göre değişir uyarısı, SSS | kaynaklar-beden §1–§3 özet aralıklar |
| 2 | P1 | `/kadin/beden-rehberi` | Kadın Beden Rehberi ve Beden Tabloları | Kadın beden sistemleri, 42–66, marka tabloları | Kısa cevap, TR/EU numara↔harf tablosu (aralık), marka bazlı göğüs/bel/basen tabloları, UK/US çevirme, ölçü alma, SSS | kaynaklar-beden §2 (kadın tabloları) |
| 3 | P1 | `/erkek/beden-rehberi` | Erkek Beden Rehberi ve Beden Tabloları | Erkek sistemleri, XL–8XL, gömlek yaka, pantolon | Kısa cevap, harf↔EU numara (aralık), marka tabloları, yaka ölçüsü özeti, ölçü alma, SSS | kaynaklar-beden §3 (erkek tabloları) |
| 4 | P1 | `/beden-rehberi/harf-beden-karsiliklari` | XL, 2XL, 3XL, 4XL… Kaç Beden? Harf ve Numara Karşılıkları | "X kaç beden" sorgularının tek otorite sayfası | Kısa cevap kutusu, kadın tablosu, erkek tablosu (ayrı), markalar arası fark açıklaması, kaynak listesi, SSS | kaynaklar-beden §4 sonuç tablosu (≥3 marka/satır) |
| 5 | P1 | `/beden-rehberi/olcu-alma-rehberi` | Vücut Ölçüsü Nasıl Alınır? Adım Adım Ölçü Rehberi | Doğru ölçü = doğru beden; tüm beden sayfalarının bağlandığı yöntem sayfası | Gerekenler, göğüs/bel/basen/omuz/iç bacak/kol/yaka adımları (SVG çizim), sık hatalar, kadın/erkek farkları | kaynaklar-beden §5 ölçü yöntemi kaynakları |
| 6 | P1 | `/kadin/beden-rehberi/52-beden` | 52 Beden Kaç XL? Ölçüler ve Markalara Göre Karşılıklar | En yüksek hacimli kadın beden sorgusuna kaynaklı cevap | Kısa cevap (aralık), marka tablosu (göğüs/bel/basen), "erkekte 52 farklıdır" kutusu, kalıp/kumaş ipuçları, ilgili kategoriler, SSS | kaynaklar-beden §2 + §4; en az 4 markada 52 satırı |
| 7 | P1 | `/erkek/beden-rehberi/4xl` | 4XL Kaç Beden? Erkekte 4XL Ölçüleri | Erkek 4XL sorgusuna kaynaklı cevap | Kısa cevap, marka tablosu (göğüs/bel), tişört/gömlek/pantolon farkı, "kadında 4XL" kutusu, SSS | kaynaklar-beden §3 + §4; en az 4 markada 4XL satırı |
| 8 | P1 | `/beden-rehberi/buyuk-beden-kac-bedenden-baslar` | Büyük Beden Kaç Bedenden Başlar? | Tek resmi eşik olmadığını, markaların nasıl tanımladığını gösterir | Kısa cevap, marka tanımları tablosu (kaynaklı), akademik tanım, kadın/erkek farkı, SSS | kaynaklar-beden §4.3 (marka eşikleri) |
| 9 | P1 | `/kadin/giyim` | Büyük Beden Kadın Giyim Rehberi | Kadın silo ana hub'ı | Giriş, beden seçimi özeti, kategori ızgarası (yalnız yayında olanlar), popüler rehberler, kombin/kumaş/marka blokları, SSS | Kategori hub'larının yayın durumu |
| 10 | P1 | `/erkek/giyim` | Büyük Beden Erkek Giyim Rehberi | Erkek silo ana hub'ı (kadının eki değil) | Aynı yapı, 4XL–6XL içerik bloğu | Kategori hub'ları |
| 11 | P1 | `/kumas-rehberi` | Kumaş Rehberi: Hangi Kumaş Ne İşe Yarar? | Kumaş otorite hub'ı | Karşılaştırma tablosu (lif kökeni, his, esneme, mevsim, bakım), kumaş kartları, giysi seçiminde kumaş, SSS | kaynaklar-beden §6 |
| 12 | P1 | `/markalar` | Büyük Beden Markaları Dizini | Doğrulanmış marka dizini | Filtre (kadın/erkek), marka kartları (yalnız doğrulanan alanlar), yöntem notu ("bilgiler resmi siteden, şu tarihte") | §4 marka tablosu |
| 13 | P2 | `/kadin/giyim/elbise` | Büyük Beden Elbise Rehberi | Elbise topic hub'ı | Nedir/kalıp sözlüğü, nasıl seçilir özeti, beden/kumaş/kalıp, kullanım alanları, ilgili beden/kombin/kumaş/marka, SSS | Kumaş sayfaları; beden rehberi |
| 14 | P2 | `/kadin/giyim/elbise/nasil-secilir` | Büyük Beden Elbise Nasıl Seçilir? | Karar akışı: ölçü → kalıp → kumaş → boy → kullanım | Kısa cevap, adımlar, kalıp tablosu (kim için), kumaş seçimi, beden kontrol listesi, SSS | Ölçü alma; kumaş §6 |
| 15 | P2 | `/kadin/giyim/pantolon` | Büyük Beden Kadın Pantolon Rehberi | Pantolon hub; basen/bel farkı | Kalıplar, bel-basen ölçüsü, esneme payı, kullanım, SSS | Kadın tabloları (bel/basen) |
| 16 | P2 | `/kadin/giyim/jean` | Büyük Beden Kadın Jean Rehberi | Jean hub; W/L sistemi | Kalıp sözlüğü, W/L ölçüleri, denim ve elastan, SSS | Jean beden tablosu (kaynaklı; yoksa bölüm gizli) |
| 17 | P2 | `/kadin/giyim/triko` | Büyük Beden Triko ve Kazak Rehberi (Kadın) | Triko hub | Örgü kalınlığı, iplik (akrilik/yün/pamuk), kalıp, bakım, SSS | Kumaş §6 |
| 18 | P2 | `/kadin/giyim/hirka` | Büyük Beden Hırka Rehberi (Kadın) | Hırka hub | Boy seçimi, kalıp, iplik, kombin | Kumaş §6 |
| 19 | P2 | `/kadin/giyim/gomlek` | Büyük Beden Kadın Gömlek Rehberi | Gömlek hub | Göğüs açılması, kalıp, kumaş, beden, SSS | Kadın tabloları (göğüs) |
| 20 | P2 | `/kadin/giyim/tisort` | Büyük Beden Kadın Tişört Rehberi | Tişört hub | Kalıp (regular/oversize), penye/pamuk, beden, SSS | Kumaş §6 |
| 21 | P2 | `/kadin/giyim/abiye` | Büyük Beden Abiye Rehberi | Abiye hub; düğün/özel gün | Kalıp, kumaş (scuba, şifon, saten), beden payı, SSS | Kumaş §6 |
| 22 | P2 | `/erkek/giyim/tisort` | Büyük Beden Erkek Tişört Rehberi | Tişört hub | Kalıp, kumaş, beden, boy uzunluğu, SSS | Erkek tabloları |
| 23 | P2 | `/erkek/giyim/tisort/4xl` | 4XL Erkek Tişört Nasıl Seçilir? | 4XL tişört niyetine rehber (ticari geçiş) | Kısa cevap, ölçüye göre seçim, kalıp/boy, kumaş, nereden bakılır (objektif), SSS | §3 + §4 erkek 4XL |
| 24 | P2 | `/erkek/giyim/gomlek` | Büyük Beden Erkek Gömlek Rehberi | Gömlek hub | Yaka, göğüs, kalıp, kol boyu, kumaş, SSS | Yaka tablosu |
| 25 | P2 | `/erkek/giyim/gomlek/nasil-secilir` | Büyük Beden Erkek Gömlek Nasıl Seçilir? | Adım adım gömlek seçimi | Yaka ölçüsü, göğüs/bel, kalıp, kol boyu, düğme aralığı, kumaş, SSS | Yaka tablosu (kaynaklı) |
| 26 | P2 | `/erkek/beden-rehberi/gomlek-yaka-olcusu` | Gömlek Yaka Ölçüsü Nasıl Alınır? Yaka Numarası Tablosu | Yaka numarası ↔ harf | Ölçüm adımları, marka yaka tabloları, SSS | kaynaklar-beden §3 (yaka) |
| 27 | P2 | `/erkek/giyim/pantolon` | Büyük Beden Erkek Pantolon Rehberi | Pantolon hub | Bel/boy, kalıp (regular/comfort), karın bölgesi için rahat kalıplar, SSS | Erkek bel tabloları |
| 28 | P2 | `/erkek/giyim/jean` | Büyük Beden Erkek Jean Rehberi | Jean hub | W/L, kalıp, denim+elastan, SSS | Jean tablosu |
| 29 | P2 | `/erkek/giyim/triko` | Büyük Beden Erkek Triko ve Kazak Rehberi | Triko hub | İplik, kalıp, bakım, SSS | Kumaş §6 |
| 30 | P2 | `/erkek/giyim/hirka` | Büyük Beden Erkek Hırka Rehberi | Hırka hub | Kalıp, iplik, kombin | Kumaş §6 |
| 31 | P2 | `/erkek/giyim/mont` | Büyük Beden Erkek Mont Rehberi | Mont hub | Kat payı (içine kalın giyim), kalıp, dolgu, boy, SSS | — (dolgu teknik değerleri kaynaksız yazılmaz) |
| 32 | P2 | `/kumas-rehberi/viskon` | Viskon Nedir? Özellikleri, Bakımı ve Kullanımı | Viskon sorgusuna otorite cevap | Tanım kutusu, nasıl üretilir, his, artı/eksi, bakım, giysi seçiminde etkisi, viskon–pamuk, SSS | kaynaklar-beden §6 viskon |
| 33 | P2 | `/kumas-rehberi/pamuk` | Pamuk Kumaş: Özellikleri ve Bakımı | Pamuk cevabı | Aynı FABRIC_GUIDE şablonu | §6 pamuk |
| 34 | P2 | `/kumas-rehberi/akrilik` | Akrilik Nedir? Tüylenir mi, Nasıl Bakılır? | Akrilik cevabı | Şablon + boncuklanma bölümü | §6 akrilik |
| 35 | P2 | `/kumas-rehberi/elastan` | Elastan (Likra) Nedir? Esneyen Kumaşlar Rehberi | Elastan/likra; esneme payının beden seçimine etkisi | Tanım, LYCRA marka notu, karışım oranları, bakım, SSS | §6 elastan |
| 36 | P2 | `/kumas-rehberi/polyester` | Polyester Nedir? Terletir mi? | Polyester cevabı | Şablon | §6 polyester |
| 37 | P3 | `/kadin/stil` | Kadın Stil Rehberi | Kadın stil hub'ı | Vücut oranı dili (saygılı), kalıp/renk/desen ilkeleri, spoke kartları | — |
| 38 | P3 | `/kadin/kombinler` | Kadın Kombin Rehberi | Kadın kombin hub'ı | Mevsim/ortam kartları, kombin şablonu açıklaması | — |
| 39 | P3 | `/erkek/stil` | Erkek Stil Rehberi | Erkek stil hub'ı | Kalıp, gömlek/pantolon oranı, smart casual girişi | — |
| 40 | P3 | `/erkek/kombinler` | Erkek Kombin Rehberi | Erkek kombin hub'ı | Ortam/mevsim kartları | — |
| 41 | P3 | `/stil` | Stil Rehberi | Ortak stil hub'ı (iki siloya kapı) | Kadın/erkek giriş, ortak kavramlar | — |
| 42 | P3 | `/stil/oversize-ne-demek` | Oversize Ne Demek? Bol Kalıp Nasıl Giyilir? | Oversize sorgusuna cevap | Tanım, oversize vs bir beden büyük, kadın/erkek örnekleri, SSS | — (tanım editoryal; sözlük kaynağı eklenebilir) |
| 43 | P3 | `/kombinler` | Kombin Rehberi | Ortak kombin hub'ı | Kadın/erkek kapıları | — |
| 44 | P3 | `/trendler` | Büyük Beden Moda Trendleri | Tarihli trend içeriğinin hub'ı | Güncel sezon (tarihli), arşiv | Kaynaklı sezon içeriği olmadan yalnız rehber dizini |
| 45 | P3 | `/alisveris-rehberi` | Alışveriş Rehberi | Ticari niyetli objektif rehberlerin hub'ı | Rehber kartları, yöntem/bağımsızlık notu | — |
| 46 | P3 | `/alisveris-rehberi/buyuk-beden-markalari` | Türkiye'de Büyük Beden Markaları: Kadın ve Erkek | "büyük beden markaları" ticari sorgusu | Kadın/erkek ayrı listeler, doğrulanan alanlar, nasıl seçtik notu | §4 marka tablosu |
| 47 | P3 | `/beden-rehberi/uluslararasi-beden-cevirme` | TR, EU, UK ve US Beden Çevirme Rehberi | Yurt dışı marka alışverişi | Kadın/erkek ayrı çevirme tabloları (marka kaynaklı) | kaynaklar-beden §2.x / §3.x çevirme tabloları |

Not: Liste 47 satır; brief "~40" dediği için P3'teki #43 `/kombinler`, #41 `/stil` gibi ortak hub'lar silo hub'larından sonra yayınlanabilir. Kadın `48-beden` ve marka sayfaları (`/marka/[slug]`) veri doğrulandıkça cornerstone setine eklenir; ilk marka sayfaları için §4'te "Doğrulanan alan" sayısı en yüksek markalar seçilir.

**Silo kuralları (tüm cornerstone'lar):** canonical kendi URL'si; breadcrumb ör. Ana Sayfa → Kadın → Beden Rehberi → 52 Beden. Kadın beden sayfalarında "erkek karşılığı" kutusu yalnız tek cümle + `/erkek/beden-rehberi` linki (içerik karışmaz).

---

## 4. Marka adayları ve doğrulama durumu

(Bu bölüm marka doğrulama araştırması tamamlanınca doldurulur – aşağıya bakın.)

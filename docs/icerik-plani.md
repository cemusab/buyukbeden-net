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
   - "Kaç kilo" alt niyeti çok güçlü (başlıklarda geçiyor). Kilo→beden dönüşümü **güvenilir şekilde verilemez** (boy, vücut tipi değişkeni). Önerimiz: H2 olarak "Kaç kiloya denk gelir?" sorusunu açıkça ele alıp neden tek sayı verilemeyeceğini dürüstçe anlatmak ve ölçü almaya yönlendirmek. Uydurma kilo tablosu yok. Bu niyet için ayrı cornerstone: `/erkek/beden-rehberi/boy-kilo-beden` ve `/kadin/beden-rehberi/boy-kilo-beden` (#48–#49). İlke (site sahibi): **beden orana bağlıdır, kiloya değil** – aynı kilodaki kısa boylu kişide ağırlık daha büyük çevre ölçülerine (göğüs, karın/bel) dağılır, uzun boylu kişide ise kol ve beden boyu ihtiyacı öne çıkar; bu yüzden aynı kiloda farklı harf bedenler gerekebilir.
3. **Featured snippet / AEO formatı:** soru tipi başlık (H1 veya ilk H2) + 40–60 kelimelik kısa cevap kutusu + kaynaklı karşılaştırma tablosu (marka bazında) + "nasıl ölçülür" adım listesi + SSS (FAQ blokları; FAQPage schema şu an Google'da zengin sonuç vermese de AI özetleri için yapı faydalı).

### 1.2 Soru bazında

| Sorgu | Niyet | Şu an görünen sayfa tipi | Daha iyi cevabın ihtiyacı | Snippet / AEO formatı | Bizim URL |
|---|---|---|---|---|---|
| 52 beden kaç XL | bilgi | Haber açıklayıcı yazıları, Yandex AI derlemesi, pazar yeri ürün sayfaları; özetlerde erkek bedeniyle karışıklık | Kadın ve erkek ayrımı; markalara göre aralık tablosu (kaynaklı); göğüs/bel/basen cm aralıkları; "markaya göre değişir" açıklaması; ölçü alma | Kısa cevap (aralık + "markaya göre") → marka tablosu → adımlar → SSS | `/kadin/beden-rehberi/52-beden-kac-xl` (+ erkek kutusu → `/erkek/beden-rehberi`) |
| 54 / 56 beden kaç XL | bilgi | Aynı tip; tekil sayfa çok az | 52 sayfasıyla aynı şablon; yeterli marka verisi varsa ayrı sayfa, yoksa 52 sayfasının yanındaki "harf↔numara" tablosunda | Tablo | Önce `/beden-rehberi/harf-beden-karsiliklari` içinde; veri yeterliyse `/kadin/beden-rehberi/54-beden-kac-xl`, `56-beden` (2. dalga) |
| XL / 2XL / 3XL kaç beden | bilgi | İngilizce "what is XL" sayfaları, ABD odaklı; TR'de haber yazıları | Kadın ve erkek ayrı sütun; TR/EU numara karşılığı markalara göre aralık; US/UK karşılığı | Tablo (harf → kadın TR/EU → erkek TR/EU) + kısa cevap | `/beden-rehberi/harf-beden-karsiliklari` |
| 4XL kaç beden | bilgi (erkekte ticari geçiş: "4XL tişört") | Haber yazısı ("48 = 4XL"), pazar yeri "4XL sweatshirt erkek" kategorisi, ABD ürün sayfaları; DeFacto'ya atıfla "60-62" iddiası (resmi tabloda erkek 4XL = TR/EU 60; kaynaklar-beden §3.3) | Erkek ve kadın ayrı; erkekte göğüs cm aralığı; tişört vs gömlek vs pantolon farkı | Kısa cevap + erkek marka tablosu + "tişörtte / gömlekte" bölümleri | `/erkek/beden-rehberi/4xl-kac-beden` (+ kadın kutusu) |
| 5XL / 6XL / 7XL / 8XL kaç beden | bilgi | Çok zayıf TR içerik | 4XL sayfasıyla aynı şablon; marka sayısı az olduğundan önce ortak tabloda | Tablo | Önce `/beden-rehberi/harf-beden-karsiliklari`; veri yeterliyse `/erkek/beden-rehberi/5xl-kac-beden` vb. (2. dalga) |
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
| Markalar arası beden farkı | neden her markada bedenim farklı | bilgi | `/beden-rehberi/markalara-gore-beden-farki` | ARTICLE | C (#53) | → marka sayfaları · ← harf karşılıkları |
| Online alışverişte beden seçimi | internetten kıyafet alırken beden | bilgi | `/beden-rehberi/online-beden-secimi` | ARTICLE | 2 | → ölçü alma, alışveriş rehberi |

### 2.2 Kadın silo

**Hub:** `/kadin` (silo girişi; navigasyon) → `/kadin/giyim` · "büyük beden kadın giyim" · bilgi+ticari · CATEGORY_HUB · **C**

**Kadın beden rehberi hub:** `/kadin/beden-rehberi` · "kadın beden tablosu, büyük beden kadın beden tablosu" · SIZE_GUIDE · **C**

| Spoke | Hedef sorgu | Niyet | URL | Tip | Faz |
|---|---|---|---|---|---|
| 52 beden | 52 beden kaç xl, 52 beden ölçüleri | bilgi | `/kadin/beden-rehberi/52-beden-kac-xl` | SIZE_GUIDE | C |
| 48 beden | 48 beden kaç xl | bilgi | `/kadin/beden-rehberi/48-beden-kac-xl` | SIZE_GUIDE | C (veri yeterliyse) |
| 50 beden | 50 beden kaç xl | bilgi | `/kadin/beden-rehberi/50-beden-kac-xl` | SIZE_GUIDE | 2 |
| 54 / 56 / 58 beden | 54 beden kaç xl … | bilgi | `/kadin/beden-rehberi/54-beden-kac-xl` … | SIZE_GUIDE | 2–3 (en az 4 kaynaklı marka tablosu şartı) |
| Kadın pantolon bedeni (bel/basen, boy) | kadın pantolon beden tablosu | bilgi | `/kadin/beden-rehberi/pantolon-beden` | SIZE_GUIDE | 2 |
| Kadın jean bedeni (W/L) | jean beden 32 kaç beden kadın | bilgi | `/kadin/beden-rehberi/jean-beden` | SIZE_GUIDE | 2 |
| Sütyen bedeni | büyük beden sütyen ölçüsü | bilgi | `/kadin/beden-rehberi/sutyen-bedeni` | SIZE_GUIDE | 3 (kaynak araştırması ayrı) |
| Boy, kilo ve beden | 70 kilo kaç beden, 90 kilo kaç beden, boya göre beden | bilgi | `/kadin/beden-rehberi/boy-kilo-beden` | SIZE_GUIDE | C (kilo→beden tablosu YOK; neden yanıltır + ölçü alma + markaların yayımladığı boy aralıkları, kaynaklı) |
| Kısa / uzun boylu büyük beden (kadın) | kısa boylu büyük beden, petite büyük beden, uzun boy pantolon | bilgi | `/kadin/beden-rehberi/kisa-uzun-boy` | SIZE_GUIDE | 2 (Ulla Popken kısa/uzun bedenleri, H&M Petite verisiyle) |

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

Kadın örnek yolculuk (brief §29): `/kadin/beden-rehberi/52-beden-kac-xl` → `/kadin/giyim/elbise` → `/kadin/giyim/elbise/nasil-secilir` → `/kumas-rehberi/viskon` → `/kadin/kombinler/yaz`.

### 2.3 Erkek silo

**Hub:** `/erkek/giyim` · "büyük beden erkek giyim, battal beden erkek" · bilgi+ticari · CATEGORY_HUB · **C**

**Erkek beden rehberi hub:** `/erkek/beden-rehberi` · "erkek beden tablosu, büyük beden erkek beden tablosu" · SIZE_GUIDE · **C**

| Spoke | Hedef sorgu | Niyet | URL | Tip | Faz |
|---|---|---|---|---|---|
| 4XL | 4xl kaç beden, 4xl erkek kaç numara | bilgi | `/erkek/beden-rehberi/4xl-kac-beden` | SIZE_GUIDE | C |
| 3XL / 5XL / 6XL | 3xl/5xl/6xl kaç beden | bilgi | `/erkek/beden-rehberi/3xl-kac-beden`, `/5xl`, `/6xl` | SIZE_GUIDE | 2 (marka verisi yeterliyse; değilse harf tablosunda kalır) |
| Gömlek yaka ölçüsü | gömlek yaka numarası, 46 yaka kaç beden | bilgi | `/erkek/beden-rehberi/gomlek-yaka-olcusu` | SIZE_GUIDE | C |
| Pantolon / jean bel-boy | erkek pantolon beden tablosu, 40 beden jean kaç cm | bilgi | `/erkek/beden-rehberi/pantolon-jean-beden` | SIZE_GUIDE | 2 |
| Takım elbise bedeni (normal/untersetzt "göbekli kalıp" ölçüleri) | büyük beden takım elbise beden | bilgi | `/erkek/beden-rehberi/takim-elbise-beden` | SIZE_GUIDE | 3 |
| Boy, kilo ve beden | 120 kilo kaç beden, 150 kilo kaç xl, boya göre beden | bilgi | `/erkek/beden-rehberi/boy-kilo-beden` | SIZE_GUIDE | C (kilo→beden tablosu YOK; aynı kiloda kısa ve uzun boylu iki kişinin neden farklı beden giydiği; ölçü alma; yalnız markaların yayımladığı aralıklar) |
| Kısa boylu büyük beden erkek | kısa boylu kilolu erkek pantolon, kısa paça büyük beden | bilgi | `/erkek/beden-rehberi/kisa-boylu-buyuk-beden` | SIZE_GUIDE | C (JP1880 untersetzt tablosu, iç bacak, drop/comfort kalıp) |
| Uzun boylu büyük beden erkek | uzun boylu büyük beden, tall beden, 3xl uzun tişört | bilgi | `/erkek/beden-rehberi/uzun-boylu-buyuk-beden` | SIZE_GUIDE | C (JP1880 tall, M&S Big & Tall Longer, H&M Long verisiyle) |
| Kalıp sözlüğü (regular, comfort, relaxed, drop, oversize, düşük omuz) | comfort fit ne demek, drop ne demek | bilgi | `/erkek/beden-rehberi/kalip-sozlugu` | SIZE_GUIDE | 2 (`/stil/kalip-sozlugu` ile birleşebilir; çift içerik yok) |

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

### 2.7 Ek kümeler (site sahibi geri bildirimi ve `docs/rapor-notlari.md`, 2026-10-07)

Rapordaki istatistikler kendi birincil kaynağımızla doğrulanmadığı için **kullanılmadı**. Aşağıdaki kümeler yalnız içerik/niyet yapısıdır.

**a) Erkek: Big ve Tall ekseni, battal beden**

| Sayfa | Hedef sorgu | URL | Tip | Faz | Veri |
|---|---|---|---|---|---|
| Battal beden nedir, battal boy | battal beden, battal boy tişört, battal beden erkek | `/erkek/beden-rehberi/battal-beden` | SIZE_GUIDE | C | "Battal" resmi bir beden adı değildir (resmi sitelerde tanımı bulunamadı, kaynaklar-beden §5A.6); arama dili olarak açıklanır; Big (genişlik) ve Tall (boy) eksenleri §5A.7 |
| Uzun boylu büyük beden erkek | uzun boy büyük beden, tall beden | `/erkek/beden-rehberi/uzun-boylu-buyuk-beden` | SIZE_GUIDE | C (#51) | JP1880 Tall ≥190 cm, M&S Longer, H&M Long |
| 8XL kaç beden | 8xl kaç beden, 8xl kaç kilo | `/erkek/beden-rehberi/8xl-kac-beden` | SIZE_GUIDE | 2 | Yalnız JP1880 vücut verisi (84/86, göğüs 166–173) + Türk markalarının giysi tabloları (MocGrande/Starbattal 8XL, Kiğılı filtrede 8X); kısa cevap + proporsiyon uyarısı; kilo sorusuna §1.1 yaklaşımı. Tek markaya dayandığı için "Doğrulanıyor" etiketli bölümlerle; yeterli değilse harf karşılıkları sayfasında kalır |
| 5XL / 6XL / 7XL kaç beden | … | `/erkek/beden-rehberi/{5xl,6xl,7xl}-kac-beden` | SIZE_GUIDE | 2–3 | Aynı kural |

**b) Kategoriye özel uyum (fit) rehberleri**

| Sayfa | URL | Silo | Faz | Veri |
|---|---|---|---|---|
| Jean kalıp rehberi (kadın) | `/kadin/giyim/jean/kalip-rehberi` | kadın | 2 | Kalıp terimleri yalnız marka tanımlarıyla; jean bel cm (Mavi kadın tablosu ayrıca doğrulanmalı) |
| Jean kalıp ve beden rehberi (erkek) | `/erkek/giyim/jean/kalip-rehberi` | erkek | 2 | Mavi erkek jean tablosu, JP1880 kalıp tanımları (kaynaklar-beden §3.4, §5A.6) |
| Gömlek yaka ve kol ölçüsü | `/erkek/beden-rehberi/gomlek-yaka-olcusu` | erkek | C (#26) | §3.1, §3.5, §3.6, §5 |
| Pantolon bel ve iç bacak | `/erkek/beden-rehberi/pantolon-jean-beden` · `/kadin/beden-rehberi/pantolon-beden` | iki silo ayrı | 2 | §3.1 untersetzt/long, §2 bel/basen |
| Sütyen bedeni ve kup ölçüsü | `/kadin/beden-rehberi/sutyen-bedeni` | kadın | C (#52) | iç giyim kümesi (c) |

**c) Kadın iç giyim kümesi** (bilgilendirici ve nötr ton; cinselleştiren anlatım yok)

Hub: `/kadin/giyim/ic-giyim` (CATEGORY_HUB, faz 2 → sütyen sayfası yayınlanınca C'ye alınır)

| Spoke | Hedef sorgu | URL | Faz | Veri |
|---|---|---|---|---|
| Sütyen bedeni ve kup ölçüsü nasıl alınır | sütyen bedeni nasıl ölçülür, kup hesaplama, büyük beden sütyen ölçüsü | `/kadin/beden-rehberi/sutyen-bedeni` | C | Resmi marka ölçüm yöntemi + TR/EU bant/kup ve UK/US çevirme tabloları (kaynaklar-beden §8; araştırma sürüyor) |
| Büyük beden sütyen seçimi | büyük beden sütyen önerileri, destekli sütyen | `/kadin/giyim/ic-giyim/sutyen-secimi` | 2 | Destek, balenli/balensiz, geniş askı, yan destek – yalnız markaların kendi ürün tanımlarıyla |
| Külot kalıpları | külot çeşitleri, yüksek bel külot | `/kadin/giyim/ic-giyim/kulot-kaliplari` | 2 | Marka kalıp adları (slip, bikini, hipster, yüksek bel, boxer) |
| Takım (sütyen + külot) alırken dikkat | sütyen külot takımı beden seçimi | `/kadin/giyim/ic-giyim/takim-secimi` | 2 | Üst ve alt bedeni ayrı ölçüye göre seçme; set bedenleme mantığı |
| İç giyim kumaşı ve bakımı | pamuk mu modal mı iç çamaşırı | `/kumas-rehberi/ic-giyim-kumaslari` | 2 | §6 pamuk/modal/elastan + §7 bakım; mikrofiber ve dantel için ayrı kaynak gerekli |

Uluslararası örnekler (Ulla Popken iç giyim vb.) yalnız bağlam olarak; Türkiye'de erişim doğrulanmadan "buradan alın" denmez.

**d) Ek kategori hub'ları (sonraki dalga; hub içeriği yazılınca menüde görünür)**
- Kadın: `/kadin/giyim/tunik`, `/kadin/giyim/tesettur`, `/kadin/giyim/mayo-hasema`, `/kadin/giyim/spor-giyim` – arama dilinde güçlü (kadın "büyük beden + ürün": abiye, elbise, tesettür, mayo/haşema, tunik); **tunik ve tesettür 2. dalganın başında** (yüksek değer), mayo-haşema sezon öncesi (ilkbahar), spor-giyim 3. dalga.
- Erkek: `/erkek/giyim/sort-deniz-sortu` (sezon öncesi), `/erkek/giyim/spor-giyim`, `/erkek/giyim/ic-giyim` – 3. dalga.

**e) Durum (occasion) kümeleri** – kombin ve stil içeriklerinin ana gruplaması; her silo ayrı

| Küme | Kadın URL'leri | Erkek URL'leri |
|---|---|---|
| Davet & Abiye (nişan, düğün, mezuniyet) | `/kadin/kombinler/davet` hub → `/dugun`, `/nisan`, `/mezuniyet` | `/erkek/kombinler/davet` → `/dugun`, `/mezuniyet` |
| İşe uygun / Ofis | `/kadin/kombinler/ofis` | `/erkek/kombinler/ofis`, `/erkek/kombinler/smart-casual` |
| Günlük rahatlık | `/kadin/kombinler/gunluk` | `/erkek/kombinler/gunluk` |
| Tatil & Deniz | `/kadin/kombinler/tatil` (→ mayo-haşema hub) | `/erkek/kombinler/tatil` (→ şort-deniz şortu) |
| Spor & Konfor | `/kadin/kombinler/spor` | `/erkek/kombinler/spor` |

Ton: kadında moda-önce ve özgüvenli; erkekte işlevsel ve özgüvenli. "Gizle / kapat / kusur" dili kullanılmaz.

**f) Şikâyetlerden doğan rehberler (ortak)**

| Sayfa | URL | Tip | Faz | Kaynak / not |
|---|---|---|---|---|
| Beden neden markadan markaya değişir, nasıl önlem alınır | `/beden-rehberi/markalara-gore-beden-farki` | ARTICLE | C (#53) | kaynaklar-beden §4 (iki harf sistemi, üçüncü numaralama), §5A; somut marka karşılaştırmaları |
| İnternetten giysi alırken iade ve cayma hakkı (genel bilgi) | `/alisveris-rehberi/iade-ve-cayma-hakki` | SHOPPING_GUIDE | 2 | Mesafeli Sözleşmeler Yönetmeliği, Resmî Gazete 27.11.2014 sayı 29188: https://www.resmigazete.gov.tr/eskiler/2014/11/20141127-6.htm (checkedAt 2026-10-07) – Md. 9: mal tesliminden itibaren 14 gün içinde gerekçesiz cayma; Md. 13: tüketici malı cayma bildiriminden itibaren 10 gün içinde geri gönderir; Md. 15 istisnaları arasında kişiye özel hazırlanan mallar ve koruyucu unsuru açılmış, sağlık/hijyen açısından iadesi uygun olmayan mallar var. Satıcının iade süresi (14 gün) ilgili maddeden ayrıca teyit edilecek. Yönetmelikte sonradan değişiklik yapıldığı görülüyor → yayın öncesi güncel metin mevzuat.gov.tr'den kontrol edilir. Sayfada "hukuki tavsiye değildir" notu zorunlu |
| Kaliteli kıyafet nasıl anlaşılır (dikiş, kumaş, içerik etiketi) | `/rehberler/kaliteli-kiyafet-nasil-anlasilir` | ARTICLE | 2 | İçerik etiketi okuma kaynaklar-beden §7.2; bakım etiketi §7.1; boncuklanma §7.5. Gramaj ve dikiş yoğunluğu için ayrı kaynak araştırması gerekli (henüz yok → o bölümler yazılmaz) |
| Online alırken ürün sayfasında nelere bakılır (manken boyu/bedeni, giysi mi vücut ölçüsü mü, yorumlardaki boy/kilo/beden) | `/beden-rehberi/online-beden-secimi` | ARTICLE | 2 | §3 giriş (VÜCUT vs GİYSİ ayrımı), §5A.4 manken örneği |
| Ter, sürtünme ve giysi ömrü | `/rehberler/ter-surtunme-ve-giysi-omru` | ARTICLE | 2 | kaynaklar-beden §9 (bilimsel kaynak araştırması sürüyor; desteklenmeyen iddia yazılmaz) |

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
| 6 | P1 | `/kadin/beden-rehberi/52-beden-kac-xl` | 52 Beden Kaç XL? Ölçüler ve Markalara Göre Karşılıklar | En yüksek hacimli kadın beden sorgusuna kaynaklı cevap | Kısa cevap (aralık), marka tablosu (göğüs/bel/basen), "erkekte 52 farklıdır" kutusu, kalıp/kumaş ipuçları, ilgili kategoriler, SSS | kaynaklar-beden §2 + §4; en az 4 markada 52 satırı |
| 7 | P1 | `/erkek/beden-rehberi/4xl-kac-beden` | 4XL Kaç Beden? Erkekte 4XL Ölçüleri | Erkek 4XL sorgusuna kaynaklı cevap | Kısa cevap, marka tablosu (göğüs/bel), tişört/gömlek/pantolon farkı, "kadında 4XL" kutusu, SSS | kaynaklar-beden §3 + §4; en az 4 markada 4XL satırı |
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
| 48 | P1 | `/erkek/beden-rehberi/boy-kilo-beden` | Boy ve Kiloya Göre Beden: Neden Tek Başına Yetmez? (Erkek) | "120 kilo kaç beden" niyetine dürüst cevap: kilo değil ölçü ve oran belirler | Kısa cevap, aynı kilo / farklı boy örneği (temsilî, sayısal beden iddiası olmadan), hangi giyside hangi ölçü belirleyici (tişört/gömlek: göğüs + karın çevresi, omuz, kol, beden boyu; pantolon: bel, basen, iç bacak; gömlek: yaka), markaların yayımladığı boy/kilo aralıkları (kaynaklı, yalnız olduğu gibi), ölçü alma linki, SSS | kaynaklar-beden §5 ve §5A |
| 49 | P1 | `/kadin/beden-rehberi/boy-kilo-beden` | Boy ve Kiloya Göre Beden: Neden Tek Başına Yetmez? (Kadın) | Aynı niyet, kadın ölçü noktaları (göğüs, bel, basen; elbisede boy) | Aynı şablon, kadın örnekleri; LCW boy sütunu, Ulla Popken kısa/uzun bedenleri, H&M Petite | kaynaklar-beden §5A |
| 50 | P2 | `/erkek/beden-rehberi/kisa-boylu-buyuk-beden` | Kısa Boylu Büyük Beden Erkekler İçin Beden ve Kalıp Rehberi | Kısa boyda genişlik ihtiyacı (göğüs/bel) uzunluk ihtiyacından fazladır; doğru kalıp ve paça | Untersetzt/kısa bedenler, iç bacak, comfort/relaxed (4 drop) kalıp, tişört boyu, kumaş esnemesi, SSS | kaynaklar-beden §3.1, §5A |
| 51 | P2 | `/erkek/beden-rehberi/uzun-boylu-buyuk-beden` | Uzun Boylu Büyük Beden Erkekler İçin Beden Rehberi | Uzun boyda kol ve beden boyu ihtiyacı; tall/long seriler | Tall/long bedenler (JP1880, M&S, H&M Long), kol boyu ölçümü, tişört/gömlek boyu, SSS | kaynaklar-beden §3.1, §3.2, §3.6, §5A |
| 52 | P2 | `/kadin/beden-rehberi/sutyen-bedeni` | Sütyen Bedeni Nasıl Ölçülür? Bant ve Kup Rehberi | En çok satılan büyük beden kategorisi için ölçü otoritesi | Kısa cevap, göğüs altı + göğüs ölçümü adımları, bant/kup tablosu (marka kaynaklı), TR/EU–UK–US çevirme, sık yapılan hatalar, SSS | kaynaklar-beden §8 |
| 53 | P1 | `/beden-rehberi/markalara-gore-beden-farki` | Beden Neden Markadan Markaya Değişir? | En sık şikâyete kaynaklı cevap; iki harf sistemini açıklar | Kısa cevap, kadın ve erkek karşılaştırma tabloları (aynı numara farklı harf), vücut vs giysi ölçüsü, önlem listesi | kaynaklar-beden §4, §5A |
| 54 | P2 | `/erkek/beden-rehberi/battal-beden` | Battal Beden Nedir? Erkekte Big ve Tall Rehberi | "Battal beden/boy" arama diline cevap | Terimin anlamı (editoryal, resmi tanım yok notu), genişlik ve boy eksenleri, harf karşılıkları, uzun/kısa boy rehberlerine yönlendirme | kaynaklar-beden §4.3, §5A.6–5A.7 |

Not: Liste 54 satır (#48–#51 site sahibinin "beden orana bağlıdır, kiloya değil" ilkesiyle, #52–#54 site sahibinin iç giyim ve şikâyet odaklı geri bildirimiyle eklendi); brief "~40" dediği için P3'teki #43 `/kombinler`, #41 `/stil` gibi ortak hub'lar silo hub'larından sonra yayınlanabilir. Kadın `48-beden` ve marka sayfaları (`/marka/[slug]`) veri doğrulandıkça cornerstone setine eklenir; ilk marka sayfaları için §4'te "Doğrulanan alan" sayısı en yüksek markalar seçilir.

**Silo kuralları (tüm cornerstone'lar):** canonical kendi URL'si; breadcrumb ör. Ana Sayfa → Kadın → Beden Rehberi → 52 Beden. Kadın beden sayfalarında "erkek karşılığı" kutusu yalnız tek cümle + `/erkek/beden-rehberi` linki (içerik karışmaz).

---

## 4. Marka adayları ve doğrulama durumu

Kontrol tarihi: **2026-10-07** (tüm satırlar). Yalnız resmi siteden okunan bilgiler yazıldı; doğrulanamayan alan "doğrulanamadı". Filtrelerden okunan beden aralıkları stok değiştikçe değişebilir: veri girerken `dataConfidence: "medium"` önerilir ve yayın öncesi yeniden kontrol edilir. Ayrıntılı rakip/perakendeci pazar araştırması ayrı dosyada (`docs/pazar-arastirmasi.md`) yürütülüyor; bu bölüm yalnız marka dizini için çekirdek doğrulamadır.

| # | Marka | Resmi URL | Menşei / merkez | Cinsiyet | Odak | Resmi sitede görülen beden aralığı (kaynak) | Ayrı büyük beden hattı | TR'de satış |
|---|---|---|---|---|---|---|---|---|
| 1 | TuvidXXL | https://www.tuvidxxl.com | doğrulanamadı | Kadın | Yalnız büyük beden (elbise, üst/dış giyim, alt giyim, abiye, iç giyim) | Filtre 42–58 (https://www.tuvidxxl.com/elbise); beden tablosu görseli 42–54 | Markanın tamamı | Evet (TL) |
| 2 | Faik Sönmez | https://www.faiksonmez.com | 1950'den beri faaliyette (https://www.faiksonmez.com/kurumsal/hakkimizda); merkez doğrulanamadı | Kadın | Kadın giyim; 38'den başlayıp büyük bedenleri kapsar | Filtre 38–54 ve XL/XXL (https://www.faiksonmez.com/elbise) | Ayrı adlı hat yok | Evet |
| 3 | ŞANS (Şans Tekstil) | https://www.sanstekstil.com | 1997, Merter / İstanbul (https://www.sanstekstil.com/hakkimizda) | Kadın | "Büyük Beden" ana kategorisi | doğrulanamadı | "Büyük Beden" kategorisi (https://www.sanstekstil.com/buyuk-beden-elbise-87) | Evet |
| 4 | RMG Büyük Beden | https://rmgbuyukbeden.com | İstanbul (Güngören fabrika, Merter toptan; ana sayfa) | Kadın | Yalnız büyük beden | Ürün listelerinde 44–58 (ana sayfa) | Markanın tamamı | Evet |
| 5 | STARBATTAL | https://www.starbattal.com | doğrulanamadı; 2022'den beri büyük beden erkek odaklı (https://www.starbattal.com/hakkimizda) | Erkek | Tişört, gömlek, pantolon, eşofman, dış giyim, iç giyim | 2XL–10XL, bazı ürünlerde 54–70 (ana sayfa beden seçici) | Markanın tamamı | Evet |
| 6 | BattalModa | https://battalmoda.com | doğrulanamadı | Erkek | Sweatshirt, kazak, eşofman | "3XL–8XL" (ana sayfa) | Markanın tamamı | Evet |
| 7 | Kiğılı | https://www.kigili.com | Kurtköy, Pendik / İstanbul (https://www.kigili.com/hakkimizda) | Erkek | Takım elbise, gömlek, pantolon, triko, ceket | Sayfa metni XL–7XL; filtre 46–70 ve 8X'e kadar (https://www.kigili.com/buyuk-beden-urunler/) | "Büyük Beden Erkek" koleksiyonu | Evet |
| 8 | LC Waikiki | https://www.lcw.com | doğrulanamadı | Kadın + erkek | Genel perakende | Kadın beden tablosu 32–54 / XXS–7XL (bkz. kaynaklar-beden §2.3); büyük beden koleksiyonları: https://www.lcw.com/koleksiyon/buyuk-beden-urunler-kadin , https://www.lcw.com/koleksiyon/buyuk-beden-giyim-erkek | Kadın ve erkek büyük beden koleksiyonları (kadında "LCW Curve", "Soulife" ürünleri görüldü) | Evet |
| 9 | DeFacto | https://www.defacto.com.tr | doğrulanamadı | Kadın + erkek | Genel perakende | Kadın 2XL–5XL (https://www.defacto.com.tr/kadin-buyuk-beden); erkek 2XL–6XL, ceket/mont 46–52 (https://www.defacto.com.tr/erkek-buyuk-beden) | Kadın ve erkek büyük beden kategorileri | Evet |
| 10 | Koton | https://www.koton.com | doğrulanamadı | Kadın | Genel perakende | Filtre XXL ve 42–48 (https://www.koton.com/buyuk-beden-urunler/); tabloda en büyük 4XL = 48 | "Büyük Beden" kategorisi | Evet |
| 11 | Mango | https://shop.mango.com/tr | Barselona, 1984 (Mango Fashion Group basın odası) | Kadın | Genel moda | TR büyük beden filtresinde XXL ve 1XL–4XL (https://shop.mango.com/tr/tr/c/kadin/ceket/buyuk-beden/531d03b7) | **Violeta ayrı hat olarak yok:** 2 Ağustos 2021'de ana kadın koleksiyonuna katıldı; seçki "54 beden ve 4XL"e kadar (https://mangofashiongroup.com/en/w/mango-culmina-la-integraci%C3%B3n-de-violeta-by-mango-y-ampl%C3%ADa-el-tallaje-de-la-colecci%C3%B3n-general-de-mujer) | Evet |
| 12 | H&M | https://www2.hm.com/tr_tr | doğrulanamadı | Kadın (büyük beden bölümü) | Genel moda | Kadın genel beden rehberi 4XL = EU 60–62'ye kadar (kaynaklar-beden §2.2); H&M+ başlangıç bedeni doğrulanamadı | "Büyük Beden" bölümü (https://www2.hm.com/tr_tr/kadin/urune-gore-satin-al/buyuk-beden.html) | Evet |
| 13 | Marks & Spencer | https://www.marksandspencer.com.tr | doğrulanamadı | Kadın (TR erkek büyük beden sayfası 0 ürün) | Giyim, iç giyim | Kadın 52'ye kadar; filtre 46–52, UK 20–24 (https://www.marksandspencer.com.tr/kadin-buyuk-beden-giyim/) | Kadın büyük beden koleksiyonu | Evet |
| 14 | Ulla Popken | https://www.ullapopken.de | Popken Fashion GmbH, Rastede, Almanya (https://www.ullapopken.de/de/impressum) | Kadın | Yalnız büyük beden | 42–68 (beden rehberi: https://www.ullapopken.at/de/guides/size-guide) | Markanın tamamı | **Doğrulanamadı** – ülke mağazaları listesinde Türkiye yok |
| 15 | JP1880 | https://www.ullapopken.de/de/jp1880 | Popken Fashion Group, Almanya | Erkek | Yalnız büyük beden erkek | Navigasyonda L–8XL, bazı ürünlerde 10XL (aynı sayfa) | Markanın tamamı | **Doğrulanamadı** |
| 16 | ASOS (Curve) | https://www.asos.com | doğrulanamadı | Kadın (Curve) | Genel moda | Curve UK 18–30 = EU 46–58 (https://www.asos.com/discover/size-charts/women/dresses/) | ASOS Curve (https://www.asos.com/women/curve-plus-size/cat/?cid=9577) | **Doğrulanamadı** (TR teslimatı resmi sayfada teyit edilmedi) |

**Dizin kararı:** İlk marka sayfaları (`/marka/[slug]`) için doğrulanmış alanı en fazla olanlar: Kiğılı, LC Waikiki, DeFacto, Mango, TuvidXXL, Marks & Spencer, H&M. Ulla Popken / JP1880 / ASOS "Türkiye'de erişilebilirlik: doğrulanıyor" notuyla yalnız beden çevirme bağlamında anılır; TR erişimi doğrulanmadan "Türkiye'den alınır" denmez.

**Elenen adaylar ve nedeni:**
- *Fermene*: fermene.com.tr bir gıda markası; giyim markası bulunamadı.
- *Mango Violeta*: 2021'den beri ayrı hat değil (Mango satırına bakın).
- *Altınyıldız Classics*: büyük beden kategori adresleri 404; yalnız oversize ürünler görüldü.
- *Bigdart*: resmi site tesettür ağırlıklı kadın giyim; büyük beden odağı yok.
- *Kitex*: kitex.com.tr bir aydınlatma/elektronik firması.
- *Mcl, Femina, Party Büyük Beden*: yalnız pazar yeri mağazaları görüldü; resmi site bulunamadı.
- *Penti*: yalnız büyük beden sütyen (bant 70–100, kupa A–F); iç giyim rehberi açılırsa eklenebilir.
- *Triumph*: TR satışı ve büyük beden hattı doğrulanamadı.
- *Koton Curve / Trendyol Curve*: "Curve" adı Koton resmi sitesinde görülmedi; Trendyol otomatik erişimi engelledi.
- *Kalinda, Ramsey, Damat Tween, Sarar, Pierre Cardin TR*: büyük beden hatları henüz kontrol edilmedi (pazar araştırması dosyasına devredildi).

---

## 5. Açık işler

1. Google TR konumlu SERP kontrolü (Search Console verisi gelince) – §1 tablosunu güncelle.
2. Kadın 48/50/54/56 landing şartı (en az 4 kaynaklı tek numaralı marka tablosu): kaynaklar-beden §2 ile karşılanıyor (48, 50, 52, 54: Ulla Popken, LAURASØN, LCW, M&S, ASOS, TuvidXXL, DOB; 56: Ulla Popken, LAURASØN, ASOS, DOB). 58 ve üstü yalnız 2–3 kaynak → şimdilik landing yok.
3. Marka satırlarında `doğrulanamadı` alanları için kurumsal sayfa / KAP / ticaret sicili kontrolü.
4. Erkek harf↔numara sonucu `kaynaklar-beden.md` §4.3'te (iki sistem, yüksek güven); #3, #7, #23, #26 için veri hazır. 6XL–8XL ve kadın 8XL için ek kaynak gerekli (§10).
5. İç giyim kümesi için Penti cm tablosu ve M&S TR balenli sütyen tablosu eksik (kaynaklar-beden §8).
6. Mesafeli Sözleşmeler Yönetmeliği güncel metni yayın öncesi kontrol (§2.7-f).

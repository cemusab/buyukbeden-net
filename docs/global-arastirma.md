# Global Araştırma – Dünyanın Büyük Beden / Big & Tall Siteleri

> Kontrol tarihi: **2026-10-07** (tüm satırlar). Her bilgi, yanında verilen **resmi sayfadan** okundu: tarayıcıda açılıp tablo DOM'dan okundu ya da sayfa metni okundu. Üçüncü taraf "beden tablosu" siteleri ve arama motoru özetleri **kaynak olarak kullanılmadı**; yalnız bağlam için kullanıldığında açıkça yazıldı. Bot korumasına (CAPTCHA) takılan sayfalar aşılmadı, **"doğrulanamadı"** diye işaretlendi.
> Metinler özgün özettir; rakiplerin cümleleri, görselleri ve tasarımı kopyalanmadı. Sayılar olgudur, aynen aktarıldı.
> **İnç → cm dönüşümleri bize aittir** (× 2,54, tam sayıya yuvarlandı). Parantez içindeki cm değerleri "çevrildi" sayılır; içeriğe aktarırken kaynak `type: brand-official`, not alanına "inçten çevrildi" yazılır.
> Tüm ölçüler aksi yazmadıkça **vücut ölçüsüdür** (giysi ölçüsü değil). Türkiye pazarı için bkz. `docs/pazar-arastirmasi.md`; çekirdek beden verisi için `docs/kaynaklar-beden.md`.

## İçindekiler
0. Yönetici özeti
1. Site künyeleri (20 site)
2. Erkek: Big & Tall tabloları ve "big / tall" mantığı
3. Proporsiyon: kısa-dolgun ile uzun-dolgun gövdeyi perakendeciler nasıl ayırıyor?
4. Kadın: plus size tabloları
5. Çapraz karşılaştırma: aynı vücut, farklı etiket
6. Beden rehberlerinin yapısı: ölçü alanları, ölçme talimatları, "arada kaldım" kuralları
7. Beden bulucular / fit finder araçları
8. İçerik, editoryal formatlar, navigasyon ve mobil UX
9. Terminoloji: TR ↔ EN / DE sözlüğü (sözlük sayfası taslağı: `/rehberler/buyuk-beden-terimleri`)
10. buyukbeden.net için çıkarımlar
11. Doğrulanamayanlar, veri hataları ve açık işler
12. Kaynak listesi

---

## 0. Yönetici özeti

- **20 site** incelendi; **13 sitenin beden tablosu** resmi sayfasından doğrulandı (DXL, KingSize, JP1880, Ulla Popken, Duke, Jacamo, ASOS, Bonprix, Simply Be, Lane Bryant, Torrid, Eloquii, Target/A New Day). Universal Standard'ın yalnız beden **sistemi** doğrulandı (ölçüler sayfada çıkmadı). Yours Clothing, SHEIN Curve, JD Williams (tablo), Old Navy (tablo) ve H&M+ doğrulanamadı; Navabi bakım sayfasında (aktif değil).
- **Doğrulanan hiçbir global tabloda kilo yok.** Hepsi göğüs/bel/basen/boyun/kol/iç bacak gibi çevre ve uzunluk ölçülerine dayanıyor; boy yalnız "uzun/kısa seri" seçimi için kullanılıyor. Türkiye'de ise kilo tablosu yaygın (bkz. `pazar-arastirmasi.md` §2.2). Bu, site kuralımızı (kiloya göre beden yok) doğrudan destekliyor.
- **"XL" evrensel değil.** Göğsü ~117–122 cm olan bir erkek; DXL'de 1XL, KingSize'da XL, JP1880 ve Bonprix'te XXL, Duke'ta 1XL, ASOS'ta XXXL'e denk geliyor (§5). Kadında "XL"; Simply Be'de UK 16, Bonprix'te 48/50, Ulla Popken'de 54/56, Universal Standard'da US 26/28 demek.
- **Proporsiyon problemi Almanya'da sistemleşmiş.** JP1880'in **untersetzt** (kısa-dolgun) pantolon serisi aynı göğüs bedeninde ~4 cm daha geniş bel ve ~4 cm daha kısa iç bacak veriyor; Ulla Popken kadında boyu 167 cm altı / 167–174 / 174 üstü diye üç seriye ayırıyor (21–34 / 42–68 / 84–136). Site sahibinin "1,50 m/150 kg ile 1,80 m/150 kg aynı bedeni giymez" gözlemi, yayımlanmış bir beden mantığıyla örtüşüyor.
- **Big ile Tall eşiği markadan markaya değişiyor:** DXL normal seriyi 6 ft (≈183 cm) ve altına, KingSize "Big"i 6 ft 1 in (≈185 cm) ve altına, JP1880 ve Duke "Tall"ı 190 cm ve üstüne kuruyor.
- **Uluslararası çevirme tabloları birbirini tutmuyor:** ASOS, Simply Be ve Eloquii "US 14 = UK 18 = EU 46" derken Torrid "US 14 = UK 16 = EU 42" diyor (iki beden fark). Çevirme tablosunu tek kaynağa dayandırmamak gerekiyor.
- İçerikte en olgun örnekler: KingSize'ın ürün gruplarına ayrılmış, etiketli ve okuma süreli "Style & Fit Guide" merkezi; Simply Be'nin seri rehberleri (jean ve sütyen serileri, "ne giyilir" etkinlik yazıları); Torrid ve Lane Bryant'ın jean kalıp rehberleri (esneme skalası, curvy ve straight kalıp tablosu).

---

## 1. Site künyeleri

Durum sütunu: **D** = resmi beden tablosu doğrulandı; **K** = yalnız künye, sistem ya da navigasyon doğrulandı; **X** = doğrulanamadı.

| # | Site | Ülke | Cinsiyet | Resmi sitede yazan beden aralığı (sayfa) | Beden sistemi | Boy segmenti | Durum |
|---|---|---|---|---|---|---|---|
| 1 | **DXL / Destination XL** – https://www.dxl.com | ABD | Erkek | Bel 38–64, Big XL–7XL, Tall XLT–6XLT (beden tablosu başlığı; tablo 8XL / 8XLT'ye kadar satır içeriyor) – ürün sayfası "Size Chart" penceresi, örn. https://www.dxl.com/p/synrgy-performance-solid-dress-shirt-p5397 | Harf (XL–8XL) + boyun/kol (gömlek) + bel/iç bacak (inç) | Regular: 6 ft ve altı; Tall: üstlerde 6 ft ½ in ve üstü (pantolon metninde 6 ft ve üstü) | D |
| 2 | **KingSize** – https://www.kingsize.com (kingsizedirect.com DNS'te çözülmüyor) | ABD (FullBeauty Brands) | Erkek | "L–10XL" (site başlığı); tablo: Tall L–7XL, Big XL–10XL – https://www.kingsize.com/on/demandware.store/Sites-oss-Site/default/SizeGuide-Show?cid=ks-sizeguide-topsbottoms | Harf + boyun/göğüs/bel (inç; cm tablosu da var ama hatalı, §11) | Big: 6 ft 1 in ve altı; Tall: 6 ft 2 in ve üstü | D |
| 3 | **Torrid** – https://www.torrid.com | ABD | Kadın | "Sizes 10 to 30" (site başlığı); kendi sistemi 00–6 – https://www.torrid.com/on/demandware.store/Sites-torrid-Site/default/Page-Include?cid=td-size-guide-apparel | Torrid 00–6 ↔ harf (M/L, L, 1X–6X) ↔ US 10–30 | Jean boyları: Regular, Short, Extra Short, Tall, Extra Tall (ürün sayfası, örn. https://www.torrid.com/product/jegging-skinny-high-rise-jean/12638273.html) | D |
| 4 | **Lane Bryant** – https://www.lanebryant.com | ABD | Kadın | 10–40 (tablo) – https://www.lanebryant.com/help/size-chart | US numara + çift numara/harf (10/12 = M/L … 38/40 = 7X) | Petite (≤5 ft 3 in, oransal kesim), Short (≤5 ft 4 in, yalnız boy), Regular, Long, Extra Long | D |
| 5 | **Eloquii** – https://www.eloquii.com | ABD (FullBeauty Brands) | Kadın | "Sizes 14+" (site başlığı); tablo 10–32 (10–12 yalnız bir alt markada) – https://www.eloquii.com/c/eloquii-size-chart.html | US numara + çift numara (14/16 …) | Navigasyonda Petite Bottoms, Tall Bottoms | D |
| 6 | **Ulla Popken** – https://www.ullapopken.de | Almanya | Kadın (+ JP1880 erkek) | 42–68 (normal), 21–34 (kısa), 84–136 (uzun) – https://www.ullapopken.de/de/guides/size-guide | DE konfeksiyon + kısa/uzun beden + harf eşlemesi | Kadında 3 boy serisi (<167 / 167–174 / >174 cm) | D |
| 7 | **JP1880** (Ulla Popken grubu) – https://www.ullapopken.de/de/jp1880 | Almanya | Erkek | Üst L–8XL (kısmen 10XL), Tall LT–5XT; pantolon normal 52–72(74), untersetzt 26–36, uzun 102–134 – https://www.ullapopken.de/de/groessentabellejp | Harf + çift DE bedeni + untersetzt/uzun pantolon + boyun cm | Tall: 190 cm ve üstü; untersetzt (kısa-dolgun) ve uzun pantolon serisi | D |
| 8 | **Yours Clothing** – https://www.yoursclothing.co.uk | İngiltere | Kadın (+ erkek alt marka) | Doğrulanamadı | – | – | X (Cloudflare CAPTCHA, 403) |
| 9 | **Simply Be** – https://www.simplybe.co.uk | İngiltere (N Brown) | Kadın | "Sizes 10–32" (site başlığı); tablo 8–32 – https://support.simplybe.co.uk/hc/en-gb/articles/360019571299-Women-s-size-chart | UK numara + harf (XL = 16 … 9XL = 32) | Elbise boyu filtresi; ayakkabıda 5 genişlik, çizmede 5 baldır genişliği | D |
| 10 | **JD Williams** – https://www.jdwilliams.co.uk | İngiltere (N Brown) | Kadın ağırlıklı + erkek + ev | Tablo yalnız ürün sayfasındaki "Size Guide" düğmesinde (destek sayfası böyle söylüyor) | – | Ayakkabıda Wide / Extra Wide filtresi | K |
| 11 | **ASOS (Curve / Plus)** – https://www.asos.com | İngiltere | Kadın + erkek | Curve UK 18–30 – https://www.asos.com/discover/size-charts/women/dresses/ ; erkek tişört XXXS–XXXL – https://www.asos.com/discover/size-charts/men/tshirts-polo-shirts/ | UK numara (kadın), harf (erkek) | Petite (≤5 ft 3 in), Tall, Curve, Maternity | D |
| 12 | **Jacamo** – https://www.jacamo.co.uk | İngiltere (N Brown) | Erkek | "S to 6XL" (site başlığı); kendi markasının tablosu S–7XL – https://support.jacamo.co.uk/hc/en-gb/articles/9545219384220-Men-s-size-chart | Harf + bel inç + iç bacak (XS–XL) | "Long and Tall" kategorisi; tişörtte Regular / Long / Extra Long boy | D |
| 13 | **Duke Clothing / D555** – https://www.dukeclothing.com | İngiltere | Erkek | S–10XL, Tall XL/T–XXXL/T, bel 28–70 – https://www.dukeclothing.com/size-fit-guide | Harf + bel inç + iç bacak (Extra Short–Tall) + takım elbise 48–64 Short/Regular/Long | Navigasyonda Regular / King / Super King / Tall (190 cm+) | D (site **toptan** satış odaklı) |
| 14 | **Bonprix** – https://www.bonprix.de | Almanya (Otto grubu) | Kadın + erkek | Kadın tablosu 32–58; footer "36–54 stil çeşitliliği" – https://www.bonprix.de/service/beratung/groessentabellen/ | DE konfeksiyon + çift beden + harf | Kadında Kurz/Petite (155–163 cm), Regulär (164–172), Lang (173–181); erkek pantolonda N / Schlank / Untersetzt sekmeleri | D |
| 15 | **Navabi** – https://www.navabi.de | Almanya | Kadın | Site bakım sayfasına yönleniyor ("yakında yenilenmiş olarak" mesajı) | – | – | K (aktif değil) |
| 16 | **Universal Standard** – https://www.universalstandard.com | ABD | Kadın | "00–40" (site başlığı) – https://www.universalstandard.com/pages/find-my-size | Kendi harf sistemi (US 18/20 = M) | – | K (ölçü tablosu sayfada çıkmadı) |
| 17 | **SHEIN Curve** – https://us.shein.com | Çin/küresel | Kadın (+ erkek) | Doğrulanamadı | – | – | X (risk/CAPTCHA sayfası) |
| 18 | **Old Navy** – https://oldnavy.gap.com | ABD | Kadın + erkek | Tablo bulunamadı (eski bilgi sayfası hata verdi) | – | Kadın menüsünde Petite, Tall ve jean kalıbı olarak "Curvy"; ayrı Plus ya da Big & Tall bağlantısı görülmedi | K |
| 19 | **Target – A New Day** – https://www.target.com | ABD | Kadın | XXS (00) – 4X (30) – https://digitalcontent.target.com/itemcontent/sizecharts/htmlfragments/women-clothing/a-new-day/womens.html | Harf + US numara | – | D (marka tablosu Target'ın içerik sunucusunda) |
| 20 | **H&M (H&M+)** – https://www2.hm.com | İsveç | Kadın + erkek | Beden rehberi yalnız ürün sayfasında (https://www2.hm.com/en_gb/customer-service/sizeguide/sizing-faq.html). GB ve US kadın menüsünde ayrı "plus" kategorisi görülmedi | – | – | X |

**Kadın/erkek ayrımı.** Torrid, Lane Bryant, Eloquii, Universal Standard ve Simply Be yalnız kadın; DXL, KingSize, Jacamo ve Duke yalnız erkek. Ulla Popken aynı alan adında iki marka kullanıyor (kadın = Ulla Popken, erkek = JP1880; üst menüde Damen/Herren geçişi var). Bonprix ve ASOS beden tablolarını Kadın/Erkek sekmelerine ayırıyor. Buradan çıkan sonuç: büyük oyuncular kadın ve erkek büyük bedeni **ayrı marka ya da ayrı silo** olarak yönetiyor. Bu, bizim `/kadin` ve `/erkek` silo kuralımızla örtüşüyor.

---

## 2. Erkek: Big & Tall tabloları

### 2.1 DXL – üst giyim (vücut ölçüsü, inç → cm)
Kaynak: https://www.dxl.com/p/synrgy-performance-solid-dress-shirt-p5397 → "Size Chart" penceresi → Tops & Outerwear (2026-10-07)

| Beden (Regular / Tall) | Göğüs inç (cm) | Boyun inç (cm) | Kol, Regular inç (cm) | Kol, Tall inç (cm) |
|---|---|---|---|---|
| XL / XLT | 42–44 (107–112) | 16–16½ (41–42) | 34–35 (86–89) | 36–37 (91–94) |
| 1XL / 1XLT | 46–48 (117–122) | 17–17½ (43–44) | 34½–35½ (88–90) | 36½–37½ (93–95) |
| 2XL / 2XLT | 50–52 (127–132) | 18–18½ (46–47) | 35–36 (89–91) | 37–38 (94–97) |
| 3XL / 3XLT | 54–56 (137–142) | 19–19½ (48–50) | 35½–36½ (90–93) | 37½–38½ (95–98) |
| 4XL / 4XLT | 58–60 (147–152) | 20–20½ (51–52) | 36–37 (91–94) | 38–39 (97–99) |
| 5XL / 5XLT | 62–64 (157–163) | 21–22 (53–56) | 36½–37½ (93–95) | 38½–39½ (98–100) |
| 6XL / 6XLT | 66–68 (168–173) | 23–24 (58–61) | 37–38 (94–97) | 39–40 (99–102) |
| 7XL / 7XLT | 70–72 (178–183) | 25–26 (64–66) | 37½–38½ (95–98) | 39½–40½ (100–103) |
| 8XL / 8XLT | 74–76 (188–193) | 27–28 (69–71) | 38–39 (97–99) | 40–41 (102–104) |

- Kol ölçüsü ense ortasından alınıyor. **Tall, göğüs ve boyunda aynı; yalnız kol ~2 in (≈5 cm) uzun.** Yani DXL'de "tall" genişlik değil boy ekseni.
- Not: DXL eski XL/XLT'nin adını **1XL/1XLT** yaptığını, yeni XL/XLT'nin biraz daha dar ve oturan bir kalıp olduğunu yazıyor. Aynı marka içinde bile etiket adları zamanla değişebiliyor.
- Pantolon (bel, vücut): XL 38–40 (97–102), 1XL 42–44 (107–112), 2XL 46–48 (117–122), 3XL 50–52 (127–132), 4XL 54–56 (137–142), 5XL 58–60 (147–152), 6XL 62–64 (157–163), 7XL 66–68 (168–173), 8XL 70–72 (178–183). Tall'da bel aynı; iç bacak ve **ağ (rise) daha uzun** (aynı pencere, "Pants, Shorts & Jeans").
- Ölçme notları (özet): boyun çıplak tenden ölçülüp yarım inç eklenir; ceket için göğüs gömlek üstünden ölçülür; kol dirsek bükülüyken ense ortasından bileğe ölçülür; bel pantolonun oturduğu yerden ölçülür; iç bacak ağ dikişinden paçaya ölçülür. İki kol boyu arasında kalınca uzun olanı öneriyor.

### 2.2 KingSize – üst/alt giyim (vücut ölçüsü, inç → cm)
Kaynak: https://www.kingsize.com/on/demandware.store/Sites-oss-Site/default/SizeGuide-Show?cid=ks-sizeguide-topsbottoms (Size & Fit yardım sayfasından: https://www.kingsize.com/help-page?cid=ks-custservice-sizechart) (2026-10-07)

| Big beden | Tall beden | Göğüs inç (cm) | Bel inç (cm) | Boyun inç (cm) |
|---|---|---|---|---|
| – | L | 42–44 (107–112) | 38–40 (97–102) | 16–16½ (41–42) |
| XL | XL | 46–48 (117–122) | 42–44 (107–112) | 17–17½ (43–44) |
| 2XL | 2XL | 50–52 (127–132) | 46–48 (117–122) | 18–18½ (46–47) |
| 3XL | 3XL | 54–56 (137–142) | 50–52 (127–132) | 19–19½ (48–50) |
| 4XL | 4XL | 58–60 (147–152) | 54–56 (137–142) | 20–20½ (51–52) |
| 5XL | 5XL | 62–64 (157–163) | 58–60 (147–152) | 21–21½ (53–55) |
| 6XL | 6XL | 66–68 (168–173) | 62–64 (157–163) | 22–22½ (56–57) |
| 7XL | 7XL | 70–72 (178–183) | 66–68 (168–173) | 23–23½ (58–60) |
| 8XL | – | 74–76 (188–193) | 70–72 (178–183) | 24–24½ (61–62) |
| 9XL | – | 78–80 (198–203) | 74–76 (188–193) | 25–25½ (64–65) |
| 10XL | – | 82–84 (208–213) | 78–80 (198–203) | 26–26½ (66–67) |

- Kural: **6 ft 2 in (≈188 cm) ve üstü Tall, 6 ft 1 in (≈185 cm) ve altı Big.** Tall serisi L'den başlayıp 7XL'de bitiyor; Big serisi XL'den 10XL'e gidiyor. Çok uzun ve çok geniş gövde (8XL+ tall) bu markada tanımlı değil.
- **KingSize'ın XL'i = DXL'in 1XL'i** (göğüs 46–48 in). KingSize L = DXL XL. Etiket kayması daha ilk büyük bedende başlıyor.
- 6XL'den sonra boyun ölçüsü DXL'den ayrılıyor (KingSize 6XL boyun 22 in, DXL 6XL 23–24 in).

### 2.3 JP1880 (Ulla Popken grubu) – cm, vücut ölçüsü
Kaynak: https://www.ullapopken.de/de/groessentabellejp (2026-10-07). (`kaynaklar-beden.md` §3.1 aynı markayı https://www.jp1880.de/de/guides/groessenberater adresinden işliyor; değerler örtüşüyor.)

| Uluslararası | Çift DE bedeni | Göğüs (cm) | Pantolon beli (cm) | Gömlek boyun (cm) |
|---|---|---|---|---|
| L | 52/54 | 102–109 | 90–97 | 41/42 |
| XL | 56/58 | 110–117 | 98–105 | 43/44 |
| XXL | 60/62 | 118–125 | 106–115 | 45/46 |
| 3XL | 64/66 | 126–133 | 116–125 | 47/48 |
| 4XL | 68/70 | 134–141 | 126–135 | 49/50 |
| 5XL | 72/74 | 142–149 | 136–145 | 51/52 |
| 6XL | 76/78 | 150–157 | 146–155 | 53/54 |
| 7XL | 80/82 | 158–165 | 156–165 | 55/56 |
| 8XL | 84/86 | 166–173 | 166–175 | 57/58 |
| 9XL | 88/90 | 174–181 | 176–185 (sayfada "176–175" yazıyor, yazım hatası) | 59/60 |
| 10XL | 92/94 | 182–189 | 186–195 | 61/62 |

- **Tall (LT–5XT)** 190 cm ve üstü boy için. Göğüs aynı; gömlek ve sweatshirtte sırt ~2 cm, kol ~4 cm uzun. Tişört ve poloda sırt ~4 cm, ceket ve montta sırt ~4 cm ve kol ~3 cm uzun. Tall pantolonda iç bacak +4 cm.
- **Bauchfit (karın payı) kesimi:** üstlerde ön beden arkadan daha uzun kesiliyor, etek ucu çoğunlukla lastikli. Pantolonda ön ağ (ön bel yüksekliği) daha düşük. Göbek bölgesi için **ayrı bir kalıp çözümü** olarak tanımlanıyor (bedeni büyütmek yerine).
- Gömlek kalıpları: Comfort Fit (daha bol ve uzun, sırtta hareket pilisi) ve Modern Fit (biraz daha dar, yuvarlak etek, dışarıda giyilebilir). Yaka tipleri: Kent, button-down, Haifisch (geniş açılı), dik yaka, Cuba yaka.
- Ceket ve takım: normal 52–74, untersetzt 26–36, uzun 102–134 (göğüs 52/26/102 = 102–105 cm … 68/34/134 = 134–137 cm). Uzun serilerde kol ve sırt ~2 cm uzun.
- Diğer: kemer, toka ile orta delik arası ölçülür (bel 91–97 cm → kemer 95); kravat normal 147 cm, ekstra uzun 160 cm.
- Ölçme (özet): göğüs, kollar serbestken göğüs ve kürek kemiklerinin en geniş yerinden ölçülür. **Bel göbek deliği hizasından** ölçülür (kadın tablolarındaki "doğal bel"den farklı). Pantolon beli bel bandı hizasından, iç bacak çıplak ayakla ölçülür. **İki beden arasında kalınca büyük olanı** öneriyor.

### 2.4 Duke Clothing / D555 – cm, "to fit" (vücut)
Kaynak: https://www.dukeclothing.com/size-fit-guide (2026-10-07)

| Beden | Göğüs (gömlek, tişört, polo, sweat, ceket) cm | Triko cm | Lastikli bel cm |
|---|---|---|---|
| XL | 107–111 | 107–111 | 97–99 |
| XXL | 112–117 | 112–117 | 102–104 |
| 1XL | 118–125 | 115–120 | 104–107 |
| 2XL | 126–132 | 120–127 | 109–114 |
| 3XL | 133–140 | 128–135 | 117–122 |
| 4XL | 141–147 | 136–143 | 124–130 |
| 5XL | 148–155 | 144–152 | 132–137 |
| 6XL | 156–163 | 153–160 | 140–145 |
| 7XL | 164–170 | – | 147–152 |
| 8XL | 171–178 | – | 155–160 |
| 9XL | 179–186 | – | 163–168 |
| 10XL | 187–194 | – | 170–175 |
| XL/T · XXL/T · XXXL/T | 113–119 · 120–126 · 127–134 | – | – |

- **Dikkat: Duke'ta "XXL" (normal seri, 112–117) ile "2XL" (king seri, 126–132) farklı bedenler.** Türkçede "XXL" ve "2XL" çoğu zaman aynı anlamda kullanılıyor; bu ayrım içerikte açıkça anlatılmalı.
- Pantolon numarası bel inci (28 = 71 cm … 70 = 178 cm). İç bacak: Extra Short 27 in (68 cm), Short 29–30 (74–76), Regular 31–32 (79–81), Long 33–34 (84–87), Tall 38 (97).
- Takım ceket 48–64; her beden Short / Regular / Long. Göğüs aynı, sırt boyu (Short 79–83, Regular 82–86, Long 85–89 cm) ve kol (63–65 / 66–68 / 69–71 cm) değişiyor.
- Klasik gömlekte **vücut göğsü + yaka + sırt boyu + giysinin koltuk altı eni** birlikte veriliyor (ör. 4XL: göğüs 142–147, yaka 53, sırt 90, koltuk altı eni 78 cm). Vücut ve giysi ölçüsünü yan yana gösteren nadir örneklerden biri.
- Navigasyon (ana sayfa, WebFetch ile okundu): Regular Sizes, King Sizes, Super King Sizes, Tall Sizes (190 cm+). Super King'in beden bandı sayfada tanımlanmamış.

### 2.5 Jacamo – kendi markası (Jacamo & Snowdonia)
Kaynak: https://support.jacamo.co.uk/hc/en-gb/articles/9545219384220-Men-s-size-chart (2026-10-07). Sayfa her marka için ayrı tablo veriyor ve markalar arasında fark olabileceğini belirtiyor.

| Beden | Göğüs cm | Bel (çift beden alt giyim) cm | Tişört boyu Regular / Long / Extra Long cm |
|---|---|---|---|
| L | 107–112 | 91–97 | 74,5 / 78,5 / 82,5 |
| XL | 114–119 | 99–104 | 76 / 80 / 84 |
| 1XL | 122–127 | 107–112 | 77,5 / 81,5 / 85,5 |
| 2XL | 129–134 | 114–119 | 79 / 83 / 87 |
| 3XL | 137–142 | 122–127 | 80,5 / 84,5 / 88,5 |
| 4XL | 145–150 | 129–134 | 82 / 86 / 90 |
| 5XL | 152–157 | 137–142 | 83,5 / 87,5 / 91,5 |
| 6XL | 160–165 | 145–150 | 85 / 89 / 93 |
| 7XL | 167–172 | 152–157 | 85,6 / 90,5 / 94,5 |

- İç bacak: XS (extra short) 69 cm, S (short) 74, R (regular) 79, L (long) 84, XL (extra long) 89. **Bu tabloda "XL" bir uzunluk etiketi, beden değil.** Aynı harf iki farklı anlama geliyor.
- Aynı sayfadaki Ben Sherman tablosunda XXL = 48–50 in göğüs; bu, Jacamo'nun 1XL'i. Mağaza içinde marka değişince etiket de kayıyor.
- Ana sayfa filtre etiketlerinde (ör. "2XL 52/54in") yardım tablosundan (2XL 51–53 in) farklı aralık yazıyor; bkz. §11.

### 2.6 Bonprix – erkek (cm)
Kaynak: https://www.bonprix.de/service/beratung/groessentabellen/ → Herren (2026-10-07)
- Üst: tek beden 44–78, göğüs 4 cm adımlarla (52 = 102–105 … 78 = 154–157). Çift beden ↔ harf: 52/54 = L (102–109), 56/58 = XL (110–117), 60/62 = XXL (118–125), 64/66 = 3XL (126–133), 68/70 = 4XL (134–141), 72/74 = 5XL (142–149), 76/78 = 6XL (150–157). Bu dizi JP1880 ile birebir aynı.
- Pantolon sekmeleri: **Normal (N), Schlank (ince/uzun), Untersetzt (kısa-dolgun)**. Normal: 52 = bel 90–94 cm (jean 36/32) … 64 = 120–124 (48/32) … 78 = 155–159. Untersetzt ve Schlank sekmelerinin ayrı değerleri bu oturumda ayrı okunamadı (§11).

### 2.7 Referans: moda zinciri ASOS (erkek)
Kaynak: https://www.asos.com/discover/size-charts/men/tshirts-polo-shirts/ (2026-10-07)
- Göğüs: S 91–96, M 96–101, L 101–106, XL 106–111, **XXL 111–116, XXXL 116–121 cm**. Tablo XXXL'de bitiyor.
- **ASOS'un XXL'i, büyük beden mağazalarının L/XL'ine denk.** "Moda markası XXL'i" ile "big & tall 2XL" farklı şeyler.

---

## 3. Proporsiyon: kısa-dolgun ile uzun-dolgun gövde

Site sahibinin gözlemi: aynı kilodaki iki erkekten 1,50 m olan 5XL'e, 1,80 m olan 3XL–4XL'e çıkabilir. **Bu sayılar örnek gözlemdir, kaynakla doğrulanmadı** (`kaynaklar-beden.md` §ilke: örnek kişilere kesin beden yazılmaz). Aşağıdakiler, büyük perakendecilerin aynı problemi **yayımlanmış beden sistemleriyle** nasıl çözdüğünü gösteriyor:

| Çözüm | Kim | Nasıl çalışıyor | Kaynak |
|---|---|---|---|
| **Boy eşiğiyle iki seri (Big / Tall)** | DXL, KingSize, JP1880, Duke, Jacamo | Genişlik (göğüs/bel) aynı, kol/sırt/iç bacak uzun. Eşik: DXL 6 ft (≈183 cm), KingSize 6 ft 2 in (≈188 cm), JP1880 ve Duke 190 cm | §2.1–2.5 |
| **Untersetzt (kısa-dolgun) seri** | JP1880, Bonprix | Aynı göğüs bedeninde **bel ~4 cm daha geniş, iç bacak ~4 cm daha kısa.** Örn. JP1880 untersetzt 30 (= normal 60): bel 110–114, iç bacak 84; normal 60: bel 106–110, iç bacak 88 | https://www.ullapopken.de/de/groessentabellejp |
| **Uzun seri (Lang)** | JP1880 | Bel aynı, iç bacak +4 cm: 118 (= normal 60) bel 106–110, iç bacak 92 | aynı |
| **Karın payı kalıbı (Bauchfit)** | JP1880 | Bedeni büyütmeden önü uzatılmış üst; ön ağı düşük pantolon | aynı |
| **Kadında üç boy serisi** | Ulla Popken | Aynı çevre ölçüsüne üç etiket: <167 cm → 21–34, 167–174 cm → 42–68, >174 cm → 84–136 (örn. göğüs 123–128 → 26 / 52 / 104) | https://www.ullapopken.de/de/guides/size-guide |
| **Petite ≠ Short** | Lane Bryant | Petite (≤5 ft 3 in ≈ 160 cm): yalnız boy değil ağ, basen, diz, baldır, üst gövde ve kol da oransal küçültülüyor. Short (≤5 ft 4 in ≈ 163 cm): **yalnız boy kısaltılıyor**, kalıp aynı | https://www.lanebryant.com/help/size-chart |
| **Kısa / normal / uzun boy aralığı** | Bonprix (kadın) | Kurz/Petite 155–163 cm (iç bacak ~75), Regulär 164–172 (~81), Lang 173–181 (~88). Petite'de yaka derinliği, cep ve bel konumu, yırtmaç ve kol da ayarlanıyor | https://www.bonprix.de/service/beratung/groessentabellen/ |
| **3D tarama** | DXL FitMAP | Mağazada ya da uygulamada tarama, 243 ölçü, markaya göre beden önerisi, profil kaydı | https://www.dxl.com/static/fitmap |

**Sonuç (içerik için):** "Kilo → beden" yerine **"çevre ölçüsü → beden, boy → seri (kısa / normal / uzun), gövde şekli → kalıp (karın payı, curvy)"** üç adımlı mantık kurulmalı. Kısa boylu ve dolgun gövdeli okura iki doğru mesaj verilebilir: (1) çevre ölçüsü bedeni belirler, (2) kol ve paça boyu ayrıca kısaltılmalı ya da kısa seri aranmalı. Avrupa'daki karşılığı "untersetzt" serisidir. Uzun ve dolgun okura ise genişlik aynı kalırken tall serisi önerilir.

---

## 4. Kadın: plus size tabloları

### 4.1 Ulla Popken (cm, vücut; üst ve alt giyim aynı tablo)
Kaynak: https://www.ullapopken.de/de/guides/size-guide (2026-10-07). `kaynaklar-beden.md`de de var; burada boy serisi vurgusu için tekrarlandı.

| Göğüs | Bel | Basen | Normal (167–174 cm) | Kısa (<167 cm) | Uzun (>174 cm) |
|---|---|---|---|---|---|
| 99–102 | 82–85 | 105–108 | 42 | 21 | 84 |
| 103–106 | 86–89 | 109–112 | 44 | 22 | 88 |
| 107–110 | 90–93 | 113–116 | 46 | 23 | 92 |
| 111–116 | 94–99 | 117–122 | 48 | 24 | 96 |
| 117–122 | 100–105 | 123–128 | 50 | 25 | 100 |
| 123–128 | 106–111 | 129–134 | 52 | 26 | 104 |
| 129–134 | 112–118 | 135–140 | 54 | 27 | 108 |
| 135–140 | 119–125 | 141–146 | 56 | 28 | 112 |
| 141–146 | 126–132 | 147–152 | 58 | 29 | 116 |
| 147–152 | 133–139 | 153–158 | 60 | 30 | 120 |
| 153–158 | 140–146 | 159–164 | 62 | 31 | 124 |
| 159–164 | 147–153 | 165–170 | 64 | 32 | 128 |
| 165–170 | 154–160 | 171–176 | 66 | 33 | 132 |
| 171–176 | 161–167 | 177–182 | 68 | 34 | 136 |

- Harf eşlemesi (aynı sayfa): S = 42/44, M = 46/48, L = 50/52, XL = 54/56, XXL = 58/60, 3XL = 62/64.
- Aynı sayfada sütyen (alt göğüs 83–142 → 85–140, B–G kup), korse, çorap, ayakkabı genişliği (G/H/K) ve çizme baldır genişliği (XL/XXL/vario) tabloları da var. Pantolon modelleri kadın isimleriyle adlandırılmış (Mandy, Marie, Mary, Sammy, Sarah); her ismin kalıbı ayrı tanıtılıyor.

### 4.2 Simply Be (cm, tek değer)
Kaynak: https://support.simplybe.co.uk/hc/en-gb/articles/360019571299-Women-s-size-chart (2026-10-07)

| UK | EU | US | Harf | Göğüs | Bel | Basen |
|---|---|---|---|---|---|---|
| 16 | 44 | 12 | XL | 104 | 89 | 110 |
| 18 | 46 | 14 | XXL | 110 | 95 | 116 |
| 20 | 48 | 16 | 3XL | 116 | 101 | 122 |
| 22 | 50 | 18 | 4XL | 122 | 107 | 128 |
| 24 | 52 | 20 | 5XL | 128 | 113 | 134 |
| 26 | 54 | 22 | 6XL | 134 | 119 | 140 |
| 28 | 56 | 24 | 7XL | 140 | 125 | 146 |
| 30 | 58 | 26 | 8XL | 146 | 131 | 152 |
| 32 | 60 | 28 | 9XL | 152 | 137 | 158 |

- Çevirme kuralı **EU = UK + 28, US = UK − 4**. ASOS ve M&S ile aynı (`kaynaklar-beden.md` §1.3).
- Ayakkabı genişliği D / E / EE / EEE / EEEEE (mm ayak eni) ve çizmede beş baldır genişliği tablosu var: Standard, Curvy, Super Curvy, Curvy Plus, Extra Curvy Plus. Örneğin wide fit 6 numarada baldır sırasıyla 416 / 450 / 484 / 518 / 552 mm.

### 4.3 ASOS Curve (cm)
Kaynak: https://www.asos.com/discover/size-charts/women/dresses/ ("Curve Size Guide" bölümü) (2026-10-07)

| UK | Göğüs | Bel | Basen |
|---|---|---|---|
| 18 | 109 | 91 | 116,5 |
| 20 | 116 | 98 | 123,5 |
| 22 | 123 | 105 | 130,5 |
| 24 | 130 | 112 | 137,5 |
| 26 | 137 | 119 | 144,5 |
| 28 | 144 | 126 | 151,5 |
| 30 | 151 | 133 | 158,5 |

- ASOS standart serisinde de UK 18 var (göğüs 110,5 / bel 92,5 / basen 116). Curve 18'den biraz farklı; yani Curve ayrı bir kalıp bloğu.
- Basen ölçüsü **doğal belin 20 cm altından** alınıyor ("en geniş yer" tanımından farklı).
- Petite (≤5 ft 3 in) serisi yalnız UK 2–16. **ASOS'ta "petite plus" yok.**

### 4.4 Bonprix (kadın, cm)
Kaynak: https://www.bonprix.de/service/beratung/groessentabellen/ → Damen (2026-10-07)

| Çift beden (harf) | Tek beden | Göğüs | Bel | Basen |
|---|---|---|---|---|
| 44/46 (L) | 44 · 46 | 98–102 · 103–107 | 84–88 · 89–93 | 104–106 · 107–110 |
| 48/50 (XL) | 48 · 50 | 108–113 · 114–119 | 94–98 · 99–104 | 111–114 · 115–119 |
| 52/54 (XXL) | 52 · 54 | 120–125 · 126–131 | 105–110 · 111–116 | 120–124 · 125–130 |
| 56/58 (3XL) | 56 · 58 | 132–137 · 138–143 | 117–122 · 123–128 | 131–136 · 137–142 |

### 4.5 Lane Bryant (inç → cm)
Kaynak: https://www.lanebryant.com/help/size-chart (2026-10-07)

| US | Harf | Göğüs | Doğal bel | Alt basen | Curvy jean alt basen |
|---|---|---|---|---|---|
| 14 · 16 | 1X | 107 · 112 | 91 · 97 | 113 · 118 | 121 · 126 |
| 18 · 20 | 2X | 117 · 122 | 102 · 107 | 123 · 128 | 131 · 136 |
| 22 · 24 | 3X | 127 · 132 | 112 · 117 | 133 · 138 | 141 · 146 |
| 26 · 28 | 4X | 137 · 142 | 122 · 127 | 144 · 149 | 151 · 156 |
| 30 · 32 | 5X | 147 · 152 | 132 · 137 | 154 · 159 | 161 · 166 |
| 34 · 36 | 6X | 157 · 163 | 142 · 147 | 164 · 169 | 171 · 177 |
| 38 · 40 | 7X | 168 · 173 | 152 · 157 | 174 · 179 | 182 · 187 |

- Kaynakta inç değerleri: US 14 = 42 / 36 / 44,5; her numarada göğüs, bel ve basen 2'şer inç artıyor; 10/12 = M/L.
- **Curvy jean** tablosu: bel aynı, basen 3 in (≈8 cm) daha geniş, uyluk da geniş. Tanım: bel ile basen arasında 10–12 in (≈25–30 cm) fark olan gövde. **"Curvy" burada beden değil, oran (kalıp) anlamında.**
- Ölçme (özet): doğal beli bulmak için yana eğilip oluşan kıvrımın hizasından ölçmeyi öneriyor; uyluk ayaklar omuz genişliğinde açıkken en geniş yerden ölçülüyor. Göğüs ve bel farklı beden gösteriyorsa **üstlerde göğse göre** seçilmesini söylüyor. Arada kalınca küçük beden daha dar, büyük beden daha rahat oturur.

### 4.6 Torrid (inç → cm)
Kaynak: https://www.torrid.com/on/demandware.store/Sites-torrid-Site/default/Page-Include?cid=td-size-guide-apparel (2026-10-07)

| Torrid | Harf | US | Göğüs | Bel | Alt basen |
|---|---|---|---|---|---|
| 00 | M/L | 10 | 97–102 | 81–86 | 107–112 |
| 0 | L | 12 | 102–107 | 86–91 | 112–117 |
| 1 | 1X | 14 · 16 | 107–112 · 112–117 | 91–97 · 97–102 | 117–122 · 122–127 |
| 2 | 2X | 18 · 20 | 117–122 · 122–127 | 102–107 · 107–112 | 127–132 · 132–137 |
| 3 | 3X | 22 · 24 | 127–132 · 132–137 | 112–117 · 117–122 | 137–142 · 142–147 |
| 4 | 4X | 26 | 142–147 | 127–132 | 152–163 |
| 5 | 5X | 28 | 152–163 | 137–147 | 168–178 |
| 6 | 6X | 30 | 168–178 | 152–163 | 183–193 |

- Torrid'in kendi uluslararası tablosu: US 10 = UK 12 = EU 38 … US 30 = UK 32 = EU 58; Torrid 4 = UK 28/30 = EU 54/56. Bu tablo **ASOS, Simply Be ve Eloquii kuralından iki numara farklı** (onlarda US 10 = UK 14 = EU 42). Torrid'in çevirmesi içerikte kullanılmamalı ya da çelişki notuyla verilmeli.
- 4–6 arasında adımlar büyüyor (4 → 5 göğüste ~6 in). Uç bedenlerde aralık genişliyor.

### 4.7 Eloquii (inç → cm)
Kaynak: https://www.eloquii.com/c/eloquii-size-chart.html (2026-10-07)

| US | Göğüs | Doğal bel | Basen | Üst kol (biseps) |
|---|---|---|---|---|
| 14 | 109–114 | 94–99 | 117–122 | 37–38 |
| 16 | 114–119 | 99–104 | 122–127 | 38–39 |
| 18 | 119–124 | 104–109 | 127–132 | 39–41 |
| 20 | 124–130 | 109–114 | 132–137 | 41–43 |
| 22 | 130–135 | 114–119 | 137–142 | 43–45 |
| 24 | 135–140 | 119–124 | 142–147 | 45–47 |
| 26 | 142–147 | 127–132 | 150–155 | 47–50 |
| 28 | 150–155 | 135–140 | 157–163 | 50–53 |
| 30 | 157–165 | 142–150 | 165–173 | 53–57 |
| 32 | 168–175 | 152–160 | 178–185 | 57–60 |

- Üstte **biseps**, altta **uyluk** çevresi de veriliyor (uyluk: 14 = 27–28,25 in … 32 = 39,25–41 in).
- Çevirme: US 14 = UK 18 = EU 46 … US 32 = UK 36 = EU 64. Sayfadaki "25" değeri (US 22 / UK 24 hücreleri) bir yazım hatası.
- Göğüs tanımı: kolların altından, göğsün en dolgun yerinden; sütyen bedeniyle karıştırılmamalı.

### 4.8 Target – A New Day (inç → cm)
Kaynak: https://digitalcontent.target.com/itemcontent/sizecharts/htmlfragments/women-clothing/a-new-day/womens.html (2026-10-07)

| Harf | US | Göğüs | Bel | Basen |
|---|---|---|---|---|
| XXL | 17 | 116 | 103 | 123 |
| 1X | 18 | 121 | 109 | 128 |
| 2X | 20 · 22 | 126 · 131 | 114 · 119 | 134 · 140 |
| 3X | 24 · 26 | 136 · 141 | 124 · 130 | 145 · 151 |
| 4X | 28 · 30 | 146 · 151 | 135 · 140 | 157 · 163 |

- **Target'ta 1X = US 18; Lane Bryant ve Torrid'de 1X = US 14/16.** "1X" bile markalar arasında aynı değil.

### 4.9 Universal Standard – kendi harf sistemi
Kaynak: https://www.universalstandard.com/pages/find-my-size (2026-10-07)
- US 00/0 = 4XS, 2/4 = 3XS, 6/8 = 2XS, 10/12 = XS, 14/16 = S, **18/20 = M**, 22/24 = L, 26/28 = XL, 30/32 = 2XL, 34/36 = 3XL, 38/40 = 4XL.
- Gerekçeleri (özet): harfler ortalama kadın bedeni etrafında, çan eğrisine göre dağıtılmalı. Ortalama US 18 ise ona "M" denmeli.
- **Fit Liberty:** seçili ürünlerde, beden değişirse bir yıl içinde ücretsiz değişim (https://www.universalstandard.com/collections/fit-liberty).

---

## 5. Çapraz karşılaştırma: aynı vücut, farklı etiket

### 5.1 Erkek – göğüs çevresine göre etiket (cm, vücut)

| Göğüs bandı | DXL | KingSize | JP1880 / Bonprix | Duke | Jacamo | ASOS |
|---|---|---|---|---|---|---|
| ~107–112 | XL | L (yalnız tall) | L (102–109) | XL (107–111) | L | XL (106–111) |
| ~112–117 | – | – | XL (110–117) | XXL (112–117) | XL (114–119) | XXL (111–116) |
| ~117–122 | 1XL | XL | XXL (118–125) | 1XL (118–125) | 1XL (122–127) | XXXL (116–121) |
| ~127–132 | 2XL | 2XL | 3XL (126–133) | 2XL (126–132) | 2XL (129–134) | – |
| ~137–142 | 3XL | 3XL | 4XL (134–141) | 3XL (133–140) | 3XL | – |
| ~147–152 | 4XL | 4XL | 5XL (142–149) / 6XL (150–157) | 4XL (141–147) / 5XL (148–155) | 4XL (145–150) | – |
| ~157–163 | 5XL | 5XL | 6XL (150–157) / 7XL (158–165) | 6XL (156–163) | 5XL (152–157) / 6XL (160–165) | – |
| ~168–173 | 6XL | 6XL | 8XL (166–173) | 7XL (164–170) / 8XL (171–178) | 7XL (167–172) | – |

Okuma: **ABD big & tall (DXL, KingSize) ile İngiltere king size (Duke, Jacamo) 2XL'den sonra kabaca aynı hizada. Alman serisi (JP1880, Bonprix) aynı göğüste bir harf yukarıda etiketleniyor.** Moda zinciri (ASOS) ise XXXL'de bitiyor. Aynı okura bir mağazada 3XL, diğerinde 4XL dendiği oluyor; içerikte "harfe değil cm'ye bak" mesajı bu tabloyla gösterilebilir.

### 5.2 Kadın – göğüs ~122 cm çevresinde etiket

| Marka | Etiket |
|---|---|
| Ulla Popken | 50 (117–122) / 52 (123–128) |
| Bonprix | 52 (120–125) |
| Simply Be | UK 22 = EU 50 (122) |
| ASOS Curve | UK 22 (123) |
| Lane Bryant | US 20 / 2X (122) |
| Torrid | US 20 / Torrid 2 (122–127) |
| Eloquii | US 18 (119–124) |
| Target A New Day | 1X / US 18 (121) |
| DOB 1994 Alman tablosu (`kaynaklar-beden.md` §1.2) | 52 (122) |

Okuma: Avrupa'daki "EU 50–52" bandı ABD'de US 18–20 / 1X–2X'e, İngiltere'de UK 22'ye düşüyor. Ancak Target'ın 1X'i Lane Bryant'ın 2X'ine yakın; bu yüzden harf (1X, 2X) tek başına güvenilir değil.

---

## 6. Beden rehberlerinin yapısı

### 6.1 Ölçü alanları matrisi (doğrulanan sayfalar)

| Alan | DXL | KingSize | JP1880 | Duke | Jacamo | Ulla P. | Bonprix | Simply Be | ASOS | Lane Bryant | Torrid | Eloquii | Target |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Göğüs | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Bel / doğal bel | ✓ (pantolonun oturduğu yer) | ✓ | ✓ (göbek hizası) + bel bandı | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (yana eğilme kıvrımı) | ✓ | ✓ | ✓ |
| Basen / alt basen | – | – | – | – | – | ✓ | ✓ | ✓ | ✓ (belin 20 cm altı) | ✓ (alt basen) | ✓ (alt basen) | ✓ | ✓ |
| Boyun / yaka | ✓ | ✓ | ✓ | ✓ | (başka marka) | – | – | – | – | – | – | – | – |
| Kol boyu | ✓ (ense ortasından) | – | tall farkı | ceket | – | – | – | – | – | – | – | – | – |
| İç bacak | ✓ | – | ✓ | ✓ | ✓ | – | kısa/normal/uzun | – | petite 74 cm | boy serisi | uzunluk etiketi | – | – |
| Boy (kişi) | seri eşiği | seri eşiği | 190 cm tall | 190 cm tall | – | 3 seri | 3 seri | – | petite ≤160 | 5 boy | – | – | – |
| Biseps / uyluk | – | – | – | – | – | – | – | – | – | uyluk | – | ✓ / ✓ | – |
| Giysi ölçüsü | – | – | sırt/kol farkı | ✓ (koltuk altı eni) | tişört boyu | – | – | – | – | – | jean ölçme rehberi | – | – |
| Kilo | – | – | – | – | – | – | – | – | – | – | – | – | – |

**Gözlemler**
1. "Bel" üç ayrı yerde ölçülüyor: doğal bel (en ince yer ya da yana eğilme kıvrımı), göbek deliği hizası (JP1880), pantolonun oturduğu yer (DXL). Göbekli erkek okur için bu fark kritik. Sitemizde **"bel"** ile **"göbek çevresi"** iki ayrı alan olarak tanımlanmalı.
2. Basen tanımı da değişiyor: en geniş yer, "alt basen" ya da belin 20 cm altı.
3. Erkek tarafında boyun ve kol ölçüsü big & tall'ın çekirdeği; kadın tarafında üst kol (biseps) ve uyluk giderek ekleniyor (Eloquii, Lane Bryant).
4. Duke'un vücut ölçüsüyle giysi ölçüsünü yan yana vermesi, Türkiye'deki "giysi eni" tablolarıyla (`pazar-arastirmasi.md` §2.2) köprü kurmak için iyi bir model.

### 6.2 "İki beden arasında kaldım" kuralları
- DXL: kol boyunda uzun olanı seç.
- JP1880: büyük olanı seç.
- Lane Bryant: küçük beden daha dar, büyük beden daha rahat oturur; üstlerde göğüs ölçüsü önceliklidir.
- KingSize ("Why KingSize Fits True To Size" rehberi): ürün sayfasındaki ölçülere bakılmasını öneriyor.
Kurallar markaya göre değişiyor. Sitemizdeki "arada kaldım" önerisi kalıba bağlanmalı: esnek kumaşta küçük, dokuma ya da kalıplı ürünlerde büyük beden. Bu kural editoryal öneri olarak işaretlenmeli.

---

## 7. Beden bulucular / fit finder araçları

| Araç | Site | Girdi | Not |
|---|---|---|---|
| FitMAP 3D tarama | DXL – https://www.dxl.com/static/fitmap | Mağazada ya da uygulamada vücut taraması (243 ölçü) | Profil kaydediliyor, markaya göre öneri veriyor. Biyometrik veri işleniyor |
| True Fit | Simply Be – https://www.simplybe.co.uk/sizing | Vücut şekli, sevilen kalıp, **başka markalarda giyilen beden**; ölçü almak gerekmiyor | Üçüncü taraf yapay zekâ aracı; çerez onayı olmadan sayfada çalışmıyor |
| "Find My Size" eşleştirici | Universal Standard | Alışılmış US numarası → kendi harfi | Basit eşleme, kişisel veri yok |
| Kategori bazlı tablo seçici | Ulla Popken, Bonprix, ASOS | Kategori (üst, alt, sütyen, ayakkabı) ve cinsiyet sekmesi | Statik tablolar, veri toplamıyor |

**Bizim için:** Sitemiz bilgi sitesi olduğu için True Fit gibi profil tutan ya da çerez gerektiren araç uygun değil (KVKK maliyeti, brief §9). Doğru model, **kişisel veri saklamayan bir karşılaştırıcı**: okur cm değerlerini girer, tarayıcıda kaynaklı marka tablolarıyla eşleşir, sonuçta "bu markada X, şu markada Y" ve boy serisi notu gösterilir. Kilo alanı yok ya da yalnız "yaklaşık başlangıç" uyarısıyla (CLAUDE.md proporsiyon kuralı).

---

## 8. İçerik, editoryal formatlar, navigasyon ve mobil UX

### 8.1 Editoryal merkezler
- **KingSize "Big & Tall Style & Fit Guide"** – https://www.kingsize.com/k/big-and-tall-style-fit-guide/ : yazılar ürün gruplarına göre bölümlenmiş (Shirts, Bottoms, Outerwear, Active, Suits & Work, Underwear & Sleep, Shoes, Accessories). Her kartta tür etiketi (THE EDIT / FIT GUIDE / STYLE STORY), bir cümlelik özet ve okuma süresi var. Konu örnekleri: düğmeli gömleği göğse değil boyun ve boya göre seçmek; jean etiketinde bel × iç bacak ile ürün sayfasındaki dikili iç bacak farkı; relaxed, loose ve straight jean farkı; tam lastikli ve yan lastikli bel; streç ve klasik denim; polar kalınlıkları; geniş kalıp ayakkabı ölçüsü; kemer ve çorap bedeni; soğukta katmanlı giyinme.
- **Simply Be Blog ("The Edit")** – https://www.simplybe.co.uk/blog : seri formatı (jean serisi: barrel, wide-leg, yüksek bel, cropped; sütyen serisi: full cup, önden kapamalı, straplez, plunge, spor, balkonet), etkinlik yazıları (vaftiz, kış ve plaj düğünü, at yarışı, iş yeri yılbaşı partisi, havalimanı), ölçme yazıları (baldır ve ayakkabı eni), sezon trendleri.
- **Torrid jean rehberi** – https://www.torrid.com/clothing/jeans/denim-fit-guide/ : paça kalıpları tek cümlelik tanımlarla, bel ve ağ stilleri ayrı başlıkta, **5 kademeli esneme skalası** (esnemez → çok esnek) ve giysi üstünde ölçme (paça ağzı, ön ve arka ağ, bel, iç bacak).
- **Lane Bryant** – Jeans Fit Guide, Bra Fit Guide, Panty Fit Guide, aylık lookbook; footer'da "Fit Guides" merkezi. (fit-experts sayfası CAPTCHA'ya düştü; içeriği doğrulanamadı.)
- **Universal Standard** – "US Journal" blogu ve "Pose with US" kullanıcı içeriği sayfası (footer).
- **Duke** – blog ağırlıkla toptancı ve perakendeciye yönelik (tedarikçi seçimi, toplu alımda kalite kontrol listesi); birkaç uzun boylu erkek stil yazısı. Toptan rehberlerimiz (`/alisveris-rehberi/...`) için konu fikri veriyor.

### 8.2 Navigasyon kalıpları
- **Kalıp ile alışveriş:** DXL kategori sayfaları kalıba göre (relaxed, loose, athletic, relaxed-straight, tapered, straight, slim, bootcut). KingSize'ın **"Fits Your Journey"** menüsünde ayarlanabilir kalıplar, genişleyebilen bel, "room to move" ve streç kumaşlar; ayrıca longer length tişört ve polo, no-tuck gömlek, extra wide ayakkabı, ekstra uzun kravat.
- **Boy ile alışveriş:** Eloquii (Petite Bottoms / Tall Bottoms), Lane Bryant (Petite Shop), Old Navy (Petite / Tall + jean kalıbı olarak Curvy), Jacamo (Long and Tall).
- **Beden ile alışveriş:** Eloquii indirim bölümünde "14–16 / 18–20 / 22–24 / 26–28 / 30–32" kısayolları; Jacamo filtre etiketlerinde göğüs inci yazıyor (ör. "1XL 48/50in").
- **Rehberi menüye gömmek:** Torrid jean rehberini jean menüsüne, sütyen rehberini iç giyim menüsüne koyuyor. Rehberler ürün kararının olduğu yerde duruyor, ayrı bir blog köşesinde değil.
- **Footer'da beden ve sözlük:** Bonprix footer'ında "Modeglossar" (moda sözlüğü), Universal Standard'da "Find My Size / Size Chart / Our Size Philosophy", KingSize'da "Big & Tall Style & Fit Guide".

### 8.3 Mobil UX (gözlenen)
- DXL beden tablosu mobilde (375 px) **tam ekran pencere** olarak açılıyor; kategoriler akordeon (Tops & Outerwear, Sport Coats, Pants, Shoes, Hats). Her beden satırı etiket-değer çiftleri halinde alt alta diziliyor (geniş tablo yerine kart). Ölçme talimatları pencerenin sonunda.
- Ulla Popken ve Bonprix: tek sayfada kategori sekmeleri, statik HTML tablolar (taranabilir, SEO dostu).
- Torrid, Lane Bryant, SHEIN ve Yours gibi sitelerde bot koruması agresif. Rehber içeriğini ticari sayfadan ayırmamanın bir maliyeti var: içerik dışarıdan alıntılanamıyor ve doğrulanamıyor. Bizim statik ve açık sayfalarımız bu açıdan (AEO/GEO) avantajlı.

---

## 9. Terminoloji: TR ↔ EN / DE (sözlük sayfası taslağı)

> Hedef sayfa: `/rehberler/buyuk-beden-terimleri`. Her satırdaki "beden bandı" ilgili markanın **kendi** tanımıdır, evrensel değildir. TR karşılıklarında "öneri" yazanlar editoryal öneridir; resmi bir Türkçe standart terim bulunmadı.

| Türkçe (sitede) | EN / DE karşılığı | Kim, nasıl kullanıyor (kaynaklı) | Not |
|---|---|---|---|
| **büyük beden** (genel) | EN *plus size* (kadın), *big & tall* (erkek); DE *große Größen*, *Übergrößen* | Lane Bryant "Plus Size Clothing for Women" (10–40); Ulla Popken "Große Größen" (42–68); JP1880 "Große Größen / Übergrößen" (L–8XL, kısmen 10XL); Simply Be "Plus Size … 10–32" | Kadında İngilizce *plus size*, erkekte *big & tall* daha yaygın; Almancada iki cinsiyet için de *große Größen* |
| **battal beden** | Birebir karşılığı yok; en yakını *king size* (UK), *big* (US), DE *Übergröße* | Türkiye'de marka ve alan adlarında görülüyor: superbattal.com (sayfa artık **ModeXL** markasıyla "büyük beden erkek" diyor; tanıtımda 3XL–10XL üst, 56–84 pantolon; ana görselde "3XL–13XL"), StarBattal, TamBattal (bkz. `pazar-arastirmasi.md` §1) | Resmi tanımı yok. Arama dili olarak kullanılır, tanım editoryal açıklama olarak verilir |
| **süper battal** | *super king size* (Duke), *extended sizes* | Duke navigasyonunda "Super King Sizes" var, bandı tanımsız. TamBattal kot için "süper size" diyor (`pazar-arastirmasi.md`) | Site sahibinin gözlemi: TR'de genellikle 6XL ve üstü. **Kaynakla doğrulanmadı**, "yaygın kullanım" diye etiketlenmeli |
| **king size** | *King Size* (UK marka dili), *KingSize* (ABD marka adı) | KingSize (ABD) markası L–10XL; Duke "King Sizes" (ana sayfada 2XL–10XL) | ABD'de bir marka adı, İngiltere'de bir beden serisi adı. Aynı kelimenin iki anlamı var |
| **big (geniş seri)** | *Big* | DXL: normal seri 6 ft (≈183 cm) ve altı; KingSize: 6 ft 1 in (≈185 cm) ve altı, XL–10XL | "Big", büyük bedenin normal boy serisi demek; uzunluk eklenmiyor |
| **uzun boy (erkek)** | *Tall* (XLT, 2XLT… / LT, 2XT…), DE *Tall* / *lange Größen* | DXL: kol +2 in, ağ ve iç bacak uzun; KingSize: 6 ft 2 in (≈188 cm)+; JP1880: 190 cm+, sırt +2–4 cm, kol +3–4 cm; Duke: 190 cm+ (navigasyon) | Tall genişliği değiştirmiyor, yalnız uzunluğu |
| **big & tall** | *Big & Tall* | DXL ve KingSize ikisini ayrı seri olarak sunuyor, çatı adı olarak kullanıyor | Türkçe karşılığı öneri: "büyük ve uzun beden" |
| **kısa boy dolgun kalıp** (öneri; aramada "göbekli kalıp") | DE *untersetzte Größen* (26–36) | JP1880 ve Bonprix: aynı göğüste bel ~4 cm daha geniş, iç bacak ~4 cm daha kısa | Saygılı dil: "kısa boy, geniş bel kalıbı" (`kaynaklar-beden.md` ile uyumlu) |
| **karın payı kesim** (öneri) | DE *Bauchfit* | JP1880: önü daha uzun üst, ön ağı düşük pantolon | "Göbekli erkek" içeriklerinde çözüm terimi |
| **kısa boy (kadın)** | *Petite*, *Short*; DE *Kurzgrößen* | Lane Bryant: Petite ≤5 ft 3 in (oransal kesim) ≠ Short ≤5 ft 4 in (yalnız boy); Ulla Popken: <167 cm → 21–34; Bonprix: 155–163 cm | "Petite" ile "kısa paça" aynı şey değil |
| **kısa boy büyük beden** | *Petite Plus* | Lane Bryant Petite Shop (10–40 bedenle); Eloquii Petite Bottoms. **ASOS Petite yalnız UK 2–16** | Türkçede bu niş için içerik açığı olabilir (doğrulanacak) |
| **uzun boy (kadın)** | *Tall*, *Long*, *Extra Long*; DE *Langgrößen* | Lane Bryant Long 5 ft 8 in–5 ft 10 in, Extra Long 5 ft 10 in+; Ulla Popken >174 cm → 84–136; Bonprix Lang 173–181 cm; Torrid Tall / Extra Tall jean | – |
| **uzun boy büyük beden** | *Tall Plus* | Eloquii Tall Bottoms; Torrid Tall / Extra Tall boyları | – |
| **curve** | *Curve* | ASOS Curve = UK 18–30 (ayrı kalıp bloğu). SHEIN "Curve" menüsü var, bandı doğrulanamadı | Seri / bölüm adı |
| **kıvrımlı kalıp** (öneri) | *Curvy* (fit) | Lane Bryant Curvy jean: bel ile basen arasında 10–12 in (≈25–30 cm) fark, basen +3 in. Old Navy'de jean kalıp filtresi | **Curvy bir beden değil, oran ve kalıp.** "Curvy = büyük beden" diye çevrilmemeli |
| **1X, 2X, 3X…** | US kadın plus harfleri (*W* ile de yazılıyor) | Lane Bryant 1X = 14/16; Torrid 1 = 1X = 14/16; **Target 1X = 18** | Aynı harf markaya göre bir numara kayıyor |
| **XL / XXL / 2XL** | – | Kadın XL: Simply Be UK 16; Bonprix 48/50; Ulla Popken 54/56; Universal Standard US 26/28. Erkek XL: ASOS 106–111 cm; DXL 107–112; KingSize 117–122; JP1880 110–117. **Duke'ta XXL (112–117) ≠ 2XL (126–132)** | Harf, ancak marka ve cm ile birlikte anlamlı |
| **1XL** | – | DXL'de eski XL'in yeni adı (46–48 in); Duke ve Jacamo'da XXL'den sonra gelen ilk king beden | – |
| **çift beden** | DE *Doppelgröße* (52/54), UK *dual size* | JP1880, Bonprix, Jacamo (alt giyim), Simply Be | Tek numaraya çevrilirken aralık iki numarayı kapsar |
| **konfeksiyon bedeni / numara** | DE *Konfektionsgröße* | Ulla Popken, Bonprix (32–68) | TR'deki 42–66 numara sistemiyle aynı mantık (EU) |
| **toptan / king serisi** | *Regular / King / Super King / Tall* | Duke (toptan satış sitesi) navigasyonu | İngiltere toptan pazarının seri dili |

**Kullanım farklarının özeti (sözlük sayfasında kutu olarak):**
1. "Big" ve "king" bedenler ABD'de XL ya da 1XL'den, İngiltere'de XXL'den sonraki 1XL'den başlıyor. Almanlar aynı göğüse bir harf yukarı etiket veriyor.
2. "Tall" her yerde uzunluk demek, genişlik değil. Eşik 183 ile 190 cm arasında değişiyor.
3. "Curvy" oran demek, "Curve" ise seri adı. İkisi de tek başına beden numarası değil.
4. "Petite", kalıbın oransal kısaltılması demek. "Short" ise çoğu yerde yalnız boy kısaltması.

---

## 10. buyukbeden.net için çıkarımlar

### 10.1 Benimsenecek özellikler ve formatlar
1. **"Aynı vücut, farklı etiket" çapraz-marka tablosu** (§5). cm bandı → markaya göre etiket. Erkek ve kadın için ayrı sayfalar (silo kuralı); her satırda kaynak ve kontrol tarihi. Veriler `kaynaklar-beden.md` ve bu dosyadan beslenir.
2. **Üç adımlı beden mantığı bileşeni:** (1) çevre ölçüsü → beden, (2) boy → seri (kısa / normal / uzun, kadında petite ve short ayrımıyla), (3) gövde şekli → kalıp (karın payı, curvy, düz). Proporsiyon kuralının görsel anlatımı; kilo yok.
3. **Ölçü alma rehberi**, her ölçü ayrı kart: göğüs, **doğal bel ile göbek çevresi (iki ayrı alan)**, basen ve alt basen, boyun, kol (ense ortasından), iç bacak, üst kol, uyluk, baldır. Her kartta "markalar bunu nereden ölçüyor" notu (§6.1).
4. **Vücut ölçüsü ↔ giysi ölçüsü köprüsü:** Duke modeli. Türkiye'deki "giysi eni + kilo" tablolarını okuyabilmek için "giysi göğüs eni × 2 − rahatlık payı" mantığı anlatılır (pay değerleri kaynaklıysa).
5. **Kalıp sözlüğü:** relaxed / loose / straight / tapered / athletic; Comfort ve Modern Fit; curvy ile straight jean; bauchfit; no-tuck; longer length. Jean için **esneme skalası** (Torrid'in 5 kademesinden esinlenen ama kumaş içeriğine dayanan kendi skalamız; kumaş rehberine bağlanır).
6. **Uzunluk boyutu içerikleri:** erkek tişört boyu (Jacamo'nun Regular / Long / Extra Long ölçüleri örnek), paça boyu skalası (extra short → tall, Duke ve Jacamo), kadında petite ile short farkı.
7. **"Arada kaldım" rehberi:** marka kurallarını karşılaştıran kısa tablo (§6.2) ve kumaşa göre editoryal öneri.
8. **Ayakkabı genişliği ve çizme baldır genişliği rehberi** (Simply Be: 5 genişlik, 5 baldır; Ulla Popken: G/H/K genişlik, XL/XXL baldır). Kadın büyük beden içeriğinde az ele alınan bir konu; kumaş ve aksesuar kümesine eklenebilir.
9. **Editoryal merkez kalıbı:** KingSize gibi ürün grubu başlıkları, içerik türü etiketi (Rehber / Kalıp Rehberi / Stil Yazısı), bir cümlelik özet ve okuma süresi. Simply Be gibi **seri yazılar** ("Jean Rehberi Serisi: geniş paça, barrel…"), **etkinlik yazıları** ("Kış düğününde ne giyilir").
10. **Rehberi kararın olduğu yere koymak:** jean kalıp rehberi `/kadin/giyim/jean` hub'ında, gömlek boyun ve kol rehberi `/erkek/giyim/gomlek` hub'ında; mega menüde "Rehber" satırı (Torrid örneği).
11. **Mobil tablo deseni:** geniş tabloyu 360 px'te kart ya da akordeon olarak göstermek (DXL). Brief §32 ve "tablo yalnız kendi kabında kayar" kuralına ek olarak "satır = kart" görünümü.
12. **Sözlük sayfası** (§9) ve footer'da "Beden Sözlüğü" bağlantısı (Bonprix'in Modeglossar'ı gibi).
13. **Veri tutarlılık kontrolü:** global tablolarda bile hata çıktı (§11). Bizim `npm run validate` adımına beden aralıklarının **artan ve boşluksuz** olduğunu, alt sınırın üst sınırdan küçük olduğunu denetleyen bir kural eklenmesi önerilir.

### 10.2 Türkçe pazarda olası içerik açıkları (global örneklerden türetildi; `pazar-arastirmasi.md` §5 ile birlikte doğrulanmalı)
- Kısa boy ve dolgun gövdeli erkek için "untersetzt" mantığının Türkçe anlatımı.
- Uzun boy büyük beden erkek (tall) ve kadın (tall plus) rehberleri.
- Petite plus (kısa boy büyük beden kadın): Lane Bryant'ın petite ile short ayrımı gibi açıklamalar.
- Curvy ile straight jean seçimi (bel-basen farkına göre).
- "XXL ile 2XL aynı mı?", "1X ile XL farkı", "EU 52 kaç UK, kaç US?" ve **çevirme tablolarının neden çeliştiği** (Torrid örneği).
- Ayakkabı genişliği, çizme baldırı, sütyen ve alt göğüs ölçümü.
- Erkek gömlekte boyun ve kol ölçüsüyle beden seçimi (ABD ve İngiltere'nin temel yöntemi).

### 10.3 Bilinçli olarak almayacaklarımız
- Profil tutan ya da çerez gerektiren yapay zekâ beden önerisi (True Fit tipi). KVKK ve "satış sitesi değiliz" ilkesiyle çelişiyor.
- 3D tarama (biyometrik veri).
- Puan, yorum sayısı, fiyat gibi ticari öğeler (brief §0, §24).

---

## 11. Doğrulanamayanlar, veri hataları ve açık işler

**Doğrulanamadı (CAPTCHA, 403 ya da sayfada veri yok):**
- Yours Clothing (Cloudflare doğrulaması, 403), SHEIN Curve (risk/CAPTCHA sayfası; yalnız üçüncü taraf tablolar bulundu, **kullanılmadı**), JD Williams (tablo yalnız ürün sayfasında), Old Navy (tablo sayfası hata verdi), H&M+ (menüde ayrı kategori görülmedi), Universal Standard'ın cm/inç ölçüleri (sayfada çıkmadı), Lane Bryant "Fit Experts" sayfası (CAPTCHA; beden tablosu ise `/help/size-chart` adresinden doğrulandı), Bonprix erkek Untersetzt ve Schlank sekmelerinin ayrı değerleri.
- Navabi: navabi.de bakım sayfasına yönleniyor. Arka plan için ikincil haber (2020 iflas süreci, City Chic tarafından satın alma): https://fashionunited.de/nachrichten/business/navabi-eroeffnet-vorlaeufiges-insolvenzverfahren-in-eigenverwaltung/2020072436493 (type: reference). Güncel durumu sitesinden doğrulanmalı.

**Resmi sayfalarda bulunan tutarsızlıklar (veri girerken dikkat):**
- KingSize'ın cm tablosunda hatalar var (L göğüs "107–118", XL bel "107–118", 6XL boyun "59½–57"). **İnç tablosu kullanılmalı, cm'yi biz çevirmeliyiz.**
- DXL tall eşiği üstlerde 6 ft ½ in, pantolon metninde 6 ft.
- JP1880 9XL pantolon beli "176–175" (yazım hatası; dizi mantığıyla 176–185).
- Eloquii çevirme satırında "25" (US 22 / UK 24 olmalı).
- Jacamo ana sayfa filtre etiketleri (2XL 52/54 in) ile yardım tablosu (2XL 51–53 in) farklı.
- Torrid'in uluslararası çevirmesi diğer üç kaynaktan iki numara farklı.

**Açık işler:**
1. Yours, SHEIN ve JD Williams için ürün sayfası "Size Guide" pencerelerini (CAPTCHA'sız açılırsa) okumak.
2. Bonprix erkek Untersetzt / Schlank değerlerini ayrı ayrı almak.
3. Sözlük sayfasındaki "süper battal ≈ 6XL+" bilgisini Türkiye'deki resmi site tablolarıyla desteklemek ya da "yaygın kullanım" diye etiketlemek.
4. Bu dosyadaki tabloları `src/content` veri şemasına (`sources: [{url, type: "brand-official", label, checkedAt: "2026-10-07"}]`, `dataConfidence`) aktarmak; inçten çevrilen değerler için not alanı.

---

## 12. Kaynak listesi (hepsi 2026-10-07 tarihinde kontrol edildi)

| Kaynak | URL | type |
|---|---|---|
| DXL ürün sayfası beden penceresi | https://www.dxl.com/p/synrgy-performance-solid-dress-shirt-p5397 | brand-official |
| DXL FitMAP | https://www.dxl.com/static/fitmap | brand-official |
| KingSize beden tablosu | https://www.kingsize.com/on/demandware.store/Sites-oss-Site/default/SizeGuide-Show?cid=ks-sizeguide-topsbottoms | brand-official |
| KingSize Size & Fit | https://www.kingsize.com/help-page?cid=ks-custservice-sizechart | brand-official |
| KingSize Style & Fit Guide | https://www.kingsize.com/k/big-and-tall-style-fit-guide/ | brand-official |
| Torrid apparel size guide | https://www.torrid.com/on/demandware.store/Sites-torrid-Site/default/Page-Include?cid=td-size-guide-apparel | brand-official |
| Torrid denim fit guide | https://www.torrid.com/clothing/jeans/denim-fit-guide/ | brand-official |
| Torrid ürün (boy seçenekleri) | https://www.torrid.com/product/jegging-skinny-high-rise-jean/12638273.html | brand-official |
| Lane Bryant size chart | https://www.lanebryant.com/help/size-chart | brand-official |
| Eloquii size chart | https://www.eloquii.com/c/eloquii-size-chart.html | brand-official |
| Ulla Popken Größenberater (kadın) | https://www.ullapopken.de/de/guides/size-guide | brand-official |
| JP1880 Größenberater Menswear | https://www.ullapopken.de/de/groessentabellejp | brand-official |
| JP1880 ana sayfa | https://www.ullapopken.de/de/jp1880 | brand-official |
| Simply Be women's size chart | https://support.simplybe.co.uk/hc/en-gb/articles/360019571299-Women-s-size-chart | brand-official |
| Simply Be sizing (True Fit) | https://www.simplybe.co.uk/sizing | brand-official |
| Simply Be blog | https://www.simplybe.co.uk/blog | brand-official |
| ASOS kadın elbise (Curve, Petite, Tall dahil) | https://www.asos.com/discover/size-charts/women/dresses/ | brand-official |
| ASOS erkek tişört ve polo | https://www.asos.com/discover/size-charts/men/tshirts-polo-shirts/ | brand-official |
| Jacamo men's size chart | https://support.jacamo.co.uk/hc/en-gb/articles/9545219384220-Men-s-size-chart | brand-official |
| Duke size & fit guide | https://www.dukeclothing.com/size-fit-guide | brand-official |
| Duke blog | https://www.dukeclothing.com/blog | brand-official |
| Bonprix Größentabellen | https://www.bonprix.de/service/beratung/groessentabellen/ | brand-official |
| Universal Standard Find My Size | https://www.universalstandard.com/pages/find-my-size | brand-official |
| Universal Standard Fit Liberty | https://www.universalstandard.com/collections/fit-liberty | brand-official |
| Target A New Day size chart | https://digitalcontent.target.com/itemcontent/sizecharts/htmlfragments/women-clothing/a-new-day/womens.html | brand-official |
| H&M sizing FAQ | https://www2.hm.com/en_gb/customer-service/sizeguide/sizing-faq.html | brand-official |
| Old Navy ana sayfa (navigasyon) | https://oldnavy.gap.com | brand-official |
| JD Williams destek araması | https://support.jdwilliams.co.uk/hc/en-gb/search?query=size+chart | brand-official |
| Navabi (bakım sayfası) | https://www.navabi.de | brand-official |
| superbattal.com (ModeXL) | https://www.superbattal.com | brand-official |
| Navabi 2020 haberi | https://fashionunited.de/nachrichten/business/navabi-eroeffnet-vorlaeufiges-insolvenzverfahren-in-eigenverwaltung/2020072436493 | reference |

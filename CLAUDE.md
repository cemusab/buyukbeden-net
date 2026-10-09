@AGENTS.md

# Buyukbeden.net – Proje Kuralları

Bu dosya her oturumun başında okunur. **Yeni oturumda önce `docs/devam-notu.md` oku** (kaldığımız yer, devam eden işler, sıradaki adımlar). Ana brief: `docs/brief.md` (çelişkide brief geçerli). Mimari: `docs/mimari.md`. Görsel dil: `docs/tasarim-referansi.md` (mimari §T'nin önüne geçer). İçerik planı: `docs/icerik-plani.md`. Oturum notları: `docs/durum.md`.

## Amaç
Türkiye'nin büyük beden moda, beden, stil, kombin, kumaş ve marka rehberi. **Satış sitesi değil**: sepet, fiyat, stok, ürün kartı, Product/Offer/AggregateRating schema yok. Buyukbedengiyim.com ileride ticari taraf; ona linkler yalnız doğal ve faydalıysa, `RelatedShoppingCTA` bileşeniyle ve içerikten aç/kapa edilerek. **Site sahibi açmayı söyleyene kadar Buyukbedengiyim.com sitede hiçbir yerde görünmez** (feature flag kapalı; marka listelerinde, metinlerde, linklerde yok).

## İçerik kapsamı (site sahibinin özel isteği)
- Türkiye'deki büyük beden siteleri/markaları araştırılır (`docs/pazar-arastirmasi.md`) ve marka dizininde objektif örnek olarak yer alır; metin/fotoğraf kopyalanmaz.
- Alıcı yorumlarındaki (Trendyol vb.) ortak temalar kendi cümlemizle özetlenir; alıntı, kullanıcı adı, uydurma sayı yok.
- "Nasıl giyinmeli", "alırken nelere dikkat etmeli" rehberleri; kumaşlar (pamuk, polyester, viskon vb.), **içerik karışımları/etiket okuma, yıkama, kurutma, ütüleme ve bakım sembolleri** mutlaka kapsanır.
- **Toptan pazar:** Türkiye'de büyük beden pazarı büyük ölçüde İstanbul Merter, Laleli, Osmanbey üzerinden işler. Bu semtler, toptan alım (seri/asorti, minimum adet, numune, kalıp/kumaş kontrolü) ve butik/e-ticaret satıcısına pratik rehberler bilgilendirme amaçlı kapsanır (`/alisveris-rehberi/...`). Sipariş/B2B satış yok.
- **Proporsiyon (beden mantığının temeli):** Beden kiloyla değil vücut ölçüleri ve oranlarla belirlenir. Aynı kilodaki iki kişi boylarına göre farklı beden giyer: ör. 1,50 m / 150 kg biri 5XL'e, 1,80 m / 150 kg biri 3XL–4XL'e çıkabilir, çünkü kilo kısa boyda daha çok çevreye (göbek, göğüs, basen) dağılır. Belirleyici olan göğüs/göbek/bel/basen çevresi, omuz genişliği, kol ve beden boyu. Bu yüzden içerikte "kiloya göre beden" tabloları kesin bilgi gibi sunulmaz; ölçü almaya yönlendirilir, boy/kilo yalnız yaklaşık başlangıç olarak ve "markaya ve vücut oranına göre değişir" uyarısıyla verilir. Örnek sayılar açıklayıcı örnek olarak etiketlenir. Yalnız BMI'ya dayalı "beden hesaplayıcı" yapılmaz; araç yapılırsa ölçüler (çevre + boy) ile kaynaklı marka tablolarını karşılaştırır ve boy için kısa/uzun boy notu verir.
- **İç giyim:** Büyük beden iç giyim (kadında setler: sütyen-külot takımları, sütyen beden/kup ölçüsü, kumaş, ter/nem yönetimi, bakım) öncelikli içerik. Erotik/iç çamaşırı odaklı cinsel görsel **kullanılmaz**; rehber dili bilgi odaklı.
- **Ter ve kumaş ömrü:** Terleme, nefes alan kumaşlar, ter lekesi, deodorant lekesi, kumaş yıpranması ve bakım anlatılır; ancak "büyük bedende ter daha asitli" gibi fizyolojik iddialar **yalnız bilimsel kaynakla** ve damgalamayan dille yazılır, kaynak yoksa yazılmaz.
- **Görseller – AI manken:** Vücut tipi ve kategori görsellerinde hedef, gerçeğe yakın (suni/plastik durmayan), saygılı, giyimli **AI üretimi manken fotoğrafları**. Her AI görselin içerikte `aiGenerated: true` işareti ve görsel altında küçük "Yapay zekâ ile üretilmiş görsel" notu olur (şeffaflık). Gerçek kişi/marka/rakip görseline benzetilmez, logo yok. Görsel yoksa SVG illüstrasyon yedek olarak gösterilir.
- **Ayakkabı (büyük numara + geniş kalıp):** Büyük beden kişilerin ayrı bir sorunu. Erkekte 47 numara ve üstü, kadında 42 ve üstü büyük numara; **genişlik** ayrı eksen (wide / extra wide; UK G-H-K, US D-2E-4E-6E, EU "weite H/K"; burun genişliği, ayak üstü yüksekliği, şişen ayak), kadında **geniş baldırlı (wide calf) çizme**. Bilgi sitesi olarak: ayak ölçme (uzunluk + genişlik, akşam ölçümü), numara sistemleri (EU/UK/US/Mondopoint), genişlik harfleri, büyük numara ve geniş kalıp üreten markalar (doğrulanmış bilgiyle). URL: `/kadin/ayakkabi/...`, `/erkek/ayakkabi/...` (silo korunur; giyim dışı ayrı bölüm). Ölçüler yine kaynaklı, kesinlik dili yok.
- **Responsive ve kırık link:** Her şablon 360–1440px arası test edilir; sayfa yatay kaymaz, tablolar yalnız kendi kabında kayar. Kırık iç link/görsel crawler'da hata.

## Değişmez kurallar
1. **Kadın ve erkek ayrı silo.** Kadın: `/kadin/...`, erkek: `/erkek/...`; giyim `/kadin/giyim/...`, `/erkek/giyim/...`. Breadcrumb, canonical, sitemap, related content siloyu korur; kadın sayfasında önce kadın, erkekte önce erkek içerik önerilir.
2. **Çalışmayan link yok.** `href="#"`, `javascript:void(0)`, boş href, placeholder/demo URL yok. Hedefi olmayan sayfaya link verilmez. Tüm route'lar merkezi manifestten (`src/lib/routes.ts`) gelir; sitemap ve testler bunu kullanır.
3. **Placeholder sayfa yok.** "Çok yakında / yapım aşamasında" yok; hazır olmayan özellik arayüzden kaldırılır.
4. **Uydurma veri yok.** Beden ölçüsü, beden aralığı, marka bilgisi, kumaş teknik değeri, istatistik, yorum, puan kaynaksız yazılmaz. Doğrulanamayan alan boş bırakılır/gösterilmez. Kaynaklı veride `sources` (url, type, label, checkedAt).
5. **Kopya yok.** Rakip/perakendeci metni, ürün açıklaması, fotoğrafı kopyalanmaz. Metinler özgün ve doğal Türkçe.
6. **Ton:** saygılı, pozitif, modern, profesyonel; beden utandıran, aşağılayıcı, stereotipik dil yok. "Büyük beden" mekanik tekrar edilmez. Kısa cevap üstte.
7. **Thin content yok.** Landing (ör. `52-beden`) yalnız gerçek ve kapsamlı içerik varsa üretilir. Filtre/arama URL'leri noindex.
8. **Sahte yazar/unvan yok.** Yazar profilleri gerçek kişiler veya "Buyukbeden.net Editör Ekibi".
9. **KVKK/GDPR:** analitik/çerez eklenirse önce yasal metinler güncellenir; rıza gerektiren izleme rızasız çalışmaz.
10. Her değişiklikten sonra `npm run qa` (validate + build + Playwright crawler) yeşil olmalı; kırmızıyken iş bitmiş sayılmaz.

## Beden Kuralları (site sahibi brief'i + 2026-10-07 eki; kesin uyulur)
1. **Proporsiyon:** Beden kiloyla değil ölçü ve oranla belirlenir (yukarıdaki "Proporsiyon" maddesi). Boy yalnız kısa/normal/uzun seri ve boy uzunluğu notu için kullanılır.
2. **Vücut ölçüsü / ürün ölçüsü ayrımı:** Her ölçü tablosunda `measurementType: body | garment` zorunlu. `body` = kişinin vücut ölçüsü, `garment` = kıyafetin kendi ölçüsü (ör. tek kat en). İkisi asla birbirinin yerine kullanılmaz, aynı tabloda karıştırılmaz; karşılaştırma tabloları yalnız aynı tür ölçüyü yan yana koyar.
3. **Ölçüler aralık olarak tutulur:** kadın `bust/waist/hip` için `min/max` (cm), erkek `chest/waist/hip` için `min/max` (erkekte "bust" değil "chest"). Kaynak tek değer veriyorsa min = max.
4. **Zorunlu/ek alanlar:** `productType` (elbise, pantolon, jean, gomlek, ceket, triko, ic-giyim, tisort, genel…), `sourceType` (öncelik: official_brand > manufacturer > distributor > generic), `unit` (cm | inch; kaynaktan geldiği gibi saklanır, arayüzde cm'ye çevrilir ve çeviri belirtilir), `stretch` (none | low | high; elastan/likra oranına göre, kaynaklı). Erkek: `neck` (gömlek yaka), `shoulder`, `sleeve`. Jean: `waistInch` (W), `lengthInch` (L), ör. W40 L32.
5. **Veri yapısı ilişkili:** markalar (`content/markalar`) ← beden tabloları (marka, cinsiyet, ürün tipi, ülke sistemi, ölçü türü, kaynak türü, kaynak URL, son doğrulama) ← tablo satırları (numerik beden, harf beden, ölçü aralıkları, kalıp tipi, esneme). Markalar arası karşılaştırma tabloları elle değil bu satırlardan **türetilir**.
6. **Beden hesaplayıcı:** Yalnız boy/kiloyla kesin beden önermez. Göğüs/bel/basen (erkekte göğüs/bel/kalça) girilirse ölçüye göre, kaynaklı marka tablolarıyla önerir. Yalnız boy/kilo girilirse sonuç açıkça **"tahmini"** etiketlenir ve ölçü almaya yönlendirir. Veri saklanmaz, çerez/ağ isteği yok.
7. **Kesinlik dili yasak:** "kesin olarak", "her zaman … bedendir", "tam olarak … bedene denk gelir" gibi ifadeler kullanılmaz; kontrol scripti bunları tarar ve raporlar. Doğru dil: "çoğu markada", "yaklaşık", "markaya göre değişir".
8. **Tazelik:** Beden tablosu ve marka verisinde `lastVerifiedAt` 6 aydan eskiyse validate uyarı verir; yeniden doğrulanır.
9. **Kaynak:** Kaynaksız tablo yok; tahmini/editoryal değerler ve inch→cm çevirileri açıkça etiketlenir; zayıf veri (tek kaynak) sayfada belirtilir.

## Yayın ve Vercel kullanımı (site sahibinin isteği – Vercel kotası doldu)
- **Her küçük değişiklikte push/deploy yok.** İlişkili değişiklikler birleştirilir; önce lokalde `npm run qa` (build + testler) yeşil olur, ancak sonra tek seferde push edilir. Ara commit'ler lokalde kalır.
- `v2` dalına push önizleme build'i üretmez; Vercel yalnız `main`'de ve yalnız site dosyaları değiştiğinde build eder (`vercel.json > ignoreCommand` → `scripts/vercel-ignore.sh`). `docs/`, `*.md`, `legacy/`, `tests/` değişiklikleri build tetiklemez. Bu dosyalar silinmez/gevşetilmez.
- Yayın akışı: lokal qa yeşil → v2 push → PR → main merge (tek production build). Gereksiz PR/merge zinciri yapılmaz; acil düzeltmeler de mümkünse bir sonraki toplu yayına eklenir.
- Vercel hesabında ayar değişikliği veya eski deployment silme yalnız site sahibinin açık onayıyla.

## Üç site stratejisi (site sahibi, 2026-10-09)
- **buyukbeden.net** ve **buyuk-beden.com**: bağımsız bilgi/blog siteleri; trafik (hit) alır, otorite kurar. **buyukbedengiyim.com**: kurulacak ticari site; iki bilgi sitesi zamanı gelince ona doğal linklerle destek verir.
- Google'ın bağlantı planı (link scheme) politikası nedeniyle: her site kendi başına değerli olmalı; linkler yalnız konuyla ilgili ve okura faydalı yerlerde, editoryal metin içinde; site geneli (footer/sidebar) toplu link yok; anchor metinleri çeşitli, tam eşleşme ticari anchor tekrarı yok; aynı sahiplik okura şeffaf ("kardeş sitemiz" gibi) belirtilir; içerik iki sitede kopyalanmaz.
- buyukbedengiyim.com bağlantıları sahibi "aç" diyene kadar kapalı (feature flag) – değişmedi.

## Kardeş site: buyuk-beden.com (2026-10-09)
- Site sahibinin ikinci sitesi **buyuk-beden.com** (ayrı proje/oturum). İş bölümü: **buyukbeden.net öğretir** (beden, ölçü, kalıp, stil, kumaş, bakım, beden verisi, Beden Bulucu); **"nereden alınır" ve marka alışveriş/karşılaştırma rehberleri buyuk-beden.com'da**. Taşınan sayfalar `src/lib/external-redirects.ts` ile 308; aynı içerik iki alan adında tutulmaz, metin kopyalanmaz.
- Marka sayfaları her iki sitede var: .net'teki marka sayfaları **beden verisi ve ölçü** odaklı kalır (tablolar, özet kart, Beden Bulucu); alışveriş/nereden alınır anlatımı buyuk-beden.com'a bırakılır. Aynı sorguyu iki sitede hedeflemekten kaçınılır.
- buyuk-beden.com'a link yalnız doğal ve faydalıysa; her sayfaya zorunlu link yok. (buyukbedengiyim.com kuralı ayrıdır ve hâlâ geçerlidir.)
- **İki oturum aynı repoda çalışmasın:** buyuk-beden.com oturumu bu repoya değişiklik yaparsa ayrı dalda + PR ile yapar; `v2` dalına doğrudan commit edilmez. Yayından önce `git log origin/main..v2` ile beklenmeyen commit kontrol edilir.

## Teknoloji
Next.js 16 App Router + TypeScript + Tailwind v4, tüm sayfalar build'de statik: `cacheComponents` açık olduğu için `dynamicParams` kullanılmaz; `(site)/layout.tsx` içinde `ensureStatic = "navigation"`, `generateStaticParams` + bilinmeyen slug için `notFound()` (bkz. mimari.md K1–K2). İçerik dosya tabanlı, zod ile doğrulanır; erişim yalnız `src/lib/content.ts` üzerinden. Dev server arka planda çalıştırılır, beklenmez.

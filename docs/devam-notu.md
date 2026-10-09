# Devam notu – yeni oturum buradan başlar (son güncelleme: 2026-10-07)

> Yeni oturumda önce bunu, sonra `CLAUDE.md`, `docs/sahibi-bekleyenler.md`, `docs/durum.md` oku. Kullanıcı (site sahibi) "kaldığımız yerden birebir devam" istiyor.

## Proje
- Repo: `/Users/cemaksakal/Projects/buyukbeden-net` → GitHub `cemusab/buyukbeden-net`. Çalışma dalı `v2`, canlı dal `main` (Vercel otomatik yayınlar).
- **Canlı:** https://www.buyukbeden.net (apex `buyukbeden.net` → www 308; canonical/sitemap www). Vercel projesi `cemusabs-projects/buyukbeden-net`; framework ayarı repodaki `vercel.json` ile (`nextjs`). Proje panelde "Other" preset'inde; `vercel.json` silinirse site 404 olur.
- Kardeş proje (desen kaynağı): `/Users/cemaksakal/Projects/motorcukiyafeti`.
- Yayın onayı site sahibinden alındı (2026-10-07). Sonraki yayınlar: `npm run qa` yeşil → v2'den main'e PR → merge.

## Belgeler (hepsi `docs/`)
| Dosya | İçerik |
|---|---|
| `brief.md` | Site sahibinin master brief'i (çelişkide geçerli) |
| `mimari.md` | Mimari, rotalar, şema, SEO, sitemap, QA planı |
| `tasarim-referansi.md` + `design/reference.webp` | Sahibinin mockup'ı – görsel dil bundan |
| `icerik-format.md` | İçerik dosyası formatı (yazarlar için) |
| `icerik-plani.md` | Konu kümeleri, 54 cornerstone listesi |
| `kaynaklar-beden.md` | Doğrulanmış beden/kumaş/bakım verisi + kaynaklar |
| `pazar-arastirmasi.md` | Türkiye: 26 site, marka tabloları, Trendyol yorum temaları, Merter/Laleli/Osmanbey toptan |
| `global-arastirma.md` | Dünya: 20 site (DXL, KingSize, Torrid…), big/tall, terimler |
| `rapor-notlari.md` | Sahibinin e-ticaret raporundan bilgi sitesine uyan dersler |
| `gorsel-adaylari.md`, `gorsel-manifest.md` | Stok fotoğraf adayları / indirilen 50 fotoğraf + krediler + AI prompt listesi |
| `beden-veri-migrasyonu.md` | Onaylı beden verisi migrasyonu planı |
| `ayakkabi-arastirmasi.md` | Büyük numara + geniş kalıp ayakkabı araştırması (34 kaynak; ayakkabı bölümünün veri kaynağı) |
| `sahibi-bekleyenler.md` | Site sahibinden beklenenler listesi |
| `durum.md` | Teknik durum notları |

## Yapılanlar (canlıda)
- Next.js 16 SSG site, 196 statik sayfa, 159 içerik (kadın/erkek silo, 15 kategori hub'ı, beden rehberleri + 33 kaynaklı tablo, stil/vücut tipi, kombin, kumaş/bakım, 22 marka, 10 alışveriş/toptan rehberi, 3 trend, terimler sözlüğü).
- Arama (MiniSearch, Türkçe normalize), mega menüler ("Bedene göre" sütunu), kısa URL yönlendirmeleri (`/kadin/elbise` → `/kadin/giyim/elbise`, `/erkek/tshirt` …), sitemap-index + 7 grup sitemap, robots, JSON-LD (izinli tipler), Keystatic admin (`/keystatic`, yalnız local; prod GitHub bağlantısı kurulmadı).
- 50 lisanslı Pexels/Unsplash fotoğrafı (`public/images/stok`), SVG illüstrasyonlar (`src/components/illustrations`).
- `npm run qa` yeşil: validate + lint + build + Playwright (73 passed). Canlıda sitemap'teki 161 URL 200 doğrulandı.

## Devam eden (bu oturumda başlatıldı; yeni oturumda durumu kontrol et)
1. **Beden verisi migrasyonu** (`docs/beden-veri-migrasyonu.md`, CLAUDE.md "Beden Kuralları"): body/garment ayrımı, min–max aralıklar, türetilmiş karşılaştırma etiketi, kesinlik dili kontrol scripti (`scripts/check-language.ts`), 6 ay tazelik uyarısı, **Beden Bulucu**. Bir agent v2'de çalışıyordu. Kontrol: `git log --oneline v2 -15`, `git status`, `npm run qa`. Yarım kaldıysa planı tamamla. Bitince qa yeşil → PR → main.
2. **Ayakkabı: TAMAM (v2'de, push edilmedi).** Rotalar `/kadin/ayakkabi`, `/erkek/ayakkabi` (+ `[slug]`; `sayfalar/{silo}-ayakkabi` landing, alt sayfalar `makaleler` + `section: ayakkabi`), `ayakkabi` rezerve segment, mega menü/footer/silo kapısında "Ayakkabı". 9 sayfa: erkek hub + `buyuk-numara` (47+) + `genis-kalip`; kadın hub + `buyuk-numara` (42+) + `genis-kalip` + `genis-baldirli-cizme`; `/beden-rehberi/ayak-olcusu-nasil-alinir`; `/alisveris-rehberi/buyuk-numara-ayakkabi-markalari`. Beden tablosu şeması ayakkabıyı destekliyor (`productType: ayakkabi | cizme`, `footLength/footWidth/footGirth/calf`, `widthLetter`, `unit: mm`); 11 marka tablosu (New Balance ×4, Clarks ×2, ECCO, Skechers ×2 çevirme, DuoBoots, Simply Be). Açık: araştırma §7 (Türk satıcılarda ürün bazında numara doğrulaması, Greyder aralığı, Türk markalarında cm/baldır tablosu, NB/Skechers TR genişlik satışı, NHS ödem sayfası).

## Oturum 1 sonu durumu (2026-10-07, akşam)
- Beden migrasyonu TAMAM (v2, lokal; qa yeşil 85 passed) – henüz canlı değil.
- Vercel: sahibi Pro'ya geçti; yine de toplu yayın kuralı geçerli (CLAUDE.md). `vercel.json ignoreCommand` lokal commit'te.
- Paralel çalışanlar (v2'ye commit eder, push etmez): ayakkabı bölümü (rota + içerik), kadın 2. dalga A (tayt, etek, bluz, tunik, tesettür, sweatshirt + tişört/oversize), kadın 2. dalga B (ceket, mont, kaban, iç giyim + sütyen/set/külot, ev giyimi, mayo-haşema, spor), erkek 2. dalga (polo, eşofman, sweatshirt, takım elbise + düğün, şort/deniz şortu, spor, iç giyim + boxer).
- Hepsi bitince: `npm run qa` yeşil → TEK push → PR v2→main → merge → canlı smoke test (sitemap URL'leri 200).
- Açık karar: `kadin-harf-numara-markalara-gore` dönüşüm tablosu kalsın mı (şimdilik kaldı).

## 2026-10-09 – Kardeş siteye taşıma (v2, lokal commit; PUSH EDİLMEDİ)
Strateji: .net öğretir, buyuk-beden.com marka / nereden alınır / karşılaştırma sahibidir. 5 alışveriş rehberi silindi ve 308 ile .com'a yönlendirildi: `src/lib/external-redirects.ts` (next.config.ts redirects'e eklenir; build-content kaynak yolun yeniden yayımlanmasını engeller; tests/seo.spec.ts 308 + Location doğrular). İç linkler .net eğitim sayfalarına (`/kadin/giyim/elbise/52-beden`, `/erkek/giyim/tisort/4xl`, `/markalar`, `markalar-arasi-beden-farki`) ya da doğal cümleyle "kardeş sitemiz buyuk-beden.com" dış linkine çevrildi. Sonraki toplu yayına girer. Açık soru (sahibine): .net'in kendi `/markalar` dizini, `/marka/*` profilleri, `{% marka-filtresi %}` CTA'sı ve Beden Bulucu'nun marka önerisi .com ile çakışıyor mu?

## SAHİBİ KARARI (2026-10-09): veri sorumlusu (şirket olacak) ve sosyal medya klasörü EN SONA bırakıldı – hatırlatma yapma, proje sonunda ele al.

## 2026-10-09 – Saatlik dalga YAYINDA (PR #12): 7 nasıl seçilir rehberi (boş hub'lar), 8 yeni kombin. Not: `docs/sosyal-medya/` klasörü başka bir oturumdan geldi, commit edilmedi (sahibine soruldu).

## 2026-10-08 – IndexNow YAYINDA (PR #11)
Anahtar `public/5a3db966ab96c7215ed5bc55d65c8c1c.txt` (silme), `scripts/indexnow.mjs`, `.github/workflows/indexnow.yml` (main yayınından 4 dk sonra 241 URL'yi Bing/Yandex'e bildirir). İlk Action 403 aldı (anahtar yeni, doğrulama gecikmesi); elle tekrar gönderim 200 – sonraki çalıştırmalar normal olmalı. Sahibinden beklenen: GSC'de 10 sayfa için "Dizine eklenmesini iste", Bing Webmaster (GSC'den içe aktar), Yandex Webmaster doğrulama kodu (bana gönderecek → siteye eklenecek), sosyal profil linkleri.

## 2026-10-08 – 6. dalga YAYINDA (PR #10): Beden Bulucu sayfası + ana sayfa bandı, marka özet kartı, /markalar filtresi + CTA, kategori markaları, yeni şemalar, 5XL/6XL/54–56 sayfaları, alt metinler, BigBang yayın sorumlusu.

## (eski) 6. dalga planı
Spec: `docs/seo-analizi-2026-10-08.md`. Paralel: (1) platform – Beden Bulucu ana ürün + güven seviyesi/uyarı/aksiyonlar, marka özet kartı + kategori bazlı beden + changelog, /markalar beden/cinsiyet filtresi + `{% marka-filtresi %}` CTA, ana sayfa meta, kategori hub'larında doğrulanmış markalar, schema (WebPage/ProfilePage about, CollectionPage, WebApplication); (2) içerik – 5XL/6XL, 54–56 beden sayfaları, niyet ayrıştırma, rapor anahtar kelimeleri, alt metinler. Bitince qa → tek PR → canlı kontrol.
Karar (sahibi): editoryal sorumlu **BigBang** (takma ad, kurucu ve yayın sorumlusu) – `content/yazarlar/bigbang.yaml` eklendi. YAPILACAK (agent'lar bitince): tüm belgelere `reviewedBy: bigbang`, bylline'da 'Kontrol eden: BigBang' görünürlüğü, /editoryal-ilkeler ve /hakkimizda'da yayın sorumlusu bölümü, Organization/Person JSON-LD (takma ad olduğu şeffaf).

## BEKLEME (2026-10-08): Search Console indeks verisi bekleniyor
Sahibiyle anlaşma: indeks sayısı ve ilk arama verisi gelince devam. Sahibi Search Console'dan şunları paylaşacak: Sayfa sayısı (dizine eklenen/eklenmeyen + nedenleri), Site haritaları durumu, Performans (sorgular, gösterim, tıklama, ortalama konum). Gelince: dizine eklenmeyen sayfaların nedenlerini düzelt, gösterim alan ama tıklanmayan sayfaların title/description'ını iyileştir, 4–20. sıradaki sorgular için içerik güçlendir. Bu arada hatırlat: veri sorumlusu bilgisi, API anahtarı yenileme, onay bekleyenler (Keystatic prod, legacy/ silme, logolar, erkek hero).

## 2026-10-08 – 5. dalga YAYINDA (PR #9): rakip SEO analizi uygulandı, 18 sayfa güncellendi, 3 yeni rehber; validate Türkiye saatine göre.

## (eski) 5. dalga planı
Sahibi: "ilk 20 siteyi araştır, SEO'larını al". Kopya YOK (kopya içerik + telif) – yapı/kelime/eksik konu analizi, kendi metnimizle uygulama. Agent: `docs/rakip-seo-analizi.md` yazar, eşlenen sayfaların title/description/H2/SSS'ini günceller, gerekirse yeni boşluk sayfaları açar, qa yeşil, v2'ye commit. Sonra: tek PR → canlı kontrol.
- **Durum (2026-10-08):** analiz `docs/rakip-seo-analizi.md` yazıldı (21 site sayfası incelendi, 15 baş terim). 18 sayfanın title/description/SSS'i güncellendi; 3 yeni sayfa: `/kadin/stil/nasil-giyinmeli`, `/kadin/kombinler/tesettur`, `/rehberler/buyuk-gelen-kiyafet-nasil-kucultulur`. v2'ye commit edildi, **push edilmedi**. Not: validate tarih kontrolü UTC kullanıyor; TR saatiyle gece yarısından sonra `updatedAt` bugünün tarihi verilirse "gelecekte" hatası verir.

## 2026-10-08 – 4. dalga YAYINDA (PR #8): 14 yeni marka, toptan hub + Merter/Laleli; 233 URL hepsi 200.

## (eski) 4. dalga planı
Paralel: (1) ~15–25 yeni marka sayfası (content/markalar + marka listesi rehberleri); (2) toptan genişletme: /alisveris-rehberi/toptan-buyuk-beden-nereden-alinir + Merter/Laleli/Osmanbey sayfaları + doğrulanmış toptancı tabloları (tavsiye değil uyarısıyla). Bitince: qa → tek PR → canlı kontrol. Sahibi: PR'ı kendisi oluşturmayacak, ben yapıyorum.

## 2026-10-08 – 3. dalga YAYINDA (PR #7)
Canlı: 216 URL 200, /cizim/*.svg 200, canlı Lighthouse ana sayfa mobil 90/100/100/100 (LCP 3,2 s). Kişi fotoğrafları kaldırıldı, 9 marka gömmesi, trend/mevzuat/ayakkabı doğrulamaları, Vercel Analytics canlı.
Sıradaki (onay gerektirenler sahibine sorulacak): Keystatic prod, legacy/ silme, logo indirme, erkek hero yeniden üretim; veri sorumlusu bilgisi hatırlatması (10-09/10-10); ayakkabi-arastirmasi.md §7 listesini güncelle; yeni içerik dalgası fikirleri (54/56 beden, 5XL/6XL sayfaları, daha fazla kombin).

## (eski) 3. dalga planı
Sahibi kuralı: limit/oturum biterse her şey kayıtlı kalsın; "devam" denince bu nottan aynen devam.
Paralel 3 iş başlatıldı (v2'ye commit eder, push etmez):
1. **Lighthouse** – canlıda 8 sayfa ölç, src/ düzelt, rapor `docs/lighthouse.md`. Bitti mi? → `git log v2 --oneline | grep -i lighthouse`, dosya var mı.
2. **Kişi fotoğraflarını kaldır** – content/ içindeki round-1 kişi fotoğrafları (featuredImage/image/ogImage) kalkacak, çizim yedeği görünecek; AI hero'lar kalır; kullanılmayanlar `docs/gorsel-manifest.md` sonunda listelenir. Kontrol: `grep -rl "images/stok/kadin-\|images/stok/erkek-\|hero-kadin/pexels\|hero-erkek/unsplash" content`.
3. **Marka gömmeleri + kaynak doğrulama** – markalara resmi Instagram/YouTube `socialEmbeds`; trend kaynakları doğrulama; iade rehberi güncel mevzuat; büyük numara ayakkabı ürün düzeyi kontrol.
Yarım kaldıysa: `git status`, `git log origin/main..v2 --oneline`, eksik kısmı tamamla → `npm run qa` yeşil → TEK PR v2→main → canlı smoke test (sitemap URL'leri 200) → sahibine rapor.
Onay bekleyenler (yapma): Keystatic prod, legacy/ silme, logo indirme, erkek hero yeniden üretim.

## Oturum sonu – 2026-10-07 gece (yarın buradan devam)
- **Vercel Web Analytics** eklendi ve yayına alındı (PR #6): çerezsiz, `src/components/analytics/SiteAnalytics.tsx`, yalnız `VERCEL=1` iken; sorgu parametreleri silinir. Gizlilik/çerez/KVKK metinleri güncellendi. Sahibi panelde Enable etti. Ücret: Pro'da 0,03 $/1K olay (Pro kredisinden düşer); sahibi "şimdilik dursun" dedi – maliyeti izlenecek. GA4 eklenmedi (istenirse Consent Mode ile).
- **Yarın ilk iş:** (1) canlıda analitik isteğinin (`/_vercel/insights` veya benzersiz yol `/view`) gittiğini ve Vercel panelinde verinin göründüğünü doğrula; (2) Search Console sitemap durumu ("Başarılı" + ~216 keşfedilen sayfa); (3) sahibine veri sorumlusu bilgisi hatırlat; (4) sıradaki işler listesinden devam: Keystatic prod kurulumu, Lighthouse, kişi fotoğraflı eski kartları çizime çevirme, erkek hero (sahibi onaylarsa 1 görsel), marka logoları/gömmeler, kaynak doğrulamaları, legacy/ silme onayı. Sahibine API anahtarını yenilemesini hatırlat.

## YAYINDA – 2. dalga (2026-10-07 gece, PR #5, tek build)
- Canlı: 214 belge, 216 sitemap URL'si hepsi 200; kısa yönlendirmeler, llms.txt, GSC dosyası çalışıyor.
- Yayına girenler: migrasyon + Beden Bulucu + ölçü-önce kartlar, ayakkabı, kadın/erkek 2. dalga + kadın eşofman/şort/pijama, kalıp rehberleri, SEO, manken stili çizimler (GarmentCroquis, BodyTypeFigure, SizeRangeStrip), referansa göre yoğun düzen (DocVisual), 2 AI hero (Gemini, `.env.local` – git dışı; sahibi en fazla 1–2 görsel izni verdi, kullanıldı), Vercel ignoreCommand.
- Sonraki adaylar: Keystatic prod kurulumu (sahibiyle), Lighthouse, kalan kişi fotoğraflı kartların (round-1) gözden geçirilmesi, erkek hero görseli daha iri yapılı yeniden üretim (sahibi onaylarsa), veri sorumlusu bilgisi (hatırlat), trend kaynakları yeniden doğrulama, ayakkabı araştırması §7 açıkları.

## (eski) Güncel (2026-10-07 gece)
- v2'de hazır (canlı değil): migrasyon + Beden Bulucu + ölçü-önce kartlar, ayakkabı, kadın 2A+2B, erkek 2. dalga, kalıp rehberleri (FitSilhouette), SEO head-term düzeltmeleri + llms.txt (`docs/seo-anahtar-kelime-haritasi.md`), Vercel ignoreCommand.
- Çalışıyor: vücut tipi figürleri (yeni stil, `docs/design/vucut-tipi-referans.jpg`) + ana sayfa bölümü; 2. stok fotoğraf turu (sahibi onayladı).
- SIRADA: **Düzen düzeltmesi** – sahibi "site referansa göre boş" dedi: giyim hub hero'su (sol metin/sağ foto, kompakt), kategori ızgarası hemen altta 5 sütun fotoğraflı, kısa cevap/uzun intro ızgara altına; hiçbir kart görselsiz değil (foto yoksa pastel zeminli manken stili çizim); makale: sol görsel + sağ "Bu Yazıda"; ana sayfa yoğunluğu ve sıra referansa göre. Vücut tipi agent'ı bitince başlat. Sonra fotoğrafları içeriğe bağla.
- Ardından: tam `npm run qa` → TEK yayın (PR v2→main). Vercel: 11 eski deployment silindi (sahibi onayıyla); yalnız canlı olan kaldı.
- Search Console: https mülkü doğrulandı (HTML dosyası `public/google6bca90a9930b4ada.html` – SİLME), sitemap-index.xml gönderildi ("Getirilemedi" ilk saatlerde normal; 1–2 gün sonra kontrol).
- Keystatic prod kurulumu yayından sonra (sahibi istedi).

## Sıradaki işler (öncelik sırası)
1. Yukarıdaki 1 ve 2'yi bitir, yayınla.
2. **Veri sorumlusu** bilgisi gelince (sahibi 2–3 gün içinde iletecek; **hatırlat**): `content/ayarlar/site.yaml` (editorialEmail, organization), KVKK/gizlilik metinleri, `/iletisim` yayına.
3. AI görseller: vücut tipleri (10), eksik kategoriler (kadın tayt/tunik/mont, erkek jean/hırka/sweatshirt/eşofman/takım elbise), ölçü alma, toptan pazar sokakları. Yol seçimi sahibinde (API anahtarı mı, prompt listesi mi). Prompt listesi `docs/gorsel-adaylari.md` sonunda. AI görselde `aiGenerated: true` + alt not zorunlu.
4. Sonraki dalga içerik: kadın tunik/tesettür/mayo-haşema/spor/tayt/etek/bluz/ceket/mont/kaban/iç giyim (sütyen-külot setleri), erkek polo/eşofman/sweatshirt/takım elbise/şort/iç giyim hub'ları; `/kadin/giyim/tisort/oversize`; iç giyim kümesi.
5. Marka sayfalarına tıkla-yükle Instagram/YouTube gömmeleri (bileşen hazır: ClickToLoadEmbed) ve marka logoları (indirme için sahibinden onay al).
6. Keystatic prod (GitHub App) kurulumu – sahibiyle; panel arayüzünü Türkçeleştirme.
7. Google Search Console (sahibi doğrular) + sitemap gönderimi; Lighthouse ölçümü (hedef mobil Perf>90, A11y/BP/SEO>95).
8. Validate uyarıları: anchor çeşitliliği (çok tekrar eden link metinleri), kigili "büyük beden" yoğunluğu.
9. `legacy/` klasörü: içerik taşındı, kaldırılabilir (onaylı değil – sor).
10. Trend kaynaklarının bir kısmı arama özetine dayanıyor (Vogue/WWD gövdeleri açılamadı) – yeniden doğrula.
11. Yasal kontrol: Mesafeli Sözleşmeler Yönetmeliği güncel metni (mevzuat.gov.tr) – iade rehberi.

## Site sahibinin kalıcı istekleri (CLAUDE.md'de de var)
Satış sitesi değil; kadın/erkek ayrı silo; kırık link/placeholder yok; uydurma veri yok; rakip metin/foto kopyası yok (sahibi "örnek alınmıştır" ile kullanmayı önerdi, telif riski nedeniyle reddedildi, sahibi tercihi bana bıraktı; sadece KVKK/GDPR riski olmasın dedi); **buyukbedengiyim.com sahibi açana kadar hiçbir yerde görünmez**; proporsiyon kuralı (1,50 m/150 kg vs 1,80 m/150 kg); Beden Kuralları 1–9; ayakkabı; iç giyim; ter iddiası kaynaksız → yazılmaz; responsive ve kırık link en üst öncelik; toptan pazar (Merter/Laleli/Osmanbey); AI mankenler gerçekçi; erotik görsel yok.

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
| `ayakkabi-arastirmasi.md` | (yazılıyor) büyük numara + geniş kalıp ayakkabı araştırması |
| `sahibi-bekleyenler.md` | Site sahibinden beklenenler listesi |
| `durum.md` | Teknik durum notları |

## Yapılanlar (canlıda)
- Next.js 16 SSG site, 196 statik sayfa, 159 içerik (kadın/erkek silo, 15 kategori hub'ı, beden rehberleri + 33 kaynaklı tablo, stil/vücut tipi, kombin, kumaş/bakım, 22 marka, 10 alışveriş/toptan rehberi, 3 trend, terimler sözlüğü).
- Arama (MiniSearch, Türkçe normalize), mega menüler ("Bedene göre" sütunu), kısa URL yönlendirmeleri (`/kadin/elbise` → `/kadin/giyim/elbise`, `/erkek/tshirt` …), sitemap-index + 7 grup sitemap, robots, JSON-LD (izinli tipler), Keystatic admin (`/keystatic`, yalnız local; prod GitHub bağlantısı kurulmadı).
- 50 lisanslı Pexels/Unsplash fotoğrafı (`public/images/stok`), SVG illüstrasyonlar (`src/components/illustrations`).
- `npm run qa` yeşil: validate + lint + build + Playwright (73 passed). Canlıda sitemap'teki 161 URL 200 doğrulandı.

## Devam eden (bu oturumda başlatıldı; yeni oturumda durumu kontrol et)
1. **Beden verisi migrasyonu** (`docs/beden-veri-migrasyonu.md`, CLAUDE.md "Beden Kuralları"): body/garment ayrımı, min–max aralıklar, türetilmiş karşılaştırma etiketi, kesinlik dili kontrol scripti (`scripts/check-language.ts`), 6 ay tazelik uyarısı, **Beden Bulucu**. Bir agent v2'de çalışıyordu. Kontrol: `git log --oneline v2 -15`, `git status`, `npm run qa`. Yarım kaldıysa planı tamamla. Bitince qa yeşil → PR → main.
2. **Ayakkabı:** araştırma TAMAM (`docs/ayakkabi-arastirmasi.md`, 34 kaynak; §7 açık noktalar). Migrasyon bitince içerik + rotalar: `/erkek/ayakkabi` (+ `buyuk-numara` 47+, `genis-kalip`), `/kadin/ayakkabi` (+ `buyuk-numara` 42+, `genis-kalip`, `genis-baldirli-cizme`), `/beden-rehberi/ayak-olcusu-nasil-alinir`, `/alisveris-rehberi/buyuk-numara-ayakkabi-markalari`. Taksonomi/rota: ayakkabı giyim dışı ayrı silo bölümü (`/kadin/ayakkabi`, `/erkek/ayakkabi`) – rotalar ve manifest'e eklenmeli.

## Oturum 1 sonu durumu (2026-10-07, akşam)
- Beden migrasyonu TAMAM (v2, lokal; qa yeşil 85 passed) – henüz canlı değil.
- Vercel: sahibi Pro'ya geçti; yine de toplu yayın kuralı geçerli (CLAUDE.md). `vercel.json ignoreCommand` lokal commit'te.
- Paralel çalışanlar (v2'ye commit eder, push etmez): ayakkabı bölümü (rota + içerik), kadın 2. dalga A (tayt, etek, bluz, tunik, tesettür, sweatshirt + tişört/oversize), kadın 2. dalga B (ceket, mont, kaban, iç giyim + sütyen/set/külot, ev giyimi, mayo-haşema, spor), erkek 2. dalga (polo, eşofman, sweatshirt, takım elbise + düğün, şort/deniz şortu, spor, iç giyim + boxer).
- Hepsi bitince: `npm run qa` yeşil → TEK push → PR v2→main → merge → canlı smoke test (sitemap URL'leri 200).
- Açık karar: `kadin-harf-numara-markalara-gore` dönüşüm tablosu kalsın mı (şimdilik kaldı).

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

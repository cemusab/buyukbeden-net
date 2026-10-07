@AGENTS.md

# Buyukbeden.net – Proje Kuralları

Bu dosya her oturumun başında okunur. Ana brief: `docs/brief.md` (çelişkide brief geçerli). Mimari: `docs/mimari.md`. Görsel dil: `docs/tasarim-referansi.md` (mimari §T'nin önüne geçer). İçerik planı: `docs/icerik-plani.md`. Oturum notları: `docs/durum.md`.

## Amaç
Türkiye'nin büyük beden moda, beden, stil, kombin, kumaş ve marka rehberi. **Satış sitesi değil**: sepet, fiyat, stok, ürün kartı, Product/Offer/AggregateRating schema yok. Buyukbedengiyim.com ileride ticari taraf; ona linkler yalnız doğal ve faydalıysa, `RelatedShoppingCTA` bileşeniyle ve içerikten aç/kapa edilerek. **Site sahibi açmayı söyleyene kadar Buyukbedengiyim.com sitede hiçbir yerde görünmez** (feature flag kapalı; marka listelerinde, metinlerde, linklerde yok).

## İçerik kapsamı (site sahibinin özel isteği)
- Türkiye'deki büyük beden siteleri/markaları araştırılır (`docs/pazar-arastirmasi.md`) ve marka dizininde objektif örnek olarak yer alır; metin/fotoğraf kopyalanmaz.
- Alıcı yorumlarındaki (Trendyol vb.) ortak temalar kendi cümlemizle özetlenir; alıntı, kullanıcı adı, uydurma sayı yok.
- "Nasıl giyinmeli", "alırken nelere dikkat etmeli" rehberleri; kumaşlar (pamuk, polyester, viskon vb.), **içerik karışımları/etiket okuma, yıkama, kurutma, ütüleme ve bakım sembolleri** mutlaka kapsanır.

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

## Teknoloji
Next.js 16 App Router + TypeScript + Tailwind v4, tüm sayfalar build'de statik: `cacheComponents` açık olduğu için `dynamicParams` kullanılmaz; `(site)/layout.tsx` içinde `ensureStatic = "navigation"`, `generateStaticParams` + bilinmeyen slug için `notFound()` (bkz. mimari.md K1–K2). İçerik dosya tabanlı, zod ile doğrulanır; erişim yalnız `src/lib/content.ts` üzerinden. Dev server arka planda çalıştırılır, beklenmez.

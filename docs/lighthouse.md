# Lighthouse ölçümü (mobil) – 2026-10-08

Araç: `npx lighthouse@latest`, mobil ön ayar (simüle 4G + CPU yavaşlatma), headless Chrome.
Raporlar (JSON/HTML) oturum scratchpad'inde: `.../scratchpad/lighthouse/` (`live-*` = önce, `after{1,2,3}-*` = sonra).
"Önce" = canlı site (https://www.buyukbeden.net, tek ölçüm). "Sonra" = lokal `next start` production build, ısınma + 3 ölçümün medyanı.
Lokal ölçümde CDN/Brotli yok; canlı sayılar bir sonraki yayından sonra yeniden alınacak.

Puan sırası: Performance / Accessibility / Best Practices / SEO.

| Sayfa | Önce (canlı) | LCP önce | Sonra (lokal) | LCP sonra | HTML önce → sonra |
|---|---|---|---|---|---|
| `/` | **87** / 100 / 100 / 100 | 3,9 s | **96** / 100 / 100 / 100 | 2,7 s | 1,20 MB → 0,38 MB |
| `/kadin/giyim` | 96 / 100 / 100 / 100 | 2,6 s | 95 / 100 / 100 / 100 | 2,9 s | 1,49 MB → 0,28 MB |
| `/erkek/giyim` | 97 / 100 / 100 / 100 | 2,5 s | 96 / 100 / 100 / 100 | 2,8 s | – |
| `/kadin/giyim/elbise` | 98 / 100 / 100 / 100 | 2,3 s | 97 / 100 / 100 / 100 | 2,6 s | – → 0,25 MB |
| `/kadin/beden-rehberi/52-beden-kac-xl` | 98 / 100 / 100 / 100 | 2,3 s | 98 / 100 / 100 / 100 | 2,4 s | – |
| `/beden-rehberi` | 98 / 100 / 100 / 100 | 2,3 s | 98 / 100 / 100 / 100 | 2,4 s | – |
| `/markalar` | 99 / 100 / 100 / 100 | 2,2 s | 97 / 100 / 100 / 100 | 2,6 s | 0,18 MB (değişmedi) |
| `/kadin/stil/armut-vucut-tipi` | 99 / 100 / 100 / 100 | 2,1 s | 99 / 100 / 100 / 100 | 2,3 s | 0,52 MB → 0,25 MB |

CLS tüm sayfalarda 0, TBT ≤ 40 ms (önce ve sonra). ±2–3 puanlık farklar ölçüm gürültüsüdür (lokal sunucu, CDN yok).
Hedef (Perf > 90, A11y/BP/SEO > 95) tüm sayfalarda sağlanıyor; tek kırmızı sayfa olan ana sayfa 87 → 96.

## Bulgular (önce)
- **Ana sayfa LCP 3,9 s:** LCP öğesi mobilde alttaki erkek hero fotoğrafı; iki hero `priority` ile ön yükleniyordu ama `fetchpriority=high` yoktu.
- **Dev HTML:** kroki/vücut tipi SVG çizimleri (her biri 10–20 KB) satır içi basılıyor, aynı içerik RSC yükünde ikinci kez taşınıyordu: ana sayfa 1,2 MB, `/kadin/giyim` 1,5 MB ham HTML (~150–250 KB sıkıştırılmış). Tarayıcı önbelleğine giremiyor, her sayfada yeniden iniyordu.
- Kullanılmayan JS ~28 KB ve "legacy JS" ~14 KB yalnız Next/React çerçeve paketinde (uygulama kodu değil); render-blocking tek CSS dosyası (~15 KB, ~100 ms). Erişilebilirlik/SEO/Best Practices zaten 100.
- MiniSearch zaten yalnız arama kullanılınca yükleniyor; gereksiz `"use client"` bileşen yok (nav, arama, Beden Bulucu, gömme, analitik etkileşimli).

## Yapılanlar
1. **Kroki SVG'leri statik dosya:** `scripts/build-illustrations.tsx` (prebuild `npm run content` ve `npm run dev` içinde) 65 varyantı `public/cizim/` altına yazar (git dışı). `media/Illustration.tsx > SvgFile` dosya varsa `<img width height loading=lazy decoding=async>` basar (CLS yok, önbelleklenir), yoksa satır içi çizime düşer. Varyant/dosya adı tek yerde: `illustrations/static-files.tsx`. Metin etiketli (ölçü çizgili) figürler satır içi kalır.
2. **LCP görselleri:** Next 16'da kaldırılan `priority` yerine `preload` + `fetchPriority="high"` (ana sayfa hero'ları, makale/hub/landing hero'ları, `DocImage`); hero krokileri `loading="eager"`. Ana sayfa hero `sizes` gerçek genişliğe göre (`calc(100vw - 32px)`, ≥1240px'te 600px).
3. Erişilebilirlik korunur: dekoratif çizimler `alt=""`, anlamlı vücut tipi figürleri `alt` = önceki `<title>`; testler buna göre güncellendi + `public/cizim` dosyalarının 200 / `image/svg+xml` döndüğü test eklendi.

## Açık / sonraki adaylar
- `experimental.inlineCss` (render-blocking CSS ~100 ms) denenebilir; deneysel olduğu ve her HTML'i büyüttüğü için eklenmedi.
- Mega menü HTML'i (~40 KB ham) her sayfada; gerekirse alt menüler istek üzerine yüklenebilir.
- Canlı ölçüm yayından sonra tekrarlanmalı (aynı 8 sayfa).

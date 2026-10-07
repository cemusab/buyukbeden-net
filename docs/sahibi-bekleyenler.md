# Site sahibinden beklenenler (yayın öncesi hatırlatma)

| # | Konu | Durum | Not |
|---|---|---|---|
| 1 | **Veri sorumlusu e-postası** (KVKK başvuru adresi) + iletişim e-postası | Bekleniyor (2026-10-07: site sahibi yeni adres açacak) | Gelince: `content/ayarlar/site.yaml > editorialEmail`, `organization.email`, `/iletisim` yayına alınır, KVKK/gizlilik metinlerine eklenir. O zamana kadar `/iletisim` yayımlanmaz ve linklenmez. |
| 2 | **Veri sorumlusu adı/unvanı** (şahıs mı, şirket mi) | Bekleniyor | KVKK aydınlatma metni için zorunlu. |
| 3 | AI görsel üretim yolu | **Karar (2026-10-07): API yok.** Vücut tipleri `docs/design/vucut-tipi-referans.jpg` tarzında SVG manken çizimleri; diğer görseller lisanslı stok veya gerçek olmayan (illüstrasyon) görseller | Prompt listesi `docs/gorsel-adaylari.md` içinde hazırlanıyor. |
| 4 | Stok fotoğraf + marka logosu indirme onayı | Liste hazırlanınca sorulacak | Pexels/Unsplash lisanslı; Unsplash+ hariç. |
| 5 | Canlıya alma (main'e merge, Vercel alan adı) | **Yayında (2026-10-07)**: https://www.buyukbeden.net | Veri sorumlusu bilgisi yayından 2–3 gün sonra gelecek; yayından sonra hatırlat. |
| 6 | Buyukbedengiyim.com bağlantılarını açma | Site sahibi söyleyene kadar kapalı | `shoppingCta.enabled: false` |
| 7 | Google Search Console doğrulama + sitemap gönderimi | **Tamam (sahibi, 2026-10-07)** | Sitemap: https://www.buyukbeden.net/sitemap-index.xml |
| 8 | Keystatic prod (GitHub App) kurulumu | Bekleniyor | Birlikte yapılacak |
| 9 | Önceki "Beden Sistemleri ve Kalıp Farkları" brief'i | Bana ulaşmadı | Gönderilirse CLAUDE.md Beden Kuralları'na eklenecek |
| 10 | Analitik (Vercel Web Analytics – çerezsiz, önerilen – veya GA4 + Consent Mode) | Karar bekleniyor | Seçilirse önce gizlilik/KVKK metni güncellenir, sonra toplu yayınla eklenir |

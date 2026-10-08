# Site sahibinden beklenenler (yayın öncesi hatırlatma)

| # | Konu | Durum | Not |
|---|---|---|---|
| 1 | **Veri sorumlusu e-postası** (KVKK başvuru adresi) + iletişim e-postası | Bekleniyor (2026-10-07: site sahibi yeni adres açacak) | Gelince: `content/ayarlar/site.yaml > editorialEmail`, `organization.email`, `/iletisim` yayına alınır, KVKK/gizlilik metinlerine eklenir. O zamana kadar `/iletisim` yayımlanmaz ve linklenmez. |
| 2 | **Veri sorumlusu adı/unvanı** (şahıs mı, şirket mi) | Bekleniyor | KVKK aydınlatma metni için zorunlu. |
| 3 | AI görsel üretim yolu | **Sonradan Gemini (Nano Banana) anahtarı verildi; en fazla 1–2 görsel izni – 2 hero kullanıldı.** Anahtar `.env.local` (git dışı); sahibine yenilemesi önerildi. Önceki karar: Vücut tipleri `docs/design/vucut-tipi-referans.jpg` tarzında SVG manken çizimleri; diğer görseller lisanslı stok veya gerçek olmayan (illüstrasyon) görseller | Prompt listesi `docs/gorsel-adaylari.md` içinde hazırlanıyor. |
| 4 | Stok fotoğraf + marka logosu indirme onayı | Stok: onaylandı/yapıldı (kişi fotoğrafları sonra kaldırıldı). **Logo: onay bekleniyor** | Pexels/Unsplash lisanslı; Unsplash+ hariç. |
| 5 | Canlıya alma (main'e merge, Vercel alan adı) | **Yayında (2026-10-07)**: https://www.buyukbeden.net | Veri sorumlusu bilgisi yayından 2–3 gün sonra gelecek; yayından sonra hatırlat. |
| 6 | Buyukbedengiyim.com bağlantılarını açma | Site sahibi söyleyene kadar kapalı | `shoppingCta.enabled: false` |
| 7 | Google Search Console doğrulama + sitemap gönderimi | **Tamam (sahibi, 2026-10-07)** | Sitemap: https://www.buyukbeden.net/sitemap-index.xml |
| 8 | Keystatic prod (GitHub App) kurulumu | Bekleniyor | Birlikte yapılacak |
| 9 | Önceki "Beden Sistemleri ve Kalıp Farkları" brief'i | Bana ulaşmadı | Gönderilirse CLAUDE.md Beden Kuralları'na eklenecek |
| 10 | Analitik | **Tamam (2026-10-07): Vercel Web Analytics** (çerezsiz, yasal metinler güncellendi). Ücret Pro kredisinden; sahibi "şimdilik dursun" dedi | GA4 istenirse Consent Mode ile eklenir |
| 11 | Editoryal sorumlu | **Tamam: BigBang** (kurucu, takma ad) – `content/yazarlar/bigbang.yaml`, varsayılan yayın sorumlusu | Gerçek ad istenirse tek satır |
| 12 | `legacy/` silme, erkek hero yeniden üretim | Onay bekleniyor | |

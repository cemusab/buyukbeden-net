# Site sahibinden beklenenler (yayın öncesi hatırlatma)

| # | Konu | Durum | Not |
|---|---|---|---|
| 1 | **Veri sorumlusu e-postası** (KVKK başvuru adresi) + iletişim e-postası | Bekleniyor (2026-10-07: site sahibi yeni adres açacak) | Gelince: `content/ayarlar/site.yaml > editorialEmail`, `organization.email`, `/iletisim` yayına alınır, KVKK/gizlilik metinlerine eklenir. O zamana kadar `/iletisim` yayımlanmaz ve linklenmez. |
| 2 | **Veri sorumlusu adı/unvanı** (şahıs mı, şirket mi) | Bekleniyor | KVKK aydınlatma metni için zorunlu. |
| 3 | AI görsel üretim yolu (API anahtarı mı, prompt listesiyle elle üretim mi) | Bekleniyor | Prompt listesi `docs/gorsel-adaylari.md` içinde hazırlanıyor. |
| 4 | Stok fotoğraf + marka logosu indirme onayı | Liste hazırlanınca sorulacak | Pexels/Unsplash lisanslı; Unsplash+ hariç. |
| 5 | Canlıya alma (main'e merge, Vercel alan adı) | **Onaylandı (2026-10-07)**: `npm run qa` yeşil olunca yayına alınır | Veri sorumlusu bilgisi yayından 2–3 gün sonra gelecek; yayından sonra hatırlat. |
| 6 | Buyukbedengiyim.com bağlantılarını açma | Site sahibi söyleyene kadar kapalı | `shoppingCta.enabled: false` |

# Kardeş site talepleri (buyuk-beden.com → buyukbeden.net)

buyuk-beden.com oturumunun buyukbeden.net'te gerektirdiği değişikliklerin kaydı. Kural (koordinasyon brief'i, 2026-10-09): buyuk-beden.com bu repoya doğrudan commit atmaz; değişiklik site sahibinin onayıyla ayrı dalda yapılır, PR açılır ve **birleştirilmez** – buyukbeden.net oturumu inceleyip kendi toplu yayınıyla alır. Her talep tarih, gerekçe ve PR linkiyle buraya yazılır.

## 2026-10-09 – 5 marka / nereden alınır rehberinin buyuk-beden.com'a taşınması

- **Commit:** `38ac211` "Kardeş siteye taşıma: 5 marka/nereden alınır rehberi buyuk-beden.com'a 308" (v2 dalında; [PR #12](https://github.com/cemusab/buyukbeden-net/pull/12) ile main'e alındı, canlıda).
- **Gerekçe:** İçerik iş bölümü. Bu beş sayfa "nereden alınır / marka listesi" niyetindeydi; o niyet buyuk-beden.com'un konusu. Aynı aramada iki sitenin yarışmasını (anahtar kelime yamyamlığı) önlemek için .net'teki kopyalar kaldırıldı, adresler kalıcı yönlendirmeyle buyuk-beden.com'daki karşılıklarına bağlandı. buyukbeden.net beden, ölçü, tablo ve stil konularında kaldı.
- **Yönlendirmeler (308, `src/lib/external-redirects.ts`):**

  | buyukbeden.net (eski) | buyuk-beden.com (hedef) |
  |---|---|
  | /alisveris-rehberi/52-beden-elbise-nereden-alinir | /kadin/nereden-alinir/52-beden-elbise |
  | /alisveris-rehberi/4xl-erkek-tisort-nereden-alinir | /erkek/nereden-alinir/4xl-tisort |
  | /alisveris-rehberi/kadin-giyim-markalari | /kadin/markalar |
  | /alisveris-rehberi/erkek-giyim-markalari | /erkek/markalar |
  | /alisveris-rehberi/turkiyedeki-buyuk-beden-markalari | /markalar |

- **Teknik kontrol:** hedef sayfalar yayından önce canlıda 200 dönüyordu; buyuk-beden.com'daki içerik yeniden yazıldı (birebir kopya yok); canonical'lar her sitede kendi alan adını gösterir.
- **Aynı committe .net tarafı:** silinen sayfalara giden iç linkler .net eğitim sayfalarına ya da buyuk-beden.com'a çevrildi; dış yönlendirme kaynağının yayımlı sayfa/iç yönlendirmeyle çakışmasını engelleyen build kontrolü ve 308 + Location testi eklendi.

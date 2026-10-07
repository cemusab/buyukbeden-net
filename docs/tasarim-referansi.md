# Tasarım referansı (site sahibinin paylaştığı görsel, 2026-10-07)

Görsel: `docs/design/reference.webp` (içindeki fotoğraflar, tarih ve rakamlar örnektir).

Site sahibi 8 ekranlık bir referans mockup paylaştı. **Bu belge mimari.md §T'nin önüne geçer** (görsel dil burada tanımlanır; puan/rakam/fotoğraflar örnektir, birebir kopyalanmaz).

## Genel dil
- **Beyaz, ferah, temiz.** Zemin saf beyaz / çok açık gri (#F7F7F8 civarı bölüm zemini). Kartlar beyaz, ince gri kenarlık veya hafif gölge, köşe ~8–12px.
- **Tipografi: modern grotesk sans** (başlıklar kalın/semibold sans, serif yok). Öneri: başlık + gövde aynı aile (ör. Inter / Manrope / Plus Jakarta Sans, `latin-ext`). Logo metni "buyukbeden.net" küçük harf, kalın; altında "Türkiye'nin Büyük Beden Moda ve Stil Rehberi" küçük gri.
- **Birincil renk: koyu lacivert** (#1F3A68 civarı) – birincil buton ("Detaylı Rehber →"), aktif sekme (Kadın/Erkek toggle). Metin neredeyse siyah (#111).
- **Kategori etiketleri (eyebrow) küçük renkli rozet**: "KADIN · STİL", "BEDEN REHBERİ", "ERKEK · STİL", "KUMAŞ REHBERİ" – her içerik tipi için farklı pastel tonlu küçük etiket (pembe/mor/mavi/yeşil tonları yalnız bu küçük rozetlerde; zemin olarak değil).
- Kadın = pembe / erkek = mavi klişesi **zemin ve ana renklerde kullanılmaz**; ayrım navigasyon, etiket ve hero başlığıyla.

## Header
Sol logo + slogan; ortada/sağda arama kutusu ("Ara..."); sağda ikonlar (favori ve hesap ikonları **bizde yok** – çalışmayan özellik olmaz; yalnız arama + gerekirse menü). Altında yatay ana menü: KADIN, ERKEK, BEDEN REHBERİ, STİL, KOMBİNLER, TRENDLER, MARKALAR, ALIŞVERİŞ REHBERİ, KUMAŞ REHBERİ, REHBERLER; aktif öğe altı çizili; mobilde yatay kaydırılabilir şerit + hamburger mega menü.

## Ana sayfa
1. **İki büyük yan yana hero kartı**: "Büyük Beden Kadın Giyim – Stil, konfor ve özgüven bir arada [Kadın Bölümüne Git →]" ve "Büyük Beden Erkek Giyim – Rahat, şık ve her tarza uygun [Erkek Bölümüne Git →]". Görsel üstüne beyaz metin + beyaz pill buton.
2. **İkonlu hızlı erişim şeridi** (6): Beden Rehberi (Doğru bedeni bulun), Stil Önerileri, Kombin Fikirleri, Marka Rehberi, Alışveriş Rehberi, Kumaş Rehberi – ince çizgi ikon + başlık + tek satır alt metin.
3. **Öne Çıkan İçerikler**: 4 sütun kart (görsel, renkli eyebrow, başlık, 2 satır özet).
4. **Popüler Kategoriler**: 6 küçük görsel kart (Kadın Elbise →, Kadın Pantolon →, Kadın Tişört →, Erkek Tişört →, Erkek Pantolon →, Erkek Gömlek →).
5. **Orta bant**: solda "Kadın Beden Rehberi – Doğru bedeni bulun [Bedeni Keşfet]" görsel kart, ortada "Büyük Bedenle Daha Fazlası Mümkün" manifesto metni + [Hakkımızda], sağda "Erkek Beden Rehberi" kartı.
6. **En Çok Okunan Rehberler**: 6 küçük kart şeridi. (Bizde gerçek trafik verisi olmadan "En çok okunan" denmez → "Temel Rehberler" / "Editörün Seçtikleri" başlığı.)

## Kadın / Erkek giyim hub
- Breadcrumb (Ana Sayfa › Kadın) + **geniş hero**: başlık "Kadın Giyim", alt başlık "Her bedende stil, her tarza uyum", kısa açıklama; sağda görsel. Erkekte koyu (lacivert/antrasit) hero zemin + "Erkek Giyim – Rahatlık, stil ve özgüven bir arada".
- **Kategori ızgarası**: 5 sütun (mobilde 2–3) dikey kartlar, üstte görsel, altta kategori adı (Elbise, Pantolon, Jean, Tayt, Etek, Tişört, Gömlek, Bluz, Triko, Hırka, Sweatshirt, Ceket, Mont, Kaban, Abiye, İç Giyim, Ev Giyimi; erkek: Tişört, Polo, Gömlek, Pantolon, Jean, Eşofman, Sweatshirt, Triko, Hırka, Mont, Takım Elbise). **Yalnız hub'ı yayımlanmış kategoriler kart olarak gösterilir** (çalışmayan link yok).

## İçerik (makale) sayfası
Breadcrumb (Ana Sayfa › Kadın › Beden Rehberi › 52 Beden Kaç XL?); büyük H1; tarih • okuma süresi; solda kapak görseli, sağda **"Bu Yazıda" içindekiler** (dikey çizgili adım listesi); giriş paragrafı; **H2 + karşılık tablosu** (TR / EU / UK / US / Yaklaşık XL karşılığı) – son sütun vurgulu; altında **sarımsı/bej "Not:" kutusu** ("markaya göre değişebilir, satın almadan önce markanın tablosunu kontrol edin").

## Beden rehberi sayfası
Başlık "Beden Rehberi – Doğru bedeni bulmanın en kolay yolu"; **Kadın / Erkek sekme toggle** (aktif lacivert dolu); solda tablo (TR, EU, UK, US, Göğüs cm, Bel cm, Basen cm), sağda **"Beden Ölçüsü Nasıl Alınır?" vücut silüeti çizimi** (Göğüs / Bel / Basen işaret çizgileri) + kısa açıklama + [Detaylı Rehber →].

## Markalar sayfası
"Büyük Beden Markaları"; filtre pill'leri (Tümü / Kadın Markaları / Erkek Markaları / Uluslararası Markalar); logo/isim kartları ızgarası (4 sütun). Logo yoksa marka adı tipografik kart (rakip logosu indirilmez).

## Alışveriş rehberi sayfası
"Alışveriş Rehberi – Büyük beden giyim alışverişinde bilmeniz gereken her şey"; 4 sütun görsel kart (Büyük Beden Nereden Alınır?, Online Alışverişte Nelere Dikkat Edilmeli?, Büyük Beden Mağazaları (Türkiye), İade ve Değişim Süreci).

## Görsel kuralları (bizim kısıtımız)
- Referanstaki model fotoğrafları **örnektir**. Rakip/perakendeci/stok fotoğrafı izinsiz kullanılmaz.
- V1: **özgün SVG illüstrasyonlar** – vücut tipi silüetleri (armut, elma, kum saati, dikdörtgen, ters üçgen; kadın ve erkek ayrı), ölçü alma silüeti (göğüs/bel/basen/omuz/iç bacak/kol çizgileri), kategori kartları için kıyafet çizimleri (elbise, pantolon, jean, tişört…). Tek renk çizgi + yumuşak dolgu, nötr ten/renk paleti, saygılı ve pozitif.
- Her görsel alanı CMS'ten gerçek fotoğrafla değiştirilebilir (`featuredImage`, hub `image`); fotoğraf yoksa illüstrasyon gösterilir. Kırık görsel yok.

## Vücut tipi içerikleri (site sahibinin özel vurgusu)
"Armut vücut nasıl görünür?", elma, kum saati, dikdörtgen, ters üçgen (kadın); erkekte oval/göbekli, dikdörtgen, ters üçgen, trapez. Her biri için: **silüet çizimi**, nasıl anlaşılır (omuz–bel–basen ölçü ilişkisi, ölçü bandıyla adım adım), neyi öne çıkarmak, hangi kesim/yaka/boy/kumaş, kaçınılacaklar değil "daha dengeli alternatifler" dili, kategori bazlı öneriler ve kombin linkleri. Ton saygılı; "kusur/saklamak" dili yok.

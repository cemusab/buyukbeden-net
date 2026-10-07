# Beden verisi migrasyon önerisi (CLAUDE.md "Beden Kuralları" 4–5. madde)

Durum: **site sahibi onayladı ve 2026-10-07 tarihinde uygulandı** (ayrıntı: `docs/durum.md`, biçim: `docs/icerik-format.md` §6).

## Mevcut yapı
`content/beden-tablolari/{id}.yaml` – her dosya bir tablo:
- Tablo düzeyi: `title, caption, silo, scope (genel/ust-giyim/alt-giyim/elbise/ic-giyim/gomlek/jean), kind (donusum | olcu-cm), brand?, highlightColumn, approximate, notes, inconsistencyNote?, sources[]`
- Satırlar: serbest sütunlar (`columns: {key,label,unit}`) + metin hücreleri (`rows: string[][]`, ör. `"118–122"`).
- Sorunlar: vücut/ürün ölçüsü ayrımı yalnız başlık metninde; aralıklar metin; birim sütun başına; markalar arası karşılaştırma tabloları (`*-markalara-gore`, `*-ayni-gogus-farkli-etiket`) elle yazılmış → kaynak tablolarla tutarsızlaşabilir.

## Önerilen yapı (dosya tabanlı kalır, Keystatic ile uyumlu)
```yaml
# content/beden-tablolari/kadin-lcw-elbise-vucut.yaml
title: LC Waikiki kadın büyük beden vücut ölçüleri
brand: lc-waikiki            # ref markalar (generic tabloda boş)
gender: kadin                # kadin | erkek
productType: genel           # elbise | pantolon | jean | gomlek | ceket | triko | tisort | ic-giyim | genel
countrySystem: TR            # TR | EU | UK | US | DE | harf
measurementType: body        # body | garment  (zorunlu)
sourceType: official_brand   # official_brand | manufacturer | distributor | generic
sourceUrl: https://...
unit: cm                     # kaynaktaki birim; inch ise arayüzde cm'ye çevrilir + "çeviri bizim" notu
lastVerifiedAt: 2026-10-07
fitType: regular             # opsiyonel: regular | slim | comfort | relaxed | tall | short (untersetzt)…
heightNote: "176 cm boy için"
rows:
  - numericSize: "56"
    letterSize: XXL
    chest: { min: 118, max: 118 }     # erkek; kadında bust
    waist: { min: 112, max: 112 }
    hip:   { min: 120, max: 120 }
    neck:  { min: 45, max: 46 }       # erkek gömlek
    shoulder: null
    sleeve: null
    inseam: { min: 82, max: 82 }
    waistInch: null                    # jean W
    lengthInch: null                   # jean L
    stretch: null                      # none | low | high (kaynaklı)
sources: [...]                         # mevcut Source biçimi korunur
notes: [...]
```
- **Dönüşüm tabloları** (TR↔EU↔UK↔US, harf↔numara) ayrı tür kalır: `kind: donusum`, satırlar `systems: {TR: "52", EU: "52", UK: "24", US: "20", harf: "…"}`; ölçü içermez, `measurementType` gerekmez.
- **Karşılaştırma tabloları türetilir:** `{% beden-karsilastirma gender="kadin" size="48" measurementType="body" olcu="bust" /%}` gibi bir Markdoc etiketi, aynı `measurementType`'taki marka tablolarından satırları toplayıp yan yana gösterir (her hücrede kaynağı). Elle yazılmış `*-markalara-gore.yaml` dosyaları kaldırılır.
- **Doğrulama (validate):** `min ≤ max`; satırlar bedene göre artan; `measurementType` karışmaz; erkekte `bust` yasak (chest), kadında `chest` yasak (bust); `unit: inch` ise sayfada çeviri notu; `lastVerifiedAt` > 6 ay → uyarı; `sourceType: generic` tabloda "genel/yaklaşık" notu zorunlu.
- **Kesinlik dili kontrolü:** `scripts/check-language.ts` (validate'e bağlı) içerikte "kesin olarak", "her zaman … beden", "tam olarak … denk gelir" vb. kalıpları tarar ve dosya:satır raporlar.
- **Beden Bulucu** bu satırları kullanır (CLAUDE.md Beden Kuralları 6).

## Migrasyon adımları
1. Şema: `SizeChartSchema` yeni yapıya; eski biçim için geçici dönüştürücü.
2. 33 tabloyu script ile dönüştür (`"118–122"` → `{min:118,max:122}`; tek değer → min=max; başlık/caption'dan `measurementType`, `productType`, `sourceType` çıkarımı) → **her dosya elle gözden geçirilir** (özellikle body/garment ayrımı).
3. Elle karşılaştırma tablolarını (`kadin-48/52/54-56-beden-markalara-gore`, `*-ayni-gogus-farkli-etiket`, `erkek-4xl-*`) türetilmiş etikete çevir; sayılar kaynak tablolarla birebir eşleşmeli.
4. Görünüm: `SizeChartTable` aralıkları "118–122 cm" olarak basar; ölçü türü rozeti ("Vücut ölçüsü" / "Ürün ölçüsü"), kaynak türü ve son doğrulama tarihi tablo altında.
5. Dil kontrolü + tazelik uyarısı + `npm run qa` yeşil.
6. Keystatic: tablo satırları yapılandırılmış alanlar olarak panelde düzenlenebilir hale gelir.

Tahmini süre: 1–2 saat (dönüştürme + gözden geçirme + testler).

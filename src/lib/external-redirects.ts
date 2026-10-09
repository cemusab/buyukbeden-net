/**
 * Kardeş siteye kalıcı (308) taşınan sayfalar.
 * Strateji: buyukbeden.net öğretir (beden, ölçü, stil, kumaş); marka dizini, "nereden alınır" ve
 * marka karşılaştırması buyuk-beden.com'un konusudur. Aynı içerik iki alan adında tutulmaz.
 * next.config.ts yönlendirmeleri buradan üretir; build-content.ts kaynak yolların yeniden
 * yayımlanmasını ve bu yollara iç link verilmesini engeller; tests/seo.spec.ts doğrular.
 */
export const EXTERNAL_REDIRECTS: readonly { source: string; destination: string }[] = [
  { source: "/alisveris-rehberi/52-beden-elbise-nereden-alinir", destination: "https://buyuk-beden.com/kadin/nereden-alinir/52-beden-elbise" },
  { source: "/alisveris-rehberi/4xl-erkek-tisort-nereden-alinir", destination: "https://buyuk-beden.com/erkek/nereden-alinir/4xl-tisort" },
  { source: "/alisveris-rehberi/kadin-giyim-markalari", destination: "https://buyuk-beden.com/kadin/markalar" },
  { source: "/alisveris-rehberi/erkek-giyim-markalari", destination: "https://buyuk-beden.com/erkek/markalar" },
  { source: "/alisveris-rehberi/turkiyedeki-buyuk-beden-markalari", destination: "https://buyuk-beden.com/markalar" },
];

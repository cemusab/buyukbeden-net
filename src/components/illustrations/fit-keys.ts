/**
 * Pantolon / jean / eşofman kalıp anahtarları ve Türkçe etiketleri.
 * JSX içermez: hem çizim bileşeni (fits.tsx) hem Markdoc doğrulaması
 * (src/content/markdoc.config.ts) bu dosyayı kullanır.
 */
export const FIT_KEYS = {
  kadin: [
    "mom",
    "palazzo",
    "wide-leg",
    "straight",
    "slim",
    "skinny",
    "bootcut",
    "flare",
    "boyfriend",
    "kargo",
    "jogger",
    "havuc",
    "kulot",
    "yuksek-bel",
    "normal-bel",
  ],
  erkek: ["slim", "regular", "straight", "relaxed", "comfort", "tapered", "boru-paca", "bootcut", "jogger", "kargo", "chino"],
} as const;

export type KadinFit = (typeof FIT_KEYS.kadin)[number];
export type ErkekFit = (typeof FIT_KEYS.erkek)[number];

export const FIT_LABELS: { kadin: Record<KadinFit, string>; erkek: Record<ErkekFit, string> } = {
  kadin: {
    mom: "Mom",
    palazzo: "Palazzo",
    "wide-leg": "Wide leg (bol paça)",
    straight: "Straight (düz paça)",
    slim: "Slim",
    skinny: "Skinny (dar paça)",
    bootcut: "Bootcut",
    flare: "Flare (ispanyol paça)",
    boyfriend: "Boyfriend",
    kargo: "Kargo",
    jogger: "Jogger",
    havuc: "Havuç",
    kulot: "Kulot (culotte)",
    "yuksek-bel": "Yüksek bel",
    "normal-bel": "Normal (orta) bel",
  },
  erkek: {
    slim: "Slim fit",
    regular: "Regular fit",
    straight: "Straight (düz)",
    relaxed: "Relaxed fit",
    comfort: "Comfort fit",
    tapered: "Tapered",
    "boru-paca": "Boru paça",
    bootcut: "Bootcut",
    jogger: "Jogger",
    kargo: "Kargo",
    chino: "Chino",
  },
};

/** Çizimin altına yazılan kısa ölçü özeti (bel · uyluk · paça). Editoryal, kalıbın genel tarifidir. */
export const FIT_SUMMARY: { kadin: Record<KadinFit, string>; erkek: Record<ErkekFit, string> } = {
  kadin: {
    mom: "Yüksek bel · rahat basen ve uyluk · bileğe doğru daralan paça",
    palazzo: "Yüksek bel · belden itibaren çok geniş · akışkan, geniş paça",
    "wide-leg": "Yüksek bel · basenden geniş iner · geniş paça",
    straight: "Orta–yüksek bel · dizden paçaya aynı genişlik",
    slim: "Orta bel · bacağı izler ama sarmaz · dar paça",
    skinny: "Orta–yüksek bel · bileğe kadar bacağı sarar",
    bootcut: "Orta bel · dize kadar dar · dizden hafif açılır",
    flare: "Yüksek bel · dize kadar dar · dizden belirgin açılır",
    boyfriend: "Orta–düşük bel · bol ve gevşek · kıvrılmış paça",
    kargo: "Orta bel · rahat ve düz · yan körüklü cepler",
    jogger: "Lastikli bel · rahat uyluk · ribanalı dar paça",
    havuc: "Pensli yüksek bel · geniş basen · bileğe daralan paça",
    kulot: "Yüksek bel · geniş paça · baldır ortasında biter",
    "yuksek-bel": "Bel bandı doğal bel çizgisinde oturur",
    "normal-bel": "Bel bandı doğal belin birkaç santim altında oturur",
  },
  erkek: {
    slim: "Orta bel · bacağa yakın · dar paça",
    regular: "Orta bel · dengeli uyluk · orta paça",
    straight: "Orta bel · uyluktan paçaya düz iner",
    relaxed: "Orta bel · bol oturak ve uyluk · geniş paça",
    comfort: "Yüksek bel · bol oturak ve uyluk · düz, geniş paça",
    tapered: "Orta bel · rahat uyluk · dizden paçaya daralır",
    "boru-paca": "Orta bel · uyluktan paçaya geniş ve düz",
    bootcut: "Orta bel · dize kadar düz · dizden hafif açılır",
    jogger: "Lastikli bel · rahat uyluk · ribanalı dar paça",
    kargo: "Orta bel · rahat ve düz · yan körüklü cepler",
    chino: "Orta bel · düz–hafif daralan paça · eğik ön cepler",
  },
};

export function isFitKey(silo: string, fit: string): boolean {
  if (silo !== "kadin" && silo !== "erkek") return false;
  return (FIT_KEYS[silo] as readonly string[]).includes(fit);
}

export function fitLabel(silo: string, fit: string): string | undefined {
  if (!isFitKey(silo, fit)) return undefined;
  return (FIT_LABELS[silo as "kadin"] as Record<string, string>)[fit];
}

export function fitSummary(silo: string, fit: string): string | undefined {
  if (!isFitKey(silo, fit)) return undefined;
  return (FIT_SUMMARY[silo as "kadin"] as Record<string, string>)[fit];
}

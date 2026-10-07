/** Türkçe metni URL/anchor güvenli slug'a çevirir: "Göğüs nasıl ölçülür?" → "gogus-nasil-olculur". */
export function slugifyTr(input: string): string {
  return foldTr(input)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Küçük harfe çevirip Türkçe ve aksanlı harfleri ASCII karşılığına indirger. */
export function foldTr(input: string): string {
  return input
    .replace(/İ/g, "i")
    .replace(/I/g, "ı")
    .toLocaleLowerCase("tr")
    .replace(/i̇/g, "i")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[âà]/g, "a")
    .replace(/[îì]/g, "i")
    .replace(/[ûù]/g, "u")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "");
}

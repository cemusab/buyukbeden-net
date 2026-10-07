/**
 * Kesinlik dili kontrolü (CLAUDE.md Beden Kuralları 7).
 * Beden konusunda "kesin olarak", "her zaman … bedendir", "tam olarak … denk gelir" gibi ifadeleri
 * content/ altındaki .mdoc ve .yaml dosyalarında tarar; dosya:satır raporlar (uyarı düzeyi).
 *   tsx scripts/check-language.ts        → yalnız rapor
 * `npm run validate` bunu build-content.ts içinden çağırır.
 * Doğru dil: "çoğu markada", "yaklaşık", "markaya göre değişir".
 */
import fs from "node:fs";
import path from "node:path";

/** Cümle içinde aradaki kelimeler (cümle sınırını aşmadan, en çok ~8 kelime) */
const GAP = "[^.!?;:\\n]{0,70}?";

export const LANGUAGE_RULES: { rule: string; re: RegExp }[] = [
  { rule: "kesin olarak", re: /kesin olarak/ },
  { rule: "kesin beden / kesin ölçü", re: /kesin (beden|ölçü|numara|sonuç)/ },
  { rule: "kesinlikle … beden", re: new RegExp(`kesinlikle${GAP}(beden|numara|xl\\b|ölçü)`) },
  { rule: "her zaman … beden(dir)", re: new RegExp(`her zaman${GAP}(beden(dir|e)?|numara(dır)?|xl(')?dir)\\b`) },
  { rule: "tam olarak … (bedene) denk gelir", re: new RegExp(`tam olarak${GAP}(bedene |numaraya )?denk gel`) },
  { rule: "mutlaka … beden", re: new RegExp(`mutlaka${GAP}(beden(dir|e|i)?|numara)\\b`) },
  { rule: "garantili beden", re: /garanti(li|si)?\s+(beden|uyar)/ },
  { rule: "%100 … beden", re: new RegExp(`%\\s?100${GAP}(beden|uyar|doğru)`) },
];

export type LanguageHit = { file: string; line: number; match: string; rule: string };

function walk(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(mdoc|ya?ml|md)$/.test(e.name)) out.push(p);
  }
  return out;
}

export function checkLanguage(contentDir: string): LanguageHit[] {
  const root = path.resolve(contentDir, "..");
  const hits: LanguageHit[] = [];
  for (const file of walk(contentDir)) {
    const lines = fs.readFileSync(file, "utf8").split("\n");
    lines.forEach((raw, i) => {
      // URL'ler ve kod/etiket öznitelikleri taranmaz
      const text = raw.replace(/https?:\/\/\S+/g, "").toLocaleLowerCase("tr");
      for (const { rule, re } of LANGUAGE_RULES) {
        const m = text.match(re);
        if (m) hits.push({ file: path.relative(root, file), line: i + 1, match: m[0], rule });
      }
    });
  }
  return hits;
}

if (require.main === module) {
  const dir = path.resolve(__dirname, "..", "content");
  const hits = checkLanguage(dir);
  for (const h of hits) console.log(`${h.file}:${h.line}  "${h.match}"  (${h.rule})`);
  console.log(hits.length ? `\n${hits.length} kesinlik ifadesi bulundu (uyarı).` : "Kesinlik dili bulunmadı.");
}

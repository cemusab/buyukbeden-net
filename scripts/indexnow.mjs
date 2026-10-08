// IndexNow: sitemap'teki URL'leri Bing/Yandex vb. arama motorlarına bildirir.
// Kullanım: node scripts/indexnow.mjs [--since=<git-ref>]  (since verilirse yalnız değişen içeriklerin URL'leri)
// Anahtar dosyası: public/<key>.txt (anahtar herkese açıktır, IndexNow protokolü gereği).
import fs from "node:fs";

const SITE = "https://www.buyukbeden.net";
const HOST = "www.buyukbeden.net";
const keyFile = fs.readdirSync("public").find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("public/ içinde IndexNow anahtar dosyası yok");
const key = keyFile.replace(".txt", "");

const groups = ["pages", "women", "men", "size-guides", "brands", "fabrics", "guides"];
const urls = [];
for (const g of groups) {
  const xml = await (await fetch(`${SITE}/sitemap-${g}.xml`)).text();
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push(m[1]);
}
const unique = [...new Set(urls)];
console.log(`IndexNow: ${unique.length} URL gönderiliyor`);

for (let i = 0; i < unique.length; i += 10000) {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key, keyLocation: `${SITE}/${keyFile}`, urlList: unique.slice(i, i + 10000) }),
  });
  console.log(`IndexNow yanıtı: ${res.status} ${res.statusText}`);
  if (res.status >= 400 && res.status !== 429) process.exitCode = 1;
}

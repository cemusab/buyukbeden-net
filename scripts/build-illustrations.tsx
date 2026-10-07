/**
 * Kroki/vücut tipi çizimlerini statik SVG dosyası olarak üretir (public/cizim/, git dışı).
 *   tsx scripts/build-illustrations.tsx
 * `npm run content` (prebuild) ve `npm run dev` çalıştırır. Bileşen tarafı: src/components/media/Illustration.tsx > SvgFile.
 * Dosya yoksa bileşen aynı çizimi satır içi basar; bu betik yalnız performans içindir.
 */
import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { allIlluFiles, ILLU_FILE_DIR } from "../src/components/illustrations/static-files";

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public", ILLU_FILE_DIR);

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
let bytes = 0;
const files = allIlluFiles();
for (const f of files) {
  // aria-hidden/focusable gibi sayfa içi öznitelikler dosyada gereksiz; erişilebilir ad <img alt> ile verilir.
  const svg = renderToStaticMarkup(f.render())
    .replace(/ aria-hidden="true"/, "")
    .replace(/ focusable="false"/, "")
    .replace(/(\d+\.\d{2})\d+/g, "$1");
  fs.writeFileSync(path.join(ROOT, "public", f.src), svg);
  bytes += svg.length;
}
if (!process.argv.includes("--quiet")) console.log(`[çizim] ${files.length} SVG dosyası yazıldı (${Math.round(bytes / 1024)} KB) → public/${ILLU_FILE_DIR}/`);

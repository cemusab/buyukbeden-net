/**
 * Geliştirme: içeriği üretir, content/ klasörünü izler (değişince yeniden üretir) ve `next dev`'i başlatır.
 * Arka planda çalıştırılabilir: `npm run dev > dev.log 2>&1 &`
 * İçerik hatası olursa son geçerli üretim yerinde kalır; hata terminale yazılır.
 */
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..");
const CONTENT = process.env.CONTENT_DIR ? path.resolve(process.env.CONTENT_DIR) : path.join(ROOT, "content");

function build(initial = false) {
  const t = Date.now();
  const r = spawnSync("npx", ["tsx", "scripts/build-content.ts", ...(initial ? [] : ["--quiet"])], { cwd: ROOT, stdio: "inherit", env: process.env });
  const ok = r.status === 0;
  console.log(ok ? `[içerik] üretildi (${Date.now() - t} ms)` : "[içerik] HATA – önceki üretim korunuyor");
  return ok;
}

if (!build(true) && !fs.existsSync(path.join(ROOT, "src", "generated", "content-index.json"))) {
  console.error("[içerik] Hiç geçerli üretim yok; hataları düzeltin.");
  process.exit(1);
}

let timer: NodeJS.Timeout | null = null;
fs.watch(CONTENT, { recursive: true }, () => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => build(), 250);
});

const port = process.env.PORT ?? "3000";
const next = spawn("npx", ["next", "dev", "-p", port], { cwd: ROOT, stdio: "inherit", env: process.env });
const stop = () => {
  next.kill("SIGINT");
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
next.on("exit", (code) => process.exit(code ?? 0));

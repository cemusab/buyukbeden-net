/**
 * Görsel kontrol: seçili sayfaların mobil + masaüstü ekran görüntüleri.
 *   BASE=http://localhost:3100 OUT=./shots tsx scripts/screenshots.ts [/yol ...]
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE ?? "http://localhost:3100";
const OUT = process.env.OUT ?? "shots";
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ["/", "/kadin/giyim", "/erkek/giyim", "/kadin/giyim/elbise/nasil-secilir", "/beden-rehberi"];
const sizes = (process.env.SIZES ?? "390x844,1440x900").split(",").map((s) => s.split("x").map(Number) as [number, number]);

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  for (const [w, h] of sizes) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: w < 768, hasTouch: w < 768 });
    const page = await ctx.newPage();
    for (const p of paths) {
      await page.goto(BASE + p, { waitUntil: "networkidle" });
      const name = (p === "/" ? "home" : p.slice(1).replace(/\//g, "_")) + `-${w}.png`;
      await page.screenshot({ path: path.join(OUT, name), fullPage: !process.env.VIEWPORT_ONLY });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      console.log(`${w}px ${p} → ${name}${overflow > 0 ? `  ⚠ yatay taşma ${overflow}px` : ""}`);
    }
    await ctx.close();
  }
  await browser.close();
})();

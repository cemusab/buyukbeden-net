/**
 * Kroki illüstrasyonları: vücut tipi karoları (JS'siz Kadın/Erkek seçimi), vücut tipi sayfası figürleri,
 * "Aynı kıyafet, farklı bedenler" şeridi ve kategori kartı krokileri. Erişilebilirlik: anlamlı figürler
 * role=img + Türkçe başlık, dekoratif olanlar aria-hidden.
 */
import { expect, test } from "@playwright/test";
import { manifest } from "./helpers";

const has = (p: string) => manifest.some((e) => e.path === p);

test.describe("JS kapalı", () => {
  test.use({ javaScriptEnabled: false });
  test("ana sayfa vücut tipi bölümü: Kadın/Erkek seçimi JS'siz çalışır, karolar yalnız mevcut sayfalara gider", async ({ page }) => {
    await page.goto("/");
    const sec = page.locator("[data-body-type-switch]");
    await expect(sec).toBeVisible();
    const kadin = sec.locator('[data-silo-panel="kadin"]');
    const erkek = sec.locator('[data-silo-panel="erkek"]');
    await expect(kadin).toBeVisible();
    await expect(erkek).toBeHidden();
    await sec.locator('label[for="vucut-tipi-erkek"]').click();
    await expect(erkek).toBeVisible();
    await expect(kadin).toBeHidden();
    const hrefs = await sec.locator("a").evaluateAll((as) => as.map((a) => a.getAttribute("href") ?? ""));
    expect(hrefs.length).toBeGreaterThan(4);
    for (const h of hrefs) expect(has(h), h).toBe(true);
    // karo figürleri dekoratif (link metni ad verir): satır içi SVG aria-hidden ya da statik SVG dosyası alt=""
    const figs = sec.locator("svg, img[data-illu]");
    expect(await figs.count()).toBeGreaterThan(4);
    for (const v of await figs.evaluateAll((els) => els.map((e) => (e.tagName === "IMG" ? e.getAttribute("alt") === "" : e.getAttribute("aria-hidden") === "true"))))
      expect(v).toBe(true);
  });
});

test("vücut tipi sayfası: iki figür role=img ve Türkçe başlıklı", async ({ page }) => {
  test.skip(!has("/kadin/stil/armut-vucut-tipi"), "sayfa yok");
  await page.goto("/kadin/stil/armut-vucut-tipi");
  // anlamlı figürler: satır içi SVG (role=img + title) ya da statik SVG dosyası (<img alt>)
  const figs = page.locator('article figure svg[role="img"], article figure img[data-illu][alt]:not([alt=""])');
  await expect(figs).toHaveCount(2);
  for (const t of await figs.evaluateAll((els) => els.map((e) => (e.tagName === "IMG" ? e.getAttribute("alt") : e.querySelector("title")?.textContent) ?? "")))
    expect(t).toMatch(/Armut vücut tipi çizimi/);
});

test("vücut tipleri genel sayfası: tüm tiplerin karoları", async ({ page }) => {
  for (const p of ["/kadin/stil/vucut-tipleri", "/erkek/stil/vucut-tipleri"].filter(has)) {
    await page.goto(p);
    const links = page.locator("article ul a[href*='/stil/']");
    expect(await links.count(), p).toBeGreaterThanOrEqual(4);
  }
});

test("beden şeridi: kaynaklı açıklama, kendi kabında kayar, sayfa taşmaz", async ({ page }) => {
  for (const p of ["/kadin/beden-rehberi", "/erkek/beden-rehberi"].filter(has)) {
    await page.goto(p);
    const strip = page.locator("[data-size-range-strip]");
    await expect(strip).toBeVisible();
    await expect(strip.locator("figcaption")).toContainText("İllüstrasyondur; ölçüler");
    await expect(strip.locator("figcaption")).toContainText("kişiden kişiye değişir");
    expect(await strip.locator("li").count()).toBeGreaterThanOrEqual(6);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(over, p).toBeLessThanOrEqual(0);
  }
});

test("kategori kartları varsayılan olarak kroki çizimi gösterir", async ({ page }) => {
  test.skip(!has("/kadin/giyim"), "sayfa yok");
  await page.goto("/kadin/giyim");
  const art = page.locator("main article svg[aria-hidden='true'], main article img[data-illu][alt='']");
  expect(await art.count()).toBeGreaterThan(5);
});

test("statik kroki SVG dosyaları (public/cizim) yüklenir ve boyut öznitelikleri vardır", async ({ page, request }) => {
  await page.goto("/");
  const imgs = page.locator("img[data-illu]");
  expect(await imgs.count()).toBeGreaterThan(4);
  const attrs = await imgs.evaluateAll((els) => els.map((e) => ({ src: e.getAttribute("src") ?? "", w: e.getAttribute("width"), h: e.getAttribute("height") })));
  for (const a of attrs) {
    expect(a.w && a.h, a.src).toBeTruthy();
  }
  for (const src of [...new Set(attrs.map((a) => a.src))].slice(0, 5)) {
    const res = await request.get(src);
    expect(res.status(), src).toBe(200);
    expect(res.headers()["content-type"], src).toContain("image/svg+xml");
  }
});

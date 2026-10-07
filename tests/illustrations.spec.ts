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
    // karo figürleri dekoratif (link metni ad verir)
    const svgs = sec.locator("svg");
    expect(await svgs.count()).toBeGreaterThan(4);
    for (const v of await svgs.evaluateAll((els) => els.map((e) => e.getAttribute("aria-hidden")))) expect(v).toBe("true");
  });
});

test("vücut tipi sayfası: iki figür role=img ve Türkçe başlıklı", async ({ page }) => {
  test.skip(!has("/kadin/stil/armut-vucut-tipi"), "sayfa yok");
  await page.goto("/kadin/stil/armut-vucut-tipi");
  const figs = page.locator('article figure svg[role="img"]');
  await expect(figs).toHaveCount(2);
  for (const t of await figs.evaluateAll((els) => els.map((e) => e.querySelector("title")?.textContent ?? ""))) expect(t).toMatch(/Armut vücut tipi çizimi/);
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
  const art = page.locator("main article svg[aria-hidden='true']");
  expect(await art.count()).toBeGreaterThan(5);
});

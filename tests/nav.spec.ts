import { expect, test } from "@playwright/test";
import { manifest } from "./helpers";

const has = (p: string) => manifest.some((e) => e.path === p);

test("masaüstü: Kadın/Erkek mega menü klavye ile açılır, Escape kapatır, linkleri manifest'te", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "masaüstü");
  await page.goto("/");
  for (const silo of ["kadin", "erkek"]) {
    if (!has(`/${silo}`)) continue;
    const btn = page.locator(`[data-mega-btn="${silo}"]`);
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await btn.focus();
    await page.keyboard.press("Enter");
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    const panel = page.locator(`#mega-${silo}`);
    await expect(panel).toBeVisible();
    const hrefs = await panel.locator("a").evaluateAll((as) => as.map((a) => new URL((a as HTMLAnchorElement).href).pathname));
    expect(hrefs.length).toBeGreaterThan(1);
    for (const h of hrefs) expect(has(h), `mega menü linki ${h}`).toBe(true);
    // Silo karışmaz: kadın menüsünde erkek linki yok (ve tersi)
    const other = silo === "kadin" ? "/erkek" : "/kadin";
    expect(hrefs.some((h) => h.startsWith(other + "/") || h === other)).toBe(false);
    await page.keyboard.press("Escape");
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toBeHidden();
    await expect(btn).toBeFocused();
  }
});

test("masaüstü: hover ile açılır, aktif silo işaretlenir", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "masaüstü");
  test.skip(!has("/kadin/giyim"), "içerik yok");
  await page.goto("/kadin/giyim");
  await page.locator('nav[aria-label="Ana menü"] a[href="/kadin"]').first().hover();
  await expect(page.locator("#mega-kadin")).toBeVisible();
  await expect(page.locator('nav[aria-label="Ana menü"] a[href="/kadin"]').first()).toHaveClass(/text-primary/);
});

test("mobil: çekmece menü açılır, akordeon çalışır, Escape kapatır, sayfa kaymaz", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "mobil");
  await page.goto("/");
  const open = page.getByRole("button", { name: "Menüyü aç" });
  await open.click();
  const dlg = page.locator("dialog#mobil-menu");
  await expect(dlg).toBeVisible();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe("hidden");
  const kadin = dlg.locator('details[data-mobile-mega="kadin"]');
  if (await kadin.count()) {
    await kadin.locator("summary").click();
    await expect(kadin.locator("a").first()).toBeVisible();
    const hrefs = await kadin.locator("a").evaluateAll((as) => as.map((a) => new URL((a as HTMLAnchorElement).href).pathname));
    for (const h of hrefs) expect(has(h), h).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dlg).toBeHidden();
  await expect(open).toBeFocused();
  // Menüden gezinme
  await open.click();
  const first = dlg.locator("nav a").first();
  const href = await first.getAttribute("href");
  await dlg.locator('a[href="/beden-rehberi"]').first().click().catch(async () => first.click());
  await expect(dlg).toBeHidden();
  expect(href).toBeTruthy();
});

test("mobil: ana menü şeridi yatay kaydırılır ve sayfayı taşırmaz", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "mobil");
  await page.goto("/");
  const strip = page.locator('nav[aria-label="Bölümler"]');
  await expect(strip).toBeVisible();
  const { sw, cw } = await strip.evaluate((el) => ({ sw: el.scrollWidth, cw: el.clientWidth }));
  expect(sw).toBeGreaterThan(cw);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

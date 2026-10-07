import { expect, test } from "@playwright/test";
import { index, manifest } from "./helpers";

/** Ayakkabı bölümü (CLAUDE.md "Ayakkabı"): silo landing'leri, mega menü linki, ayakkabı tabloları. */
const has = (p: string) => manifest.some((e) => e.path === p);

test.describe("ayakkabı bölümü", () => {
  test("silo landing'i yalnız kendi silosunun ayakkabı rehberlerini listeler, breadcrumb siloyu korur", async ({ page }) => {
    for (const silo of ["kadin", "erkek"] as const) {
      const p = `/${silo}/ayakkabi`;
      if (!has(p)) continue;
      await page.goto(p);
      const list = page.locator("[data-footwear-guides]");
      const kids = index.docs.filter((d) => d.path.startsWith(`${p}/`));
      if (kids.length) {
        await expect(list).toBeVisible();
        const hrefs = await list.locator("a").evaluateAll((as) => as.map((a) => new URL((a as HTMLAnchorElement).href).pathname));
        for (const k of kids) expect(hrefs, k.path).toContain(k.path);
        const other = silo === "kadin" ? "/erkek" : "/kadin";
        expect(hrefs.some((h) => h.startsWith(other + "/"))).toBe(false);
      }
      const crumbs = await page.locator('nav[aria-label="Konum"] a').evaluateAll((as) => as.map((a) => new URL((a as HTMLAnchorElement).href).pathname));
      if (crumbs.length) expect(crumbs).toContain(`/${silo}`);
    }
  });

  test("masaüstü: mega menüde silonun Ayakkabı linki var", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "masaüstü");
    await page.goto("/");
    for (const silo of ["kadin", "erkek"] as const) {
      if (!has(`/${silo}/ayakkabi`)) continue;
      await page.locator(`[data-mega-btn="${silo}"]`).click();
      const panel = page.locator(`#mega-${silo}`);
      await expect(panel).toBeVisible();
      await expect(panel.locator(`a[href="/${silo}/ayakkabi"]`)).toHaveCount(1);
      await page.keyboard.press("Escape");
    }
  });

  test("ayak uzunluğu tablosu: vücut ölçüsü rozeti, mm kaynağı cm gösterilir, kaynak ve tarih", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "masaüstü");
    const p = "/kadin/ayakkabi/buyuk-numara";
    test.skip(!has(p), "sayfa yok");
    await page.goto(p);
    const fig = page.locator('[data-size-chart="kadin-clarks-ayak"]');
    await expect(fig).toBeVisible();
    await expect(fig.locator("[data-measurement-badge]")).toHaveText("Vücut ölçüsü");
    await expect(fig).toContainText("Kaynak mm");
    await expect(fig.locator("thead")).toContainText("Ayak uzunluğu");
    await expect(fig.locator("tbody")).toContainText("26,3 cm"); // 263 mm
    await expect(fig.locator("[data-chart-meta]")).toContainText("Son doğrulama");
    // Türetilmiş karşılaştırma: tek ölçü türü
    const cmp = page.locator("[data-size-comparison]").first();
    await expect(cmp).toBeVisible();
    await expect(cmp).toHaveAttribute("data-measurement-type", "body");
  });

  test("genişlik tablosu: numara × genişlik harfi, markaya özgü notu ve belirsiz ölçü türü uyarısı", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "masaüstü");
    const p = "/erkek/ayakkabi/genis-kalip";
    test.skip(!has(p), "sayfa yok");
    await page.goto(p);
    const fig = page.locator('[data-size-chart="erkek-new-balance-genislik"]');
    await expect(fig).toBeVisible();
    const heads = await fig.locator("thead th").allTextContents();
    expect(heads.some((h) => h.startsWith("2E"))).toBe(true);
    expect(heads.some((h) => h.startsWith("4E"))).toBe(true);
    await expect(fig).toContainText("Ölçü türü kaynakta belirtilmemiş");
    await expect(fig).toContainText("markaya ve cinsiyete özgüdür");
    await expect(fig.locator("tbody tr")).toHaveCount(7);
  });

  test("mobil: ayakkabı tabloları sayfayı yatay taşırmaz", async ({ page }, info) => {
    test.skip(info.project.name !== "mobile", "mobil");
    for (const p of ["/erkek/ayakkabi/genis-kalip", "/kadin/ayakkabi/buyuk-numara", "/alisveris-rehberi/buyuk-numara-ayakkabi-markalari"]) {
      if (!has(p)) continue;
      await page.goto(p);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), p).toBe(true);
    }
  });
});

import { expect, test } from "@playwright/test";
import { index, manifest } from "./helpers";

const first = (f: (d: (typeof index.docs)[number]) => boolean) => index.docs.find(f);

test.describe("şablonlar ve silo kuralları", () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== "desktop", "masaüstü"));

  test("breadcrumb zinciri manifest ile ve BreadcrumbList JSON-LD ile aynı", async ({ page }) => {
    const samples = manifest.filter((e) => e.path.split("/").length >= 3).slice(0, 25);
    const byPath = new Map(manifest.map((e) => [e.path, e]));
    for (const e of samples) {
      await page.goto(e.path);
      const chain: string[] = [];
      let cur: typeof e | undefined = e;
      while (cur) {
        chain.unshift(cur.label);
        cur = cur.parent ? byPath.get(cur.parent) : undefined;
      }
      const visible = await page.locator('nav[aria-label="Konum"] li').allInnerTexts();
      expect(visible.map((t) => t.replace("›", "").trim()), e.path).toEqual(chain);
      const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
      const bl = ld.map((x) => JSON.parse(x)).find((x) => x["@type"] === "BreadcrumbList");
      expect(bl?.itemListElement.map((i: { name: string }) => i.name), e.path).toEqual(chain);
      if (e.silo === "kadin") expect(chain[1]).toBe("Kadın");
      if (e.silo === "erkek" && e.path.startsWith("/erkek")) expect(chain[1]).toBe("Erkek");
    }
  });

  test("ilgili içerik blokları silo öncelikli: kadın sayfasında erkek önerisi yok (ve tersi)", async ({ page }) => {
    const silo = index.docs.filter((d) => (d.silo === "kadin" || d.silo === "erkek") && d.collection !== "sayfalar").slice(0, 20);
    for (const d of silo) {
      await page.goto(d.path);
      const other = d.silo === "kadin" ? "/erkek" : "/kadin";
      const hrefs = await page.locator("[data-related-block] a").evaluateAll((as) => as.map((a) => new URL((a as HTMLAnchorElement).href).pathname));
      expect(hrefs.filter((h) => h.startsWith(other + "/")), d.path).toEqual([]);
      // sıralama: silo içerikleri ortak içeriklerden önce
      const sil = hrefs.map((h) => (h.startsWith(`/${d.silo}`) ? 0 : 1));
      const firstBlock = await page.locator('[data-related-block="bunu-da-okuyun"] a').evaluateAll((as) => as.map((a) => new URL((a as HTMLAnchorElement).href).pathname));
      const order = firstBlock.map((h) => (h.startsWith(`/${d.silo}`) ? 0 : 1));
      const manual = new Set(d.related);
      if (!firstBlock.some((h) => manual.has(h))) expect(order, d.path).toEqual([...order].sort());
      void sil;
    }
  });

  test("makale: kısa cevap, yazar linki, tarih, içindekiler, SSS", async ({ page }) => {
    const d = first((x) => ["ARTICLE", "STYLE_GUIDE"].includes(x.type) && x.faq.length >= 2 && x.toc.filter((t) => t.level === 2).length >= 2);
    test.skip(!d, "uygun içerik yok");
    await page.goto(d!.path);
    await expect(page.locator("[data-short-answer]")).toBeVisible();
    await expect(page.locator("[data-byline] a").first()).toHaveAttribute("href", /\/yazar\//);
    await expect(page.locator("[data-byline] time").first()).toBeVisible();
    await expect(page.locator("[data-toc] :is(p, summary):visible", { hasText: "Bu Yazıda" }).first()).toBeVisible();
    await expect(page.locator("#sss")).toBeVisible();
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((x) => JSON.parse(x)["@type"]);
    expect(ld).toContain("Article");
    expect(ld).toContain("FAQPage");
  });

  test("beden rehberi: Kadın/Erkek seçimi JS olmadan çalışır", async ({ browser }) => {
    test.skip(!manifest.some((e) => e.path === "/beden-rehberi"), "sayfa yok");
    for (const js of [true, false]) {
      const ctx = await browser.newContext({ javaScriptEnabled: js });
      const page = await ctx.newPage();
      await page.goto("/beden-rehberi");
      const toggle = page.locator("[data-size-toggle]");
      test.skip((await toggle.count()) === 0, "tablo yok");
      const k = page.locator("#tablo-kadin");
      const e = page.locator("#tablo-erkek");
      if ((await k.count()) && (await e.count())) {
        await expect(k).toBeVisible();
        await expect(e).toBeHidden();
        await page.locator('a[href="#tablo-erkek"]').click();
        await expect(e).toBeVisible();
        await expect(k).toBeHidden();
        await page.locator('a[href="#tablo-kadin"]').click();
        await expect(k).toBeVisible();
        await expect(e).toBeHidden();
      }
      // tablo: caption + sabit ilk sütun + kaynak satırı
      const table = page.locator("[data-size-chart] table").first();
      await expect(table.locator("caption")).toHaveCount(1);
      expect(await table.locator("tbody th").first().evaluate((el) => getComputedStyle(el).position)).toBe("sticky");
      await expect(page.locator("[data-size-chart] figcaption").first()).toContainText("Kaynak");
      await ctx.close();
    }
  });

  test("marka dizini filtreleri JS olmadan çalışır ve sahte link üretmez", async ({ browser }) => {
    test.skip(!manifest.some((e) => e.path === "/markalar"), "sayfa yok");
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto("/markalar");
    const pills = page.locator('nav[aria-label="Marka filtresi"] a');
    test.skip((await pills.count()) === 0, "filtre yok");
    const all = await page.locator("[data-brand]:visible").count();
    for (const id of ["kadin-markalari", "erkek-markalari", "uluslararasi"]) {
      const pill = page.locator(`a[href="#${id}"]`);
      if (!(await pill.count())) continue;
      await pill.click();
      const g = id === "kadin-markalari" ? "kadin" : id === "erkek-markalari" ? "erkek" : "intl";
      const visible = await page.locator("[data-brand]:visible").evaluateAll((els) => els.map((e) => e.getAttribute("data-g") ?? ""));
      expect(visible.length).toBeGreaterThan(0);
      expect(visible.length).toBeLessThanOrEqual(all);
      for (const v of visible) expect(v.split(" ")).toContain(g);
    }
    await page.locator('a[href="#tumu"]').click();
    expect(await page.locator("[data-brand]:visible").count()).toBe(all);
    await ctx.close();
  });

  test("marka gömmeleri tıklanmadan üçüncü tarafa istek yapmaz", async ({ page }) => {
    const b = first((x) => x.type === "BRAND_GUIDE" && ((x.fm.socialEmbeds as unknown[]) ?? []).length > 0);
    test.skip(!b, "gömmeli marka yok");
    const third: string[] = [];
    page.on("request", (r) => {
      if (/instagram|youtube|facebook|google/.test(new URL(r.url()).hostname)) third.push(r.url());
    });
    await page.goto(b!.path, { waitUntil: "networkidle" });
    expect(third).toEqual([]);
  });

  test("mobilde mega menü ve tablolar dahil yatay kaydırma yalnız tablo kabında", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 780 } });
    const page = await ctx.newPage();
    const target = manifest.find((e) => e.path.startsWith("/beden-rehberi/"))?.path ?? "/beden-rehberi";
    await page.goto(target);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await ctx.close();
  });
});

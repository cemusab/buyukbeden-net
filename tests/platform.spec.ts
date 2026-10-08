/**
 * Beden ve marka keşif platformu (docs/seo-analizi-2026-10-08.md P0 1–4, P1 5, P2 8):
 * Beden Bulucu sonuç kanıtı + aksiyonlar, marka özet kartı, /markalar beden filtresi (JS ve JS'siz),
 * {% marka-filtresi %} CTA'sı, kategori bloğu, schema ve yayın sorumlusu.
 */
import { expect, test, type Page } from "@playwright/test";
import { index, manifest } from "./helpers";

const has = (p: string) => manifest.some((e) => e.path === p);
const ldOf = async (page: Page) => (await page.locator('script[type="application/ld+json"]').allTextContents()).map((x) => JSON.parse(x));
const noOverflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
const WARNING = "Bu sonuç markanın genel beden tablosuna dayanır; her ürün ve kategori aynı beden aralığını sunmayabilir.";

test.describe("Beden Bulucu ana ürün", () => {
  test.beforeEach(() => test.skip(!has("/beden-bulucu"), "sayfa yok"));

  test("ana sayfada ilk ekranda 'Bedenimi Bul' ve yeni meta açıklaması; 'satış yapmaz' sayfada görünür", async ({ page }) => {
    await page.goto("/");
    const cta = page.locator("[data-bedenimi-bul]").getByRole("link", { name: /Bedenimi Bul/ });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/beden-bulucu");
    const box = await cta.boundingBox();
    expect(box!.y + box!.height, "ilk ekranda").toBeLessThan(page.viewportSize()!.height);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      "Büyük beden giyimde doğru bedeni ve markayı bulun. Kadın ve erkek için ölçü tabloları, beden karşılıkları, stil, kumaş ve kaynaklı marka rehberleri.",
    );
    await expect(page.locator("main")).toContainText(/satış yapmaz/i);
    expect(await noOverflow(page)).toBe(true);
  });

  test("giyim hub'larında Bedenimi Bul bandı çalışan bulucuya gider", async ({ page }) => {
    for (const s of ["kadin", "erkek"]) {
      if (!has(`/${s}/giyim`)) continue;
      await page.goto(`/${s}/giyim`);
      const href = await page.locator("[data-bedenimi-bul] a").first().getAttribute("href");
      expect(href).toBeTruthy();
      const [path, hash] = href!.split("#");
      expect(has(path)).toBe(true);
      await page.goto(href!);
      if (hash) await expect(page.locator(`#${hash}`)).toBeVisible();
      await expect(page.locator("[data-beden-bulucu]")).toBeVisible();
    }
  });

  test("sonuç: güven düzeyi, veri türü, son kontrol, uyarı, lejant ve aksiyonlar; ölçü URL'ye yazılmaz", async ({ page, context }) => {
    await page.goto("/beden-bulucu", { waitUntil: "networkidle" });
    const box = page.locator("[data-beden-bulucu]");
    await box.getByLabel("Göğüs çevresi (cm)").fill("122");
    await box.getByLabel("Bel çevresi (cm)").fill("106");
    await box.getByLabel("Basen çevresi (cm)").fill("130");
    const out = page.locator("[data-bulucu-sonuc]");
    await expect(out.locator("[data-bulucu-uyari]")).toHaveText(WARNING);
    const cards = out.locator("[data-bulucu-marka]");
    expect(await cards.count()).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < (await cards.count()); i++) {
      const c = cards.nth(i);
      await expect(c.locator("[data-guven]")).toHaveCount(1);
      await expect(c.locator("[data-guven]")).toHaveAttribute("title", /.{20,}/);
      await expect(c.locator("[data-bulucu-kanit]")).toContainText("Veri türü");
      await expect(c.locator("[data-bulucu-kanit]")).toContainText("Son kontrol");
    }
    // Güven kuralı: generic tablo Düşük, taze resmi vücut tablosu Yüksek
    const generic = index.sizeCharts.find((c) => c.kind === "olcu" && c.sourceType === "generic" && c.gender === "kadin");
    if (generic && (await page.locator(`[data-bulucu-marka="${generic.id}"]`).count())) {
      await expect(page.locator(`[data-bulucu-marka="${generic.id}"] [data-guven]`)).toHaveAttribute("data-guven", "dusuk");
    }
    await expect(out.locator("[data-guven-lejant]")).toContainText("Güven düzeyi nasıl belirlenir?");
    // Aksiyonlar: markanın beden tablosu (marka sayfasında anchor), marka profili, aynı bedeni sunan markalar, kategori
    const withBrand = out.locator("[data-bulucu-aksiyonlar]").filter({ has: page.getByRole("link", { name: "Marka profili" }) }).first();
    await expect(withBrand).toBeVisible();
    const tableHref = await withBrand.getByRole("link", { name: /Markanın beden tablosu/ }).getAttribute("href");
    const same = await withBrand.locator("[data-ayni-beden]").getAttribute("href");
    const all = await out.locator("[data-bulucu-aksiyonlar] a").evaluateAll((as) => as.map((a) => a.getAttribute("href") ?? ""));
    for (const h of all) {
      expect(h).not.toMatch(/(122|106|130)/);
      if (h.startsWith("/")) expect(has(h.split(/[?#]/)[0]), h).toBe(true);
    }
    expect(same).toMatch(/^\/markalar\?cinsiyet=kadin&beden=/);
    // Tablo linki marka sayfasındaki tabloya iner
    const [p, hash] = tableHref!.split("#");
    await page.goto(tableHref!);
    expect(new URL(page.url()).pathname).toBe(p);
    await expect(page.locator(`#${hash}[data-size-chart]`)).toHaveCount(1);
    expect(await context.cookies()).toEqual([]);
  });

  test("araç sayfası: WebApplication şeması (puan/teklif yok), tek H1, yatay taşma yok", async ({ page }) => {
    await page.goto("/beden-bulucu");
    await expect(page.locator("h1")).toHaveCount(1);
    const ld = await ldOf(page);
    const app = ld.find((x) => x["@type"] === "WebApplication");
    expect(app).toBeTruthy();
    expect(app.isAccessibleForFree).toBe(true);
    expect(app.applicationCategory).toBeTruthy();
    expect(JSON.stringify(ld)).not.toMatch(/AggregateRating|"Offer"|"Product"|ratingValue/);
    expect(await noOverflow(page)).toBe(true);
  });
});

test.describe("marka özet kartı ve şema", () => {
  const brands = index.docs.filter((d) => d.type === "BRAND_GUIDE");
  const withCharts = brands.find((b) => index.sizeCharts.some((c) => c.kind === "olcu" && c.brand === b.id && c.measurementType === "garment"));

  test("özet: kime, doğrulanmış aralık, TR erişimi, son kontrol, tablo türü, kategori bazlı aralık ve tablo anchor'ı", async ({ page }) => {
    test.skip(!withCharts, "tablolu marka yok");
    await page.goto(withCharts!.path);
    const card = page.locator("[data-marka-ozeti]");
    for (const k of ["Kime", "Doğrulanmış beden aralığı", "Türkiye erişimi", "Son kontrol", "Tablo türü", "Kategori kapsamı"]) await expect(card).toContainText(k);
    await expect(card.locator("[data-ozet-kategori]")).toContainText("ürün ölçüsü tablosu");
    const anchors = await card.locator('[data-ozet-kategori] a[href^="#tablo-"]').evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
    expect(anchors.length).toBeGreaterThan(0);
    for (const a of anchors) await expect(page.locator(a)).toHaveCount(1);
    expect(await noOverflow(page)).toBe(true);
  });

  test("her markaya bağlı tablo marka sayfasında bir kez gösterilir (anchor benzersiz)", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "masaüstü");
    const ids = new Set<string>();
    for (const b of brands) {
      await page.goto(b.path);
      const dup = await page.evaluate(() => {
        const seen = new Map<string, number>();
        document.querySelectorAll("[id]").forEach((e) => seen.set(e.id, (seen.get(e.id) ?? 0) + 1));
        return [...seen].filter(([, n]) => n > 1).map(([k]) => k);
      });
      expect(dup, b.path).toEqual([]);
      for (const id of await page.locator("[data-size-chart]").evaluateAll((els) => els.map((e) => e.id))) ids.add(id);
    }
    for (const c of index.sizeCharts.filter((x) => x.brand && x.kind === "olcu")) expect(ids.has(`tablo-${c.id}`), c.id).toBe(true);
  });

  test("marka sayfası: WebPage + about Brand, Article değil; yasak tipler yok", async ({ page }) => {
    const b = brands[0];
    await page.goto(b.path);
    const ld = await ldOf(page);
    const wp = ld.find((x) => x["@type"] === "WebPage");
    expect(wp?.about?.["@type"]).toBe("Brand");
    expect(wp.about.name).toBe(b.fm.name);
    expect(ld.some((x) => x["@type"] === "Article")).toBe(false);
    expect(JSON.stringify(ld)).not.toMatch(/AggregateRating|"Offer"|"Product"|"Review"/);
  });

  test("değişiklik kaydı yalnız kayıt varsa görünür", async ({ page }) => {
    const withLog = brands.find((b) => ((b.fm.changelog as unknown[]) ?? []).length > 0);
    const without = brands.find((b) => !((b.fm.changelog as unknown[]) ?? []).length);
    if (without) {
      await page.goto(without.path);
      await expect(page.locator("[data-degisiklik-kaydi]")).toHaveCount(0);
    }
    if (withLog) {
      await page.goto(withLog.path);
      await expect(page.locator("[data-degisiklik-kaydi] li")).toHaveCount((withLog.fm.changelog as unknown[]).length);
    }
  });
});

test.describe("/markalar beden filtresi", () => {
  test.beforeEach(() => test.skip(!has("/markalar"), "sayfa yok"));

  test("?cinsiyet=kadin&beden=52: yalnız eşleşen markalar, eşleşen aralık + kaynak, noindex; canonical /markalar", async ({ page }) => {
    await page.goto("/markalar");
    const all = await page.locator("[data-brand]:visible").count();
    await page.goto("/markalar?cinsiyet=kadin&beden=52");
    await expect(page.locator("[data-filtre-ozeti]")).toContainText("52 beden");
    const visible = page.locator("[data-brand]:visible");
    const n = await visible.count();
    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThan(all);
    for (let i = 0; i < n; i++) {
      const li = visible.nth(i);
      expect((await li.getAttribute("data-g"))!.split(" ")).toContain("kadin");
      await expect(li.locator("[data-eslesen-aralik]")).toContainText("Kaynak");
      await expect(li.locator("[data-eslesen-aralik] [data-guven]")).toHaveCount(1);
    }
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/markalar$/);
    expect(await noOverflow(page)).toBe(true);
  });

  test("?beden=4XL harf bedeniyle eşleşir; form filtreyi uygular ve temizler", async ({ page }) => {
    await page.goto("/markalar?beden=4XL");
    const n = await page.locator("[data-brand]:visible").count();
    expect(n).toBeGreaterThan(0);
    await page.locator("[data-marka-filtre-form] select[name=cinsiyet]").selectOption("erkek");
    await page.locator("[data-marka-filtre-form] input[name=beden]").fill("4XL");
    await page.locator("[data-marka-filtre-form]").getByRole("button", { name: "Filtrele" }).click();
    await expect(page).toHaveURL(/cinsiyet=erkek&beden=4XL/);
    const g = await page.locator("[data-brand]:visible").evaluateAll((els) => els.map((e) => e.getAttribute("data-g") ?? ""));
    expect(g.length).toBeGreaterThan(0);
    for (const x of g) expect(x.split(" ")).toContain("erkek");
    await page.getByRole("link", { name: "Filtreyi temizle" }).click();
    await expect(page).toHaveURL(/\/markalar$/);
    await expect(page.locator("[data-filtre-ozeti]")).toHaveCount(0);
  });

  test("JS kapalıyken parametreli adres tüm markaları listeler (zarif geri dönüş)", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto("/markalar");
    const all = await page.locator("[data-brand]:visible").count();
    await page.goto("/markalar?cinsiyet=kadin&beden=52");
    expect(await page.locator("[data-brand]:visible").count()).toBe(all);
    await expect(page.locator("[data-marka-filtre-form]")).toHaveAttribute("action", "/markalar");
    await ctx.close();
  });

  test("robots.txt filtreli dizini taramaz", async ({ request }) => {
    const r = await request.get("/robots.txt");
    const txt = await r.text();
    if (/Disallow: \/$/m.test(txt)) return; // önizleme ortamı
    expect(txt).toContain("Disallow: /markalar?");
  });
});

test.describe("{% marka-filtresi %} CTA'sı ve kategori bloğu", () => {
  const withTag = index.docs.filter((d) => d.collection !== "markalar").map((d) => d.path);

  test("CTA: filtreli dizine link ve en çok 5 marka önizlemesi", async ({ page }) => {
    const targets = ["/alisveris-rehberi/52-beden-elbise-nereden-alinir", "/alisveris-rehberi/4xl-erkek-tisort-nereden-alinir"].filter((p) => withTag.includes(p));
    test.skip(!targets.length, "sayfa yok");
    for (const p of targets) {
      await page.goto(p);
      const cta = page.locator("[data-marka-filtresi]").first();
      await expect(cta).toBeVisible();
      const items = cta.locator("li");
      expect(await items.count()).toBeGreaterThan(0);
      expect(await items.count()).toBeLessThanOrEqual(5);
      const link = cta.getByRole("link", { name: /bedeni doğrulanmış markaları gör/ });
      const href = await link.getAttribute("href");
      expect(href).toMatch(/^\/markalar\?cinsiyet=(kadin|erkek)&beden=/);
      await link.click();
      await expect(page.locator("[data-filtre-ozeti]")).toBeVisible();
      expect(await page.locator("[data-brand]:visible").count()).toBeGreaterThan(0);
    }
  });

  test("kategori hub'ı: CollectionPage şeması; doğrulanmış marka bloğu aralık, tablo türü ve TR erişimiyle", async ({ page }) => {
    const hub = index.docs.find((d) => d.collection === "hublar" && d.path === "/erkek/giyim/tisort") ?? index.docs.find((d) => d.collection === "hublar");
    test.skip(!hub, "hub yok");
    await page.goto(hub!.path);
    const ld = await ldOf(page);
    expect(ld.some((x) => x["@type"] === "CollectionPage")).toBe(true);
    const block = page.locator("[data-kategori-markalari]");
    if (await block.count()) {
      await expect(block.locator("thead")).toContainText("Tablo türü");
      await expect(block.locator("thead")).toContainText("Türkiye erişimi");
      expect(await block.locator("tbody tr").count()).toBeGreaterThan(0);
    }
    expect(await noOverflow(page)).toBe(true);
  });
});

test.describe("yayın sorumlusu", () => {
  test("reviewedBy (ya da site varsayılanı) bylinede ve Article JSON-LD'de editor olarak görünür", async ({ page }) => {
    const def = index.settings.defaultReviewer;
    const person = (id?: string) => index.authors.find((a) => a.id === id && !a.isTeam);
    const doc = index.docs.find((d) => d.type === "ARTICLE" && person(d.reviewedBy ?? def) && (d.reviewedBy ?? def) !== d.author);
    test.skip(!doc, "yayın sorumlusu tanımlı değil");
    const r = person(doc!.reviewedBy ?? def)!;
    await page.goto(doc!.path);
    const by = page.locator("[data-byline] [data-yayin-sorumlusu]");
    await expect(by).toContainText(`Yayın sorumlusu: ${r.name}`);
    await expect(by.getByRole("link")).toHaveAttribute("href", r.path);
    const art = (await ldOf(page)).find((x) => x["@type"] === "Article");
    expect(art.editor).toEqual({ "@type": "Person", name: r.name, url: new URL(r.path, index.settings.siteUrl).toString() });
  });
});

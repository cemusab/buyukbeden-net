import { expect, test, type Page } from "@playwright/test";
import { index, manifest } from "./helpers";

const has = (p: string) => manifest.some((e) => e.path === p);

async function fill(page: Page, label: string | RegExp, value: string) {
  await page.locator("[data-beden-bulucu]").getByLabel(label).fill(value);
}

test.describe("Beden Bulucu", () => {
  test.beforeEach(() => test.skip(!has("/beden-rehberi"), "sayfa yok"));

  test("ölçüyle marka marka kaynaklı öneri verir; ağ isteği, çerez ve depolama yok", async ({ page, context }) => {
    await page.goto("/beden-rehberi", { waitUntil: "networkidle" });
    const requests: string[] = [];
    page.on("request", (r) => requests.push(r.method() === "GET" ? r.url() : `${r.method()} ${r.url()}`));
    const box = page.locator("[data-beden-bulucu]");
    await expect(box.getByRole("radio", { name: "Kadın" })).toBeChecked();
    await fill(page, "Göğüs çevresi (cm)", "122");
    await fill(page, "Bel çevresi (cm)", "106");
    await fill(page, "Basen çevresi (cm)", "130");
    const cards = page.locator("[data-bulucu-marka]");
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThanOrEqual(3);
    await expect(page.locator("[data-bulucu-sonuc]")).toContainText("Önerilen beden aralığı");
    // her kartta markanın kaynağına giden dış link
    for (let i = 0; i < Math.min(await cards.count(), 5); i++) {
      const href = await cards.nth(i).locator('a[href^="https://"]').first().getAttribute("href");
      expect(href, "kaynak linki").toMatch(/^https:\/\//);
    }
    // ölçü türü belirsiz tablolar (ör. TuvidXXL) bulucuda yok
    const unverified = index.sizeCharts.filter((c) => c.kind === "olcu" && !c.measurementTypeVerified).map((c) => c.id);
    for (const id of unverified) await expect(page.locator(`[data-bulucu-marka="${id}"]`)).toHaveCount(0);
    await page.waitForTimeout(300);
    // Araç hiçbir yere veri göndermez: üçüncü taraf, GET dışı ya da girilen değeri taşıyan istek yok
    // (Next.js'in görünür iç linkleri önceden yüklemesi aynı kökenli GET'tir ve buna dahil değildir.)
    const origin = new URL(page.url()).origin;
    const leaks = requests.filter((u) => !u.startsWith(origin) || /[?&=/](122|106|130)(\b|$)/.test(u.replace(/_rsc=[^&]+/, "")));
    expect(leaks, "etkileşim sırasında veri taşıyan istek").toEqual([]);
    expect(await context.cookies()).toEqual([]);
    const storage = await page.evaluate(() => localStorage.length + sessionStorage.length);
    expect(storage).toBe(0);
  });

  test("yalnız boy ve kilo girilirse sonuç 'Tahmini' etiketlenir ve ölçü almaya yönlendirir", async ({ page }) => {
    await page.goto("/beden-rehberi");
    await fill(page, "Boy (cm, isteğe bağlı)", "150");
    await fill(page, /^Kilo \(kg, isteğe bağlı\)/, "110");
    const t = page.locator("[data-bulucu-tahmini]");
    await expect(t).toBeVisible();
    await expect(t).toContainText("Tahmini");
    await expect(t).toContainText("Boy ve kilo bedeni belirlemez");
    await expect(page.locator("[data-bulucu-marka]")).toHaveCount(0);
    const link = t.getByRole("link", { name: /Ölçü nasıl alınır/ });
    if (await link.count()) {
      const path = new URL((await link.getAttribute("href"))!, "http://x").pathname;
      expect(manifest.some((e) => e.path === path)).toBe(true);
    }
  });

  test("erkek seçiminde göğüs, bel ve kalça sorulur ve erkek tabloları kullanılır", async ({ page }) => {
    await page.goto("/beden-rehberi");
    const box = page.locator("[data-beden-bulucu]");
    await box.getByText("Erkek", { exact: true }).click();
    await expect(box.getByLabel("Kalça çevresi (cm)")).toBeVisible();
    await fill(page, "Göğüs çevresi (cm)", "130");
    const ids = await page.locator("[data-bulucu-marka]").evaluateAll((els) => els.map((e) => e.getAttribute("data-bulucu-marka") ?? ""));
    expect(ids.length).toBeGreaterThan(0);
    const genders = new Set(ids.map((id) => index.sizeCharts.find((c) => c.id === id)?.gender));
    expect([...genders]).toEqual(["erkek"]);
  });

  test("JavaScript kapalıyken açıklama ve ölçü/tablo linkleri görünür, form görünmez", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto("/beden-rehberi");
    const sec = page.locator("[data-beden-bulucu-bolum]");
    await expect(sec.getByRole("heading", { name: "Beden Bulucu" })).toBeVisible();
    await expect(sec).toContainText("kaydedilmez");
    await expect(sec.locator("input")).toHaveCount(0);
    expect(await sec.getByRole("link").count()).toBeGreaterThan(0);
    await ctx.close();
  });

  test("kadın ve erkek beden rehberi sayfalarında cinsiyet sabit", async ({ page }) => {
    for (const [p, label] of [
      ["/kadin/beden-rehberi", "Basen çevresi (cm)"],
      ["/erkek/beden-rehberi", "Kalça çevresi (cm)"],
    ] as const) {
      if (!has(p)) continue;
      await page.goto(p);
      const box = page.locator("[data-beden-bulucu]");
      await expect(box.getByLabel(label)).toBeVisible();
      await expect(box.getByRole("radio")).toHaveCount(0);
    }
  });
});

test.describe("beden tabloları ve türetilmiş karşılaştırmalar", () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== "desktop", "masaüstü"));

  test("marka tablosu: ölçü türü rozeti, aralık biçimi, kaynak türü ve son doğrulama tarihi", async ({ page }) => {
    const p = "/kadin/beden-rehberi/beden-tablosu";
    test.skip(!has(p), "sayfa yok");
    await page.goto(p);
    const fig = page.locator('[data-size-chart][data-measurement-type="body"]').first();
    await expect(fig.locator("[data-measurement-badge]")).toHaveText("Vücut ölçüsü");
    await expect(fig.locator("[data-chart-meta]")).toContainText("Son doğrulama");
    await expect(fig.locator("[data-chart-meta]")).toContainText("Kaynak türü");
    await expect(fig.locator("tbody td").filter({ hasText: /^\d+(,\d)?(–\d+(,\d)?)? cm/ }).first()).toBeVisible();
  });

  test("karşılaştırma: tek ölçü türü, her satırda marka ve çalışan kaynak numarası", async ({ page }) => {
    const doc = index.docs.find((d) => ((d.fm.sizeComparisons as unknown[]) ?? []).length > 0);
    test.skip(!doc, "karşılaştırma yok");
    await page.goto(doc!.path);
    const cmp = page.locator("[data-size-comparison]").first();
    await expect(cmp).toBeVisible();
    const type = await cmp.getAttribute("data-measurement-type");
    await expect(cmp.locator("[data-measurement-badge]")).toHaveCount(1);
    await expect(cmp.locator("[data-measurement-badge]")).toHaveAttribute("data-measurement-badge", type!);
    const refs = cmp.locator('a[href^="#karsilastirma-"]');
    expect(await refs.count()).toBeGreaterThan(0);
    for (const href of await refs.evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")!))])) {
      await expect(page.locator(href), href).toHaveCount(1);
    }
  });
});

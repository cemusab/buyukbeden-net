import { expect, test } from "@playwright/test";
import { index } from "./helpers";

const docs = index.docs;
const expectations: { q: string; match: (u: string, g: string) => boolean; need: () => boolean }[] = [
  { q: "52 beden", match: (u) => /52/.test(u) || docs.some((d) => d.path === u && d.sizes.includes("52")), need: () => docs.some((d) => d.sizes.includes("52")) },
  { q: "4 xl", match: (u) => docs.some((d) => d.path === u && d.sizes.map((s) => s.toLowerCase()).includes("4xl")), need: () => docs.some((d) => d.sizes.map((s) => s.toLowerCase()).includes("4xl")) },
  { q: "4XL", match: (u) => docs.some((d) => d.path === u && d.sizes.map((s) => s.toLowerCase()).includes("4xl")), need: () => docs.some((d) => d.sizes.map((s) => s.toLowerCase()).includes("4xl")) },
  { q: "viskon", match: (u) => u === "/kumas-rehberi/viskon", need: () => docs.some((d) => d.path === "/kumas-rehberi/viskon") },
  { q: "vıskon", match: (u) => u === "/kumas-rehberi/viskon", need: () => docs.some((d) => d.path === "/kumas-rehberi/viskon") },
  { q: "viskn", match: (u) => u === "/kumas-rehberi/viskon", need: () => docs.some((d) => d.path === "/kumas-rehberi/viskon") },
  { q: "büyük beden elbise", match: (u) => u.startsWith("/kadin/giyim/elbise"), need: () => docs.some((d) => d.path === "/kadin/giyim/elbise") },
  { q: "erkek tişört", match: (u) => u.startsWith("/erkek/giyim/tisort"), need: () => docs.some((d) => d.path === "/erkek/giyim/tisort") },
  { q: "erkek tshirt", match: (u) => u.startsWith("/erkek/giyim/tisort"), need: () => docs.some((d) => d.path === "/erkek/giyim/tisort") },
  { q: "oversize", match: (u) => /oversize/.test(u), need: () => docs.some((d) => /oversize/.test(d.path)) },
  { q: "likra", match: (u) => u === "/kumas-rehberi/elastan", need: () => docs.some((d) => d.path === "/kumas-rehberi/elastan") },
];

test.describe("site içi arama", () => {
  for (const e of expectations) {
    test(`"${e.q}" beklenen sonucu ilk 5'te döndürür`, async ({ page }, info) => {
      test.skip(info.project.name !== "desktop", "masaüstü");
      test.skip(!e.need(), "hedef içerik henüz yok");
      await page.goto(`/arama?q=${encodeURIComponent(e.q)}`);
      const links = page.locator("[data-search-results] li a");
      await expect(links.first()).toBeVisible();
      const hrefs = (await links.evaluateAll((as) => as.map((a) => new URL((a as HTMLAnchorElement).href).pathname))).slice(0, 5);
      expect(hrefs.some((h) => e.match(h, "")), `${e.q} → ${hrefs.join(", ")}`).toBe(true);
    });
  }

  test("kadın sorgusunda erkek sonucu yok", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "masaüstü");
    await page.goto(`/arama?q=${encodeURIComponent("kadın pantolon")}`);
    await expect(page.locator("[data-search-results] li a").first()).toBeVisible();
    const hrefs = await page.locator("[data-search-results] li a").evaluateAll((as) => as.map((a) => new URL((a as HTMLAnchorElement).href).pathname));
    expect(hrefs.some((h) => h.startsWith("/erkek"))).toBe(false);
  });

  test("header otomatik tamamlama: klavye ile seçip gider", async ({ page }, info) => {
    const id = info.project.name === "mobile" ? "#ust-arama-mobil" : "#ust-arama";
    await page.goto("/");
    const input = page.locator(id);
    await input.click();
    await input.fill("viskon");
    const list = page.locator(`[role="listbox"]:visible`);
    await expect(list.locator('[role="option"]').first()).toBeVisible();
    await expect(input).toHaveAttribute("aria-expanded", "true");
    await input.press("ArrowDown");
    await input.press("Enter");
    await page.waitForURL(/\/(kumas-rehberi|rehberler|kadin|erkek|beden-rehberi)/);
    expect(new URL(page.url()).pathname).not.toBe("/");
  });

  test("Enter (seçimsiz) /arama?q= sayfasına gider", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "masaüstü");
    await page.goto("/");
    await page.locator("#ust-arama").fill("pamuk");
    await page.locator("#ust-arama").press("Enter");
    await page.waitForURL(/\/arama\?q=pamuk/);
    await expect(page.locator("[data-search-results]")).toContainText("pamuk");
  });
});

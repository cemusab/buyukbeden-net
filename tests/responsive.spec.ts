/**
 * Duyarlılık: mobilde hiçbir sayfada yatay taşma yok; dokunma hedefleri ≥ 44px;
 * tablolar yalnız kendi kabı içinde kayar. Ek genişlikler: 360/390/768/1024/1440.
 */
import { expect, test } from "@playwright/test";
import { manifest } from "./helpers";

const pages = manifest.filter((e) => e.kind !== "utility").map((e) => e.path);

test("mobil: tüm sayfalarda yatay taşma yok ve dokunma hedefleri ≥ 44px", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "mobil proje");
  test.setTimeout(900_000);
  const failures: string[] = [];
  for (const p of pages) {
    await page.goto(p, { waitUntil: "load" });
    const r = await page.evaluate(() => {
      const over = document.documentElement.scrollWidth - window.innerWidth;
      const small: string[] = [];
      const sel = "header a, header button, header input, footer a, nav a, nav button, nav summary, [data-byline] a, form button, main a.rounded-full, main button";
      for (const el of document.querySelectorAll<HTMLElement>(sel)) {
        const box = el.getBoundingClientRect();
        if (!box.width || !box.height) continue; // gizli (kapalı menü vb.)
        if (el.closest("dialog:not([open])")) continue;
        if (box.height < 43.5) small.push(`${el.tagName.toLowerCase()} "${(el.textContent ?? el.getAttribute("aria-label") ?? "").trim().slice(0, 30)}" ${Math.round(box.height)}px`);
      }
      return { over, small: small.slice(0, 5) };
    });
    if (r.over > 0) failures.push(`yatay taşma ${r.over}px ${p}`);
    if (r.small.length) failures.push(`küçük dokunma hedefi ${p}: ${r.small.join(" | ")}`);
  }
  expect(failures).toEqual([]);
});

for (const width of [360, 390, 768, 1024, 1440]) {
  test(`${width}px: şablon örneklerinde taşma yok, tablolar kap içinde kayar`, async ({ browser }, info) => {
    test.skip(info.project.name !== "desktop", "genişlik matrisi bir kez");
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await ctx.newPage();
    const samples = new Set<string>(["/", "/kadin", "/erkek", "/kadin/giyim", "/erkek/giyim", "/beden-rehberi", "/markalar", "/kumas-rehberi", "/arama"]);
    for (const kind of ["hub", "doc", "entity", "author"]) {
      const e = manifest.find((x) => x.kind === kind);
      if (e) samples.add(e.path);
    }
    const withTable = manifest.find((e) => e.path.startsWith("/beden-rehberi/"));
    if (withTable) samples.add(withTable.path);
    for (const p of samples) {
      if (!manifest.some((e) => e.path === p)) continue;
      await page.goto(p);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(over, `${width}px ${p}`).toBeLessThanOrEqual(0);
      const regions = page.locator('[role="region"][tabindex="0"]');
      const n = await regions.count();
      for (let i = 0; i < Math.min(n, 3); i++) {
        const box = await regions.nth(i).boundingBox();
        if (box) expect(box.x + box.width, `${p} tablo kabı`).toBeLessThanOrEqual(width + 1);
      }
    }
    await ctx.close();
  });
}

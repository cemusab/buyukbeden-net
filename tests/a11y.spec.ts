import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { manifest } from "./helpers";

/** WCAG 2.1 A/AA otomatik denetimi: ana sayfa + her şablon türünden bir örnek. */
const samples = (() => {
  const s = new Set<string>(["/", "/arama"]);
  for (const p of ["/kadin", "/kadin/giyim", "/erkek/giyim", "/beden-rehberi", "/markalar", "/kumas-rehberi", "/kadin/kombinler", "/stil"]) if (manifest.some((e) => e.path === p)) s.add(p);
  for (const kind of ["hub", "doc", "entity", "author"]) {
    const e = manifest.find((x) => x.kind === kind);
    if (e) s.add(e.path);
  }
  for (const pre of ["/marka/", "/kumas-rehberi/", "/beden-rehberi/", "/kadin/kombinler/"]) {
    const e = manifest.find((x) => x.path.startsWith(pre));
    if (e) s.add(e.path);
  }
  return [...s];
})();

for (const p of samples) {
  test(`erişilebilirlik ${p}`, async ({ page }) => {
    await page.goto(p);
    const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const v = r.violations.map((x) => `${x.id} (${x.impact}): ${x.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
    expect(v, p).toEqual([]);
  });
}

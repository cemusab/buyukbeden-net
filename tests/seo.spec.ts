import { expect, test } from "@playwright/test";
import { index, indexable, SITE } from "./helpers";
import { EXTERNAL_REDIRECTS } from "../src/lib/external-redirects";

test.describe("SEO altyapısı", () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== "desktop", "yalnız masaüstü"));

  test("robots.txt admin/API/arama sorgularını kapatır ve sitemap verir", async ({ request }) => {
    const t = await (await request.get("/robots.txt")).text();
    expect(t).toContain("Disallow: /keystatic");
    expect(t).toContain("Disallow: /api/");
    expect(t).toContain("Disallow: /arama?");
    expect(t).toContain(`Sitemap: ${SITE}/sitemap-index.xml`);
  });

  test("sitemap URL kümesi = manifest'in indekslenen kümesi", async ({ request }) => {
    for (const idx of ["/sitemap-index.xml", "/sitemap.xml"]) {
      const r = await request.get(idx);
      expect(r.status()).toBe(200);
      expect(r.headers()["content-type"]).toContain("xml");
    }
    const xml = await (await request.get("/sitemap-index.xml")).text();
    const subs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
    expect(subs.length).toBeGreaterThan(0);
    const urls: string[] = [];
    for (const s of subs) {
      const r = await request.get(s);
      expect(r.status(), s).toBe(200);
      urls.push(...[...(await r.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname));
    }
    expect(new Set(urls).size, "yinelenen sitemap URL'si").toBe(urls.length);
    expect([...urls].sort()).toEqual([...indexable].sort());
    expect(urls.some((u) => u.startsWith("/arama") || u.startsWith("/keystatic"))).toBe(false);
  });

  test("/arama noindex, varsayılan OG görseli üretilir", async ({ page, request }) => {
    await page.goto("/arama");
    expect(await page.locator('meta[name="robots"]').getAttribute("content")).toMatch(/noindex/);
    const og = await request.get("/og-varsayilan.png");
    expect(og.status()).toBe(200);
    expect(og.headers()["content-type"]).toContain("image/png");
  });

  test("yönlendirmeler: eski .html ve hub kısa yolları tek 308 ile kanonik sayfaya gider", async ({ request }) => {
    const list = [
      ["/index.html", "/"],
      ["/kadin.html", "/kadin"],
      ["/erkek.html", "/erkek"],
      ["/markalar.html", "/markalar"],
      ["/rehber.html", "/rehberler"],
      ...index.redirects.map((r) => [r.source, r.destination]),
    ].filter(([, to]) => index.manifest.some((e) => e.path === to));
    expect(index.redirects.length, "hub kısa yolları üretilmeli").toBeGreaterThan(0);
    for (const [from, to] of list) {
      const r = await request.get(from, { maxRedirects: 0 });
      expect(r.status(), from).toBe(308);
      expect(new URL(r.headers()["location"], "http://x").pathname, from).toBe(to);
      const final = await request.get(to, { maxRedirects: 0 });
      expect(final.status(), to).toBe(200);
    }
  });

  test("kardeş siteye taşınan sayfalar tek 308 ile buyuk-beden.com'a gider; manifest ve sitemap'te yok", async ({ request }) => {
    expect(EXTERNAL_REDIRECTS.length).toBeGreaterThan(0);
    const sitemap = await (await request.get("/sitemap-index.xml")).text();
    for (const { source, destination } of EXTERNAL_REDIRECTS) {
      expect(index.manifest.some((e) => e.path === source), source).toBe(false);
      const r = await request.get(source, { maxRedirects: 0 });
      expect(r.status(), source).toBe(308);
      expect(r.headers()["location"], source).toBe(destination);
      expect(sitemap.includes(source), source).toBe(false);
    }
  });

  test("alışveriş CTA bayrağı kapalı: buyukbedengiyim.com hiçbir yerde yok", async ({ request }) => {
    expect(index.settings.shoppingCta.enabled).toBe(false);
    for (const p of ["/", ...index.manifest.filter((e) => e.kind !== "utility").map((e) => e.path)]) {
      const html = await (await request.get(p)).text();
      expect(html.toLowerCase().includes("buyukbedengiyim"), p).toBe(false);
    }
  });
});

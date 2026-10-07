/**
 * İç link tarayıcısı + SEO denetimi (mimari §19.2 crawl.spec).
 * Tohum: route manifest + ana sayfa + sitemap. Her iç URL: 200, boş/#/javascript: href yok, kırık anchor yok,
 * kırık görsel yok, console hatası yok, tek H1, benzersiz title/description, self canonical, manifest ile uyumlu robots,
 * izinli JSON-LD tipleri, OG etiketleri, /keystatic linki ve buyukbedengiyim.com yok, dış linkler geçerli URL.
 */
import { expect, test } from "@playwright/test";
import { ALLOWED_LD, FORBIDDEN_LD, manifest, SITE } from "./helpers";

test.describe.configure({ mode: "serial" });

test("tüm iç sayfalar, linkler, anchor'lar, görseller ve metadata", async ({ page, baseURL, request }, info) => {
  test.skip(info.project.name !== "desktop", "Tarayıcı bir kez (masaüstü) çalışır");
  test.setTimeout(1_800_000);
  const origin = new URL(baseURL!).origin;
  const manifestByPath = new Map(manifest.map((e) => [e.path, e]));

  const queue: string[] = [...new Set(["/", ...manifest.map((e) => e.path)])];
  const seen = new Set<string>(queue);
  const failures: string[] = [];
  const consoleErrors: string[] = [];
  const anchorChecks: { from: string; page: string; hash: string }[] = [];
  const images = new Map<string, string>();
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();

  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(`${page.url()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => consoleErrors.push(`${page.url()}: ${e.message}`));

  while (queue.length) {
    const p = queue.shift()!;
    const res = await page.goto(p, { waitUntil: "load" });
    const status = res?.status() ?? 0;
    const finalPath = new URL(page.url()).pathname;
    if (status !== 200) {
      failures.push(`HTTP ${status} ${p}`);
      continue;
    }
    if (p.includes("?")) continue; // sorgulu yardımcı URL'ler (arama) yalnız 200 kontrolü
    const d = await page.evaluate(() => {
      const meta = (sel: string) => document.querySelector(sel)?.getAttribute("content") ?? null;
      return {
        links: [...document.querySelectorAll("a")].map((a) => ({ raw: a.getAttribute("href"), href: a.href, text: (a.textContent ?? "").trim().slice(0, 40) })),
        ids: [...document.querySelectorAll("[id]")].map((e) => e.id),
        imgs: [...document.querySelectorAll("img")].map((i) => ({ src: i.currentSrc || i.src, broken: i.complete && i.naturalWidth === 0, alt: i.getAttribute("alt") })),
        unlabeledButtons: [...document.querySelectorAll("button")].filter((b) => !(b.textContent ?? "").trim() && !b.getAttribute("aria-label")).length,
        h1: document.querySelectorAll("h1").length,
        title: document.title,
        description: meta('meta[name="description"]'),
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
        robots: meta('meta[name="robots"]'),
        ogTitle: meta('meta[property="og:title"]'),
        ogImage: meta('meta[property="og:image"]'),
        twitter: meta('meta[name="twitter:card"]'),
        lang: document.documentElement.lang,
        ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent ?? ""),
        iframes: document.querySelectorAll("iframe").length,
        html: document.documentElement.outerHTML.length,
        bodyText: document.body.innerText,
      };
    });
    const entry = manifestByPath.get(finalPath);
    const where = `${p}`;
    if (d.lang !== "tr") failures.push(`lang≠tr ${where}`);
    if (d.h1 !== 1) failures.push(`H1 sayısı ${d.h1} ${where}`);
    if (!d.title) failures.push(`title yok ${where}`);
    if (!d.description || d.description.length < 50) failures.push(`description yok/kısa ${where}`);
    if (!d.ogTitle || !d.ogImage) failures.push(`OG title/image eksik ${where}`);
    if (!d.twitter) failures.push(`twitter:card yok ${where}`);
    if (d.unlabeledButtons) failures.push(`etiketsiz buton (${d.unlabeledButtons}) ${where}`);
    if (d.iframes) failures.push(`tıklamadan yüklenen iframe ${where}`);
    if (/buyukbedengiyim/i.test(d.bodyText) || d.links.some((l) => /buyukbedengiyim/i.test(l.href))) failures.push(`buyukbedengiyim.com görünüyor ${where}`);
    if (/çok yakında|yapım aşamasında|coming soon|lorem ipsum/i.test(d.bodyText)) failures.push(`placeholder metni ${where}`);
    if (entry) {
      const expected = new URL(entry.path, SITE).toString();
      if (d.canonical?.replace(/\/$/, "") !== expected.replace(/\/$/, "")) failures.push(`canonical ${d.canonical} ≠ ${expected}`);
      const noindex = /noindex/.test(d.robots ?? "");
      if (entry.index && noindex) failures.push(`kazara noindex ${where}`);
      if (!entry.index && !noindex) failures.push(`noindex bekleniyordu ${where}`);
      if (entry.index) {
        if (titles.has(d.title)) failures.push(`yinelenen title "${d.title}" ${where} = ${titles.get(d.title)}`);
        titles.set(d.title, where);
        if (d.description) {
          if (descriptions.has(d.description)) failures.push(`yinelenen description ${where} = ${descriptions.get(d.description)}`);
          descriptions.set(d.description, where);
        }
      }
    }
    for (const raw of d.ld) {
      try {
        const data = JSON.parse(raw);
        const types: string[] = [];
        const walk = (v: unknown) => {
          if (Array.isArray(v)) v.forEach(walk);
          else if (v && typeof v === "object") {
            const t = (v as Record<string, unknown>)["@type"];
            if (typeof t === "string") types.push(t);
            Object.values(v).forEach(walk);
          }
        };
        walk(data);
        for (const t of types) if (!ALLOWED_LD.has(t)) failures.push(`izinsiz JSON-LD tipi ${t} ${where}`);
      } catch {
        failures.push(`JSON-LD parse edilemedi ${where}`);
      }
    }
    if (FORBIDDEN_LD.some((t) => d.ld.some((x) => x.includes(`"${t}"`)))) failures.push(`yasak JSON-LD ${where}`);
    for (const img of d.imgs) {
      if (img.broken) failures.push(`kırık görsel ${where}: ${img.src}`);
      if (img.alt === null) failures.push(`alt özniteliği yok ${where}: ${img.src}`);
      if (img.src) images.set(img.src, where);
    }
    for (const l of d.links) {
      if (!l.raw || l.raw.trim() === "" || l.raw === "#" || /^javascript:/i.test(l.raw)) {
        failures.push(`boş/geçersiz href ${where}: "${l.text}"`);
        continue;
      }
      if (/\/keystatic/.test(l.href)) failures.push(`/keystatic linki ${where}`);
      let u: URL;
      try {
        u = new URL(l.href);
      } catch {
        failures.push(`bozuk URL ${where}: ${l.raw}`);
        continue;
      }
      if (u.origin !== origin) {
        if (!["https:", "http:", "mailto:"].includes(u.protocol) || (u.protocol !== "mailto:" && !u.hostname.includes("."))) failures.push(`geçersiz dış link ${where}: ${l.raw}`);
        if (/^https?:\/\/(www\.)?buyukbeden\.net/.test(l.href)) failures.push(`mutlak iç link ${where}: ${l.raw}`);
        continue;
      }
      if (u.hash) {
        if (u.pathname === finalPath) {
          if (!d.ids.includes(decodeURIComponent(u.hash.slice(1)))) failures.push(`kırık anchor ${where}${u.hash}`);
        } else anchorChecks.push({ from: where, page: u.pathname, hash: u.hash });
      }
      const key = u.pathname + u.search;
      if (!seen.has(key)) {
        seen.add(key);
        queue.push(key);
      }
    }
  }

  for (const a of anchorChecks) {
    await page.goto(a.page);
    const ok = await page.evaluate((h) => !!document.getElementById(decodeURIComponent(h.slice(1))), a.hash);
    if (!ok) failures.push(`kırık anchor ${a.from} → ${a.page}${a.hash}`);
  }
  for (const [src, where] of images) {
    const r = await request.get(src);
    if (r.status() !== 200) failures.push(`görsel ${r.status()} ${src} (${where})`);
  }
  console.log(`Taranan URL: ${seen.size}, görsel: ${images.size}, anchor: ${anchorChecks.length}`);
  expect([...failures, ...consoleErrors], "Kırık link / SEO / hata listesi").toEqual([]);
});

test("bilinmeyen URL'ler 404 ve noindex döner", async ({ page }) => {
  for (const p of ["/bu-sayfa-yok", "/kadin/giyim/yokboyle", "/kadin/giyim/elbise/yok-boyle", "/marka/yok-boyle", "/kumas-rehberi/yok-boyle", "/yazar/yok", "/erkek/stil/yok", "/trendler/yok"]) {
    const res = await page.goto(p);
    expect(res?.status(), p).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/bulunamadı/);
    expect(await page.locator('meta[name="robots"]').first().getAttribute("content")).toMatch(/noindex/);
  }
});

import { getSettings, listLive } from "@/lib/content";
import type { DocMeta } from "@/lib/content-types";
import { hasRoute } from "@/lib/routes";

/**
 * /llms.txt (mimari §16.3, llmstxt.org biçimi): site amacı + bölümler ve rehberler.
 * Liste build'de içerik indeksinden (manifest ile aynı kaynak) üretilir; yalnız indekslenen, yayımlı yollar.
 */
export function GET() {
  const s = getSettings();
  const abs = (p: string) => new URL(p, s.siteUrl).toString();
  const live = (f: (d: DocMeta) => boolean) =>
    listLive((d) => d.index && hasRoute(d.path) && f(d)).sort((a, b) => a.path.localeCompare(b.path, "tr"));
  const line = (d: DocMeta) => `- [${d.title}](${abs(d.path)}): ${d.seo.description}`;
  const block = (title: string, docs: DocMeta[]) => (docs.length ? `## ${title}\n\n${docs.map(line).join("\n")}\n` : "");
  const kind = (d: DocMeta) => d.fm.kind as string | undefined;
  const used = new Set<string>();
  const take = (f: (d: DocMeta) => boolean) => {
    const docs = live((d) => !used.has(d.key) && f(d));
    docs.forEach((d) => used.add(d.key));
    return docs;
  };

  const header = [
    `# ${s.siteName}`,
    "",
    `> ${s.tagline}. Kadın ve erkek için büyük beden giyimde beden, ölçü, kalıp, kumaş, stil, kombin ve marka rehberleri. Satış sitesi değildir: ürün, fiyat veya stok bilgisi yoktur.`,
    "",
    "Beden ve kumaş bilgileri markaların resmi beden tablolarına ve belirtilen kaynaklara dayanır; her sayfada kaynaklar ve son güncelleme tarihi gösterilir. Beden kiloyla değil vücut ölçüleri (göğüs, bel, basen, boy) ile belirlenir; değerler markaya göre değişir. Kadın (/kadin) ve erkek (/erkek) bölümleri ayrıdır.",
    "",
  ].join("\n");
  const blocks = [
    block("Ana bölümler", take((d) => d.collection === "sayfalar" && kind(d) === "landing")),
    block("Kadın giyim kategorileri", take((d) => d.collection === "hublar" && d.silo === "kadin")),
    block("Erkek giyim kategorileri", take((d) => d.collection === "hublar" && d.silo === "erkek")),
    block("Beden rehberleri", take((d) => d.collection === "beden-rehberleri" || d.path.startsWith("/beden-rehberi/"))),
    block("Kumaş ve bakım", take((d) => d.collection === "kumaslar" || d.path.startsWith("/kumas-rehberi/") || d.path.startsWith("/rehberler/"))),
    block("Alışveriş rehberleri", take((d) => d.collection === "alisveris-rehberleri")),
    block("Kategori rehberleri", take((d) => d.collection === "makaleler" && !!d.hub)),
    block("Stil rehberleri", take((d) => d.collection === "stil-rehberleri")),
    block("Kombinler", take((d) => d.collection === "kombinler")),
    block("Markalar", take((d) => d.collection === "markalar")),
    block("Optional", take((d) => d.collection !== "sayfalar" || kind(d) !== "yasal")),
  ];
  return new Response([header, ...blocks.filter(Boolean)].join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

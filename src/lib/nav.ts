/** Menü verisi: yalnız manifest'te var olan hedefler (mimari §1.2). */
import "server-only";
import { getByPath, getHomepage, getHubs, listLive } from "./content";
import { hasRoute } from "./routes";
import { categoryLabel, MAIN_NAV, type GenderSilo } from "./taxonomy";

export type NavLink = { label: string; href: string };
export type MegaData = {
  silo: GenderSilo;
  label: string;
  home: NavLink;
  categories: NavLink[];
  guides: NavLink[];
  sizes: NavLink[];
  featured: { href: string; title: string; excerpt: string } | null;
};
export type NavItem = { label: string; href: string; mega?: MegaData };

const LETTERS = ["xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl"];

/** Ham `sizes` değerini kanonik bedene indirger; kanonik değilse null. */
function canonicalSize(raw: string, silo: GenderSilo): string | null {
  const s = raw.trim().toLowerCase().replace(/\s+/g, "").replace(/beden$/, "");
  const l = s === "xxl" ? "2xl" : s === "xxxl" ? "3xl" : s;
  if (LETTERS.includes(l)) return l;
  if (/^\d{2}$/.test(s)) {
    const n = Number(s);
    if (n % 2) return null;
    if (silo === "kadin" && n >= 42 && n <= 66) return s;
    if (silo === "erkek" && n >= 46 && n <= 70) return s;
  }
  return null;
}
const rank = (k: string) => (LETTERS.includes(k) ? 1000 + LETTERS.indexOf(k) : Number(k));

/**
 * "Bedene göre" kısayolları: yalnız kanonik bedenler (kadın 42–66 + XL…8XL, erkek XL…8XL + 46–70),
 * her biri o bedeni en özel biçimde anlatan mevcut beden rehberine gider (silo sayfası önce, az bedenli sayfa önce).
 */
export function sizeLinks(silo: GenderSilo): NavLink[] {
  const guides = listLive((d) => d.type === "SIZE_GUIDE" && d.index && (d.silo === silo || d.silo === "ortak"));
  const best = new Map<string, { href: string; score: number }>();
  for (const g of guides) {
    const keys = [...new Set(g.sizes.map((x) => canonicalSize(x, silo)).filter((x): x is string => !!x))];
    for (const k of keys) {
      // ortak sayfa kadında yalnız harf, erkekte yalnız harf bedenleri için kullanılır
      if (g.silo === "ortak" && !LETTERS.includes(k)) continue;
      const score = (g.silo === silo ? 0 : 100) + (g.hub ? 50 : 0) + keys.length;
      const cur = best.get(k);
      if (!cur || score < cur.score) best.set(k, { href: g.path, score });
    }
  }
  return [...best.entries()]
    .sort(([a], [b]) => rank(a) - rank(b))
    .map(([k, v]) => ({ label: LETTERS.includes(k) ? k.toUpperCase() : `${k} beden`, href: v.href }));
}

function mega(silo: GenderSilo): MegaData | undefined {
  const home = `/${silo}`;
  if (!hasRoute(home)) return undefined;
  const label = silo === "kadin" ? "Kadın" : "Erkek";
  const categories: NavLink[] = [];
  if (hasRoute(`/${silo}/giyim`)) categories.push({ label: "Tüm giyim", href: `/${silo}/giyim` });
  for (const h of getHubs(silo)) {
    categories.push({ label: (h.fm.menuLabel as string) ?? categoryLabel(silo, h.category!), href: h.path });
  }
  const guides = [
    { label: `${label} Beden Rehberi`, href: `/${silo}/beden-rehberi` },
    { label: `${label} Stil`, href: `/${silo}/stil` },
    { label: `${label} Kombinler`, href: `/${silo}/kombinler` },
    { label: `${label} Ayakkabı`, href: `/${silo}/ayakkabi` },
  ].filter((g) => hasRoute(g.href));
  const fp = getHomepage().megaMenuFeatured[silo];
  const fd = fp ? getByPath(fp) : undefined;
  return {
    silo,
    label,
    home: { label: `${label} ana sayfası`, href: home },
    categories,
    guides,
    sizes: sizeLinks(silo),
    featured: fd ? { href: fd.path, title: fd.title, excerpt: fd.excerpt } : null,
  };
}

export function mainNav(): NavItem[] {
  const out: NavItem[] = [];
  for (const n of MAIN_NAV) {
    if (!hasRoute(n.path)) continue;
    out.push({ label: n.label, href: n.path, mega: n.mega ? mega(n.mega) : undefined });
  }
  return out;
}

export function footerColumns(): { title: string; links: NavLink[] }[] {
  const pick = (items: NavLink[]) => items.filter((l) => hasRoute(l.href));
  const silo = (s: GenderSilo, label: string): NavLink[] => [
    { label: `${label} ana sayfası`, href: `/${s}` },
    { label: `${label} giyim`, href: `/${s}/giyim` },
    { label: "Beden rehberi", href: `/${s}/beden-rehberi` },
    { label: "Stil", href: `/${s}/stil` },
    { label: "Kombinler", href: `/${s}/kombinler` },
    { label: "Ayakkabı", href: `/${s}/ayakkabi` },
  ];
  return [
    { title: "Kadın", links: pick(silo("kadin", "Kadın")) },
    { title: "Erkek", links: pick(silo("erkek", "Erkek")) },
    {
      title: "Rehberler",
      links: pick([
        { label: "Beden Rehberi", href: "/beden-rehberi" },
        { label: "Kumaş Rehberi", href: "/kumas-rehberi" },
        { label: "Markalar", href: "/markalar" },
        { label: "Alışveriş Rehberi", href: "/alisveris-rehberi" },
        { label: "Trendler", href: "/trendler" },
        { label: "Tüm rehberler", href: "/rehberler" },
      ]),
    },
    {
      title: "Kurumsal",
      links: pick([
        { label: "Hakkımızda", href: "/hakkimizda" },
        { label: "Editoryal ilkeler", href: "/editoryal-ilkeler" },
        { label: "İletişim", href: "/iletisim" },
        { label: "Gizlilik", href: "/gizlilik" },
        { label: "KVKK aydınlatma metni", href: "/kvkk" },
        { label: "Çerez politikası", href: "/cerez-politikasi" },
      ]),
    },
  ].filter((c) => c.links.length);
}

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

const SIZE_ORDER = ["xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl", "10xl"];
function sizeRank(s: string): number {
  const n = Number(s);
  if (!Number.isNaN(n)) return n;
  const i = SIZE_ORDER.indexOf(s.toLowerCase());
  return i === -1 ? 999 : 1000 + i;
}

/** "Bedene göre" kısayolları: yalnız gerçek beden rehberi sayfası olan bedenler. */
export function sizeLinks(silo: GenderSilo): NavLink[] {
  const guides = listLive((d) => d.type === "SIZE_GUIDE" && d.index && (d.silo === silo || d.silo === "ortak"));
  // Önce silonun kendi rehberleri, sonra ortak
  guides.sort((a, b) => (a.silo === silo ? 0 : 1) - (b.silo === silo ? 0 : 1));
  const seen = new Map<string, NavLink>();
  for (const g of guides) {
    for (const raw of g.sizes) {
      const s = raw.trim();
      const isLetter = /xl$/i.test(s);
      if (silo === "kadin" && isLetter && g.silo === "ortak") continue; // kadında numara kısayolları
      if (silo === "erkek" && !isLetter && g.silo === "ortak") continue;
      const key = s.toLowerCase();
      if (!seen.has(key)) seen.set(key, { label: isLetter ? s.toUpperCase() : `${s} beden`, href: g.path });
    }
  }
  return [...seen.entries()].sort(([a], [b]) => sizeRank(a) - sizeRank(b)).map(([, v]) => v);
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

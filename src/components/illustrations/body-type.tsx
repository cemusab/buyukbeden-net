import type { ReactNode } from "react";
import { Fallback, Svg, TONES, lerp, profileAt, pt, r1, smooth, type BaseProps, type Pt, type Silo, type Tone } from "./shared";

/**
 * Moda krokisi tarzında vücut tipi figürü (önden görünüm).
 * İnce koyu çizgi, yüzsüz baş + sade saç çizgisi, gerçekçi ve dolgun oranlar;
 * giysi yumuşak pastel dolgu. Omuz (S), göğüs (B), bel (W), karın (Wb), basen/kalça (H),
 * üst bacak (T), diz (K), baldır (Cf), bilek (A) yarı genişliklerinden parametrik üretilir.
 * Boy varyantlarında baş ölçüsü sabit kalır, gövde ve bacak boyu değişir: figürün
 * karo içindeki yüksekliği boy farkını gösterir.
 */

export const BODY_TYPES = {
  kadin: ["kum-saati", "armut", "elma", "dikdortgen", "ters-ucgen", "boyu-uzun", "boyu-kisa"],
  erkek: ["oval", "dikdortgen", "ters-ucgen", "trapez", "boyu-uzun", "boyu-kisa"],
} as const;

export type KadinBodyType = (typeof BODY_TYPES.kadin)[number];
export type ErkekBodyType = (typeof BODY_TYPES.erkek)[number];
export type BodyTypeKey = KadinBodyType | ErkekBodyType;

export const BODY_TYPE_LABELS: Record<Silo, Record<string, string>> = {
  kadin: {
    "kum-saati": "Kum Saati",
    armut: "Armut",
    elma: "Elma",
    dikdortgen: "Dikdörtgen",
    "ters-ucgen": "Ters Üçgen",
    "boyu-uzun": "Boyu Uzun",
    "boyu-kisa": "Boyu Kısa",
  },
  erkek: {
    oval: "Oval",
    dikdortgen: "Dikdörtgen",
    "ters-ucgen": "Ters Üçgen",
    trapez: "Trapez",
    "boyu-uzun": "Boyu Uzun",
    "boyu-kisa": "Boyu Kısa",
  },
};

/** Pastel giysi rengi + karo zemini. */
export type BodyTypeSwatch = { garment: string; tile: string };
const SW = {
  sage: { garment: "#B9CEB0", tile: "#EEF3EA" },
  butter: { garment: "#EEDD9C", tile: "#FAF5E0" },
  pink: { garment: "#E6B8BE", tile: "#F8ECEC" },
  blue: { garment: "#B5CBDF", tile: "#EAF1F7" },
  grey: { garment: "#CBC8C4", tile: "#F2F1EF" },
  peach: { garment: "#EFC8A9", tile: "#FBF0E7" },
  lilac: { garment: "#CDC3DD", tile: "#F2EFF7" },
} satisfies Record<string, BodyTypeSwatch>;
export const BODY_TYPE_SWATCHES = SW;

const PALETTE: Record<Silo, Record<string, BodyTypeSwatch>> = {
  kadin: { "kum-saati": SW.sage, armut: SW.butter, elma: SW.pink, dikdortgen: SW.blue, "ters-ucgen": SW.lilac, "boyu-uzun": SW.grey, "boyu-kisa": SW.peach },
  erkek: { oval: SW.blue, dikdortgen: SW.grey, "ters-ucgen": SW.sage, trapez: SW.peach, "boyu-uzun": SW.lilac, "boyu-kisa": SW.butter },
};

export function bodyTypeSwatch(silo: Silo, shape: string): BodyTypeSwatch {
  return PALETTE[silo]?.[shape] ?? SW.grey;
}

/* ---------------- ölçüler ---------------- */

export type FigureDims = { S: number; B: number; W: number; Wb: number; H: number; T: number; K: number; Cf: number; A: number };

const DIMS: Record<Silo, Record<string, FigureDims>> = {
  kadin: {
    "kum-saati": { S: 50, B: 52, W: 39, Wb: 45, H: 56, T: 51.5, K: 30, Cf: 29, A: 17 },
    armut: { S: 41.5, B: 43, W: 40.5, Wb: 48.5, H: 60, T: 57, K: 32.5, Cf: 30.5, A: 17.5 },
    elma: { S: 44.5, B: 53, W: 57, Wb: 59, H: 49, T: 43, K: 27, Cf: 26, A: 16 },
    dikdortgen: { S: 46.5, B: 47, W: 46, Wb: 46.5, H: 47.5, T: 45, K: 29, Cf: 28, A: 16.5 },
    "ters-ucgen": { S: 58, B: 54, W: 43.5, Wb: 43.5, H: 42.5, T: 40, K: 27.5, Cf: 26.5, A: 16 },
    "boyu-uzun": { S: 47, B: 49, W: 42, Wb: 46, H: 52, T: 48, K: 29.5, Cf: 28.5, A: 17 },
    "boyu-kisa": { S: 47, B: 49, W: 42, Wb: 46, H: 52, T: 48, K: 29.5, Cf: 28.5, A: 17 },
  },
  erkek: {
    oval: { S: 51, B: 55, W: 59, Wb: 61, H: 54, T: 48, K: 31, Cf: 30, A: 18 },
    dikdortgen: { S: 50, B: 50, W: 50, Wb: 50.5, H: 50.5, T: 46.5, K: 30.5, Cf: 29.5, A: 18 },
    "ters-ucgen": { S: 65, B: 59, W: 45, Wb: 45, H: 44.5, T: 42, K: 29.5, Cf: 28.5, A: 17.5 },
    trapez: { S: 59, B: 57, W: 50, Wb: 51, H: 51.5, T: 47.5, K: 31, Cf: 30, A: 18 },
    "boyu-uzun": { S: 53, B: 53, W: 51, Wb: 53, H: 51, T: 47, K: 30.5, Cf: 29.5, A: 18 },
    "boyu-kisa": { S: 53, B: 53, W: 51, Wb: 53, H: 51, T: 47, K: 30.5, Cf: 29.5, A: 18 },
  },
};

/** Boy çarpanı: baş sabit, gövde+bacak uzar/kısalır. */
const HEIGHT: Record<string, number> = { "boyu-uzun": 1.13, "boyu-kisa": 0.83 };

/** Beden şeridi için temel (orta beden) ölçüler. */
/** Çizim çekirdeği garment-croquis.tsx ile paylaşılır (dahili). */
export const BASE_DIMS: Record<Silo, FigureDims> = {
  kadin: { S: 47, B: 50, W: 43, Wb: 47, H: 53, T: 49, K: 30, Cf: 29, A: 17 },
  erkek: { S: 54, B: 54, W: 52, Wb: 54, H: 51.5, T: 47.5, K: 31, Cf: 30, A: 18 },
};

/* ---------------- çizim sabitleri ---------------- */

export const INK = "var(--illu-croquis-ink, #2B2724)";
export const LINE = 1.25;
export const VB_W = 200;
export const VB_H = 400;
export const GROUND = 390;
const HEAD_RY = 19.5;
const BASE_FIG_H = 330;

type Garment = "elbise" | "bluz-pantolon" | "tisort-pantolon" | "gomlek-pantolon";
export const BODY_TYPE_GARMENTS: Record<Silo, readonly Garment[]> = {
  kadin: ["elbise", "bluz-pantolon"],
  erkek: ["tisort-pantolon", "gomlek-pantolon"],
};

export type Geo = ReturnType<typeof geometry>;

/** Genişlik ölçeği: tablo değerleri okunaklı oranlar için verilir, çizimde bu çarpanla incelir. */
const WSCALE = 0.8;

export function geometry(silo: Silo, d0: FigureDims, hScale: number, cx: number) {
  const fem = silo === "kadin";
  const d = Object.fromEntries(Object.entries(d0).map(([k, v]) => [k, v * WSCALE])) as FigureDims;
  const figH = HEAD_RY * 2 + 13 + (BASE_FIG_H - HEAD_RY * 2 - 13) * hScale;
  const top = GROUND - figH;
  const headCy = top + HEAD_RY;
  const chin = top + HEAD_RY * 2;
  const ySh = chin + 13;
  const R = GROUND - 2 - ySh;
  const y = (f: number) => ySh + f * R;
  const lv = {
    armpit: y(0.075),
    bust: y(0.13),
    underbust: y(0.19),
    waist: y(fem ? 0.25 : 0.27),
    belly: y(fem ? 0.32 : 0.33),
    hip: y(0.395),
    crotch: y(0.445),
    mid: y(0.56),
    knee: y(0.69),
    calf: y(0.785),
    ankle: y(0.95),
    sole: GROUND - 1,
  };
  const torso: Pt[] = [
    [lv.armpit, d.B * 0.92],
    [lv.bust, d.B],
    [lv.underbust, lerp(d.B, d.W, 0.6)],
    [lv.waist, d.W],
    [lv.belly, d.Wb],
    [lv.hip, d.H],
    [lv.crotch, d.T],
    [lv.mid, lerp(d.T, d.K, 0.47)],
    [lv.knee, d.K],
    [lv.calf, d.Cf],
    [lv.ankle, d.A],
  ];
  const gap = Math.max(0, Math.min(1, (47 - d.T) / 6)) * 1.6;
  const inner: Pt[] = [
    [lv.crotch, 0.6],
    [lv.mid, 1.1 + gap],
    [lv.knee, 3 + gap * 0.6],
    [lv.calf, 4.4 + gap * 0.4],
    [lv.ankle, 5.6],
  ];
  const nw = fem ? 6.6 : 8.4;
  const au = (fem ? 10.4 : 11.4) + (d.B - (fem ? 40 : 44)) * 0.16;
  const we = au * 0.74;
  const ww = au * 0.45;
  const armLen = 0.425 * R;
  const J: Pt = [cx + d.S - au * 1.02, ySh + 6];
  // bileği, kol iç kenarı gövdeden ayrılana kadar dışa aç
  const clearance = 2.5;
  const maxTheta = 0.3;
  let theta = 0.015;
  let W: Pt = [J[0], J[1] + armLen];
  const wAt = (t: number) => (t < 0.5 ? lerp(au, we, t / 0.5) : t <= 1 ? lerp(we, ww, (t - 0.5) / 0.5) : ww + 0.6);
  for (let i = 0; i < 200; i++) {
    W = [J[0] + Math.sin(theta) * armLen, J[1] + Math.cos(theta) * armLen];
    let ok = true;
    // kollar gövdenin arkasından iner; yalnız el ve bilek gövde/giysi hattının dışında kalmalı
    for (let t = 0.9; t <= 1.2; t += 0.03) {
      const px = lerp(J[0], W[0], t);
      const py = lerp(J[1], W[1], t);
      if (py < lv.underbust + 4) continue;
      if (px - wAt(t) - clearance < cx + profileAt(torso, py) + 2) {
        ok = false;
        break;
      }
    }
    if (ok || theta >= maxTheta) break;
    theta += 0.006;
  }
  const u: Pt = [(W[0] - J[0]) / armLen, (W[1] - J[1]) / armLen];
  const n: Pt = [u[1], -u[0]]; // sağ kol için dışa bakan normal
  return { silo, fem, d, cx, top, headCy, chin, ySh, R, lv, torso, inner, nw, au, we, ww, armLen, J, W, u, n, wAt };
}

export const at = (g: Geo, t: number, side: number, extra = 0): Pt => {
  const w = (g.wAt(t) + extra) * side;
  return [g.J[0] + g.u[0] * g.armLen * t + g.n[0] * w, g.J[1] + g.u[1] * g.armLen * t + g.n[1] * w];
};

export const mir = (cx: number) => (p: Pt): Pt => [2 * cx - p[0], p[1]];

/** Sağ taraf profil noktaları (mutlak). */
export function sample(fn: (y: number) => number, y0: number, y1: number, cx: number, step = 5): Pt[] {
  const out: Pt[] = [];
  const n = Math.max(2, Math.ceil(Math.abs(y1 - y0) / step));
  for (let i = 0; i <= n; i++) {
    const y = y0 + ((y1 - y0) * i) / n;
    out.push([cx + fn(y), y]);
  }
  return out;
}

/** Simetrik kapalı şekil: sağ dış hat (yukarıdan aşağı) + alt bağlantı + sol dış hat. */
export function symmetric(right: Pt[], cx: number, bottom?: (a: Pt, b: Pt) => string, topJoin?: (a: Pt, b: Pt) => string) {
  const m = mir(cx);
  const left = right.slice().reverse().map(m);
  const lastR = right[right.length - 1];
  const firstL = left[0];
  const join = bottom ? bottom(lastR, firstL) : ` L${pt(firstL)}`;
  const close = topJoin ? topJoin(left[left.length - 1], right[0]) : " Z";
  return `${smooth(right)}${join} ${smooth(left, { move: false }).replace(/^L[^C]*/, "")}${close}`;
}

/* ---------------- parçalar ---------------- */

export function bodyPath(g: Geo) {
  const { cx, d, lv, nw, ySh, chin } = g;
  const right: Pt[] = [
    [cx + nw, chin - 4],
    [cx + nw + 0.4, ySh - 11],
    [cx + nw + 7, ySh - 6.5],
    [cx + d.S - g.au * 0.9, ySh - 2.2],
    [cx + d.S - g.au * 0.5, ySh + 4],
    [cx + d.B * 0.92, lv.armpit],
    ...sample((y) => profileAt(g.torso, y), lv.bust, lv.ankle, cx),
  ];
  const innerUp = sample((y) => profileAt(g.inner, y), lv.ankle, lv.crotch, cx, 6);
  const m = mir(cx);
  return [
    smooth(right),
    smooth(innerUp, { move: false }),
    smooth(innerUp.slice().reverse().map(m), { move: false }),
    smooth(right.slice().reverse().map(m), { move: false }),
    "Z",
  ].join(" ");
}

export function armPath(g: Geo, side: 1 | -1) {
  const { cx, ySh, d } = g;
  const raw: Pt[] = [
    at(g, 0.2, -1),
    [cx + d.S - g.au * 1.35, ySh - 0.4],
    [cx + d.S - g.au * 0.35, ySh - 1.2],
    at(g, 0.02, 1, 0.6),
    at(g, 0.2, 1, 0.5),
    at(g, 0.5, 1, 0.2),
    at(g, 0.78, 1),
    at(g, 1, 1),
  ];
  const back: Pt[] = [at(g, 1, -1), at(g, 0.74, -1), at(g, 0.48, -1, -0.2), at(g, 0.2, -1)];
  const f = side === 1 ? (p: Pt) => p : mir(cx);
  return `${smooth(raw.map(f))} L${pt(f(back[0]))} ${smooth(back.map(f), { move: false }).replace(/^L[^C]*/, "")} Z`;
}

export function handPath(g: Geo, side: 1 | -1) {
  const { W, u, n, ww, fem } = g;
  const len = fem ? 14 : 15.5;
  const loc: [number, number][] = [
    [-ww + 0.1, -3],
    [-ww - 0.4, len * 0.42],
    [-ww * 0.4, len * 0.92],
    [0.4, len],
    [ww * 0.45, len * 0.9],
    [ww + 0.2, len * 0.45],
    [ww - 0.1, -3],
  ];
  const pts = loc.map(([a, b]): Pt => [W[0] + n[0] * a + u[0] * b, W[1] + n[1] * a + u[1] * b]);
  const f = side === 1 ? (p: Pt) => p : mir(g.cx);
  return smooth(pts.map(f), { closed: true });
}

export function sleevePath(g: Geo, side: 1 | -1, t: number, ease: number) {
  const { cx, ySh, d } = g;
  const raw: Pt[] = [
    at(g, 0.12, -1, ease * 0.6),
    [cx + d.S - g.au * 1.5, ySh - 2.8],
    [cx + d.S - g.au * 0.45, ySh - 3.3],
    at(g, 0.03, 1, 0.3 + ease * 0.7),
    at(g, t, 1, ease + 0.6),
  ];
  const f = side === 1 ? (p: Pt) => p : mir(cx);
  const a = f(at(g, t + 0.06, -1, ease + 0.2));
  const m = f(at(g, t + 0.045, 0));
  return `${smooth(raw.map(f))} Q${pt(m)} ${pt(a)} Z`;
}

export function feet(g: Geo, side: 1 | -1) {
  const { cx, d, lv, fem } = g;
  const inn = profileAt(g.inner, lv.ankle);
  const o = d.A;
  const s = lv.sole;
  const ya = lv.ankle - 4;
  const grow = fem ? 2.4 : 3.2;
  const pts: Pt[] = [
    [inn, ya],
    [inn - 0.4, lv.ankle + 5],
    [inn + 0.6, s - 4],
    [(inn + o) / 2 + 1.5, s + 0.4],
    [o + grow, s - 3.5],
    [o + grow * 0.5, lv.ankle + 6],
    [o, ya],
  ];
  const abs = pts.map(([x, y]): Pt => (side === 1 ? [cx + x, y] : [cx - x, y]));
  const fill = `${smooth(abs)} Z`;
  const stroke = smooth(abs.slice(1, -1));
  return { fill, stroke, vamp: `M${pt(abs[1])} Q${pt([(abs[1][0] + abs[5][0]) / 2, lv.ankle + (fem ? 11 : 7)])} ${pt(abs[5])}` };
}

/** Giysi omuz dikişi → koltuk altı (kol oyuğu) noktaları. */
export function armhole(g: Geo, e: number): Pt[] {
  const { cx, d, ySh, lv } = g;
  const s0: Pt = [cx + d.S - g.au * 1.3, ySh - 3.2];
  const s1: Pt = [cx + d.B * 0.92 + e, lv.armpit];
  return [s0, [lerp(s0[0], s1[0], 0.3) - 0.6, lerp(s0[1], s1[1], 0.55)], s1];
}

/** Kollar gövdeden ne kadar dışarıda (giysi kol ağzı hesabı). */
export function torsoAt(g: Geo, y: number) {
  return profileAt(g.torso, y);
}

/** En geniş gövde noktası (y aralığında). */
export function widest(g: Geo, y0: number, y1: number) {
  let best = { y: y0, x: torsoAt(g, y0) };
  for (let y = y0; y <= y1; y += 1) {
    const x = torsoAt(g, y);
    if (x > best.x) best = { y, x };
  }
  return best;
}

export function dressPath(g: Geo) {
  const { cx, d, lv, nw, ySh, R } = g;
  const e = 1.7;
  const hemY = ySh + 0.735 * R;
  const wd = widest(g, lv.waist, lv.crotch);
  const start = wd.x + e;
  // karından düşen etek basen hizasına doğru toplanır (elma), basenden düşen düz iner
  const hemHalf = Math.max(lerp(start, d.H + e, 0.6) * 0.9, d.K + 8);
  const fn = (y: number) => {
    const base = torsoAt(g, y) + e;
    if (y <= wd.y) return base;
    const t = Math.min(1, (y - wd.y) / (hemY - wd.y));
    return Math.max(base, lerp(start, hemHalf, t * t));
  };
  const right: Pt[] = [
    [cx + nw + 6.5, ySh - 8.6],
    ...armhole(g, e),
    ...sample(fn, lv.bust, hemY, cx),
  ];
  const neckDip = ySh + 0.06 * R;
  return symmetric(
    right,
    cx,
    (a, b) => ` Q${pt([cx, hemY + 4])} ${pt(b)}`,
    (a, b) => ` Q${pt([cx, neckDip])} ${pt(b)} Z`
  );
}

function blousePath(g: Geo) {
  const { cx, lv, nw, ySh, R } = g;
  const e = 2;
  const hemY = ySh + 0.47 * R;
  const wd = widest(g, lv.waist, hemY);
  const fn = (y: number) => {
    const base = torsoAt(g, y) + e;
    if (y <= wd.y) return base;
    return Math.max(base, wd.x + e + (y - wd.y) * 0.06);
  };
  const right: Pt[] = [
    [cx + nw + 5.5, ySh - 8.8],
    ...armhole(g, e),
    ...sample(fn, lv.bust, hemY, cx),
  ];
  return symmetric(
    right,
    cx,
    (a, b) => ` Q${pt([cx, hemY + 3])} ${pt(b)}`,
    (a, b) => ` L${pt([cx, ySh + 0.085 * R])} L${pt(b)} Z`
  );
}

function teePath(g: Geo, collar: boolean) {
  const { cx, lv, nw, ySh, R } = g;
  const e = 1.8;
  const hemY = ySh + (collar ? 0.455 : 0.435) * R;
  const wd = widest(g, lv.waist - 6, hemY);
  const fn = (y: number) => {
    const base = torsoAt(g, y) + e;
    if (y <= wd.y) return base;
    return Math.max(base, wd.x + e - (y - wd.y) * 0.02);
  };
  const right: Pt[] = [
    [cx + nw + 2.6, ySh - 10.5],
    ...armhole(g, e),
    ...sample(fn, lv.bust, hemY, cx),
  ];
  return symmetric(
    right,
    cx,
    (a, b) => ` Q${pt([cx, hemY + 2])} ${pt(b)}`,
    collar ? (a, b) => ` L${pt([cx, ySh - 1])} L${pt(b)} Z` : (a, b) => ` Q${pt([cx, ySh - 1.5])} ${pt(b)} Z`
  );
}

export function trouserPath(g: Geo, topY: number) {
  const { cx, d, lv } = g;
  const outer: Pt[] = [
    [topY, torsoAt(g, topY) + 2.2],
    [lv.hip, d.H + 2.6],
    [lv.crotch, d.T + 2.6],
    [lv.knee, d.K + 4.2],
    [lv.ankle + 4, d.K + 2.6],
  ];
  const inner: Pt[] = [
    [lv.crotch + 3, 1],
    [lv.knee, 3.4],
    [lv.ankle + 4, 3.8],
  ];
  const bottom = lv.ankle + 4;
  const right = sample((y) => profileAt(outer, y), topY, bottom, cx);
  const innerUp = sample((y) => profileAt(inner, y), bottom, lv.crotch + 3, cx, 8);
  const m = mir(cx);
  return {
    d: [
      smooth(right),
      smooth(innerUp, { move: false }),
      smooth(innerUp.slice().reverse().map(m), { move: false }),
      smooth(right.slice().reverse().map(m), { move: false }),
      "Z",
    ].join(" "),
    crease: (side: 1 | -1) => {
      const x0 = cx + side * ((d.T + 3.6) / 2);
      const x1 = cx + side * ((d.K + 2.6 + 3.8) / 2);
      return `M${pt([x0, lv.crotch + 10])} L${pt([x1, bottom - 6])}`;
    },
  };
}

export function Head({ g, skin, hair }: { g: Geo; skin: string; hair: string | null }) {
  const { cx, headCy: cy, fem } = g;
  const rx = fem ? 14.6 : 15.4;
  const ry = HEAD_RY;
  const top = cy - ry;
  if (hair === null) return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={skin} stroke={INK} strokeWidth={LINE} />;
  if (fem) {
    // çene hizasına inen yumuşak küt saç: dış hat + yüzü çerçeveleyen iç hat ve yan ayrım
    const outer: Pt[] = [
      [cx - rx - 2.6, cy + 10.5],
      [cx - rx - 4.4, cy - 2],
      [cx - rx - 1.2, top + 3],
      [cx + 2, top - 3.4],
      [cx + rx + 1.8, top + 2],
      [cx + rx + 4.6, cy - 1],
      [cx + rx + 3, cy + 10.5],
    ];
    const inner: Pt[] = [
      [cx + rx - 1.6, cy + 9.5],
      [cx + rx - 0.6, cy - 1],
      [cx + rx - 3, top + 11],
      [cx + 8, top + 8.5],
      [cx + 3.6, top + 5.4],
      [cx - 4, top + 7.2],
      [cx - rx + 2.6, top + 10.5],
      [cx - rx + 0.6, cy],
      [cx - rx + 1.4, cy + 9.5],
    ];
    const d = `${smooth(outer)} L${pt(inner[0])} ${smooth(inner, { move: false }).replace(/^L[^C]*/, "")} Z`;
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={skin} stroke={INK} strokeWidth={LINE} />
        <path d={d} fill={hair} stroke={INK} strokeWidth={LINE} />
        <path d={`M${pt([cx + 3.6, top + 5.4])} Q${pt([cx + 3, top + 1])} ${pt([cx + 2.4, top - 2.8])}`} stroke={INK} strokeWidth={0.8} opacity={0.55} />
      </g>
    );
  }
  const outer: Pt[] = [
    [cx - rx + 0.2, cy - 1],
    [cx - rx - 0.9, top + 8],
    [cx - 6, top - 1.8],
    [cx + 5, top - 2.2],
    [cx + rx + 0.9, top + 7.5],
    [cx + rx - 0.2, cy - 1],
  ];
  const inner: Pt[] = [
    [cx + rx - 1.1, cy - 1.5],
    [cx + rx - 2.2, top + 10],
    [cx + 5, top + 7.6],
    [cx - 3, top + 8.4],
    [cx - rx + 2.2, top + 10.2],
    [cx - rx + 1.1, cy - 1.5],
  ];
  const d = `${smooth(outer)} L${pt(inner[0])} ${smooth(inner, { move: false }).replace(/^L[^C]*/, "")} Z`;
  return (
    <g>
      <ellipse cx={cx - rx + 0.5} cy={cy + 1.5} rx={2.6} ry={4.4} fill={skin} stroke={INK} strokeWidth={LINE} />
      <ellipse cx={cx + rx - 0.5} cy={cy + 1.5} rx={2.6} ry={4.4} fill={skin} stroke={INK} strokeWidth={LINE} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={skin} stroke={INK} strokeWidth={LINE} />
      <path d={d} fill={hair} stroke={INK} strokeWidth={LINE} />
    </g>
  );
}

function GuideLines({ g, vbW }: { g: Geo; vbW: number }) {
  const { cx, d, lv, ySh, silo } = g;
  const rows: { y: number; half: number; label: string }[] = [
    { y: ySh + 1, half: d.S, label: "Omuz" },
    { y: silo === "erkek" ? lv.belly : lv.waist, half: silo === "erkek" ? d.Wb : d.W, label: "Bel" },
    { y: lv.hip, half: d.H, label: silo === "kadin" ? "Basen" : "Kalça" },
  ];
  const color = "var(--illu-croquis-guide, #8C6E5D)";
  return (
    <g>
      {rows.map((r) => (
        <g key={r.label}>
          <path d={`M4 ${r1(r.y)} H${vbW - 4}`} stroke={color} strokeWidth={0.7} strokeDasharray="2 3" opacity={0.65} />
          <path d={`M${r1(cx - r.half - 1.5)} ${r1(r.y)} H${r1(cx + r.half + 1.5)}`} stroke={color} strokeWidth={1.2} />
          <rect x={vbW - 6 - r.label.length * 5.2} y={r1(r.y - 12)} width={r.label.length * 5.2 + 4} height={10} rx={3} fill="#FFFFFF" opacity={0.85} />
          <text x={vbW - 4} y={r1(r.y - 3)} fontSize={9} fontWeight={600} fill={color} textAnchor="end" fontFamily="inherit">
            {r.label}
          </text>
        </g>
      ))}
    </g>
  );
}

type DrawOpts = { silo: Silo; d: FigureDims; hScale?: number; cx?: number; tone?: Tone; garment?: string; color: string };

/** Figürün kendisi (<g>); karo ve başlık çağırana aittir. */
function Croquis({ silo, d, hScale = 1, cx = VB_W / 2, tone, garment, color }: DrawOpts) {
  const g = geometry(silo, d, hScale, cx);
  const skin = tone && TONES[tone] ? TONES[tone].skin : "var(--illu-croquis-skin, #FFFBF7)";
  const hair = tone && TONES[tone] ? TONES[tone].hair : "var(--illu-croquis-hair, #E7DED4)";
  const kind: Garment = (BODY_TYPE_GARMENTS[silo] as readonly string[]).includes(garment ?? "") ? (garment as Garment) : BODY_TYPE_GARMENTS[silo][0];
  const stroke = { stroke: INK, strokeWidth: LINE } as const;
  const lower = "var(--illu-croquis-lower, #DAD6D1)";
  const shoe = silo === "erkek" ? "var(--illu-croquis-shoe, #6F6862)" : skin;
  const parts: ReactNode[] = [];
  let sleeves: ReactNode = null;
  const fr = feet(g, 1);
  const fl = feet(g, -1);
  const feetNode = (
    <g>
      {[fr, fl].map((f, i) => (
        <g key={i}>
          <path d={f.fill} fill={shoe} />
          <path d={f.stroke} {...stroke} />
          {silo === "kadin" ? <path d={f.vamp} stroke={INK} strokeWidth={0.8} opacity={0.6} /> : null}
        </g>
      ))}
    </g>
  );
  if (kind === "elbise") {
    parts.push(<path key="dress" d={dressPath(g)} fill={color} {...stroke} />);
    parts.push(
      <path
        key="seam"
        d={`M${pt([cx - g.d.W - 1, g.lv.waist + 1])} Q${pt([cx, g.lv.waist + 3.5])} ${pt([cx + g.d.W + 1, g.lv.waist + 1])}`}
        stroke={INK}
        strokeWidth={0.75}
        opacity={0.45}
      />
    );
    sleeves = (
      <g>
        <path d={sleevePath(g, 1, 0.19, 1.1)} fill={color} {...stroke} />
        <path d={sleevePath(g, -1, 0.19, 1.1)} fill={color} {...stroke} />
      </g>
    );
  } else if (kind === "bluz-pantolon") {
    const tr = trouserPath(g, g.lv.waist + 4);
    parts.push(<path key="tr" d={tr.d} fill={lower} {...stroke} />);
    parts.push(<path key="bl" d={blousePath(g)} fill={color} {...stroke} />);
    sleeves = (
      <g>
        <path d={sleevePath(g, 1, 0.46, 1.6)} fill={color} {...stroke} />
        <path d={sleevePath(g, -1, 0.46, 1.6)} fill={color} {...stroke} />
      </g>
    );
  } else {
    const collar = kind === "gomlek-pantolon";
    const tr = trouserPath(g, g.lv.belly + 2);
    parts.push(<path key="tr" d={tr.d} fill={lower} {...stroke} />);
    parts.push(<path key="c1" d={tr.crease(1)} stroke={INK} strokeWidth={0.7} opacity={0.35} />);
    parts.push(<path key="c2" d={tr.crease(-1)} stroke={INK} strokeWidth={0.7} opacity={0.35} />);
    parts.push(<path key="tee" d={teePath(g, collar)} fill={color} {...stroke} />);
    if (collar) {
      const y0 = g.ySh - 1;
      const hem = g.ySh + 0.455 * g.R;
      parts.push(<path key="placket" d={`M${pt([cx, y0])} V${r1(hem)}`} stroke={INK} strokeWidth={0.8} opacity={0.55} />);
      parts.push(
        <path
          key="collar"
          d={`M${pt([cx - g.nw - 2.6, g.ySh - 10.5])} L${pt([cx - 3.5, g.ySh + 2])} L${pt([cx, g.ySh - 1])} L${pt([cx + 3.5, g.ySh + 2])} L${pt([cx + g.nw + 2.6, g.ySh - 10.5])}`}
          fill={color}
          stroke={INK}
          strokeWidth={0.9}
        />
      );
    } else {
      parts.push(
        <path key="rib" d={`M${pt([cx - g.nw - 2.4, g.ySh - 8.4])} Q${pt([cx, g.ySh + 1.4])} ${pt([cx + g.nw + 2.4, g.ySh - 8.4])}`} stroke={INK} strokeWidth={0.75} opacity={0.5} />
      );
    }
    sleeves = (
      <g>
        <path d={sleevePath(g, 1, 0.36, 2)} fill={color} {...stroke} />
        <path d={sleevePath(g, -1, 0.36, 2)} fill={color} {...stroke} />
      </g>
    );
  }
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx={cx} cy={GROUND + 0.5} rx={g.d.H * 0.95} ry={4} fill={INK} opacity={0.06} />
      <path d={handPath(g, 1)} fill={skin} {...stroke} />
      <path d={handPath(g, -1)} fill={skin} {...stroke} />
      <path d={armPath(g, 1)} fill={skin} {...stroke} />
      <path d={armPath(g, -1)} fill={skin} {...stroke} />
      <path d={bodyPath(g)} fill={skin} {...stroke} />
      {feetNode}
      {sleeves}
      {parts}
      <Head g={g} skin={skin} hair={hair} />
    </g>
  );
}

/* ---------------- dışa açık bileşenler ---------------- */

export type BodyTypeFigureProps = BaseProps & {
  silo: Silo;
  shape: string;
  tone?: Tone;
  /** kadın: elbise | bluz-pantolon; erkek: tisort-pantolon | gomlek-pantolon */
  garment?: string;
  /** Omuz/Bel/Basen (erkekte Kalça) yardımcı çizgileri */
  guides?: boolean;
  /** Pastel karo zemini (varsayılan açık) */
  tile?: boolean;
};

export function BodyTypeFigure({ silo, shape, tone, garment, guides = false, tile = true, ...rest }: BodyTypeFigureProps) {
  const d = DIMS[silo]?.[shape];
  if (!d) return <Fallback viewBox={`0 0 ${VB_W} ${VB_H}`} {...rest} />;
  const sw = bodyTypeSwatch(silo, shape);
  const hScale = HEIGHT[shape] ?? 1;
  const g = guides ? geometry(silo, d, hScale, VB_W / 2) : null;
  return (
    <Svg viewBox={`0 0 ${VB_W} ${VB_H}`} {...rest}>
      {tile ? <rect width={VB_W} height={VB_H} rx={16} fill={sw.tile} /> : null}
      <Croquis silo={silo} d={d} hScale={hScale} tone={tone} garment={garment} color={sw.garment} />
      {g ? <GuideLines g={g} vbW={VB_W} /> : null}
    </Svg>
  );
}

export type ScaledBodyFigureProps = BaseProps & {
  silo: Silo;
  /** Temel (orta beden) figüre göre çevre oranları: üst = göğüs, bel, alt = basen/kalça */
  ratios: { upper: number; waist: number; lower: number };
  color?: string;
  garment?: string;
  tone?: Tone;
};

/** Aynı kıyafet, farklı bedenler: temel figür kaynaklı çevre oranlarıyla ölçeklenir. */
export function ScaledBodyFigure({ silo, ratios, color, garment, tone, ...rest }: ScaledBodyFigureProps) {
  const b = BASE_DIMS[silo];
  if (!b) return <Fallback viewBox={`0 0 ${VB_W} ${VB_H}`} {...rest} />;
  const { upper, waist, lower } = ratios;
  // Omuz ve eklemler çevreden daha yavaş büyür: oranın yarısı kadar (illüstrasyon varsayımı).
  const soft = (r: number, k: number) => 1 + (r - 1) * k;
  const d: FigureDims = {
    S: b.S * soft(upper, 0.5),
    B: b.B * upper,
    W: b.W * waist,
    Wb: b.Wb * lerp(waist, lower, 0.35),
    H: b.H * lower,
    T: b.T * lower,
    K: b.K * soft(lower, 0.6),
    Cf: b.Cf * soft(lower, 0.6),
    A: b.A * soft(lower, 0.3),
  };
  return (
    <Svg viewBox={`0 0 ${VB_W} ${VB_H}`} {...rest}>
      <Croquis silo={silo} d={d} tone={tone} garment={garment} color={color ?? (silo === "kadin" ? SW.sage.garment : SW.blue.garment)} />
    </Svg>
  );
}

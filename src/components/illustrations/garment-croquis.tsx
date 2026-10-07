import type { ReactNode } from "react";
import { Fallback, Svg, TONES, lerp, profileAt, pt, r1, smooth, type BaseProps, type Pt, type Silo, type Tone } from "./shared";
import {
  BASE_DIMS,
  GROUND,
  Head,
  INK,
  LINE,
  VB_H,
  VB_W,
  armPath,
  armhole,
  at,
  bodyPath,
  feet,
  geometry,
  handPath,
  mir,
  sample,
  sleevePath,
  symmetric,
  torsoAt,
  widest,
  type FigureDims,
  type Geo,
} from "./body-type";

/**
 * Kategori karoları için moda krokisi: vücut tipi figürüyle aynı yüzsüz, dolgun ve saygılı manken,
 * kategori kıyafetini yumuşak pastel/nötr dolguyla giyer. İç giyim ve ayakkabıda manken yoktur
 * (askıda/katlanmış ürün natürmortu). Bilinmeyen kategori → nötr yedek.
 */

export const GARMENT_CROQUIS_KEYS = {
  kadin: [
    "elbise", "tunik", "pantolon", "jean", "tayt", "etek", "sort", "tisort", "gomlek", "bluz", "triko", "hirka", "sweatshirt",
    "ceket", "mont", "kaban", "abiye", "tesettur", "mayo-hasema", "esofman", "spor-giyim", "ic-giyim", "ev-giyimi", "ayakkabi",
  ],
  erkek: [
    "tisort", "polo", "gomlek", "pantolon", "jean", "esofman", "sweatshirt", "triko", "hirka", "mont", "takim-elbise",
    "sort-deniz-sortu", "spor-giyim", "ic-giyim", "ayakkabi",
  ],
} as const;

type Sw = { c: string; tile: string };
const P = {
  sage: { c: "#B9CEB0", tile: "#EEF3EA" },
  butter: { c: "#EEDD9C", tile: "#FAF5E0" },
  pink: { c: "#E6B8BE", tile: "#F8ECEC" },
  blue: { c: "#B5CBDF", tile: "#EAF1F7" },
  grey: { c: "#CBC8C4", tile: "#F2F1EF" },
  peach: { c: "#EFC8A9", tile: "#FBF0E7" },
  lilac: { c: "#CDC3DD", tile: "#F2EFF7" },
  denim: { c: "#A3B9D3", tile: "#EBF0F6" },
  camel: { c: "#DCC5A4", tile: "#F7F0E6" },
  aqua: { c: "#AED6D2", tile: "#E9F4F3" },
  oat: { c: "#E6D9C2", tile: "#F7F2EA" },
  slate: { c: "#9FA8B4", tile: "#EEF0F3" },
} satisfies Record<string, Sw>;

const SWATCH: Record<Silo, Record<string, Sw>> = {
  kadin: {
    elbise: P.sage, tunik: P.lilac, pantolon: P.blue, jean: P.denim, tayt: P.slate, etek: P.pink, sort: P.butter, tisort: P.peach,
    gomlek: P.blue, bluz: P.pink, triko: P.oat, hirka: P.sage, sweatshirt: P.lilac, ceket: P.camel, mont: P.blue, kaban: P.camel,
    abiye: P.lilac, tesettur: P.sage, "mayo-hasema": P.aqua, esofman: P.grey, "spor-giyim": P.aqua, "ic-giyim": P.pink, "ev-giyimi": P.blue,
    ayakkabi: P.butter,
  },
  erkek: {
    tisort: P.blue, polo: P.sage, gomlek: P.blue, pantolon: P.camel, jean: P.denim, esofman: P.grey, sweatshirt: P.lilac, triko: P.oat,
    hirka: P.sage, mont: P.slate, "takim-elbise": P.grey, "sort-deniz-sortu": P.aqua, "spor-giyim": P.peach, "ic-giyim": P.grey, ayakkabi: P.camel,
  },
};

export function garmentCroquisTile(silo: Silo, category: string): string {
  return SWATCH[silo]?.[category]?.tile ?? P.grey.tile;
}
export function hasGarmentCroquis(silo: string, category: string): boolean {
  return (GARMENT_CROQUIS_KEYS as Record<string, readonly string[]>)[silo]?.includes(category) ?? false;
}

const NEUTRAL_TOP = "var(--illu-croquis-top, #F4F0EA)";
const NEUTRAL_LOW = "var(--illu-croquis-lower, #DAD6D1)";
const S = { stroke: INK, strokeWidth: LINE } as const;
const DETAIL = { stroke: INK, strokeWidth: 0.75, opacity: 0.5 } as const;

/** Kadın kategori figürü: dengeli, hafif belli oran. */
const KADIN_DIMS: FigureDims = { S: 48, B: 50.5, W: 42, Wb: 46, H: 53.5, T: 49.5, K: 30, Cf: 29, A: 17 };
const ERKEK_DIMS: FigureDims = BASE_DIMS.erkek;

/* ---------------- parça üreticileri ---------------- */

type Neck = "crew" | "scoop" | "v" | "high" | "open" | "collar";

/** Üst giysi gövdesi. hem: R oranı; flare: etek ucuna doğru genişleme (birim/px). */
function upper(g: Geo, o: { hem: number; e?: number; neck?: Neck; flare?: number; openTo?: number }) {
  const { cx, lv, nw, ySh, R } = g;
  const e = o.e ?? 2;
  const hemY = ySh + o.hem * R;
  const wd = widest(g, lv.waist - 4, Math.min(hemY, lv.crotch));
  const flare = o.flare ?? 0.02;
  const fn = (y: number) => {
    const base = torsoAt(g, Math.min(y, lv.knee)) + e;
    if (y <= wd.y) return base;
    return Math.max(base, wd.x + e + (y - wd.y) * flare);
  };
  const neck = o.neck ?? "crew";
  const np: Pt =
    neck === "crew" || neck === "collar"
      ? [cx + nw + 2.6, ySh - 10.5]
      : neck === "high"
        ? [cx + nw + 1.2, ySh - 16]
        : neck === "scoop"
          ? [cx + nw + 6.5, ySh - 8.6]
          : [cx + nw + 4.5, ySh - 9.5];
  const right: Pt[] = [np, ...armhole(g, e), ...sample(fn, lv.bust, hemY, cx)];
  const close =
    neck === "crew" || neck === "collar"
      ? (_a: Pt, b: Pt) => ` Q${pt([cx, ySh - 1.5])} ${pt(b)} Z`
      : neck === "high"
        ? (_a: Pt, b: Pt) => ` Q${pt([cx, ySh - 14.5])} ${pt(b)} Z`
        : neck === "scoop"
          ? (_a: Pt, b: Pt) => ` Q${pt([cx, ySh + 0.06 * R])} ${pt(b)} Z`
          : (_a: Pt, b: Pt) => ` L${pt([cx, ySh + (o.openTo ?? 0.1) * R])} L${pt(b)} Z`;
  const d = symmetric(right, cx, (_a, b) => ` Q${pt([cx, hemY + 2])} ${pt(b)}`, close);
  return { d, hemY, w: fn };
}

/** Etek: üst kenar düz, etek ucu yumuşak kavisli. */
function skirt(g: Geo, topY: number, hem: number, flare: number, e = 2) {
  const { cx, ySh, R, lv } = g;
  const hemY = ySh + hem * R;
  const wd = widest(g, topY, Math.min(hemY, lv.crotch));
  const hemHalf = wd.x + e + flare;
  const fn = (y: number) => {
    const base = torsoAt(g, y) + e;
    if (y <= wd.y) return base;
    const t = Math.min(1, (y - wd.y) / (hemY - wd.y));
    return Math.max(base, lerp(wd.x + e, hemHalf, t));
  };
  const right = sample(fn, topY, hemY, cx);
  return { d: symmetric(right, cx, (_a, b) => ` Q${pt([cx, hemY + 4])} ${pt(b)}`, (a, b) => ` L${pt(b)} Z`), hemY, w: fn };
}

/** Pantolon/şort/tayt. bottom: R oranı; style: legging | straight | wide | jogger. */
function legwear(g: Geo, topY: number, bottom: number, style: "legging" | "straight" | "wide" | "jogger" | "short" = "straight") {
  const { cx, d, lv, ySh, R } = g;
  const by = ySh + bottom * R;
  let outer: (y: number) => number;
  let innerX: (y: number) => number;
  if (style === "legging") {
    outer = (y) => torsoAt(g, y) + 0.9;
    innerX = (y) => Math.max(0.5, profileAt(g.inner, y) - 0.5);
  } else {
    const kneeE = style === "wide" ? 9 : style === "jogger" ? 3.4 : style === "short" ? 4.5 : 4.2;
    const hemE = style === "wide" ? 12 : style === "jogger" ? -0.5 : style === "short" ? 4.5 : 2.6;
    const keys: Pt[] = [
      [topY, torsoAt(g, topY) + 2.2],
      [lv.hip, d.H + 2.6],
      [lv.crotch, d.T + 2.8],
      [lv.knee, d.K + kneeE],
      [lv.ankle + 4, d.K + hemE],
    ];
    outer = (y) => Math.max(torsoAt(g, y) + 1.6, profileAt(keys, y));
    const ik: Pt[] = [
      [lv.crotch + 3, 1],
      [lv.knee, style === "wide" ? 1.6 : 3.2],
      [lv.ankle + 4, style === "wide" ? 0.9 : style === "jogger" ? 5.4 : 3.8],
    ];
    innerX = (y) => profileAt(ik, y);
  }
  const right = sample(outer, topY, by, cx);
  const crotchY = style === "legging" ? lv.crotch : lv.crotch + 3;
  const innerUp = sample(innerX, by, crotchY, cx, 8);
  const m = mir(cx);
  const dd = [
    smooth(right),
    smooth(innerUp, { move: false }),
    smooth(innerUp.slice().reverse().map(m), { move: false }),
    smooth(right.slice().reverse().map(m), { move: false }),
    "Z",
  ].join(" ");
  return { d: dd, by, outer, innerX };
}

/** Pantolon dış yan çizgisi (şerit/dikiş): dış hattı içeriden izler. */
function sideLine(g: Geo, outer: (y: number) => number, y0: number, y1: number, s: 1 | -1, inset = 1.8) {
  const pts = sample((y) => outer(y) - inset, y0, y1, g.cx, 6).map((p): Pt => (s === 1 ? p : [2 * g.cx - p[0], p[1]]));
  return smooth(pts);
}

function pair(side: (s: 1 | -1) => ReactNode) {
  return (
    <>
      {side(1)}
      {side(-1)}
    </>
  );
}

function sleeves(g: Geo, t: number, ease: number, fill: string, cuff = false) {
  return pair((s) => (
    <g key={`sl${s}`}>
      <path d={sleevePath(g, s, t, ease)} fill={fill} {...S} />
      {cuff ? <path d={cuffLine(g, s, t - 0.07, ease)} {...DETAIL} /> : null}
    </g>
  ));
}

function cuffLine(g: Geo, side: 1 | -1, t: number, ease: number) {
  const f = side === 1 ? (p: Pt) => p : mir(g.cx);
  return `M${pt(f(at(g, t, -1, ease)))} L${pt(f(at(g, t, 1, ease + 0.4)))}`;
}

function hLine(g: Geo, y: number, w: (y: number) => number, inset = 0.6) {
  const x = w(y) - inset;
  return `M${pt([g.cx - x, y])} Q${pt([g.cx, y + 2])} ${pt([g.cx + x, y])}`;
}

function shirtCollar(g: Geo, fill: string) {
  const { cx, nw, ySh } = g;
  return (
    <path
      d={`M${pt([cx - nw - 2.8, ySh - 10.8])} L${pt([cx - 4.5, ySh + 2.5])} L${pt([cx, ySh - 1])} L${pt([cx + 4.5, ySh + 2.5])} L${pt([cx + nw + 2.8, ySh - 10.8])} Q${pt([cx, ySh - 5])} ${pt([cx - nw - 2.8, ySh - 10.8])} Z`}
      fill={fill}
      stroke={INK}
      strokeWidth={0.9}
    />
  );
}

function buttons(g: Geo, y0: number, y1: number, n: number, x = 0) {
  const out: ReactNode[] = [];
  for (let i = 0; i < n; i++) out.push(<circle key={i} cx={r1(g.cx + x)} cy={r1(lerp(y0, y1, n === 1 ? 0 : i / (n - 1)))} r={1.1} fill={INK} opacity={0.55} />);
  return out;
}

/** Açık önlü dış giyim (ceket, kaban, hırka): V açıklık, orta hat, yaka. */
function openFront(g: Geo, o: { hem: number; e: number; vTo: number; lapel?: boolean; flare?: number }, fill: string) {
  const u = upper(g, { hem: o.hem, e: o.e, neck: "v", openTo: o.vTo, flare: o.flare ?? 0.04 });
  const { cx, ySh, R, nw } = g;
  const vy = ySh + o.vTo * R;
  const nodes: ReactNode[] = [<path key="body" d={u.d} fill={fill} {...S} />];
  nodes.push(<path key="cf" d={`M${pt([cx, vy])} L${pt([cx, u.hemY + 1.5])}`} stroke={INK} strokeWidth={0.9} opacity={0.7} />);
  if (o.lapel) {
    nodes.push(
      <g key="lapels">
        {pair((s) => {
        const f = s === 1 ? (p: Pt) => p : mir(cx);
        const a = f([cx + nw + 4.5, ySh - 9.5]);
        const b = f([cx + nw + 11, ySh + 0.05 * R]);
        const c = f([cx + 0.5, vy]);
        return <path key={`lp${s}`} d={`M${pt(a)} L${pt(b)} L${pt(f([cx + nw + 6, ySh + 0.07 * R]))} L${pt(c)}`} fill="none" stroke={INK} strokeWidth={0.9} opacity={0.75} />;
        })}
      </g>
    );
  }
  return { nodes, u, vy };
}

/* ---------------- kategori tarifleri ---------------- */

type Layers = { sleeves?: ReactNode; body: ReactNode; head?: "bare"; headwear?: ReactNode; shoe?: "flat" | "sneaker" | "dark" | "heel" | "boot" | "sandal"; };
type Recipe = (g: Geo, c: string) => Layers;

const neutralTee = (g: Geo, hem = 0.44): ReactNode => <path d={upper(g, { hem, e: 1.6, neck: "crew" }).d} fill={NEUTRAL_TOP} {...S} />;

const RECIPES: Record<Silo, Record<string, Recipe>> = {
  kadin: {
    elbise: (g, c) => {
      const u = upper(g, { hem: 0.74, e: 1.8, neck: "v", openTo: 0.11, flare: 0.08 });
      return {
        sleeves: sleeves(g, 0.42, 1.8, c),
        body: (
          <>
            <path d={u.d} fill={c} {...S} />
            <path d={hLine(g, g.lv.waist + 1, u.w)} {...DETAIL} />
            <path d={`M${pt([g.cx + 3, g.lv.waist + 2])} q6 10 2 22`} {...DETAIL} />
          </>
        ),
      };
    },
    abiye: (g, c) => {
      const top = upper(g, { hem: 0.27, e: 1.4, neck: "scoop" });
      const sk = skirt(g, g.lv.waist + 1, 0.955, 22, 1.6);
      return {
        sleeves: sleeves(g, 0.96, 2.4, c),
        body: (
          <>
            <path d={sk.d} fill={c} {...S} />
            <path d={top.d} fill={c} {...S} />
            <path d={hLine(g, g.lv.waist + 1, sk.w, 0.2)} stroke={INK} strokeWidth={1.4} opacity={0.6} />
            <path d={`M${pt([g.cx - 8, g.lv.hip])} Q${pt([g.cx - 14, g.lv.knee])} ${pt([g.cx - 18, sk.hemY - 2])} M${pt([g.cx + 10, g.lv.hip + 6])} Q${pt([g.cx + 15, g.lv.knee])} ${pt([g.cx + 20, sk.hemY - 2])}`} {...DETAIL} />
          </>
        ),
        shoe: "heel",
      };
    },
    tunik: (g, c) => {
      const lw = legwear(g, g.lv.waist, 0.965, "legging");
      const u = upper(g, { hem: 0.6, e: 2.2, neck: "v", openTo: 0.08, flare: 0.05 });
      return {
        sleeves: sleeves(g, 0.72, 2, c),
        body: (
          <>
            <path d={lw.d} fill={NEUTRAL_LOW} {...S} />
            <path d={u.d} fill={c} {...S} />
            {pair((s) => <path key={s} d={`M${pt([g.cx + s * (u.w(u.hemY) - 0.5), u.hemY - 1])} L${pt([g.cx + s * (u.w(u.hemY - 18) - 0.5), u.hemY - 18])}`} {...DETAIL} />)}
          </>
        ),
      };
    },
    pantolon: (g, c) => {
      const lw = legwear(g, g.lv.waist + 2, 0.975, "wide");
      return {
        sleeves: sleeves(g, 0.3, 1.6, NEUTRAL_TOP),
        body: (
          <>
            <path d={lw.d} fill={c} {...S} />
            <path d={upper(g, { hem: 0.31, e: 1.8, neck: "scoop" }).d} fill={NEUTRAL_TOP} {...S} />
            {pair((s) => <path key={s} d={`M${pt([g.cx + s * ((g.d.T + 3) / 2), g.lv.crotch + 8])} L${pt([g.cx + s * ((g.d.K + 12) / 2 + 1), lw.by - 5])}`} {...DETAIL} />)}
          </>
        ),
      };
    },
    jean: (g, c) => jeanLayers(g, c, true),
    tayt: (g, c) => {
      const lw = legwear(g, g.lv.waist, 0.955, "legging");
      return {
        sleeves: sleeves(g, 0.9, 1.8, NEUTRAL_TOP),
        body: (
          <>
            <path d={lw.d} fill={c} {...S} />
            <path d={upper(g, { hem: 0.5, e: 2.2, neck: "crew", flare: 0.04 }).d} fill={NEUTRAL_TOP} {...S} />
          </>
        ),
        shoe: "sneaker",
      };
    },
    etek: (g, c) => {
      const sk = skirt(g, g.lv.waist, 0.78, 14);
      return {
        sleeves: sleeves(g, 0.32, 1.5, NEUTRAL_TOP),
        body: (
          <>
            <path d={sk.d} fill={c} {...S} />
            <path d={upper(g, { hem: 0.25, e: 1.6, neck: "v", openTo: 0.09 }).d} fill={NEUTRAL_TOP} {...S} />
            <path d={hLine(g, g.lv.waist + 5, sk.w)} {...DETAIL} />
            <path d={`M${pt([g.cx - 7, g.lv.hip])} L${pt([g.cx - 11, sk.hemY - 1])} M${pt([g.cx + 7, g.lv.hip])} L${pt([g.cx + 11, sk.hemY - 1])}`} {...DETAIL} />
          </>
        ),
      };
    },
    sort: (g, c) => {
      const lw = legwear(g, g.lv.waist + 2, 0.62, "short");
      return {
        sleeves: sleeves(g, 0.3, 1.6, NEUTRAL_TOP),
        body: (
          <>
            <path d={lw.d} fill={c} {...S} />
            <path d={upper(g, { hem: 0.36, e: 1.8, neck: "crew" }).d} fill={NEUTRAL_TOP} {...S} />
          </>
        ),
        shoe: "sandal",
      };
    },
    tisort: (g, c) => teeLayers(g, c, 0.44, "crew"),
    gomlek: (g, c) => shirtLayers(g, c),
    bluz: (g, c) => {
      const lw = legwear(g, g.lv.waist + 4, 0.975, "straight");
      const u = upper(g, { hem: 0.43, e: 2.6, neck: "v", openTo: 0.1, flare: 0.08 });
      return {
        sleeves: sleeves(g, 0.66, 3, c, true),
        body: (
          <>
            <path d={lw.d} fill={NEUTRAL_LOW} {...S} />
            <path d={u.d} fill={c} {...S} />
            <path d={`M${pt([g.cx - 6, g.ySh - 6])} Q${pt([g.cx - 3, g.ySh + 6])} ${pt([g.cx, g.ySh + 0.1 * g.R])}`} {...DETAIL} />
          </>
        ),
      };
    },
    triko: (g, c) => knitLayers(g, c, "high"),
    hirka: (g, c) => cardiganLayers(g, c),
    sweatshirt: (g, c) => sweatLayers(g, c),
    ceket: (g, c) => blazerLayers(g, c, 0.46, false),
    mont: (g, c) => pufferLayers(g, c, 0.5),
    kaban: (g, c) => coatLayers(g, c),
    tesettur: (g, c) => {
      const sk = skirt(g, g.lv.waist - 6, 0.96, 18, 3);
      const u = upper(g, { hem: 0.3, e: 3, neck: "crew" });
      return {
        sleeves: sleeves(g, 1.02, 3.2, c, true),
        body: (
          <>
            <path d={sk.d} fill={c} {...S} />
            <path d={u.d} fill={c} {...S} />
            <path d={`M${pt([g.cx, g.ySh + 0.2 * g.R])} L${pt([g.cx, sk.hemY + 2])}`} {...DETAIL} />
            {buttons(g, g.ySh + 0.24 * g.R, g.ySh + 0.6 * g.R, 5)}
          </>
        ),
        head: "bare",
        headwear: <Scarf g={g} fill={P.peach.c} />,
        shoe: "flat",
      };
    },
    "mayo-hasema": (g, c) => {
      const lw = legwear(g, g.lv.waist, 0.955, "legging");
      const u = upper(g, { hem: 0.58, e: 2.4, neck: "high", flare: 0.06 });
      return {
        sleeves: sleeves(g, 1.0, 1.6, c, true),
        body: (
          <>
            <path d={lw.d} fill={c} {...S} />
            <path d={u.d} fill={c} {...S} />
            <path d={hLine(g, g.lv.waist + 2, u.w)} stroke="#FFFFFF" strokeWidth={2.2} opacity={0.8} />
            <path d={`M${pt([g.cx, g.ySh - 13])} L${pt([g.cx, g.ySh + 0.16 * g.R])}`} {...DETAIL} />
          </>
        ),
        head: "bare",
        headwear: <SwimCap g={g} fill={c} />,
        shoe: "sandal",
      };
    },
    esofman: (g, c) => trackLayers(g, c),
    "spor-giyim": (g, c) => {
      const lw = legwear(g, g.lv.waist, 0.955, "legging");
      const u = upper(g, { hem: 0.43, e: 1.8, neck: "v", openTo: 0.07 });
      return {
        sleeves: sleeves(g, 0.3, 1.4, c),
        body: (
          <>
            <path d={lw.d} fill={P.slate.c} {...S} />
            {pair((s) => <path key={s} d={sideLine(g, lw.outer, g.lv.hip, g.lv.ankle - 4, s, 1.6)} stroke="#FFFFFF" strokeWidth={1.6} opacity={0.85} />)}
            <path d={u.d} fill={c} {...S} />
          </>
        ),
        shoe: "sneaker",
      };
    },
    "ev-giyimi": (g, c) => pajamaLayers(g, c),
  },
  erkek: {
    tisort: (g, c) => teeLayers(g, c, 0.44, "crew"),
    polo: (g, c) => {
      const L = teeLayers(g, c, 0.45, "collar");
      return {
        ...L,
        body: (
          <>
            {L.body}
            {shirtCollar(g, c)}
            <path d={`M${pt([g.cx, g.ySh - 1])} L${pt([g.cx, g.ySh + 0.09 * g.R])}`} {...DETAIL} />
            {buttons(g, g.ySh + 2, g.ySh + 0.075 * g.R, 2)}
          </>
        ),
      };
    },
    gomlek: (g, c) => shirtLayers(g, c),
    pantolon: (g, c) => {
      const lw = legwear(g, g.lv.belly + 2, 0.975, "straight");
      return {
        sleeves: sleeves(g, 0.36, 2, NEUTRAL_TOP),
        body: (
          <>
            <path d={lw.d} fill={c} {...S} />
            {pair((s) => <path key={s} d={`M${pt([g.cx + s * ((g.d.T + 3.6) / 2), g.lv.crotch + 10])} L${pt([g.cx + s * ((g.d.K + 6.4) / 2), lw.by - 6])}`} {...DETAIL} />)}
            <path d={upper(g, { hem: 0.36, e: 1.8, neck: "crew" }).d} fill={NEUTRAL_TOP} {...S} />
            <path d={hLine(g, g.lv.belly + 6, lw.outer, 0.8)} {...DETAIL} />
          </>
        ),
        shoe: "dark",
      };
    },
    jean: (g, c) => jeanLayers(g, c, false),
    esofman: (g, c) => trackLayers(g, c),
    sweatshirt: (g, c) => sweatLayers(g, c),
    triko: (g, c) => knitLayers(g, c, "crew"),
    hirka: (g, c) => cardiganLayers(g, c),
    mont: (g, c) => pufferLayers(g, c, 0.48),
    "takim-elbise": (g, c) => {
      const b = blazerLayers(g, c, 0.48, true);
      return b;
    },
    "sort-deniz-sortu": (g, c) => {
      const lw = legwear(g, g.lv.belly + 2, 0.6, "short");
      return {
        sleeves: sleeves(g, 0.36, 2, NEUTRAL_TOP),
        body: (
          <>
            <path d={lw.d} fill={c} {...S} />
            {pair((s) => <path key={s} d={sideLine(g, lw.outer, g.lv.hip + 6, lw.by - 2, s, 1.5)} stroke="#FFFFFF" strokeWidth={1.6} opacity={0.85} />)}
            <path d={upper(g, { hem: 0.37, e: 1.8, neck: "crew" }).d} fill={NEUTRAL_TOP} {...S} />
            <path d={`M${pt([g.cx - 2, g.lv.belly + 6])} q-2 6 -4 8 M${pt([g.cx + 2, g.lv.belly + 6])} q2 6 4 8`} {...DETAIL} />
          </>
        ),
        shoe: "sandal",
      };
    },
    "spor-giyim": (g, c) => {
      const lw = legwear(g, g.lv.belly + 2, 0.975, "jogger");
      const u = upper(g, { hem: 0.44, e: 1.8, neck: "crew" });
      return {
        sleeves: sleeves(g, 0.34, 1.8, c),
        body: (
          <>
            <path d={lw.d} fill={P.slate.c} {...S} />
            <path d={u.d} fill={c} {...S} />
            {pair((s) => <path key={s} d={`M${pt([g.cx + s * (g.d.B * 0.95), g.lv.armpit + 2])} L${pt([g.cx + s * (u.w(u.hemY) - 1.5), u.hemY - 1])}`} stroke="#FFFFFF" strokeWidth={1.6} opacity={0.85} />)}
          </>
        ),
        shoe: "sneaker",
      };
    },
  },
};

function teeLayers(g: Geo, c: string, hem: number, neck: Neck): Layers {
  const fem = g.fem;
  const lw = legwear(g, fem ? g.lv.waist + 4 : g.lv.belly + 2, 0.975, "straight");
  return {
    sleeves: sleeves(g, 0.36, 2, c),
    body: (
      <>
        <path d={lw.d} fill={NEUTRAL_LOW} {...S} />
        <path d={upper(g, { hem, e: 1.8, neck }).d} fill={c} {...S} />
        {neck === "crew" ? <path d={`M${pt([g.cx - g.nw - 2.4, g.ySh - 8.4])} Q${pt([g.cx, g.ySh + 1.4])} ${pt([g.cx + g.nw + 2.4, g.ySh - 8.4])}`} {...DETAIL} /> : null}
      </>
    ),
    shoe: fem ? "flat" : "dark",
  };
}

function shirtLayers(g: Geo, c: string): Layers {
  const lw = legwear(g, g.fem ? g.lv.waist + 4 : g.lv.belly + 2, 0.975, "straight");
  const u = upper(g, { hem: 0.46, e: 2, neck: "collar" });
  return {
    sleeves: sleeves(g, 0.98, 2, c, true),
    body: (
      <>
        <path d={lw.d} fill={NEUTRAL_LOW} {...S} />
        <path d={u.d} fill={c} {...S} />
        <path d={`M${pt([g.cx, g.ySh - 1])} L${pt([g.cx, u.hemY + 1.5])}`} stroke={INK} strokeWidth={0.8} opacity={0.6} />
        {buttons(g, g.ySh + 4, u.hemY - 6, 6, 2)}
        {shirtCollar(g, c)}
        {pair((s) => <path key={s} d={`M${pt([g.cx + s * g.d.B * 0.42, g.lv.bust - 6])} h${s * 9} v8 h${-s * 9} Z`} fill="none" {...DETAIL} />)}
      </>
    ),
    shoe: g.fem ? "flat" : "dark",
  };
}

function jeanLayers(g: Geo, c: string, fem: boolean): Layers {
  const topY = fem ? g.lv.waist + 3 : g.lv.belly + 2;
  const lw = legwear(g, topY, 0.975, "straight");
  const stitch = { stroke: "#E9C27A", strokeWidth: 0.9, strokeDasharray: "2 1.6" } as const;
  return {
    sleeves: sleeves(g, 0.34, 1.8, NEUTRAL_TOP),
    body: (
      <>
        <path d={lw.d} fill={c} {...S} />
        <path d={hLine(g, topY + 6, lw.outer, 0.9)} {...stitch} />
        {pair((s) => (
          <g key={s}>
            <path d={`M${pt([g.cx + s * (lw.outer(topY + 6) - 3), topY + 6])} Q${pt([g.cx + s * (lw.outer(topY + 6) - 6), topY + 16])} ${pt([g.cx + s * (lw.outer(topY + 18) - 0.8), topY + 20])}`} {...DETAIL} />
            <path d={sideLine(g, lw.outer, g.lv.hip + 10, lw.by - 4, s)} {...stitch} />
          </g>
        ))}
        <path d={`M${pt([g.cx, topY + 6])} L${pt([g.cx, g.lv.crotch + 2])}`} {...DETAIL} />
        <path d={upper(g, { hem: fem ? 0.33 : 0.37, e: 1.8, neck: fem ? "scoop" : "crew" }).d} fill={NEUTRAL_TOP} {...S} />
      </>
    ),
    shoe: fem ? "sneaker" : "dark",
  };
}

function knitLayers(g: Geo, c: string, neck: Neck): Layers {
  const lw = legwear(g, g.fem ? g.lv.waist + 4 : g.lv.belly + 2, 0.975, "straight");
  const u = upper(g, { hem: 0.44, e: 2.6, neck, flare: -0.04 });
  const ribs: ReactNode[] = [];
  for (let i = 0; i < 9; i++) {
    const y = lerp(g.lv.bust - 6, u.hemY - 8, i / 8);
    ribs.push(<path key={i} d={`M${pt([g.cx - 4 - (i % 2) * 0, y])} l2 3 l2 -3 l2 3`} stroke={INK} strokeWidth={0.6} opacity={0.4} />);
  }
  return {
    sleeves: sleeves(g, 0.98, 2.6, c, true),
    body: (
      <>
        <path d={lw.d} fill={NEUTRAL_LOW} {...S} />
        <path d={u.d} fill={c} {...S} />
        <path d={hLine(g, u.hemY - 5, u.w)} {...DETAIL} />
        {neck === "high" ? <path d={`M${pt([g.cx - g.nw - 1.5, g.ySh - 10])} Q${pt([g.cx, g.ySh - 8])} ${pt([g.cx + g.nw + 1.5, g.ySh - 10])}`} {...DETAIL} /> : <path d={`M${pt([g.cx - g.nw - 2.4, g.ySh - 8.4])} Q${pt([g.cx, g.ySh + 1.4])} ${pt([g.cx + g.nw + 2.4, g.ySh - 8.4])}`} {...DETAIL} />}
        {ribs}
      </>
    ),
    shoe: g.fem ? "boot" : "dark",
  };
}

function cardiganLayers(g: Geo, c: string): Layers {
  const lw = legwear(g, g.fem ? g.lv.waist + 4 : g.lv.belly + 2, 0.975, "straight");
  const of = openFront(g, { hem: g.fem ? 0.55 : 0.47, e: 3, vTo: 0.2 }, c);
  return {
    sleeves: sleeves(g, 0.98, 2.8, c, true),
    body: (
      <>
        <path d={lw.d} fill={NEUTRAL_LOW} {...S} />
        {neutralTee(g, 0.42)}
        {of.nodes}
        {buttons(g, of.vy + 4, of.u.hemY - 10, 4, 2.4)}
        <path d={hLine(g, of.u.hemY - 5, of.u.w)} {...DETAIL} />
      </>
    ),
    shoe: g.fem ? "flat" : "dark",
  };
}

function sweatLayers(g: Geo, c: string): Layers {
  const lw = legwear(g, g.fem ? g.lv.waist + 4 : g.lv.belly + 2, 0.975, g.fem ? "straight" : "jogger");
  const u = upper(g, { hem: 0.45, e: 3, neck: "crew", flare: -0.06 });
  return {
    sleeves: sleeves(g, 0.98, 3.2, c, true),
    body: (
      <>
        <path d={lw.d} fill={NEUTRAL_LOW} {...S} />
        <path d={u.d} fill={c} {...S} />
        <path d={hLine(g, u.hemY - 5, u.w)} {...DETAIL} />
        <path d={`M${pt([g.cx - g.nw - 2.4, g.ySh - 8.4])} Q${pt([g.cx, g.ySh + 1.4])} ${pt([g.cx + g.nw + 2.4, g.ySh - 8.4])}`} {...DETAIL} />
        <path d={`M${pt([g.cx - 14, u.hemY - 6])} L${pt([g.cx - 10, g.lv.waist + 6])} L${pt([g.cx + 10, g.lv.waist + 6])} L${pt([g.cx + 14, u.hemY - 6])}`} fill="none" {...DETAIL} />
      </>
    ),
    shoe: "sneaker",
  };
}

function blazerLayers(g: Geo, c: string, hem: number, suit: boolean): Layers {
  const lw = legwear(g, g.fem ? g.lv.waist + 4 : g.lv.belly + 2, 0.975, "straight");
  const of = openFront(g, { hem, e: 3, vTo: suit ? 0.2 : 0.22, lapel: true, flare: 0.03 }, c);
  return {
    sleeves: sleeves(g, 0.98, 2.6, c),
    body: (
      <>
        <path d={lw.d} fill={suit ? c : NEUTRAL_LOW} {...S} />
        {suit ? pair((s) => <path key={s} d={`M${pt([g.cx + s * ((g.d.T + 3.6) / 2), g.lv.crotch + 10])} L${pt([g.cx + s * ((g.d.K + 6.4) / 2), lw.by - 6])}`} {...DETAIL} />) : null}
        {suit ? (
          <>
            <path d={upper(g, { hem: 0.42, e: 1.8, neck: "collar" }).d} fill="#FFFFFF" {...S} />
            {shirtCollar(g, "#FFFFFF")}
            <path d={`M${pt([g.cx - 2.4, g.ySh])} L${pt([g.cx + 2.4, g.ySh])} L${pt([g.cx + 3.4, g.ySh + 0.16 * g.R])} L${pt([g.cx, g.ySh + 0.19 * g.R])} L${pt([g.cx - 3.4, g.ySh + 0.16 * g.R])} Z`} fill={P.slate.c} stroke={INK} strokeWidth={0.8} />
          </>
        ) : (
          neutralTee(g, 0.4)
        )}
        {of.nodes}
        {buttons(g, of.vy + 3, of.vy + 14, 2, 2.4)}
        {pair((s) => <path key={s} d={`M${pt([g.cx + s * (of.u.w(g.lv.belly + 6) - 16), g.lv.belly + 6])} h${s * 12}`} {...DETAIL} />)}
      </>
    ),
    shoe: g.fem ? "heel" : "dark",
  };
}

function pufferLayers(g: Geo, c: string, hem: number): Layers {
  const lw = legwear(g, g.fem ? g.lv.waist + 4 : g.lv.belly + 2, 0.975, "straight");
  const u = upper(g, { hem, e: 5, neck: "high", flare: -0.02 });
  const lines: ReactNode[] = [];
  for (let i = 1; i <= 5; i++) {
    const y = lerp(g.ySh + 4, u.hemY - 2, i / 6);
    lines.push(<path key={i} d={hLine(g, y, u.w, 1)} {...DETAIL} />);
  }
  const arm: ReactNode[] = [];
  for (const t of [0.3, 0.55, 0.8])
    arm.push(
      <g key={t}>
        {pair((s) => {
          const f = s === 1 ? (p: Pt) => p : mir(g.cx);
          return <path key={`${t}${s}`} d={`M${pt(f(at(g, t, -1, 4)))} L${pt(f(at(g, t, 1, 4.4)))}`} {...DETAIL} />;
        })}
      </g>
    );
  return {
    sleeves: (
      <>
        {sleeves(g, 0.98, 4.4, c, true)}
        {arm}
      </>
    ),
    body: (
      <>
        <path d={lw.d} fill={NEUTRAL_LOW} {...S} />
        <path d={u.d} fill={c} {...S} />
        {lines}
        <path d={`M${pt([g.cx, g.ySh - 15])} L${pt([g.cx, u.hemY + 1.5])}`} stroke={INK} strokeWidth={0.9} opacity={0.7} />
      </>
    ),
    shoe: g.fem ? "boot" : "dark",
  };
}

function coatLayers(g: Geo, c: string): Layers {
  const lw = legwear(g, g.lv.waist + 4, 0.975, "straight");
  const of = openFront(g, { hem: 0.74, e: 4, vTo: 0.2, lapel: true, flare: 0.05 }, c);
  return {
    sleeves: sleeves(g, 0.98, 3.4, c, true),
    body: (
      <>
        <path d={lw.d} fill={NEUTRAL_LOW} {...S} />
        {neutralTee(g, 0.4)}
        {of.nodes}
        {buttons(g, of.vy + 5, of.vy + 26, 3, -5)}
        {buttons(g, of.vy + 5, of.vy + 26, 3, 5)}
        <path d={hLine(g, g.lv.waist + 2, of.u.w, 0.2)} stroke={INK} strokeWidth={2.4} opacity={0.35} />
      </>
    ),
    shoe: "boot",
  };
}

function trackLayers(g: Geo, c: string): Layers {
  const lw = legwear(g, g.fem ? g.lv.waist + 2 : g.lv.belly + 2, 0.975, "jogger");
  const u = upper(g, { hem: 0.45, e: 3, neck: "high", flare: -0.06 });
  const stripe = { stroke: "#FFFFFF", strokeWidth: 1.8, opacity: 0.9 } as const;
  return {
    sleeves: (
      <>
        {sleeves(g, 0.98, 2.8, c, true)}
        {pair((s) => {
          const f = s === 1 ? (p: Pt) => p : mir(g.cx);
          return <path key={`st${s}`} d={`M${pt(f(at(g, 0.06, 1, 1.6)))} L${pt(f(at(g, 0.88, 1, 1.6)))}`} {...stripe} />;
        })}
      </>
    ),
    body: (
      <>
        <path d={lw.d} fill={c} {...S} />
        {pair((s) => <path key={s} d={sideLine(g, lw.outer, g.lv.hip, lw.by - 8, s, 1.6)} {...stripe} />)}
        <path d={u.d} fill={c} {...S} />
        <path d={`M${pt([g.cx, g.ySh - 15])} L${pt([g.cx, u.hemY + 1.5])}`} stroke={INK} strokeWidth={0.9} opacity={0.7} />
        <path d={hLine(g, u.hemY - 5, u.w)} {...DETAIL} />
      </>
    ),
    shoe: "sneaker",
  };
}

function pajamaLayers(g: Geo, c: string): Layers {
  const lw = legwear(g, g.lv.waist + 2, 0.965, "straight");
  const u = upper(g, { hem: 0.46, e: 2.6, neck: "v", openTo: 0.12 });
  const pip = { stroke: "#FFFFFF", strokeWidth: 1.4, opacity: 0.95 } as const;
  return {
    sleeves: (
      <>
        {sleeves(g, 0.98, 2.6, c)}
        {pair((s) => <path key={`p${s}`} d={cuffLine(g, s, 0.93, 2.6)} {...pip} />)}
      </>
    ),
    body: (
      <>
        <path d={lw.d} fill={c} {...S} />
        <path d={`M${pt([g.cx - lw.outer(lw.by - 5) + 1, lw.by - 5])} L${pt([g.cx - 4, lw.by - 5])} M${pt([g.cx + 4, lw.by - 5])} L${pt([g.cx + lw.outer(lw.by - 5) - 1, lw.by - 5])}`} {...pip} />
        <path d={u.d} fill={c} {...S} />
        <path d={`M${pt([g.cx - g.nw - 4.5, g.ySh - 9.5])} L${pt([g.cx, g.ySh + 0.12 * g.R])} L${pt([g.cx + g.nw + 4.5, g.ySh - 9.5])}`} fill="none" {...pip} />
        <path d={`M${pt([g.cx, g.ySh + 0.12 * g.R])} L${pt([g.cx, u.hemY + 1])}`} {...DETAIL} />
        {buttons(g, g.ySh + 0.16 * g.R, u.hemY - 6, 4, 2)}
        <path d={`M${pt([g.cx - g.d.B * 0.55, g.lv.bust - 3])} h9 v8 h-9 Z`} fill="none" {...pip} />
      </>
    ),
    shoe: "flat",
  };
}

/* ---------------- baş örtüleri ---------------- */

function Scarf({ g, fill }: { g: Geo; fill: string }) {
  const { cx, headCy: cy, ySh, R, d } = g;
  const rx = 14.6;
  const ry = 19.5;
  const outer: Pt[] = [
    [cx - d.B * 0.62, ySh + 0.17 * R],
    [cx - d.S * 0.62, ySh + 0.02 * R],
    [cx - rx - 6, cy + 14],
    [cx - rx - 6.5, cy - 4],
    [cx - 8, cy - ry - 4.5],
    [cx + 8, cy - ry - 4.5],
    [cx + rx + 6.5, cy - 4],
    [cx + rx + 6, cy + 14],
    [cx + d.S * 0.62, ySh + 0.02 * R],
    [cx + d.B * 0.62, ySh + 0.17 * R],
  ];
  const face = `M${pt([cx, cy - ry + 3.5])} a${rx - 1.6} ${ry - 3} 0 1 0 0.01 0 Z`;
  return (
    <g>
      <path d={`${smooth(outer)} Q${pt([cx, ySh + 0.25 * R])} ${pt(outer[0])} Z ${face}`} fill={fill} fillRule="evenodd" {...S} />
      <path d={`M${pt([cx - rx - 2, cy + 12])} Q${pt([cx, ySh + 0.1 * R])} ${pt([cx + d.S * 0.5, ySh + 0.03 * R])}`} {...DETAIL} />
    </g>
  );
}

function SwimCap({ g, fill }: { g: Geo; fill: string }) {
  const { cx, headCy: cy, ySh, nw } = g;
  const rx = 14.6;
  const ry = 19.5;
  const outer: Pt[] = [
    [cx - nw - 7, ySh - 4],
    [cx - rx - 4, cy + 8],
    [cx - rx - 4.5, cy - 6],
    [cx, cy - ry - 3.6],
    [cx + rx + 4.5, cy - 6],
    [cx + rx + 4, cy + 8],
    [cx + nw + 7, ySh - 4],
  ];
  const face = `M${pt([cx, cy - ry + 4])} a${rx - 1.8} ${ry - 3.4} 0 1 0 0.01 0 Z`;
  return <path d={`${smooth(outer)} Q${pt([cx, ySh - 1])} ${pt(outer[0])} Z ${face}`} fill={fill} fillRule="evenodd" {...S} />;
}

/* ---------------- ayakkabı ---------------- */

function Shoes({ g, kind, skin }: { g: Geo; kind: Layers["shoe"]; skin: string }) {
  const fill =
    kind === "sneaker" ? "#FFFFFF" : kind === "dark" ? "var(--illu-croquis-shoe, #6F6862)" : kind === "boot" ? "#8A7766" : kind === "heel" ? "#B9A7A0" : kind === "sandal" ? skin : g.fem ? skin : "var(--illu-croquis-shoe, #6F6862)";
  return pair((s) => {
    const f = feet(g, s);
    return (
      <g key={`f${s}`}>
        <path d={f.fill} fill={fill} />
        <path d={f.stroke} {...S} />
        {kind === "sneaker" ? <path d={f.vamp} stroke={INK} strokeWidth={0.8} opacity={0.6} /> : null}
        {kind === "sandal" ? <path d={f.vamp} stroke="#B48E6E" strokeWidth={1.6} /> : null}
        {kind === "flat" || (kind === undefined && g.fem) ? <path d={f.vamp} stroke={INK} strokeWidth={0.8} opacity={0.6} /> : null}
      </g>
    );
  });
}

/* ---------------- natürmort (iç giyim, ayakkabı) ---------------- */

function Hanger({ y = 92 }: { y?: number }) {
  return (
    <g fill="none" stroke={INK} strokeWidth={LINE}>
      <path d={`M100 ${y - 26} q0 -9 6 -9 q6 0 6 6 q0 5 -6 7 l-6 3 v6`} />
      <path d={`M100 ${y - 13} L46 ${y + 12} q-4 3 0 4 H154 q4 -1 0 -4 Z`} fill="#F4F0EA" />
    </g>
  );
}

function StillLife({ silo, category, c }: { silo: Silo; category: string; c: string }) {
  if (category === "ayakkabi") {
    const fem = silo === "kadin";
    // yandan görünüm, burun sağda; yerel kutu 100×50
    const upperD = fem
      ? "M8 40 L8 22 C8 16 12 14 17 14 C25 14 31 21 42 21 C57 21 70 23 83 29 C92 33 96 37 96 40 Z"
      : "M6 40 L6 16 C6 9 11 6 18 6 C25 6 29 12 37 14 C49 16 61 18 73 24 C85 29 96 32 96 40 Z";
    const shoe = (x: number, y: number, k: number) => (
      <g transform={`translate(${x} ${y}) scale(${k})`} strokeLinecap="round" strokeLinejoin="round">
        {fem ? <path d="M8 40 h12 l-1 7 h-10 Z" fill={INK} opacity={0.75} /> : null}
        <path d={upperD} fill={c} stroke={INK} strokeWidth={LINE / k} />
        <path d={fem ? "M20 40 H97 Q99 40 98 44 H22 Z" : "M3 40 H97 Q100 40 99 45 Q98 47 95 47 H6 Q3 47 3 44 Z"} fill={fem ? "#F4F0EA" : "#FFFFFF"} stroke={INK} strokeWidth={LINE / k} />
        {fem ? (
          <path d="M40 21 C44 26 52 27 58 25" fill="none" stroke={INK} strokeWidth={0.9 / k} opacity={0.6} />
        ) : (
          <path d="M36 14 L46 22 M42 15 L52 23 M48 17 L58 25 M34 20 C44 22 56 26 66 32" fill="none" stroke={INK} strokeWidth={0.9 / k} opacity={0.6} />
        )}
        <path d={fem ? "M24 37 H92" : "M10 36 C30 36 60 37 92 37"} fill="none" stroke={INK} strokeWidth={0.75 / k} opacity={0.35} strokeDasharray="2 2" />
      </g>
    );
    return (
      <g>
        <ellipse cx={100} cy={276} rx={84} ry={6} fill={INK} opacity={0.06} />
        {shoe(30, 150, 1.45)}
        {shoe(16, 205, 1.6)}
      </g>
    );
  }
  // iç giyim: askıda sade atlet/kaşkorse + katlanmış ürün yığını (bilgi odaklı, cinsellik içermeyen)
  const top =
    silo === "kadin"
      ? "M70 104 C72 96 76 92 80 92 C84 112 116 112 120 92 C124 92 128 96 130 104 C132 124 128 140 130 196 H70 C72 140 68 124 70 104 Z"
      : "M66 100 C72 94 78 92 82 92 C86 108 114 108 118 92 C122 92 128 94 134 100 C136 130 132 150 134 204 H66 C68 150 64 130 66 100 Z";
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <Hanger />
      {silo === "kadin" ? <path d="M80 92 L76 78 M120 92 L124 78" stroke={INK} strokeWidth={LINE} /> : null}
      <path d={top} fill={c} stroke={INK} strokeWidth={LINE} />
      <path d={silo === "kadin" ? "M74 126 Q100 134 126 126" : "M70 186 H130"} stroke={INK} strokeWidth={0.75} opacity={0.5} fill="none" />
      <ellipse cx={100} cy={296} rx={66} ry={5} fill={INK} opacity={0.06} />
      <g stroke={INK} strokeWidth={LINE}>
        <rect x={46} y={262} width={108} height={30} rx={6} fill={NEUTRAL_LOW} />
        <rect x={52} y={236} width={96} height={26} rx={6} fill={c} />
        <rect x={58} y={214} width={84} height={22} rx={6} fill="#F4F0EA" />
      </g>
      <path d="M58 247 H148 M52 276 H154" stroke={INK} strokeWidth={0.75} opacity={0.4} />
    </g>
  );
}

/* ---------------- bileşen ---------------- */

export type GarmentCroquisProps = BaseProps & {
  silo: Silo;
  category: string;
  tone?: Tone;
  /** Pastel karo zemini (varsayılan açık) */
  tile?: boolean;
  /** true: üst/alt boşluk kırpılmış görünüm (kare kartlarda figür daha büyük görünür) */
  tight?: boolean;
};

export function GarmentCroquis({ silo, category, tone, tile = true, tight = false, ...rest }: GarmentCroquisProps) {
  const recipe = RECIPES[silo]?.[category];
  const still = category === "ic-giyim" || category === "ayakkabi";
  if (!recipe && !(still && hasGarmentCroquis(silo, category))) return <Fallback viewBox={`0 0 ${VB_W} ${VB_H}`} {...rest} />;
  const sw = SWATCH[silo]?.[category] ?? P.grey;
  return (
    <Svg viewBox={tight ? `8 50 ${VB_W - 16} ${VB_H - 50}` : `0 0 ${VB_W} ${VB_H}`} {...rest}>
      {tile ? <rect width={VB_W} height={VB_H} rx={16} fill={sw.tile} /> : null}
      {still ? <StillLife silo={silo} category={category} c={sw.c} /> : <Dressed silo={silo} recipe={recipe!} c={sw.c} tone={tone} />}
    </Svg>
  );
}

function Dressed({ silo, recipe, c, tone }: { silo: Silo; recipe: Recipe; c: string; tone?: Tone }) {
  const g = geometry(silo, silo === "kadin" ? KADIN_DIMS : ERKEK_DIMS, 1, VB_W / 2);
  const skin = tone && TONES[tone] ? TONES[tone].skin : "var(--illu-croquis-skin, #FFFBF7)";
  const hair = tone && TONES[tone] ? TONES[tone].hair : "var(--illu-croquis-hair, #E7DED4)";
  const L = recipe(g, c);
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx={g.cx} cy={GROUND + 0.5} rx={g.d.H * 0.95} ry={4} fill={INK} opacity={0.06} />
      <path d={handPath(g, 1)} fill={skin} {...S} />
      <path d={handPath(g, -1)} fill={skin} {...S} />
      <path d={armPath(g, 1)} fill={skin} {...S} />
      <path d={armPath(g, -1)} fill={skin} {...S} />
      <path d={bodyPath(g)} fill={skin} {...S} />
      <Shoes g={g} kind={L.shoe} skin={skin} />
      {L.sleeves}
      {L.body}
      <Head g={g} skin={skin} hair={L.head === "bare" ? null : hair} />
      {L.headwear}
    </g>
  );
}

import { C, Fallback, Svg, lerp, profileAt, r1, smooth, toneColors, type BaseProps, type Pt, type Silo, type Tone } from "./shared";
import { fitLabel, type ErkekFit, type KadinFit } from "./fit-keys";

/**
 * Pantolon kalıbı çizimi (önden, 160×236).
 * Soluk bir bacak silüeti üzerine pantolonun dış hattı çizilir; kesikli bacak çizgisi
 * kumaşın bacağa ne kadar yakın durduğunu (basen, uyluk, diz, paça) gösterir.
 * Sol kenardaki vurgulu köşeli ayraç ön ağ (bel yüksekliği / rise), paçadaki kalın
 * vurgulu çizgi paça genişliğidir. Kesikli yatay çizgi doğal bel hizasıdır.
 */

const CX = 80;
const VB = "0 0 160 236";

type BodyGeo = {
  /** gövde yarı genişliği: [y, yarı genişlik] */
  torso: Pt[];
  /** bacak merkezi (CX'ten uzaklık) ve yarı genişliği: [y, değer] */
  legC: Pt[];
  legH: Pt[];
  waistY: number;
  hipY: number;
  crotchY: number;
  kneeY: number;
  ankleY: number;
};

const BODY: Record<Silo, BodyGeo> = {
  kadin: {
    torso: [
      [8, 24.5],
      [32, 25],
      [50, 31.5],
      [66, 36.5],
      [80, 36],
      [92, 35.5],
    ],
    legC: [
      [92, 18],
      [120, 16.8],
      [150, 15],
      [172, 14.5],
      [206, 12.5],
    ],
    legH: [
      [92, 17.5],
      [120, 13.8],
      [150, 9.3],
      [172, 9.8],
      [206, 4.8],
    ],
    waistY: 32,
    hipY: 66,
    crotchY: 86,
    kneeY: 150,
    ankleY: 206,
  },
  erkek: {
    torso: [
      [8, 27],
      [34, 27.5],
      [50, 29.8],
      [64, 31.5],
      [80, 31.5],
      [92, 31.5],
    ],
    legC: [
      [92, 16.5],
      [120, 16],
      [150, 15],
      [172, 14.5],
      [206, 13],
    ],
    legH: [
      [92, 15],
      [120, 12.5],
      [150, 9.4],
      [172, 9.6],
      [206, 5],
    ],
    waistY: 34,
    hipY: 64,
    crotchY: 86,
    kneeY: 150,
    ankleY: 206,
  },
};

type Detail = "denim" | "chino" | "trouser" | "palazzo" | "kulot" | "havuc" | "jogger" | "kargo" | "boyfriend";

type FitSpec = {
  /** bel bandı üst kenarı (y) */
  rise: number;
  hipEase: number;
  thighEase: number;
  /** diz ve paçada pantolon bacağının yarı genişliği (mutlak) */
  kneeHalf: number;
  hemHalf: number;
  hemY: number;
  /** paçada bacak merkezinin dışa kayması (geniş kalıplar) */
  hemShift?: number;
  kneeShift?: number;
  /** ağın vücut ağından aşağıda kalması */
  crotchDrop?: number;
  /** dizden paçaya eğri: + içe (flare'de ispanyol açılımı) */
  flareCurve?: number;
  fill: string;
  detail: Detail;
  /** yüksek/normal bel karşılaştırmasında doğal bel çizgisi vurgulu */
  riseFocus?: boolean;
};

const DENIM_LIGHT = "var(--illu-denim-light, #8FA6BE)";

const SPECS: { kadin: Record<KadinFit, FitSpec>; erkek: Record<ErkekFit, FitSpec> } = {
  kadin: {
    skinny: { rise: 36, hipEase: 0.8, thighEase: 0.8, kneeHalf: 10.2, hemHalf: 5.8, hemY: 204, fill: C.denimDark, detail: "denim" },
    slim: { rise: 40, hipEase: 2, thighEase: 2.6, kneeHalf: 12, hemHalf: 8.8, hemY: 208, fill: C.denim, detail: "denim" },
    straight: { rise: 36, hipEase: 3, thighEase: 4, kneeHalf: 14.5, hemHalf: 14.5, hemY: 210, fill: C.denim, detail: "denim" },
    bootcut: { rise: 40, hipEase: 2, thighEase: 2.2, kneeHalf: 11.2, hemHalf: 16.5, hemY: 212, hemShift: 1, flareCurve: 1.5, fill: C.denim, detail: "denim" },
    flare: { rise: 31, hipEase: 1.2, thighEase: 1.4, kneeHalf: 10.4, hemHalf: 24, hemY: 213, hemShift: 3, flareCurve: 5, fill: C.denimDark, detail: "denim" },
    "wide-leg": { rise: 31, hipEase: 3.5, thighEase: 7, kneeHalf: 21.5, hemHalf: 24.5, hemY: 212, hemShift: 4.5, kneeShift: 2, fill: C.cloth2, detail: "trouser" },
    palazzo: { rise: 29, hipEase: 8, thighEase: 13, kneeHalf: 29, hemHalf: 33, hemY: 213, hemShift: 9, kneeShift: 6, fill: C.cloth4, detail: "palazzo" },
    mom: { rise: 29, hipEase: 4.5, thighEase: 6.5, kneeHalf: 15, hemHalf: 10.5, hemY: 199, fill: DENIM_LIGHT, detail: "denim" },
    boyfriend: { rise: 42, hipEase: 5, thighEase: 8, kneeHalf: 17, hemHalf: 15.5, hemY: 199, crotchDrop: 4, fill: DENIM_LIGHT, detail: "boyfriend" },
    kargo: { rise: 38, hipEase: 5, thighEase: 7.5, kneeHalf: 16.5, hemHalf: 15.5, hemY: 210, fill: C.cloth3, detail: "kargo" },
    jogger: { rise: 34, hipEase: 5, thighEase: 7.5, kneeHalf: 15, hemHalf: 6.6, hemY: 205, crotchDrop: 3, fill: C.grey, detail: "jogger" },
    havuc: { rise: 29, hipEase: 7.5, thighEase: 8.5, kneeHalf: 13.5, hemHalf: 8, hemY: 201, fill: C.camel, detail: "havuc" },
    kulot: { rise: 31, hipEase: 4.5, thighEase: 10, kneeHalf: 23, hemHalf: 26, hemY: 174, hemShift: 5, kneeShift: 3, fill: C.cloth1, detail: "kulot" },
    "yuksek-bel": { rise: 29, hipEase: 3, thighEase: 4.5, kneeHalf: 15, hemHalf: 15, hemY: 210, fill: C.cloth1, detail: "trouser", riseFocus: true },
    "normal-bel": { rise: 43, hipEase: 3, thighEase: 4.5, kneeHalf: 15, hemHalf: 15, hemY: 210, fill: C.cloth1, detail: "trouser", riseFocus: true },
  },
  erkek: {
    slim: { rise: 42, hipEase: 2, thighEase: 2.4, kneeHalf: 11.5, hemHalf: 8, hemY: 210, fill: C.denimDark, detail: "denim" },
    regular: { rise: 40, hipEase: 3.5, thighEase: 4.5, kneeHalf: 13, hemHalf: 10.4, hemY: 210, fill: C.denim, detail: "denim" },
    straight: { rise: 40, hipEase: 3.5, thighEase: 4.5, kneeHalf: 14, hemHalf: 14.2, hemY: 210, fill: C.denim, detail: "denim" },
    relaxed: { rise: 38, hipEase: 6, thighEase: 8.5, kneeHalf: 16.5, hemHalf: 15.5, hemY: 210, crotchDrop: 2, fill: DENIM_LIGHT, detail: "denim" },
    comfort: { rise: 33, hipEase: 7, thighEase: 9, kneeHalf: 16.5, hemHalf: 15.5, hemY: 210, crotchDrop: 1, fill: C.cloth1, detail: "trouser" },
    tapered: { rise: 40, hipEase: 5, thighEase: 7.5, kneeHalf: 13, hemHalf: 7.8, hemY: 208, fill: C.denim, detail: "denim" },
    "boru-paca": { rise: 38, hipEase: 5, thighEase: 6.5, kneeHalf: 17.5, hemHalf: 17.5, hemY: 211, kneeShift: 0.5, hemShift: 1, fill: C.wine, detail: "trouser" },
    bootcut: { rise: 42, hipEase: 3, thighEase: 3.2, kneeHalf: 12, hemHalf: 16.5, hemY: 212, hemShift: 1, flareCurve: 1.5, fill: C.denim, detail: "denim" },
    jogger: { rise: 36, hipEase: 5, thighEase: 7.5, kneeHalf: 15, hemHalf: 6.8, hemY: 205, crotchDrop: 3, fill: C.grey, detail: "jogger" },
    kargo: { rise: 40, hipEase: 6, thighEase: 8, kneeHalf: 16, hemHalf: 14.5, hemY: 210, fill: C.cloth3, detail: "kargo" },
    chino: { rise: 40, hipEase: 3, thighEase: 4, kneeHalf: 12.6, hemHalf: 10, hemY: 209, fill: C.camel, detail: "chino" },
  },
};

/* ---------------- geometri ---------------- */

type Geo = ReturnType<typeof geometry>;

function geometry(silo: Silo, s: FitSpec) {
  const b = BODY[silo];
  const torso = (y: number) => profileAt(b.torso, y);
  const legC = (y: number) => profileAt(b.legC, y);
  const legH = (y: number) => profileAt(b.legH, y);

  const crotchY = b.crotchY + (s.crotchDrop ?? 0) + Math.min(3, s.thighEase * 0.18);
  const waistX = torso(s.rise) + Math.min(2, 0.5 + s.hipEase * 0.15);
  const hipY = Math.max(b.hipY, s.rise + 22);
  const hipX = torso(hipY) + s.hipEase;
  const thighY = crotchY + 8;
  const thighOut = legC(thighY) + legH(thighY) + s.thighEase;
  const thighIn = Math.max(1.2, legC(thighY) - legH(thighY) - s.thighEase * 0.25);
  const kneeY = Math.min(b.kneeY, s.hemY - 18);
  const kc = legC(kneeY) + (s.kneeShift ?? 0);
  const kneeOut = kc + s.kneeHalf;
  const kneeIn = Math.max(1.2, kc - s.kneeHalf);
  const hc = legC(s.hemY) + (s.hemShift ?? 0);
  const hemOut = hc + s.hemHalf;
  const hemIn = Math.max(0.9, hc - s.hemHalf);
  const fc = s.flareCurve ?? 0;
  const midY = lerp(kneeY, s.hemY, 0.5);
  const midOut = lerp(kneeOut, hemOut, 0.5) - fc;
  const midIn = Math.max(1, lerp(kneeIn, hemIn, 0.5) + fc * 0.6);
  const upY = lerp(thighY, kneeY, 0.5);
  const upOut = lerp(thighOut, kneeOut, 0.5) + 0.6;
  const upIn = Math.max(1.1, lerp(thighIn, kneeIn, 0.5));

  const X = (dx: number): number => CX + dx;
  const outer: Pt[] = [
    [X(waistX), s.rise],
    [X(hipX), hipY],
    [X(thighOut), thighY],
    [X(upOut), upY],
    [X(kneeOut), kneeY],
    [X(midOut), midY],
    [X(hemOut), s.hemY],
  ];
  const inner: Pt[] = [
    [X(hemIn), s.hemY],
    [X(midIn), midY],
    [X(kneeIn), kneeY],
    [X(upIn), upY],
    [X(thighIn), thighY],
    [X(0.6), crotchY + 2.5],
    [CX, crotchY],
  ];
  const m = (p: Pt): Pt => [2 * CX - p[0], p[1]];
  const leftInner = [...inner].reverse().map(m);
  const leftOuter = [...outer].reverse().map(m);
  const d =
    smooth(outer, { tension: 0.9 }) +
    ` L${r1(inner[0][0])} ${r1(inner[0][1])}` +
    smooth(inner, { tension: 0.9, move: false }) +
    smooth(leftInner, { tension: 0.9, move: false }) +
    ` L${r1(leftOuter[0][0])} ${r1(leftOuter[0][1])}` +
    smooth(leftOuter, { tension: 0.9, move: false }) +
    " Z";

  /** pantolon dış hattının y'deki yarı genişliği (bel–basen arası, yaklaşık) */
  const outerAt = (y: number) => {
    if (y <= hipY) {
      const t = (y - s.rise) / (hipY - s.rise);
      return waistX + (hipX - waistX) * (t * (2 - t));
    }
    return profileAt(
      outer.map(([x, yy]) => [yy, x - CX] as Pt),
      y
    );
  };
  const maxOut = Math.max(hipX, thighOut, kneeOut, hemOut);
  return { d, b, s, crotchY, waistX, hipX, hipY, thighY, thighOut, thighIn, kneeY, kneeOut, kneeIn, kc, hemOut, hemIn, hc, outerAt, maxOut, legC, legH, torso };
}

/* ---------------- vücut ---------------- */

function bodyPath(silo: Silo) {
  const b = BODY[silo];
  const torso = (y: number) => profileAt(b.torso, y);
  const legC = (y: number) => profileAt(b.legC, y);
  const legH = (y: number) => profileAt(b.legH, y);
  const outer: Pt[] = [];
  for (let y = 6; y <= 84; y += 6) outer.push([CX + torso(y), y]);
  for (let y = 92; y <= b.ankleY; y += 8) outer.push([CX + legC(y) + legH(y), y]);
  outer.push([CX + legC(b.ankleY) + legH(b.ankleY), b.ankleY]);
  const inner: Pt[] = [];
  inner.push([CX + legC(b.ankleY) - legH(b.ankleY), b.ankleY]);
  for (let y = b.ankleY - 6; y >= 92; y -= 8) inner.push([CX + legC(y) - legH(y), y]);
  inner.push([CX + 0.8, b.crotchY + 1.5]);
  inner.push([CX, b.crotchY]);
  const m = (p: Pt): Pt => [2 * CX - p[0], p[1]];
  const d =
    smooth(outer) +
    ` L${r1(inner[0][0])} ${r1(inner[0][1])}` +
    smooth(inner, { move: false }) +
    smooth([...inner].reverse().map(m), { move: false }) +
    ` L${r1(m(outer[outer.length - 1])[0])} ${r1(outer[outer.length - 1][1])}` +
    smooth([...outer].reverse().map(m), { move: false });
  /** kesikli üst katman: yalnız bacak ve basen kenarları (bel üstü çizilmez) */
  const legLine = (side: 1 | -1) => {
    const o: Pt[] = [];
    for (let y = b.waistY; y <= 84; y += 6) o.push([CX + side * torso(y), y]);
    for (let y = 92; y <= b.ankleY; y += 8) o.push([CX + side * (legC(y) + legH(y)), y]);
    const i: Pt[] = [];
    for (let y = 92; y <= b.ankleY; y += 8) i.push([CX + side * (legC(y) - legH(y)), y]);
    return smooth(o) + " " + smooth([[CX, b.crotchY], [CX + side * 0.8, b.crotchY + 1.5], ...i]);
  };
  const feet = [1, -1].map((side) => {
    const c = CX + side * legC(b.ankleY);
    const x0 = c - side * 5.5;
    const x1 = c + side * 9;
    return `M${r1(x0)} ${b.ankleY} Q${r1(x0 - side * 0.5)} ${b.ankleY + 9} ${r1(c)} ${b.ankleY + 10} Q${r1(x1 + side * 2)} ${b.ankleY + 10.5} ${r1(
      x1
    )} ${b.ankleY + 7} Q${r1(c + side * 6)} ${b.ankleY + 3} ${r1(c + side * 5)} ${b.ankleY}`;
  });
  return { d, legLine, feet };
}

/* ---------------- detaylar ---------------- */

function L({ d, o = 0.55, w = 1 }: { d: string; o?: number; w?: number }) {
  return <path d={d} stroke={C.ink} strokeWidth={w} opacity={o} fill="none" />;
}
function St({ d, color = C.stitch }: { d: string; color?: string }) {
  return <path d={d} stroke={color} strokeWidth={0.9} strokeDasharray="2 1.6" fill="none" />;
}
const mxx = (x: number) => 2 * CX - x;
/** "x y" çiftli mutlak yolu aynalar */
function mir(d: string) {
  return d.replace(/(-?\d+(?:\.\d+)?)[ ,](-?\d+(?:\.\d+)?)/g, (_m, x, y) => `${r1(mxx(Number(x)))} ${y}`);
}
function both(d: string) {
  return `${d} ${mir(d)}`;
}

function Waistband({ g, h = 6, fill, elastic = false }: { g: Geo; h?: number; fill: string; elastic?: boolean }) {
  const y0 = g.s.rise;
  const y1 = y0 + h;
  const x0 = g.waistX;
  const x1 = g.outerAt(y1);
  const d = `M${r1(CX - x0)} ${y0} L${r1(CX + x0)} ${y0} L${r1(CX + x1)} ${y1} L${r1(CX - x1)} ${y1} Z`;
  let gathers = "";
  if (elastic) {
    for (let x = -x0 + 3; x < x0 - 1; x += 3.4) gathers += `M${r1(CX + x)} ${y0 + 1.2} V${y1 - 1.2} `;
  }
  return (
    <g>
      <path d={d} fill={fill} stroke={C.ink} strokeWidth={1.1} />
      {elastic ? <L d={gathers} o={0.35} w={0.7} /> : null}
    </g>
  );
}

function Loops({ g, xs, fill }: { g: Geo; xs: number[]; fill: string }) {
  const y0 = g.s.rise - 0.8;
  return (
    <g>
      {xs.flatMap((x) => [CX + x, CX - x]).map((x) => (
        <rect key={x} x={r1(x - 1.4)} y={r1(y0)} width={2.8} height={8} rx={0.7} fill={fill} stroke={C.ink} strokeWidth={0.8} />
      ))}
    </g>
  );
}

function Button({ x, y, r = 2 }: { x: number; y: number; r?: number }) {
  return <circle cx={r1(x)} cy={r1(y)} r={r} fill={C.grey} stroke={C.ink} strokeWidth={0.8} />;
}

function Fly({ g, len = 26, stitch = true }: { g: Geo; len?: number; stitch?: boolean }) {
  const y0 = g.s.rise + 6;
  const y1 = Math.min(g.crotchY - 6, y0 + len);
  return (
    <g>
      <L d={`M${CX} ${y0} V${y1}`} o={0.6} />
      {stitch ? (
        <St d={`M${CX + 5.5} ${y0} V${y1 - 5} Q${CX + 5.5} ${y1} ${CX + 0.5} ${y1 + 1}`} />
      ) : (
        <L d={`M${CX + 5.5} ${y0} V${y1 - 5} Q${CX + 5.5} ${y1} ${CX + 0.5} ${y1 + 1}`} o={0.45} w={0.8} />
      )}
    </g>
  );
}

function legCentre(g: Geo, y: number) {
  // pantolon bacağının y'deki orta noktası (CX'ten), yaklaşık
  if (y <= g.kneeY) {
    const t = (y - g.thighY) / (g.kneeY - g.thighY);
    return lerp((g.thighOut + g.thighIn) / 2, g.kc, Math.max(0, Math.min(1, t)));
  }
  const t = (y - g.kneeY) / (g.s.hemY - g.kneeY);
  return lerp(g.kc, g.hc, Math.max(0, Math.min(1, t)));
}

function DenimDetails({ g }: { g: Geo }) {
  const y0 = g.s.rise + 6;
  const w = g.outerAt(y0);
  const pocket = `M${r1(CX + w - 2)} ${y0} Q${r1(CX + w - 12)} ${y0 + 2} ${r1(CX + w - 13)} ${y0 + 14}`;
  const pStitch = `M${r1(CX + w - 4)} ${y0 + 0.8} Q${r1(CX + w - 10.5)} ${y0 + 2.5} ${r1(CX + w - 11)} ${y0 + 11.5}`;
  const coin = `M${r1(CX + w - 6)} ${y0 + 1} V${y0 + 7} H${r1(CX + w - 12)}`;
  const side = `M${r1(CX + g.hipX - 1.5)} ${r1(g.hipY + 6)} Q${r1(CX + g.thighOut - 1.8)} ${r1(g.thighY + 10)} ${r1(CX + g.kneeOut - 1.8)} ${g.kneeY} L${r1(
    CX + g.hemOut - 2
  )} ${g.s.hemY - 3}`;
  const hem = `M${r1(CX + g.hemOut - 1)} ${g.s.hemY - 2.4} L${r1(CX + g.hemIn + 1)} ${g.s.hemY - 2.4}`;
  return (
    <g>
      <L d={both(pocket)} o={0.75} />
      <St d={both(pStitch)} />
      <St d={coin} />
      <St d={both(side)} />
      <St d={both(hem)} />
      <St d={`M${r1(CX - g.waistX + 1.5)} ${g.s.rise + 2.4} H${r1(CX + g.waistX - 1.5)}`} />
      <circle cx={r1(CX + w - 3)} cy={y0 + 1.2} r={1.1} fill={C.stitch} />
      <circle cx={r1(CX - w + 3)} cy={y0 + 1.2} r={1.1} fill={C.stitch} />
      <Button x={CX + 1.5} y={g.s.rise + 3} />
      <Fly g={g} />
    </g>
  );
}

function SlantPockets({ g, depth = 22, inset = 9 }: { g: Geo; depth?: number; inset?: number }) {
  const y0 = g.s.rise + 6;
  const w = g.outerAt(y0);
  const y1 = y0 + depth;
  const d = `M${r1(CX + w - inset)} ${y0} L${r1(CX + g.outerAt(y1) - 0.6)} ${y1}`;
  return <L d={both(d)} o={0.6} />;
}

function Crease({ g, from }: { g: Geo; from?: number }) {
  const y0 = from ?? g.hipY - 6;
  const pts: Pt[] = [];
  for (let y = y0; y <= g.s.hemY - 1; y += 10) pts.push([CX + legCentre(g, Math.max(y, g.thighY)), y]);
  pts.push([CX + legCentre(g, g.s.hemY), g.s.hemY - 0.5]);
  const d = smooth(pts);
  return <L d={both(d)} o={0.38} w={0.9} />;
}

function Pleats({ g, n = 1, len = 12 }: { g: Geo; n?: number; len?: number }) {
  const y0 = g.s.rise + 6;
  let d = "";
  for (let i = 0; i < n; i++) {
    const x = CX + 8 + i * 5;
    d += `M${x} ${y0} Q${x + 0.8} ${y0 + len * 0.6} ${x + 0.3} ${y0 + len} `;
  }
  return <L d={both(d)} o={0.55} w={0.9} />;
}

function Drape({ g, n = 3, from }: { g: Geo; n?: number; from?: number }) {
  const y0 = from ?? g.thighY + 2;
  let d = "";
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1);
    const top = lerp(g.thighIn + 3, g.thighOut - 3, t);
    const bot = lerp(g.hemIn + 3, g.hemOut - 3, t);
    const mid = lerp(top, bot, 0.55) + (i % 2 ? 1.5 : -1.5);
    d += `M${r1(CX + top)} ${r1(y0 + i * 3)} Q${r1(CX + mid)} ${r1(lerp(y0, g.s.hemY, 0.55))} ${r1(CX + bot)} ${g.s.hemY - 1} `;
  }
  return <L d={both(d)} o={0.32} w={0.9} />;
}

function Cuffs({ g, h = 9, fill }: { g: Geo; h?: number; fill: string }) {
  // ribana manşet + üstünde toplanma
  const y1 = g.s.hemY;
  const y0 = y1 - h;
  const o0 = g.hemOut + 0.4;
  const i0 = Math.max(0.9, g.hemIn - 0.4);
  const d = `M${r1(CX + i0)} ${y0} L${r1(CX + o0)} ${y0} L${r1(CX + g.hemOut)} ${y1} L${r1(CX + g.hemIn)} ${y1} Z`;
  let rib = "";
  for (let x = i0 + 1.6; x < o0 - 0.8; x += 2.2) rib += `M${r1(CX + x)} ${y0 + 1} V${y1 - 1} `;
  const gx = [CX + o0 - 1, CX + i0 + 2, CX + (o0 + i0) / 2];
  const gather =
    `M${r1(gx[0])} ${y0 - 1} Q${r1(gx[0] - 2)} ${y0 - 6} ${r1(gx[0] - 4)} ${y0 - 10} ` +
    `M${r1(gx[1])} ${y0 - 1} Q${r1(gx[1] + 1.5)} ${y0 - 6} ${r1(gx[1] + 3)} ${y0 - 9} ` +
    `M${r1(gx[2])} ${y0 - 1} Q${r1(gx[2] - 1)} ${y0 - 5} ${r1(gx[2])} ${y0 - 8}`;
  return (
    <g>
      <path d={`${d} ${mir(d)}`} fill={fill} stroke={C.ink} strokeWidth={1.1} />
      <L d={both(rib)} o={0.35} w={0.6} />
      <L d={both(gather)} o={0.4} w={0.8} />
    </g>
  );
}

function RolledHem({ g, h = 7, fill }: { g: Geo; h?: number; fill: string }) {
  const y1 = g.s.hemY;
  const y0 = y1 - h;
  const o = g.hemOut + 1.2;
  const i = Math.max(0.9, g.hemIn - 0.6);
  const d = `M${r1(CX + i)} ${y0} L${r1(CX + o)} ${y0 + 0.5} L${r1(CX + o - 0.4)} ${y1} L${r1(CX + i + 0.3)} ${y1} Z`;
  return (
    <g>
      <path d={`${d} ${mir(d)}`} fill={fill} stroke={C.ink} strokeWidth={1.1} />
      <path d={`${d} ${mir(d)}`} fill={C.white} opacity={0.18} />
    </g>
  );
}

function CargoPocket({ g }: { g: Geo }) {
  const y = g.thighY + 14;
  const ox = legCentre(g, y + 10) + (g.thighOut - g.thighIn) * 0.18;
  const w = 13;
  const h = 18;
  const x0 = ox - w / 2;
  const rect = (xa: number, ya: number, xb: number, yb: number) =>
    `M${r1(CX + xa)} ${ya} L${r1(CX + xb)} ${ya} L${r1(CX + xb)} ${yb} L${r1(CX + xa)} ${yb} Z`;
  const box = rect(x0, y, x0 + w, y + h);
  const flap = rect(x0 - 0.8, y - 1, x0 + w + 0.8, y + 5);
  return (
    <g>
      <path d={`${box} ${mir(box)}`} fill={C.cloth3} stroke={C.ink} strokeWidth={1} />
      <path d={`${flap} ${mir(flap)}`} fill={C.cloth3} stroke={C.ink} strokeWidth={1} />
      <L d={both(`M${r1(CX + x0 + w / 2)} ${y + h - 0.5} L${r1(CX + x0 + w / 2)} ${y + 6}`)} o={0.35} w={0.7} />
    </g>
  );
}

function Drawstring({ g }: { g: Geo }) {
  const y = g.s.rise + 4;
  return (
    <g>
      <circle cx={CX - 3} cy={y} r={0.9} fill={C.ink} />
      <circle cx={CX + 3} cy={y} r={0.9} fill={C.ink} />
      <path d={`M${CX - 3} ${y} q-1.5 8 -3 14 M${CX + 3} ${y} q1.5 8 3 14`} stroke={C.white} strokeWidth={1.4} fill="none" />
      <path d={`M${CX - 3} ${y} q-1.5 8 -3 14 M${CX + 3} ${y} q1.5 8 3 14`} stroke={C.ink} strokeWidth={0.5} fill="none" opacity={0.6} />
    </g>
  );
}

/** diz hizasında yıpranma izi (mutlak koordinatlı; mir() göreli komutları aynalayamaz) */
function fade(x: number, y: number) {
  return `M${r1(x - 4)} ${y - 3} Q${r1(x - 1)} ${y - 4} ${r1(x + 2)} ${y - 3} M${r1(x - 3)} ${y + 1} Q${r1(x - 0.5)} ${y} ${r1(x + 2)} ${y + 1}`;
}

function FitDetails({ g }: { g: Geo }) {
  const s = g.s;
  switch (s.detail) {
    case "denim":
      return (
        <g>
          <DenimDetails g={g} />
          <Loops g={g} xs={[9, g.waistX - 6]} fill={s.fill} />
        </g>
      );
    case "boyfriend":
      return (
        <g>
          <DenimDetails g={g} />
          <Loops g={g} xs={[9, g.waistX - 6]} fill={s.fill} />
          <RolledHem g={g} fill={s.fill} />
          <L d={both(fade(CX + legCentre(g, g.kneeY), g.kneeY))} o={0.4} w={0.8} />
        </g>
      );
    case "chino":
      return (
        <g>
          <Waistband g={g} fill={s.fill} />
          <Loops g={g} xs={[9, g.waistX - 6]} fill={s.fill} />
          <SlantPockets g={g} />
          <Button x={CX + 1.5} y={s.rise + 3} />
          <Fly g={g} stitch={false} />
          <L d={both(`M${r1(CX + g.hemOut - 1)} ${s.hemY - 2.6} L${r1(CX + g.hemIn + 1)} ${s.hemY - 2.6}`)} o={0.35} w={0.7} />
        </g>
      );
    case "trouser":
      return (
        <g>
          <Waistband g={g} fill={s.fill} />
          <Loops g={g} xs={[9, g.waistX - 6]} fill={s.fill} />
          <SlantPockets g={g} />
          <Button x={CX + 1.5} y={s.rise + 3} />
          <Fly g={g} stitch={false} />
          <Pleats g={g} n={1} />
          <Crease g={g} />
        </g>
      );
    case "havuc":
      return (
        <g>
          <Waistband g={g} fill={s.fill} h={7} />
          <SlantPockets g={g} inset={10} />
          <Button x={CX + 1.5} y={s.rise + 3.5} />
          <Fly g={g} stitch={false} />
          <Pleats g={g} n={2} len={16} />
          <Crease g={g} from={s.rise + 26} />
          <RolledHem g={g} h={5} fill={s.fill} />
        </g>
      );
    case "palazzo":
      return (
        <g>
          <Waistband g={g} fill={s.fill} h={8} elastic />
          <Drape g={g} n={4} from={s.rise + 18} />
        </g>
      );
    case "kulot":
      return (
        <g>
          <Waistband g={g} fill={s.fill} h={7} />
          <SlantPockets g={g} />
          <Button x={CX + 1.5} y={s.rise + 3.5} />
          <Pleats g={g} n={1} len={14} />
          <Drape g={g} n={2} from={s.rise + 26} />
        </g>
      );
    case "jogger":
      return (
        <g>
          <Waistband g={g} fill={s.fill} h={8} elastic />
          <Drawstring g={g} />
          <SlantPockets g={g} depth={18} inset={4} />
          <Cuffs g={g} fill={s.fill} />
        </g>
      );
    case "kargo":
      return (
        <g>
          <Waistband g={g} fill={s.fill} />
          <Loops g={g} xs={[9, g.waistX - 6]} fill={s.fill} />
          <SlantPockets g={g} depth={18} />
          <Button x={CX + 1.5} y={s.rise + 3} />
          <Fly g={g} stitch={false} />
          <CargoPocket g={g} />
          <L d={both(`M${r1(CX + g.hemOut - 1)} ${s.hemY - 2.6} L${r1(CX + g.hemIn + 1)} ${s.hemY - 2.6}`)} o={0.35} w={0.7} />
        </g>
      );
  }
}

/* ---------------- kılavuz çizgileri ---------------- */

function Guides({ g, showWaist }: { g: Geo; showWaist: boolean }) {
  const s = g.s;
  const bx = Math.max(6, CX - g.maxOut - 9);
  const wy = g.b.waistY;
  const hem = (side: 1 | -1) =>
    `M${r1(CX + side * (g.hemIn + 0.6))} ${s.hemY} L${r1(CX + side * (g.hemOut - 0.6))} ${s.hemY}`;
  return (
    <g>
      {/* doğal bel hizası */}
      <path
        d={`M${r1(bx - 3)} ${wy} H${r1(CX + g.maxOut + 6)}`}
        stroke={C.guide}
        strokeWidth={showWaist ? 1.1 : 0.8}
        strokeDasharray="3 2.5"
        opacity={showWaist ? 0.9 : 0.45}
      />
      {/* ön ağ (rise): bel bandından ağa */}
      <path
        d={`M${r1(bx + 3)} ${s.rise} H${r1(bx)} V${r1(g.crotchY)} H${r1(bx + 3)}`}
        stroke={C.guide}
        strokeWidth={1.3}
        fill="none"
        opacity={0.9}
      />
      <path d={`M${r1(bx + 3.5)} ${s.rise} H${r1(CX - g.waistX - 1)}`} stroke={C.guide} strokeWidth={0.6} opacity={0.5} strokeDasharray="1.5 1.5" />
      {/* paça genişliği */}
      <path d={`${hem(1)} ${hem(-1)}`} stroke={C.guide} strokeWidth={2.4} opacity={0.95} />
    </g>
  );
}

export type FitSilhouetteProps = BaseProps & {
  silo: Silo;
  fit: string;
  tone?: Tone;
  /** kılavuz çizgileri (rise ayracı, doğal bel, paça) – varsayılan açık */
  guides?: boolean;
};

export function FitSilhouette({ silo, fit, tone, guides = true, title, ...rest }: FitSilhouetteProps) {
  const specs = SPECS[silo] as Record<string, FitSpec> | undefined;
  const spec = specs?.[fit];
  const label = fitLabel(silo, fit);
  if (!spec) return <Fallback viewBox={VB} title={title} {...rest} />;
  const g = geometry(silo, spec);
  const body = bodyPath(silo);
  const t = toneColors(tone);
  return (
    <Svg viewBox={VB} title={title ?? (label ? `${label} kalıp, önden görünüm` : undefined)} {...rest}>
      {/* soluk vücut */}
      <path d={body.d} fill={t.skin} opacity={0.32} />
      <path d={body.feet.join(" ")} fill={C.cream} stroke={C.ink2} strokeWidth={0.8} opacity={0.7} />
      {/* pantolon */}
      <path d={g.d} fill={spec.fill} stroke={C.ink} strokeWidth={1.5} strokeLinejoin="round" />
      <FitDetails g={g} />
      {/* kesikli bacak hattı: kumaş ile bacak arasındaki pay */}
      <path d={`${body.legLine(1)} ${body.legLine(-1)}`} stroke={C.white} strokeWidth={1.1} strokeDasharray="2.4 2.2" opacity={0.75} fill="none" />
      <path d={`${body.legLine(1)} ${body.legLine(-1)}`} stroke={C.ink} strokeWidth={0.5} strokeDasharray="2.4 2.2" opacity={0.35} fill="none" />
      {guides ? <Guides g={g} showWaist={!!spec.riseFocus} /> : null}
    </Svg>
  );
}


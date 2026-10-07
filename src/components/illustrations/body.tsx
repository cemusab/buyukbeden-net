import type { ReactNode } from "react";
import { Fallback, Svg, C, lerp, mirror, pt, r1, sampleProfile, profileAt, smooth, toneColors, type BaseProps, type Pt, type Silo, type Tone } from "./shared";

/**
 * Parametrik, önden görünüm figür çizimi.
 * Gövde; omuz (S), göğüs (B), bel (W), basen/kalça (H), üst bacak (T), diz (K), bilek (A)
 * yarı genişliklerinden üretilir. Böylece her vücut tipinde ayırt edici oran
 * (omuz – bel – basen ilişkisi) ölçülü ve tutarlı kalır.
 */

export const BODY_SHAPES = {
  kadin: ["armut", "elma", "kum-saati", "dikdortgen", "ters-ucgen"],
  erkek: ["oval", "dikdortgen", "ters-ucgen", "trapez"],
} as const;

export type KadinShape = (typeof BODY_SHAPES.kadin)[number];
export type ErkekShape = (typeof BODY_SHAPES.erkek)[number];
export type BodyShapeKey = KadinShape | ErkekShape;

export const BODY_SHAPE_LABELS: Record<Silo, Record<string, string>> = {
  kadin: { armut: "Armut", elma: "Elma", "kum-saati": "Kum saati", dikdortgen: "Dikdörtgen", "ters-ucgen": "Ters üçgen" },
  erkek: { oval: "Oval (göbekli)", dikdortgen: "Dikdörtgen", "ters-ucgen": "Ters üçgen", trapez: "Trapez" },
};

type Dims = { S: number; B: number; W: number; H: number; T: number; K: number; A: number; spread?: number; armGap?: number };

const DIMS: { kadin: Record<KadinShape, Dims>; erkek: Record<ErkekShape, Dims> } = {
  kadin: {
    armut: { S: 42, B: 43, W: 38, H: 62, T: 56, K: 33, A: 21 },
    elma: { S: 48, B: 56, W: 59, H: 51, T: 45, K: 29.5, A: 20, armGap: -3 },
    "kum-saati": { S: 51, B: 55, W: 38, H: 58, T: 52, K: 31.5, A: 20.5 },
    dikdortgen: { S: 47, B: 48, W: 46, H: 48.5, T: 45, K: 30.5, A: 20 },
    "ters-ucgen": { S: 59, B: 57, W: 45, H: 43, T: 41, K: 28.5, A: 19.5 },
  },
  erkek: {
    oval: { S: 55, B: 58, W: 65, H: 54, T: 47, K: 31.5, A: 21.5, armGap: -3 },
    dikdortgen: { S: 52, B: 52, W: 51.5, H: 51.5, T: 47, K: 31.5, A: 21.5 },
    "ters-ucgen": { S: 68, B: 64, W: 47, H: 45, T: 43, K: 30.5, A: 21 },
    trapez: { S: 61, B: 59, W: 50, H: 51, T: 47, K: 31.5, A: 21.5 },
  },
};

const MEASURE_DIMS: Record<Silo, Dims> = {
  kadin: { S: 48, B: 52, W: 44, H: 57, T: 51, K: 31.5, A: 20.5, spread: 9 },
  erkek: { S: 58, B: 57, W: 56, H: 53, T: 47, K: 31.5, A: 21.5, spread: 9 },
};

const LV = {
  kadin: { shoulder: 96, bust: 128, waist: 164, hip: 210, crotch: 242, knee: 304, ankle: 368, hem: 196, neck: 9.5 },
  erkek: { shoulder: 96, bust: 126, waist: 172, hip: 208, crotch: 242, knee: 304, ankle: 368, hem: 220, neck: 11.5 },
};

type Geo = ReturnType<typeof buildGeometry>;

function buildGeometry(silo: Silo, d: Dims, cx: number) {
  const L = LV[silo];
  const fem = silo === "kadin";
  const au = fem ? 12.6 : 14.2; // üst kol yarı genişlik
  const we = fem ? 9.2 : 10.6;
  const ww = fem ? 6.2 : 7.2;

  const outer: Pt[] = [
    [L.shoulder - 2, d.S - au * 0.8],
    [112, lerp(d.S - au * 0.8, d.B, 0.65)],
    [L.bust, d.B],
    [fem ? 146 : 148, lerp(d.B, d.W, fem ? 0.6 : 0.55)],
    [L.waist, d.W],
    [(L.waist + L.hip) / 2, lerp(d.W, d.H, fem ? 0.62 : 0.55)],
    [L.hip, d.H],
    [L.crotch - 2, d.T],
    [272, lerp(d.T, d.K, 0.52) + 1.5],
    [L.knee, d.K],
    [330, d.K - 0.5],
    [352, lerp(d.K, d.A, 0.62)],
    [L.ankle, d.A],
  ];
  const g = Math.max(0, Math.min(1.4, (50 - d.T) / 7));
  const inner: Pt[] = [
    [L.crotch, 1.3],
    [266, 1.6 + g * 1.4],
    [288, 3.2 + g * 1.2],
    [L.knee, 5.2 + g],
    [330, 6.4 + g],
    [L.ankle, 7.4],
  ];

  // kol: omuz eklemi → bilek düz bir eksende, dirsekte hafif kırılım.
  // Bilek, kolun iç kenarı gövdeden (bel/basen) belirgin bir boşlukla ayrılana kadar dışa açılır;
  // böylece vücut tipinin bel ve basen hattı kolun arkasında kaybolmaz.
  const J: Pt = [d.S - au, L.shoulder + 2];
  const armLen = fem ? 124 : 131;
  const gap = (d.armGap ?? 3.5) + (d.spread ?? 0);
  let wx = J[0] + 6;
  let Wr: Pt = [wx, J[1] + armLen];
  for (let iter = 0; iter < 120; iter++) {
    Wr = [wx, J[1] + Math.sqrt(Math.max(1, armLen ** 2 - (wx - J[0]) ** 2))];
    let ok = true;
    for (let t = 0.3; t <= 1.0001; t += 0.05) {
      const px = lerp(J[0], Wr[0], t);
      const py = lerp(J[1], Wr[1], t);
      if (py < L.waist - 10) continue;
      const w = t < 0.52 ? lerp(au, we, t / 0.52) : lerp(we, ww, (t - 0.52) / 0.48);
      if (px - w - gap < profileAt(outer, py)) {
        ok = false;
        break;
      }
    }
    if (ok) break;
    wx += 1;
  }
  const len = Math.hypot(Wr[0] - J[0], Wr[1] - J[1]);
  const E: Pt = [lerp(J[0], Wr[0], 0.52) + ((Wr[1] - J[1]) / len) * 2.2, lerp(J[1], Wr[1], 0.52) - ((Wr[0] - J[0]) / len) * 2.2];

  return { L, fem, au, we, ww, outer, inner, J, E, Wr, cx, d };
}

const toAbs = (cx: number, p: Pt): Pt => [cx + p[0], p[1]];

function norm(a: Pt, b: Pt): Pt {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l = Math.hypot(dx, dy) || 1;
  // sağ kol için dışa bakan normal (+x yönü)
  return [dy / l, -dx / l];
}
const add = (a: Pt, b: Pt, k = 1): Pt => [a[0] + b[0] * k, a[1] + b[1] * k];

/** Sağ kol dış hattı (sol kol aynalanır). */
function armPoints(g: Geo) {
  const J = toAbs(g.cx, g.J);
  const E = toAbs(g.cx, g.E);
  const W = toAbs(g.cx, g.Wr);
  const nU = norm(J, E);
  const nF = norm(E, W);
  const nE: Pt = [(nU[0] + nF[0]) / 2, (nU[1] + nF[1]) / 2];
  const mid = (a: Pt, b: Pt, t: number): Pt => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
  return { J, E, W, nU, nF, nE, mid };
}

function armPath(g: Geo) {
  const { J, E, W, nU, nF, nE, mid } = armPoints(g);
  const cap: Pt = [J[0] - g.au * 0.25, J[1] - g.au * 1.02];
  const pts: Pt[] = [
    add(J, nU, -g.au * 0.95),
    add(J, [-0.75, -0.65], g.au * 0.9),
    cap,
    add(J, [0.85, -0.5], g.au),
    add(J, nU, g.au * 1.04),
    add(mid(J, E, 0.5), nU, lerp(g.au, g.we, 0.45)),
    add(E, nE, g.we),
    add(mid(E, W, 0.55), nF, lerp(g.we, g.ww, 0.5) + 0.4),
    add(W, nF, g.ww),
  ];
  const back: Pt[] = [
    add(W, nF, -g.ww),
    add(mid(E, W, 0.5), nF, -lerp(g.we, g.ww, 0.5)),
    add(E, nE, -g.we * 0.92),
    add(mid(J, E, 0.55), nU, -lerp(g.au, g.we, 0.5)),
    add(J, nU, -g.au * 0.95),
  ];
  return smooth(pts) + " " + smooth(back, { move: false }).replace(/^L/, "L") + " Z";
}

function sleevePath(g: Geo, t: number, ease = 1.1) {
  const { J, E, nU, mid } = armPoints(g);
  const P = mid(J, E, t);
  const w = lerp(g.au, g.we, t * 0.8) + ease;
  const cap: Pt = [J[0] - g.au * 0.25, J[1] - g.au * 1.02 - ease * 0.3];
  const pts: Pt[] = [
    add(P, nU, -w + 0.4),
    add(J, nU, -(g.au + ease) * 0.95),
    add(J, [-0.75, -0.65], (g.au + ease) * 0.9),
    cap,
    add(J, [0.85, -0.5], g.au + ease),
    add(J, nU, (g.au + ease) * 1.04),
    add(P, nU, w + 0.4),
  ];
  return smooth(pts) + " Z";
}

function handPath(g: Geo) {
  const { W, E } = armPoints(g);
  const dx = W[0] - E[0];
  const dy = W[1] - E[1];
  const l = Math.hypot(dx, dy) || 1;
  const ux = dx / l;
  const uy = dy / l;
  const s = g.fem ? 1 : 1.12;
  // yerel çerçeve: (yanal, ileri)
  const local: Pt[] = [
    [-5.6, -1],
    [-6.6, 7],
    [-6, 14],
    [-3, 19.5],
    [1.5, 20.5],
    [5.2, 17],
    [6.4, 10],
    [7.6, 7],
    [6.6, 2],
    [5.8, -1],
  ];
  // yanal eksen (uy, −ux) ≈ dış taraf; ileri eksen (ux, uy)
  const pts = local.map(([a, b]): Pt => [W[0] + (uy * a + ux * b) * s, W[1] + (-ux * a + uy * b) * s]);
  return smooth(pts, { closed: true });
}

function mirrorPath(d: string, cx: number) {
  // yalnız M/L/C/Q komutlu mutlak yollar için: x → 2cx - x
  return d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_m, x, y) => `${r1(2 * cx - Number(x))} ${y}`);
}

function bodyPath(g: Geo) {
  const { L, cx, outer, inner } = g;
  const nh = L.neck;
  const sideTop: Pt[] = [
    [cx + nh, 50],
    [cx + nh, 70],
    [cx + nh + 7, 81],
    [cx + g.d.S - g.au - 4, 88],
  ];
  const right = [...sideTop, ...sampleProfile(outer, L.shoulder - 2, L.ankle, cx, 1)];
  const innerUp = sampleProfile(inner, L.ankle, L.crotch, cx, 1);
  const m = mirror(cx);
  const leftInnerDown = innerUp.slice().reverse().map(m);
  const leftUp = right.slice().reverse().map(m);
  return [
    smooth(right),
    smooth(innerUp, { move: false }),
    smooth(leftInnerDown, { move: false }),
    smooth(leftUp, { move: false }),
    "Z",
  ].join(" ");
}

function legGarmentPath(g: Geo, outerKeys: Pt[], innerKeys: Pt[], top: number, bottom: number) {
  const { cx, L } = g;
  const right = sampleProfile(outerKeys, top, bottom, cx, 1);
  const innerUp = sampleProfile(innerKeys, bottom, L.crotch, cx, 1);
  const m = mirror(cx);
  return [
    smooth(right),
    smooth(innerUp, { move: false }),
    smooth(innerUp.slice().reverse().map(m), { move: false }),
    smooth(right.slice().reverse().map(m), { move: false }),
    "Z",
  ].join(" ");
}

function topPath(g: Geo, hemY: number, neckStyle: "scoop" | "crew") {
  const { cx, L, outer } = g;
  const nh = L.neck;
  const e = 1.3;
  const sideTop: Pt[] =
    neckStyle === "scoop"
      ? [
          [cx + nh + 5.5, 77],
          [cx + nh + 11, 83],
          [cx + g.d.S - g.au - 3, 87.6],
        ]
      : [
          [cx + nh + 2.5, 75],
          [cx + nh + 9, 81.5],
          [cx + g.d.S - g.au - 3, 87.4],
        ];
  const right = [...sideTop, ...sampleProfile(outer, L.shoulder - 2, hemY, cx, 1, e)];
  const m = mirror(cx);
  const left = right.slice().reverse().map(m);
  const hemDip = g.fem ? 2.5 : 1.5;
  const first = right[0];
  const neckD =
    neckStyle === "scoop"
      ? ` Q${pt([cx, 96])} ${pt(first)}`
      : ` Q${pt([cx, 88])} ${pt(first)}`;
  const firstL = left[0];
  return `${smooth(right)} Q${pt([cx, hemY + hemDip])} ${pt(firstL)} ${smooth(left.slice(1), { move: false })}${neckD} Z`;
}

function trouserKeys(g: Geo) {
  const { d, L } = g;
  const top = Math.min(profileAt(g.outer, L.hem - 14) + 0.6, Math.max(d.W, d.H) + 2);
  const outer: Pt[] = [
    [L.hem - 14, top],
    [L.hip, d.H + 2.6],
    [L.crotch, d.T + 2.8],
    [L.knee, d.K + 3.4],
    [L.ankle, d.K + 2.2],
  ];
  const inner: Pt[] = [
    [L.crotch + 1, 1.2],
    [L.knee, 3.4],
    [L.ankle, 3.8],
  ];
  return { outer, inner };
}

function Head({ g, tone }: { g: Geo; tone: ReturnType<typeof toneColors> }) {
  const { cx, fem } = g;
  if (fem) {
    const back: Pt[] = [
      [cx - 15, 69],
      [cx - 21, 62],
      [cx - 21.5, 44],
      [cx - 18, 26],
      [cx - 6, 17.5],
      [cx + 9, 18.5],
      [cx + 19.5, 28],
      [cx + 22, 46],
      [cx + 21.5, 63],
      [cx + 15, 70],
      [cx + 9, 64],
      [cx - 9, 64],
    ];
    const fringeOuter: Pt[] = [
      [cx - 15.5, 44],
      [cx - 14.5, 28],
      [cx - 4, 20],
      [cx + 9, 21],
      [cx + 15.5, 30],
      [cx + 16, 44],
    ];
    const fringeInner: Pt[] = [
      [cx + 12.5, 38],
      [cx + 8.5, 29.5],
      [cx - 3, 28],
      [cx - 11.5, 33],
    ];
    return (
      <g>
        <path d={smooth(back, { closed: true })} fill={tone.hair} stroke={C.ink} strokeWidth={1.4} />
        <ellipse cx={cx} cy={39} rx={14.2} ry={17.6} fill={tone.skin} stroke={C.ink} strokeWidth={1.4} />
        <path d={`${smooth(fringeOuter)} ${smooth(fringeInner, { move: false })} Z`} fill={tone.hair} stroke={C.ink} strokeWidth={1.4} />
      </g>
    );
  }
  const capOuter: Pt[] = [
    [cx - 15.6, 39],
    [cx - 16.4, 26],
    [cx - 8, 17],
    [cx + 5, 16.6],
    [cx + 14.5, 22],
    [cx + 16.4, 31],
    [cx + 15.8, 39],
  ];
  const capInner: Pt[] = [
    [cx + 13.6, 30],
    [cx + 5, 25.6],
    [cx - 7, 27],
    [cx - 13.6, 32],
  ];
  return (
    <g>
      <ellipse cx={cx - 15.3} cy={42} rx={3} ry={4.6} fill={tone.skin} stroke={C.ink} strokeWidth={1.3} />
      <ellipse cx={cx + 15.3} cy={42} rx={3} ry={4.6} fill={tone.skin} stroke={C.ink} strokeWidth={1.3} />
      <ellipse cx={cx} cy={39} rx={15.2} ry={18.4} fill={tone.skin} stroke={C.ink} strokeWidth={1.4} />
      <path d={`${smooth(capOuter)} ${smooth(capInner, { move: false })} Z`} fill={tone.hair} stroke={C.ink} strokeWidth={1.4} />
    </g>
  );
}

function Shoes({ g }: { g: Geo }) {
  const { cx, d, L, fem } = g;
  const ai = 7.4;
  const c = (d.A + ai) / 2;
  const hw = (d.A - ai) / 2 + (fem ? 3.6 : 4.6);
  const one = (x: number) => {
    const y0 = L.ankle - 3;
    return `M${pt([x - hw, y0])} C${pt([x - hw - 1.5, y0 + 10])} ${pt([x - hw * 0.6, y0 + 19])} ${pt([x, y0 + 19.5])} C${pt([
      x + hw * 0.6,
      y0 + 19,
    ])} ${pt([x + hw + 1.5, y0 + 10])} ${pt([x + hw, y0])} Q${pt([x, y0 + 4])} ${pt([x - hw, y0])} Z`;
  };
  const fill = fem ? C.cloth4 : C.ink2;
  return (
    <g fill={fill} stroke={C.ink} strokeWidth={1.4}>
      <path d={one(cx + c)} />
      <path d={one(cx - c)} />
    </g>
  );
}

type FigureOpts = { silo: Silo; d: Dims; cx: number; tone?: Tone };

function Figure({ silo, d, cx, tone }: FigureOpts) {
  const g = buildGeometry(silo, d, cx);
  const t = toneColors(tone);
  const arm = armPath(g);
  const sleeve = sleevePath(g, g.fem ? 0.42 : 0.5);
  const hand = handPath(g);
  const { L } = g;
  const fem = g.fem;
  let bottoms: string;
  const details: ReactNode[] = [];
  if (fem) {
    bottoms = legGarmentPath(
      g,
      g.outer.map(([y, x]): Pt => [y, x + 0.9]),
      g.inner.map(([y, x]): Pt => [y, Math.max(0.8, x - 0.4)]),
      L.waist + 8,
      L.ankle - 10
    );
  } else {
    const k = trouserKeys(g);
    bottoms = legGarmentPath(g, k.outer, k.inner, L.hem - 14, L.ankle - 2);
    // ütü izi
    const crease = (side: 1 | -1) => {
      const xTop = cx + side * ((d.T + 2.8 + 1.2) / 2 + 0.5);
      const xBot = cx + side * ((d.K + 2.2 + 3.8) / 2);
      return `M${pt([xTop, L.crotch + 6])} L${pt([xBot, L.ankle - 6])}`;
    };
    details.push(<path key="c1" d={crease(1)} stroke={C.ink} strokeWidth={0.8} opacity={0.45} />);
    details.push(<path key="c2" d={crease(-1)} stroke={C.ink} strokeWidth={0.8} opacity={0.45} />);
  }
  const top = topPath(g, L.hem, fem ? "scoop" : "crew");
  const legSkin = (
    <path d={bodyPath(g)} fill={t.skin} stroke={C.ink} strokeWidth={1.5} />
  );
  return (
    <g>
      {legSkin}
      {/* çene altı gölge */}
      <path d={`M${pt([cx - L.neck, 56])} Q${pt([cx, 64])} ${pt([cx + L.neck, 56])} L${pt([cx + L.neck, 52])} L${pt([cx - L.neck, 52])} Z`} fill={t.shade} />
      <path d={bottoms} fill={C.cloth1} stroke={C.ink} strokeWidth={1.5} />
      {details}
      <Shoes g={g} />
      <path d={top} fill={fem ? C.cloth2 : C.stone} stroke={C.ink} strokeWidth={1.5} />
      {!fem ? (
        <path
          d={`M${pt([cx - L.neck - 6.5, 76.6])} Q${pt([cx, 93])} ${pt([cx + L.neck + 6.5, 76.6])}`}
          stroke={C.ink}
          strokeWidth={0.9}
          opacity={0.55}
        />
      ) : null}
      {/* kollar */}
      <path d={arm} fill={t.skin} stroke={C.ink} strokeWidth={1.5} />
      <path d={mirrorPath(arm, cx)} fill={t.skin} stroke={C.ink} strokeWidth={1.5} />
      <path d={sleeve} fill={fem ? C.cloth2 : C.stone} stroke={C.ink} strokeWidth={1.5} />
      <path d={mirrorPath(sleeve, cx)} fill={fem ? C.cloth2 : C.stone} stroke={C.ink} strokeWidth={1.5} />
      <path d={hand} fill={t.skin} stroke={C.ink} strokeWidth={1.4} />
      <path d={mirrorPath(hand, cx)} fill={t.skin} stroke={C.ink} strokeWidth={1.4} />
      <Head g={g} tone={t} />
    </g>
  );
}

/* ---------------- yardımcı çizgiler ---------------- */

function GuideLine({ y, half, cx, label, vbW }: { y: number; half: number; cx: number; label: string; vbW: number }) {
  return (
    <g>
      <path d={`M6 ${y} H${vbW - 6}`} stroke={C.guide} strokeWidth={0.8} strokeDasharray="2 3" opacity={0.55} />
      <path d={`M${r1(cx - half)} ${y} H${r1(cx + half)}`} stroke={C.guide} strokeWidth={1.8} />
      <path d={`M${r1(cx - half)} ${y - 4} v8 M${r1(cx + half)} ${y - 4} v8`} stroke={C.guide} strokeWidth={1.6} />
      <rect x={3} y={y - 15} width={label.length * 6 + 8} height={12} rx={6} fill={C.paper} opacity={0.92} />
      <text x={7} y={y - 6} fontSize={10} fontWeight={600} fill={C.guide} fontFamily="inherit" letterSpacing="0.02em">
        {label}
      </text>
    </g>
  );
}

export type BodyShapeProps = BaseProps & {
  silo: Silo;
  shape: string;
  /** Omuz/Bel/Basen yardımcı çizgileri */
  guides?: boolean;
  tone?: Tone;
};

export function BodyShape({ silo, shape, guides = false, tone, ...rest }: BodyShapeProps) {
  const table = DIMS[silo] as Record<string, Dims> | undefined;
  const d = table?.[shape];
  if (!d) return <Fallback viewBox="0 0 240 400" {...rest} />;
  const cx = 120;
  const g = buildGeometry(silo, d, cx);
  const L = g.L;
  return (
    <Svg viewBox="0 0 240 400" {...rest}>
      <Figure silo={silo} d={d} cx={cx} tone={tone} />
      {guides ? (
        <g>
          <GuideLine y={L.shoulder - 6} half={g.J[0] + g.au + 1} cx={cx} label="Omuz" vbW={240} />
          <GuideLine y={L.waist} half={d.W + 1.3} cx={cx} label="Bel" vbW={240} />
          <GuideLine y={L.hip} half={d.H + 1} cx={cx} label={silo === "kadin" ? "Basen" : "Kalça"} vbW={240} />
        </g>
      ) : null}
    </Svg>
  );
}

/* ---------------- ölçü figürü ---------------- */

export const MEASURE_KEYS = ["gogus", "bel", "basen", "omuz", "kol", "ic-bacak"] as const;
export type MeasureKey = (typeof MEASURE_KEYS)[number];
export const MEASURE_LABELS: Record<Silo, Record<MeasureKey, string>> = {
  kadin: { gogus: "Göğüs", bel: "Bel", basen: "Basen", omuz: "Omuz", kol: "Kol boyu", "ic-bacak": "İç bacak" },
  erkek: { gogus: "Göğüs", bel: "Bel", basen: "Kalça", omuz: "Omuz", kol: "Kol boyu", "ic-bacak": "İç bacak" },
};

export type MeasureFigureProps = BaseProps & {
  silo: Silo;
  /** Gösterilecek ölçüler (varsayılan: hepsi) */
  show?: readonly string[];
  /** Metin etiketleri (false: yalnız çizgiler + numara) */
  labels?: boolean;
  tone?: Tone;
};

export function MeasureFigure({ silo, show, labels = true, tone, ...rest }: MeasureFigureProps) {
  if (silo !== "kadin" && silo !== "erkek") return <Fallback viewBox="0 0 320 400" {...rest} />;
  const d = MEASURE_DIMS[silo];
  const cx = 160;
  const vbW = 320;
  const g = buildGeometry(silo, d, cx);
  const L = g.L;
  const keys = (show ?? MEASURE_KEYS).filter((k): k is MeasureKey => (MEASURE_KEYS as readonly string[]).includes(k));
  const lab = MEASURE_LABELS[silo];
  const tape = { stroke: C.guide, strokeWidth: 2 } as const;
  const dot = (p: Pt, key: string) => <circle key={key} cx={r1(p[0])} cy={r1(p[1])} r={2.2} fill={C.guide} />;
  const items: ReactNode[] = [];
  const num = (k: MeasureKey) => MEASURE_KEYS.indexOf(k) + 1;
  const Badge = ({ x, y, k }: { x: number; y: number; k: MeasureKey }) => (
    <g>
      <circle cx={x} cy={y} r={6.5} fill={C.guide} />
      <text x={x} y={y + 3.2} fontSize={9} fontWeight={700} fill={C.white} textAnchor="middle" fontFamily="inherit">
        {num(k)}
      </text>
    </g>
  );
  const leftLabel = (k: MeasureKey, y: number, fromX: number) => (
    <g key={`l-${k}`}>
      <path d={`M${r1(fromX)} ${y} H${labels ? 50 : 22}`} stroke={C.guide} strokeWidth={0.8} strokeDasharray="2 2.5" />
      <Badge x={14} y={y} k={k} />
      {labels ? (
        <text x={24} y={y - 4} fontSize={10.5} fontWeight={600} fill={C.ink} fontFamily="inherit">
          {lab[k]}
        </text>
      ) : null}
    </g>
  );
  const rightLabel = (k: MeasureKey, y: number, fromX: number) => (
    <g key={`r-${k}`}>
      <path d={`M${r1(fromX)} ${y} H${labels ? vbW - 50 : vbW - 22}`} stroke={C.guide} strokeWidth={0.8} strokeDasharray="2 2.5" />
      <Badge x={vbW - 14} y={y} k={k} />
      {labels ? (
        <text x={vbW - 24} y={y - 4} fontSize={10.5} fontWeight={600} fill={C.ink} textAnchor="end" fontFamily="inherit">
          {lab[k]}
        </text>
      ) : null}
    </g>
  );
  const band = (y: number, half: number, k: MeasureKey) => {
    const x0 = cx - half - 1.5;
    const x1 = cx + half + 1.5;
    items.push(
      <g key={k}>
        <path d={`M${r1(x0)} ${y - 1} Q${cx} ${y + 6} ${r1(x1)} ${y - 1}`} {...tape} />
        <path d={`M${r1(x0)} ${y - 1} Q${cx} ${y - 5} ${r1(x1)} ${y - 1}`} stroke={C.guide} strokeWidth={0.9} strokeDasharray="2 2" opacity={0.7} />
        {dot([x0, y - 1], "a")}
        {dot([x1, y - 1], "b")}
      </g>
    );
    items.push(leftLabel(k, y - 1, x0 - 3));
  };
  if (keys.includes("omuz")) {
    const half = g.J[0] + g.au * 0.2;
    const y = L.shoulder - g.au - 3;
    items.push(
      <g key="omuz">
        <path d={`M${r1(cx - half)} ${y + 2} Q${cx} ${y - 4} ${r1(cx + half)} ${y + 2}`} {...tape} />
        {dot([cx - half, y + 2], "a")}
        {dot([cx + half, y + 2], "b")}
      </g>
    );
    items.push(leftLabel("omuz", y + 2, cx - half - 3));
  }
  if (keys.includes("gogus")) band(L.bust, d.B + 1.3, "gogus");
  if (keys.includes("bel")) band(L.waist, d.W + 1.3, "bel");
  if (keys.includes("basen")) band(L.hip, d.H + 1, "basen");
  if (keys.includes("kol")) {
    const { J, E, W, nU, nF } = armPoints(g);
    const off = 6.5;
    const a = add(add(J, [0.6, -0.8], g.au * 0.9), nU, 2);
    const b = add(E, [(nU[0] + nF[0]) / 2, (nU[1] + nF[1]) / 2], g.we + off);
    const c = add(W, nF, g.ww + off);
    items.push(
      <g key="kol">
        <path d={`M${pt(a)} Q${pt(add(b, nU, 2))} ${pt(c)}`} {...tape} />
        {dot(a, "a")}
        {dot(c, "b")}
      </g>
    );
    const ly = r1(lerp(a[1], c[1], 0.55));
    const lx = lerp(a[0], c[0], 0.55) + 6;
    items.push(rightLabel("kol", ly, lx));
  }
  if (keys.includes("ic-bacak")) {
    const top = L.crotch + 3;
    const bot = L.ankle - 1;
    const pts = sampleProfile(g.inner, top, bot, cx, 1, 6, 10);
    items.push(
      <g key="ib">
        <path d={smooth(pts)} {...tape} />
        {dot(pts[0], "a")}
        {dot(pts[pts.length - 1], "b")}
      </g>
    );
    const midY = 312;
    const midX = cx + profileAt(g.inner, midY) + 6;
    const outerAt = cx + profileAt(g.outer, midY) + 4;
    items.push(
      <path key="ib-l" d={`M${r1(midX)} ${midY} H${r1(outerAt)}`} stroke={C.guide} strokeWidth={0.8} strokeDasharray="2 2.5" />
    );
    items.push(rightLabel("ic-bacak", midY, outerAt));
  }
  return (
    <Svg viewBox={`0 0 ${vbW} 400`} {...rest}>
      <Figure silo={silo} d={d} cx={cx} tone={tone} />
      {items}
    </Svg>
  );
}

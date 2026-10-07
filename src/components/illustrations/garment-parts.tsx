import type { ReactNode } from "react";
import { C, pt, r1, type Pt } from "./shared";

/** Kıyafet çizimleri için ortak parçalar (200×200 tuval, merkez x=100). */

export const CX = 100;
export const SW = 1.6;

export function P({ d, fill = "none", w = SW, opacity }: { d: string; fill?: string; w?: number; opacity?: number }) {
  return <path d={d} fill={fill} stroke={C.ink} strokeWidth={w} opacity={opacity} />;
}
/** ince detay çizgisi (dikiş, pli, kat) */
export function D({ d, opacity = 0.55, w = 1 }: { d: string; opacity?: number; w?: number }) {
  return <path d={d} stroke={C.ink} strokeWidth={w} opacity={opacity} fill="none" />;
}
/** görünür dikiş (kot vb.) */
export function Stitch({ d, color = C.stitch, w = 1 }: { d: string; color?: string; w?: number }) {
  return <path d={d} stroke={color} strokeWidth={w} strokeDasharray="2.2 1.8" fill="none" />;
}
export function Button({ x, y, r = 2.6, fill = C.cream }: { x: number; y: number; r?: number; fill?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={fill} stroke={C.ink} strokeWidth={1} />
      <circle cx={x - r * 0.3} cy={y} r={0.45} fill={C.ink} />
      <circle cx={x + r * 0.3} cy={y} r={0.45} fill={C.ink} />
    </g>
  );
}

export const mx = (x: number) => 2 * CX - x;
/** Yol dizgesini dikey eksene göre aynalar (yalnız "x y" çiftli mutlak komutlar). */
export function mirrorD(d: string) {
  return d.replace(/(-?\d+(?:\.\d+)?)[ ,](-?\d+(?:\.\d+)?)/g, (_m, x, y) => `${r1(mx(Number(x)))} ${y}`);
}

export type TopSpec = {
  /** yaka yarı genişliği ve omuz üst y */
  nh: number;
  neckY: number;
  /** yaka derinliği (merkez y) */
  neckDepth: number;
  /** V yaka mı (düz çizgi) */
  vNeck?: boolean;
  sh: number;
  sy: number;
  ah: number;
  ay: number;
  /** bel (opsiyonel) */
  wh?: number;
  wy?: number;
  hh: number;
  hy: number;
  hemCurve?: number;
};

export function topBody(s: TopSpec) {
  const L = (p: Pt) => pt(p);
  const wy = s.wy ?? (s.ay + s.hy) / 2;
  const wh = s.wh ?? (s.ah + s.hh) / 2;
  const hc = s.hemCurve ?? 3;
  const left = `M${L([CX - s.nh, s.neckY])} L${L([CX - s.sh, s.sy])} Q${L([CX - s.sh - 1, (s.sy + s.ay) / 2])} ${L([CX - s.ah, s.ay])} Q${L([
    CX - wh - (s.ah - wh) * 0.1,
    wy - (wy - s.ay) * 0.3,
  ])} ${L([CX - wh, wy])} Q${L([CX - wh - (s.hh - wh) * 0.1, wy + (s.hy - wy) * 0.4])} ${L([CX - s.hh, s.hy])}`;
  const hem = ` Q${L([CX, s.hy + hc])} ${L([CX + s.hh, s.hy])}`;
  const right = ` Q${L([CX + wh + (s.hh - wh) * 0.1, wy + (s.hy - wy) * 0.4])} ${L([CX + wh, wy])} Q${L([
    CX + wh + (s.ah - wh) * 0.1,
    wy - (wy - s.ay) * 0.3,
  ])} ${L([CX + s.ah, s.ay])} Q${L([CX + s.sh + 1, (s.sy + s.ay) / 2])} ${L([CX + s.sh, s.sy])} L${L([CX + s.nh, s.neckY])}`;
  const neck = s.vNeck ? ` L${L([CX, s.neckDepth])} Z` : ` Q${L([CX, s.neckDepth + (s.neckDepth - s.neckY) * 0.35])} ${L([CX - s.nh, s.neckY])} Z`;
  return left + hem + right + neck;
}

export type SleeveSpec = {
  /** dikey eksenden dışa açı (derece) */
  angle: number;
  len: number;
  endHalf: number;
  /** omuz ve koltuk altı noktaları (sağ taraf) */
  sx: number;
  sy: number;
  ax: number;
  ay: number;
  /** dış kenar şişkinliği */
  bulge?: number;
};

/** Sağ kol (aynası sol kol). Dönüş: path ve manşet uç noktaları. */
export function sleeve(s: SleeveSpec) {
  const a = (s.angle * Math.PI) / 180;
  const d: Pt = [Math.sin(a), Math.cos(a)];
  const p: Pt = [Math.cos(a), -Math.sin(a)];
  const mid: Pt = [(s.sx + s.ax) / 2, (s.sy + s.ay) / 2];
  const c: Pt = [mid[0] + d[0] * s.len, mid[1] + d[1] * s.len];
  const o: Pt = [c[0] + p[0] * s.endHalf, c[1] + p[1] * s.endHalf];
  const i: Pt = [c[0] - p[0] * s.endHalf, c[1] - p[1] * s.endHalf];
  const b = s.bulge ?? 2;
  const oc: Pt = [(s.sx + o[0]) / 2 + p[0] * b, (s.sy + o[1]) / 2 + p[1] * b];
  const ic: Pt = [(s.ax + i[0]) / 2 - p[0] * b * 0.3, (s.ay + i[1]) / 2 - p[1] * b * 0.3];
  const dPath = `M${pt([s.sx, s.sy])} Q${pt(oc)} ${pt(o)} L${pt(i)} Q${pt(ic)} ${pt([s.ax, s.ay])} Z`;
  return { d: dPath, o, i, c, dir: d, perp: p };
}

/** iki yansıyan kol + gövde */
export function Top({
  spec,
  sl,
  fill,
  children,
  sleeveFill,
  behind,
}: {
  spec: TopSpec;
  sl?: Omit<SleeveSpec, "sx" | "sy" | "ax" | "ay">;
  fill: string;
  sleeveFill?: string;
  children?: ReactNode;
  behind?: ReactNode;
}) {
  const s = sl ? sleeve({ ...sl, sx: CX + spec.sh, sy: spec.sy, ax: CX + spec.ah, ay: spec.ay }) : null;
  return (
    <g>
      {behind}
      {s ? (
        <>
          <P d={s.d} fill={sleeveFill ?? fill} />
          <P d={mirrorD(s.d)} fill={sleeveFill ?? fill} />
        </>
      ) : null}
      <P d={topBody(spec)} fill={fill} />
      {children}
    </g>
  );
}

/** manşet / ribana bandı: kol ucundan içeri doğru şerit */
export function cuffBand(s: ReturnType<typeof sleeve>, depth: number) {
  const back = (q: Pt): Pt => [q[0] - s.dir[0] * depth, q[1] - s.dir[1] * depth];
  return `M${pt(s.o)} L${pt(s.i)} L${pt(back(s.i))} L${pt(back(s.o))} Z`;
}

/** ribana çizgileri (kısa dikey çizgiler) bir bant içinde */
export function ribLines(x0: number, x1: number, y0: number, y1: number, step = 3.2, curve = 0) {
  let d = "";
  for (let x = x0 + step / 2; x < x1; x += step) {
    const t = (x - x0) / (x1 - x0);
    const dy = curve * 4 * t * (1 - t);
    d += `M${r1(x)} ${r1(y0 + dy)} V${r1(y1 + dy)} `;
  }
  return d;
}

export type PantsSpec = {
  wy: number;
  wh: number;
  hipY: number;
  hipH: number;
  crotchY: number;
  hemY: number;
  /** paçada dış ve iç kenar (merkezden) */
  hemOut: number;
  hemIn: number;
  /** diz hizası dış genişlik (opsiyonel; dar kesimler için) */
  kneeY?: number;
  kneeOut?: number;
  kneeIn?: number;
};

export function pants(s: PantsSpec) {
  const L = (x: number, y: number) => pt([x, y]);
  const kY = s.kneeY ?? (s.crotchY + s.hemY) / 2;
  const kO = s.kneeOut ?? (s.hipH + s.hemOut) / 2;
  const kI = s.kneeIn ?? s.hemIn;
  return (
    `M${L(CX - s.wh, s.wy)} L${L(CX + s.wh, s.wy)} ` +
    `Q${L(CX + s.hipH + 0.5, (s.wy + s.hipY) / 2)} ${L(CX + s.hipH, s.hipY)} ` +
    `Q${L(CX + s.hipH + 0.5, kY - 30)} ${L(CX + kO, kY)} L${L(CX + s.hemOut, s.hemY)} ` +
    `L${L(CX + s.hemIn, s.hemY)} L${L(CX + kI, kY)} Q${L(CX + 1.5, s.crotchY + 14)} ${L(CX, s.crotchY)} ` +
    `Q${L(CX - 1.5, s.crotchY + 14)} ${L(CX - kI, kY)} L${L(CX - s.hemIn, s.hemY)} L${L(CX - s.hemOut, s.hemY)} ` +
    `L${L(CX - kO, kY)} Q${L(CX - s.hipH - 0.5, kY - 30)} ${L(CX - s.hipH, s.hipY)} Q${L(CX - s.hipH - 0.5, (s.wy + s.hipY) / 2)} ${L(
      CX - s.wh,
      s.wy
    )} Z`
  );
}

/** kemer köprüleri */
export function BeltLoops({ xs, y0, y1, fill }: { xs: number[]; y0: number; y1: number; fill: string }) {
  return (
    <g>
      {xs.map((x) => (
        <rect key={x} x={x - 1.6} y={y0 - 1} width={3.2} height={y1 - y0 + 3} rx={0.8} fill={fill} stroke={C.ink} strokeWidth={0.9} />
      ))}
    </g>
  );
}

/** pantolonun yaka-bel bandı yüksekliğinde x aralığı */
export function waistbandY(s: PantsSpec, h: number) {
  return { y0: s.wy, y1: s.wy + h };
}

export function widthAt(s: PantsSpec, y: number) {
  // bel bandı çevresinde yaklaşık dış yarı genişlik
  const t = Math.min(1, Math.max(0, (y - s.wy) / (s.hipY - s.wy)));
  return s.wh + (s.hipH - s.wh) * (t * (2 - t));
}

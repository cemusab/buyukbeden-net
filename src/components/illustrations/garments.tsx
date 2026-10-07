import type { ReactNode } from "react";
import { C, Fallback, Svg, pt, r1, type BaseProps, type Silo } from "./shared";
import {
  BeltLoops,
  Button,
  CX,
  D,
  P,
  Stitch,
  Top,
  cuffBand,
  mirrorD,
  mx,
  pants,
  ribLines,
  sleeve,

  widthAt,
  type PantsSpec,
  type TopSpec,
} from "./garment-parts";

/**
 * Kategori kartları için düz, editoryal kıyafet çizimleri (200×200).
 * Her kategori ayırt edici detayıyla çizilir: kot = turuncu dikiş + perçin + J dikişi,
 * triko = ribana + örgü dokusu, sweatshirt = kapüşon + kanguru cep, hırka = açık ön + düğme…
 */

export const GARMENT_KEYS = {
  kadin: [
    "elbise",
    "pantolon",
    "jean",
    "tayt",
    "etek",
    "tisort",
    "gomlek",
    "bluz",
    "triko",
    "hirka",
    "sweatshirt",
    "ceket",
    "mont",
    "kaban",
    "abiye",
    "ic-giyim",
    "ev-giyimi",
  ],
  erkek: ["tisort", "polo", "gomlek", "pantolon", "jean", "esofman", "sweatshirt", "triko", "hirka", "mont", "takim-elbise"],
} as const;

export type KadinGarment = (typeof GARMENT_KEYS.kadin)[number];
export type ErkekGarment = (typeof GARMENT_KEYS.erkek)[number];

/* ------------------------------------------------------------------ */
/* Ortak üst kalıpları                                                  */
/* ------------------------------------------------------------------ */

const TEE_W: TopSpec = { nh: 15, neckY: 26, neckDepth: 40, sh: 42, sy: 32, ah: 41, ay: 70, wh: 38, wy: 118, hh: 44, hy: 172, hemCurve: 4 };
const TEE_M: TopSpec = { nh: 15, neckY: 24, neckDepth: 36, sh: 48, sy: 31, ah: 47, ay: 72, wh: 47, wy: 120, hh: 48, hy: 174, hemCurve: 1 };

function knitTexture(x0: number, x1: number, y0: number, y1: number, dx = 6, dy = 6, opacity = 0.35) {
  let d = "";
  for (let y = y0; y <= y1; y += dy) {
    for (let x = x0; x <= x1; x += dx) {
      d += `M${r1(x - 1.8)} ${r1(y - 1.6)} L${r1(x)} ${r1(y + 1.6)} L${r1(x + 1.8)} ${r1(y - 1.6)} `;
    }
  }
  return <D d={d} opacity={opacity} w={0.8} />;
}

function cable(x: number, y0: number, y1: number) {
  let d = "";
  const h = 12;
  for (let y = y0; y + h <= y1; y += h) {
    d += `M${x - 4} ${y} C${x - 4} ${y + h * 0.45} ${x + 4} ${y + h * 0.55} ${x + 4} ${y + h} `;
    d += `M${x + 4} ${y} C${x + 4} ${y + h * 0.3} ${x + 1.5} ${y + h * 0.4} ${x + 0.8} ${y + h * 0.45} M${x - 0.8} ${y + h * 0.55} C${x - 1.5} ${
      y + h * 0.6
    } ${x - 4} ${y + h * 0.7} ${x - 4} ${y + h} `;
  }
  return (
    <g>
      <D d={`M${x - 7} ${y0} V${y1} M${x + 7} ${y0} V${y1}`} opacity={0.45} w={0.8} />
      <D d={d} opacity={0.6} w={1} />
    </g>
  );
}

function Hood({ fill, w = 30, y = 26, h = 26 }: { fill: string; w?: number; y?: number; h?: number }) {
  // kapüşon: boynun arkasında yatık
  const d = `M${CX - w} ${y + 4} C${CX - w - 4} ${y - h * 0.6} ${CX - w * 0.4} ${y - h} ${CX} ${y - h} C${CX + w * 0.4} ${y - h} ${CX + w + 4} ${
    y - h * 0.6
  } ${CX + w} ${y + 4} Z`;
  return <P d={d} fill={fill} />;
}

/* ------------------------------------------------------------------ */
/* KADIN                                                               */
/* ------------------------------------------------------------------ */

function KElbise() {
  const f = C.cloth4;
  const body = `M88 24 L66 30 Q64 46 66 64 Q70 80 72 94 L40 180 Q100 192 160 180 L128 94 Q130 80 134 64 Q136 46 134 30 L112 24 L100 62 Z`;
  const flutterR = `M134 30 Q150 36 156 56 Q150 60 146 57 Q141 62 135 62 Q134 48 134 30 Z`;
  return (
    <g>
      <P d={flutterR} fill={f} />
      <P d={mirrorD(flutterR)} fill={f} />
      <P d={body} fill={f} />
      {/* kruvaze bindirme ve kemer */}
      <D d="M112 24 L84 92" opacity={0.6} />
      <P d="M71 88 L129 88 L130 97 L70 97 Z" fill={C.cloth4} w={1.3} />
      <P d="M76 96 Q72 112 66 124 L72 126 Q78 112 81 97 Z" fill={C.cloth4} w={1.2} />
      <P d="M82 97 Q82 114 80 128 L86 128 Q87 112 87 97 Z" fill={C.cloth4} w={1.2} />
      <circle cx={80} cy={92.5} r={3.4} fill={C.cloth4} stroke={C.ink} strokeWidth={1.2} />
      <D d="M84 97 Q74 140 62 184 M100 98 L100 188 M116 97 Q126 140 138 184 M126 98 Q142 140 150 182" opacity={0.35} />
    </g>
  );
}

function KPantolon() {
  const f = C.cloth2;
  const s: PantsSpec = { wy: 20, wh: 36, hipY: 58, hipH: 44, crotchY: 84, hemY: 188, hemOut: 56, hemIn: 7, kneeY: 136, kneeOut: 50, kneeIn: 5 };
  return (
    <g>
      <P d={pants(s)} fill={f} />
      <D d={`M${CX - 36} 31 H${CX + 36}`} opacity={0.7} w={1.1} />
      <BeltLoops xs={[72, 128]} y0={20} y1={31} fill={f} />
      <Button x={104} y={25.5} r={2.4} />
      <D d="M100 31 V64 Q100 70 106 70 M106 31 V66" opacity={0.6} />
      {/* yan cepler (eğik) */}
      <D d="M70 31 L60 54 M130 31 L140 54" opacity={0.6} />
      {/* ütü izi */}
      <D d="M78 60 L76 188 M122 60 L124 188" opacity={0.4} />
      {/* pens */}
      <D d="M84 31 L85 46 M116 31 L115 46" opacity={0.45} />
    </g>
  );
}

function Jeans({ s, fill, rise = 11, cuff = true }: { s: PantsSpec; fill: string; rise?: number; cuff?: boolean }) {
  const yb = s.wy + rise;
  const w = widthAt(s, yb);
  const legR = `M${CX + s.hemOut - 1.5} ${s.hemY - 2} L${CX + s.hemIn + 1.5} ${s.hemY - 2}`;
  return (
    <g>
      <P d={pants(s)} fill={fill} />
      <D d={`M${r1(CX - w)} ${yb} H${r1(CX + w)}`} opacity={0.75} w={1.1} />
      <Stitch d={`M${r1(CX - s.wh + 1.5)} ${s.wy + 2.5} H${r1(CX + s.wh - 1.5)} M${r1(CX - w + 1.5)} ${yb - 2.5} H${r1(CX + w - 1.5)}`} />
      <BeltLoops xs={[CX - s.wh + 9, CX - 14, CX + 14, CX + s.wh - 9]} y0={s.wy} y1={yb} fill={fill} />
      {/* ön cepler */}
      <D d={`M${CX - w + 4} ${yb} Q${CX - w + 18} ${yb + 2} ${CX - w + 20} ${yb + 18}`} opacity={0.8} w={1.1} />
      <Stitch d={`M${CX - w + 7} ${yb + 1} Q${CX - w + 16} ${yb + 3} ${CX - w + 17} ${yb + 15}`} />
      <D d={`M${CX + w - 4} ${yb} Q${CX + w - 18} ${yb + 2} ${CX + w - 20} ${yb + 18}`} opacity={0.8} w={1.1} />
      <Stitch d={`M${CX + w - 7} ${yb + 1} Q${CX + w - 16} ${yb + 3} ${CX + w - 17} ${yb + 15}`} />
      {/* bozuk para cebi */}
      <Stitch d={`M${CX + w - 10} ${yb + 2} V${yb + 10} H${CX + w - 19}`} />
      {/* perçinler */}
      <circle cx={CX - w + 5} cy={yb + 2} r={1.3} fill={C.stitch} />
      <circle cx={CX + w - 5} cy={yb + 2} r={1.3} fill={C.stitch} />
      <circle cx={CX + 2} cy={s.wy + rise / 2} r={2.3} fill={C.grey} stroke={C.ink} strokeWidth={0.9} />
      {/* J dikişi (fermuar kapağı) */}
      <Stitch d={`M${CX + 7} ${yb} V${yb + 26} Q${CX + 7} ${yb + 32} ${CX} ${yb + 34}`} />
      <D d={`M${CX} ${yb} V${yb + 34}`} opacity={0.6} />
      {/* yan dikişler */}
      <Stitch d={`M${CX + s.hipH - 2} ${s.hipY + 4} L${CX + s.hemOut - 2.5} ${s.hemY - 4} M${mx(CX + s.hipH - 2)} ${s.hipY + 4} L${mx(
        CX + s.hemOut - 2.5
      )} ${s.hemY - 4}`} />
      {cuff ? <Stitch d={`${legR} ${mirrorD(legR)}`} /> : null}
      {/* hafif yıpranma */}
      <D d={`M${CX - 24} ${s.hipY + 36} q4 -1 8 0 M${CX + 18} ${s.hipY + 40} q4 -1 8 0`} opacity={0.3} />
    </g>
  );
}

function KJean() {
  return <Jeans fill={C.denim} s={{ wy: 20, wh: 37, hipY: 58, hipH: 45, crotchY: 84, hemY: 188, hemOut: 42, hemIn: 7, kneeY: 136, kneeOut: 41, kneeIn: 5 }} />;
}

function KTayt() {
  const s: PantsSpec = { wy: 18, wh: 34, hipY: 62, hipH: 42, crotchY: 82, hemY: 188, hemOut: 20, hemIn: 6, kneeY: 140, kneeOut: 27, kneeIn: 4 };
  return (
    <g>
      <P d={pants(s)} fill={C.cloth1} />
      {/* yüksek bel bandı */}
      <D d={`M${CX - 38} 38 Q${CX} 41 ${CX + 38} 38`} opacity={0.8} w={1.1} />
      <path d={`M${CX - 30} 26 Q${CX} 28 ${CX + 30} 26`} stroke={C.white} strokeWidth={0.9} opacity={0.35} />
      {/* yumuşak parlaklık (esneklik) */}
      <path d="M68 70 Q66 110 76 150 Q80 170 82 184" stroke={C.white} strokeWidth={2} opacity={0.16} />
      <path d="M132 70 Q134 110 124 150 Q120 170 118 184" stroke={C.white} strokeWidth={2} opacity={0.16} />
      <D d={`M${CX} 40 V82`} opacity={0.5} />
    </g>
  );
}

function KEtek() {
  const f = C.cloth3;
  const d = `M70 28 L130 28 L132 40 Q150 100 164 176 Q100 188 36 176 Q50 100 68 40 Z`;
  return (
    <g>
      <P d={d} fill={f} />
      <D d="M68 40 H132" opacity={0.75} w={1.1} />
      <Button x={124} y={34} r={2.2} />
      <D d="M84 40 Q78 110 70 182 M100 40 V186 M116 40 Q122 110 130 182 M76 70 Q66 120 54 179 M124 70 Q134 120 146 179" opacity={0.35} />
    </g>
  );
}

function KTisort() {
  const f = C.cream;
  const sl = { angle: 58, len: 30, endHalf: 13, bulge: 1.5 };
  const s = sleeve({ ...sl, sx: CX + TEE_W.sh, sy: TEE_W.sy, ax: CX + TEE_W.ah, ay: TEE_W.ay });
  return (
    <Top spec={TEE_W} sl={sl} fill={f}>
      <D d={`M${CX - 19.5} 28 Q${CX} 52 ${CX + 19.5} 28`} opacity={0.6} />
      <D d={`M${pt([s.o[0] - s.dir[0] * 4, s.o[1] - s.dir[1] * 4])} L${pt([s.i[0] - s.dir[0] * 4, s.i[1] - s.dir[1] * 4])}`} opacity={0.5} />
      <D d={mirrorD(`M${pt([s.o[0] - s.dir[0] * 4, s.o[1] - s.dir[1] * 4])} L${pt([s.i[0] - s.dir[0] * 4, s.i[1] - s.dir[1] * 4])}`)} opacity={0.5} />
      <D d={`M${CX - 43} 167 Q${CX} 172 ${CX + 43} 167`} opacity={0.45} />
    </Top>
  );
}

function Collar({ y = 22, spread = 16, depth = 18, fill }: { y?: number; spread?: number; depth?: number; fill: string }) {
  const r = `M${CX + 1} ${y + depth} L${CX + spread + 6} ${y - 2} L${CX + spread + 1} ${y + depth * 0.95} Z`;
  return (
    <g>
      <P d={`M${CX - spread} ${y - 3} Q${CX} ${y - 8} ${CX + spread} ${y - 3} L${CX + spread + 6} ${y - 2} L${CX} ${y + depth - 3} L${CX - spread - 6} ${y - 2} Z`} fill={fill} w={1.3} />
      <P d={r} fill={fill} w={1.3} />
      <P d={mirrorD(r)} fill={fill} w={1.3} />
    </g>
  );
}

function Shirt({ spec, fill, pocket, curved = true }: { spec: TopSpec; fill: string; pocket?: boolean; curved?: boolean }) {
  const sl = { angle: 16, len: 112, endHalf: 10, bulge: 3 };
  const s = sleeve({ ...sl, sx: CX + spec.sh, sy: spec.sy, ax: CX + spec.ah, ay: spec.ay });
  const cuff = cuffBand(s, 12);
  const sp: TopSpec = { ...spec, hemCurve: curved ? -10 : 2 };
  return (
    <Top spec={sp} sl={sl} fill={fill}>
      <P d={cuff} fill={fill} w={1.3} />
      <P d={mirrorD(cuff)} fill={fill} w={1.3} />
      <D d={`M${CX - 4} ${spec.neckDepth} V${spec.hy - (curved ? 6 : -1)} M${CX + 4} ${spec.neckDepth} V${spec.hy - (curved ? 6 : -1)}`} opacity={0.5} />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={CX} cy={spec.neckDepth + 8 + i * ((spec.hy - spec.neckDepth - 24) / 4)} r={1.8} fill={C.white} stroke={C.ink} strokeWidth={0.9} />
      ))}
      {pocket ? <P d={`M${CX - 34} 62 H${CX - 16} V82 Q${CX - 25} 86 ${CX - 34} 82 Z`} fill={fill} w={1.1} /> : null}
      <Collar y={spec.neckY} spread={spec.nh} depth={spec.neckDepth - spec.neckY} fill={fill} />
      <circle cx={s.c[0] - s.dir[0] * 6} cy={s.c[1] - s.dir[1] * 6} r={1.3} fill={C.white} stroke={C.ink} strokeWidth={0.8} />
    </Top>
  );
}

function KGomlek() {
  return <Shirt spec={{ nh: 14, neckY: 22, neckDepth: 40, sh: 40, sy: 28, ah: 40, ay: 66, wh: 37, wy: 112, hh: 44, hy: 176 }} fill={C.white} />;
}

function KBluz() {
  const f = C.cloth4;
  const spec: TopSpec = { nh: 16, neckY: 26, neckDepth: 58, vNeck: true, sh: 40, sy: 32, ah: 39, ay: 68, wh: 36, wy: 120, hh: 50, hy: 160, hemCurve: 6 };
  const sl = { angle: 26, len: 70, endHalf: 20, bulge: 6 };
  const s = sleeve({ ...sl, sx: CX + spec.sh, sy: spec.sy, ax: CX + spec.ah, ay: spec.ay });
  const frill = `M${pt(s.o)} L${pt(s.i)}`;
  return (
    <Top spec={spec} sl={sl} fill={f}>
      <D d={`${frill} ${mirrorD(frill)}`} opacity={0.4} />
      {/* büzgü */}
      <D d={`M${pt([s.c[0] - s.dir[0] * 14, s.c[1] - s.dir[1] * 14])} l-3 4 M${pt([s.c[0] - s.dir[0] * 18, s.c[1] - s.dir[1] * 18])} l2 6`} opacity={0.4} />
      <D d="M64 120 H136" opacity={0.5} />
      <D d="M74 122 Q68 140 58 158 M100 122 V163 M126 122 Q132 140 142 158" opacity={0.35} />
      {/* yaka bağcığı */}
      <P d="M97 58 Q92 72 88 84 L92 85 Q96 72 100 60 Z" fill={f} w={1.1} />
      <P d="M103 58 Q108 72 113 82 L109 84 Q104 72 100 60 Z" fill={f} w={1.1} />
    </Top>
  );
}

function KTriko() {
  const f = C.cloth2;
  const spec: TopSpec = { nh: 15, neckY: 24, neckDepth: 36, sh: 44, sy: 31, ah: 42, ay: 70, wh: 41, wy: 120, hh: 44, hy: 172, hemCurve: 1 };
  const sl = { angle: 15, len: 108, endHalf: 10, bulge: 3 };
  const s = sleeve({ ...sl, sx: CX + spec.sh, sy: spec.sy, ax: CX + spec.ah, ay: spec.ay });
  const cuff = cuffBand(s, 13);
  const rib = (p: typeof s) => {
    let d = "";
    for (let k = 1; k < 6; k++) {
      const t = k / 6;
      const a = [p.o[0] + (p.i[0] - p.o[0]) * t, p.o[1] + (p.i[1] - p.o[1]) * t];
      d += `M${r1(a[0])} ${r1(a[1])} L${r1(a[0] - p.dir[0] * 12)} ${r1(a[1] - p.dir[1] * 12)} `;
    }
    return d;
  };
  return (
    <Top spec={spec} sl={sl} fill={f}>
      <P d={cuff} fill={f} w={1.3} />
      <P d={mirrorD(cuff)} fill={f} w={1.3} />
      <D d={rib(s)} opacity={0.5} w={0.8} />
      <D d={mirrorD(rib(s))} opacity={0.5} w={0.8} />
      {/* bel ribanası */}
      <P d={`M${CX - 44} 172 L${CX - 45} 158 Q${CX} 160 ${CX + 45} 158 L${CX + 44} 172 Q${CX} 173 ${CX - 44} 172 Z`} fill={f} w={1.3} />
      <D d={ribLines(CX - 44, CX + 44, 160, 171, 3.2, 0.8)} opacity={0.5} w={0.8} />
      {/* yaka ribanası */}
      <P d={`M${CX - 15} 24 Q${CX} 41 ${CX + 15} 24 L${CX + 21} 26 Q${CX} 50 ${CX - 21} 26 Z`} fill={f} w={1.3} />
      {/* örgü: saç örgüsü + ilmek dokusu */}
      {cable(CX - 18, 58, 154)}
      {cable(CX + 18, 58, 154)}
      {knitTexture(CX - 2, CX + 2, 58, 154, 6, 6, 0.35)}
      {knitTexture(CX - 38, CX - 32, 60, 150, 6, 6, 0.3)}
      {knitTexture(CX + 32, CX + 38, 60, 150, 6, 6, 0.3)}
    </Top>
  );
}

function KHirka() {
  const f = C.cloth3;
  const spec: TopSpec = { nh: 15, neckY: 24, neckDepth: 26, sh: 44, sy: 31, ah: 43, ay: 70, wh: 42, wy: 124, hh: 48, hy: 186, hemCurve: 0 };
  const sl = { angle: 13, len: 112, endHalf: 10.5, bulge: 3 };
  const s = sleeve({ ...sl, sx: CX + spec.sh, sy: spec.sy, ax: CX + spec.ah, ay: spec.ay });
  const cuff = cuffBand(s, 12);
  // içteki tişört görünür (açık ön)
  const inner = `M${CX - 15} 24 Q${CX} 38 ${CX + 15} 24 L${CX + 13} 186 L${CX - 13} 186 Z`;
  // sağ ve sol ön panel kenarı (yakadan aşağı iner, aralık bırakır)
  const rightEdge = `M${CX + 15} 24 Q${CX + 9} 70 ${CX + 9} 120 L${CX + 10} 186`;
  return (
    <g>
      <Top spec={spec} sl={sl} fill={f}>
        <P d={inner} fill={C.cream} w={1.3} />
        {/* ön patlar */}
        <P d={`${rightEdge} L${CX + 18} 186 L${CX + 17} 120 Q${CX + 17} 70 ${CX + 22} 26 Z`} fill={f} w={1.3} />
        <P d={mirrorD(`${rightEdge} L${CX + 18} 186 L${CX + 17} 120 Q${CX + 17} 70 ${CX + 22} 26 Z`)} fill={f} w={1.3} />
        {[0, 1, 2, 3, 4].map((i) => (
          <Button key={i} x={CX - 13.5} y={86 + i * 21} r={2.4} fill={C.cream} />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <D key={i} d={`M${CX + 11.5} ${86 + i * 21} h4`} opacity={0.7} />
        ))}
        {/* cepler */}
        <P d={`M${CX - 42} 132 H${CX - 22} V152 H${CX - 42} Z`} fill={f} w={1.2} />
        <P d={`M${CX + 22} 132 H${CX + 42} V152 H${CX + 22} Z`} fill={f} w={1.2} />
        <D d={ribLines(CX - 42, CX - 22, 132, 137, 2.6)} opacity={0.5} w={0.7} />
        <D d={ribLines(CX + 22, CX + 42, 132, 137, 2.6)} opacity={0.5} w={0.7} />
        {/* etek ribanası */}
        <D d={`M${CX - 48} 174 H${CX - 18} M${CX + 18} 174 H${CX + 48}`} opacity={0.6} />
        <D d={ribLines(CX - 48, CX - 18, 175, 185, 3) + ribLines(CX + 18, CX + 48, 175, 185, 3)} opacity={0.45} w={0.7} />
        <P d={cuff} fill={f} w={1.3} />
        <P d={mirrorD(cuff)} fill={f} w={1.3} />
      </Top>
    </g>
  );
}

function Hoodie({ spec, fill, boxy }: { spec: TopSpec; fill: string; boxy?: boolean }) {
  const sl = { angle: boxy ? 17 : 15, len: 108, endHalf: 11, bulge: 3 };
  const s = sleeve({ ...sl, sx: CX + spec.sh, sy: spec.sy, ax: CX + spec.ah, ay: spec.ay });
  const cuff = cuffBand(s, 11);
  const pocketW = boxy ? 30 : 27;
  return (
    <Top spec={spec} sl={sl} fill={fill} behind={<Hood fill={fill} w={spec.nh + 14} y={spec.neckY + 2} h={22} />}>
      {/* kapüşon açıklığı */}
      <P
        d={`M${CX - spec.nh - 8} ${spec.neckY + 2} Q${CX - spec.nh} ${spec.neckY - 14} ${CX} ${spec.neckY - 15} Q${CX + spec.nh} ${spec.neckY - 14} ${
          CX + spec.nh + 8
        } ${spec.neckY + 2} Q${CX + 6} ${spec.neckDepth + 6} ${CX} ${spec.neckDepth + 8} Q${CX - 6} ${spec.neckDepth + 6} ${CX - spec.nh - 8} ${spec.neckY + 2} Z`}
        fill={fill}
        w={1.4}
      />
      <path d={`M${CX - spec.nh + 2} ${spec.neckY + 1} Q${CX} ${spec.neckY - 9} ${CX + spec.nh - 2} ${spec.neckY + 1} Q${CX} ${spec.neckDepth + 2} ${CX - spec.nh + 2} ${spec.neckY + 1} Z`} fill={C.ink2} opacity={0.75} />
      {/* bağcıklar */}
      <D d={`M${CX - 6} ${spec.neckDepth + 5} V${spec.neckDepth + 30} M${CX + 6} ${spec.neckDepth + 5} V${spec.neckDepth + 26}`} opacity={0.9} w={1.3} />
      <rect x={CX - 7.2} y={spec.neckDepth + 29} width={2.4} height={4} rx={1} fill={C.cream} stroke={C.ink} strokeWidth={0.7} />
      <rect x={CX + 4.8} y={spec.neckDepth + 25} width={2.4} height={4} rx={1} fill={C.cream} stroke={C.ink} strokeWidth={0.7} />
      {/* kanguru cep */}
      <P d={`M${CX - pocketW} ${spec.hy - 14} L${CX - pocketW + 8} ${spec.hy - 44} H${CX + pocketW - 8} L${CX + pocketW} ${spec.hy - 14} Z`} fill={fill} w={1.3} />
      {/* ribanalar */}
      <D d={`M${CX - spec.hh} ${spec.hy - 11} Q${CX} ${spec.hy - 9} ${CX + spec.hh} ${spec.hy - 11}`} opacity={0.7} />
      <D d={ribLines(CX - spec.hh, CX + spec.hh, spec.hy - 10, spec.hy - 1, 3.4, 1)} opacity={0.4} w={0.7} />
      <P d={cuff} fill={fill} w={1.3} />
      <P d={mirrorD(cuff)} fill={fill} w={1.3} />
    </Top>
  );
}

function KSweatshirt() {
  return <Hoodie fill={C.cloth4} spec={{ nh: 15, neckY: 34, neckDepth: 46, sh: 43, sy: 40, ah: 42, ay: 76, wh: 41, wy: 124, hh: 44, hy: 178, hemCurve: 1 }} />;
}

function Blazer({ spec, fill, double, length, tie }: { spec: TopSpec; fill: string; double?: boolean; length?: number; tie?: boolean }) {
  const sl = { angle: 13, len: (length ?? 0) > 0 ? 114 : 110, endHalf: 10.5, bulge: 3 };
  const sp: TopSpec = { ...spec, neckDepth: spec.neckY + 4 };
  const lapelDepth = double ? 92 : 104;
  const open = double ? 18 : 3;
  // gömlek V'si
  const shirtV = `M${CX - spec.nh} ${spec.neckY} L${CX} ${lapelDepth} L${CX + spec.nh} ${spec.neckY} Q${CX} ${spec.neckY + 8} ${CX - spec.nh} ${spec.neckY} Z`;
  const lapelR = `M${CX + spec.nh} ${spec.neckY} L${CX + spec.nh + 9} ${spec.neckY + 2} L${CX + spec.nh + 4} ${spec.neckY + 22} L${CX + spec.nh + 16} ${
    spec.neckY + 30
  } L${CX + open + 2} ${lapelDepth} L${CX + 1} ${lapelDepth - 2} Z`;
  const pocket = (y: number) => `M${CX + 22} ${y} L${CX + 42} ${y} L${CX + 42.5} ${y + 6} L${CX + 21.5} ${y + 6} Z`;
  return (
    <Top spec={sp} sl={sl} fill={fill}>
      <P d={shirtV} fill={C.white} w={1.2} />
      {tie ? (
        <g>
          <P d={`M${CX - 4} ${spec.neckY + 6} H${CX + 4} L${CX + 2.6} ${spec.neckY + 13} H${CX - 2.6} Z`} fill={C.wine} w={1} />
          <P d={`M${CX - 2.6} ${spec.neckY + 13} H${CX + 2.6} L${CX + 6} ${lapelDepth - 8} L${CX} ${lapelDepth - 1} L${CX - 6} ${lapelDepth - 8} Z`} fill={C.wine} w={1} />
        </g>
      ) : null}
      <P d={lapelR} fill={fill} w={1.3} />
      <P d={mirrorD(lapelR)} fill={fill} w={1.3} />
      {/* ön kapanış */}
      <D d={`M${CX + open + 2} ${lapelDepth} L${CX + open + 2} ${spec.hy - 2}`} opacity={0.8} w={1.1} />
      {double ? (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <Button x={CX - 9} y={lapelDepth + 8 + i * 18} r={2.6} fill={C.ink2} />
              <Button x={CX + 11} y={lapelDepth + 8 + i * 18} r={2.6} fill={C.ink2} />
            </g>
          ))}
        </g>
      ) : (
        <g>
          <Button x={CX + 6} y={lapelDepth + 6} r={2.6} fill={C.ink2} />
          {!length ? <Button x={CX + 6} y={lapelDepth + 26} r={2.6} fill={C.ink2} /> : null}
        </g>
      )}
      <P d={pocket(spec.hy - (double ? 70 : 46))} fill={fill} w={1.1} />
      <P d={mirrorD(pocket(spec.hy - (double ? 70 : 46)))} fill={fill} w={1.1} />
      {!double ? <D d={`M${CX - 40} 66 H${CX - 24}`} opacity={0.7} w={1.1} /> : null}
      {tie ? <path d={`M${CX - 38} 66 l3 -5 l3 5 l3 -4 l3 4 Z`} fill={C.white} stroke={C.ink} strokeWidth={0.8} /> : null}
    </Top>
  );
}

function KCeket() {
  return <Blazer fill={C.cloth1} spec={{ nh: 14, neckY: 22, neckDepth: 30, sh: 43, sy: 29, ah: 42, ay: 68, wh: 38, wy: 116, hh: 46, hy: 172, hemCurve: 4 }} />;
}

function KKaban() {
  const f = C.camel;
  return (
    <g>
      <Blazer double length={1} fill={f} spec={{ nh: 15, neckY: 16, neckDepth: 24, sh: 45, sy: 23, ah: 44, ay: 62, wh: 42, wy: 108, hh: 52, hy: 192, hemCurve: 0 }} />
      {/* kemer */}
      <P d="M57 104 H143 L143.5 113 H56.5 Z" fill={f} w={1.2} />
      <rect x={114} y={102.5} width={11} height={12} rx={2} fill="none" stroke={C.ink} strokeWidth={1.2} />
      <P d="M120 113 L116 136 L121 137 L124 113 Z" fill={f} w={1} />
    </g>
  );
}

function Puffer({ spec, fill, hood }: { spec: TopSpec; fill: string; hood?: boolean }) {
  const sl = { angle: 15, len: 104, endHalf: 12, bulge: 5 };
  const s = sleeve({ ...sl, sx: CX + spec.sh, sy: spec.sy, ax: CX + spec.ah, ay: spec.ay });
  const cuff = cuffBand(s, 8);
  const rows: ReactNode[] = [];
  for (let y = spec.ay - 10; y < spec.hy - 6; y += 18) {
    rows.push(<D key={y} d={`M${CX - spec.hh + 0.5} ${y} Q${CX - spec.hh / 2} ${y + 4} ${CX} ${y} Q${CX + spec.hh / 2} ${y + 4} ${CX + spec.hh - 0.5} ${y}`} opacity={0.55} />);
  }
  const sleeveRows = (sv: typeof s) => {
    let d = "";
    const sx = CX + spec.sh;
    const ax = CX + spec.ah;
    for (let k = 1; k <= 4; k++) {
      const t = k / 5;
      const o = [sv.o[0] + (sx - sv.o[0]) * t, sv.o[1] + (spec.sy - sv.o[1]) * t];
      const i = [sv.i[0] + (ax - sv.i[0]) * t, sv.i[1] + (spec.ay - sv.i[1]) * t];
      d += `M${r1(i[0] + (o[0] - i[0]) * 0.04)} ${r1(i[1] + (o[1] - i[1]) * 0.04)} Q${r1((o[0] + i[0]) / 2 + sv.dir[0] * 3)} ${r1((o[1] + i[1]) / 2 + sv.dir[1] * 3)} ${r1(
        o[0] - (o[0] - i[0]) * 0.04
      )} ${r1(o[1] - (o[1] - i[1]) * 0.04)} `;
    }
    return d;
  };
  return (
    <Top spec={spec} sl={sl} fill={fill} behind={hood ? <Hood fill={fill} w={spec.nh + 16} y={spec.neckY + 4} h={26} /> : null}>
      <D d={sleeveRows(s)} opacity={0.5} />
      <D d={mirrorD(sleeveRows(s))} opacity={0.5} />
      {rows}
      {/* dik yaka */}
      {!hood ? <P d={`M${CX - spec.nh - 1} ${spec.neckY + 2} L${CX - spec.nh + 1} ${spec.neckY - 12} Q${CX} ${spec.neckY - 9} ${CX + spec.nh - 1} ${spec.neckY - 12} L${CX + spec.nh + 1} ${spec.neckY + 2} Q${CX} ${spec.neckY + 8} ${CX - spec.nh - 1} ${spec.neckY + 2} Z`} fill={fill} w={1.4} /> : null}
      {hood ? (
        <path d={`M${CX - spec.nh + 2} ${spec.neckY + 2} Q${CX} ${spec.neckY - 12} ${CX + spec.nh - 2} ${spec.neckY + 2} Q${CX} ${spec.neckY + 10} ${CX - spec.nh + 2} ${spec.neckY + 2} Z`} fill={C.ink2} opacity={0.75} />
      ) : null}
      {/* fermuar */}
      <path d={`M${CX} ${spec.neckY + (hood ? 7 : 4)} V${spec.hy + 1}`} stroke={C.ink} strokeWidth={1.4} />
      <path d={`M${CX} ${spec.neckY + 8} V${spec.hy}`} stroke={C.white} strokeWidth={0.8} strokeDasharray="1 1.4" opacity={0.6} />
      <rect x={CX - 2} y={spec.neckY + 8} width={4} height={8} rx={1.4} fill={C.grey} stroke={C.ink} strokeWidth={0.8} />
      <P d={cuff} fill={C.ink2} w={1.2} />
      <P d={mirrorD(cuff)} fill={C.ink2} w={1.2} />
    </Top>
  );
}

function KMont() {
  return <Puffer fill={C.cloth4} spec={{ nh: 15, neckY: 30, neckDepth: 36, sh: 46, sy: 37, ah: 46, ay: 74, wh: 46, wy: 124, hh: 47, hy: 172, hemCurve: 2 }} />;
}

function KAbiye() {
  const f = C.wine;
  const bodice = `M84 22 L74 26 Q70 40 72 58 Q74 76 76 88 L124 88 Q126 76 128 58 Q130 40 126 26 L116 22 Q108 40 100 54 Q92 40 84 22 Z`;
  const skirt = `M76 86 Q60 130 34 190 Q100 198 166 190 Q140 130 124 86 Z`;
  const capR = `M126 26 Q138 30 142 42 Q136 46 128 44 Z`;
  return (
    <g>
      <P d={skirt} fill={f} />
      <P d={capR} fill={f} w={1.3} />
      <P d={mirrorD(capR)} fill={f} w={1.3} />
      <P d={bodice} fill={f} />
      <P d="M75 84 Q100 90 125 84 L125 91 Q100 97 75 91 Z" fill={f} w={1.2} />
      {/* drapeler */}
      <D d="M86 94 Q76 140 58 192 M100 96 Q98 150 96 196 M112 94 Q124 140 140 192 M120 92 Q136 130 156 190" opacity={0.4} />
      <path d="M92 100 Q86 140 76 186" stroke={C.white} strokeWidth={2.2} opacity={0.12} />
      <D d="M80 36 Q86 56 92 82 M120 36 Q114 56 108 82" opacity={0.35} />
    </g>
  );
}

function KIcGiyim() {
  const f = C.cloth2;
  const cupR = `M102 104 Q104 74 126 60 Q146 56 154 74 Q156 98 150 112 Q126 116 102 112 Z`;
  return (
    <g>
      {/* askılar */}
      <P d="M128 61 L134 22 L140 22 L148 64" fill={f} w={1.3} />
      <P d={mirrorD("M128 61 L134 22 L140 22 L148 64")} fill={f} w={1.3} />
      {/* bant */}
      <P d="M40 108 Q38 120 40 130 L160 130 Q162 120 160 108 Q130 116 100 116 Q70 116 40 108 Z" fill={f} />
      <D d="M42 124 H158" opacity={0.4} />
      <P d={cupR} fill={f} />
      <P d={mirrorD(cupR)} fill={f} />
      {/* dikiş ve dantel kenar */}
      <D d="M110 102 Q116 80 132 68 M90 102 Q84 80 68 68" opacity={0.45} />
      <D d="M105 101 Q126 104 149 100 M95 101 Q74 104 51 100" opacity={0.35} />
      {/* fiyonk */}
      <path d="M100 106 l-5 -3 v6 Z M100 106 l5 -3 v6 Z" fill={C.cloth4} stroke={C.ink} strokeWidth={0.9} />
      <circle cx={100} cy={106} r={1.4} fill={C.ink} />
      <rect x={154} y={110} width={6} height={18} fill={C.cream} stroke={C.ink} strokeWidth={0.9} />
      <D d="M156 113 h2 M156 118 h2 M156 123 h2" opacity={0.7} />
    </g>
  );
}

function KEvGiyimi() {
  const f = C.stone;
  const s: PantsSpec = { wy: 112, wh: 34, hipY: 130, hipH: 38, crotchY: 140, hemY: 192, hemOut: 42, hemIn: 6 };
  const spec: TopSpec = { nh: 14, neckY: 14, neckDepth: 40, vNeck: true, sh: 42, sy: 20, ah: 41, ay: 56, wh: 40, wy: 96, hh: 43, hy: 130, hemCurve: 1 };
  const sl = { angle: 16, len: 70, endHalf: 11, bulge: 2 };
  const dots: ReactNode[] = [];
  for (let y = 50; y < 128; y += 14)
    for (let x = 66; x <= 134; x += 14) {
      const xx = x + (((y - 50) / 14) % 2 ? 7 : 0);
      if (Math.abs(xx - 100) < 6) continue;
      dots.push(<circle key={`${x}-${y}`} cx={xx} cy={y} r={1.8} fill={C.white} opacity={0.75} />);
    }
  const lapelR = `M${CX + 14} 14 L${CX + 22} 18 L${CX + 18} 30 L${CX + 26} 34 L${CX} 40 Z`;
  return (
    <g>
      <P d={pants(s)} fill={f} />
      <path d="M60 186 H95 M105 186 H140" stroke={C.cloth1} strokeWidth={2.2} />
      <Top spec={spec} sl={sl} fill={f}>
        {dots}
        <P d={lapelR} fill={f} w={1.2} />
        <P d={mirrorD(lapelR)} fill={f} w={1.2} />
        {/* biyeler */}
        <path d={`M${CX + 22} 18 L${CX + 18} 30 L${CX + 26} 34 L${CX} 40 L${CX - 26} 34 L${CX - 18} 30 L${CX - 22} 18`} stroke={C.cloth1} strokeWidth={1.8} fill="none" />
        <path d={`M${CX + 3} 40 V128`} stroke={C.cloth1} strokeWidth={1.6} />
        {[0, 1, 2, 3].map((i) => (
          <Button key={i} x={CX + 7} y={52 + i * 20} r={2.2} fill={C.white} />
        ))}
        <P d={`M${CX - 36} 50 H${CX - 18} V66 H${CX - 36} Z`} fill={f} w={1.1} />
        <path d={`M${CX - 36} 50 H${CX - 18}`} stroke={C.cloth1} strokeWidth={1.8} />
      </Top>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* ERKEK                                                               */
/* ------------------------------------------------------------------ */

function ETisort() {
  const f = C.cloth1;
  const sl = { angle: 52, len: 34, endHalf: 15, bulge: 1 };
  const s = sleeve({ ...sl, sx: CX + TEE_M.sh, sy: TEE_M.sy, ax: CX + TEE_M.ah, ay: TEE_M.ay });
  const hemLine = `M${pt([s.o[0] - s.dir[0] * 4, s.o[1] - s.dir[1] * 4])} L${pt([s.i[0] - s.dir[0] * 4, s.i[1] - s.dir[1] * 4])}`;
  return (
    <Top spec={TEE_M} sl={sl} fill={f}>
      <P d={`M${CX - 15} 24 Q${CX} 41 ${CX + 15} 24 L${CX + 19} 26 Q${CX} 47 ${CX - 19} 26 Z`} fill={f} w={1.3} />
      <path d={`${hemLine} ${mirrorD(hemLine)} M${CX - 47} 169 H${CX + 47}`} stroke={C.white} strokeWidth={0.9} strokeDasharray="2 1.8" opacity={0.45} />
    </Top>
  );
}

function EPolo() {
  const f = C.cloth3;
  const sl = { angle: 50, len: 34, endHalf: 15, bulge: 1 };
  const s = sleeve({ ...sl, sx: CX + TEE_M.sh, sy: TEE_M.sy, ax: CX + TEE_M.ah, ay: TEE_M.ay });
  const cuff = cuffBand(s, 6);
  return (
    <Top spec={{ ...TEE_M, neckDepth: 30 }} sl={sl} fill={f}>
      <P d={cuff} fill={f} w={1.2} />
      <P d={mirrorD(cuff)} fill={f} w={1.2} />
      {/* düğme patı */}
      <P d={`M${CX - 5} 30 H${CX + 5} V68 H${CX - 5} Z`} fill={f} w={1.2} />
      {[40, 51, 62].map((y) => (
        <circle key={y} cx={CX} cy={y} r={1.8} fill={C.cream} stroke={C.ink} strokeWidth={0.8} />
      ))}
      <Collar y={24} spread={15} depth={10} fill={f} />
      {/* yan yırtmaç */}
      <D d={`M${CX - 48} 174 V164 M${CX + 48} 174 V164`} opacity={0.7} />
      <path d={`M${CX - 47} 171 H${CX + 47}`} stroke={C.white} strokeWidth={0.8} strokeDasharray="2 1.8" opacity={0.4} />
    </Top>
  );
}

function EGomlek() {
  return <Shirt pocket spec={{ nh: 14, neckY: 22, neckDepth: 38, sh: 47, sy: 29, ah: 46, ay: 70, wh: 46, wy: 120, hh: 47, hy: 178 }} fill={C.stone} />;
}

function EPantolon() {
  const f = C.cloth2;
  const s: PantsSpec = { wy: 18, wh: 40, hipY: 56, hipH: 46, crotchY: 86, hemY: 190, hemOut: 44, hemIn: 6, kneeY: 138, kneeOut: 45, kneeIn: 5 };
  return (
    <g>
      <P d={pants(s)} fill={f} />
      <D d={`M${CX - 40.5} 29 H${CX + 40.5}`} opacity={0.75} w={1.1} />
      <BeltLoops xs={[68, 86, 114, 132]} y0={18} y1={29} fill={f} />
      <Button x={CX + 3} y={23.5} r={2.3} />
      <D d="M100 29 V70 M106 29 V66 Q106 72 100 72" opacity={0.6} />
      <D d="M66 29 L56 52 M134 29 L144 52" opacity={0.65} />
      <D d="M76 58 L77 190 M124 58 L123 190" opacity={0.4} />
    </g>
  );
}

function EJean() {
  return (
    <Jeans
      fill={C.denimDark}
      s={{ wy: 18, wh: 40, hipY: 56, hipH: 46, crotchY: 86, hemY: 190, hemOut: 44, hemIn: 6, kneeY: 138, kneeOut: 45, kneeIn: 5 }}
    />
  );
}

function EEsofman() {
  const f = C.cloth1;
  const s: PantsSpec = { wy: 20, wh: 40, hipY: 56, hipH: 46, crotchY: 88, hemY: 176, hemOut: 32, hemIn: 7, kneeY: 134, kneeOut: 41, kneeIn: 5 };
  const stripeR = `M${CX + 46} 58 Q${CX + 44} 100 ${CX + 41} 134 L${CX + 32} 174`;
  return (
    <g>
      <P d={pants(s)} fill={f} />
      {/* lastikli bel */}
      <P d={`M${CX - 40} 20 H${CX + 40} L${CX + 41} 34 H${CX - 41} Z`} fill={f} w={1.3} />
      <D d={`M${CX - 38} 24 H${CX + 38} M${CX - 38} 27 H${CX + 38} M${CX - 38} 30 H${CX + 38}`} opacity={0.35} w={0.8} />
      {/* bağcık */}
      <path d={`M${CX - 3} 30 Q${CX - 8} 44 ${CX - 6} 54 M${CX + 3} 30 Q${CX + 8} 42 ${CX + 9} 50`} stroke={C.white} strokeWidth={1.4} />
      {/* yan şerit */}
      <path d={`${stripeR} ${mirrorD(stripeR)}`} stroke={C.white} strokeWidth={2} opacity={0.85} />
      <path d={`M${CX + 42} 60 Q${CX + 40} 100 ${CX + 37} 134 L${CX + 29} 172 ${mirrorD(`M${CX + 42} 60 Q${CX + 40} 100 ${CX + 37} 134 L${CX + 29} 172`)}`} stroke={C.white} strokeWidth={1} opacity={0.6} />
      {/* ribanalı paça */}
      <P d={`M${CX + 31} 176 L${CX + 8} 176 L${CX + 8} 190 L${CX + 30} 190 Z`} fill={f} w={1.3} />
      <P d={mirrorD(`M${CX + 31} 176 L${CX + 8} 176 L${CX + 8} 190 L${CX + 30} 190 Z`)} fill={f} w={1.3} />
      <D d={ribLines(CX + 8, CX + 30, 178, 188, 3) + ribLines(CX - 30, CX - 8, 178, 188, 3)} opacity={0.4} w={0.7} />
      <D d="M64 36 L56 56 M136 36 L144 56" opacity={0.5} />
    </g>
  );
}

function ESweatshirt() {
  return <Hoodie boxy fill={C.grey} spec={{ nh: 16, neckY: 34, neckDepth: 46, sh: 49, sy: 40, ah: 48, ay: 78, wh: 48, wy: 124, hh: 48, hy: 180, hemCurve: 1 }} />;
}

function ETriko() {
  const f = C.denimDark;
  const spec: TopSpec = { nh: 15, neckY: 24, neckDepth: 36, sh: 48, sy: 31, ah: 47, ay: 72, wh: 46, wy: 120, hh: 46, hy: 174, hemCurve: 1 };
  const sl = { angle: 14, len: 110, endHalf: 11, bulge: 3 };
  const s = sleeve({ ...sl, sx: CX + spec.sh, sy: spec.sy, ax: CX + spec.ah, ay: spec.ay });
  const cuff = cuffBand(s, 13);
  const knit = (x0: number, x1: number, y0: number, y1: number) => {
    let d = "";
    for (let y = y0; y <= y1; y += 5) for (let x = x0; x <= x1; x += 5) d += `M${x - 1.5} ${y - 1.3} L${x} ${y + 1.3} L${x + 1.5} ${y - 1.3} `;
    return <path d={d} stroke={C.white} strokeWidth={0.7} opacity={0.32} fill="none" />;
  };
  return (
    <Top spec={spec} sl={sl} fill={f}>
      {knit(CX - 40, CX + 40, 50, 156)}
      <P d={cuff} fill={f} w={1.3} />
      <P d={mirrorD(cuff)} fill={f} w={1.3} />
      <P d={`M${CX - 46} 174 L${CX - 46.5} 160 Q${CX} 162 ${CX + 46.5} 160 L${CX + 46} 174 Q${CX} 175 ${CX - 46} 174 Z`} fill={f} w={1.3} />
      <path d={ribLines(CX - 46, CX + 46, 162, 173, 3.2, 0.8)} stroke={C.white} strokeWidth={0.7} opacity={0.4} />
      <P d={`M${CX - 15} 24 Q${CX} 41 ${CX + 15} 24 L${CX + 21} 26 Q${CX} 50 ${CX - 21} 26 Z`} fill={f} w={1.3} />
      <path d={`M${CX - 17} 27 Q${CX} 44 ${CX + 17} 27`} stroke={C.white} strokeWidth={0.7} opacity={0.35} fill="none" />
    </Top>
  );
}

function EHirka() {
  const f = C.camel;
  const spec: TopSpec = { nh: 15, neckY: 24, neckDepth: 26, sh: 48, sy: 31, ah: 47, ay: 72, wh: 46, wy: 120, hh: 46, hy: 176, hemCurve: 0 };
  const sl = { angle: 14, len: 110, endHalf: 11, bulge: 3 };
  const s = sleeve({ ...sl, sx: CX + spec.sh, sy: spec.sy, ax: CX + spec.ah, ay: spec.ay });
  const cuff = cuffBand(s, 12);
  return (
    <Top spec={spec} sl={sl} fill={f}>
      {/* V yaka içinden gömlek */}
      <P d={`M${CX - 15} 24 L${CX} 84 L${CX + 15} 24 Q${CX} 30 ${CX - 15} 24 Z`} fill={C.white} w={1.2} />
      <P d={`M${CX - 15} 24 L${CX - 4} 40 L${CX} 30 L${CX + 4} 40 L${CX + 15} 24 Q${CX} 28 ${CX - 15} 24 Z`} fill={C.white} w={1} />
      {/* ön pat */}
      <P d={`M${CX - 15} 24 L${CX - 1} 84 L${CX - 1} 176 L${CX - 7} 176 L${CX - 7} 88 L${CX - 21} 26 Z`} fill={f} w={1.2} />
      <P d={`M${CX + 15} 24 L${CX + 1} 84 L${CX + 1} 176 L${CX + 7} 176 L${CX + 7} 88 L${CX + 21} 26 Z`} fill={f} w={1.2} />
      {[96, 113, 130, 147].map((y) => (
        <Button key={y} x={CX - 4} y={y} r={2.4} fill={C.ink2} />
      ))}
      <P d={`M${CX - 40} 128 H${CX - 18} V150 H${CX - 40} Z`} fill={f} w={1.1} />
      <P d={`M${CX + 18} 128 H${CX + 40} V150 H${CX + 18} Z`} fill={f} w={1.1} />
      <D d={`M${CX - 46} 164 H${CX - 7} M${CX + 7} 164 H${CX + 46}`} opacity={0.6} />
      <D d={ribLines(CX - 46, CX - 7, 165, 175, 3) + ribLines(CX + 7, CX + 46, 165, 175, 3)} opacity={0.4} w={0.7} />
      <P d={cuff} fill={f} w={1.3} />
      <P d={mirrorD(cuff)} fill={f} w={1.3} />
    </Top>
  );
}

function EMont() {
  const f = C.cloth3;
  const spec: TopSpec = { nh: 16, neckY: 32, neckDepth: 38, sh: 50, sy: 39, ah: 50, ay: 78, wh: 49, wy: 126, hh: 50, hy: 182, hemCurve: 1 };
  return (
    <g>
      <Puffer hood fill={f} spec={spec} />
      {/* kapaklı cepler */}
      <P d={`M${CX + 16} 128 L${CX + 40} 128 L${CX + 40} 156 L${CX + 16} 156 Z`} fill={f} w={1.2} />
      <P d={`M${CX + 15} 124 L${CX + 41} 124 L${CX + 40} 134 L${CX + 16} 134 Z`} fill={f} w={1.2} />
      <P d={mirrorD(`M${CX + 16} 128 L${CX + 40} 128 L${CX + 40} 156 L${CX + 16} 156 Z`)} fill={f} w={1.2} />
      <P d={mirrorD(`M${CX + 15} 124 L${CX + 41} 124 L${CX + 40} 134 L${CX + 16} 134 Z`)} fill={f} w={1.2} />
    </g>
  );
}

function ETakimElbise() {
  const f = C.ink2;
  return <Blazer tie fill={f} spec={{ nh: 14, neckY: 20, neckDepth: 28, sh: 49, sy: 27, ah: 47, ay: 68, wh: 45, wy: 120, hh: 48, hy: 178, hemCurve: 2 }} />;
}

/* ------------------------------------------------------------------ */

const KADIN: Record<KadinGarment, () => ReactNode> = {
  elbise: KElbise,
  pantolon: KPantolon,
  jean: KJean,
  tayt: KTayt,
  etek: KEtek,
  tisort: KTisort,
  gomlek: KGomlek,
  bluz: KBluz,
  triko: KTriko,
  hirka: KHirka,
  sweatshirt: KSweatshirt,
  ceket: KCeket,
  mont: KMont,
  kaban: KKaban,
  abiye: KAbiye,
  "ic-giyim": KIcGiyim,
  "ev-giyimi": KEvGiyimi,
};

const ERKEK: Record<ErkekGarment, () => ReactNode> = {
  tisort: ETisort,
  polo: EPolo,
  gomlek: EGomlek,
  pantolon: EPantolon,
  jean: EJean,
  esofman: EEsofman,
  sweatshirt: ESweatshirt,
  triko: ETriko,
  hirka: EHirka,
  mont: EMont,
  "takim-elbise": ETakimElbise,
};

export type GarmentIllustrationProps = BaseProps & {
  silo: Silo;
  category: string;
  /** Yumuşak nötr zemin karosu çiz */
  tile?: boolean;
};

export function GarmentIllustration({ silo, category, tile = false, ...rest }: GarmentIllustrationProps) {
  const table = (silo === "kadin" ? KADIN : silo === "erkek" ? ERKEK : undefined) as Record<string, () => ReactNode> | undefined;
  const Draw = table && Object.prototype.hasOwnProperty.call(table, category) ? table[category] : undefined;
  if (!Draw) return <Fallback viewBox="0 0 200 200" {...rest} />;
  return (
    <Svg viewBox="0 0 200 200" {...rest}>
      {tile ? <rect width={200} height={200} rx={16} fill={C.bg} /> : null}
      <Draw />
    </Svg>
  );
}


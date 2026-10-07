import type { ReactNode } from "react";
import { C, Svg, r1, type BaseProps } from "./shared";

/** Kumaş dokusu motifleri (64×64, dekoratif). Doku; dokuma/örgü/dimi yapısını sade çizgilerle anlatır. */

export const FABRIC_SLUGS = [
  "viskon",
  "pamuk",
  "polyester",
  "akrilik",
  "modal",
  "elastan",
  "keten",
  "triko",
  "scuba",
  "sardonlu",
  "penye",
  "gabardin",
  "denim",
] as const;
export type FabricSlug = (typeof FABRIC_SLUGS)[number];

const BASE: Record<FabricSlug, string> = {
  viskon: "var(--illu-fab-viskon, #E8D8C8)",
  pamuk: "var(--illu-fab-pamuk, #F3EEE6)",
  polyester: "var(--illu-fab-polyester, #D6DCE0)",
  akrilik: "var(--illu-fab-akrilik, #E3D2BE)",
  modal: "var(--illu-fab-modal, #E6DED8)",
  elastan: "var(--illu-fab-elastan, #D4CEC6)",
  keten: "var(--illu-fab-keten, #DCCFB6)",
  triko: "var(--illu-fab-triko, #CDBBA1)",
  scuba: "var(--illu-fab-scuba, #B8BFC3)",
  sardonlu: "var(--illu-fab-sardonlu, #D6D1CA)",
  penye: "var(--illu-fab-penye, #E9E3D9)",
  gabardin: "var(--illu-fab-gabardin, #B7A68B)",
  denim: "var(--illu-fab-denim, #587390)",
};

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const ink = C.ink;

function lines(d: string, opacity = 0.35, w = 0.8, stroke: string = ink) {
  return <path d={d} stroke={stroke} strokeWidth={w} opacity={opacity} fill="none" strokeLinecap="round" />;
}

function texture(slug: FabricSlug): ReactNode {
  let d = "";
  switch (slug) {
    case "viskon":
    case "modal": {
      const step = slug === "viskon" ? 9 : 7;
      for (let y = -6; y < 70; y += step) d += `M-2 ${y} C16 ${y - 7} 30 ${y + 9} 66 ${y + 1} `;
      return (
        <>
          {lines(d, slug === "viskon" ? 0.28 : 0.22, 0.9)}
          <path d="M6 54 C24 30 34 40 58 10" stroke={C.white} strokeWidth={7} opacity={0.35} fill="none" strokeLinecap="round" />
        </>
      );
    }
    case "pamuk": {
      for (let y = 4; y < 64; y += 4) for (let x = (y / 4) % 2 ? 2 : 4; x < 64; x += 4) d += `M${x - 1} ${y} h2 `;
      let v = "";
      for (let x = 4; x < 64; x += 4) for (let y = (x / 4) % 2 ? 2 : 4; y < 64; y += 4) v += `M${x} ${y - 1} v2 `;
      return (
        <>
          {lines(d, 0.35, 0.9)}
          {lines(v, 0.22, 0.9)}
        </>
      );
    }
    case "polyester": {
      for (let y = 3; y < 64; y += 2.6) d += `M0 ${r1(y)} H64 `;
      return (
        <>
          {lines(d, 0.16, 0.6)}
          <path d="M-4 40 L40 -4 M10 60 L62 8" stroke={C.white} strokeWidth={6} opacity={0.4} strokeLinecap="round" />
        </>
      );
    }
    case "akrilik": {
      const r = rng(7);
      for (let i = 0; i < 150; i++) {
        const x = r() * 64;
        const y = r() * 64;
        const a = r() * Math.PI;
        const l = 1.5 + r() * 2.5;
        d += `M${r1(x)} ${r1(y)} l${r1(Math.cos(a) * l)} ${r1(Math.sin(a) * l)} `;
      }
      return lines(d, 0.32, 0.8);
    }
    case "elastan": {
      for (let y = 6; y < 64; y += 7) {
        d += `M0 ${y} `;
        for (let x = 0; x < 64; x += 4) d += `Q${x + 1} ${y - 3} ${x + 2} ${y} T${x + 4} ${y} `;
      }
      return (
        <>
          {lines(d, 0.32, 0.8)}
          <path d="M14 32 H50 M18 29 L14 32 L18 35 M46 29 L50 32 L46 35" stroke={C.ink2} strokeWidth={1.3} opacity={0.55} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    }
    case "keten": {
      const r = rng(11);
      let v = "";
      for (let y = 2; y < 64; y += 3) d += `M0 ${y} H64 `;
      for (let x = 2; x < 64; x += 3) v += `M${x} 0 V64 `;
      let slub = "";
      for (let i = 0; i < 14; i++) {
        const y = Math.round(r() * 20) * 3 + 2;
        const x = r() * 50;
        slub += `M${r1(x)} ${y} h${r1(6 + r() * 10)} `;
      }
      return (
        <>
          {lines(d, 0.16, 0.8)}
          {lines(v, 0.12, 0.8)}
          {lines(slub, 0.35, 1.6)}
        </>
      );
    }
    case "triko":
    case "penye": {
      const sx = slug === "triko" ? 7 : 4;
      const sy = slug === "triko" ? 6 : 3.6;
      for (let x = sx / 2; x < 64 + sx; x += sx)
        for (let y = 0; y < 66; y += sy) d += `M${r1(x - sx / 2 + 0.6)} ${r1(y)} L${r1(x)} ${r1(y + sy)} L${r1(x + sx / 2 - 0.6)} ${r1(y)} `;
      return lines(d, slug === "triko" ? 0.4 : 0.26, slug === "triko" ? 1 : 0.7);
    }
    case "scuba": {
      for (let y = 4; y < 64; y += 5) for (let x = (y / 5) % 2 ? 4 : 6.5; x < 64; x += 5) d += `M${r1(x)} ${y} h0.01 `;
      return (
        <>
          {lines(d, 0.3, 1.2)}
          <path d="M8 52 C20 40 40 44 56 14" stroke={C.white} strokeWidth={9} opacity={0.22} fill="none" strokeLinecap="round" />
          <path d="M0 58 H64" stroke={C.ink2} strokeWidth={1} opacity={0.3} />
        </>
      );
    }
    case "sardonlu": {
      for (let y = 4; y < 64; y += 5)
        for (let x = (y / 5) % 2 ? 2 : 4.5; x < 64; x += 5) d += `M${r1(x)} ${y} q1.25 2.6 2.5 0 `;
      const r = rng(3);
      let fuzz = "";
      for (let i = 0; i < 40; i++) fuzz += `M${r1(r() * 64)} ${r1(r() * 64)} l${r1(r() * 2 - 1)} ${r1(r() * 2 - 1)} `;
      return (
        <>
          {lines(d, 0.38, 0.9)}
          {lines(fuzz, 0.25, 0.8)}
        </>
      );
    }
    case "gabardin": {
      for (let k = -64; k < 64; k += 3) d += `M${k} 64 L${k + 52} 0 `;
      return lines(d, 0.28, 0.9);
    }
    case "denim": {
      for (let k = -64; k < 64; k += 3) d += `M${k} 64 L${k + 64} 0 `;
      let w = "";
      for (let k = -64; k < 64; k += 6) w += `M${k + 1.5} 64 L${k + 65.5} 0 `;
      return (
        <>
          {lines(d, 0.3, 1, C.denimDark)}
          {lines(w, 0.35, 0.7, C.white)}
          <path d="M0 50 H64" stroke={C.stitch} strokeWidth={1.2} strokeDasharray="2.4 1.8" opacity={0.9} />
        </>
      );
    }
  }
}

export type FabricSwatchProps = BaseProps & { slug: string; size?: number | string };

export function FabricSwatch({ slug, size, ...rest }: FabricSwatchProps) {
  const known = (FABRIC_SLUGS as readonly string[]).includes(slug) ? (slug as FabricSlug) : null;
  return (
    <Svg viewBox="0 0 64 64" width={size} height={size} {...rest}>
      <rect x={0.75} y={0.75} width={62.5} height={62.5} rx={6} fill={known ? BASE[known] : C.bg} />
      {known ? (
        <svg x={1.5} y={1.5} width={61} height={61} viewBox="0 0 64 64" overflow="hidden">
          {texture(known)}
        </svg>
      ) : (
        <path d="M18 40 Q32 28 46 40" stroke={C.ink2} strokeWidth={1.2} opacity={0.5} />
      )}
      <rect x={0.75} y={0.75} width={62.5} height={62.5} rx={6} fill="none" stroke={C.line} strokeWidth={1.5} />
    </Svg>
  );
}

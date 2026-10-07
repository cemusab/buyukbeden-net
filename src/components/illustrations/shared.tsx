import type { ReactNode, SVGProps } from "react";

/**
 * Ortak çizim yardımcıları ve palet.
 * Tüm renkler CSS değişkeni + varsayılan değerle verilir; sayfa temasından
 * `--illu-*` değişkenleri ezilerek yeniden renklendirilebilir.
 */

export type Silo = "kadin" | "erkek";
export type Tone = "1" | "2" | "3" | "4";

export const C = {
  ink: "var(--illu-ink, #1C1B1A)",
  ink2: "var(--illu-ink-2, #45413D)",
  line: "var(--illu-line, #E4DED5)",
  bg: "var(--illu-bg, #F1ECE4)",
  paper: "var(--illu-paper, #FBF9F6)",
  skin: "var(--illu-skin, #E8C4A8)",
  hair: "var(--illu-hair, #3A2A20)",
  /** koyu kumaş: tayt, pantolon */
  cloth1: "var(--illu-cloth-1, #2F3E46)",
  /** açık kumaş: üst giyim */
  cloth2: "var(--illu-cloth-2, #CDB9A0)",
  /** zeytin */
  cloth3: "var(--illu-cloth-3, #8A8D63)",
  /** kiremit-yumuşak */
  cloth4: "var(--illu-cloth-4, #C98B73)",
  /** krem */
  cream: "var(--illu-cream, #EFE7DB)",
  /** kamel */
  camel: "var(--illu-camel, #B98E5F)",
  /** taş mavisi */
  stone: "var(--illu-stone, #A9B7C2)",
  denim: "var(--illu-denim, #56708C)",
  denimDark: "var(--illu-denim-dark, #34495F)",
  wine: "var(--illu-wine, #7C2F3B)",
  grey: "var(--illu-grey, #A3A39E)",
  accent: "var(--illu-accent, #9E3F2A)",
  stitch: "var(--illu-stitch, #D49A4A)",
  guide: "var(--illu-guide, #9E3F2A)",
  white: "var(--illu-white, #FFFFFF)",
} as const;

/** Kapsayıcı ten seçenekleri (ten + saç). */
export const TONES: Record<Tone, { skin: string; shade: string; hair: string }> = {
  "1": { skin: "#F2D3BC", shade: "#E2B99C", hair: "#6A4A33" },
  "2": { skin: "#E0B08A", shade: "#CC9670", hair: "#3B2A1F" },
  "3": { skin: "#B47A52", shade: "#9C6642", hair: "#2A1D16" },
  "4": { skin: "#7A4D33", shade: "#663F29", hair: "#1B1411" },
};

export function toneColors(tone?: Tone) {
  if (tone && TONES[tone]) return { skin: TONES[tone].skin, shade: TONES[tone].shade, hair: TONES[tone].hair };
  return { skin: C.skin, shade: "var(--illu-skin-shade, #D5AC8E)", hair: C.hair };
}

export type BaseProps = {
  className?: string;
  /** Erişilebilir ad. Verilmezse görsel dekoratif sayılır (aria-hidden). */
  title?: string;
  "aria-hidden"?: boolean;
  style?: SVGProps<SVGSVGElement>["style"];
};

export function Svg({
  viewBox,
  className,
  title,
  children,
  style,
  "aria-hidden": ariaHidden,
  width,
  height,
}: BaseProps & { viewBox: string; children: ReactNode; width?: number | string; height?: number | string }) {
  const hidden = ariaHidden ?? !title;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={className}
      style={style}
      width={width}
      height={height}
      role={hidden ? undefined : "img"}
      aria-hidden={hidden ? true : undefined}
      aria-label={hidden ? undefined : title}
      focusable="false"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {!hidden && title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

/* ---------------- geometri ---------------- */

export type Pt = [number, number];

export const r1 = (n: number) => Math.round(n * 10) / 10;
export const pt = (p: Pt) => `${r1(p[0])} ${r1(p[1])}`;
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Catmull-Rom → kübik Bezier. `move` false ise yol "M" ile başlamaz (zincirleme için). */
export function smooth(points: Pt[], opts: { closed?: boolean; tension?: number; move?: boolean } = {}): string {
  const { closed = false, tension = 1, move = true } = opts;
  const p = points;
  const n = p.length;
  if (n < 2) return "";
  let d = move ? `M${pt(p[0])}` : `L${pt(p[0])}`;
  const get = (i: number): Pt => {
    if (closed) return p[(i + n) % n];
    return p[Math.max(0, Math.min(n - 1, i))];
  };
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);
    const k = tension / 6;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k];
    d += ` C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  }
  if (closed) d += " Z";
  return d;
}

/** y'ye göre x profili (Hermite, Catmull-Rom teğetleri). keys y'ye göre artan sırada. */
export function profileAt(keys: Pt[], y: number): number {
  // keys: [y, x]
  if (y <= keys[0][0]) return keys[0][1];
  const last = keys[keys.length - 1];
  if (y >= last[0]) return last[1];
  let i = 0;
  while (i < keys.length - 2 && y > keys[i + 1][0]) i++;
  const [y0, x0] = keys[i];
  const [y1, x1] = keys[i + 1];
  const prev = keys[Math.max(0, i - 1)];
  const next = keys[Math.min(keys.length - 1, i + 2)];
  const m0 = i === 0 ? (x1 - x0) / (y1 - y0) : (x1 - prev[1]) / (y1 - prev[0]);
  const m1 = i + 1 === keys.length - 1 ? (x1 - x0) / (y1 - y0) : (next[1] - x0) / (next[0] - y0);
  const h = y1 - y0;
  const t = (y - y0) / h;
  const t2 = t * t;
  const t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * x0 + (t3 - 2 * t2 + t) * h * m0 + (-2 * t3 + 3 * t2) * x1 + (t3 - t2) * h * m1;
}

/** Profilden [x, y] örnekleri (cx merkezine göre, side: 1 sağ, -1 sol). */
export function sampleProfile(keys: Pt[], y0: number, y1: number, cx: number, side: 1 | -1, offset = 0, step = 6): Pt[] {
  const out: Pt[] = [];
  const n = Math.max(2, Math.ceil(Math.abs(y1 - y0) / step));
  for (let i = 0; i <= n; i++) {
    const y = y0 + ((y1 - y0) * i) / n;
    out.push([cx + side * (profileAt(keys, y) + offset), y]);
  }
  return out;
}

export const mirror = (cx: number) => (p: Pt): Pt => [2 * cx - p[0], p[1]];

/** Çizgi stili kısayolları */
export const outline = { stroke: C.ink, strokeWidth: 1.6 } as const;
export const thin = { stroke: C.ink, strokeWidth: 1 } as const;

/** Bilinmeyen anahtar için nötr yedek görsel. */
export function Fallback({ viewBox = "0 0 200 200", ...rest }: BaseProps & { viewBox?: string }) {
  const [, , w, h] = viewBox.split(" ").map(Number);
  const s = Math.min(w, h);
  return (
    <Svg viewBox={viewBox} {...rest}>
      <rect x={w * 0.1} y={h * 0.1} width={w * 0.8} height={h * 0.8} rx={s * 0.12} fill={C.bg} />
      <circle cx={w * 0.5} cy={h * 0.45} r={s * 0.14} fill={C.cream} stroke={C.ink2} strokeWidth={Math.max(1, s / 120)} />
      <path
        d={`M${w * 0.3} ${h * 0.75} Q${w * 0.5} ${h * 0.6} ${w * 0.7} ${h * 0.75}`}
        stroke={C.ink2}
        strokeWidth={Math.max(1, s / 120)}
      />
    </Svg>
  );
}

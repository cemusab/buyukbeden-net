import type { ReactNode } from "react";
import { Svg, type BaseProps } from "./shared";

/**
 * Hızlı erişim ikonları: 24px ızgara, stroke = currentColor, 1.5px.
 * Rengi ve boyutu kapsayıcıdan (text renk ve genişlik/yükseklik sınıfları) alır.
 */

export const QUICK_ICON_NAMES = ["beden-rehberi", "stil", "kombin", "marka", "alisveris", "kumas", "trend", "rehber", "arama"] as const;
export type QuickIconName = (typeof QUICK_ICON_NAMES)[number];

const ICONS: Record<QuickIconName, ReactNode> = {
  "beden-rehberi": (
    <>
      <circle cx={9} cy={10.5} r={6.5} />
      <circle cx={9} cy={10.5} r={2} />
      <path d="M9 17 H21.25 V13.25 H14.6" />
      <path d="M16.6 17 V15.4 M19.1 17 V15.4" />
    </>
  ),
  stil: (
    <>
      <path d="M10.2 6.2 A1.9 1.9 0 1 1 12.1 8.1 V9.6" />
      <path d="M12.1 9.6 L3.4 15.5 Q2.6 16.9 4.2 17.2 H20 Q21.6 16.9 20.8 15.5 Z" />
      <path d="M19 2.4 Q19.35 4.15 21.1 4.5 Q19.35 4.85 19 6.6 Q18.65 4.85 16.9 4.5 Q18.65 4.15 19 2.4 Z" strokeWidth={1.2} />
    </>
  ),
  kombin: (
    <>
      <path d="M6.7 3 L3 4.9 L1.9 8.4 L4.3 9.2 V15 H12 V9.2 L14.4 8.4 L13.3 4.9 L9.6 3 Q8.15 4.6 6.7 3 Z" />
      <path d="M14.3 11.5 H21 L22 21 H19 L17.65 15.2 L16.3 21 H13.3 L14.3 11.5 Z" />
    </>
  ),
  marka: (
    <>
      <path d="M3 11.6 V4.5 A1.5 1.5 0 0 1 4.5 3 H11.6 L20.6 12 A1.5 1.5 0 0 1 20.6 14.1 L14.1 20.6 A1.5 1.5 0 0 1 12 20.6 Z" />
      <circle cx={7.6} cy={7.6} r={1.5} />
    </>
  ),
  alisveris: (
    <>
      <path d="M4.6 8 H19.4 L18.4 20.1 A1 1 0 0 1 17.4 21 H6.6 A1 1 0 0 1 5.6 20.1 Z" />
      <path d="M9 10.5 V6.6 A3 3 0 0 1 15 6.6 V10.5" />
    </>
  ),
  kumas: (
    <>
      <path d="M4 3.5 H20 V18 L18.4 19.6 L16.8 18 L15.2 19.6 L13.6 18 L12 19.6 L10.4 18 L8.8 19.6 L7.2 18 L5.6 19.6 L4 18 Z" />
      <path d="M7 14.5 L13.5 8 M10.5 14.5 L17 8 M7 10.5 L9.5 8" strokeWidth={1.2} />
    </>
  ),
  trend: (
    <>
      <path d="M3 17.5 L9 11.5 L13 15.5 L20.5 8" />
      <path d="M15 8 H20.5 V13.5" />
    </>
  ),
  rehber: (
    <>
      <path d="M12 6.6 C10 5.1 7 4.6 3 5 V19 C7 18.6 10 19.1 12 20.6 C14 19.1 17 18.6 21 19 V5 C17 4.6 14 5.1 12 6.6 Z" />
      <path d="M12 6.6 V20.6" />
    </>
  ),
  arama: (
    <>
      <circle cx={10.5} cy={10.5} r={6.5} />
      <path d="M15.4 15.4 L20.5 20.5" />
    </>
  ),
};

export type QuickIconProps = BaseProps & { name: string; size?: number | string; strokeWidth?: number };

export function QuickIcon({ name, size, strokeWidth = 1.5, ...rest }: QuickIconProps) {
  const body = (ICONS as Record<string, ReactNode>)[name] ?? (
    <>
      <rect x={4} y={4} width={16} height={16} rx={4} />
      <circle cx={12} cy={12} r={2.5} />
    </>
  );
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} {...rest}>
      <g stroke="currentColor" strokeWidth={strokeWidth} fill="none">
        {body}
      </g>
    </Svg>
  );
}

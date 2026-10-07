import type { ReactNode } from "react";
import { Svg, type BaseProps } from "./shared";

/**
 * Bakım (yıkama/kurutma/ütü) sembolleri – ISO 3758 tarzı, kendi çizimimiz.
 * 24px ızgara, stroke = currentColor, 1.5px.
 */

export const CARE_SYMBOL_NAMES = [
  "yikama-30",
  "yikama-40",
  "yikama-60",
  "elde-yikama",
  "yikanmaz",
  "agartma-yok",
  "tamburda-kurutma-dusuk",
  "tamburda-kurutma-yok",
  "duz-kurutma",
  "asarak-kurutma",
  "utu-1",
  "utu-2",
  "utu-3",
  "utulenmez",
  "kuru-temizleme-yok",
] as const;
export type CareSymbolName = (typeof CARE_SYMBOL_NAMES)[number];

export const CARE_SYMBOL_LABELS: Record<CareSymbolName, string> = {
  "yikama-30": "30 °C'de yıkama",
  "yikama-40": "40 °C'de yıkama",
  "yikama-60": "60 °C'de yıkama",
  "elde-yikama": "Elde yıkama",
  yikanmaz: "Yıkanmaz",
  "agartma-yok": "Ağartıcı kullanılmaz",
  "tamburda-kurutma-dusuk": "Tamburda düşük ısıda kurutma",
  "tamburda-kurutma-yok": "Tamburda kurutulmaz",
  "duz-kurutma": "Düz zeminde kurutma",
  "asarak-kurutma": "Asarak kurutma",
  "utu-1": "Düşük ısıda ütü (en çok 110 °C)",
  "utu-2": "Orta ısıda ütü (en çok 150 °C)",
  "utu-3": "Yüksek ısıda ütü (en çok 200 °C)",
  utulenmez: "Ütülenmez",
  "kuru-temizleme-yok": "Kuru temizleme yapılmaz",
};

const TUB = <path d="M2.6 8.2 L4.9 19.5 H19.1 L21.4 8.2" />;
const WAVE = <path d="M2.6 8.2 Q4.3 10 6 8.2 T9.4 8.2 T12.8 8.2 T16.2 8.2 T19.6 8.2 Q20.5 7.4 21.4 8.2" />;
const CROSS = <path d="M3.5 3.5 L20.5 20.5 M20.5 3.5 L3.5 20.5" />;
const SQUARE = <rect x={3} y={3} width={18} height={18} rx={0.6} />;
const IRON = (
  <>
    <path d="M2.8 18.5 L5.4 12 Q6.3 9.6 8.9 9.6 H16.6 Q20.1 9.6 20.6 13 L21.2 18.5 Z" />
    <path d="M8.2 9.6 Q8.2 6.6 10.6 6.6 H18.6" />
  </>
);
const dot = (x: number, y: number) => <circle key={`${x}-${y}`} cx={x} cy={y} r={1} fill="currentColor" stroke="none" />;

function temp(n: string) {
  return (
    <>
      {TUB}
      {WAVE}
      <text x={12} y={17.3} fontSize={6.6} fontWeight={700} textAnchor="middle" fill="currentColor" stroke="none" fontFamily="inherit">
        {n}
      </text>
    </>
  );
}

const SYMBOLS: Record<CareSymbolName, ReactNode> = {
  "yikama-30": temp("30"),
  "yikama-40": temp("40"),
  "yikama-60": temp("60"),
  "elde-yikama": (
    <>
      {TUB}
      {WAVE}
      <path d="M9.6 17.4 V12.2 Q9.6 11.3 10.45 11.3 Q11.3 11.3 11.3 12.2 V14 V11.4 Q11.3 10.5 12.15 10.5 Q13 10.5 13 11.4 V14 V12 Q13 11.1 13.85 11.1 Q14.7 11.1 14.7 12 V15.2 L15.6 14.2 Q16.3 13.5 16.9 14.1 Q17.3 14.6 16.8 15.3 L14.9 17.6" strokeWidth={1.2} />
    </>
  ),
  yikanmaz: (
    <>
      {TUB}
      {WAVE}
      {CROSS}
    </>
  ),
  "agartma-yok": (
    <>
      <path d="M12 3.2 L21.6 19.8 H2.4 Z" />
      <path d="M6.2 8 L17.8 20.2 M17.8 8 L6.2 20.2" />
    </>
  ),
  "tamburda-kurutma-dusuk": (
    <>
      {SQUARE}
      <circle cx={12} cy={12} r={6.4} />
      {dot(12, 12)}
    </>
  ),
  "tamburda-kurutma-yok": (
    <>
      {SQUARE}
      <circle cx={12} cy={12} r={6.4} />
      {CROSS}
    </>
  ),
  "duz-kurutma": (
    <>
      {SQUARE}
      <path d="M7 12 H17" />
    </>
  ),
  "asarak-kurutma": (
    <>
      {SQUARE}
      <path d="M12 7 V17" />
    </>
  ),
  "utu-1": (
    <>
      {IRON}
      {dot(13, 14.6)}
    </>
  ),
  "utu-2": (
    <>
      {IRON}
      {dot(11, 14.6)}
      {dot(15, 14.6)}
    </>
  ),
  "utu-3": (
    <>
      {IRON}
      {dot(9.4, 14.6)}
      {dot(13, 14.6)}
      {dot(16.6, 14.6)}
    </>
  ),
  utulenmez: (
    <>
      {IRON}
      <path d="M4.5 5 L19.5 21 M19.5 5 L4.5 21" />
    </>
  ),
  "kuru-temizleme-yok": (
    <>
      <circle cx={12} cy={12} r={8.4} />
      {CROSS}
    </>
  ),
};

export type CareSymbolProps = BaseProps & { name: string; size?: number | string; strokeWidth?: number };

/** Başlık verilmezse sembolün Türkçe adı erişilebilir ad olarak kullanılır (decorative=false). */
export function CareSymbol({ name, size, strokeWidth = 1.5, title, ...rest }: CareSymbolProps) {
  const known = (SYMBOLS as Record<string, ReactNode>)[name];
  const label = title ?? (CARE_SYMBOL_LABELS as Record<string, string>)[name];
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} title={label} {...rest}>
      <g stroke="currentColor" strokeWidth={strokeWidth} fill="none">
        {known ?? (
          <>
            <rect x={4} y={4} width={16} height={16} rx={3} strokeDasharray="2 2" />
          </>
        )}
      </g>
    </Svg>
  );
}

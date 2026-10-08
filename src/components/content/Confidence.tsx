/**
 * Güven düzeyi rozeti ve kural lejantı (sunucu + istemci). Kural tek yerde: size-core > CONFIDENCE_RULE.
 */
import { CONFIDENCE_LABEL, CONFIDENCE_LEVELS, CONFIDENCE_RULE, type Confidence } from "@/lib/size-core";

const TONE: Record<Confidence, string> = {
  yuksek: "border-tip-line bg-tip text-ok",
  orta: "border-note-line bg-note text-ink-2",
  dusuk: "border-warn-line bg-warn text-bad",
};

export function ConfidenceBadge({ level, className = "" }: { level: Confidence; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${TONE[level]} ${className}`}
      title={CONFIDENCE_RULE[level]}
      data-guven={level}
    >
      Güven: {CONFIDENCE_LABEL[level]}
    </span>
  );
}

/** Kuralın açık metni (aç-kapa). JS gerektirmez. */
export function ConfidenceLegend({ className = "", open = false }: { className?: string; open?: boolean }) {
  return (
    <details className={`rounded-card border border-line bg-surface p-4 text-sm ${className}`} open={open} data-guven-lejant>
      <summary className="flex min-h-11 cursor-pointer items-center font-bold text-ink">Güven düzeyi nasıl belirlenir?</summary>
      <dl className="mt-2 space-y-2 text-ink-2">
        {CONFIDENCE_LEVELS.map((l) => (
          <div key={l} className="flex flex-wrap items-start gap-2">
            <dt className="shrink-0">
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${TONE[l]}`}>{CONFIDENCE_LABEL[l]}</span>
            </dt>
            <dd className="min-w-0 flex-1 basis-60">{CONFIDENCE_RULE[l]}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-muted">Güven düzeyi verinin kaynağını ve güncelliğini anlatır; markanın kalitesi hakkında bir değerlendirme değildir.</p>
    </details>
  );
}

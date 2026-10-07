import { getSettings } from "@/lib/content";
import type { DocMeta } from "@/lib/content-types";

/**
 * İleride ticari tarafa doğal yönlendirme. Yalnız site bayrağı VE belge bayrağı açıkken,
 * URL doğru alan adındaysa render edilir. Varsayılan: kapalı → DOM'da hiçbir şey yok.
 */
export function RelatedShoppingCTA({ doc }: { doc: DocMeta }) {
  const s = getSettings();
  const cta = doc.shoppingCta;
  if (!s.shoppingCta.enabled || !cta?.enabled) return null;
  let host = "";
  try {
    host = new URL(cta.url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
  if (host !== s.shoppingCta.domain) return null;
  return (
    <aside className="not-prose my-8 rounded-card border border-line bg-soft p-5">
      {cta.context ? <p className="text-sm text-ink-2">{cta.context}</p> : null}
      <a href={cta.url} rel="noopener" className="mt-2 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4">
        {cta.label}
      </a>
    </aside>
  );
}

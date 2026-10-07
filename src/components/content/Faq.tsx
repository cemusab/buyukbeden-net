import type { DocMeta } from "@/lib/content-types";
import { MarkdocContent } from "./Markdoc";

/** SSS akordeonu (<details>, JS gerektirmez). id="sss" sabit anchor. */
export function FaqList({ doc, title = "Sık sorulan sorular" }: { doc: DocMeta; title?: string }) {
  if (!doc.faq.length) return null;
  return (
    <section aria-labelledby="sss" className="not-prose my-10">
      <h2 id="sss" className="text-h2 font-bold text-ink">
        {title}
      </h2>
      <div className="mt-4 divide-y divide-line rounded-card border border-line bg-surface">
        {doc.faq.map((f, i) => (
          <details key={i} className="group px-4 sm:px-5" open={i === 0}>
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold text-ink [&::-webkit-details-marker]:hidden">
              <h3 className="text-base">{f.q}</h3>
              <span aria-hidden="true" className="text-xl leading-none text-primary transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="prose-tight pb-4 text-[0.9375rem] leading-relaxed text-ink-2">
              <MarkdocContent tree={f.a} inline />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

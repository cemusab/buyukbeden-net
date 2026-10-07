import Link from "next/link";
import { getSettings } from "@/lib/content";
import { breadcrumbLd } from "@/lib/jsonld";
import { breadcrumbFor } from "@/lib/routes";
import { JsonLd } from "@/components/ui/primitives";

/** Görünür breadcrumb + BreadcrumbList JSON-LD (aynı zincir, manifest parent'larından). */
export function Breadcrumbs({ path, className = "" }: { path: string; className?: string }) {
  const chain = breadcrumbFor(path);
  if (chain.length < 2) return null;
  return (
    <>
      <nav aria-label="Konum" className={`scroll-strip ${className}`}>
        <ol className="flex w-max items-center gap-1.5 text-sm text-muted">
          {chain.map((e, i) => {
            const last = i === chain.length - 1;
            return (
              <li key={e.path} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="font-medium text-ink-2">
                    {e.label}
                  </span>
                ) : (
                  <>
                    <Link href={e.path} className="inline-flex min-h-11 items-center hover:text-primary hover:underline underline-offset-4" data-crumb>
                      {e.label}
                    </Link>
                    <span aria-hidden="true">›</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbLd(getSettings(), chain)} />
    </>
  );
}

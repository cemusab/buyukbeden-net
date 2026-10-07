import { notFound } from "next/navigation";
import { getAuthor, getAuthors, getSettings, listLive } from "@/lib/content";
import { personLd } from "@/lib/jsonld";
import { simpleMetadata } from "@/lib/metadata";
import { PLACEHOLDER } from "@/lib/page-helpers";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CompactCard } from "@/components/ui/Cards";
import { JsonLd } from "@/components/ui/primitives";

export function generateStaticParams() {
  const a = getAuthors().map((x) => ({ slug: x.id }));
  return a.length ? a : [{ slug: PLACEHOLDER }];
}

export async function generateMetadata({ params }: PageProps<"/yazar/[slug]">) {
  const a = getAuthor((await params).slug);
  if (!a) return { title: "Sayfa bulunamadı", robots: { index: false, follow: true } };
  return simpleMetadata({ title: a.name, description: a.bio.length > 160 ? a.bio.slice(0, 157).trimEnd() + "…" : a.bio, path: a.path });
}

export default async function AuthorPage({ params }: PageProps<"/yazar/[slug]">) {
  const a = getAuthor((await params).slug);
  if (!a) notFound();
  const docs = listLive((d) => d.author === a.id && d.collection !== "sayfalar" && d.index);
  return (
    <div className="container-page pb-16 pt-4" data-template="AUTHOR">
      <Breadcrumbs path={a.path} />
      <header className="mt-6 max-w-prose">
        <p className="text-eyebrow font-bold uppercase tracking-[0.12em] text-muted">{a.isTeam ? "Editör ekibi" : "Yazar"}</p>
        <h1 className="mt-2 text-h1 font-extrabold text-ink">{a.name}</h1>
        <p className="mt-1 text-sm font-semibold text-ink-2">{a.role}</p>
        <p className="mt-4 text-lg text-ink-2">{a.bio}</p>
        {a.sameAs.length ? (
          <ul className="mt-3 flex flex-wrap gap-3 text-sm">
            {a.sameAs.map((u) => (
              <li key={u}>
                <a href={u} rel="noopener noreferrer me" className="text-primary underline underline-offset-2">
                  {new URL(u).hostname.replace(/^www\./, "")}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </header>
      {docs.length ? (
        <section aria-labelledby="yazilar" className="mt-12">
          <h2 id="yazilar" className="mb-4 text-h2 font-bold text-ink">
            Hazırladığı rehberler ({docs.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {docs.map((d) => (
              <CompactCard key={d.key} doc={d} />
            ))}
          </div>
        </section>
      ) : null}
      <JsonLd data={personLd(getSettings(), a)} />
    </div>
  );
}

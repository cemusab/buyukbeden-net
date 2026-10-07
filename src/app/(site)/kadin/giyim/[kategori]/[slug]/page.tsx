import { getManifest } from "@/lib/content";
import { metaFor, PLACEHOLDER, renderPath } from "@/lib/page-helpers";

export function generateStaticParams() {
  const out = getManifest()
    .map((e) => e.path.match(/^\/kadin\/giyim\/([^/]+)\/([^/]+)$/))
    .filter((m): m is RegExpMatchArray => !!m)
    .map((m) => ({ kategori: m[1], slug: m[2] }));
  return out.length ? out : [{ kategori: PLACEHOLDER, slug: PLACEHOLDER }];
}
export async function generateMetadata({ params }: PageProps<"/kadin/giyim/[kategori]/[slug]">) {
  const { kategori, slug } = await params;
  return metaFor(`/kadin/giyim/${kategori}/${slug}`);
}
export default async function Page({ params }: PageProps<"/kadin/giyim/[kategori]/[slug]">) {
  const { kategori, slug } = await params;
  return renderPath(`/kadin/giyim/${kategori}/${slug}`);
}

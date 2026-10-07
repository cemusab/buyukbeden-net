import { getManifest } from "@/lib/content";
import { metaFor, PLACEHOLDER, renderPath } from "@/lib/page-helpers";

export function generateStaticParams() {
  const out = getManifest()
    .map((e) => e.path.match(/^\/erkek\/giyim\/([^/]+)\/([^/]+)$/))
    .filter((m): m is RegExpMatchArray => !!m)
    .map((m) => ({ kategori: m[1], slug: m[2] }));
  return out.length ? out : [{ kategori: PLACEHOLDER, slug: PLACEHOLDER }];
}
export async function generateMetadata({ params }: PageProps<"/erkek/giyim/[kategori]/[slug]">) {
  const { kategori, slug } = await params;
  return metaFor(`/erkek/giyim/${kategori}/${slug}`);
}
export default async function Page({ params }: PageProps<"/erkek/giyim/[kategori]/[slug]">) {
  const { kategori, slug } = await params;
  return renderPath(`/erkek/giyim/${kategori}/${slug}`);
}

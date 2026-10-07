import { metaFor, renderPath, slugParams } from "@/lib/page-helpers";

export const generateStaticParams = () => slugParams("/erkek/giyim", "kategori");
export async function generateMetadata({ params }: PageProps<"/erkek/giyim/[kategori]">) {
  return metaFor(`/erkek/giyim/${(await params).kategori}`);
}
export default async function Page({ params }: PageProps<"/erkek/giyim/[kategori]">) {
  return renderPath(`/erkek/giyim/${(await params).kategori}`);
}

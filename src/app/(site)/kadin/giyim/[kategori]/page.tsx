import { metaFor, renderPath, slugParams } from "@/lib/page-helpers";

export const generateStaticParams = () => slugParams("/kadin/giyim", "kategori");
export async function generateMetadata({ params }: PageProps<"/kadin/giyim/[kategori]">) {
  return metaFor(`/kadin/giyim/${(await params).kategori}`);
}
export default async function Page({ params }: PageProps<"/kadin/giyim/[kategori]">) {
  return renderPath(`/kadin/giyim/${(await params).kategori}`);
}

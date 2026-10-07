import { metaFor, renderPath, slugParams } from "@/lib/page-helpers";

export const generateStaticParams = () => slugParams("/rehberler");
export async function generateMetadata({ params }: PageProps<"/rehberler/[slug]">) {
  return metaFor(`/rehberler/${(await params).slug}`);
}
export default async function Page({ params }: PageProps<"/rehberler/[slug]">) {
  return renderPath(`/rehberler/${(await params).slug}`);
}

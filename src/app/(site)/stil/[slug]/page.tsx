import { metaFor, renderPath, slugParams } from "@/lib/page-helpers";

export const generateStaticParams = () => slugParams("/stil");
export async function generateMetadata({ params }: PageProps<"/stil/[slug]">) {
  return metaFor(`/stil/${(await params).slug}`);
}
export default async function Page({ params }: PageProps<"/stil/[slug]">) {
  return renderPath(`/stil/${(await params).slug}`);
}

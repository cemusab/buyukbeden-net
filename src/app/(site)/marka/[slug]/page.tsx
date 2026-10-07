import { metaFor, renderPath, slugParams } from "@/lib/page-helpers";

export const generateStaticParams = () => slugParams("/marka");
export async function generateMetadata({ params }: PageProps<"/marka/[slug]">) {
  return metaFor(`/marka/${(await params).slug}`);
}
export default async function Page({ params }: PageProps<"/marka/[slug]">) {
  return renderPath(`/marka/${(await params).slug}`);
}

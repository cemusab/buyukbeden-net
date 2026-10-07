import { metaFor, renderPath, slugParams } from "@/lib/page-helpers";

export const generateStaticParams = () => slugParams("/trendler");
export async function generateMetadata({ params }: PageProps<"/trendler/[slug]">) {
  return metaFor(`/trendler/${(await params).slug}`);
}
export default async function Page({ params }: PageProps<"/trendler/[slug]">) {
  return renderPath(`/trendler/${(await params).slug}`);
}

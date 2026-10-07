import { metaFor, renderPath, slugParams } from "@/lib/page-helpers";

export const generateStaticParams = () => slugParams("/erkek/ayakkabi");
export async function generateMetadata({ params }: PageProps<"/erkek/ayakkabi/[slug]">) {
  return metaFor(`/erkek/ayakkabi/${(await params).slug}`);
}
export default async function Page({ params }: PageProps<"/erkek/ayakkabi/[slug]">) {
  return renderPath(`/erkek/ayakkabi/${(await params).slug}`);
}

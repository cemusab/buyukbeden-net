import { metaFor, renderPath, slugParams } from "@/lib/page-helpers";

export const generateStaticParams = () => slugParams("/erkek/kombinler");
export async function generateMetadata({ params }: PageProps<"/erkek/kombinler/[slug]">) {
  return metaFor(`/erkek/kombinler/${(await params).slug}`);
}
export default async function Page({ params }: PageProps<"/erkek/kombinler/[slug]">) {
  return renderPath(`/erkek/kombinler/${(await params).slug}`);
}

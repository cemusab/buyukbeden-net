import { metaFor, renderPath, slugParams } from "@/lib/page-helpers";

export const generateStaticParams = () => slugParams("/erkek/stil");
export async function generateMetadata({ params }: PageProps<"/erkek/stil/[slug]">) {
  return metaFor(`/erkek/stil/${(await params).slug}`);
}
export default async function Page({ params }: PageProps<"/erkek/stil/[slug]">) {
  return renderPath(`/erkek/stil/${(await params).slug}`);
}

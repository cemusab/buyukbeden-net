import { metaFor, renderPath, slugParams } from "@/lib/page-helpers";

export const generateStaticParams = () => slugParams("/erkek/beden-rehberi");
export async function generateMetadata({ params }: PageProps<"/erkek/beden-rehberi/[slug]">) {
  return metaFor(`/erkek/beden-rehberi/${(await params).slug}`);
}
export default async function Page({ params }: PageProps<"/erkek/beden-rehberi/[slug]">) {
  return renderPath(`/erkek/beden-rehberi/${(await params).slug}`);
}

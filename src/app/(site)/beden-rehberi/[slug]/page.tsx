import { metaFor, renderPath, slugParams } from "@/lib/page-helpers";

export const generateStaticParams = () => slugParams("/beden-rehberi");
export async function generateMetadata({ params }: PageProps<"/beden-rehberi/[slug]">) {
  return metaFor(`/beden-rehberi/${(await params).slug}`);
}
export default async function Page({ params }: PageProps<"/beden-rehberi/[slug]">) {
  return renderPath(`/beden-rehberi/${(await params).slug}`);
}

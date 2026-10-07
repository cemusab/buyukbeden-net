import { metaFor, renderPath, slugParams } from "@/lib/page-helpers";

export const generateStaticParams = () => slugParams("/kumas-rehberi");
export async function generateMetadata({ params }: PageProps<"/kumas-rehberi/[slug]">) {
  return metaFor(`/kumas-rehberi/${(await params).slug}`);
}
export default async function Page({ params }: PageProps<"/kumas-rehberi/[slug]">) {
  return renderPath(`/kumas-rehberi/${(await params).slug}`);
}

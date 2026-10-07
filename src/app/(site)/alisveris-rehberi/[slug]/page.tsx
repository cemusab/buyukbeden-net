import { metaFor, renderPath, slugParams } from "@/lib/page-helpers";

export const generateStaticParams = () => slugParams("/alisveris-rehberi");
export async function generateMetadata({ params }: PageProps<"/alisveris-rehberi/[slug]">) {
  return metaFor(`/alisveris-rehberi/${(await params).slug}`);
}
export default async function Page({ params }: PageProps<"/alisveris-rehberi/[slug]">) {
  return renderPath(`/alisveris-rehberi/${(await params).slug}`);
}

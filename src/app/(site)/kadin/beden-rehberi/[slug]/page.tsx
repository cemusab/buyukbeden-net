import { metaFor, renderPath, slugParams } from "@/lib/page-helpers";

export const generateStaticParams = () => slugParams("/kadin/beden-rehberi");
export async function generateMetadata({ params }: PageProps<"/kadin/beden-rehberi/[slug]">) {
  return metaFor(`/kadin/beden-rehberi/${(await params).slug}`);
}
export default async function Page({ params }: PageProps<"/kadin/beden-rehberi/[slug]">) {
  return renderPath(`/kadin/beden-rehberi/${(await params).slug}`);
}

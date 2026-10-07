import { metaFor, renderPath, slugParams } from "@/lib/page-helpers";

export const generateStaticParams = () => slugParams("/kadin/stil");
export async function generateMetadata({ params }: PageProps<"/kadin/stil/[slug]">) {
  return metaFor(`/kadin/stil/${(await params).slug}`);
}
export default async function Page({ params }: PageProps<"/kadin/stil/[slug]">) {
  return renderPath(`/kadin/stil/${(await params).slug}`);
}

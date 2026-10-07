import { metaFor, renderPath, slugParams } from "@/lib/page-helpers";

export const generateStaticParams = () => slugParams("/kadin/kombinler");
export async function generateMetadata({ params }: PageProps<"/kadin/kombinler/[slug]">) {
  return metaFor(`/kadin/kombinler/${(await params).slug}`);
}
export default async function Page({ params }: PageProps<"/kadin/kombinler/[slug]">) {
  return renderPath(`/kadin/kombinler/${(await params).slug}`);
}

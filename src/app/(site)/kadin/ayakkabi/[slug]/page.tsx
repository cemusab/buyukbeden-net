import { metaFor, renderPath, slugParams } from "@/lib/page-helpers";

export const generateStaticParams = () => slugParams("/kadin/ayakkabi");
export async function generateMetadata({ params }: PageProps<"/kadin/ayakkabi/[slug]">) {
  return metaFor(`/kadin/ayakkabi/${(await params).slug}`);
}
export default async function Page({ params }: PageProps<"/kadin/ayakkabi/[slug]">) {
  return renderPath(`/kadin/ayakkabi/${(await params).slug}`);
}

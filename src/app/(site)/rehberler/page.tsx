import { metaFor, renderPath } from "@/lib/page-helpers";

export const generateMetadata = () => metaFor("/rehberler");
export default function Page() {
  return renderPath("/rehberler");
}

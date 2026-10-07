import { metaFor, renderPath } from "@/lib/page-helpers";

export const generateMetadata = () => metaFor("/kadin/giyim");
export default function Page() {
  return renderPath("/kadin/giyim");
}

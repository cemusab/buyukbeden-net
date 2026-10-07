import { metaFor, renderPath } from "@/lib/page-helpers";

export const generateMetadata = () => metaFor("/kadin/kombinler");
export default function Page() {
  return renderPath("/kadin/kombinler");
}

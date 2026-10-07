import { metaFor, renderPath } from "@/lib/page-helpers";

export const generateMetadata = () => metaFor("/kadin/ayakkabi");
export default function Page() {
  return renderPath("/kadin/ayakkabi");
}

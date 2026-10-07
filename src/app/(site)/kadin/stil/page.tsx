import { metaFor, renderPath } from "@/lib/page-helpers";

export const generateMetadata = () => metaFor("/kadin/stil");
export default function Page() {
  return renderPath("/kadin/stil");
}

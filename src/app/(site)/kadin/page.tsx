import { metaFor, renderPath } from "@/lib/page-helpers";

export const generateMetadata = () => metaFor("/kadin");
export default function Page() {
  return renderPath("/kadin");
}

import { metaFor, renderPath } from "@/lib/page-helpers";

export const generateMetadata = () => metaFor("/stil");
export default function Page() {
  return renderPath("/stil");
}

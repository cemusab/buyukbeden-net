import { metaFor, renderPath } from "@/lib/page-helpers";

export const generateMetadata = () => metaFor("/markalar");
export default function Page() {
  return renderPath("/markalar");
}

import { metaFor, renderPath } from "@/lib/page-helpers";

export const generateMetadata = () => metaFor("/gizlilik");
export default function Page() {
  return renderPath("/gizlilik");
}

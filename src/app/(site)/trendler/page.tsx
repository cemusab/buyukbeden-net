import { metaFor, renderPath } from "@/lib/page-helpers";

export const generateMetadata = () => metaFor("/trendler");
export default function Page() {
  return renderPath("/trendler");
}

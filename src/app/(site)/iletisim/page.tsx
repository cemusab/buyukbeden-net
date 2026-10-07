import { metaFor, renderPath } from "@/lib/page-helpers";

export const generateMetadata = () => metaFor("/iletisim");
export default function Page() {
  return renderPath("/iletisim");
}

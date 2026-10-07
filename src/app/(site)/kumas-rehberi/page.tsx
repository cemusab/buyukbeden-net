import { metaFor, renderPath } from "@/lib/page-helpers";

export const generateMetadata = () => metaFor("/kumas-rehberi");
export default function Page() {
  return renderPath("/kumas-rehberi");
}

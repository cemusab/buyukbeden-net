import { metaFor, renderPath } from "@/lib/page-helpers";

export const generateMetadata = () => metaFor("/alisveris-rehberi");
export default function Page() {
  return renderPath("/alisveris-rehberi");
}

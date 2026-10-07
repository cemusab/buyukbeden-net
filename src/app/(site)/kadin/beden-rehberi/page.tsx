import { metaFor, renderPath } from "@/lib/page-helpers";

export const generateMetadata = () => metaFor("/kadin/beden-rehberi");
export default function Page() {
  return renderPath("/kadin/beden-rehberi");
}

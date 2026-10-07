import { metaFor, renderPath } from "@/lib/page-helpers";

export const generateMetadata = () => metaFor("/hakkimizda");
export default function Page() {
  return renderPath("/hakkimizda");
}

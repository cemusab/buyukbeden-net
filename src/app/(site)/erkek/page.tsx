import { metaFor, renderPath } from "@/lib/page-helpers";

export const generateMetadata = () => metaFor("/erkek");
export default function Page() {
  return renderPath("/erkek");
}

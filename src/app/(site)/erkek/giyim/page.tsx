import { metaFor, renderPath } from "@/lib/page-helpers";

export const generateMetadata = () => metaFor("/erkek/giyim");
export default function Page() {
  return renderPath("/erkek/giyim");
}

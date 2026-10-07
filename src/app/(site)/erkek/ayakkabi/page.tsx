import { metaFor, renderPath } from "@/lib/page-helpers";

export const generateMetadata = () => metaFor("/erkek/ayakkabi");
export default function Page() {
  return renderPath("/erkek/ayakkabi");
}

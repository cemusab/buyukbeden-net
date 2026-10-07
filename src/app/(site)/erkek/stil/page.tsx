import { metaFor, renderPath } from "@/lib/page-helpers";

export const generateMetadata = () => metaFor("/erkek/stil");
export default function Page() {
  return renderPath("/erkek/stil");
}

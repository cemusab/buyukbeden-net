import { metaFor, renderPath } from "@/lib/page-helpers";

export const generateMetadata = () => metaFor("/erkek/beden-rehberi");
export default function Page() {
  return renderPath("/erkek/beden-rehberi");
}

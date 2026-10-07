import { renderUrlset, xmlResponse } from "@/lib/sitemap";

export function GET() {
  return xmlResponse(renderUrlset("women"));
}

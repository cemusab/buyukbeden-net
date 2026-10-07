import { renderIndex, xmlResponse } from "@/lib/sitemap";

export function GET() {
  return xmlResponse(renderIndex());
}

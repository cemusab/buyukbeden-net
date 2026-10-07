import type { DocMeta } from "@/lib/content-types";
import { ArticleTemplate } from "./ArticleTemplate";
import { BrandTemplate, FabricTemplate, SizeGuideTemplate } from "./EntityTemplates";
import { HubTemplate } from "./HubTemplate";
import { LandingTemplate } from "./LandingTemplates";

/** Belge türüne göre şablon seçimi. */
export function DocView({ doc }: { doc: DocMeta }) {
  switch (doc.type) {
    case "LANDING":
      return <LandingTemplate doc={doc} />;
    case "CATEGORY_HUB":
      return <HubTemplate doc={doc} />;
    case "SIZE_GUIDE":
      return <SizeGuideTemplate doc={doc} />;
    case "FABRIC_GUIDE":
      return <FabricTemplate doc={doc} />;
    case "BRAND_GUIDE":
      return <BrandTemplate doc={doc} />;
    default:
      return <ArticleTemplate doc={doc} />;
  }
}

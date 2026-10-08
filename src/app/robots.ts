import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/content";

/** Üretimde tam erişim (admin, API, arama sorguları ve filtreli marka dizini hariç); önizleme ortamlarında tamamen kapalı. */
export default function robots(): MetadataRoute.Robots {
  const s = getSettings();
  const isProd = (process.env.VERCEL_ENV ?? "production") === "production";
  if (!isProd) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/keystatic", "/api/", "/arama?", "/markalar?"] },
    sitemap: `${s.siteUrl}/sitemap-index.xml`,
  };
}

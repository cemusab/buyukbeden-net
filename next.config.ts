import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";
import { EXTERNAL_REDIRECTS } from "./src/lib/external-redirects";

/** İçerikten üretilen yönlendirmeler (redirectFrom + hub kısa yolları) – scripts/build-content.ts yazar. */
function contentRedirects(): { source: string; destination: string }[] {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/generated/redirects.json"), "utf8"));
  } catch {
    return [];
  }
}

const LEGACY: [string, string][] = [
  ["/index.html", "/"],
  ["/kadin.html", "/kadin"],
  ["/erkek.html", "/erkek"],
  ["/markalar.html", "/markalar"],
  ["/rehber.html", "/rehberler"],
];

const isPreview = !!process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      ...LEGACY.map(([source, destination]) => ({ source, destination, permanent: true })),
      ...contentRedirects().map((r) => ({ source: r.source, destination: r.destination, permanent: true })),
      ...EXTERNAL_REDIRECTS.map((r) => ({ source: r.source, destination: r.destination, permanent: true })),
    ];
  },
  async headers() {
    const h = [
      { source: "/keystatic/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
    if (isPreview) h.push({ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] });
    return h;
  },
};

export default nextConfig;

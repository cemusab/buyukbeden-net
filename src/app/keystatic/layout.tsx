import type { Metadata } from "next";
import KeystaticApp from "./keystatic";

/** Yönetim paneli: indekslenmez, hiçbir sayfadan linklenmez, sitemap/robots dışı. */
export const metadata: Metadata = { title: "Yönetim", robots: { index: false, follow: false } };

export default function KeystaticLayout() {
  return <KeystaticApp />;
}

import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { getSettings } from "@/lib/content";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
});

const settings = getSettings();

export const metadata: Metadata = {
  metadataBase: new URL(settings.siteUrl),
  title: { default: `${settings.siteName} – ${settings.tagline}`, template: `%s | ${settings.siteName}` },
  description: settings.tagline,
  applicationName: settings.siteName,
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={jakarta.variable}>
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}

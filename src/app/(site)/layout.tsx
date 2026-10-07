import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";

/** Tüm site sayfaları build'de tamamen statik üretilir (mimari K1). */
export const ensureStatic = "navigation";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="icerik" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}

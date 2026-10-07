import Link from "next/link";
import { getSettings } from "@/lib/content";
import { mainNav } from "@/lib/nav";
import { SearchBox } from "@/components/search/SearchBox";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";
import { NavStrip } from "./NavStrip";

export function Header() {
  const s = getSettings();
  const items = mainNav();
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="container-page">
        <div className="flex items-center gap-3 py-2.5 lg:gap-8 lg:py-4">
          <Link href="/" className="mr-auto flex min-h-11 min-w-0 flex-col justify-center lg:mr-0" aria-label={`${s.siteName} ana sayfa`}>
            <span className="text-xl font-extrabold leading-none tracking-tight text-ink lg:text-2xl">
              buyukbeden<span className="text-primary">.net</span>
            </span>
            <span className="mt-1 hidden truncate text-xs text-muted sm:block">{s.tagline}</span>
          </Link>
          <SearchBox inputId="ust-arama" className="hidden flex-1 md:block lg:max-w-md lg:ml-auto" />
          <MobileMenu items={items} />
        </div>
        <SearchBox inputId="ust-arama-mobil" className="pb-2.5 md:hidden" />
      </div>
      <div className="border-t border-line">
        <div className="container-page">
          <DesktopNav items={items} />
          <NavStrip items={items} />
        </div>
      </div>
    </header>
  );
}

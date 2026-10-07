import Link from "next/link";
import { hasRoute } from "@/lib/content";
import type { DocMeta } from "@/lib/content-types";
import { BODY_TYPES, BODY_TYPE_LABELS, BodyTypeFigure, bodyTypeSwatch } from "@/components/illustrations";

type Silo = "kadin" | "erkek";

/** Vücut tipi → rehber sayfası. Yalnız manifestte olan sayfalar kullanılır. */
const PAGES: Record<Silo, Record<string, string[]>> = {
  kadin: {
    "kum-saati": ["/kadin/stil/kum-saati-vucut-tipi"],
    armut: ["/kadin/stil/armut-vucut-tipi"],
    elma: ["/kadin/stil/elma-vucut-tipi"],
    dikdortgen: ["/kadin/stil/dikdortgen-vucut-tipi"],
    "ters-ucgen": ["/kadin/stil/ters-ucgen-vucut-tipi"],
    "boyu-uzun": ["/kadin/stil/uzun-boylu-stil"],
    "boyu-kisa": ["/kadin/stil/kisa-boylu-stil"],
  },
  erkek: {
    oval: ["/erkek/stil/oval-vucut-tipi", "/erkek/stil/gobekli-erkek-nasil-giyinmeli"],
    dikdortgen: ["/erkek/stil/dikdortgen-vucut-tipi"],
    "ters-ucgen": ["/erkek/stil/ters-ucgen-vucut-tipi"],
    trapez: ["/erkek/stil/trapez-vucut-tipi"],
    "boyu-uzun": ["/erkek/stil/uzun-boylu-buyuk-beden-erkek"],
    "boyu-kisa": ["/erkek/stil/kisa-boylu-buyuk-beden-erkek"],
  },
};

export const BODY_TYPE_OVERVIEW: Record<Silo, string> = { kadin: "/kadin/stil/vucut-tipleri", erkek: "/erkek/stil/vucut-tipleri" };

export function bodyTypeTiles(silo: Silo) {
  return (BODY_TYPES[silo] as readonly string[])
    .map((shape) => ({ shape, label: BODY_TYPE_LABELS[silo][shape], href: PAGES[silo][shape]?.find((p) => hasRoute(p)) }))
    .filter((t): t is { shape: string; label: string; href: string } => !!t.href);
}

/** Belge hangi vücut tipini anlatıyor? (yalnız kendi sayfası için; genel/üst sayfalar null) */
export function bodyTypeOf(doc: Pick<DocMeta, "path" | "silo">): { silo: Silo; shape: string } | null {
  const silo = doc.silo === "kadin" || doc.silo === "erkek" ? doc.silo : null;
  if (!silo) return null;
  for (const [shape, paths] of Object.entries(PAGES[silo])) if (paths.includes(doc.path)) return { silo, shape };
  return null;
}

/** Vücut tipi karoları (pastel zemin, kroki figür, ad, ok). */
export function BodyTypeTiles({ silo, exclude, className = "", wide = true }: { silo: Silo; exclude?: string; className?: string; wide?: boolean }) {
  const tiles = bodyTypeTiles(silo).filter((t) => t.href !== exclude);
  if (!tiles.length) return null;
  return (
    <ul className={`grid grid-cols-3 gap-2 sm:gap-3 ${!wide ? (tiles.length % 3 === 0 ? "" : "sm:grid-cols-4") : `sm:grid-cols-4 ${tiles.length >= 7 ? "lg:grid-cols-7" : tiles.length === 6 ? "lg:grid-cols-6" : "lg:grid-cols-5"}`} ${className}`}>
      {tiles.map((t) => (
        <li key={t.shape}>
          <Link
            href={t.href}
            className="group flex h-full flex-col items-center rounded-card px-2 pb-3 pt-2 outline-offset-2 transition-shadow hover:shadow-card"
            style={{ backgroundColor: bodyTypeSwatch(silo, t.shape).tile }}
          >
            <BodyTypeFigure silo={silo} shape={t.shape} tile={false} className="aspect-[1/2] h-auto w-full max-w-[8.5rem]" />
            <span className="mt-1 text-center text-sm font-bold text-ink">{t.label}</span>
            <span aria-hidden="true" className="mt-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm text-ink shadow-sm group-hover:bg-primary group-hover:text-white">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Tek vücut tipi sayfasının görseli: iki kıyafetle iki figür, biri yardımcı çizgili. */
export function BodyTypeHero({ silo, shape }: { silo: Silo; shape: string }) {
  const label = BODY_TYPE_LABELS[silo][shape];
  if (!label) return null;
  const sw = bodyTypeSwatch(silo, shape);
  const isHeight = shape.startsWith("boyu-");
  const garments = silo === "kadin" ? ["elbise", "bluz-pantolon"] : ["tisort-pantolon", "gomlek-pantolon"];
  const wear = silo === "kadin" ? ["elbiseyle", "bluz ve pantolonla"] : ["tişört ve pantolonla", "gömlek ve pantolonla"];
  const name = isHeight ? `${label} oran çizimi` : `${label} vücut tipi çizimi`;
  const lines = silo === "kadin" ? "omuz, bel ve basen çizgileriyle" : "omuz, bel ve kalça çizgileriyle";
  return (
    <figure className="overflow-hidden rounded-card" style={{ backgroundColor: sw.tile }}>
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2 px-4 pt-4">
        <BodyTypeFigure silo={silo} shape={shape} garment={garments[0]} tile={false} className="h-auto w-full" title={`${name}, ${wear[0]}`} />
        <BodyTypeFigure silo={silo} shape={shape} garment={garments[1]} tile={false} guides={!isHeight} className="h-auto w-full" title={isHeight ? `${name}, ${wear[1]}` : `${name}, ${wear[1]}, ${lines}`} />
      </div>
      <figcaption className="px-4 pb-3 pt-1 text-center text-xs text-ink-2">
        {isHeight ? "İllüstrasyondur; boy farkı, figürün karo içindeki yüksekliğiyle gösterilmiştir." : "İllüstrasyondur; gerçek bedenler çok çeşitlidir ve çoğu kişi iki tipin arasındadır."}
      </figcaption>
    </figure>
  );
}

/**
 * Ana sayfa bölümü: Kadın/Erkek seçimi JS olmadan çalışır (radyo düğmesi + :has).
 * Yalnız sayfası olan karolar gösterilir; hiç karo yoksa bölüm basılmaz.
 */
export function BodyTypeSwitch() {
  const id = "vucut-tipi"; // sınıf adlarındaki #vucut-tipi-* seçicileriyle aynı olmalı
  const silos = (["kadin", "erkek"] as const).filter((s) => bodyTypeTiles(s).length > 0);
  if (!silos.length) return null;
  const label = { kadin: "Kadın", erkek: "Erkek" } as const;
  return (
    <section aria-labelledby={id} className="group/vt container-page mt-14" data-body-type-switch>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <h2 id={id} className="text-h2 font-bold text-ink">
            Vücut tipine göre rehber
          </h2>
          <p className="mt-1 max-w-prose text-sm text-muted">Oranlarınızı tanıyın; size iyi gelen kesim, yaka ve boyları keşfedin.</p>
        </div>
        {silos.length > 1 ? (
          <fieldset className="shrink-0">
            <legend className="sr-only">Bölüm seçin</legend>
            <div className="inline-flex rounded-full border border-line bg-soft p-1">
              {silos.map((s, i) => (
                <span key={s} className="contents">
                  <input type="radio" name={`${id}-silo`} id={`${id}-${s}`} value={s} defaultChecked={i === 0} className="peer sr-only" />
                  <label
                    htmlFor={`${id}-${s}`}
                    className={`inline-flex min-h-11 cursor-pointer select-none items-center rounded-full px-5 text-sm font-bold text-ink-2 hover:text-ink ${
                      s === "kadin"
                        ? "group-has-[#vucut-tipi-kadin:checked]/vt:bg-primary group-has-[#vucut-tipi-kadin:checked]/vt:text-white group-has-[#vucut-tipi-kadin:focus-visible]/vt:outline-2 group-has-[#vucut-tipi-kadin:focus-visible]/vt:outline-primary"
                        : "group-has-[#vucut-tipi-erkek:checked]/vt:bg-primary group-has-[#vucut-tipi-erkek:checked]/vt:text-white group-has-[#vucut-tipi-erkek:focus-visible]/vt:outline-2 group-has-[#vucut-tipi-erkek:focus-visible]/vt:outline-primary"
                    }`}
                  >
                    {label[s]}
                  </label>
                </span>
              ))}
            </div>
          </fieldset>
        ) : null}
      </div>
      {silos.map((s, i) => (
        <div
          key={s}
          data-silo-panel={s}
          className={
            silos.length < 2
              ? ""
              : i === 0
                ? "group-has-[#vucut-tipi-erkek:checked]/vt:hidden"
                : "hidden group-has-[#vucut-tipi-erkek:checked]/vt:block"
          }
        >
          <BodyTypeTiles silo={s} />
          {hasRoute(BODY_TYPE_OVERVIEW[s]) ? (
            <p className="mt-3 text-right">
              <Link href={BODY_TYPE_OVERVIEW[s]} className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline-offset-4 hover:underline">
                {label[s]} vücut tipleri rehberi →
              </Link>
            </p>
          ) : null}
        </div>
      ))}
    </section>
  );
}

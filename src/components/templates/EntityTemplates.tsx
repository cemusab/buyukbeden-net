import Link from "next/link";
import { getDocByKey, getHubs, getSizeChart, listLive } from "@/lib/content";
import type { DocMeta } from "@/lib/content-types";
import { categoryLabel, CATEGORIES, SEASON_LABEL, type GenderSilo } from "@/lib/taxonomy";
import { formatDate } from "@/lib/present";
import { SizeChartTable } from "@/components/content/SizeChartTable";
import { MarkdocContent, SizeComparison } from "@/components/content/Markdoc";
import { ClickToLoadEmbed } from "@/components/content/ClickToLoadEmbed";
import { MeasureArt } from "@/components/media/Illustration";
import { CompactCard } from "@/components/ui/Cards";
import { DocShell } from "./ArticleTemplate";

const PART_LABEL: Record<string, string> = {
  gogus: "Göğüs",
  bel: "Bel",
  basen: "Basen / kalça",
  omuz: "Omuz",
  "ic-bacak": "İç bacak",
  kol: "Kol boyu",
  yaka: "Yaka",
  boy: "Boy",
};

/** Beden rehberi (mimari §14): tablolar + ölçü adımları + komşu bedenler. */
export async function SizeGuideTemplate({ doc }: { doc: DocMeta }) {
  const fm = doc.fm as { sizeCharts: string[]; sizeComparisons: Record<string, unknown>[]; measurementSteps: { part: string; text: string }[] };
  const charts = fm.sizeCharts.map((id) => getSizeChart(id)).filter((c): c is NonNullable<typeof c> => !!c);
  const silo: GenderSilo = doc.silo === "erkek" ? "erkek" : "kadin";
  const before = (
    <div className="space-y-8">
      {charts.length || fm.sizeComparisons.length ? (
        <section aria-labelledby="beden-tablolari">
          <h2 id="beden-tablolari" className="text-h2 font-bold text-ink">
            Beden tabloları
          </h2>
          {fm.sizeComparisons.map((c, i) => (
            <SizeComparison key={`k${i}`} {...c} headingLevel="h3" />
          ))}
          {charts.map((c) => (
            <SizeChartTable key={c.id} chart={c} headingLevel="h3" />
          ))}
        </section>
      ) : null}
      {fm.measurementSteps.length ? (
        <section aria-labelledby="olcu-nasil-alinir" className="grid items-start gap-6 rounded-card border border-line bg-surface p-5 sm:grid-cols-[minmax(0,1fr)_200px]">
          <div>
            <h2 id="olcu-nasil-alinir" className="text-h2 font-bold text-ink">
              Ölçü nasıl alınır?
            </h2>
            <ol className="mt-4 space-y-3">
              {fm.measurementSteps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-[0.9375rem] text-ink-2">
                    <strong className="text-ink">{PART_LABEL[s.part] ?? s.part}:</strong> {s.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <div className="mx-auto w-40 sm:w-full">
            <MeasureArt silo={silo} title={`${silo === "kadin" ? "Kadın" : "Erkek"} ölçü alma şeması`} show={fm.measurementSteps.map((s) => s.part)} />
          </div>
        </section>
      ) : null}
    </div>
  );
  return <DocShell doc={doc} beforeBody={before} />;
}

const LEVEL: Record<string, string> = { dusuk: "Düşük", orta: "Orta", yuksek: "Yüksek" };
const ORIGIN: Record<string, string> = { dogal: "Doğal", "yari-sentetik": "Yarı sentetik (rejenere)", sentetik: "Sentetik", karisim: "Karışım" };
const KIND: Record<string, string> = { lif: "Lif", "kumas-yapisi": "Kumaş yapısı", apre: "Bitim işlemi (apre)" };

function Facts({ rows }: { rows: [string, React.ReactNode][] }) {
  const shown = rows.filter(([, v]) => v !== null && v !== undefined && v !== "");
  if (!shown.length) return null;
  return (
    <dl className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
      {shown.map(([k, v]) => (
        <div key={k} className="bg-surface p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{k}</dt>
          <dd className="mt-1 text-[0.9375rem] text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Kumaş sayfası: künye + artı/eksi + büyük beden notu + iki silodaki ilgili hub'lar. */
export async function FabricTemplate({ doc }: { doc: DocMeta }) {
  const fm = doc.fm as {
    kind: string;
    origin: string | null;
    feel?: string;
    stretch: string | null;
    breathability: string | null;
    warmth: string | null;
    wrinkle: string | null;
    seasons: string[];
    care: { washMaxC: number | null; tumbleDry: boolean | null; iron: string | null; notes?: string };
    pros: string[];
    cons: string[];
    uses: string[];
    aliases: string[];
  };
  const hubs = (["kadin", "erkek"] as const).flatMap((s) => getHubs(s).filter((h) => fm.uses.includes(h.category!)));
  const before = (
    <div className="space-y-6">
      <Facts
        rows={[
          ["Tür", KIND[fm.kind]],
          ["Köken", fm.origin ? ORIGIN[fm.origin] : null],
          ["His", fm.feel],
          ["Esneme", fm.stretch ? LEVEL[fm.stretch] : null],
          ["Nefes alma", fm.breathability ? LEVEL[fm.breathability] : null],
          ["Sıcak tutma", fm.warmth ? LEVEL[fm.warmth] : null],
          ["Kırışma", fm.wrinkle ? LEVEL[fm.wrinkle] : null],
          ["Mevsim", fm.seasons.length ? fm.seasons.map((s) => SEASON_LABEL[s as keyof typeof SEASON_LABEL]).join(", ") : null],
          ["Ütü", fm.care.iron ? `${LEVEL[fm.care.iron]} ısı` : null],
          ["Yıkama", fm.care.washMaxC !== null ? `En fazla ${fm.care.washMaxC} °C` : null],
          ["Diğer adları", fm.aliases.length ? fm.aliases.join(", ") : null],
        ]}
      />
      {fm.care.notes ? (
        <p className="text-[0.9375rem] text-ink-2">
          <strong className="text-ink">Bakım:</strong> {fm.care.notes}
        </p>
      ) : null}
      {fm.pros.length || fm.cons.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-card border border-line p-4">
            <h2 className="font-bold text-ink">Artıları</h2>
            <ul className="mt-2 space-y-1.5 text-[0.9375rem] text-ink-2">
              {fm.pros.map((p) => (
                <li key={p} className="flex gap-2">
                  <span aria-hidden="true" className="font-bold text-ok">
                    +
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-card border border-line p-4">
            <h2 className="font-bold text-ink">Eksileri</h2>
            <ul className="mt-2 space-y-1.5 text-[0.9375rem] text-ink-2">
              {fm.cons.map((p) => (
                <li key={p} className="flex gap-2">
                  <span aria-hidden="true" className="font-bold text-bad">
                    −
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
      <div className="rounded-card border border-note-line bg-note p-5">
        <h2 className="font-bold text-ink">Giysi seçiminde etkisi</h2>
        <div className="prose-tight mt-1 text-ink-2">
          <MarkdocContent tree={doc.inline.plusSizeNotes} inline />
        </div>
      </div>
    </div>
  );
  const after = hubs.length ? (
    <section aria-labelledby="kullanildigi-kategoriler" className="mt-10">
      <h2 id="kullanildigi-kategoriler" className="text-h3 font-bold text-ink">
        Bu kumaşın sık kullanıldığı kategoriler
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {hubs.map((h) => (
          <li key={h.key}>
            <Link href={h.path} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm font-semibold hover:border-primary hover:text-primary">
              {h.silo === "kadin" ? "Kadın" : "Erkek"} · {categoryLabel(h.silo as GenderSilo, h.category!)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  ) : null;
  return <DocShell doc={doc} beforeBody={before} afterBody={after} />;
}

const PRICE: Record<string, string> = { ekonomik: "Ekonomik", orta: "Orta", ust: "Üst", premium: "Premium" };

/** Marka dosyası (mimari §15): yalnız doğrulanmış alanlar. */
export async function BrandTemplate({ doc }: { doc: DocMeta }) {
  const fm = doc.fm as {
    name: string;
    website: string | null;
    country: string | null;
    genders: ("kadin" | "erkek")[];
    sizeRange: Record<string, { from: string; to: string; system: string }> | null;
    priceSegment: string | null;
    categories: string[];
    fitNotes: string | null;
    availabilityTR: { online: boolean | null; stores: boolean | null; notes?: string };
    highlights: string[];
    pros: string[];
    cons: string[];
    alternatives: string[];
    relatedGuides: string[];
    unverified: string[];
    lastVerifiedAt: string;
    socialEmbeds: { platform: "instagram" | "youtube"; url: string; title?: string }[];
    international: boolean;
  };
  const hide = new Set(fm.unverified);
  const cats = fm.genders.flatMap((g) =>
    getHubs(g)
      .filter((h) => fm.categories.includes(h.category!))
      .map((h) => ({ path: h.path, label: `${g === "kadin" ? "Kadın" : "Erkek"} ${categoryLabel(g, h.category!).toLocaleLowerCase("tr")}` })),
  );
  const unlinkedCats = fm.categories.filter((c) => !cats.some((x) => x.path.endsWith(`/${c}`)));
  const avail = [
    fm.availabilityTR.online === true && !hide.has("availabilityTR") ? "Online satış" : null,
    fm.availabilityTR.stores === true && !hide.has("stores") ? "Mağaza" : null,
  ].filter(Boolean);
  const before = (
    <div className="space-y-6">
      <Facts
        rows={[
          ["Ülke", !hide.has("country") ? fm.country : null],
          ["Kime", fm.genders.map((g) => (g === "kadin" ? "Kadın" : "Erkek")).join(" ve ")],
          [
            "Beden aralığı",
            fm.sizeRange && !hide.has("sizeRange")
              ? Object.entries(fm.sizeRange)
                  .map(([g, r]) => `${g === "kadin" ? "Kadın" : "Erkek"}: ${r.from}–${r.to}`)
                  .join(" · ")
              : null,
          ],
          ["Fiyat segmenti", fm.priceSegment && !hide.has("priceSegment") ? PRICE[fm.priceSegment] : null],
          [
            "Kategoriler",
            cats.length || unlinkedCats.length ? (
              <span className="flex flex-wrap gap-x-2 gap-y-1">
                {cats.map((c) => (
                  <Link key={c.path} href={c.path} className="text-primary underline underline-offset-2">
                    {c.label}
                  </Link>
                ))}
                {unlinkedCats.map((c) => (
                  <span key={c}>{CATEGORIES.kadin.find((x) => x.key === c)?.label ?? CATEGORIES.erkek.find((x) => x.key === c)?.label ?? c}</span>
                ))}
              </span>
            ) : null,
          ],
          ["Kalıp karakteri", !hide.has("fitNotes") ? fm.fitNotes : null],
          ["Türkiye'de erişim", avail.length ? avail.join(", ") + (fm.availabilityTR.notes ? ` (${fm.availabilityTR.notes})` : "") : null],
          [
            "Resmi site",
            fm.website && !hide.has("website") ? (
              <a href={fm.website} rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                {new URL(fm.website).hostname.replace(/^www\./, "")}
              </a>
            ) : null,
          ],
          ["Son doğrulama", formatDate(fm.lastVerifiedAt)],
        ]}
      />
      {fm.unverified.length ? <p className="text-sm text-muted">Bazı bilgiler doğrulanıyor; doğrulanana kadar gösterilmez.</p> : null}
      {fm.highlights.length ? (
        <div>
          <h2 className="text-h3 font-bold text-ink">Öne çıkanlar</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.9375rem] text-ink-2">
            {fm.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {fm.pros.length || fm.cons.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {fm.pros.length ? (
            <div className="rounded-card border border-line p-4">
              <h2 className="font-bold text-ink">Artıları</h2>
              <ul className="mt-2 space-y-1.5 text-[0.9375rem] text-ink-2">
                {fm.pros.map((p) => (
                  <li key={p}>+ {p}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {fm.cons.length ? (
            <div className="rounded-card border border-line p-4">
              <h2 className="font-bold text-ink">Eksileri</h2>
              <ul className="mt-2 space-y-1.5 text-[0.9375rem] text-ink-2">
                {fm.cons.map((p) => (
                  <li key={p}>− {p}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
  const alternatives = fm.alternatives.map((a) => getDocByKey(`markalar/${a}`)).filter((d): d is DocMeta => !!d);
  const guides = [
    ...fm.relatedGuides.map((p) => listLive((d) => d.path === p)[0]),
    ...listLive((d) => d.brands.includes(doc.id) && d.key !== doc.key),
  ].filter((d, i, arr): d is DocMeta => !!d && arr.findIndex((x) => x?.key === d.key) === i);
  const after = (
    <>
      {fm.socialEmbeds.length ? (
        <section aria-labelledby="resmi-hesaplar" className="mt-10">
          <h2 id="resmi-hesaplar" className="text-h3 font-bold text-ink">
            Resmi hesaplardan
          </h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {fm.socialEmbeds.map((e) => (
              <ClickToLoadEmbed key={e.url} platform={e.platform} url={e.url} title={e.title} />
            ))}
          </div>
        </section>
      ) : null}
      {alternatives.length ? (
        <section aria-labelledby="alternatif-markalar" className="mt-10">
          <h2 id="alternatif-markalar" className="text-h3 font-bold text-ink">
            Alternatif markalar
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {alternatives.map((d) => (
              <CompactCard key={d.key} doc={d} />
            ))}
          </div>
        </section>
      ) : null}
      {guides.length ? (
        <section aria-labelledby="markanin-gectigi-rehberler" className="mt-10">
          <h2 id="markanin-gectigi-rehberler" className="text-h3 font-bold text-ink">
            Bu markanın geçtiği rehberler
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {guides.slice(0, 6).map((d) => (
              <CompactCard key={d.key} doc={d} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
  return (
    <DocShell
      doc={doc}
      beforeBody={before}
      afterBody={after}
      extraLd={{ about: { "@type": "Organization", name: fm.name, ...(fm.website ? { url: fm.website } : {}) } }}
    />
  );
}

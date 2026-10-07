import Image from "next/image";
import type { ReactNode } from "react";
import type { Image as ImageT } from "@/content/schema";
import { GarmentArt, hasGarmentArt, QuickIcon } from "./Illustration";

/** Görsel + (varsa) yapay zekâ şeffaflık notu ve kredi. */
export function DocImage({
  image,
  sizes,
  priority = false,
  ratio = "16/9",
  className = "",
  caption = true,
}: {
  image: ImageT;
  sizes: string;
  priority?: boolean;
  ratio?: string;
  className?: string;
  caption?: boolean;
}) {
  return (
    <figure className={className}>
      <div className="relative overflow-hidden rounded-card bg-soft" style={{ aspectRatio: ratio }}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-cover"
        />
      </div>
      {caption && (image.aiGenerated || image.credit) ? (
        <figcaption className="mt-1.5 text-xs text-muted">
          {image.aiGenerated ? "Yapay zekâ ile üretilmiş görsel" : null}
          {image.aiGenerated && image.credit ? " · " : null}
          {image.credit ?? null}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Görsel yoksa sade kapak: tür ikonu + kısa etiket (dekoratif). */
export function TypeCover({ title, tone = "neutral", ratio = "16/9", className = "", icon = "rehber" }: { title: string; tone?: "kadin" | "erkek" | "neutral"; ratio?: string; className?: string; icon?: string }) {
  const bg = tone === "kadin" ? "from-badge-kadin-bg" : tone === "erkek" ? "from-badge-erkek-bg" : "from-primary-soft";
  void title;
  return (
    <div aria-hidden="true" className={`relative flex items-center justify-center overflow-hidden rounded-card bg-gradient-to-br ${bg} to-soft ${className}`} style={{ aspectRatio: ratio }}>
      <QuickIcon name={icon} className="h-1/3 max-h-24 w-auto text-primary/45" />
    </div>
  );
}

/** Kart kapağı: fotoğraf → kıyafet çizimi → tipografik kapak. */
export function Cover({
  image,
  title,
  silo,
  category,
  ratio = "4/3",
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  icon,
}: {
  image?: ImageT;
  title: string;
  silo: string;
  category?: string;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  icon?: string;
}): ReactNode {
  if (image) return <DocImage image={image} sizes={sizes} ratio={ratio} priority={priority} caption={false} />;
  const tone = silo === "kadin" ? "kadin" : silo === "erkek" ? "erkek" : "neutral";
  if (category && (silo === "kadin" || silo === "erkek") && hasGarmentArt(silo, category)) {
    return (
      <div aria-hidden="true" className="flex items-center justify-center overflow-hidden rounded-card bg-soft p-4" style={{ aspectRatio: ratio }}>
        <GarmentArt category={category} silo={silo} />
      </div>
    );
  }
  return <TypeCover title={title} tone={tone} ratio={ratio} icon={icon} />;
}

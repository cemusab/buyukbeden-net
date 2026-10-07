"use client";

import { useState } from "react";

function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.endsWith("youtu.be")) return u.pathname.slice(1) || null;
    if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2] ?? null;
    if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2] ?? null;
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

function instagramEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    const m = u.pathname.match(/^\/(p|reel|tv)\/([^/]+)/);
    return m ? `https://www.instagram.com/${m[1]}/${m[2]}/embed/` : null;
  } catch {
    return null;
  }
}

/**
 * Tıklayınca yüklenen resmi hesap gömmesi. Tıklamadan önce üçüncü tarafa hiçbir istek yapılmaz.
 * YouTube youtube-nocookie.com üzerinden yüklenir. Gizlilik/çerez metinlerinde açıklanmıştır.
 */
export function ClickToLoadEmbed({ platform, url, title }: { platform: "instagram" | "youtube"; url: string; title?: string }) {
  const [on, setOn] = useState(false);
  const src = platform === "youtube" ? (youtubeId(url) ? `https://www.youtube-nocookie.com/embed/${youtubeId(url)}?autoplay=1` : null) : instagramEmbed(url);
  const name = platform === "youtube" ? "YouTube" : "Instagram";
  const owner = platform === "youtube" ? "Google" : "Meta";
  if (!src) return null;
  return (
    <div className="overflow-hidden rounded-card border border-line bg-soft" style={{ aspectRatio: platform === "youtube" ? "16/9" : "4/5" }}>
      {on ? (
        <iframe
          src={src}
          title={title ?? `${name} içeriği`}
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-5 text-center">
          <p className="font-semibold text-ink">{title ?? `${name} içeriği`}</p>
          <p className="max-w-xs text-xs text-muted">
            Bu içerik {name} ({owner}) tarafından sunulur. Tıkladığınızda {owner} sunucularından yüklenir ve {owner} çerez kullanabilir.
          </p>
          <button
            type="button"
            onClick={() => setOn(true)}
            className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            {name} içeriğini yükle
          </button>
          <a href={url} rel="noopener noreferrer" className="text-xs text-primary underline underline-offset-2">
            {name}&apos;da aç
          </a>
        </div>
      )}
    </div>
  );
}

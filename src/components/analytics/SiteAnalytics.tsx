"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

/**
 * Vercel Web Analytics (çerezsiz, anonim). Gizlilik: sayfa adresindeki sorgu
 * parametreleri (ör. /arama?q=…) gönderilmeden önce silinir. Yasal metinler:
 * /gizlilik, /cerez-politikasi, /kvkk.
 */
function stripQuery(event: BeforeSendEvent): BeforeSendEvent {
  const url = new URL(event.url);
  url.search = "";
  url.hash = "";
  return { ...event, url: url.toString() };
}

export function SiteAnalytics() {
  return <Analytics beforeSend={stripQuery} />;
}

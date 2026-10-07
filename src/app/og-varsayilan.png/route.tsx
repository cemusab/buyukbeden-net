import { ImageResponse } from "next/og";


const size = { width: 1200, height: 630 };


/** Varsayılan paylaşım görseli (belgede ogImage/featuredImage yoksa). */
export function GET() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#1f3a68", color: "#fff" }}>
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -2 }}>buyukbeden.net</div>
        <div style={{ fontSize: 40, marginTop: 24, opacity: 0.9 }}>Türkiye&apos;nin büyük beden moda ve stil rehberi</div>
        <div style={{ fontSize: 28, marginTop: 48, opacity: 0.75 }}>Beden · Stil · Kombin · Kumaş · Marka</div>
      </div>
    ),
    size,
  );
}

import { ImageResponse } from "next/og"

export const dynamic = "force-static"
export const alt = "CEO AI Accountability Console"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "serif",
        }}
      >
        {/* Top rule */}
        <div style={{ width: "100%", height: 2, background: "#000000", display: "flex" }} />

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Label */}
          <div
            style={{
              display: "flex",
              fontSize: 13,
              letterSpacing: "0.22em",
              color: "#6b7280",
              fontFamily: "monospace",
              textTransform: "uppercase",
            }}
          >
            Powered by the DDAT Evidence Standard
          </div>

          {/* Title */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 64,
                fontWeight: 700,
                color: "#000000",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              CEO AI Accountability
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 64,
                fontWeight: 700,
                color: "#000000",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Console
            </div>
          </div>

          {/* Description */}
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#374151",
              lineHeight: 1.5,
              maxWidth: 760,
            }}
          >
            Audit the institution. Not the person. A preliminary executive governance console for mapping
            accountability in AI-enabled decision systems.
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 13,
              letterSpacing: "0.15em",
              color: "#9ca3af",
              fontFamily: "monospace",
              textTransform: "uppercase",
            }}
          >
            We do not measure private belief. We audit institutionalized commitments.
          </div>
        </div>

        {/* Bottom rule */}
        <div style={{ width: "100%", height: 2, background: "#000000", display: "flex" }} />
      </div>
    ),
    { ...size }
  )
}

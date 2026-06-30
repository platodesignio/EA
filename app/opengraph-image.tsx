import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Dialectical Direction Audit Theory"
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
        <div style={{ width: "100%", height: 2, background: "#000000" }} />

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Label */}
          <div
            style={{
              fontSize: 13,
              letterSpacing: "0.22em",
              color: "#6b7280",
              fontFamily: "monospace",
              textTransform: "uppercase",
            }}
          >
            Research Prototype · Independent
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#000000",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Dialectical Direction
            <br />
            Audit Theory
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 22,
              color: "#374151",
              lineHeight: 1.5,
              maxWidth: 760,
            }}
          >
            A research prototype for auditing whether AI scoring systems,
            institutional evaluation systems, and decision architectures
            expand or close future possibility.
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
              fontSize: 13,
              letterSpacing: "0.15em",
              color: "#9ca3af",
              fontFamily: "monospace",
              textTransform: "uppercase",
            }}
          >
            DDAT audits decision architectures — not persons.
          </div>
          <div
            style={{
              fontSize: 13,
              letterSpacing: "0.15em",
              color: "#9ca3af",
              fontFamily: "monospace",
            }}
          >
            ddat-jade.vercel.app
          </div>
        </div>

        {/* Bottom rule */}
        <div style={{ width: "100%", height: 2, background: "#000000" }} />
      </div>
    ),
    { ...size }
  )
}

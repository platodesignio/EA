// One-off script: renders the app icon at the sizes iOS/Android/PWA need,
// using next/og's ImageResponse (same renderer as app/opengraph-image.tsx)
// so there's no new dependency and the icon matches the app's monochrome
// design system. Run with: node scripts/generate-icons.mjs
import { ImageResponse } from "next/og.js"
import React from "react"
import { writeFile, mkdir } from "node:fs/promises"

const SIZES = [
  // Next.js file-convention icons — must live in app/, auto-linked into <head>
  { dir: "app", name: "icon.png", size: 512, padding: 0.16 },
  { dir: "app", name: "apple-icon.png", size: 180, padding: 0.14 },
  // Manifest icons — referenced by literal path from app/manifest.json, must be public
  { dir: "public", name: "icon-192.png", size: 192, padding: 0.16 },
  { dir: "public", name: "icon-512.png", size: 512, padding: 0.16 },
  { dir: "public", name: "icon-maskable-512.png", size: 512, padding: 0.28 }, // extra safe zone for Android maskable icons
]

async function render({ size, padding }) {
  const mark = React.createElement(
    "div",
    {
      style: {
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
      },
    },
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: size * (1 - padding * 2),
          height: size * (1 - padding * 2),
        },
      },
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: size * 0.34,
            color: "#ffffff",
            letterSpacing: -1,
          },
        },
        "EA"
      ),
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            width: size * 0.42,
            height: Math.max(2, size * 0.014),
            background: "#ffffff",
            marginTop: size * 0.045,
          },
        }
      )
    )
  )

  const res = new ImageResponse(mark, { width: size, height: size })
  return Buffer.from(await res.arrayBuffer())
}

async function main() {
  for (const spec of SIZES) {
    await mkdir(spec.dir, { recursive: true })
    const buf = await render(spec)
    const path = `${spec.dir}/${spec.name}`
    await writeFile(path, buf)
    console.log(`wrote ${path} (${buf.length} bytes)`)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

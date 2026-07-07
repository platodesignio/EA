import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { EvidenceStoreProvider } from "@/lib/evidence-store"
import { CEOConsoleStoreProvider } from "@/lib/ceo-console-store"
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://ea-sandy.vercel.app"),
  title: "FED-DLR Audit",
  description:
    "FED-DLR Audit — powered by the DDAT Evidence Standard. An executive governance console for mapping how AI-enabled decision systems evaluate, rank, predict, classify, exclude, allow appeal, allow re-entry, and distribute responsibility. Audit the institution, not the person.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "FED-DLR",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "FED-DLR Audit",
    description:
      "Powered by the DDAT Evidence Standard. Audit the institution, not the person. We do not measure private belief — we audit institutionalized commitments.",
    siteName: "FED-DLR Audit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FED-DLR Audit",
    description:
      "Powered by the DDAT Evidence Standard. A preliminary executive governance tool for mapping accountability risk in AI-enabled decision systems.",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>
        <ServiceWorkerRegistration />
        <EvidenceStoreProvider>
          <CEOConsoleStoreProvider>{children}</CEOConsoleStoreProvider>
        </EvidenceStoreProvider>
      </body>
    </html>
  )
}

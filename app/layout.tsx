import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { EvidenceStoreProvider } from "@/lib/evidence-store"
import { CEOConsoleStoreProvider } from "@/lib/ceo-console-store"

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
  title: "CEO AI Accountability Console",
  description:
    "Powered by the DDAT Evidence Standard. An executive governance console for mapping how AI-enabled decision systems evaluate, rank, predict, classify, exclude, allow appeal, allow re-entry, and distribute responsibility. Audit the institution, not the person.",
  openGraph: {
    title: "CEO AI Accountability Console",
    description:
      "Powered by the DDAT Evidence Standard. Audit the institution, not the person. We do not measure private belief — we audit institutionalized commitments.",
    siteName: "CEO AI Accountability Console",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CEO AI Accountability Console",
    description:
      "Powered by the DDAT Evidence Standard. A preliminary executive governance tool for mapping accountability risk in AI-enabled decision systems.",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>
        <EvidenceStoreProvider>
          <CEOConsoleStoreProvider>{children}</CEOConsoleStoreProvider>
        </EvidenceStoreProvider>
      </body>
    </html>
  )
}

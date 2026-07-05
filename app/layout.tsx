import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { EvidenceStoreProvider } from "@/lib/evidence-store"

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
  title: "DDAT Evidence Simulator",
  description:
    "A research prototype for auditing AI-scored decision systems. DDAT audits institutions, not persons.",
  openGraph: {
    title: "DDAT Evidence Simulator",
    description:
      "A research prototype for auditing AI-scored decision systems. DDAT audits institutions, not persons.",
    siteName: "DDAT Evidence Simulator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dialectical Direction Audit Theory",
    description:
      "A research prototype for auditing whether AI scoring systems, institutional evaluation systems, and decision architectures expand or close future possibilities.",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>
        <EvidenceStoreProvider>{children}</EvidenceStoreProvider>
      </body>
    </html>
  )
}

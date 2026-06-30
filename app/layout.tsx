import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { StoreProvider } from "@/lib/store"

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
  title: "Dialectical Direction Audit Theory",
  description:
    "A research prototype for auditing whether AI scoring systems, institutional evaluation systems, and decision architectures expand or close future possibilities.",
  openGraph: {
    title: "Dialectical Direction Audit Theory",
    description:
      "A research prototype for auditing whether AI scoring systems, institutional evaluation systems, and decision architectures expand or close future possibilities.",
    siteName: "DDAT Studio",
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
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}

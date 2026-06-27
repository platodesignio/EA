import type { Metadata } from "next"
import "./globals.css"
import { StoreProvider } from "@/lib/store"

export const metadata: Metadata = {
  title: "DDAT Studio",
  description: "Dialectical Direction Audit Theory — institutional audit simulator",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}

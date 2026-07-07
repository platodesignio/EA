"use client"

import { useEffect } from "react"

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Dev mode only: a service worker caching dev bundles fights Fast
    // Refresh/HMR and can cause reload loops. Registration only makes sense
    // against a real production build anyway.
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Non-fatal — the app works fine without offline caching.
      })
    }
  }, [])

  return null
}

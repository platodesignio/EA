// Minimal app-shell service worker. This app has no backend and no
// server-rendered data, so a simple cache-first strategy is safe: nothing
// here can go stale in a way that matters, and it's what makes the console
// installable and usable with a flaky or absent connection.
const CACHE_NAME = "ceo-console-shell-v1"
const SHELL_URLS = ["/", "/contact", "/manifest.json", "/icon-192.png", "/icon-512.png"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS)).catch(() => {})
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
          }
          return response
        })
        .catch(() => cached)
      return cached || network
    })
  )
})

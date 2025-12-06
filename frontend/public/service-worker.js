// frontend/public/service-worker.js

const CACHE_NAME = 'medicalkit-static-v1'

const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

// INSTALACIÓN: precache básico (app shell)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  )
})

// ACTIVACIÓN: limpiar caches viejos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  )
})

// FETCH: cache-first para estáticos + fallback para navegación
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  // Navegación: si no hay red, devolver index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    )
    return
  }

  // Otros GET: cache first, luego red
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached

      return fetch(event.request).then((response) => {
        const copy = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, copy)
        })
        return response
      })
    })
  )
})

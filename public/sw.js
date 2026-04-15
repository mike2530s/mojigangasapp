/**
 * 🔄 Service Worker — PWA Offline & Cache Management
 * 
 * Cachea:
 * - Archivos estáticos (HTML, CSS, JS)
 * - Imágenes de mojigangas
 * - Respuestas de API (con invalidación)
 */

const CACHE_VERSION = "mojigangas-v1";
const RUNTIME_CACHE = "mojigangas-runtime-v1";

const STATIC_ASSETS = [
  "/",
  "/home",
  "/manifest.json",
  "/offline.html",
];

/* ────────────────────────────────────────── */
/* INSTALL — Cachea assets estáticos         */
/* ────────────────────────────────────────── */
self.addEventListener("install", (event) => {
  console.log("[SW] Installing Service Worker...");
  
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      console.log("[SW] Caching static assets");
      return cache.addAll(STATIC_ASSETS);
    }).catch((err) => {
      console.warn("[SW] Static cache failed (offline app install):", err);
    })
  );
  
  self.skipWaiting();
});

/* ────────────────────────────────────────── */
/* ACTIVATE — Limpia cachés viejos            */
/* ────────────────────────────────────────── */
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating Service Worker");
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_VERSION && name !== RUNTIME_CACHE) {
            console.log(`[SW] Deleting old cache: ${name}`);
            return caches.delete(name);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

/* ────────────────────────────────────────── */
/* FETCH — Network first, fallback to cache   */
/* ────────────────────────────────────────── */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* No cachear navegación HTML (siempre pedir al servidor) */
  if (request.destination === "document") {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match("/offline.html") || new Response("Offline"))
    );
    return;
  }

  /* Cachear imágenes, JS, CSS */
  if (
    request.destination === "image" ||
    request.destination === "script" ||
    request.destination === "style"
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request).then((response) => {
            /* Cachear respuesta exitosa */
            if (response.status === 200) {
              const cache = caches.open(CACHE_VERSION);
              cache.then((c) => c.put(request, response.clone()));
            }
            return response;
          }).catch(() => {
            /* Fallback para imágenes no cacheadas */
            if (request.destination === "image") {
              return new Response("Image not available", { status: 404 });
            }
            throw new Error("Network request failed");
          })
        );
      })
    );
    return;
  }

  /* API calls (Supabase) — Network first con fallback */
  if (url.hostname.includes("supabase")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          /* Cachear respuestas exitosas de API */
          if (response.status === 200 && request.method === "GET") {
            const cache = caches.open(RUNTIME_CACHE);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          /* Retornar último valor cacheado si está offline */
          return caches.match(request).then((cached) => {
            if (cached) {
              console.log("[SW] Serving cached API response");
              return cached;
            }
            return new Response(
              JSON.stringify({ error: "Offline, no cached data" }),
              { status: 503, headers: { "Content-Type": "application/json" } }
            );
          });
        })
    );
    return;
  }

  /* Default: Network first */
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});

/* ────────────────────────────────────────── */
/* MESSAGE — Actualizar caché desde cliente   */
/* ────────────────────────────────────────── */
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === "CLEAR_CACHE") {
    caches.delete(RUNTIME_CACHE).then(() => {
      console.log("[SW] Runtime cache cleared");
      event.ports[0].postMessage({ cleared: true });
    });
  }
});

console.log("[SW] Service Worker loaded");

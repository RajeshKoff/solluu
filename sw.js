const CACHE_NAME = "solluu-cache-v2";

// Pre-cache only core pages and icons
const CORE_ASSETS = [
  "/solluu/",
  "/solluu/index.html",
  "/solluu/home.html",
  "/solluu/game.html",
  "/solluu/game3.html",
  "/solluu/game4.html",
  "/solluu/game5.html",
  "/solluu/call.html",
  "/solluu/call1.html",
  "/solluu/vc.html",
  "/solluu/td.html",
  "/solluu/icon.png",      // your icon
  "/solluu/photo.png",     // fallback image
  "/solluu/online.png"     // optional
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CORE_ASSETS);
    })
  );
});

// Serve from cache → if not found, fetch & cache dynamically
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // Optional: fallback for offline
        if (event.request.destination === "document") {
          return caches.match("/solluu/index.html");
        }
        if (event.request.destination === "image") {
          return caches.match("/solluu/photo.png"); // fallback image
        }
      });
    })
  );
});

// Clear old cache versions when updating SW
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

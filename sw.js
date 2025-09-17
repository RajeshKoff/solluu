const CACHE_NAME = "solluu-cache-v1";

// Pre-cache only the core files
const CORE_ASSETS = [
  "/solluu/",
  "/solluu/index.html",
  "/solluu/home.html",
  "/solluu/gam1.html",
  "/solluu/game2.html",
  "/solluu/game3.html",
  "/solluu/game4.html",
  "/solluu/call.html",
  "/solluu/vc.html",
  "/solluu/icon-192.png", // app icon
  "/solluu/icon-512.png"  // app icon
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CORE_ASSETS);
    })
  );
});

// Fetch handler: serve from cache, then network, then cache new stuff
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse; // return cached version
      }

      // Fetch from network and cache it for later
      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          // Cache only if request is GET (not POST)
          if (event.request.method === "GET") {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      }).catch(() => {
        // Optional: return a fallback (like offline.html) if network fails
      });
    })
  );
});

// Clear old caches when you update service worker
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

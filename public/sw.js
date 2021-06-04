const CACHE_STATIC_NAME = "static-v10";
const CACHE_DYNAMIC_NAME = "dynamic-v2";

self.addEventListener("install", (event) => {
  console.log("[Service worker] Installing ...", event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then((cache) => {
      console.log("[service worker] precaching app shell");
      cache.addAll([
        "/",
        "/index.html",
        "/offline.html",
        "/src/js/app.js",
        "/src/js/feed.js",
        "/src/js/promise.js",
        "/src/js/fetch.js",
        "/src/js/material.min.js",
        "/src/css/app.css",
        "/src/css/feed.css",
        "/src/images/main-image.jpg",
        "https://fonts.googleapis.com/css?family=Roboto:400,700",
        "https://fonts.googleapis.com/icon?family=Material+Icons",
        "https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css",
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("[Service worker] Activating ...", event);

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log("[Service Worker] Removing old cache. ", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      } else {
        return fetch(event.request)
          .then((res) => {
            return caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
              cache.put(event.request.url, res.clone());
              return res;
            });
          })
          .catch((error) => {
            return caches.open(CACHE_STATIC_NAME).then((cache) => {
              return cache.match("/offline.html");
            });
          });
      }
    })
  );
});

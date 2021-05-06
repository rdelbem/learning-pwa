self.addEventListener("install", (event) => {
  console.log("[Service worker] Installing ...", event);
  event.waitUntil(
    caches.open("static").then((cache) => {
      console.log("[service worker] precaching app shell");
      cache.add("/src/js/app.js");
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("[Service worker] Activating ...", event);
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      } else {
        return fetch(event.request);
      }
    })
  );
});

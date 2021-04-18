self.addEventListener("install", (event) => {
  console.log("[Service worker] Installing ...", event);
});

self.addEventListener("activate", (event) => {
  console.log("[Service worker] Activating ...", event);
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  console.log("[Service worker] Fetching ...", event);
  event.respondWith(fetch(event.request));
});

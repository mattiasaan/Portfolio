const CACHE_NAME = "Portfolio-cache-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./indexIT.html",
  "./manifest.json",
  "./projects.json",
  "./projectsIta.json",
  "./skills.json",
  "./skillsIta.json",
  "./script.js",
  "./scriptIta.js",
  "./style.css",
  "./sw.js",
  "./files/CV Santomaso.pdf",
  "./images/bz map.png",
  "./images/favicon.png",
  "./images/icon-192.png",
  "./images/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});


self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim();
});


self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedRes) => {
      return cachedRes || fetch(event.request);
    })
  );
});

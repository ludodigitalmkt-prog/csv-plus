const CACHE_NAME = 'csv-plus-v1';
const urlsToCache = [
  './index.html',
  './manifest.json',
  './logo.png'
];

// Instala o motor offline e guarda os arquivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Se estiver sem internet, ele busca do Cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request);
      })
  );
});

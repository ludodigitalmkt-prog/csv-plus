const CACHE_NAME = 'csv-plus-auto-update-v3';

self.addEventListener('install', event => {
  self.skipWaiting(); // Força o motor novo a assumir na hora
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Deleta qualquer lixo velho
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// ESTRATÉGIA NETWORK-FIRST (Rede Primeiro, Cache como Plano B)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).then(networkResponse => {
      // Se tem internet, salva uma cópia da nova versão e mostra pro usuário
      return caches.open(CACHE_NAME).then(cache => {
        cache.put(event.request, networkResponse.clone());
        return networkResponse;
      });
    }).catch(() => {
      // Se caiu a internet, pega a versão salva
      return caches.match(event.request);
    })
  );
});

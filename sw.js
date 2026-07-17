// Service Worker — Ótica Horizonte
// Estratégia: Network First sem popup de atualização

const CACHE_NAME = 'otica-horizonte-v2';

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(n) { return n !== CACHE_NAME; })
             .map(function(n) { return caches.delete(n); })
      );
    })
  );
  self.clients.claim();
});

// Network First: tenta rede, fallback para cache
self.addEventListener('fetch', function(event) {
  // Ignorar requests nao-GET e Firebase
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('firestore') || event.request.url.includes('firebase')) return;

  event.respondWith(
    fetch(event.request).then(function(response) {
      // Cachear apenas respostas validas de arquivos locais
      if (response && response.status === 200 && response.type === 'basic') {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, clone);
        });
      }
      return response;
    }).catch(function() {
      // Offline: usar cache
      return caches.match(event.request);
    })
  );
});

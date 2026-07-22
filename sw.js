// Service Worker — Ótica Horizonte v184
// Estratégia: Network First sem cache (sempre busca versão mais recente)

const CACHE_NAME = 'otica-horizonte-v184';

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  // Deletar TODOS os caches antigos
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(names.map(function(n) { return caches.delete(n); }));
    })
  );
  self.clients.claim();
});

// Network First: sempre busca da rede, sem cache
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('firestore') || event.request.url.includes('firebase')) return;
  if (event.request.url.includes('cloudinary')) return;

  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});

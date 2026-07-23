// Service Worker v201 - LIMPA TODOS OS CACHES
const CACHE_NAME = 'otica-v201';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
    .then(() => self.clients.claim())
    .then(() => self.clients.matchAll().then(clients => 
      clients.forEach(c => c.postMessage({type:'CACHE_CLEARED'}))
    ))
  );
});
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request.url + (e.request.url.includes('?') ? '&' : '?') + '_sw=201')
    .catch(() => fetch(e.request)));
});

// Ancien emplacement de l'appli : ce service worker se désinstalle et nettoie son cache.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) {
    return Promise.all(k.filter(function (n) { return n.indexOf('menus-v') === 0; }).map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.registration.unregister(); }));
});

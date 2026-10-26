// Change ce numéro à chaque mise à jour pour forcer le rafraîchissement du cache.
var CACHE = 'menus-app-v2';
var FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'favicon.png', 'engine.js'];
// Bibliothèque Firebase (Google), gardée en cache pour que l'appli démarre sans réseau.
var CDN = [
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      var cdn = CDN.map(function (u) {
        return fetch(u, { mode: 'cors' }).then(function (r) { if (r.ok) return c.put(u, r); }).catch(function () {});
      });
      return Promise.all([c.addAll(FILES)].concat(cdn));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  // Firebase : le cache d'abord (fichiers figés par version), sinon le réseau.
  if (CDN.indexOf(req.url) > -1) {
    e.respondWith(caches.match(req.url).then(function (r) {
      return r || fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req.url, copy); });
        return res;
      });
    }));
    return;
  }
  if (new URL(req.url).origin !== location.origin) return;
  // Notre application : le réseau d'abord (dernière version), le cache en secours hors ligne.
  e.respondWith(
    fetch(req).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(req, copy); });
      return res;
    }).catch(function () {
      return caches.match(req).then(function (r) { return r || caches.match('index.html'); });
    })
  );
});

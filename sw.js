const CACHE_NAME = 'ambulance-prf-v3';
const urlsToCache = [
  './',
  './index.html',
  './pages/landing.html',
  './pages/dashboard.html',
  './pages/prf-form.html',
  './pages/checklist.html',
  './pages/trip-log.html',
  './pages/ambulance-directory.html',
  './pages/settings.html',
  './assets/css/style.css?v=2',
  './assets/js/alpine-stores.js?v=1',
  './assets/js/alpine-components.js?v=1',
  './assets/js/tools.js?v=2',
  './assets/js/navigation.js?v=2',
  './assets/js/version.js?v=2',
  './assets/js/dev-cache-clear.js',
  './assets/images/front.jpg',
  './assets/images/back.jpg',
  './assets/images/icon-192.svg',
  './assets/images/icon-512.svg',
  './assets/images/apple-touch-icon.svg',
  './assets/images/favicon.svg',
  './manifest.json'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 
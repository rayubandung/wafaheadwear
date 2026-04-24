const CACHE_NAME = 'cashflow-pwa-v1';

// Daftar file dan aset CDN yang akan disimpan untuk mode offline
const urlsToCache = [
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Install Service Worker dan simpan cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Gunakan strategi Cache-First (ambil dari cache dulu, jika gagal baru ke jaringan)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache ditemukan, kembalikan response dari cache
        if (response) {
          return response;
        }
        // Cache tidak ada, ambil dari jaringan internet
        return fetch(event.request);
      })
  );
});

// Update cache jika ada versi baru
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

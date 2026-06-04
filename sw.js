const CACHE_NAME = 'pro-audio-recorder-v3'; // Incremented version to force an overwrite

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json'
];

// 1. Install Event - Cache the application shell assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Locking in core files for offline stability...');
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

// 2. Activate Event - Clear out old v1/v2 caches to prevent conflicts
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Purging legacy cache container:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => clients.claim())
    );
});

// 3. Fetch Event - Smart Routing Strategy
self.addEventListener('fetch', (event) => {
    // CRITICAL FIX: Skip intercepting local IndexedDB database calls.
    // IndexedDB has its own native offline system; if the service worker tries to cache it, it breaks.
    if (event.request.url.includes('indexeddb') || event.request.scheme === 'indexeddb') {
        return; 
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Serve from cache instantly if offline, otherwise fetch via network
            return cachedResponse || fetch(event.request).catch(() => {
                // Fallback graceful handling if completely disconnected
                return caches.match('./index.html');
            });
        })
    );
});

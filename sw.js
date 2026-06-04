const CACHE_NAME = 'pro-audio-recorder-v2';

// List of all local files your app needs to run
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json'
];

// 1. Install Event: Download and cache all the assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching app assets for offline use...');
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

// 2. Activate Event: Clean up old caches if you update the app version
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => clients.claim())
    );
});

// 3. Fetch Event: Serve files from the cache if offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Return the cached file if found, otherwise try the network
            return cachedResponse || fetch(event.request);
        }).catch(() => {
            // Optional fallback if both fail (e.g., browsing to an uncached page)
            console.log('Resource not found in cache or network');
        })
    );
});

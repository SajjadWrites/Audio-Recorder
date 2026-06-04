const CACHE_NAME = 'audio-recorder-v1';

// Install event - happens once when the app is first loaded
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Fetch event - required for PWA installation criteria
self.addEventListener('fetch', (event) => {
    // Just pass through requests to the network for this simple app
    event.respondWith(fetch(event.request));
});

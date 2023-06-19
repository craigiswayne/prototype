/**
 * see here: https://developers.google.com/web/fundamentals/primers/service-workers/
 * @type {string}
 */

var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    '/',
    '/assets/css/style.css',
    '/assets/js/build.js'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                }
            )
    );
});
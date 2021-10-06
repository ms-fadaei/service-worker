const NETWORK_TIMEOUT = 100;
const CACHE_VERSION = 1;
const CASH_NAME = `page-assets-${CACHE_VERSION}`;
const ASSETS_LIST = [
    "./",
    "./index.js",
    "../assets/style/style.css",
];

self.addEventListener("install", function (event) {
    event.waitUntil(precache());
    event.waitUntil(self.skipWaiting());
});

self.addEventListener("fetch", function (event) {
    console.log("Request to:", event.request.url);

    event.respondWith(
        fetch(event.request)
            .catch(() => fromCache(event.request))
            .catch(() => sendFallback())
    );
})

function precache() {
    return caches.open(CASH_NAME)
        .then(res => res.addAll(ASSETS_LIST))
        .catch(err => console.error("An error occurred on precaching!", err));
}

function fromCache(request) {
    return caches.open(CASH_NAME)
        .then(function (cache) {
            return cache.match(request)
                .then(function (response) {
                    if (!response) return Promise.reject("no-cache");

                    console.log(`Response for the "${request.url}" served from cache!`);
                    return response;
                });
        })
}

var FALLBACK =
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="180" stroke-linejoin="round">' +
    '  <path stroke="#DDD" stroke-width="25" d="M99,18 15,162H183z"/>' +
    '  <path stroke-width="17" fill="#FFF" d="M99,18 15,162H183z" stroke="#eee"/>' +
    '  <path d="M91,70a9,9 0 0,1 18,0l-5,50a4,4 0 0,1-8,0z" fill="#aaa"/>' +
    '  <circle cy="138" r="9" cx="100" fill="#aaa"/>' +
    '</svg>';

function sendFallback() {
    return Promise.resolve(new Response(FALLBACK, { headers: {
        'Content-Type': 'image/svg+xml'
    }}));
}
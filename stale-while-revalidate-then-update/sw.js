const NETWORK_TIMEOUT = 100;
const CACHE_VERSION = 1;
const CASH_NAME = `swr-then-update-${CACHE_VERSION}`;
const IMAGE_REPO_LIST = [
    "../assets/images/img-1.jpeg",
];

self.addEventListener("install", function (event) {
    event.waitUntil(precache());
    event.waitUntil(self.skipWaiting());
});

self.addEventListener("fetch", function (event) {
    console.log("Request to:", event.request.url);

    event.respondWith(fromCache(event.request).catch(() => fetch(event.request)));
    event.waitUntil(stealWhileRevalidate(event.request).then(refresh));
})

function precache() {
    return caches.open(CASH_NAME)
        .then(res => res.addAll(IMAGE_REPO_LIST))
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

let i = 1;

function stealWhileRevalidate(request) {
    if (request.url.includes("/assets/images/img-")) {
        var url = `../assets/images/img-${i++ % 5 + 1}.jpeg`;
    } else {
        return Promise.resolve();
    }

    return fetch(url)
        .then(function (response) {
            return caches.open(CASH_NAME)
                .then(cache => {
                    console.log("Cache revalidated", request.url);
                    return cache.put(request, response.clone());
                }).then(() => response);
                
        });
}

function refresh(response) {
    if (!response) return;

    return clients.matchAll()
        .then(function (allClients) {
            allClients.forEach(function (client) {
                const message = {
                    type: "update",
                    url: response.url,
                    eTag: response.headers?.get('ETag'),
                }

                client.postMessage(JSON.stringify(message));
            });
        });
}
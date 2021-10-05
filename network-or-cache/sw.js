const NETWORK_TIMEOUT = 100;
const CACHE_VERSION = 1;
const CASH_NAME = `image-repo-${CACHE_VERSION}`;
const IMAGE_REPO_LIST = [
    "../assets/images/img-1.jpeg",
    "../assets/images/img-2.jpeg",
    "../assets/images/img-3.jpeg",
    "../assets/images/img-4.jpeg",
    "../assets/images/img-5.jpeg",
];

self.addEventListener("install", function (event) {
    event.waitUntil(precache());
    event.waitUntil(self.skipWaiting());
});

self.addEventListener("fetch", function (event) {
    console.log("Request to:", event.request.url);

    event.respondWith(
        fromNetworkWithTimeout(event.request, NETWORK_TIMEOUT)
        .catch(() => fromCache(event.request))
        .catch(() => fromNetwork(event.request))
    );
})

function precache() {
    return caches.open(CASH_NAME)
        .then(res => res.addAll(IMAGE_REPO_LIST))
        .catch(err => console.error("An error occurred on precaching!", err));
}

function fromNetworkWithTimeout(request, timeout) {
    return new Promise((resolve, reject) => {
        const controller = new AbortController();
        const signal = controller.signal;

        const timeoutId = setTimeout(function () {
            controller.abort();
            return reject("time-out");
        }, timeout);

        fetch(request, {
                signal
            })
            .then(function (response) {
                clearTimeout(timeoutId);

                console.log(`Response for the "${request.url}" served from network-first under ${timeout}ms!`);
                resolve(response);
            })
            .catch(reject);
    });
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

function fromNetwork(request) {
    console.log(`Response for the "${request.url}" served from network-last!`);

    return fetch(request);
}
self.addEventListener("install", function(event) {
    event.waitUntil(self.skipWaiting());
})

self.addEventListener("push", function(event) {
    const data = event.data?.text() || "no-data";

    console.log()

    event.waitUntil(
        self.registration.showNotification("New Push Event", {
            lang: "EN",
            body: data,
            vibrate: [500, 100, 500],
            icon: "../assets/images/img-3.jpeg",
        })
    )
})
self.addEventListener("install", function(event) {
    event.waitUntil(self.skipWaiting());
})

let i = 1;
self.addEventListener("push", function(event) {
    const data = event.data?.text() || "no-data";

    event.waitUntil(
        self.clients.matchAll().then(function (clientList) {
            const focusedTab = clientList.some((client) => client.focused);

            if (focusedTab) {
                var notificationMessage = 'You\'re still here, thanks!';
            } else if (clientList.length > 0) {
                var notificationMessage = 'You haven\'t closed the page\nclick here to focus it!';
            } else {
                var notificationMessage = 'You have closed the page\nclick here to re-open it!';
            }

            self.registration.showNotification("Push Clients", {
                body: notificationMessage,
            })
        })
    )
});

self.addEventListener("notificationclick", function (event) {
    event.waitUntil(
        self.clients.matchAll().then(function (clientList) {
            if (clientList.length) {
                return clientList[0].focus();
            } else {
                return self.clients.openWindow("./")
            }
        })
    )
});
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./sw.js")
      .then((res) => console.log("Service worker has been registered!", res))
      .catch((err) => console.error("An error occurred on registering the service worker", err));
  })
}
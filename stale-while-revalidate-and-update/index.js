const CACHE_VERSION = 1;
const CASH_NAME = `swr-the-update-${CACHE_VERSION}`;

if ("serviceWorker" in navigator) {
  const notice = document.getElementById("update-notice");
  const noticeButton = document.getElementById("update");

  navigator.serviceWorker.addEventListener("message", function (data) {
    const message = JSON.parse(data.data);

    console.log(message);

    const isUpdate = message.type === "update";
    const isImage = message.url?.includes("/assets/images/img-");
    const lastETage = localStorage.getItem("img-etag");
    const isNew = lastETage !== message.eTag;

    if (isUpdate && isImage && isNew) {

      if (lastETage) {
        notice.hidden = false;
      }

      localStorage.setItem("img-etag", message.eTag);
    }
  });

  noticeButton.addEventListener("click", function () {
    const img = document.querySelector("img");

    caches.open(CASH_NAME)
      .then((cache) => cache.match(img.src))
      .then((res) => res.blob())
      .then(blob => {
        var url = URL.createObjectURL(blob);
        img.src = url;
        notice.hidden = true;
      })
  });

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./sw.js")
      .then((res) => console.log("Service worker has been registered!", res))
      .catch((err) => console.error("An error occurred on registering the service worker", err));
  })
}
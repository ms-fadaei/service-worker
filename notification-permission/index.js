if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js")
        .then((res) => {
          console.log("Service worker has been registered!", res);

          if (!("Notification" in window)) {
            console.log("Your browser doesn't support notification!");
          } else if (Notification.permission === "granted") {
            console.log("You granted notification's permission already")
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
              if (permission === "granted") {
                new Notification("Hi there!");
              }
            });
          }
        })
        .catch((err) => console.error("An error occurred on registering the service worker", err));
    })
  }
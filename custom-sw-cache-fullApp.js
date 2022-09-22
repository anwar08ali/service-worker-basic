let cacheName = "v1";

//call install event
self.addEventListener("install", (e) => {
  console.log("SW installed");
});
//call activate event
self.addEventListener("activate", (e) => {
  console.log("SW activated");
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log("SW: Clearing old cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// call fetch event
self.addEventListener("fetch", (e) => {
  console.log("SW: Fetching...");
  e.respondWith(
    caches.match(e.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // IMPORTANT: Clone the request. A request is a stream and
      // can only be consumed once. Since we are consuming this
      // once by cache and once by the browser for fetch, we need
      // to clone the response
      var fetchRequest = e.request.clone();

      return fetch(fetchRequest).then(function (response) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // IMPORTANT: Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have 2 stream.
        var responseToCache = response.clone();

        caches.open(cacheName).then(function (cache) {
          cache.put(e.request, responseToCache);
        });

        return response;
      });
    })
    // fetch(e.request)
    //   .then((res) => {
    //     //Make copy/clone of resp obj
    //     const resClone = res.clone();
    //     //Open cache
    //     caches.open(cacheName).then((cache) => {
    //       cache.put(e.request, resClone);
    //       return res;
    //     });
    //   })
    //   .catch((err) => caches.match(e.request).then((res) => res))
  );
});

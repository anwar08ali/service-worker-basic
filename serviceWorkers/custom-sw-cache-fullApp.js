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
    fetch(e.request)
      .then((res) => {
        //Make copy/clone of resp obj
        const resClone = res.clone();
        //Open cache
        caches.open(cacheName).then((cache) => {
          cache.put(e.request, resClone);
          return res;
        });
      })
      .catch((err) => caches.match(e.request).then((res) => res))
  );
});

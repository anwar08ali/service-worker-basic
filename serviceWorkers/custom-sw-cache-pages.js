let cacheName = "v1";
//caching specific files
let cacheAssets = [
  "../home.js",
  "../index.js",
  "../index.html",
  "../index.css",
  "../about.js",
];
//call install event
self.addEventListener("install", (e) => {
  console.log("SW installed");
  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log("SW: caching files...");
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
  //   self.skipWaiting(); // always activate updated SW immediately
});
//call activate event
// self.addEventListener("activate", function (event) {
//   console.log("Claiming control");
//   return self.clients.claim();
// });
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

// self.addEventListener("fetch", (e) => {
//   console.log("SW: Fetching...");
//   e.respondWith(
//     fetch(e.request)
//       .then((res) => {
//         //Make copy/clone of resp obj
//         const resClone = res.clone();
//         //Open cache
//         caches.open(cacheName).then((cache) => {
//           cache.put(e.request, resClone);
//           return res;
//         });
//       })
//       .catch((err) => caches.match(e.request).then((res) => res))
//   );
// });

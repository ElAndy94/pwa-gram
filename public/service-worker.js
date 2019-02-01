importScripts('workbox-sw.prod.v2.1.3.js');
importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');

const workboxSW = new self.WorkboxSW();

workboxSW.router.registerRoute(/.*(?:googleapis|gstatic)\.com.*$/, workboxSW.strategies.staleWhileRevalidate({
  cacheName: 'google-fonts',
  chacheExpiration: {
    maxEntries: 3,
    maxAgeSeconds: 60 * 60 * 24 * 30
  }
}));

workboxSW.router.registerRoute('https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css', workboxSW.strategies.staleWhileRevalidate({
  cacheName: 'material-css'
}));

workboxSW.router.registerRoute(/.*(?:firebasestorage\.googleapis)\.com.*$/, workboxSW.strategies.staleWhileRevalidate({
  cacheName: 'post-images'
}));

workboxSW.router.registerRoute('https://pwagram-684eb.firebaseio.com/posts.json', (args) => {
  return fetch(args.event.request)
    .then((res) => {
      let clonedRes = res.clone();
      clearAllData('posts')
        .then(() => {
          return clonedRes.json();
        })
          .then((data) => {
            for (let key in data) {
              writeData('posts', data[key]);
            }
          });
      return res;
    });
});

workboxSW.router.registerRoute((routeData) => {
  return (routeData.event.request.headers.get('accept').includes('text/html'))
}, (args) => {
  return caches.match(args.event.request)
    .then((res) => {
      if (res) {
        return res;
      } else {
        return fetch(args.event.request)
          .then((res) => {
            return caches.open('dynamic')
              .then((cache) => {
                cache.put(args.event.request.url, res.clone());
                return res;
              })
          })
          .catch((err) => {
            return caches.match('/offline.html')
              .then((res) => {
                return res
              });
          });
      }
    })
}); 

workboxSW.precache([
  {
    "url": "favicon.ico",
    "revision": "2cab47d9e04d664d93c8d91aec59e812"
  },
  {
    "url": "index.html",
    "revision": "797cbbf8f546a0338b9a2e7098dd9e38"
  },
  {
    "url": "manifest.json",
    "revision": "7455a9e20199ab8d81118cdc4f5ec10f"
  },
  {
    "url": "offline.html",
    "revision": "e14a09c00eec2ffbfd74cb53547255c1"
  },
  {
    "url": "src/css/app.css",
    "revision": "f27b4d5a6a99f7b6ed6d06f6583b73fa"
  },
  {
    "url": "src/css/feed.css",
    "revision": "4b3b54637169707cc1e1980ea58de20e"
  },
  {
    "url": "src/css/help.css",
    "revision": "1c6d81b27c9d423bece9869b07a7bd73"
  },
  {
    "url": "src/images/main-image-lg.jpg",
    "revision": "31b19bffae4ea13ca0f2178ddb639403"
  },
  {
    "url": "src/images/main-image-sm.jpg",
    "revision": "c6bb733c2f39c60e3c139f814d2d14bb"
  },
  {
    "url": "src/images/main-image.jpg",
    "revision": "5c66d091b0dc200e8e89e56c589821fb"
  },
  {
    "url": "src/js/material.min.js",
    "revision": "713af0c6ce93dbbce2f00bf0a98d0541"
  }
]);

self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background syncing', event);
  if (event.tag === 'sync-new-posts') {
    console.log('Service Worker] Syncing new Posts');
    event.waitUntil(
      readAllData('sync-posts')
        .then((data) => {
          for (var dt of data) {
            let postData = new FormData();
            postData.append('id', dt.id);
            postData.append('title', dt.title);
            postData.append('location', dt.location);
            postData.append('rawLocationLat', dt.rawLocation.lat);
            postData.append('rawLocationLng', dt.rawLocation.lng);
            postData.append('file', dt.picture, dt.id + '.png');

            fetch('https://us-central1-pwagram-684eb.cloudfunctions.net/storePostData', {
              method: 'POST',
              body: postData
            })
            .then((res) => {
              console.log('Sent data', res);
              if (res.ok) {
                res.json()
                  .then((resData) => {
                    deleteItemFromData('sync-posts', resData.id);
                  })
              }
            })
            .catch((err) => {
              console.log('Error while sending data', err);
            })
          }
        })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  let notification = event.notification;
  let action = event.action;

  console.log(notification);

  if (action === 'confirm') {
    console.log('Confirm was chosen');
    notification.close();
  } else {
    console.log(action);
    event.waitUntil(
      clients.matchAll()
        .then((clis) => {
          let client = clis.find((c) => {
            return c.visibilityState === 'visiable';
          });

          if (client !== undefined) {
            client.navigate(notification.data.openUrl);
            client.focus();
          } else {
            clients.openWindow(notification.data.openUrl);
          }
          notification.close();
        })
    );
  }
});

self.addEventListener('notificationclose', (event) => {
  console.log('Notification was closed', event);
});

self.addEventListener('push', (event) => {
  console.log('Push Notification received', event);

  let data = {title: 'New!', content: 'Something new happend!', openUrl: '/'};
  if (event.data) {
    data = JSON.parse(event.data.text());
  }

  let options = {
    body: data.content,
    icon: '/src/images/icons/app-icon-96x96.png',
    badge: '/src/images/icons/app-icon-96x96.png',
    data: {
      url: data.openUrl
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
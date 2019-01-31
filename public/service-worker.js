importScripts('workbox-sw.prod.v2.1.3.js');


const workboxSW = new self.WorkboxSW();


workboxSW.precache([
  {
    "url": "404.html",
    "revision": "0a27a4163254fc8fce870c8cc3a3f94f"
  },
  {
    "url": "favicon.ico",
    "revision": "2cab47d9e04d664d93c8d91aec59e812"
  },
  {
    "url": "index.html",
    "revision": "1c6123d073a97d16d7aafaa90b957ec3"
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
    "url": "src/js/app.js",
    "revision": "931381d6b09a5ef3c2c9f900468bf015"
  },
  {
    "url": "src/js/feed.js",
    "revision": "e809c1c0fdaa9465e50077c68ca7f793"
  },
  {
    "url": "src/js/feedV2.js",
    "revision": "c64e3da82ba76c8bb2b735083408f6c6"
  },
  {
    "url": "src/js/fetch.js",
    "revision": "6b82fbb55ae19be4935964ae8c338e92"
  },
  {
    "url": "src/js/idb.js",
    "revision": "017ced36d82bea1e08b08393361e354d"
  },
  {
    "url": "src/js/material.min.js",
    "revision": "713af0c6ce93dbbce2f00bf0a98d0541"
  },
  {
    "url": "src/js/promise.js",
    "revision": "10c2238dcd105eb23f703ee53067417f"
  },
  {
    "url": "src/js/utility.js",
    "revision": "9dc34f8709cf5265e262f48d4d8d14c3"
  },
  {
    "url": "sw-base.js",
    "revision": "6b4dac3581e91a641653bfd72ffd04a1"
  },
  {
    "url": "sw.js",
    "revision": "d7c95118b07e421c999a086f904ee804"
  },
  {
    "url": "workbox-sw.prod.v2.1.3.js",
    "revision": "a9890beda9e5f17e4c68f42324217941"
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
  }
]);
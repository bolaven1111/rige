/* 日格 PWA Service Worker
 * 部署新版本时：改 CACHE_NAME 里的版本号（例如 v13-1），再发布。
 * 不要给 sw.js 设置长缓存；建议 Cache-Control: no-cache。
 */
const CACHE_NAME = "rige-pwa-v1-9-4";
const APP_SHELL = [
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-180.png",
  "./icons/icon-180-pink.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/favicon-32.png",
  "./icons/favicon-32-pink.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key.startsWith("rige-pwa-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // 页面导航走缓存优先：有缓存立即展示（秒开），同时后台拉取最新版更新缓存。
  // 首次打开或缓存被清理时回退到网络。
  if (request.mode === "navigate") {
    event.respondWith(
      caches.match("./index.html").then(function (cached) {
        var net = fetch(request).then(function (response) {
          if (response && response.ok) {
            var copy = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put("./index.html", copy);
            });
          }
          return response;
        }).catch(function () { return null; });
        return cached || net.then(function (r) {
          return r || caches.match("./index.html");
        });
      })
    );
    return;
  }

  // 图标、manifest 等静态资源走缓存优先。
  event.respondWith(
    caches.match(request).then((hit) => {
      if (hit) return hit;
      return fetch(request).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});

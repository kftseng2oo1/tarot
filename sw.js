// 塔羅秘境 · Service Worker
// 版本號：每次更新 HTML 時請遞增，讓快取自動刷新
const CACHE_VERSION = 'arcana-v2.1';

const STATIC_ASSETS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// ── 安裝：預快取靜態資源 ────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      // 逐一嘗試，避免單一失敗中斷整個安裝
      return Promise.allSettled(
        STATIC_ASSETS.map(url =>
          cache.add(url).catch(e => console.warn('Cache miss:', url, e))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// ── 啟動：清除舊版快取 ──────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_VERSION)
          .map(key => {
            console.log('SW: 清除舊快取', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── 攔截請求：Cache First + Network Fallback ───
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API 請求（Cloudflare Worker / Anthropic）永遠走網路，不快取
  if (
    url.hostname.includes('workers.dev') ||
    url.hostname.includes('anthropic.com') ||
    event.request.method !== 'GET'
  ) {
    return; // 讓瀏覽器直接處理
  }

  // Google Fonts 走 Stale-While-Revalidate（有快取先用，背景更新）
  if (url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  // 靜態資源：Cache First（有快取就用，沒有才抓網路）
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // 成功才存快取
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // 完全離線時，回傳主頁面（讓 App 至少能開）
        return caches.match('./index.html');
      });
    })
  );
});

// ── Stale-While-Revalidate 策略 ─────────────────
function staleWhileRevalidate(request) {
  return caches.open(CACHE_VERSION).then(cache =>
    cache.match(request).then(cached => {
      const fetchPromise = fetch(request).then(response => {
        if (response && response.status === 200) {
          cache.put(request, response.clone());
        }
        return response;
      });
      return cached || fetchPromise;
    })
  );
}

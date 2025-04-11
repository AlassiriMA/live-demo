// Service Worker for Portfolio Website
// This service worker enables offline capabilities and faster loading through caching

const CACHE_NAME = 'portfolio-cache-v1';

// Assets to precache (critical assets)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/assets/images/fallback-image.svg',
  '/assets/images/placeholder-image.svg',
  '/favicon.ico',
];

// Install event - precache critical assets
self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => (self as any).skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
    .then(() => (self as any).clients.claim())
  );
});

// Fetch event strategy - network first with cache fallback
self.addEventListener('fetch', (event: any) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip API requests - we don't want to cache dynamic data
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    // Try network first
    fetch(event.request)
      .then(response => {
        // Clone the response to store in cache
        const responseClone = response.clone();
        
        // Open cache and store response
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseClone);
          });
          
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // For navigation requests (HTML), return the offline page
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/');
            }
            
            // Return error for other assets
            return new Response('Network error occurred', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Handle push notifications
self.addEventListener('push', (event: any) => {
  const data = event.data.json();
  
  const options = {
    body: data.body || 'New update available',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    (self as any).registration.showNotification(
      data.title || 'Portfolio Update', 
      options
    )
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event: any) => {
  event.notification.close();
  
  event.waitUntil(
    (self as any).clients.matchAll({type: 'window'})
      .then((clientList: any[]) => {
        // If a window client is already open, focus it
        for (const client of clientList) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise open a new window
        if ((self as any).clients.openWindow) {
          return (self as any).clients.openWindow(event.notification.data.url);
        }
      })
  );
});
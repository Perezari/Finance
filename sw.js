/* Budgy service worker — push notifications only, no caching on purpose
   (always-fresh app code from GitHub Pages; the SW exists so the installed
   PWA can receive Web Push from the Supabase Edge Function). */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) {}
  e.waitUntil(self.registration.showNotification(d.title || 'Budgy', {
    body: d.message || '',
    icon: './icon.png',
    dir: 'rtl',
    lang: 'he',
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then((ws) =>
    ws.length ? ws[0].focus() : clients.openWindow('./')
  ));
});

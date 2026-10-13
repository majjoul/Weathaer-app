// Service Worker لاستقبال وعرض إشعارات الـ Push والتنبيهات الفورية
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// استقبال الـ Push الحقيقي وإظهار الإشعار حتى لو كان التطبيق مغلقاً
self.addEventListener('push', (event) => {
  let data = { title: 'تنبيه طقس وطوارئ', body: 'يوجد تحذير طارئ جديد في منطقتك.' };
  
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || './favicon.ico',
    badge: data.badge || './favicon.ico',
    dir: 'rtl',
    lang: 'ar',
    vibrate: [400, 150, 400, 150, 400],
    requireInteraction: true,
    data: data.url || './'
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'إنذار طارئ', options)
  );
});

// عند النقر على الإشعار يتم فتح التطبيق
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data || './';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

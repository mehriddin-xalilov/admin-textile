self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'EDUMAKON Tizimi', {
      body: data.body || 'Yangi xabar!',
      icon: '/favicon.ico',
    })
  );
});
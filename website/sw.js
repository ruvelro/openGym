// Kill switch, not a service worker the site wants.
//
// The demo used to live at this scope (/openGym/) and registered a worker here. It moved
// to /openGym/demo/ and this path is the landing page now, which registers nothing — but
// browsers that visited the old deployment still hold that registration, and were being
// controlled by a script that had become a 404. Left alone they eventually drop it, on no
// schedule you can count on; meanwhile an offline visitor could be served the old demo
// shell in place of the landing.
//
// Serving a valid script here makes the next update check install this instead, which
// clears the caches, unregisters itself, and reloads whatever it was controlling.
self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys()
    await Promise.all(names.map(n => caches.delete(n)))
    await self.registration.unregister()
    const windows = await self.clients.matchAll({ type: 'window' })
    for (const w of windows) w.navigate(w.url)
  })())
})

/* Self-destructing service worker for the retired notebot.netlify.app origin.
 *
 * This file is never requested by name. netlify.toml rewrites
 * `https://notebot.netlify.app/sw.js` to it with status 200, so an installed PWA
 * on the old host fetches its usual `/sw.js` URL and receives this instead.
 *
 * Why a rewrite and not a redirect: per the service worker spec, an update whose
 * script fetch lands on a redirect FAILS. The old Workbox worker would survive,
 * and because it registers a NavigationRoute served from precache, it would keep
 * answering navigations locally — those installs would never see the 301 to
 * butexnotebot.com and would sit on the old build forever. A 200 rewrite keeps
 * the response same-origin and unredirected, so the update succeeds and this
 * worker replaces it.
 *
 * It then clears every cache, unregisters itself, and reloads its windows. With
 * no fetch handler left to intercept them, those reloads hit the network and
 * follow the redirect to the new domain.
 *
 * Delete this file, its rewrite rule, and the 301 once the old host's traffic
 * has dried up.
 */

self.addEventListener("install", () => {
  // Don't wait for the old worker's clients to close.
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));

      await self.registration.unregister();

      const windows = await self.clients.matchAll({ type: "window" });
      for (const client of windows) {
        // Re-navigating to the same URL is what surfaces the 301.
        client.navigate(client.url);
      }
    })()
  );
});

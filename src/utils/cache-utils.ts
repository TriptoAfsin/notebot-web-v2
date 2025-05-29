// Cache utilities for PWA cache management

/**
 * Clear all caches related to the application
 */
export const clearAllCaches = async (): Promise<void> => {
  if ("caches" in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
      console.log("All caches cleared successfully");
    } catch (error) {
      console.error("Error clearing caches:", error);
    }
  }
};

/**
 * Clear specific cache by name
 */
export const clearCacheByName = async (cacheName: string): Promise<boolean> => {
  if ("caches" in window) {
    try {
      const deleted = await caches.delete(cacheName);
      console.log(`Cache ${cacheName} ${deleted ? "cleared" : "not found"}`);
      return deleted;
    } catch (error) {
      console.error(`Error clearing cache ${cacheName}:`, error);
      return false;
    }
  }
  return false;
};

/**
 * Get cache size information
 */
export const getCacheInfo = async (): Promise<
  { name: string; size: number }[]
> => {
  if ("caches" in window) {
    try {
      const cacheNames = await caches.keys();
      const cacheInfo = await Promise.all(
        cacheNames.map(async name => {
          const cache = await caches.open(name);
          const keys = await cache.keys();
          return { name, size: keys.length };
        })
      );
      return cacheInfo;
    } catch (error) {
      console.error("Error getting cache info:", error);
      return [];
    }
  }
  return [];
};

/**
 * Force refresh of specific URL in cache
 */
export const refreshCachedUrl = async (url: string): Promise<void> => {
  if ("caches" in window) {
    try {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(url);
        if (cachedResponse) {
          await cache.delete(url);
          // Fetch fresh version
          const freshResponse = await fetch(url);
          if (freshResponse.ok) {
            await cache.put(url, freshResponse.clone());
          }
          break;
        }
      }
    } catch (error) {
      console.error(`Error refreshing cached URL ${url}:`, error);
    }
  }
};

/**
 * Add cache busting parameter to URL
 */
export const addCacheBuster = (url: string): string => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_cb=${Date.now()}`;
};

/**
 * Check if service worker is supported and active
 */
export const isServiceWorkerActive = (): boolean => {
  return (
    "serviceWorker" in navigator && navigator.serviceWorker.controller !== null
  );
};

/**
 * Force service worker to skip waiting and take control
 */
export const forceServiceWorkerUpdate = async (): Promise<void> => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
    } catch (error) {
      console.error("Error forcing service worker update:", error);
    }
  }
};

/**
 * Unregister service worker (for debugging purposes)
 */
export const unregisterServiceWorker = async (): Promise<boolean> => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const unregistered = await registration.unregister();
        console.log("Service worker unregistered:", unregistered);
        return unregistered;
      }
    } catch (error) {
      console.error("Error unregistering service worker:", error);
    }
  }
  return false;
};

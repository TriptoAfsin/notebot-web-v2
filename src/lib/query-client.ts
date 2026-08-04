import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";

import { shouldRetry } from "./api-client";
import { GC_TIME, STALE_TIME } from "./query-keys";

/* The app is an installable PWA whose content is near-static, so the cache is
 * worth keeping across sessions: a returning student sees their note tree
 * immediately, offline included, while a background refetch checks for changes.
 */

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Most queries in this app are content trees. Volatile ones opt out.
      staleTime: STALE_TIME.content,
      gcTime: GC_TIME,
      retry: shouldRetry,
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, 8000),
      // Tab focus is not a signal that a syllabus changed.
      refetchOnWindowFocus: false,
      // Regaining connectivity is a signal.
      refetchOnReconnect: true,
      refetchOnMount: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const CACHE_KEY = "notebot-query-cache";

/* Bump when a response shape changes — it throws away incompatible cached
 * payloads instead of feeding them to components that can't read them. */
const CACHE_VERSION = "v1";

export const queryPersister = createSyncStoragePersister({
  storage: typeof window === "undefined" ? undefined : window.localStorage,
  key: CACHE_KEY,
  throttleTime: 1000,
});

export const persistOptions = {
  persister: queryPersister,
  maxAge: GC_TIME,
  buster: CACHE_VERSION,
  dehydrateOptions: {
    shouldDehydrateQuery: (query: { state: { status: string }; queryKey: readonly unknown[] }) => {
      // Never persist failures, and never persist the deliberately-fresh feeds.
      if (query.state.status !== "success") return false;
      const root = query.queryKey[0];
      return root !== "jokes" && root !== "status";
    },
  },
} as const;

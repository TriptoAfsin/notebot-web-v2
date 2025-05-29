import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  clearAllCaches,
  clearCacheByName,
  getCacheInfo,
  isServiceWorkerActive,
  unregisterServiceWorker,
} from "@/utils/cache-utils";
import { AlertTriangle, Info, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface CacheInfo {
  name: string;
  size: number;
}

export function DevCacheManager() {
  const [cacheInfo, setCacheInfo] = useState<CacheInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [swActive, setSWActive] = useState(false);

  useEffect(() => {
    loadCacheInfo();
    setSWActive(isServiceWorkerActive());
  }, []);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  const loadCacheInfo = async () => {
    setIsLoading(true);
    try {
      const info = await getCacheInfo();
      setCacheInfo(info);
    } catch (error) {
      console.error("Error loading cache info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAllCaches = async () => {
    setIsLoading(true);
    try {
      await clearAllCaches();
      await loadCacheInfo();
    } catch (error) {
      console.error("Error clearing all caches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSpecificCache = async (cacheName: string) => {
    setIsLoading(true);
    try {
      await clearCacheByName(cacheName);
      await loadCacheInfo();
    } catch (error) {
      console.error(`Error clearing cache ${cacheName}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnregisterSW = async () => {
    setIsLoading(true);
    try {
      const unregistered = await unregisterServiceWorker();
      if (unregistered) {
        setSWActive(false);
        alert("Service Worker unregistered. Please refresh the page.");
      }
    } catch (error) {
      console.error("Error unregistering service worker:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed z-50 max-w-sm bottom-4 right-4">
      <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-orange-900 dark:text-orange-100">
            <Info className="w-4 h-4" />
            Dev Cache Manager
          </CardTitle>
          <CardDescription className="text-orange-700 dark:text-orange-300">
            Development tools for cache debugging
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Service Worker Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm">Service Worker:</span>
            <Badge variant={swActive ? "default" : "destructive"}>
              {swActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {/* Cache Information */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Caches ({cacheInfo.length})
              </span>
              <Button
                onClick={loadCacheInfo}
                size="sm"
                variant="outline"
                disabled={isLoading}
                className="h-6 px-2"
              >
                <RefreshCw
                  className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>

            {cacheInfo.length > 0 ? (
              <div className="space-y-1 overflow-y-auto max-h-32">
                {cacheInfo.map(cache => (
                  <div
                    key={cache.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="flex-1 mr-2 truncate">{cache.name}</span>
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {cache.size}
                      </Badge>
                      <Button
                        onClick={() => handleClearSpecificCache(cache.name)}
                        size="sm"
                        variant="ghost"
                        disabled={isLoading}
                        className="w-5 h-5 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">No caches found</p>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2 border-t">
            <Button
              onClick={handleClearAllCaches}
              size="sm"
              variant="destructive"
              disabled={isLoading || cacheInfo.length === 0}
              className="w-full"
            >
              <Trash2 className="w-3 h-3 mr-2" />
              Clear All Caches
            </Button>

            {swActive && (
              <Button
                onClick={handleUnregisterSW}
                size="sm"
                variant="outline"
                disabled={isLoading}
                className="w-full text-orange-700 border-orange-300 hover:bg-orange-100"
              >
                <AlertTriangle className="w-3 h-3 mr-2" />
                Unregister SW
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

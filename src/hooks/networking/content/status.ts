import { API_CONFIG } from "@/constants/api-config";
import { getJson } from "@/lib/api-client";
import { queryKeys, STALE_TIME } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export type PlatformStatus = {
  botStatus?: boolean;
  [key: string]: unknown;
};

export const fetchStatus = () =>
  getJson<PlatformStatus>(
    API_CONFIG.PLATFORM_STATUS,
    "checking the platform status"
  );

export const useGetPlatformStatus = () =>
  useQuery({
    queryKey: queryKeys.status(),
    queryFn: fetchStatus,
    staleTime: STALE_TIME.status,
    // A down platform shouldn't spam the console with retries on every page.
    retry: 1,
    // The badge is decorative — never block or surface an error for it.
    throwOnError: false,
  });

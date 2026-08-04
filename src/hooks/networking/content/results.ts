import { API_CONFIG } from "@/constants/api-config";
import { getJson } from "@/lib/api-client";
import { queryKeys, STALE_TIME } from "@/lib/query-keys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export type ResultItem = {
  href: string;
  content: string;
  date: string;
};

type ResultsEnvelope = { data?: ResultItem[] };

export const fetchResults = async (limit?: number): Promise<ResultItem[]> => {
  const envelope = await getJson<ResultsEnvelope>(
    API_CONFIG.RESULTS,
    "loading the latest results",
    limit ? { params: { limit } } : undefined
  );
  return envelope?.data ?? [];
};

export const useGetResults = (limit?: number) =>
  useQuery({
    queryKey: queryKeys.results(limit),
    queryFn: () => fetchResults(limit),
    staleTime: STALE_TIME.results,
    // "Load more" bumps the limit, which is a new cache entry. Without this the
    // list blanked to skeletons on every click; now the current page stays on
    // screen and is replaced when the larger page arrives.
    placeholderData: keepPreviousData,
  });

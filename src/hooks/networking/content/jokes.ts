import { API_CONFIG } from "@/constants/api-config";
import { getJson } from "@/lib/api-client";
import { queryKeys, STALE_TIME } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export type JokesDetails = {
  joke: string;
};

export const fetchJokes = async (): Promise<JokesDetails> => {
  const joke = await getJson<string>(API_CONFIG.JOKES, "fetching a joke", {
    responseType: "text",
  });
  return { joke };
};

export const useGetJokes = () =>
  useQuery({
    queryKey: queryKeys.jokes(),
    queryFn: fetchJokes,
    // A new joke every time is the whole feature — never serve this from cache.
    staleTime: STALE_TIME.volatile,
    gcTime: 0,
  });

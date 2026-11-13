import { APP_CONFIG } from "@/constants/app-config";
import { getJson } from "@/lib/api-client";
import { queryKeys, STALE_TIME } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

type GithubRepo = { stargazers_count?: number };

export const fetchGithubStars = async (repo: string) => {
  const data = await getJson<GithubRepo>(
    `https://api.github.com/repos/${repo}`,
    "loading the GitHub star count"
  );
  return typeof data.stargazers_count === "number"
    ? data.stargazers_count
    : null;
};

/** Live star count for the open-source engine. Unauthenticated GitHub calls
 *  allow 60 an hour per visitor, so it refreshes every few minutes at most and
 *  the last good count is persisted; on failure the count is simply hidden. */
export const useGithubStars = (repo = APP_CONFIG.support.githubRepo) =>
  useQuery({
    queryKey: queryKeys.githubStars(repo),
    queryFn: () => fetchGithubStars(repo),
    staleTime: STALE_TIME.stars,
    refetchOnMount: true,
    retry: 1,
    throwOnError: false,
  });

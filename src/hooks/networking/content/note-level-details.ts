import { API_CONFIG } from "@/constants/api-config";
import { getJson } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export type NoteLevelItem = {
  subName: string;
  url?: string;
  route?: string;
};

export type NoteLevelDetails = NoteLevelItem[];

export const fetchNoteLevelDetails = (level: number | string) =>
  getJson<NoteLevelDetails>(
    API_CONFIG.NOTES_LEVEL(level),
    "loading the subjects for this level"
  );

/** Shared descriptor so pages can prefetch this exact query on intent. */
export const noteLevelQuery = (level: number | string) => ({
  queryKey: queryKeys.notes.level(level),
  queryFn: () => fetchNoteLevelDetails(level),
});

export const useGetNoteLevelDetails = (level: number | string) =>
  useQuery({ ...noteLevelQuery(level), enabled: Boolean(level) });

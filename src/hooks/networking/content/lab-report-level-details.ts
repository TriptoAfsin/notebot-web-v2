import { API_CONFIG } from "@/constants/api-config";
import { getJson } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export type LabLevelItem = {
  subName: string;
  url?: string;
  route?: string;
};

export type LabLevelDetails = LabLevelItem[];

export const fetchLabReportLevelDetails = (level: number | string) =>
  getJson<LabLevelDetails>(
    API_CONFIG.LAB_REPORTS_LEVEL(level),
    "loading the subjects for this level"
  );

export const labLevelQuery = (level: number | string) => ({
  queryKey: queryKeys.labs.level(level),
  queryFn: () => fetchLabReportLevelDetails(level),
});

export const useGetLabReportLevelDetails = (level: number | string) =>
  useQuery({ ...labLevelQuery(level), enabled: Boolean(level) });

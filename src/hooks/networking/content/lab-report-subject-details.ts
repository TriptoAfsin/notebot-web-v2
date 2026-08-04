import { API_CONFIG } from "@/constants/api-config";
import { getJson } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export type LabSubjectItem = {
  topic: string;
  url?: string;
  route?: string;
};

export type LabSubjectDetails = LabSubjectItem[];

export const fetchLabReportSubjectDetails = (
  level: number | string,
  subject: string
) =>
  getJson<LabSubjectDetails>(
    API_CONFIG.LAB_REPORTS_SUBJECT_DETAILS(level, subject),
    "loading the topics for this subject"
  );

export const labSubjectQuery = (level: number | string, subject: string) => ({
  // Keyed on level *and* subject — the old subject-only key collided across levels.
  queryKey: queryKeys.labs.subject(level, subject),
  queryFn: () => fetchLabReportSubjectDetails(level, subject),
});

export const useGetLabReportSubjectDetails = (
  level: number | string,
  subject: string
) =>
  useQuery({
    ...labSubjectQuery(level, subject),
    enabled: Boolean(level && subject),
  });

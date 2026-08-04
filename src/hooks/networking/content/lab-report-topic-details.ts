import { API_CONFIG } from "@/constants/api-config";
import { getJson } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export type LabTopicItem = {
  title: string;
  url?: string;
  route?: string;
};

export type LabTopicDetails = LabTopicItem[];

export const fetchLabReportTopicDetails = (
  level: number | string,
  subject: string,
  topic: string
) =>
  getJson<LabTopicDetails>(
    API_CONFIG.LAB_REPORTS_SUBJECT_TOPIC_DETAILS(level, subject, topic),
    "loading the reports for this topic"
  );

export const labTopicQuery = (
  level: number | string,
  subject: string,
  topic: string
) => ({
  queryKey: queryKeys.labs.topic(level, subject, topic),
  queryFn: () => fetchLabReportTopicDetails(level, subject, topic),
});

export const useGetLabReportSubjectTopicDetails = (
  level: number | string,
  subject: string,
  topic: string
) =>
  useQuery({
    ...labTopicQuery(level, subject, topic),
    enabled: Boolean(level && subject && topic),
  });

import { API_CONFIG } from "@/constants/api-config";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type LabReportLevelItem = {
  title: string;
  url?: string;
  route?: string;
};

type LabReportLevelDetails = LabReportLevelItem[];

const fetchLabReportSubjectTopicDetails = async (
  level: number | string,
  subject: string,
  topic: string
): Promise<LabReportLevelDetails | null> => {
  try {
    const response = await axios.get(
      API_CONFIG.LAB_REPORTS_SUBJECT_TOPIC_DETAILS(level, subject, topic)
    );
    return response?.data ?? null;
  } catch (error) {
    console.error("Error fetching lab report subject topic details:", error);
    throw error instanceof AxiosError
      ? error
      : new Error("An unexpected error occurred");
  }
};

export const useGetLabReportSubjectTopicDetails = (
  level: number | string,
  subject: string,
  topic: string
) => {
  return useQuery<LabReportLevelDetails | null, Error>({
    queryKey: ["labReportSubjectTopicDetails", topic],
    queryFn: () => fetchLabReportSubjectTopicDetails(level, subject, topic),
  });
};

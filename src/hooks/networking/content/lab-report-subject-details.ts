import { API_CONFIG } from "@/constants/api-config";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type LabReportLevelItem = {
  topic: string;
  url?: string;
  route?: string;
};

type LabReportLevelDetails = LabReportLevelItem[];

const fetchLabReportSubjectDetails = async (
  level: number | string,
  subject: string
): Promise<LabReportLevelDetails | null> => {
  try {
    const response = await axios.get(
      API_CONFIG.LAB_REPORTS_SUBJECT_DETAILS(level, subject)
    );
    return response?.data ?? null;
  } catch (error) {
    console.error("Error fetching lab report subject details:", error);
    throw error instanceof AxiosError
      ? error
      : new Error("An unexpected error occurred");
  }
};

export const useGetLabReportSubjectDetails = (
  level: number | string,
  subject: string
) => {
  return useQuery<LabReportLevelDetails | null, Error>({
    queryKey: ["labReportSubjectDetails", subject],
    queryFn: () => fetchLabReportSubjectDetails(level, subject),
  });
};

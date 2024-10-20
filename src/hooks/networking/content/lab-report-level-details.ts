import { API_CONFIG } from "@/constants/api-config";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type LabReportLevelItem = {
  subName: string;
  url?: string;
  route?: string;
};

type LabReportLevelDetails = LabReportLevelItem[];

const fetchLabReportLevelDetails = async (
  level: number | string
): Promise<LabReportLevelDetails | null> => {
  try {
    const response = await axios.get(API_CONFIG.LAB_REPORTS_LEVEL(level));
    return response?.data ?? null;
  } catch (error) {
    console.error("Error fetching lab report level details:", error);
    throw error instanceof AxiosError
      ? error
      : new Error("An unexpected error occurred");
  }
};

export const useGetLabReportLevelDetails = (level: number | string) => {
  return useQuery<LabReportLevelDetails | null, Error>({
    queryKey: ["labReportLevelDetails", level],
    queryFn: () => fetchLabReportLevelDetails(level),
  });
};

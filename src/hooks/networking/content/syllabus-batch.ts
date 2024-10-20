import { API_CONFIG } from "@/constants/api-config";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type SyllabusItem = {
  dept: string;
  url?: string;
  route?: string;
};

type SyllabusBatchDetails = SyllabusItem[];

const fetchSyllabus = async (
  batch: number | string
): Promise<SyllabusBatchDetails | null> => {
  try {
    const response = await axios.get(API_CONFIG.SYLLABUS_BATCH(batch));
    return response?.data ?? null;
  } catch (error) {
    console.error("Error fetching batch wise syllabus details:", error);
    throw error instanceof AxiosError
      ? error
      : new Error("An unexpected error occurred");
  }
};

export const useGetBatchSyllabus = (batch: number | string) => {
  return useQuery<SyllabusBatchDetails | null, Error>({
    queryKey: ["syllabus-batch", batch],
    queryFn: () => fetchSyllabus(batch),
  });
};

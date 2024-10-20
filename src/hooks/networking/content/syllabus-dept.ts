import { API_CONFIG } from "@/constants/api-config";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type SyllabusItem = {
  topic: string;
  url?: string;
  route?: string;
};

type SyllabusBatchDetails = SyllabusItem[] & {
  topic: string;
  url?: string;
  route?: string;
};

const fetchSyllabus = async (
  batch: number | string,
  dept: string
): Promise<SyllabusBatchDetails | null> => {
  try {
    const response = await axios.get(
      API_CONFIG.SYLLABUS_BATCH_DEPT(batch?.toString(), dept)
    );
    return response?.data ?? null;
  } catch (error) {
    console.error("Error fetching batch wise syllabus details:", error);
    throw error instanceof AxiosError
      ? error
      : new Error("An unexpected error occurred");
  }
};

export const useGetDeptSyllabus = (batch: number | string, dept: string) => {
  return useQuery<SyllabusBatchDetails | null, Error>({
    queryKey: ["syllabus-dept", batch, dept],
    queryFn: () => fetchSyllabus(batch, dept),
  });
};

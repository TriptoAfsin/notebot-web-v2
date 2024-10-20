import { API_CONFIG } from "@/constants/api-config";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type SyllabusItem = {
  batch: string;
  url?: string;
  route?: string;
};

type NoteLevelDetails = SyllabusItem[];

const fetchSyllabus = async (): Promise<NoteLevelDetails | null> => {
  try {
    const response = await axios.get(API_CONFIG.SYLLABUS_ROOT);
    return response?.data ?? null;
  } catch (error) {
    console.error("Error fetching syllabus details:", error);
    throw error instanceof AxiosError
      ? error
      : new Error("An unexpected error occurred");
  }
};

export const useGetSyllabus = () => {
  return useQuery<NoteLevelDetails | null, Error>({
    queryKey: ["syllabus"],
    queryFn: () => fetchSyllabus(),
  });
};

import { API_CONFIG } from "@/constants/api-config";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type NoteLevelItem = {
  subName: string;
  url?: string;
  route?: string;
};

type NoteLevelDetails = NoteLevelItem[];

const fetchNoteLevelDetails = async (
  level: number | string
): Promise<NoteLevelDetails | null> => {
  try {
    const response = await axios.get(API_CONFIG.NOTES_LEVEL(level));
    return response?.data ?? null;
  } catch (error) {
    console.error("Error fetching note level details:", error);
    throw error instanceof AxiosError
      ? error
      : new Error("An unexpected error occurred");
  }
};

export const useGetNoteLevelDetails = (level: number | string) => {
  return useQuery<NoteLevelDetails | null, Error>({
    queryKey: ["noteLevelDetails", level],
    queryFn: () => fetchNoteLevelDetails(level),
  });
};

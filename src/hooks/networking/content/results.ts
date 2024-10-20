import { API_CONFIG } from "@/constants/api-config";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type ResultItem = {
  href: string;
  content: string;
  date: string;
};

type ResultResponse = ResultItem[];

const fetchResults = async (limit?: number): Promise<ResultResponse | null> => {
  try {
    const url = new URL(API_CONFIG.RESULTS);
    if (limit) {
      url.searchParams.append("limit", limit.toString());
    }
    const response = await axios.get(url.toString());
    return response?.data?.data ?? null;
  } catch (error) {
    console.error("Error fetching results details:", error);
    throw error instanceof AxiosError
      ? error
      : new Error("An unexpected error occurred");
  }
};

export const useGetResults = (limit?: number) => {
  return useQuery<ResultResponse | null, Error>({
    queryKey: ["results", limit],
    queryFn: () => fetchResults(limit),
  });
};

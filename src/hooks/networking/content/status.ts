import { API_CONFIG } from "@/constants/api-config";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const fetchStatus = async (): Promise<Record<string, any> | null> => {
  try {
    const response = await axios.get(API_CONFIG.PLATFORM_STATUS);
    return response?.data ?? null;
  } catch (error) {
    console.error("Error fetching platform status:", error);
    throw error instanceof AxiosError
      ? error
      : new Error("An unexpected error occurred");
  }
};

export const useGetPlatformStatus = () => {
  return useQuery<Record<string, any> | null, Error>({
    queryKey: ["status"],
    queryFn: () => fetchStatus(),
  });
};

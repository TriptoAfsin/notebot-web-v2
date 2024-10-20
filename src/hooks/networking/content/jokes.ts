import { API_CONFIG } from "@/constants/api-config";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type JokesDetails = {
  joke: string;
};

const fetchJokes = async (): Promise<JokesDetails> => {
  try {
    const response = await axios.get(API_CONFIG.JOKES, {
      responseType: "text",
    });
    return { joke: response.data };
  } catch (error) {
    console.error("Error fetching jokes details:", error);
    throw error instanceof AxiosError
      ? error
      : new Error("An unexpected error occurred");
  }
};

export const useGetJokes = () => {
  return useQuery<JokesDetails, Error>({
    queryKey: ["jokes"],
    queryFn: () => fetchJokes(),
  });
};

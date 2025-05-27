import { API_CONFIG } from "@/constants/api-config";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type AutoRagSearchResponse = {
  success: boolean;
  result?: {
    object: string;
    search_query: string;
    response: string;
    data: Array<{
      file_id: string;
      filename: string;
      score: number;
      attributes: {
        timestamp: number;
        folder: string;
      };
      content: Array<{
        id: string;
        type: string;
        text: string;
      }>;
    }>;
    has_more: boolean;
    next_page: string | null;
  };
  [key: string]: any;
};

const fetchAutoRagSearch = async (
  query: string
): Promise<AutoRagSearchResponse | null> => {
  try {
    const response = await axios.post(API_CONFIG.AUTO_RAG_SEARCH, {
      query: `You're an expert in textile industry. Answer the following question: '${query}', if you don't know the answer, just say "Sorry I don't know the answer to that question, I can help you with questions related to textile industry"`,
    });
    return response?.data ?? null;
  } catch (error) {
    console.error("Error fetching AutoRAG search results:", error);
    throw error instanceof AxiosError
      ? error
      : new Error("An unexpected error occurred");
  }
};

export const useAutoRagSearch = (query: string, enabled: boolean = true) => {
  return useQuery<AutoRagSearchResponse | null, Error>({
    queryKey: ["autoRagSearch", query],
    queryFn: () => fetchAutoRagSearch(query),
    enabled: enabled && !!query, // Only run if enabled and query is not empty
  });
};

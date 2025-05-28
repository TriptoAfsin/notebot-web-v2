import { API_CONFIG } from "@/constants/api-config";
import { useMutation } from "@tanstack/react-query";
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
      query: `Answer the following question: '${query}'`,
    });
    return response?.data ?? null;
  } catch (error) {
    console.error("Error fetching AutoRAG search results:", error);
    throw error instanceof AxiosError
      ? error
      : new Error("An unexpected error occurred");
  }
};

export const useAutoRagSearch = () => {
  const mutation = useMutation<AutoRagSearchResponse | null, Error, string>({
    mutationFn: (query: string) => fetchAutoRagSearch(query),
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    data: mutation.data,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    reset: mutation.reset,
  };
};

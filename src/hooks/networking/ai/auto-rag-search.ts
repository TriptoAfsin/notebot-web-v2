import { API_CONFIG } from "@/constants/api-config";
import { postJson } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

export type AutoRagReference = {
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
};

export type AutoRagSearchResponse = {
  success: boolean;
  result?: {
    object: string;
    search_query: string;
    response: string;
    data: AutoRagReference[];
    has_more: boolean;
    next_page: string | null;
  };
};

const fetchAutoRagSearch = (query: string) =>
  postJson<AutoRagSearchResponse>(
    API_CONFIG.AUTO_RAG_SEARCH,
    { query },
    "asking Tex-GPT",
    // Retrieval + generation is slower than a content fetch.
    { timeout: 60_000 }
  );

export const useAutoRagSearch = () => {
  const mutation = useMutation({
    mutationFn: fetchAutoRagSearch,
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

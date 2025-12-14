import { API_CONFIG } from "@/constants/api-config";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

export type SponsoredContentItem = {
  title: string;
  description?: string;
  url?: string;
  imgUrl?: string;
  type?: string;
  accentColor?: string[];
};

type SponsoredContentResponse = {
  sponsoredContent?: SponsoredContentItem[];
};

const fetchSponsoredContent = async (): Promise<SponsoredContentItem[]> => {
  try {
    const response = await axios.get<SponsoredContentResponse>(
      API_CONFIG.SPONSORED_CONTENT
    );
    return response?.data?.sponsoredContent ?? [];
  } catch (error) {
    console.error("Error fetching sponsored content:", error);
    throw error instanceof AxiosError
      ? error
      : new Error("An unexpected error occurred");
  }
};

export const useSponsoredContent = () =>
  useQuery<SponsoredContentItem[], Error>({
    queryKey: ["sponsoredContent"],
    queryFn: fetchSponsoredContent,
    staleTime: 5 * 60 * 1000,
  });


import { API_CONFIG } from "@/constants/api-config";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type NoteLevelItem = {
  title: string;
  url?: string;
  route?: string;
};

type NoteLevelDetails = NoteLevelItem[];

const fetchNoteSubjectTopicDetails = async (
  level: number | string,
  subject: string,
  topic: string
): Promise<NoteLevelDetails | null> => {
  try {
    const response = await axios.get(
      API_CONFIG.NOTES_SUBJECT_TOPIC_DETAILS(level, subject, topic)
    );
    return response?.data ?? null;
  } catch (error) {
    console.error("Error fetching note subject topic details:", error);
    throw error instanceof AxiosError
      ? error
      : new Error("An unexpected error occurred");
  }
};

export const useGetNoteSubjectTopicDetails = (
  level: number | string,
  subject: string,
  topic: string
) => {
  return useQuery<NoteLevelDetails | null, Error>({
    queryKey: ["noteSubjectTopicDetails", topic],
    queryFn: () => fetchNoteSubjectTopicDetails(level, subject, topic),
  });
};

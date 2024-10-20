import { API_CONFIG } from "@/constants/api-config";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type NoteLevelItem = {
  topic: string;
  url?: string;
  route?: string;
};

type NoteLevelDetails = NoteLevelItem[];

const fetchNoteSubjectDetails = async (
  level: number | string,
  subject: string
): Promise<NoteLevelDetails | null> => {
  try {
    const response = await axios.get(
      API_CONFIG.NOTES_SUBJECT_DETAILS(level, subject)
    );
    return response?.data ?? null;
  } catch (error) {
    console.error("Error fetching note subject details:", error);
    throw error instanceof AxiosError
      ? error
      : new Error("An unexpected error occurred");
  }
};

export const useGetNoteSubjectDetails = (
  level: number | string,
  subject: string
) => {
  return useQuery<NoteLevelDetails | null, Error>({
    queryKey: ["noteSubjectDetails", subject],
    queryFn: () => fetchNoteSubjectDetails(level, subject),
  });
};

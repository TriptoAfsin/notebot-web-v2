import { API_CONFIG } from "@/constants/api-config";
import { getJson } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export type NoteTopicItem = {
  title: string;
  url?: string;
  route?: string;
};

export type NoteTopicDetails = NoteTopicItem[];

export const fetchNoteTopicDetails = (
  level: number | string,
  subject: string,
  topic: string
) =>
  getJson<NoteTopicDetails>(
    API_CONFIG.NOTES_SUBJECT_TOPIC_DETAILS(level, subject, topic),
    "loading the notes for this topic"
  );

export const noteTopicQuery = (
  level: number | string,
  subject: string,
  topic: string
) => ({
  queryKey: queryKeys.notes.topic(level, subject, topic),
  queryFn: () => fetchNoteTopicDetails(level, subject, topic),
});

export const useGetNoteSubjectTopicDetails = (
  level: number | string,
  subject: string,
  topic: string
) =>
  useQuery({
    ...noteTopicQuery(level, subject, topic),
    enabled: Boolean(level && subject && topic),
  });

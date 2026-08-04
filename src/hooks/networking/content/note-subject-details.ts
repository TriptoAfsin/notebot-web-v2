import { API_CONFIG } from "@/constants/api-config";
import { getJson } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export type NoteSubjectItem = {
  topic: string;
  url?: string;
  route?: string;
};

export type NoteSubjectDetails = NoteSubjectItem[];

export const fetchNoteSubjectDetails = (
  level: number | string,
  subject: string
) =>
  getJson<NoteSubjectDetails>(
    API_CONFIG.NOTES_SUBJECT_DETAILS(level, subject),
    "loading the topics for this subject"
  );

export const noteSubjectQuery = (level: number | string, subject: string) => ({
  // Keyed on level *and* subject — two levels can share a subject name, and the
  // old key (subject only) made them collide in the cache.
  queryKey: queryKeys.notes.subject(level, subject),
  queryFn: () => fetchNoteSubjectDetails(level, subject),
});

export const useGetNoteSubjectDetails = (
  level: number | string,
  subject: string
) =>
  useQuery({
    ...noteSubjectQuery(level, subject),
    enabled: Boolean(level && subject),
  });

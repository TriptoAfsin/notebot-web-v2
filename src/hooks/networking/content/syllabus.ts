import { API_CONFIG } from "@/constants/api-config";
import { getJson } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export type SyllabusBatchItem = {
  batch: string;
  url?: string;
  route?: string;
};

export type SyllabusRoot = SyllabusBatchItem[];

export const fetchSyllabus = () =>
  getJson<SyllabusRoot>(API_CONFIG.SYLLABUS_ROOT, "loading the batch list");

export const syllabusRootQuery = () => ({
  queryKey: queryKeys.syllabus.root(),
  queryFn: fetchSyllabus,
});

export const useGetSyllabus = () => useQuery(syllabusRootQuery());

import { API_CONFIG } from "@/constants/api-config";
import { getJson } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export type SyllabusTopicItem = {
  topic: string;
  url?: string;
  route?: string;
};

export type SyllabusDeptDetails = SyllabusTopicItem[];

/* The endpoint returns an array when a department has several syllabus entries
 * and a bare object when it has exactly one. The old type papered over that with
 * an `Item[] & Item` intersection, which forced the page to branch on
 * `Array.isArray` and render the same card twice. Normalising here means callers
 * only ever see a list. */
export const fetchDeptSyllabus = async (
  batch: number | string,
  dept: string
): Promise<SyllabusDeptDetails> => {
  const payload = await getJson<SyllabusTopicItem | SyllabusTopicItem[]>(
    API_CONFIG.SYLLABUS_BATCH_DEPT(String(batch), dept),
    "loading the syllabus for this department"
  );

  if (!payload) return [];
  return Array.isArray(payload) ? payload : [payload];
};

export const syllabusDeptQuery = (batch: number | string, dept: string) => ({
  queryKey: queryKeys.syllabus.dept(batch, dept),
  queryFn: () => fetchDeptSyllabus(batch, dept),
});

export const useGetDeptSyllabus = (batch: number | string, dept: string) =>
  useQuery({
    ...syllabusDeptQuery(batch, dept),
    enabled: Boolean(batch && dept),
  });

import { API_CONFIG } from "@/constants/api-config";
import { getJson } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export type SyllabusDeptItem = {
  dept: string;
  url?: string;
  route?: string;
};

export type SyllabusBatchDetails = SyllabusDeptItem[];

export const fetchBatchSyllabus = (batch: number | string) =>
  getJson<SyllabusBatchDetails>(
    API_CONFIG.SYLLABUS_BATCH(batch),
    "loading the departments for this batch"
  );

export const syllabusBatchQuery = (batch: number | string) => ({
  queryKey: queryKeys.syllabus.batch(batch),
  queryFn: () => fetchBatchSyllabus(batch),
});

export const useGetBatchSyllabus = (batch: number | string) =>
  useQuery({ ...syllabusBatchQuery(batch), enabled: Boolean(batch) });

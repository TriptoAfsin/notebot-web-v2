export const BASE_URL = import.meta.env.VITE_API_URL;
export const API_CONFIG = {
  PLATFORM_STATUS: `${BASE_URL}`,
  NOTES_ROOT: `${BASE_URL}/app/notes`,
  NOTES_LEVEL: (level: number | string) => `${API_CONFIG.NOTES_ROOT}/${level}`,
  NOTES_SUBJECT_DETAILS: (level: number | string, subject: string) =>
    `${API_CONFIG.NOTES_LEVEL(level)}/${subject}`,
  NOTES_SUBJECT_TOPIC_DETAILS: (
    level: number | string,
    subject: string,
    topic: string
  ) => `${API_CONFIG.NOTES_SUBJECT_DETAILS(level, subject)}/${topic}`,
  LAB_REPORTS_ROOT: `${BASE_URL}/app/labs`,
  LAB_REPORTS_LEVEL: (level: number | string) =>
    `${API_CONFIG.LAB_REPORTS_ROOT}/${level}`,
  LAB_REPORTS_SUBJECT_DETAILS: (level: number | string, subject: string) =>
    `${API_CONFIG.LAB_REPORTS_LEVEL(level)}/${subject}`,
  LAB_REPORTS_SUBJECT_TOPIC_DETAILS: (
    level: number | string,
    subject: string,
    topic: string
  ) => `${API_CONFIG.LAB_REPORTS_SUBJECT_DETAILS(level, subject)}/${topic}`,
  SYLLABUS_ROOT: `${BASE_URL}/app/syllabus`,
  SYLLABUS_BATCH: (batch: number | string) =>
    `${API_CONFIG.SYLLABUS_ROOT}/${batch}`,
  SYLLABUS_BATCH_DEPT: (batch: number | string, dept: string) =>
    `${API_CONFIG.SYLLABUS_BATCH(batch)}/${dept}`,
  RESULTS: `${BASE_URL}/results`,
  JOKES: `${BASE_URL}/app/jokes`,
};

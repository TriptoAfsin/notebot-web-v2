export const APP_PATHS = {
  HOME: "/",
  NOTEBOT_MESSENGER: "/",
  BUTEX_PHONE_BOOK: "/",
  SUBMIT_NOTES: "/",
  ABOUT: "/about",
  NOTES: "/notes",
  CONTACT: "/contact",
  LAB_REPORTS: "/lab-reports",
  QBANKS: "/q-bank",
  NOTICES: "/notices",
  SYLLABUS: "/syllabus",
  RESULTS: "/results",
  ROUTINES: "/routines",
  NOTES_LEVEL_DETAILS: (level: string) => `/notes/${level}`,
  NOTES_SUBJECT_DETAILS: (level: string, subject: string) =>
    `/notes/${level}/${subject}`,
  NOTES_DETAILS: (level: string, subject: string, topic: string) =>
    `/notes/${level}/${subject}/${topic}`,
  LAB_REPORTS_LEVELS: (level: string) => `/lab-reports/${level}`,
  LAB_REPORTS_SUBJECTS: (level: string, subject: string) =>
    `/lab-reports/${level}/${subject}`,
  LAB_REPORTS_DETAILS: (level: string, subject: string, topic: string) =>
    `/lab-reports/${level}/${subject}/${topic}`,
  JOKES: "/jokes",
};

import BrandLogo from "@/components/atoms/brand-logo";
import IconLinkButton from "@/components/atoms/buttons/icon-link-button";
import { Box, Grid } from "@/components/atoms/layout";
import { TextEffect } from "@/components/atoms/typography/text-effect";
import AnimatingContainer from "@/components/Layout/AnimatingContainer";
import { APP_CONFIG } from "@/constants/app-config";
import { APP_PATHS } from "@/constants/path-config";

const NOTES_ICON = "/icons/notes.png";
const LAB_REPORTS_ICON = "/icons/lab-report.png";
const SYLLABUS_ICON = "/icons/syllabus.png";
const Q_BANK_ICON = "/icons/q-bank.png";
const RESULTS_ICON = "/icons/result.png";
const JOKES_ICON = "/icons/joke.png";
const SUBMIT_ICON = "/icons/submit.png";

const FRONT_PAGE_ITEMS = [
  {
    id: 1,
    title: "Notes",
    icon: <img src={NOTES_ICON} alt="Notes" />,
    href: APP_PATHS.NOTES,
  },
  {
    id: 2,
    title: "Lab Reports",
    icon: <img src={LAB_REPORTS_ICON} alt="Lab Reports" />,
    href: APP_PATHS.LAB_REPORTS,
  },
  {
    id: 3,
    title: "Q-Bank",
    icon: <img src={Q_BANK_ICON} alt="Q-Bank" />,
    href: APP_PATHS.QBANKS,
  },
  {
    id: 4,
    title: "Syllabus",
    icon: <img src={SYLLABUS_ICON} alt="Syllabus" />,
    href: APP_PATHS.SYLLABUS,
  },
  {
    id: 5,
    title: "Results",
    icon: <img src={RESULTS_ICON} alt="Results" />,
    href: APP_PATHS.RESULTS,
  },
  {
    id: 6,
    title: "Jokes",
    icon: <img src={JOKES_ICON} alt="Jokes" />,
    href: APP_PATHS.JOKES,
  },
  {
    id: 7,
    title: "Submit Notes",
    icon: <img src={SUBMIT_ICON} alt="Submit" />,
    href: APP_CONFIG.submitLink,
    isExternal: true,
  },
];

function FrontPage() {
  return (
    <Box className="flex flex-col items-center min-h-screen p-4">
      <BrandLogo className="w-24 h-24 mb-5" />
      <TextEffect className="text-xl font-semibold">NoteBot Web</TextEffect>
      <AnimatingContainer animation="slideDown">
        <Grid
          columns="3"
          className="w-full grid-cols-3 gap-4 my-6 md:grid-cols-4 lg:grid-cols-6"
        >
          {FRONT_PAGE_ITEMS.map(item => (
            <IconLinkButton
              key={item.id}
              path={item.href}
              label={item.title}
              icon={item?.icon}
              labelClassName="font-semibold"
              iconClassName="w-16 h-16"
              isExternal={item?.isExternal}
            />
          ))}
        </Grid>
      </AnimatingContainer>
    </Box>
  );
}

export default FrontPage;

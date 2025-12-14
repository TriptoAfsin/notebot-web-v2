import BrandLogo from "@/components/atoms/brand-logo";
import IconLinkButton from "@/components/atoms/buttons/icon-link-button";
import { Box, Grid } from "@/components/atoms/layout";
import { TextEffect } from "@/components/atoms/typography/text-effect";
import AnimatingContainer from "@/components/Layout/AnimatingContainer";
import SponsoredSlider from "@/components/organisms/sponsored-slider";
import { APP_CONFIG } from "@/constants/app-config";
import { APP_PATHS } from "@/constants/path-config";
import { useFeaturedPreference } from "@/context/featured-preference";
import { useSponsoredContent } from "@/hooks/networking/content/sponsored-content";
import { Component } from "react";

const NOTES_ICON = "/icons/notes.png";
const LAB_REPORTS_ICON = "/icons/lab-report.png";
const SYLLABUS_ICON = "/icons/syllabus.png";
const Q_BANK_ICON = "/icons/q-bank.png";
const RESULTS_ICON = "/icons/result.png";
const JOKES_ICON = "/icons/joke.png";
const TEX_GPT_ICON = "/icons/tex-gpt.png";
const SUBMIT_ICON = "/icons/submit.png";
const PHONE_BOOK_ICON = "/icons/phonebook.png";
const COUNT_CONVERTER_ICON = "/icons/converter.png";

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
    id: 7,
    title: "Submit Notes",
    icon: <img src={SUBMIT_ICON} alt="Submit" />,
    href: APP_CONFIG.submitLink,
    isExternal: true,
  },
  {
    id: 2323,
    title: "Phone Book",
    icon: <img src={PHONE_BOOK_ICON} alt="Phone Book" />,
    href: "https://triptoafsin.github.io/butex-phonebook-v2/",
    isExternal: true,
  },
  {
    id: 1221212,
    title: "Count Koto",
    icon: <img src={COUNT_CONVERTER_ICON} alt="Count Converter" />,
    href: "https://triptoafsin.github.io/CountKoto-/",
    isExternal: true,
  },
  {
    id: 6,
    title: "Jokes",
    icon: <img src={JOKES_ICON} alt="Jokes" />,
    href: APP_PATHS.JOKES,
  },
  {
    id: 8,
    title: "Tex-GPT",
    icon: <img src={TEX_GPT_ICON} alt="Tex-GPT" />,
    href: APP_PATHS.TEX_GPT,
  },
];

class SponsoredErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Sponsored content failed to render:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box className="px-4 py-6 mx-auto w-full max-w-5xl text-sm rounded-md border border-border/60 bg-muted/20 text-muted-foreground">
          Unable to load featured content right now.
        </Box>
      );
    }
    return this.props.children;
  }
}

function FrontPage() {
  const { showFeatured, toggleFeatured } = useFeaturedPreference();
  const {
    data: sponsoredContent,
    isLoading: sponsoredLoading,
    isError: sponsoredError,
    refetch: refetchSponsored,
  } = useSponsoredContent();

  return (
    <Box className="flex flex-col gap-8 items-center p-4 min-h-screen">
      <AnimatingContainer
        animation="zoomIn"
        duration={0.8}
        className="flex flex-col items-center"
      >
        <BrandLogo className="mb-4 w-24 h-24 md:mb-4 md:w-36 md:h-36" />
        <TextEffect className="text-2xl font-semibold">NoteBot Web</TextEffect>
      </AnimatingContainer>

      <SponsoredErrorBoundary>
        <SponsoredSlider
          items={sponsoredContent ?? []}
          isLoading={sponsoredLoading}
          isError={sponsoredError}
          onRetry={refetchSponsored}
          collapsed={!showFeatured}
          onToggle={toggleFeatured}
        />
      </SponsoredErrorBoundary>
      <AnimatingContainer animation="slideDown">
        <Grid
          columns="3"
          className="grid-cols-3 gap-4 my-6 w-full md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 lg:gap-6 xl:gap-8"
        >
          {FRONT_PAGE_ITEMS.map(item => (
            <IconLinkButton
              key={item.id}
              path={item.href}
              label={item.title}
              icon={item?.icon}
              labelClassName="font-semibold"
              iconClassName="w-14 h-14 lg:w-15 lg:h-15 xl:w-16 xl:h-16"
              isExternal={item?.isExternal}
            />
          ))}
        </Grid>
      </AnimatingContainer>
    </Box>
  );
}

export default FrontPage;

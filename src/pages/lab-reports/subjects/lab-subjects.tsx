import { Box } from "@/components/atoms/layout";
import NavigationLinkCard from "@/components/atoms/skeletons/navigation-link-card";
import RootContentSkeleton from "@/components/atoms/skeletons/root-content-skeleton";
import { Text } from "@/components/atoms/typography/text";
import { TextEffect } from "@/components/atoms/typography/text-effect";
import AnimatingContainer from "@/components/Layout/AnimatingContainer";
import ErrorComponent from "@/components/molecules/error-comonent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { APP_PATHS } from "@/constants/path-config";
import { useGetLabReportSubjectDetails } from "@/hooks/networking/content/lab-report-subject-details";
import { useLocation } from "react-router-dom";

export default function LabSubjects() {
  const location = useLocation();
  // Extract level and subject from the URL path
  const pathParts = location.pathname.split("/");
  const level = pathParts[pathParts.length - 2];
  const subject = pathParts[pathParts.length - 1];

  const { data, isLoading, error, refetch } = useGetLabReportSubjectDetails(
    level,
    subject
  );

  if (error) {
    return (
      <ErrorComponent
        message="An error occurred while fetching lab reports."
        refreshFunc={refetch}
      />
    );
  }

  return (
    <Box className="container p-6 mx-auto">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={APP_PATHS.HOME}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink href={APP_PATHS.LAB_REPORTS}>
              Lab Reports
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="capitalize">
              {`${subject?.toUpperCase()}`}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <TextEffect className="flex items-center mb-6 text-xl font-bold">
        📗 Choose Lab Report
      </TextEffect>
      <AnimatingContainer animation="slideDown">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <RootContentSkeleton key={index} />
          ))
        ) : data ? (
          <Box className="grid gap-4 md:grid-cols-3">
            {data.map((item, index) => {
              const topicNameSlug = item.route
                ? item.route.split("/").pop()
                : "";
              return (
                <NavigationLinkCard
                  label={item.topic}
                  key={index}
                  url={item?.url}
                  labelClassName="text-lg"
                  path={`${APP_PATHS.LAB_REPORTS}/${level}/${subject}/${topicNameSlug}`}
                  isExternal={item?.url ? true : false}
                />
              );
            })}
          </Box>
        ) : (
          <Box>
            <Text>No lab reports available.</Text>
          </Box>
        )}
      </AnimatingContainer>
    </Box>
  );
}

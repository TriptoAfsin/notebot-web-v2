import NavigationLinkCard from "@/components/atoms/cards/navigation-link-card";
import { Box } from "@/components/atoms/layout";
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
import { useGetLabReportLevelDetails } from "@/hooks/networking/content/lab-report-level-details";
import { useLocation } from "react-router-dom";

export default function LabLevels() {
  const location = useLocation();
  // Extract batch from the URL path
  const level = location.pathname.split("/").pop();

  const { data, isLoading, error, refetch } = useGetLabReportLevelDetails(
    level as string
  );

  console.log("data", data);

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
            <BreadcrumbLink>{`Level ${level}`}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <TextEffect className="flex items-center mb-6 text-xl font-bold">
        📗 Choose Subject
      </TextEffect>
      <AnimatingContainer animation="slideDown">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <RootContentSkeleton key={index} />
          ))
        ) : data ? (
          <Box className="grid gap-4 md:grid-cols-3">
            {data?.map((item, index) => {
              // Extract the subject from the route
              const subject = item?.route?.split("/").pop() || "";

              return (
                <NavigationLinkCard
                  label={item.subName}
                  url={item?.url}
                  key={index}
                  path={`${APP_PATHS.LAB_REPORTS}/${level}/${subject}`}
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

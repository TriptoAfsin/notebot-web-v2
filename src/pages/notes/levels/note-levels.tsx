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
import { useGetNoteLevelDetails } from "@/hooks/networking/content/note-level-details";
import { useLocation } from "react-router-dom";

export default function NoteLevels() {
  const location = useLocation();
  // Extract batch from the URL path
  const level = location.pathname.split("/").pop();

  const { data, isLoading, error, refetch } = useGetNoteLevelDetails(
    level as string
  );

  console.log("data", data);

  if (error) {
    return (
      <ErrorComponent
        message="An error occurred while fetching notes."
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
            <BreadcrumbLink href={APP_PATHS.NOTES}>Notes</BreadcrumbLink>
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
                  path={`${APP_PATHS.NOTES}/${level}/${subject}`}
                  isExternal={item?.url ? true : false}
                />
              );
            })}
          </Box>
        ) : (
          <Box>
            <Text>No notes available.</Text>
          </Box>
        )}
      </AnimatingContainer>
    </Box>
  );
}

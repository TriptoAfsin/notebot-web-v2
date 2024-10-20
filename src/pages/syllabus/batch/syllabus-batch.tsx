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
import { useGetBatchSyllabus } from "@/hooks/networking/content/syllabus-batch";
import { useLocation } from "react-router-dom";

export default function SyllabusBatch() {
  const location = useLocation();
  // Extract batch from the URL path
  const batch = location.pathname.split("/").pop();

  const { data, isLoading, error, refetch } = useGetBatchSyllabus(
    batch as string
  );

  if (error) {
    return (
      <ErrorComponent
        message="An error occurred while fetching syllabus."
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
            <BreadcrumbLink href={APP_PATHS.SYLLABUS}>Syllabus</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{`Batch ${batch}`}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <TextEffect className="flex items-center mb-6 text-xl font-bold">
        📗 Choose Syllabus
      </TextEffect>
      <AnimatingContainer animation="slideDown">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <RootContentSkeleton key={index} />
          ))
        ) : data ? (
          <Box className="grid gap-4 md:grid-cols-3">
            {data.map((item, index) => (
              <NavigationLinkCard
                label={item.dept}
                key={index}
                path={`${
                  APP_PATHS.SYLLABUS
                }/${batch}/${item?.dept?.toLowerCase()}`}
                isExternal={item?.url ? true : false}
              />
            ))}
          </Box>
        ) : (
          <Box>
            <Text>No syllabus available.</Text>
          </Box>
        )}
      </AnimatingContainer>
    </Box>
  );
}

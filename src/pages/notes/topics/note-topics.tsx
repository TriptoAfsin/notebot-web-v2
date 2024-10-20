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
import { useGetNoteSubjectTopicDetails } from "@/hooks/networking/content/note-topic-details";
import { useLocation } from "react-router-dom";

export default function NoteTopics() {
  const location = useLocation();
  // Extract level and subject from the URL path
  const pathParts = location.pathname.split("/");
  const level = pathParts[pathParts.length - 3];
  const subject = pathParts[pathParts.length - 2];
  const topic = pathParts[pathParts.length - 1];

  const { data, isLoading, error, refetch } = useGetNoteSubjectTopicDetails(
    level,
    subject,
    topic
  );

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
            <BreadcrumbLink
              className="capitalize"
              href={APP_PATHS.NOTES_SUBJECT_DETAILS(level, subject)}
            >{`${subject?.toUpperCase()}`}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <TextEffect className="flex items-center mb-6 text-xl font-bold">
        📗 Choose Note
      </TextEffect>
      <AnimatingContainer animation="slideDown">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <RootContentSkeleton key={index} />
          ))
        ) : data ? (
          <Box className="grid gap-4 md:grid-cols-3">
            {data.map((item, index) => {
              return (
                <NavigationLinkCard
                  label={item?.title}
                  key={index}
                  url={item?.url}
                  labelClassName="text-lg"
                  path={`${APP_PATHS.NOTES}/${level}/${subject}/${topic}`}
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

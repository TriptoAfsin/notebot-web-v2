import NavigationLinkCard from "@/components/atoms/cards/navigation-link-card";
import { Box } from "@/components/atoms/layout";
import SearchBox from "@/components/atoms/inputs/search-box";
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
import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";

export default function NoteLevels() {
  const location = useLocation();
  // Extract batch from the URL path
  const level = location.pathname.split("/").pop();

  const { data, isLoading, error, refetch } = useGetNoteLevelDetails(
    level as string
  );

  const [searchTerm, setSearchTerm] = useState("");

  const subjects = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data]
  );

  const filteredSubjects = useMemo(() => {
    if (!subjects.length) return [];

    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return subjects;

    return subjects.filter(item =>
      (item.subName || "").toLowerCase().includes(normalizedSearch)
    );
  }, [subjects, searchTerm]);

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
      <Box className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <Text className="text-base font-medium text-zinc-700 dark:text-zinc-200">
          Search by subject name
        </Text>
        <Box className="w-full sm:w-80">
          <SearchBox
            name="note-subject-search"
            label="Search note subjects"
            placeholder="Type a subject name..."
            onSubmit={value => setSearchTerm(value)}
            onChange={value => setSearchTerm(value)}
            onClear={() => setSearchTerm("")}
            inputClassName="text-base"
            disabled={isLoading}
          />
        </Box>
      </Box>
      <AnimatingContainer animation="slideDown">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <RootContentSkeleton key={index} />
          ))
        ) : subjects.length ? (
          filteredSubjects.length ? (
            <Box className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {filteredSubjects.map((item, index) => {
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
            <Box className="flex flex-col items-center justify-center gap-3 py-10 text-muted-foreground">
              <SearchX className="h-10 w-10" />
              <Text className="text-center">No subjects match your search.</Text>
            </Box>
          )
        ) : (
          <Box>
            <Text>No notes available.</Text>
          </Box>
        )}
      </AnimatingContainer>
    </Box>
  );
}

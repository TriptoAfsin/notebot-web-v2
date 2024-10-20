import { Box } from "@/components/atoms/layout";
import JokeSkeleton from "@/components/atoms/skeletons/joke-skeleton";
import { Text } from "@/components/atoms/typography/text";
import { TextEffect } from "@/components/atoms/typography/text-effect";
import ErrorComponent from "@/components/molecules/error-comonent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { APP_PATHS } from "@/constants/path-config";
import { useGetJokes } from "@/hooks/networking/content/jokes";

const JOKES_ICON = "/icons/joke.png";

export default function JokesPage() {
  const { data, isLoading, error, refetch, isFetching } = useGetJokes();

  const showLoading = isLoading || isFetching;

  const handleGenerateNewJoke = () => {
    refetch();
  };

  return (
    <Box className="container p-6 mx-auto">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={APP_PATHS.HOME}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink href={APP_PATHS.JOKES}>Jokes</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <TextEffect className="flex items-center mb-6 text-xl font-bold">
        🤣 Jokes
      </TextEffect>
      {error ? (
        <ErrorComponent
          message="An error occurred while fetching jokes."
          refreshFunc={refetch}
        />
      ) : showLoading ? (
        <JokeSkeleton />
      ) : (
        <Box className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg">
          <Text className="mb-4 text-lg">{data?.joke}</Text>
          <Button onClick={handleGenerateNewJoke}>Another Joke !</Button>
        </Box>
      )}
      <Box className="absolute bottom-24 right-5">
        <img src={JOKES_ICON} alt="Jokes" className="w-24 h-24" />
      </Box>
    </Box>
  );
}

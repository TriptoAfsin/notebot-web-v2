import { Box } from "@/components/atoms/layout";
import ExternalLinkCardSkeleton from "@/components/atoms/skeletons/external-link-card-skeleton";
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
import { Card, CardContent } from "@/components/ui/card";
import { APP_PATHS } from "@/constants/path-config";
import { useGetResults } from "@/hooks/networking/content/results";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ResultsPage() {
  const [limit, setLimit] = useState(10);
  const {
    data: results,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetResults(limit);

  const handleLoadMore = () => {
    setLimit(prevLimit => prevLimit + 10);
  };

  const handleRefresh = () => {
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
            <BreadcrumbLink href={APP_PATHS.RESULTS}>Results</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <TextEffect className="flex items-center mb-6 text-xl font-bold">
        🎓 Latest Results
      </TextEffect>
      {error ? (
        <ErrorComponent
          message="An error occurred while fetching results."
          refreshFunc={handleRefresh}
        />
      ) : (
        <>
          <Box className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading || isFetching
              ? // Loading skeletons
                Array.from({ length: 6 }).map((_, index) => (
                  <ExternalLinkCardSkeleton key={index} />
                ))
              : // Actual results
                results?.map(result => (
                  <Link to={result.href} key={result.href} target="_blank">
                    <Card>
                      <CardContent className="flex items-center justify-between p-4">
                        <p>{result.content}</p>
                        <ExternalLink
                          className="flex-shrink-0 ml-2"
                          size={18}
                        />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
          </Box>
          {results && results.length > 0 && limit < 20 && (
            <Box className="mt-6 text-center">
              <Button
                onClick={handleLoadMore}
                className="bg-[#2780d0] hover:bg-[#2879c1]"
              >
                Load More
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

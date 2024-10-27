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
import { Card, CardContent } from "@/components/ui/card";
import { APP_PATHS } from "@/constants/path-config";
import { useGetSyllabus } from "@/hooks/networking/content/syllabus";
import { Link } from "react-router-dom";

const SYLLABUS_ICON = "/icons/syllabus.png";

export default function SyllabusPage() {
  const { data, isLoading, error, refetch } = useGetSyllabus();

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
        </BreadcrumbList>
      </Breadcrumb>
      <TextEffect className="flex items-center mb-6 text-xl font-bold">
        📘 Choose Batch
      </TextEffect>
      <AnimatingContainer animation="slideDown">
        {isLoading ? (
          <RootContentSkeleton />
        ) : data && data?.length > 0 ? (
          <Box className="grid gap-4 md:grid-cols-3">
            {data?.map((batch, index) => {
              return (
                <Link to={`${APP_PATHS.SYLLABUS}/${batch.batch}`} key={index}>
                  <Card className="transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800">
                    <CardContent className="p-4">
                      <Box className="flex items-center w-full text-xl text-left">
                        <span className="mr-4 text-2xl">{`Batch ${batch.batch}`}</span>
                      </Box>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </Box>
        ) : (
          <Box>
            <Text>No syllabus available.</Text>
          </Box>
        )}
      </AnimatingContainer>
      <Box className="absolute bottom-24 right-5">
        <img src={SYLLABUS_ICON} alt="Syllabus" className="w-24 h-24" />
      </Box>
    </Box>
  );
}

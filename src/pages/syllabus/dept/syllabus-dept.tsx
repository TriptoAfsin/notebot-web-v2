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
import { useGetDeptSyllabus } from "@/hooks/networking/content/syllabus-dept";
import { ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function SyllabusDept() {
  const { batch, dept } = useParams<{ batch: string; dept: string }>();
  const { data, isLoading, error, refetch } = useGetDeptSyllabus(
    batch as string,
    dept as string
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
            <BreadcrumbLink href={`${APP_PATHS.SYLLABUS}/${batch}`}>
              {batch}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`${APP_PATHS.SYLLABUS}/${batch}/${dept}`}>
              {dept?.toUpperCase()}
            </BreadcrumbLink>
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
        ) : data && Array?.isArray(data) ? (
          <Box className="grid gap-4 md:grid-cols-3">
            {data.map((item, index) => (
              <Link to={item?.url as string} key={index} target="_blank">
                <Card className="transition-colors hover:bg-gray-100">
                  <CardContent className="p-4">
                    <Box className="flex items-center justify-between w-full text-xl text-left">
                      <span className="mr-4 text-2xl">{item?.topic}</span>
                      {item?.url && (
                        <ExternalLink className="w-5 h-5 text-gray-500" />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </Box>
        ) : data && !Array?.isArray(data) ? (
          <Link to={data?.url as string} target="_blank">
            <Card className="transition-colors hover:bg-gray-100">
              <CardContent className="p-4">
                <Box className="flex items-center justify-between w-full text-xl text-left">
                  <span className="mr-4 text-2xl">{data?.topic}</span>
                  {data?.url && (
                    <ExternalLink className="w-5 h-5 text-gray-500" />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Link>
        ) : (
          <Box>
            <Text>No syllabus available.</Text>
          </Box>
        )}
      </AnimatingContainer>
    </Box>
  );
}

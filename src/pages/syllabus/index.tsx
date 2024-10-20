import { Box } from "@/components/atoms/layout";
import { TextEffect } from "@/components/atoms/typography/text-effect";
import AnimatingContainer from "@/components/Layout/AnimatingContainer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { APP_PATHS } from "@/constants/path-config";
import { Link } from "react-router-dom";

const levels = [
  {
    name: "Batch 45",

    href: "https://drive.google.com/drive/folders/1Fu7l9FBq3gdWUKNnTix6RibLvy3e25Ra?usp=sharing",
  },
  {
    name: "Batch 46",

    href: "https://drive.google.com/drive/folders/1KZvgEL3f1kDY54H5Ha218l7yZfPn6jM6?usp=sharing",
  },
];

export default function SyllabusPage() {
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
        📗 Choose Batch
      </TextEffect>
      <AnimatingContainer animation="slideDown">
        <Box className="grid gap-4">
          {levels.map((level, index) => (
            <Link to={level.href} key={index} target="_blank">
              <Card className="transition-colors hover:bg-gray-100">
                <CardContent className="p-4">
                  <Box className="flex items-center w-full text-xl text-left">
                    <span className="mr-4 text-2xl">{level.name}</span>
                  </Box>
                </CardContent>
              </Card>
            </Link>
          ))}
        </Box>
      </AnimatingContainer>
    </Box>
  );
}

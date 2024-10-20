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
    name: "🧒 Level 1",

    href: "https://drive.google.com/drive/folders/1Fu7l9FBq3gdWUKNnTix6RibLvy3e25Ra?usp=sharing",
  },
  {
    name: "👦 Level 2",

    href: "https://drive.google.com/drive/folders/1KZvgEL3f1kDY54H5Ha218l7yZfPn6jM6?usp=sharing",
  },
  {
    name: "🧑 Level 3",
    href: "https://drive.google.com/drive/folders/1mbygPQPSEDkP6NoRxJxJATWI8aBgzxsZ?usp=sharing",
  },
  {
    name: "🧑‍🎓 Level 4",
    href: "https://drive.google.com/drive/folders/17QQ6mXUYe3FL7sf4VMzdBBkRbJAId0VT?usp=sharing",
  },
];

export default function LabReportsPage() {
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
        </BreadcrumbList>
      </Breadcrumb>
      <TextEffect className="flex items-center mb-6 text-xl font-bold">
        📗 Choose Level for Lab Reports
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

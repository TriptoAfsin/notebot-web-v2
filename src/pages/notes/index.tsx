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
    href: `${APP_PATHS.NOTES}/1`,
  },
  {
    name: "👦 Level 2",
    href: `${APP_PATHS.NOTES}/2`,
  },
  {
    name: "🧑 Level 3",
    href: `${APP_PATHS.NOTES}/3`,
  },
  {
    name: "🧑‍🎓 Level 4",
    href: `${APP_PATHS.NOTES}/4`,
  },
];

export default function NotesPage() {
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
        </BreadcrumbList>
      </Breadcrumb>
      <TextEffect className="flex items-center mb-6 text-xl font-bold">
        📗 Choose Level for Notes
      </TextEffect>
      <AnimatingContainer animation="slideDown">
        <Box className="grid gap-4">
          {levels.map((level, index) => (
            <Link to={level.href} key={index}>
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

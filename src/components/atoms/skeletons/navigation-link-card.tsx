import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Box } from "../layout";

export default function NavigationLinkCard({
  path,
  label,
  isExternal,
}: {
  path: string;
  label: string;
  isExternal?: boolean;
}) {
  return (
    <Link to={path}>
      <Card className="transition-colors hover:bg-gray-100">
        <CardContent className="p-4">
          <Box className="flex items-center w-full text-xl text-left">
            <span className="mr-4 text-2xl">{`${label}`}</span>
          </Box>
          {isExternal && <ExternalLink className="w-5 h-5 text-gray-500" />}
        </CardContent>
      </Card>
    </Link>
  );
}

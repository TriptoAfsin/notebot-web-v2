import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Box } from "../layout";

export default function NavigationLinkCard({
  path,
  label,
  isExternal,
  url = "",
  labelClassName = "",
}: {
  url?: string;
  path: string;
  label: string;
  isExternal?: boolean;
  labelClassName?: string;
}) {
  return (
    <Link to={isExternal ? url : path} target={isExternal ? "_blank" : "_self"}>
      <Card className="transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800">
        <CardContent className="flex items-center justify-between p-4">
          <Box className="flex items-center w-full text-xl text-left">
            <span
              className={cn("mr-4 text-xl", labelClassName)}
            >{`${label}`}</span>
          </Box>
          {isExternal && <ExternalLink className="w-5 h-5 text-gray-500" />}
        </CardContent>
      </Card>
    </Link>
  );
}

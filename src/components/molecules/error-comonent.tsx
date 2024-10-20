import { Box } from "@/components/atoms/layout";
import { Text } from "@/components/atoms/typography/text";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, RefreshCw } from "lucide-react";

type ErrorComponentProps = {
  message?: string;
  refreshFunc?: () => void;
  className?: string;
  messageClassName?: string;
  iconClassName?: string;
  icon?: React.ReactNode;
};

export default function ErrorComponent({
  message = "An error occurred",
  refreshFunc = () => {},
  className,
  messageClassName,
  iconClassName,
}: ErrorComponentProps) {
  return (
    <Box
      className={cn(
        "text-center flex flex-col items-center gap-2 my-8",
        className
      )}
    >
      <AlertCircle className={cn("w-12 h-12 text-red-500", iconClassName)} />
      <Text
        className={cn(
          "flex items-center justify-center mb-4 text-lg text-red-500",
          messageClassName
        )}
      >
        {message}
      </Text>
      <Button onClick={refreshFunc} className="bg-[#2780d0] hover:bg-[#2879c1]">
        <RefreshCw className="w-4 h-4 mr-2" /> Refresh
      </Button>
    </Box>
  );
}

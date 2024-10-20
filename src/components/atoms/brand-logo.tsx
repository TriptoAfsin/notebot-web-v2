import { APP_CONFIG } from "@/constants/app-config";
import { APP_PATHS } from "@/constants/path-config";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Box } from "./layout";

interface BrandLogoProps {
  className?: string;
  logo?: string;
  width?: number;
  height?: number;
}

function BrandLogo({
  className,
  logo = APP_CONFIG.logoIcon,
  width = 200,
  height = 200,
}: BrandLogoProps) {
  return (
    <Link to={APP_PATHS.HOME}>
      <Box className={cn("w-10 h-auto", className)}>
        <img src={logo} alt="Brand Logo" width={width} height={height} />
      </Box>
    </Link>
  );
}

export default BrandLogo;

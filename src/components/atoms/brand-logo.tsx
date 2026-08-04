import { APP_CONFIG } from "@/constants/app-config";
import { APP_PATHS } from "@/constants/path-config";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface BrandLogoProps {
  className?: string;
  logo?: string;
  width?: number;
  height?: number;
  /** Fired after the link is followed — lets the mobile sheet close itself. */
  onNavigate?: () => void;
}

function BrandLogo({
  className,
  logo = APP_CONFIG.logoIcon,
  width = 200,
  height = 200,
  onNavigate,
}: BrandLogoProps) {
  return (
    <Link
      to={APP_PATHS.HOME}
      viewTransition
      onClick={onNavigate}
      aria-label={`${APP_CONFIG.name} — home`}
      className={cn(
        "inline-block shrink-0 rounded-control",
        "transition-transform duration-short ease-out active:translate-y-px",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
        className
      )}
    >
      <img
        src={logo}
        // decorative: the link already carries the accessible name
        alt=""
        width={width}
        height={height}
        // the mark is the LCP element on the launcher — never lazy-load it
        fetchPriority="high"
        decoding="async"
        className="h-full w-full object-contain"
      />
    </Link>
  );
}

export default BrandLogo;

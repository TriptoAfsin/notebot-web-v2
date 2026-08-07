import { APP_CONFIG } from "@/constants/app-config";
import { APP_PATHS } from "@/constants/path-config";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

/* The mark renders at 40px (header), 64px (mobile sheet) and 96px (launcher).
 * It used to be one 512x512 PNG at 50 KiB for all three — 47 KiB of it wasted,
 * and it's the launcher's LCP element. Two WebP widths cover every case,
 * including a 2x screen at the largest: 5.4 KiB instead of 50. */
const LOGO_SRCSET = "/notebot-web-96.webp 96w, /notebot-web-192.webp 192w";
const LOGO_SRC = "/notebot-web-192.webp";

interface BrandLogoProps {
  className?: string;
  width?: number;
  height?: number;
  /** Fired after the link is followed — lets the mobile sheet close itself. */
  onNavigate?: () => void;
}

function BrandLogo({
  className,
  width = 96,
  height = 96,
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
        src={LOGO_SRC}
        srcSet={LOGO_SRCSET}
        // `sizes` is what lets the browser pick 96w for the header and 192w for
        // the launcher on a 2x screen — without it srcset can only guess.
        sizes={`${width}px`}
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

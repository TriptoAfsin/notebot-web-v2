/* Hallmark · macrostructure: Catalogue · design-system: design.md
 *
 * The launcher tile. Same square grid position it always had; the icon is now a
 * dimensional glyph rather than a PNG, and the tile has one composed hover
 * gesture (lift + border) gated behind a fine pointer so touch devices don't
 * inherit a state they can't leave.
 *
 * Sizing note — this is what fixed the clipped labels on mobile:
 * the icon used to carry a fixed `h-16 w-16`, which on a 3-up grid at phone
 * widths was taller than the room left inside an `aspect-square` tile once
 * padding and the label were accounted for. The content overflowed a centred
 * flex column and `overflow-hidden` cropped the label off the bottom edge.
 *
 * The label now claims its space FIRST (`shrink-0`) and the icon takes whatever
 * is left (`flex-1 min-h-0`), scaling to fit via `h-full w-auto` on whatever
 * element is passed in. That holds at any tile size, so callers no longer have to
 * guess an icon size that happens to fit.
 */

import AppLink, { type PrefetchTarget } from "@/components/atoms/links/app-link";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

type IconLinkButtonProps = {
  label: string;
  icon?: ReactNode;
  path: string;
  className?: string;
  labelClassName?: string;
  iconClassName?: string;
  size?: "sm" | "regular" | "lg";
  isExternal?: boolean;
  prefetch?: PrefetchTarget;
};

const sizeClasses = {
  sm: "gap-2xs p-2xs",
  regular: "gap-2xs p-xs sm:p-sm",
  lg: "gap-xs p-sm sm:p-md",
} as const;

/** Ceiling so the glyph doesn't balloon on a wide tile. */
const iconCap = {
  sm: "max-h-10",
  regular: "max-h-[4.5rem]",
  lg: "max-h-24",
} as const;

export default function IconLinkButton({
  label,
  icon,
  path,
  className,
  labelClassName,
  iconClassName,
  size = "regular",
  isExternal = false,
  prefetch,
}: IconLinkButtonProps) {
  return (
    <AppLink
      to={path}
      external={isExternal}
      prefetch={isExternal ? undefined : prefetch}
      className="rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
    >
      <div
        className={cn(
          "surface tile-lift relative flex aspect-square flex-col items-center justify-center overflow-hidden",
          sizeClasses[size],
          className
        )}
      >
        {isExternal ? (
          <ArrowUpRight
            className="absolute right-1.5 top-1.5 h-3.5 w-3.5 text-muted-foreground"
            aria-hidden="true"
          />
        ) : null}

        {/* Takes the leftover height. `[&>*]` sizes whatever glyph or <img> the
            caller passed, so the tile owns the geometry rather than the caller. */}
        <span
          className={cn(
            "tile-icon flex min-h-0 w-full flex-1 items-center justify-center",
            "[&>*]:h-full [&>*]:w-auto [&>*]:max-w-full",
            iconCap[size],
            iconClassName
          )}
        >
          {icon}
        </span>

        {/* Claims its space before the icon does, so it can never be cropped. */}
        <span
          className={cn(
            "affordance w-full shrink-0 truncate text-center text-xs font-medium leading-tight text-foreground sm:text-sm",
            labelClassName
          )}
        >
          {label}
        </span>
      </div>
    </AppLink>
  );
}

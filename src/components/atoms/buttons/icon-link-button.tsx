/* Hallmark · macrostructure: Catalogue · design-system: design.md
 *
 * The launcher tile. Same square grid position it always had; what changed is
 * that the icon is now a dimensional SVG rather than a PNG, and the tile has one
 * hover signal — a 2px lift with a border shift, gated behind a fine pointer so
 * touch devices don't inherit a state they can't leave.
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
  sm: "gap-2xs p-xs text-xs",
  regular: "gap-xs p-sm text-sm",
  lg: "gap-sm p-md text-base",
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
            className="absolute right-2 top-2 h-3.5 w-3.5 text-muted-foreground"
            aria-hidden="true"
          />
        ) : null}

        <span
          className={cn("tile-icon flex items-center justify-center", iconClassName)}
        >
          {icon}
        </span>

        <span
          className={cn(
            "affordance mt-1 max-w-full truncate text-center font-medium text-foreground",
            labelClassName
          )}
        >
          {label}
        </span>
      </div>
    </AppLink>
  );
}

/* Hallmark · macrostructure: Index-First · design-system: design.md
 *
 * The index row. Hairline surface, one hover signal (border + fill shift — no
 * scale, no shadow stack), an optional dimensional mark, and an accent rail that
 * grows on hover so the row reads as selectable without moving.
 */

import AppLink, { type PrefetchTarget } from "@/components/atoms/links/app-link";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export default function NavigationLinkCard({
  path,
  label,
  isExternal,
  url = "",
  labelClassName = "",
  icon,
  meta,
  prefetch,
}: {
  url?: string;
  path: string;
  label: string;
  isExternal?: boolean;
  labelClassName?: string;
  icon?: ReactNode;
  meta?: string;
  prefetch?: PrefetchTarget;
}) {
  return (
    <AppLink
      to={isExternal ? url : path}
      external={isExternal}
      prefetch={isExternal ? undefined : prefetch}
      className="h-full rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
    >
      <div className="surface-interactive relative flex h-full items-center gap-sm overflow-hidden p-md">
        {/* The accent rail — scales from the vertical centre on hover/focus. */}
        <span aria-hidden="true" className="row-rail" />

        {icon ? <span className="shrink-0">{icon}</span> : null}

        <span className="flex min-w-0 flex-1 flex-col">
          <span
            className={cn(
              "truncate text-base font-medium text-foreground",
              labelClassName
            )}
          >
            {label}
          </span>
          {meta ? <span className="label-mono truncate">{meta}</span> : null}
        </span>

        {isExternal ? (
          <ArrowUpRight
            className="h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        ) : (
          <ChevronRight
            className="row-chevron h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        )}
      </div>
    </AppLink>
  );
}

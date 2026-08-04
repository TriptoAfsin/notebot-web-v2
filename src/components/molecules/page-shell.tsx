/* Hallmark · macrostructure: Index-First · design-system: design.md
 *
 * The shared furniture for every browse page: the breadcrumb trail, the title
 * row, and the page container. Extracted because all eleven browse pages had
 * copy-pasted the same <Breadcrumb> block and the same emoji-prefixed <h1>.
 *
 * Title rows are a single vertical column by design — the tag-left / heading-
 * right split is the templated-editorial tell (Hallmark gate 54).
 */

import AppLink from "@/components/atoms/links/app-link";
import { staggerStyle } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export type Crumb = {
  label: string;
  href?: string;
};

/** JetBrains Mono, uppercase, hairline chevrons — the machine-readout trail. */
export function Breadcrumbs({ trail }: { trail: readonly Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-lg">
      <ol className="flex flex-wrap items-center gap-x-2xs gap-y-2xs">
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-x-2xs">
              {crumb.href && !isLast ? (
                <AppLink
                  to={crumb.href}
                  className={cn(
                    "label-mono affordance inline-block",
                    "transition-colors duration-short ease-out hover:text-foreground"
                  )}
                >
                  {crumb.label}
                </AppLink>
              ) : (
                <span
                  className="label-mono affordance text-foreground"
                  aria-current={isLast ? "page" : undefined}
                >
                  {crumb.label}
                </span>
              )}
              {!isLast ? (
                <ChevronRight
                  className="h-3 w-3 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Title row: dimensional mark, then the title, stacked in one column.
 * `meta` sits under the title for counts ("38 subjects").
 */
export function PageTitle({
  icon,
  title,
  meta,
  children,
}: {
  icon?: ReactNode;
  title: string;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mb-lg flex flex-col gap-sm">
      <div className="flex items-center gap-sm">
        {icon ? <span className="shrink-0">{icon}</span> : <span className="accent-tick" />}
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      {meta ? <p className="label-mono">{meta}</p> : null}
      {children}
    </div>
  );
}

/** The page container. One place to change the browse-page rhythm. */
export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // generous top, tighter bottom — the rhythm isn't evenly padded
        "container px-md pb-2xl pt-lg md:px-lg",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Grid of index rows. `count` seeds the one orchestrated entrance: each child
 * gets a CSS stagger index rather than its own motion component.
 */
export function IndexGrid({
  children,
  columns = 3,
  className,
}: {
  children: ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-md",
        // minmax(0,1fr) not bare 1fr — long subject names must not blow out
        // the track (Hallmark gate 50)
        columns === 1 && "grid-cols-[minmax(0,1fr)]",
        columns === 2 &&
          "grid-cols-[minmax(0,1fr)] sm:grid-cols-[repeat(2,minmax(0,1fr))]",
        columns === 3 &&
          "grid-cols-[minmax(0,1fr)] sm:grid-cols-[repeat(2,minmax(0,1fr))] lg:grid-cols-[repeat(3,minmax(0,1fr))]",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Wrap a grid child to give it its place in the entrance. */
export function RevealItem({
  index,
  children,
}: {
  index: number;
  children: ReactNode;
}) {
  return (
    <div className="reveal min-w-0" style={staggerStyle(index)}>
      {children}
    </div>
  );
}

import { cn } from "@/lib/utils";
import { STALE_TIME } from "@/lib/query-keys";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { forwardRef, useCallback, type ReactNode } from "react";
import { Link } from "react-router-dom";

/** A prefetchable query descriptor, as returned by the `*Query()` helpers. */
export type PrefetchTarget = {
  queryKey: QueryKey;
  queryFn: () => Promise<unknown>;
};

type AppLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
  /** Renders an <a target="_blank"> with the right rel and no router involvement. */
  external?: boolean;
  /**
   * Warm this query when the pointer or focus lands on the link. By the time the
   * click lands the destination usually has its data already.
   */
  prefetch?: PrefetchTarget;
  "aria-label"?: string;
};

const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>(function AppLink(
  { to, children, className, external = false, prefetch, ...rest },
  ref
) {
  const queryClient = useQueryClient();

  const warm = useCallback(() => {
    if (!prefetch) return;
    // prefetchQuery is a no-op when the entry is already fresh, so repeated
    // hovers over the same row cost nothing.
    void queryClient.prefetchQuery({
      ...prefetch,
      staleTime: STALE_TIME.content,
    });
  }, [prefetch, queryClient]);

  if (external) {
    return (
      <a
        ref={ref}
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("block", className)}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      ref={ref}
      to={to}
      // Hands the navigation to the browser's View Transitions API where it
      // exists; RouteTransition covers the fallback path.
      viewTransition
      className={cn("block", className)}
      onMouseEnter={prefetch ? warm : undefined}
      onFocus={prefetch ? warm : undefined}
      onTouchStart={prefetch ? warm : undefined}
      {...rest}
    >
      {children}
    </Link>
  );
});

export default AppLink;

import { preloadRoute } from "@/lib/route-chunks";
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

  /**
   * Warm the destination on intent — both halves of it.
   *
   * The route's JS chunk matters as much as its data: without it, react-router 7
   * navigates inside a transition, React holds the current screen while the
   * chunk downloads, and the URL changes seconds before the UI does. Preloading
   * happens for every internal link, with or without a `prefetch` descriptor.
   */
  const warm = useCallback(() => {
    preloadRoute(to);

    if (!prefetch) return;
    // prefetchQuery is a no-op when the entry is already fresh, so repeated
    // hovers over the same row cost nothing.
    void queryClient.prefetchQuery({
      ...prefetch,
      staleTime: STALE_TIME.content,
    });
  }, [prefetch, queryClient, to]);

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
      // Unconditional now: the chunk preload applies to every internal link,
      // not just the ones that were given a query to warm.
      onMouseEnter={warm}
      onFocus={warm}
      onTouchStart={warm}
      {...rest}
    >
      {children}
    </Link>
  );
});

export default AppLink;

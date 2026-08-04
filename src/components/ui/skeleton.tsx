import { cn } from "@/lib/utils";

/**
 * Uses the `.skeleton` sweep from index.css rather than `animate-pulse`.
 * A pulse reads as "this element is disabled"; a sweep reads as "content is on
 * its way". The sweep is functional motion, so it keeps running under
 * reduced-motion — just slower.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton", className)} {...props} />;
}

export { Skeleton };

/* Hallmark · design-system: design.md
 *
 * Error state. Three parts per the copy rules — what broke, why it probably
 * broke, and the one action that fixes it. The glyph carries the state
 * alongside the colour, so it doesn't rely on red alone.
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCcw, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

type ErrorComponentProps = {
  message?: string;
  /** One line on what to try next. */
  hint?: string;
  refreshFunc?: () => void;
  className?: string;
  messageClassName?: string;
  iconClassName?: string;
  icon?: ReactNode;
};

export default function ErrorComponent({
  message = "Something went wrong",
  hint = "This is usually a dropped connection. Try again in a moment.",
  refreshFunc,
  className,
  messageClassName,
  iconClassName,
  icon,
}: ErrorComponentProps) {
  return (
    <div
      role="alert"
      className={cn(
        "surface mx-auto my-xl flex max-w-md flex-col items-center gap-sm p-xl text-center",
        className
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full bg-danger/10",
          iconClassName
        )}
      >
        {icon ?? (
          <TriangleAlert className="h-5 w-5 text-danger" aria-hidden="true" />
        )}
      </span>

      <p
        className={cn(
          "font-display text-base font-bold text-foreground",
          messageClassName
        )}
      >
        {message}
      </p>

      {hint ? (
        <p className="text-balance text-sm text-muted-foreground">{hint}</p>
      ) : null}

      {refreshFunc ? (
        <Button onClick={refreshFunc} className="mt-xs">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Try again
        </Button>
      ) : null}
    </div>
  );
}

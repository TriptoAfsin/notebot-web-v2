/* Hallmark · design-system: design.md
 *
 * The empty state. Previously each page rendered a bare `<Text>No notes
 * available.</Text>` with no shape and no next step; this gives the absence a
 * container and, where there is one, an action.
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export default function EmptyState({
  title,
  hint,
  icon,
  action,
  className,
}: {
  title: string;
  hint?: string;
  icon?: ReactNode;
  action?: { label: string; onClick: () => void };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "surface flex flex-col items-center gap-sm p-2xl text-center",
        className
      )}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-paper-3 text-muted-foreground">
        {icon ?? <Inbox className="h-5 w-5" aria-hidden="true" />}
      </span>

      <p className="font-display text-base font-bold text-foreground">{title}</p>

      {hint ? (
        <p className="text-balance text-sm text-muted-foreground">{hint}</p>
      ) : null}

      {action ? (
        <Button variant="outline" onClick={action.onClick} className="mt-xs">
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}

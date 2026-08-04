/* Hallmark · design-system: design.md
 *
 * Toasts, rebuilt on the token ramp. Changes from the original:
 *  - Hard-coded green/red/yellow/blue Tailwind palettes → the semantic tokens, so
 *    toasts follow the theme instead of shipping their own colour system.
 *  - Added an optional `action`, which is what makes optimistic-delete-with-Undo
 *    possible; without it a reversible action needs a confirmation dialog.
 *  - Auto-dismiss pauses on hover and focus, so a toast carrying an Undo can't
 *    expire while it's being read (WCAG 2.2.1).
 *  - Toasts stack at a fixed corner and never shift page layout.
 *  - `z-toast` from the named scale rather than `z-50`, which sat under the
 *    sticky header.
 */

import { cn } from "@/lib/utils";
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastProps {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: ToastAction;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CircleCheck,
  error: CircleX,
  warning: TriangleAlert,
  info: Info,
} as const;

/** Icon tint only — the surface stays neutral so the text keeps its contrast. */
const iconTone = {
  success: "text-success",
  error: "text-danger",
  warning: "text-danger",
  info: "text-signal",
} as const;

const EXIT_MS = 220;

export function Toast({
  id,
  type,
  title,
  message,
  duration = 5000,
  action,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const Icon = toastIcons[type] ?? CircleAlert;
  const closeTimer = useRef<number | undefined>(undefined);

  const dismiss = useCallback(() => {
    setIsVisible(false);
    closeTimer.current = window.setTimeout(() => onClose(id), EXIT_MS);
  }, [id, onClose]);

  useEffect(() => {
    // Paused while hovered or focused — an Undo must not expire mid-read.
    if (isPaused) return;
    const timer = window.setTimeout(dismiss, duration);
    return () => window.clearTimeout(timer);
  }, [dismiss, duration, isPaused]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className={cn(
        "pointer-events-auto flex items-start gap-sm rounded-card border border-rule",
        "bg-paper p-sm shadow-float",
        "transition-[transform,opacity] duration-short ease-out",
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-1 opacity-0"
      )}
    >
      <Icon
        className={cn("mt-0.5 h-5 w-5 shrink-0", iconTone[type])}
        aria-hidden="true"
      />

      <div className="min-w-0 flex-1">
        {title ? (
          <p className="font-display text-sm font-bold text-foreground">
            {title}
          </p>
        ) : null}
        <p className="break-words text-sm text-ink-2">{message}</p>

        {action ? (
          <button
            type="button"
            onClick={() => {
              action.onClick();
              dismiss();
            }}
            className={cn(
              "affordance mt-xs text-sm font-medium text-signal underline-offset-4",
              "hover:underline",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
            )}
          >
            {action.label}
          </button>
        ) : null}
      </div>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className={cn(
          "-mr-1 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-control",
          "text-muted-foreground transition-colors duration-short ease-out",
          "hover:bg-paper-3 hover:text-foreground",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
        )}
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className={cn(
        // fixed + pointer-events-none so the stack never intercepts clicks or
        // pushes page content around
        "pointer-events-none fixed bottom-4 right-4 z-toast flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-xs",
        "sm:bottom-auto sm:top-20"
      )}
    >
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}

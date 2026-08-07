/* Hallmark · design-system: design.md
 *
 * The update notifier. `registerType: "prompt"` means a new build installs and
 * then waits, so something has to tell the visitor it's there — this is that
 * something.
 *
 * Bottom-anchored on every breakpoint, unlike <ToastContainer>, which flips to
 * the top corner at `sm:`. Two reasons: the installed PWA is the case that
 * matters most here and the bottom edge is where the thumb already is, and this
 * card must not collide with the toast stack, which can be on screen at the same
 * time.
 *
 * It never auto-dismisses. A toast that expires unread would strand someone on a
 * stale build, which is the whole thing we're trying to fix.
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

/**
 * How often an open tab asks whether a newer build shipped.
 *
 * The browser only checks the worker script on navigation, and an installed PWA
 * can sit open for days — without this poll the prompt would appear on cold
 * starts only, which is exactly when a reload is least useful.
 */
const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000;

/**
 * Forces the card open in dev via `?pwa-prompt`, so its layout can be checked at
 * a given width without staging two deploys. `import.meta.env.DEV` is statically
 * false in a production build, so this and the check below are stripped from the
 * bundle.
 */
function isForcedOpen() {
  if (!import.meta.env.DEV || typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("pwa-prompt");
}

export default function PwaUpdatePrompt() {
  const pollRef = useRef<number | undefined>(undefined);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;

      pollRef.current = window.setInterval(() => {
        // Offline, `update()` just rejects; skip the noise.
        if (!navigator.onLine) return;
        void registration.update().catch(() => {
          // A failed check is not worth surfacing — the next tick retries.
        });
      }, UPDATE_CHECK_INTERVAL);
    },
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const isOpen = needRefresh || isForcedOpen();

  useEffect(() => () => window.clearInterval(pollRef.current), []);

  // Mount first, then animate — the card slides in rather than snapping into
  // place. The global prefers-reduced-motion clamp shortens this to 150ms.
  useEffect(() => {
    if (!isOpen) {
      setHasEntered(false);
      return;
    }
    const frame = requestAnimationFrame(() => setHasEntered(true));
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        // pointer-events-none on the rail so the card is the only thing that can
        // intercept a tap near the bottom edge
        "pointer-events-none fixed inset-x-0 bottom-0 z-toast flex justify-center px-md"
      )}
      // clears the home-indicator / system nav bar in the installed PWA
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div
        className={cn(
          "pointer-events-auto flex w-full max-w-md items-center gap-sm",
          "rounded-card border border-rule bg-paper p-sm shadow-float",
          "transition-[transform,opacity] duration-short ease-out",
          hasEntered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        )}
      >
        {/* Decorative, so it's the first thing to go when width is scarce —
            below ~360px those 28px are what keep the label off the ellipsis. */}
        <ArrowUpCircle
          className="hidden h-5 w-5 shrink-0 text-signal min-[360px]:block"
          aria-hidden="true"
        />

        <div className="min-w-0 flex-1">
          {/* `truncate` is the safety net: the label must never wrap onto a
              second line or spill under the Reload button. At 320px it has about
              125px to sit in and needs ~117px, so it fits without ellipsis. */}
          <p className="label-mono truncate">Update available</p>

          {/* Below ~360px the label and the button are the whole message; the
              supporting line only earns its space once there's room for it on
              one line. */}
          <p className="hidden text-sm text-ink-2 min-[360px]:block">
            A new version is ready.
          </p>
        </div>

        <Button
          size="sm"
          disabled={isUpdating}
          onClick={() => {
            setIsUpdating(true);
            // `true` activates the waiting worker and reloads the page for us.
            void updateServiceWorker(true);
          }}
        >
          {isUpdating ? "Updating…" : "Reload"}
        </Button>

        <button
          type="button"
          onClick={() => setNeedRefresh(false)}
          aria-label="Dismiss until next visit"
          className={cn(
            "-mr-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-control",
            "text-muted-foreground transition-colors duration-short ease-out",
            "hover:bg-paper-3 hover:text-foreground",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
          )}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

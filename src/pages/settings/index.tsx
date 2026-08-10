/* Hallmark · macrostructure: Index-First (prose variant) · design-system: design.md
 *
 * Settings. Two jobs, both of which used to require devtools.
 *
 * The app persists its query cache to localStorage and serves it without refetching on mount or
 * focus, so a student can be reading content that changed hours ago with no way to ask for the
 * current version. And because `registerType: "prompt"` installs a new build and then waits, an
 * open tab only learns about it on the hourly poll.
 *
 * Cached content and Tex-GPT history are cleared separately on purpose: someone who wants fresh
 * notes has not asked to lose their conversations.
 */

import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/query-client";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

/** Must match `CACHE_KEY` in lib/query-client.ts. */
const QUERY_CACHE_KEY = "notebot-query-cache";
/** Must match `STORAGE_KEY` in hooks/use-chat-history.ts. */
const CHAT_HISTORY_KEY = "notebot-texgpt-history";

/** localStorage throws in private-mode Safari, so every access is guarded. */
function safeRead(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeRemove(key: string) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

const formatBytes = (n: number) =>
  n < 1024 ? `${n} B` : n < 1024 * 1024 ? `${(n / 1024).toFixed(0)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`;

type Status = { kind: "idle" } | { kind: "busy" } | { kind: "done"; message: string };

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-sm border-t border-rule py-md",
        "sm:flex-row sm:items-center sm:justify-between sm:gap-lg"
      )}
    >
      <div className="min-w-0">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <p className="mt-1 text-xs text-ink-2">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function StatusNote({ status }: { status: Status }) {
  if (status.kind !== "done") return null;
  return (
    <p role="status" aria-live="polite" className="mt-sm flex items-center gap-1.5 text-xs text-ink-2">
      <CheckCircle2 className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
      {status.message}
    </p>
  );
}

export default function SettingsPage() {
  const [cacheSize, setCacheSize] = useState<number | null>(null);
  const [hasHistory, setHasHistory] = useState(false);
  const [contentStatus, setContentStatus] = useState<Status>({ kind: "idle" });
  const [historyStatus, setHistoryStatus] = useState<Status>({ kind: "idle" });
  const [updateStatus, setUpdateStatus] = useState<Status>({ kind: "idle" });

  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      registrationRef.current = registration ?? null;
    },
  });

  const measure = () => {
    const raw = safeRead(QUERY_CACHE_KEY);
    setCacheSize(raw ? raw.length : 0);
    setHasHistory(!!safeRead(CHAT_HISTORY_KEY));
  };

  useEffect(measure, []);

  const clearContent = async () => {
    setContentStatus({ kind: "busy" });

    safeRemove(QUERY_CACHE_KEY);
    // drop what is already in memory too, or the page keeps rendering from it
    queryClient.clear();

    // Runtime caches only. The precache is content-hashed per build and pruned by Workbox's
    // cleanupOutdatedCaches; deleting it here would break offline until the next reload.
    let runtime = 0;
    if ("caches" in window) {
      try {
        const names = await caches.keys();
        const runtimeNames = names.filter((n) => n.startsWith("notebot-"));
        await Promise.all(runtimeNames.map((n) => caches.delete(n)));
        runtime = runtimeNames.length;
      } catch {
        // a refused cache API is not worth failing the whole action over
      }
    }

    measure();
    setContentStatus({
      kind: "done",
      message: runtime
        ? `Cleared. ${runtime} runtime cache${runtime === 1 ? "" : "s"} removed — the next screen you open will load fresh.`
        : "Cleared. The next screen you open will load fresh.",
    });
  };

  const clearHistory = () => {
    setHistoryStatus({ kind: "busy" });
    safeRemove(CHAT_HISTORY_KEY);
    measure();
    setHistoryStatus({ kind: "done", message: "Tex-GPT history removed from this device." });
  };

  const checkForUpdates = async () => {
    setUpdateStatus({ kind: "busy" });

    if (!("serviceWorker" in navigator)) {
      setUpdateStatus({ kind: "done", message: "This browser cannot install updates in the background." });
      return;
    }
    if (!navigator.onLine) {
      setUpdateStatus({ kind: "done", message: "You are offline — reconnect and try again." });
      return;
    }

    try {
      const registration =
        registrationRef.current ?? (await navigator.serviceWorker.getRegistration()) ?? null;
      await registration?.update();
    } catch {
      // update() rejects on a network hiccup; that is not an error worth showing
    }

    // `needRefresh` flips asynchronously once the new worker reaches "waiting", so give the
    // registration a moment before reporting "up to date" — otherwise a real update reads as none.
    await new Promise((r) => setTimeout(r, 1200));
    setUpdateStatus({
      kind: "done",
      message: needRefresh ? "An update is ready to install." : "You are on the latest version.",
    });
  };

  return (
    <div className="container px-md py-lg md:px-lg">
      <header className="mb-lg">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-ink-2">
          NoteBot keeps content on your device so it opens instantly and works offline. If
          something looks out of date, clear it here.
        </p>
      </header>

      <section aria-labelledby="storage-heading">
        <h2 id="storage-heading" className="text-xs font-medium uppercase tracking-wide text-ink-2">
          Storage
        </h2>

        <Row
          title="Cached notes, labs and syllabus"
          description={
            cacheSize === null
              ? "Checking…"
              : cacheSize === 0
                ? "Nothing cached on this device yet."
                : `About ${formatBytes(cacheSize)} stored. Kept for up to 6 hours.`
          }
        >
          <Button
            variant="outline"
            onClick={clearContent}
            disabled={contentStatus.kind === "busy"}
          >
            {contentStatus.kind === "busy" ? (
              <Loader2 className="mr-1.5 animate-spin" aria-hidden="true" />
            ) : (
              <Trash2 className="mr-1.5" aria-hidden="true" />
            )}
            Clear cached content
          </Button>
        </Row>
        <StatusNote status={contentStatus} />

        <Row
          title="Tex-GPT history"
          description={
            hasHistory
              ? "Your conversations are stored on this device only."
              : "No conversations stored."
          }
        >
          <Button
            variant="outline"
            onClick={clearHistory}
            disabled={!hasHistory || historyStatus.kind === "busy"}
          >
            <Trash2 className="mr-1.5" aria-hidden="true" />
            Clear history
          </Button>
        </Row>
        <StatusNote status={historyStatus} />
      </section>

      <section aria-labelledby="updates-heading" className="mt-xl">
        <h2 id="updates-heading" className="text-xs font-medium uppercase tracking-wide text-ink-2">
          App version
        </h2>

        <Row
          title="Check for updates"
          description="A new version installs in the background and waits until you reload."
        >
          {needRefresh ? (
            <Button onClick={() => void updateServiceWorker(true)}>
              <RefreshCw className="mr-1.5" aria-hidden="true" />
              Reload to update
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={checkForUpdates}
              disabled={updateStatus.kind === "busy"}
            >
              {updateStatus.kind === "busy" ? (
                <Loader2 className="mr-1.5 animate-spin" aria-hidden="true" />
              ) : (
                <RefreshCw className="mr-1.5" aria-hidden="true" />
              )}
              Check for updates
            </Button>
          )}
        </Row>
        <StatusNote status={updateStatus} />
      </section>
    </div>
  );
}

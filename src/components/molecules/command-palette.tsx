/* Hallmark · nav: N13 inline ⌘K pill · design-system: design.md
 *
 * The palette behind the header's search pill. Opens on click and on ⌘K / Ctrl-K,
 * closes on Esc or backdrop, ↑/↓ move the selection, Enter navigates. `cmdk` was
 * already a dependency and unused — this is what it was installed for.
 *
 * Per microinteractions.md: the open is instant (no scale-in on the panel), only
 * the selection indicator transitions, and items never re-stagger on filter.
 */

import { Dialog, DialogPortal, DialogTitle } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  BUTEX_NOTES_ARCHIVE,
  LAUNCHER_ITEMS,
  LEVELS,
  Q_BANK_FOLDERS,
} from "@/constants/content-config";
import { APP_CONFIG, APP_HEADER_MENU } from "@/constants/app-config";
import { APP_PATHS } from "@/constants/path-config";
import { labLevelQuery } from "@/hooks/networking/content/lab-report-level-details";
import { noteLevelQuery } from "@/hooks/networking/content/note-level-details";
import { cn } from "@/lib/utils";
import { STALE_TIME } from "@/lib/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { Command } from "cmdk";
import { ArrowUpRight, CornerDownLeft, Home, Search } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
} from "react";
import { useNavigate } from "react-router-dom";
import { FolderIcon, LevelIcon } from "@/components/atoms/icons/dimensional";

type Destination = {
  id: string;
  label: string;
  hint?: string;
  href: string;
  external?: boolean;
  group: string;
  /** Extra words the fuzzy match should see but the row shouldn't show. */
  keywords?: string;
  icon: ReactElement;
};

const ICON = "h-4 w-4 shrink-0";
const ISO = "h-5 w-5 shrink-0";

function buildDestinations(): Destination[] {
  const out: Destination[] = [
    {
      id: "home",
      label: "Home",
      hint: "The launcher",
      href: APP_PATHS.HOME,
      group: "Go to",
      icon: <Home className={ICON} />,
    },
  ];

  for (const item of LAUNCHER_ITEMS) {
    out.push({
      id: item.id,
      label: item.title,
      hint: item.hint,
      href: item.href,
      external: item.isExternal,
      group: "Go to",
      icon: <item.Icon className={ISO} />,
    });
  }

  for (const { level, label, count } of LEVELS) {
    out.push({
      id: `notes-${level}`,
      label: `Notes · ${label}`,
      hint: "Subjects for this level",
      href: `${APP_PATHS.NOTES}/${level}`,
      group: "Notes",
      keywords: `level ${level} notes subjects`,
      icon: <LevelIcon className={ISO} count={count} />,
    });
    out.push({
      id: `labs-${level}`,
      label: `Lab Reports · ${label}`,
      hint: "Subjects for this level",
      href: APP_PATHS.LAB_REPORTS_LEVELS(String(level)),
      group: "Lab Reports",
      keywords: `level ${level} labs reports subjects`,
      icon: <LevelIcon className={ISO} count={count} />,
    });
  }

  for (const folder of Q_BANK_FOLDERS) {
    out.push({
      id: folder.id,
      label: `Q-Bank · ${folder.label}`,
      hint: "Opens Google Drive",
      href: folder.href,
      external: true,
      group: "Question Bank",
      keywords: "question bank past papers drive solves",
      icon: folder.count ? (
        <LevelIcon className={ISO} count={folder.count} />
      ) : (
        <FolderIcon className={ISO} />
      ),
    });
  }

  out.push({
    id: "butex-notes",
    label: BUTEX_NOTES_ARCHIVE.label,
    hint: BUTEX_NOTES_ARCHIVE.hint,
    href: BUTEX_NOTES_ARCHIVE.href,
    external: true,
    group: "Elsewhere",
    icon: <FolderIcon className={ISO} />,
  });

  for (const item of APP_HEADER_MENU) {
    if (!item.isExternal) continue;
    out.push({
      id: `menu-${item.id}-${item.label}`,
      label: item.label,
      hint: "Opens in a new tab",
      href: item.href,
      external: true,
      group: "Elsewhere",
      icon: <ArrowUpRight className={ICON} />,
    });
  }

  return out;
}

/* Built once at module scope — the destination list is static, so rebuilding it
 * per render (or per keystroke) would be pure waste. */
const DESTINATIONS = buildDestinations();

const GROUP_ORDER = [
  "Go to",
  "Notes",
  "Lab Reports",
  "Question Bank",
  "Elsewhere",
] as const;

export default function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const grouped = useMemo(
    () =>
      GROUP_ORDER.map(group => ({
        group,
        items: DESTINATIONS.filter(d => d.group === group),
      })).filter(g => g.items.length > 0),
    []
  );

  // Reset the query when the palette closes so it never reopens mid-search.
  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const select = useCallback(
    (destination: Destination) => {
      onOpenChange(false);
      if (destination.external) {
        window.open(destination.href, "_blank", "noopener,noreferrer");
        return;
      }
      navigate(destination.href, { viewTransition: true });
    },
    [navigate, onOpenChange]
  );

  /* Warm the destination as the selection moves over it, so Enter usually lands
   * on a page that already has its data. */
  const warm = useCallback(
    (id: string) => {
      const notes = /^notes-(\d)$/.exec(id);
      if (notes) {
        void queryClient.prefetchQuery({
          ...noteLevelQuery(notes[1]),
          staleTime: STALE_TIME.content,
        });
        return;
      }
      const labs = /^labs-(\d)$/.exec(id);
      if (labs) {
        void queryClient.prefetchQuery({
          ...labLevelQuery(labs[1]),
          staleTime: STALE_TIME.content,
        });
      }
    },
    [queryClient]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-modal bg-ink/40 backdrop-blur-[2px]",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            /* Centred with `mx-auto`, not `left-1/2 -translate-x-1/2`.
             * tailwindcss-animate's enter keyframes write `transform`, which
             * clobbers a centring translate — that's what made the panel fly in
             * from the side. With no transform in play, the only motion left is
             * the rise + settle below. */
            "fixed inset-x-0 z-modal mx-auto w-[calc(100%-2rem)] max-w-[36rem]",
            "top-4 sm:top-[12vh]",
            "overflow-hidden rounded-card border border-rule bg-paper shadow-float",
            "ease-out",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-3",
            "data-[state=open]:duration-short",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            "data-[state=closed]:zoom-out-95 data-[state=closed]:duration-micro"
          )}
        >
          <DialogTitle className="sr-only">Search NoteBot</DialogTitle>

          <Command
            loop
            // cmdk's own filter is fine; we feed it keywords per item.
            className="flex max-h-[min(28rem,calc(100dvh-6rem))] w-full flex-col"
          >
            <div className="flex items-center gap-sm border-b border-rule px-md">
              <Search
                className="h-4 w-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <Command.Input
                value={search}
                onValueChange={setSearch}
                autoFocus
                placeholder="Search notes, labs, syllabus…"
                className={cn(
                  "h-12 w-full bg-transparent text-base text-foreground",
                  "outline-none placeholder:text-muted-foreground"
                )}
              />
              <kbd className="label-mono hidden rounded border border-rule px-1.5 py-0.5 sm:block">
                esc
              </kbd>
            </div>

            <Command.List className="flex-1 overflow-y-auto overscroll-contain p-xs">
              <Command.Empty className="px-md py-xl text-center text-sm text-muted-foreground">
                Nothing matches “{search}”.
              </Command.Empty>

              {grouped.map(({ group, items }) => (
                <Command.Group
                  key={group}
                  heading={group}
                  className={cn(
                    "[&_[cmdk-group-heading]]:label-mono",
                    "[&_[cmdk-group-heading]]:px-sm [&_[cmdk-group-heading]]:pb-2xs [&_[cmdk-group-heading]]:pt-sm"
                  )}
                >
                  {items.map(item => (
                    <Command.Item
                      key={item.id}
                      value={`${item.label} ${item.keywords ?? ""} ${item.hint ?? ""}`}
                      onSelect={() => select(item)}
                      onMouseEnter={() => warm(item.id)}
                      className={cn(
                        "flex cursor-pointer select-none items-center gap-sm rounded-control px-sm py-2",
                        "text-sm text-foreground",
                        // only the indicator transitions; rows never move
                        "transition-colors duration-micro ease-out",
                        "data-[selected=true]:bg-paper-3"
                      )}
                    >
                      {item.icon}
                      <span className="min-w-0 flex-1 truncate">
                        {item.label}
                      </span>
                      {item.hint ? (
                        <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                          {item.hint}
                        </span>
                      ) : null}
                      {item.external ? (
                        <ArrowUpRight
                          className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                      ) : null}
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}
            </Command.List>

            <div className="flex items-center gap-md border-t border-rule px-md py-2">
              <span className="label-mono flex items-center gap-1.5">
                <kbd className="rounded border border-rule px-1">↑</kbd>
                <kbd className="rounded border border-rule px-1">↓</kbd>
                navigate
              </span>
              <span className="label-mono flex items-center gap-1.5">
                <CornerDownLeft className="h-3 w-3" aria-hidden="true" />
                open
              </span>
              <span className="label-mono ml-auto hidden sm:block">
                {APP_CONFIG.name}
              </span>
            </div>
          </Command>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

/** ⌘K / Ctrl-K, wired once at the shell level. */
export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "k") return;
      if (!event.metaKey && !event.ctrlKey) return;
      event.preventDefault();
      setOpen(previous => !previous);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return { open, setOpen };
}

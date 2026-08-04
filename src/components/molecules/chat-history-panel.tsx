/* Hallmark · design-system: design.md
 *
 * The Tex-GPT history panel. A right-hand sheet listing past conversations,
 * newest first, each reopenable or deletable.
 *
 * Deletion is optimistic with an Undo toast rather than a confirmation dialog —
 * per the microinteractions rules, a reversible action doesn't earn a modal. The
 * row disappears immediately and comes back if Undo is pressed.
 */

import EmptyState from "@/components/molecules/empty-state";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Conversation } from "@/hooks/use-chat-history";
import { cn } from "@/lib/utils";
import { staggerStyle } from "@/lib/motion";
import { MessageSquare, Trash2 } from "lucide-react";

function relativeDay(timestamp: number): string {
  const now = new Date();
  const then = new Date(timestamp);
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  const dayMs = 86_400_000;

  if (timestamp >= startOfToday) {
    return then.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (timestamp >= startOfToday - dayMs) return "Yesterday";
  if (timestamp >= startOfToday - dayMs * 6) {
    return then.toLocaleDateString([], { weekday: "long" });
  }
  return then.toLocaleDateString([], { day: "numeric", month: "short" });
}

export default function ChatHistoryPanel({
  open,
  onOpenChange,
  conversations,
  activeId,
  onOpenConversation,
  onDelete,
  onClearAll,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversations: readonly Conversation[];
  activeId: string | null;
  onOpenConversation: (conversation: Conversation) => void;
  onDelete: (conversation: Conversation) => void;
  onClearAll: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[min(24rem,90vw)] gap-sm">
        <SheetHeader className="pr-12">
          <SheetTitle>History</SheetTitle>
          <p className="label-mono">
            {conversations.length === 0
              ? "Nothing saved yet"
              : `${conversations.length} saved on this device`}
          </p>
        </SheetHeader>

        {conversations.length === 0 ? (
          <EmptyState
            title="No conversations yet"
            hint="Ask Tex-GPT something and it'll be saved here for next time."
            icon={<MessageSquare className="h-5 w-5" aria-hidden="true" />}
            className="mt-md"
          />
        ) : (
          <>
            <ul className="-mx-2xs min-h-0 flex-1 space-y-3xs overflow-y-auto overscroll-contain">
              {conversations.map((conversation, index) => {
                const isActive = conversation.id === activeId;
                const exchanges = conversation.messages.filter(
                  m => m.type === "user"
                ).length;

                return (
                  <li
                    key={conversation.id}
                    className="reveal"
                    style={staggerStyle(index)}
                  >
                    <div
                      className={cn(
                        "group/row relative flex items-start gap-2xs rounded-control",
                        "transition-colors duration-short ease-out",
                        isActive ? "bg-paper-3" : "hover:bg-paper-3"
                      )}
                    >
                      {isActive ? (
                        <span
                          aria-hidden="true"
                          className="absolute inset-y-1.5 left-0 w-[2px] rounded-full bg-signal"
                        />
                      ) : null}

                      <button
                        type="button"
                        onClick={() => onOpenConversation(conversation)}
                        aria-current={isActive ? "true" : undefined}
                        className={cn(
                          "min-w-0 flex-1 rounded-control px-sm py-2 text-left",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
                        )}
                      >
                        <span
                          className={cn(
                            "line-clamp-2 text-sm",
                            isActive
                              ? "font-medium text-foreground"
                              : "text-ink-2"
                          )}
                        >
                          {conversation.title}
                        </span>
                        <span className="label-mono mt-0.5 block">
                          {relativeDay(conversation.updatedAt)} ·{" "}
                          <span className="tabular">{exchanges}</span>{" "}
                          {exchanges === 1 ? "question" : "questions"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(conversation)}
                        aria-label={`Delete “${conversation.title}”`}
                        className={cn(
                          "mr-1 mt-1.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-control",
                          "text-muted-foreground transition-colors duration-short ease-out",
                          "hover:bg-danger/10 hover:text-danger",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
                          // revealed on hover for fine pointers, always present
                          // for touch — a hover-only control is unreachable there
                          "opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100",
                          "[@media(pointer:coarse)]:opacity-100"
                        )}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto border-t border-rule pt-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="w-full text-muted-foreground hover:text-danger"
              >
                <Trash2 aria-hidden="true" />
                Clear all history
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

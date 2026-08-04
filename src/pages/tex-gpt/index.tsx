/* Hallmark · macrostructure: Workbench · design-system: design.md · designed-as-app
 *
 * Tex-GPT. The conversation state machine is unchanged — same messages, same
 * limit cookie, same retry and PDF paths. What changed is the surface:
 *
 *  - Message rows are on the token surfaces, with a real avatar column and the
 *    references folded into a disclosure instead of an ad-hoc toggle.
 *  - The pending row shows a staged label plus a caret where the answer will be
 *    written, rather than a generic spinner.
 *  - Answers reveal block by block (`.ai-answer`, ~460ms regardless of length)
 *    instead of appearing in one jump. Not a per-character typewriter: that
 *    makes long answers slow to read for no benefit.
 *  - `alert()` calls are replaced by the toast system that was already here.
 *  - The 1.46 MB PDF renderer is imported on click rather than with the route.
 *  - The `h-[calc(100vh-100px)]` magic number is gone; the column sizes itself.
 */

import { Box } from "@/components/atoms/layout";
import TexGptMark from "@/components/atoms/icons/tex-gpt-mark";
import UserAvatar from "@/components/atoms/user-avatar";
import ChatHistoryPanel from "@/components/molecules/chat-history-panel";
import ThinkingRow from "@/components/molecules/thinking-row";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/ui/markdown";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { PromptSuggestion } from "@/components/ui/prompt-suggestion";
import { ToastContainer } from "@/components/ui/toast";
import { APP_CONFIG } from "@/constants/app-config";
import { useAutoRagSearch } from "@/hooks/networking/ai/auto-rag-search";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { validateContent } from "@/utils/content-filter";
import {
  checkAndUpdateMessageLimit,
  getCookie,
  MESSAGE_LIMIT_KEY,
  setCookie,
} from "@/utils/cookie-utils";
import {
  type Conversation,
  useChatHistory,
} from "@/hooks/use-chat-history";
import {
  ChevronDown,
  Download,
  FileText,
  History,
  Plus,
  RotateCcw,
  Send,
  TriangleAlert,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  isError?: boolean;
  references?: Array<{
    filename: string;
    score: number;
  }>;
};

/** Stable id for the thread being written, so history updates it in place. */
function newConversationId() {
  return `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

const SUGGESTED_PROMPTS = [
  "What is yarn?",
  "What is fabric?",
  "What is textile?",
  "What is yarn count?",
];

const MAX_QUERY_LENGTH = 300;

export default function TexGptPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuery, setCurrentQuery] = useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [expandedReferences, setExpandedReferences] = useState<Set<string>>(
    new Set()
  );
  const [remainingMessages, setRemainingMessages] = useState<number>(
    APP_CONFIG.limit.texGpt
  );
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { toasts, showToast, removeToast } = useToast();

  /* --- History ------------------------------------------------------------
   * The thread being written owns a stable id, so each new message updates the
   * same history entry rather than appending a duplicate. */
  const history = useChatHistory();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [conversationId, setConversationId] = useState(newConversationId);

  const {
    mutate: performSearch,
    loading: isSearching,
    data: searchResult,
    error,
    isSuccess,
    reset,
  } = useAutoRagSearch();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages, isWaitingForResponse]);

  useEffect(() => {
    if (searchResult && isSuccess) {
      if (searchResult.success) {
        const references =
          searchResult.result?.data?.map(item => ({
            filename: item.filename,
            score: item.score,
          })) || [];

        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            type: "assistant",
            content:
              searchResult.result?.response ||
              "I couldn't find a relevant response.",
            timestamp: new Date(),
            references,
          },
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            type: "assistant",
            content:
              "Sorry, I encountered an error while processing your request.",
            timestamp: new Date(),
            isError: true,
          },
        ]);
      }

      setIsWaitingForResponse(false);
    }
  }, [searchResult, isSuccess]);

  useEffect(() => {
    if (error) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "assistant",
          content: error.message,
          timestamp: new Date(),
          isError: true,
        },
      ]);
      setIsWaitingForResponse(false);
    }
  }, [error]);

  useEffect(() => {
    const stored = getCookie(MESSAGE_LIMIT_KEY);
    const today = new Date().toISOString().split("T")[0];
    if (stored?.date === today) {
      setRemainingMessages(
        APP_CONFIG.limit.texGpt - Number(stored?.count || 0)
      );
    } else {
      setCookie(MESSAGE_LIMIT_KEY, { count: 0, date: today });
      setRemainingMessages(APP_CONFIG.limit.texGpt);
    }
  }, []);

  const isOverLength = currentQuery.length > MAX_QUERY_LENGTH;
  const canSubmit =
    Boolean(currentQuery.trim()) &&
    !isWaitingForResponse &&
    !isOverLength &&
    remainingMessages > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;

    const contentValidation = validateContent(currentQuery.trim());
    if (!contentValidation.isValid) {
      showToast(
        "error",
        contentValidation.reason || "Invalid content detected",
        "Content blocked"
      );
      return;
    }

    const { canSendMessage: canSend, remainingMessages: remaining } =
      checkAndUpdateMessageLimit();
    setRemainingMessages(remaining);
    if (!canSend) return;

    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "user",
        content: currentQuery.trim(),
        timestamp: new Date(),
      },
    ]);

    let queryToSend = currentQuery.trim();
    const lastUserMessage = [...messages]
      .reverse()
      .find(msg => msg.type === "user");
    if (lastUserMessage) {
      queryToSend = `Current query: ${currentQuery.trim()}\n\nPrevious question: ${lastUserMessage.content}`;
    }

    setIsWaitingForResponse(true);
    performSearch(queryToSend);
    setCurrentQuery("");
  };

  /* Persist the thread as it grows, so a reload resumes it instead of losing it.
   * Keyed on the id, so this updates one entry rather than accumulating. */
  useEffect(() => {
    if (messages.length === 0) return;
    history.save(conversationId, messages);
    // `history.save` is a stable useCallback; including the whole object would
    // re-run this on every list mutation it makes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, conversationId]);

  /** Start a fresh thread. The previous one stays in history. */
  const handleNewChat = useCallback(() => {
    setMessages([]);
    setCurrentQuery("");
    setIsWaitingForResponse(false);
    setConversationId(newConversationId());
    reset();
  }, [reset]);

  const handleOpenConversation = useCallback(
    (conversation: Conversation) => {
      setIsHistoryOpen(false);
      setIsWaitingForResponse(false);
      reset();
      setConversationId(conversation.id);
      setMessages(conversation.messages);
      setCurrentQuery("");
    },
    [reset]
  );

  /* Optimistic delete + Undo, not a confirmation dialog — the row goes
   * immediately and comes back if Undo is pressed. */
  const handleDeleteConversation = useCallback(
    (conversation: Conversation) => {
      history.remove(conversation.id);
      if (conversation.id === conversationId) handleNewChat();
      showToast(
        "info",
        `Deleted “${conversation.title}”`,
        undefined,
        7000,
        { label: "Undo", onClick: () => history.restore(conversation) }
      );
    },
    [conversationId, handleNewChat, history, showToast]
  );

  const handleClearAllHistory = useCallback(() => {
    const snapshot = history.conversations;
    history.clear();
    handleNewChat();
    showToast(
      "info",
      `Cleared ${snapshot.length} conversation${snapshot.length === 1 ? "" : "s"}`,
      undefined,
      7000,
      {
        label: "Undo",
        onClick: () => snapshot.forEach(c => history.restore(c)),
      }
    );
  }, [handleNewChat, history, showToast]);

  const handleRetry = () => {
    const lastUserMessage = [...messages]
      .reverse()
      .find(msg => msg.type === "user");
    if (!lastUserMessage) return;
    setIsWaitingForResponse(true);
    performSearch(lastUserMessage.content);
  };

  const toggleReferences = (messageId: string) => {
    setExpandedReferences(prev => {
      const next = new Set(prev);
      if (next.has(messageId)) next.delete(messageId);
      else next.add(messageId);
      return next;
    });
  };

  const handleSavePDF = async () => {
    if (messages.length === 0) return;

    setIsGeneratingPDF(true);
    try {
      /* Imported here, not at module scope: @react-pdf/renderer is ~1.4 MB and
       * most visitors never export a transcript. */
      const { generateConversationPDF, generateSimplifiedPDF } = await import(
        "@/utils/pdf-generator"
      );

      if (await generateConversationPDF(messages)) return;

      if (await generateSimplifiedPDF(messages)) {
        showToast(
          "info",
          "Saved a simplified PDF — some formatting was reduced.",
          "Downloaded"
        );
        return;
      }

      showToast(
        "error",
        "Couldn't build the PDF. Try again with a shorter conversation.",
        "Export failed"
      );
    } catch {
      showToast(
        "error",
        "Couldn't build the PDF. Try again in a moment.",
        "Export failed"
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const hasAnswer = messages.some(m => m.type === "assistant" && !m.isError);

  return (
    <div className="flex min-h-[calc(100dvh-13rem)] flex-col">
      {/* --- Transcript actions -------------------------------------------
       * History and New chat are always available; the export and reset only
       * appear once there's something to act on. */}
      <div className="shrink-0 border-b border-rule bg-paper-2">
        {/* All actions group hard-right, matching the app header's own
            brand-left / controls-right rhythm. */}
        <div className="container flex items-center justify-end gap-xs px-md py-sm md:px-lg">
          {hasAnswer ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSavePDF}
              disabled={isGeneratingPDF}
              className="w-32"
            >
              <Download aria-hidden="true" />
              {isGeneratingPDF ? "Building…" : "Save PDF"}
            </Button>
          ) : null}

          {messages.length > 0 ? (
            <Button variant="ghost" size="sm" onClick={handleNewChat}>
              <Plus aria-hidden="true" />
              <span className="affordance">New chat</span>
            </Button>
          ) : null}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsHistoryOpen(true)}
          >
            <History aria-hidden="true" />
            <span className="affordance">History</span>
            {history.conversations.length > 0 ? (
              <span className="label-mono tabular ml-0.5">
                {history.conversations.length}
              </span>
            ) : null}
          </Button>
        </div>
      </div>

      {/* --- Transcript ---------------------------------------------------- */}
      <div className="flex-1 px-md py-lg md:px-lg">
        {messages.length === 0 ? (
          /* The mark and title are centred; the lede and the suggestion block
             are left-flush. Stacking all four on one centred axis is the
             centred-everything hero tell — two centred elements is the cap. */
          <div className="mx-auto max-w-2xl py-xl">
            <div className="flex flex-col items-center">
              <TexGptMark className="reveal h-24 w-24" title="Tex-GPT" />
              <h1
                className="reveal mt-sm font-display text-xl font-bold"
                style={{ ["--i" as string]: 1 }}
              >
                Tex-GPT
              </h1>
            </div>

            <p
              className="reveal mt-lg max-w-[62ch] text-base text-muted-foreground"
              style={{ ["--i" as string]: 2 }}
            >
              Ask about yarn, fabric, dyeing, machinery — anything textile.
              Answers are drawn from NoteBot's own document set and cite the
              files they came from.
            </p>

            <div className="reveal mt-xl" style={{ ["--i" as string]: 3 }}>
              <div className="mb-sm flex items-center gap-sm">
                <h2 className="label-mono">Try one of these</h2>
                <span aria-hidden="true" className="h-px flex-1 bg-rule" />
              </div>
              <div className="grid gap-xs sm:grid-cols-2">
                {SUGGESTED_PROMPTS.map(prompt => (
                  <PromptSuggestion
                    key={prompt}
                    onClick={() => setCurrentQuery(prompt)}
                  >
                    {prompt}
                  </PromptSuggestion>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-lg">
            {messages.map(message => {
              const isUser = message.type === "user";
              const referenceCount = message.references?.length ?? 0;
              const isOpen = expandedReferences.has(message.id);

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-sm",
                    isUser ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {/* avatar column */}
                  <div className="shrink-0 pt-0.5">
                    {isUser ? (
                      <UserAvatar />
                    ) : (
                      <TexGptMark className="h-8 w-8" title="Tex-GPT" />
                    )}
                  </div>

                  <div
                    className={cn(
                      "min-w-0 max-w-[min(46rem,86%)] rounded-card px-md py-sm",
                      isUser
                        ? "border border-signal/25 bg-signal/10"
                        : message.isError
                          ? "border border-danger/30 bg-danger/5"
                          : "border border-rule bg-paper-2"
                    )}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap break-words text-base text-foreground">
                        {message.content}
                      </p>
                    ) : message.isError ? (
                      <div className="space-y-sm">
                        <p className="flex items-start gap-xs text-sm text-danger">
                          <TriangleAlert
                            className="mt-0.5 h-4 w-4 shrink-0"
                            aria-hidden="true"
                          />
                          {message.content}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRetry}
                          disabled={isWaitingForResponse}
                        >
                          <RotateCcw aria-hidden="true" />
                          Try again
                        </Button>
                      </div>
                    ) : (
                      <Markdown
                        className={cn(
                          // block-by-block reveal, length-independent
                          "ai-answer prose prose-sm dark:prose-invert",
                          // measure capped at a readable 70ch — chat bubbles
                          // conventionally run wider, but prose past ~75ch
                          // loses the eye on the return sweep
                          "max-w-[70ch] break-words",
                          "[&_*]:break-words [&_code]:break-all",
                          "[&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap"
                        )}
                      >
                        {message.content}
                      </Markdown>
                    )}

                    {/* meta row */}
                    <div className="mt-xs flex items-center gap-sm">
                      <time
                        className="label-mono"
                        dateTime={message.timestamp.toISOString()}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>

                      {!isUser && !message.isError ? (
                        <button
                          type="button"
                          onClick={() => toggleReferences(message.id)}
                          aria-expanded={isOpen}
                          className={cn(
                            "ml-auto inline-flex items-center gap-1.5 rounded-sm",
                            "label-mono transition-colors duration-short ease-out",
                            "hover:text-foreground",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
                          )}
                        >
                          <FileText className="h-3 w-3" aria-hidden="true" />
                          {referenceCount > 0
                            ? `${referenceCount} source${referenceCount === 1 ? "" : "s"}`
                            : "No sources"}
                          <ChevronDown
                            className={cn(
                              "h-3 w-3 transition-transform duration-short ease-out",
                              isOpen && "rotate-180"
                            )}
                            aria-hidden="true"
                          />
                        </button>
                      ) : null}
                    </div>

                    {!isUser && !message.isError && isOpen ? (
                      <div className="mt-sm space-y-2xs border-t border-rule pt-sm">
                        {referenceCount > 0 ? (
                          message.references!.slice(0, 10).map(reference => (
                            <div
                              key={reference.filename}
                              className="flex items-center gap-sm rounded-control bg-paper-3 px-sm py-1.5"
                            >
                              <span className="min-w-0 flex-1 truncate text-xs text-ink-2">
                                {reference.filename}
                              </span>
                              <span className="label-mono tabular shrink-0">
                                {(reference.score * 100).toFixed(0)}%
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            This answer wasn't matched to a source document.
                          </p>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}

            {/* --- Pending row --------------------------------------------- */}
            {isWaitingForResponse ? (
              <ThinkingRow isRetrieving={isSearching} />
            ) : null}

            <Box ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* --- Composer ------------------------------------------------------ */}
      <div className="sticky bottom-0 shrink-0 border-t border-rule bg-paper/90 backdrop-blur-md">
        <div
          className="mx-auto max-w-3xl px-md py-md md:px-lg"
          // the composer is the bottom-most control in the installed PWA, so it
          // has to clear the home indicator itself
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          {remainingMessages <= 0 ? (
            <p
              role="status"
              className="mb-sm flex items-center gap-xs rounded-control border border-rule bg-paper-3 px-sm py-2 text-sm text-ink-2"
            >
              <TriangleAlert
                className="h-4 w-4 shrink-0 text-danger"
                aria-hidden="true"
              />
              You've used today's {APP_CONFIG.limit.texGpt} questions. The
              allowance resets tomorrow.
            </p>
          ) : null}

          <PromptInput
            value={currentQuery}
            onValueChange={setCurrentQuery}
            onSubmit={handleSubmit}
            isLoading={isWaitingForResponse}
          >
            <PromptInputTextarea
              placeholder={
                remainingMessages > 0
                  ? "Ask about yarn, fabric, dyeing…"
                  : "Daily limit reached"
              }
              disabled={isWaitingForResponse || remainingMessages <= 0}
            />
            <PromptInputActions className="justify-end pr-1">
              <PromptInputAction tooltip="Send · Enter">
                <Button
                  size="icon"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  aria-label="Send message"
                >
                  <Send aria-hidden="true" />
                </Button>
              </PromptInputAction>
            </PromptInputActions>
          </PromptInput>

          <div className="mt-xs flex items-center justify-between gap-sm">
            <span className="label-mono">
              {remainingMessages > 0
                ? `${remainingMessages} left today`
                : "Limit reached"}
            </span>
            <span
              className={cn(
                "label-mono tabular",
                isOverLength && "text-danger"
              )}
            >
              {currentQuery.length}/{MAX_QUERY_LENGTH}
            </span>
          </div>
        </div>
      </div>

      <ChatHistoryPanel
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        conversations={history.conversations}
        activeId={messages.length > 0 ? conversationId : null}
        onOpenConversation={handleOpenConversation}
        onDelete={handleDeleteConversation}
        onClearAll={handleClearAllHistory}
      />

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

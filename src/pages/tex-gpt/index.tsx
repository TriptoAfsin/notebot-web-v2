import { Box } from "@/components/atoms/layout";
import { TextEffect } from "@/components/atoms/typography/text-effect";
import AnimatingContainer from "@/components/Layout/AnimatingContainer";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
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
  generateConversationPDF,
  generateSimplifiedPDF,
} from "@/utils/pdf-generator";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  RefreshCw,
  RotateCcw,
  Send,
  User2Icon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

const SUGGESTED_PROMPTS = [
  "What is yarn?",
  "What is fabric?",
  "What is textile?",
  "What is yarn count?",
];

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
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { toasts, showToast, removeToast } = useToast();

  const {
    mutate: performSearch,
    loading: isSearching,
    data: searchResult,
    error,
    isSuccess,
    reset,
  } = useAutoRagSearch();

  const scrollToBottom = () => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    // Small delay to ensure DOM is updated before scrolling
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages, isWaitingForResponse]);

  useEffect(() => {
    if (searchResult && isSuccess) {
      if (searchResult.success) {
        // Extract references from the data
        const references =
          searchResult.result?.data?.map((item: any) => ({
            filename: item.filename,
            score: item.score,
          })) || [];

        const assistantMessage: Message = {
          id: Date.now().toString(),
          type: "assistant",
          content:
            searchResult.result?.response ||
            "I couldn't find a relevant response.",
          timestamp: new Date(),
          references,
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Handle API error response
        const errorMessage: Message = {
          id: Date.now().toString(),
          type: "assistant",
          content:
            "Sorry, I encountered an error while processing your request.",
          timestamp: new Date(),
          isError: true,
        };

        setMessages(prev => [...prev, errorMessage]);
      }

      setIsWaitingForResponse(false);
    }
  }, [searchResult, isSuccess]);

  useEffect(() => {
    if (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: "Sorry, I encountered an error while processing your request.",
        timestamp: new Date(),
        isError: true,
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsWaitingForResponse(false);
    }
  }, [error]);

  //count
  useEffect(() => {
    const currentUserMessageCountFromCookie = getCookie(MESSAGE_LIMIT_KEY);
    const today = new Date().toISOString().split("T")[0];
    if (currentUserMessageCountFromCookie?.date === today) {
      setRemainingMessages(
        APP_CONFIG.limit.texGpt -
          Number(currentUserMessageCountFromCookie?.count || 0)
      );
    } else {
      // console.log(`Today: ${today}, resetting cookie`);
      setCookie(MESSAGE_LIMIT_KEY, {
        count: 0,
        date: today,
      });
      setRemainingMessages(APP_CONFIG.limit.texGpt);
    }
    // setRemainingMessages(currentUserMessageCountFromCookie);
  }, []);

  const handleSubmit = () => {
    if (
      !currentQuery.trim() ||
      isWaitingForResponse ||
      currentQuery.length > 300 ||
      remainingMessages <= 0
    )
      return;

    // Validate content before proceeding
    const contentValidation = validateContent(currentQuery.trim());
    if (!contentValidation.isValid) {
      showToast(
        "error",
        contentValidation.reason || "Invalid content detected",
        "Content Blocked"
      );
      return;
    }

    // Check message limit
    const { canSendMessage: canSend, remainingMessages: remaining } =
      checkAndUpdateMessageLimit();
    setRemainingMessages(remaining);

    if (!canSend) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: currentQuery.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // If there's already a conversation, include the last user message in the query
    let queryToSend = currentQuery.trim();
    if (messages.length > 0) {
      // Find the last user message
      const lastUserMessage = [...messages]
        .reverse()
        .find(msg => msg.type === "user");
      if (lastUserMessage) {
        queryToSend = `Current query: ${currentQuery.trim()}\n\nPrevious question: ${
          lastUserMessage.content
        }`;
      }
    }

    setIsWaitingForResponse(true);
    performSearch(queryToSend);
    setCurrentQuery("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentQuery(suggestion);
  };

  const handleClearChat = () => {
    setMessages([]);
    setCurrentQuery("");
    setIsWaitingForResponse(false);
    reset();
  };

  const handleRetry = () => {
    // Find the last user message to retry
    const lastUserMessage = [...messages]
      .reverse()
      .find(msg => msg.type === "user");

    if (lastUserMessage) {
      setIsWaitingForResponse(true);
      performSearch(lastUserMessage.content);
    }
  };

  const toggleReferences = (messageId: string) => {
    setExpandedReferences(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSavePDF = async () => {
    if (messages.length === 0) return;

    setIsGeneratingPDF(true);
    try {
      // First try the regular PDF generation
      const success = await generateConversationPDF(messages);
      if (!success) {
        // If regular PDF fails, try simplified version
        console.log(
          "Regular PDF generation failed, trying simplified version..."
        );
        const simplifiedSuccess = await generateSimplifiedPDF(messages);
        if (!simplifiedSuccess) {
          alert("Failed to generate PDF. Please try again or contact support.");
        } else {
          alert(
            "Generated a simplified PDF due to memory constraints. Some formatting may be reduced."
          );
        }
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Try simplified version as fallback
      try {
        console.log("Attempting simplified PDF as fallback...");
        const simplifiedSuccess = await generateSimplifiedPDF(messages);
        if (simplifiedSuccess) {
          alert(
            "Generated a simplified PDF due to technical issues. Some formatting may be reduced."
          );
        } else {
          alert(
            "Failed to generate PDF. Please try again later or contact support."
          );
        }
      } catch (fallbackError) {
        console.error("Fallback PDF generation also failed:", fallbackError);
        alert("Unable to generate PDF at this time. Please try again later.");
      }
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Box className="flex flex-col h-[calc(100vh-100px)] bg-background">
      {/* Header */}
      {messages?.length > 0 &&
        messages?.some(msg => msg?.type === "assistant" && !msg?.isError) && (
          <div className="flex-shrink-0 px-6 py-4 border-b border-border bg-card/50">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSavePDF}
                disabled={isGeneratingPDF || messages.length === 0}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                {isGeneratingPDF ? "Generating..." : "Save PDF"}
              </Button>
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearChat}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear Chat
                </Button>
              </div>
            </div>
          </div>
        )}

      {/* Messages Area */}
      <Box className="flex-1 min-h-0">
        <Box
          ref={messagesContainerRef}
          className="h-full px-6 py-4 pb-6 overflow-y-auto"
        >
          {messages?.length === 0 ? (
            <Box className="flex flex-col items-center justify-center h-full space-y-8">
              <AnimatingContainer animation="zoomIn" duration={0.8}>
                <img
                  src="/icons/tex-gpt.png"
                  alt="TexGPT"
                  className="size-24"
                />
              </AnimatingContainer>

              <Box className="text-center">
                <TextEffect className="text-xl font-semibold">
                  Welcome to TexGPT
                </TextEffect>
                <AnimatingContainer animation="slideDown" duration={0.8}>
                  <p className="max-w-md text-muted-foreground">
                    Ask me anything relevant to textile industry! I'm powered by
                    advanced RAG technology to provide accurate and contextual
                    responses.
                  </p>
                </AnimatingContainer>
              </Box>

              {/* Suggested Prompts */}
              <Box className="w-full max-w-2xl space-y-3">
                <h3 className="text-sm font-medium text-center text-muted-foreground">
                  Try asking about:
                </h3>
                <Box className="grid gap-2 sm:grid-cols-2">
                  {SUGGESTED_PROMPTS.map((prompt, index) => (
                    <PromptSuggestion
                      key={index}
                      onClick={() => handleSuggestionClick(prompt)}
                      className="text-left"
                    >
                      {prompt}
                    </PromptSuggestion>
                  ))}
                </Box>
              </Box>
            </Box>
          ) : (
            <Box className="max-w-4xl mx-auto space-y-6">
              {messages?.map(message => (
                <Box
                  key={message.id}
                  className={cn(
                    "flex gap-4",
                    message.type === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.type === "assistant" && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ">
                      <img
                        src="/icons/tex-gpt.png"
                        alt="TexGPT"
                        className="w-6 h-6"
                      />
                    </div>
                  )}

                  <Box
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 break-words overflow-hidden",
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <Box className="space-y-2">
                      {message.type === "assistant" ? (
                        message.isError ? (
                          <Box className="space-y-3">
                            <p className="text-sm text-red-600 break-words dark:text-red-400">
                              {message.content}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleRetry}
                              className="gap-2"
                              disabled={isWaitingForResponse}
                            >
                              <RefreshCw className="w-4 h-4" />
                              Retry
                            </Button>
                          </Box>
                        ) : (
                          <Markdown className="prose-sm prose max-w-none break-words dark:prose-invert [&_*]:break-words [&_code]:break-all [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap">
                            {message.content}
                          </Markdown>
                        )
                      ) : (
                        <p className="text-sm break-words">{message.content}</p>
                      )}

                      <Box className="flex items-center justify-between">
                        <span className="text-xs opacity-70">
                          {formatTimestamp(message.timestamp)}
                        </span>
                        {message.type === "assistant" && !message.isError && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleReferences(message.id)}
                            className="h-auto p-1 text-xs opacity-70 hover:opacity-100"
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            {message.references && message.references.length > 0
                              ? `${message.references.length} reference${
                                  message.references.length !== 1 ? "s" : ""
                                }`
                              : "No references"}
                            {expandedReferences.has(message.id) ? (
                              <ChevronUp className="w-3 h-3 ml-1" />
                            ) : (
                              <ChevronDown className="w-3 h-3 ml-1" />
                            )}
                          </Button>
                        )}
                      </Box>
                    </Box>

                    {/* References */}
                    {message.type === "assistant" &&
                      !message.isError &&
                      expandedReferences.has(message.id) && (
                        <Box className="pt-3 mt-3 space-y-2 border-t border-border/50">
                          <p className="text-xs font-medium opacity-70">
                            References:
                          </p>
                          {message.references &&
                          message.references.length > 0 ? (
                            <Box className="space-y-1">
                              {message.references
                                .slice(0, 10)
                                .map((reference, index) => (
                                  <Box
                                    key={index}
                                    className="p-2 text-xs rounded-lg bg-background/50"
                                  >
                                    <Box className="flex items-center justify-between">
                                      <p className="font-medium break-words truncate opacity-90">
                                        {reference.filename}
                                      </p>
                                      <span className="ml-2 text-xs opacity-60 shrink-0">
                                        {(reference.score * 100).toFixed(1)}%
                                      </span>
                                    </Box>
                                  </Box>
                                ))}
                            </Box>
                          ) : (
                            <p className="text-xs opacity-60">
                              No references found for this response.
                            </p>
                          )}
                        </Box>
                      )}
                  </Box>

                  {message.type === "user" && (
                    <Box className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 bg-muted">
                      <Box
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shrink-0"
                        title="You"
                      >
                        <User2Icon className="w-6 h-6 text-primary-foreground" />
                      </Box>
                    </Box>
                  )}
                </Box>
              ))}

              {/* Loading State */}
              {isWaitingForResponse && (
                <Box className="flex justify-start gap-4">
                  <Box
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shrink-0"
                    title="TexGPT"
                  >
                    <img
                      src="/icons/tex-gpt.png"
                      alt="TexGPT"
                      className="w-6 h-6"
                    />
                  </Box>
                  <Box className="max-w-[80%] rounded-2xl bg-muted px-4 py-3">
                    <Box className="flex items-center gap-3">
                      <Loader variant="typing" size="sm" />
                      <span className="text-sm text-muted-foreground">
                        {isSearching
                          ? "Searching knowledge base..."
                          : "Thinking..."}
                      </span>
                    </Box>
                  </Box>
                </Box>
              )}

              <Box ref={messagesEndRef} />
            </Box>
          )}
        </Box>
      </Box>

      {/* Input Area */}
      <Box className="flex-shrink-0 p-6 border-t border-border bg-card/50">
        <Box className="max-w-4xl mx-auto space-y-2">
          {remainingMessages <= 0 ? (
            <Box className="flex items-center gap-2 p-3 mb-2 text-sm text-yellow-600 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400">
              <AlertCircle className="w-4 h-4" />
              <span>
                You've reached your daily message limit. Please try again
                tomorrow.
              </span>
            </Box>
          ) : remainingMessages <= 5 ? (
            <Box className="flex items-center gap-2 p-3 mb-2 text-sm text-yellow-600 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400">
              <AlertCircle className="w-4 h-4" />
              <span>
                You have {remainingMessages} message
                {remainingMessages !== 1 ? "s" : ""} remaining today.
              </span>
            </Box>
          ) : null}

          <PromptInput
            value={currentQuery}
            onValueChange={setCurrentQuery}
            onSubmit={handleSubmit}
            isLoading={isWaitingForResponse}
            className="shadow-lg"
          >
            <PromptInputTextarea
              placeholder={
                remainingMessages > 0
                  ? "Ask me anything..."
                  : "Daily message limit reached"
              }
              className="text-base"
              disabled={isWaitingForResponse || remainingMessages <= 0}
            />
            <PromptInputActions>
              <PromptInputAction tooltip="Send message">
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={
                    !currentQuery.trim() ||
                    isWaitingForResponse ||
                    currentQuery.length > 300 ||
                    remainingMessages <= 0
                  }
                  className="rounded-full"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </PromptInputAction>
            </PromptInputActions>
          </PromptInput>

          {/* Character Counter and Messages Remaining */}
          <Box className="flex justify-between">
            <span className="text-xs text-muted-foreground">
              {remainingMessages > 0 &&
                `${remainingMessages} message${
                  remainingMessages !== 1 ? "s" : ""
                } remaining today`}
            </span>
            <span
              className={cn(
                "text-xs",
                currentQuery.length > 300
                  ? "text-red-500"
                  : "text-muted-foreground"
              )}
            >
              {currentQuery.length}/300
            </span>
          </Box>
        </Box>
      </Box>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </Box>
  );
}

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
import { useAutoRagSearch } from "@/hooks/networking/ai/auto-rag-search";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
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
  originalQuery?: string;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [shouldSearch, setShouldSearch] = useState(false);
  const [expandedReferences, setExpandedReferences] = useState<Set<string>>(
    new Set()
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    data: searchResult,
    isLoading: isSearching,
    error,
  } = useAutoRagSearch(searchQuery, shouldSearch && searchQuery.length > 0);

  console.log(`searchResult`, searchResult);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (searchResult && shouldSearch) {
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
          originalQuery: searchQuery,
        };

        setMessages(prev => [...prev, errorMessage]);
      }

      setIsWaitingForResponse(false);
      setShouldSearch(false);
      setSearchQuery("");
    }
  }, [searchResult, shouldSearch, searchQuery]);

  useEffect(() => {
    if (error && shouldSearch) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: "Sorry, I encountered an error while processing your request.",
        timestamp: new Date(),
        isError: true,
        originalQuery: searchQuery,
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsWaitingForResponse(false);
      setShouldSearch(false);
      setSearchQuery("");
    }
  }, [error, shouldSearch, searchQuery]);

  const handleSubmit = () => {
    if (!currentQuery.trim() || isWaitingForResponse) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: currentQuery.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setSearchQuery(currentQuery.trim());
    setShouldSearch(true);
    setIsWaitingForResponse(true);
    setCurrentQuery("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentQuery(suggestion);
  };

  const handleClearChat = () => {
    setMessages([]);
    setCurrentQuery("");
    setIsWaitingForResponse(false);
    setShouldSearch(false);
    setSearchQuery("");
  };

  const handleRetry = (originalQuery: string) => {
    setSearchQuery(originalQuery);
    setShouldSearch(true);
    setIsWaitingForResponse(true);
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

  return (
    <div className="relative h-[calc(100vh-100px)] bg-background">
      {/* Header */}
      {messages.length > 0 && (
        <div className="px-6 py-4 border-b border-border bg-card/50">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearChat}
              className="gap-2 ml-auto"
            >
              <RotateCcw className="w-4 h-4" />
              Clear Chat
            </Button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div
        className={cn(
          "absolute inset-0 bottom-[150px] overflow-hidden",
          messages.length > 0 ? "top-[73px]" : "top-0"
        )}
      >
        <div className="h-full px-6 py-4 pb-6 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              <AnimatingContainer animation="zoomIn" duration={0.8}>
                <img
                  src="/icons/tex-gpt.png"
                  alt="TexGPT"
                  className="size-24"
                />
              </AnimatingContainer>

              <div className="text-center">
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
              </div>

              {/* Suggested Prompts */}
              <div className="w-full max-w-2xl space-y-3">
                <h3 className="text-sm font-medium text-center text-muted-foreground">
                  Try asking about:
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {SUGGESTED_PROMPTS.map((prompt, index) => (
                    <PromptSuggestion
                      key={index}
                      onClick={() => handleSuggestionClick(prompt)}
                      className="text-left"
                    >
                      {prompt}
                    </PromptSuggestion>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-4",
                    message.type === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.type === "assistant" && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 bg-primary">
                      <img
                        src="/icons/tex-gpt.png"
                        alt="TexGPT"
                        className="w-6 h-6"
                      />
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3",
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <div className="space-y-2">
                      {message.type === "assistant" ? (
                        message.isError ? (
                          <div className="space-y-3">
                            <p className="text-sm text-red-600 dark:text-red-400">
                              {message.content}
                            </p>
                            {message.originalQuery && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleRetry(message.originalQuery!)
                                }
                                className="gap-2"
                                disabled={isWaitingForResponse}
                              >
                                <RefreshCw className="w-4 h-4" />
                                Retry
                              </Button>
                            )}
                          </div>
                        ) : (
                          <Markdown className="prose-sm prose max-w-none dark:prose-invert">
                            {message.content}
                          </Markdown>
                        )
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}

                      <div className="flex items-center justify-between">
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
                      </div>
                    </div>

                    {/* References */}
                    {message.type === "assistant" &&
                      !message.isError &&
                      expandedReferences.has(message.id) && (
                        <div className="pt-3 mt-3 space-y-2 border-t border-border/50">
                          <p className="text-xs font-medium opacity-70">
                            References:
                          </p>
                          {message.references &&
                          message.references.length > 0 ? (
                            <div className="space-y-1">
                              {message.references
                                .slice(0, 10)
                                .map((reference, index) => (
                                  <div
                                    key={index}
                                    className="p-2 text-xs rounded-lg bg-background/50"
                                  >
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium truncate opacity-90">
                                        {reference.filename}
                                      </p>
                                      <span className="ml-2 text-xs opacity-60 shrink-0">
                                        {(reference.score * 100).toFixed(1)}%
                                      </span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <p className="text-xs opacity-60">
                              No references found for this response.
                            </p>
                          )}
                        </div>
                      )}
                  </div>

                  {message.type === "user" && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 bg-muted">
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shrink-0"
                        title="You"
                      >
                        <User2Icon className="w-6 h-6 text-black" />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Loading State */}
              {isWaitingForResponse && (
                <div className="flex justify-start gap-4">
                  <div
                    className="flex items-center justify-center w-8 h-8 bg-[#1a1a1a] rounded-lg shrink-0"
                    title="TexGPT"
                  >
                    <img
                      src="/icons/tex-gpt.png"
                      alt="TexGPT"
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Loader variant="typing" size="sm" />
                      <span className="text-sm text-muted-foreground">
                        {isSearching
                          ? "Searching knowledge base..."
                          : "Thinking..."}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <PromptInput
            value={currentQuery}
            onValueChange={setCurrentQuery}
            onSubmit={handleSubmit}
            isLoading={isWaitingForResponse}
            className="shadow-lg"
          >
            <PromptInputTextarea
              placeholder="Ask me anything..."
              className="text-base"
              disabled={isWaitingForResponse}
            />
            <PromptInputActions>
              <PromptInputAction tooltip="Send message">
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!currentQuery.trim() || isWaitingForResponse}
                  className="rounded-full"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </PromptInputAction>
            </PromptInputActions>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}

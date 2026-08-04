/* Hallmark · design-system: design.md
 *
 * Tex-GPT conversation history, persisted to localStorage.
 *
 * Conversations previously lived only in component state, so a reload — or
 * navigating to Notes and back — lost the whole exchange. This keeps them.
 *
 * Design notes:
 *  - The *active* conversation is saved as it grows, so a reload mid-thread
 *    resumes it rather than restarting.
 *  - Timestamps are serialised as epoch ms and rehydrated to Date, because JSON
 *    turns a Date into a string and the UI calls `.toLocaleTimeString()` on it.
 *  - Storage is capped by conversation count *and* by total characters. An
 *    unbounded chat log will eventually throw QuotaExceededError, and the failure
 *    mode there is the app breaking on write, not just history being lost.
 *  - Reads and writes are wrapped: localStorage throws in private-mode Safari and
 *    when the quota is full, and neither should take the page down.
 */

import { useCallback, useEffect, useMemo, useState } from "react";

export type StoredMessage = {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  isError?: boolean;
  references?: Array<{ filename: string; score: number }>;
};

export type Conversation = {
  id: string;
  /** First user message, trimmed — used as the list label. */
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: StoredMessage[];
};

const STORAGE_KEY = "notebot-texgpt-history";
const MAX_CONVERSATIONS = 25;
const MAX_TOTAL_CHARS = 400_000;
const TITLE_LENGTH = 80;

type SerialisedMessage = Omit<StoredMessage, "timestamp"> & {
  timestamp: number;
};
type SerialisedConversation = Omit<Conversation, "messages"> & {
  messages: SerialisedMessage[];
};

function read(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SerialisedConversation[];
    if (!Array.isArray(parsed)) return [];

    return parsed.map(conversation => ({
      ...conversation,
      messages: (conversation.messages ?? []).map(message => ({
        ...message,
        // JSON has no Date; the UI calls .toLocaleTimeString() on this
        timestamp: new Date(message.timestamp),
      })),
    }));
  } catch {
    return [];
  }
}

/** Trim oldest-first until both the count and the size budget are met. */
function withinBudget(conversations: Conversation[]): Conversation[] {
  let trimmed = conversations.slice(0, MAX_CONVERSATIONS);

  const size = (list: Conversation[]) =>
    list.reduce(
      (total, conversation) =>
        total +
        conversation.messages.reduce((sum, m) => sum + m.content.length, 0),
      0
    );

  while (trimmed.length > 1 && size(trimmed) > MAX_TOTAL_CHARS) {
    trimmed = trimmed.slice(0, -1);
  }

  return trimmed;
}

function write(conversations: Conversation[]) {
  if (typeof window === "undefined") return;
  try {
    const serialised: SerialisedConversation[] = conversations.map(
      conversation => ({
        ...conversation,
        messages: conversation.messages.map(message => ({
          ...message,
          timestamp: message.timestamp.getTime(),
        })),
      })
    );
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serialised));
  } catch {
    // Private mode or a full quota. History is a convenience, not the feature.
  }
}

export function makeTitle(messages: StoredMessage[]): string {
  const firstUser = messages.find(m => m.type === "user");
  const text = (firstUser?.content ?? "New conversation").trim();
  return text.length > TITLE_LENGTH
    ? `${text.slice(0, TITLE_LENGTH).trimEnd()}…`
    : text;
}

export function useChatHistory() {
  // read lazily — one synchronous localStorage hit on mount, not per render
  const [conversations, setConversations] = useState<Conversation[]>(read);

  /* Mirror to storage whenever the list changes. */
  useEffect(() => {
    write(conversations);
  }, [conversations]);

  /** Insert or update a conversation, newest first. */
  const save = useCallback((id: string, messages: StoredMessage[]) => {
    if (messages.length === 0) return;

    setConversations(previous => {
      const now = Date.now();
      const existing = previous.find(c => c.id === id);
      const entry: Conversation = {
        id,
        title: makeTitle(messages),
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        messages,
      };
      const rest = previous.filter(c => c.id !== id);
      return withinBudget([entry, ...rest]);
    });
  }, []);

  const remove = useCallback((id: string) => {
    setConversations(previous => previous.filter(c => c.id !== id));
  }, []);

  /** Put a removed conversation back, in date order. Powers Undo. */
  const restore = useCallback((conversation: Conversation) => {
    setConversations(previous =>
      withinBudget(
        [conversation, ...previous.filter(c => c.id !== conversation.id)].sort(
          (a, b) => b.updatedAt - a.updatedAt
        )
      )
    );
  }, []);

  const clear = useCallback(() => setConversations([]), []);

  const get = useCallback(
    (id: string) => conversations.find(c => c.id === id),
    [conversations]
  );

  /* Newest first — the list is maintained in that order, but a restore or a
   * hand-edited storage blob could break it. */
  const ordered = useMemo(
    () => [...conversations].sort((a, b) => b.updatedAt - a.updatedAt),
    [conversations]
  );

  return { conversations: ordered, save, remove, restore, clear, get };
}

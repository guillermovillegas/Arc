"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type FormEvent,
} from "react";
import { Loader2, Search, Send, MessageSquare, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Participant {
  id?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
}

interface ConversationItem {
  id: string;
  otherParticipant?: Participant;
  lastMessage: { text: string; createdAt: string } | null;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function initials(p?: Participant): string {
  const first = p?.firstName?.[0] ?? "";
  const last = p?.lastName?.[0] ?? "";
  return first || last ? `${first}${last}` : "?";
}

function fullName(p?: Participant): string {
  const first = p?.firstName ?? "";
  const last = p?.lastName ?? "";
  return first || last ? `${first} ${last}`.trim() : "Unknown";
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ClientMessagesPage() {
  const { accessToken, user } = useAuth();
  const currentUserId = user?.id ?? "";

  /* ---- conversations ---- */
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [convoLoading, setConvoLoading] = useState(true);
  const [convoError, setConvoError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  /* ---- active thread ---- */
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgError, setMsgError] = useState<string | null>(null);

  /* ---- compose ---- */
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  /* ---- refs ---- */
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ---------------------------------------------------------------- */
  /*  Fetch conversations                                              */
  /* ---------------------------------------------------------------- */

  const loadConversations = useCallback(async () => {
    if (!accessToken) return;
    setConvoError(null);
    setConvoLoading(true);
    try {
      const res = await api.get<{ data: ConversationItem[] }>(
        "/messages/conversations",
        { token: accessToken },
      );
      setConversations(res.data ?? []);
    } catch {
      // Network error on initial load — degrade to empty state
    } finally {
      setConvoLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  /* ---------------------------------------------------------------- */
  /*  Fetch messages for active conversation                           */
  /* ---------------------------------------------------------------- */

  const loadMessages = useCallback(
    async (conversationId: string) => {
      if (!accessToken) return;
      setMsgError(null);
      setMsgLoading(true);
      try {
        const res = await api.get<{ data: Message[] }>(
          `/messages/conversations/${conversationId}`,
          { token: accessToken },
        );
        setMessages(res.data ?? []);
      } catch {
        // Network error on initial load — degrade to empty state
      } finally {
        setMsgLoading(false);
      }
    },
    [accessToken],
  );

  useEffect(() => {
    if (activeId) {
      loadMessages(activeId);
    }
  }, [activeId, loadMessages]);

  /* ---- auto-scroll ---- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---- focus input when switching conversation ---- */
  useEffect(() => {
    if (activeId) {
      inputRef.current?.focus();
    }
  }, [activeId]);

  /* ---------------------------------------------------------------- */
  /*  Send message                                                     */
  /* ---------------------------------------------------------------- */

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !activeId || !accessToken || sending) return;

    setSending(true);
    try {
      await api.post(
        `/messages/conversations/${activeId}`,
        { text },
        { token: accessToken },
      );
      setDraft("");

      /* Optimistic: append immediately, then refresh */
      const optimistic: Message = {
        id: `temp-${Date.now()}`,
        text,
        senderId: currentUserId,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimistic]);

      /* Refresh in background */
      loadMessages(activeId);
      loadConversations();
    } catch {
      /* keep the draft so the user can retry */
    } finally {
      setSending(false);
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Derived data                                                     */
  /* ---------------------------------------------------------------- */

  const filtered = search
    ? conversations.filter((c) => {
        const name = fullName(c.otherParticipant).toLowerCase();
        return name.includes(search.toLowerCase());
      })
    : conversations;

  const activeConvo = conversations.find((c) => c.id === activeId) ?? null;

  /* ---------------------------------------------------------------- */
  /*  Sub-components (inline for colocation)                           */
  /* ---------------------------------------------------------------- */

  /* -- Conversation list item -- */
  function ConvoRow({ conv }: { conv: ConversationItem }) {
    const isActive = conv.id === activeId;
    return (
      <button
        type="button"
        onClick={() => setActiveId(conv.id)}
        className={cn(
          "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
          isActive
            ? "bg-ivory-200"
            : "hover:bg-ivory-200/60",
        )}
      >
        {/* Avatar */}
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brass-100 text-[0.875rem] font-bold text-brass-700">
          {initials(conv.otherParticipant)}
        </span>

        {/* Name + preview */}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.875rem] font-medium text-espresso-800">
            {fullName(conv.otherParticipant)}
          </span>
          {conv.lastMessage && (
            <span className="block truncate text-[0.8125rem] text-espresso-400">
              {conv.lastMessage.text}
            </span>
          )}
        </span>

        {/* Timestamp */}
        {conv.lastMessage && (
          <span className="shrink-0 text-[0.75rem] text-espresso-300">
            {relativeTime(conv.lastMessage.createdAt)}
          </span>
        )}
      </button>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="-m-6 flex h-[calc(100vh-64px)] flex-col">
      {/* ---- Mobile header when thread is open ---- */}
      {activeId && (
        <div className="flex items-center gap-2 border-b border-espresso-200/60 bg-ivory-50 px-4 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setActiveId(null)}
            className="text-espresso-600 hover:text-espresso-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </button>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brass-100 text-[0.75rem] font-bold text-brass-700">
            {initials(activeConvo?.otherParticipant)}
          </span>
          <span className="truncate text-[0.875rem] font-medium text-espresso-800">
            {fullName(activeConvo?.otherParticipant)}
          </span>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* ============================================================ */}
        {/*  LEFT PANEL — conversation list                              */}
        {/* ============================================================ */}
        <aside
          className={cn(
            "flex w-full flex-col border-r border-espresso-200/60 bg-ivory-50 md:w-[320px] md:shrink-0",
            activeId ? "hidden md:flex" : "flex",
          )}
        >
          {/* Search */}
          <div className="border-b border-espresso-200/60 p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso-300" />
              <Input
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 border-espresso-200/60 bg-ivory-100 pl-9 text-[0.875rem] placeholder:text-espresso-300"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {convoLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-5 w-5 animate-spin text-espresso-300" />
              </div>
            ) : convoError ? (
              <div className="px-4 py-12 text-center">
                <p className="text-[0.875rem] text-red-600">{convoError}</p>
                <Button
                  variant="arc-outline"
                  size="sm"
                  className="mt-3"
                  onClick={loadConversations}
                >
                  Retry
                </Button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-4 py-16 text-center">
                <MessageSquare className="mx-auto h-8 w-8 text-espresso-200" />
                <h3 className="mt-3 font-serif text-[1rem] text-espresso-800">
                  {search ? "No results" : "No conversations yet"}
                </h3>
                <p className="mt-1 text-[0.8125rem] text-espresso-400">
                  {search
                    ? "Try a different search term."
                    : "Start one by messaging a provider!"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-espresso-200/40">
                {filtered.map((conv) => (
                  <ConvoRow key={conv.id} conv={conv} />
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* ============================================================ */}
        {/*  RIGHT PANEL — message thread                                */}
        {/* ============================================================ */}
        <section
          className={cn(
            "flex flex-1 flex-col bg-ivory-100",
            activeId ? "flex" : "hidden md:flex",
          )}
        >
          {!activeId ? (
            /* -- Empty state -- */
            <div className="flex flex-1 flex-col items-center justify-center px-4">
              <MessageSquare className="h-12 w-12 text-espresso-200" />
              <h2 className="mt-4 font-serif text-[1.125rem] text-espresso-800">
                Select a conversation
              </h2>
              <p className="mt-1 text-[0.875rem] text-espresso-400">
                Choose a conversation from the list to start messaging.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop header */}
              <div className="hidden items-center gap-3 border-b border-espresso-200/60 bg-ivory-50 px-5 py-3 md:flex">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brass-100 text-[0.8125rem] font-bold text-brass-700">
                  {initials(activeConvo?.otherParticipant)}
                </span>
                <span className="truncate text-[0.9375rem] font-medium text-espresso-800">
                  {fullName(activeConvo?.otherParticipant)}
                </span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6">
                {msgLoading ? (
                  <div className="flex justify-center py-16">
                    <Loader2 className="h-5 w-5 animate-spin text-espresso-300" />
                  </div>
                ) : msgError ? (
                  <div className="py-12 text-center">
                    <p className="text-[0.875rem] text-red-600">{msgError}</p>
                    <Button
                      variant="arc-outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => loadMessages(activeId)}
                    >
                      Retry
                    </Button>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <MessageSquare className="h-8 w-8 text-espresso-200" />
                    <p className="mt-3 text-[0.875rem] text-espresso-400">
                      No messages yet. Say hello!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => {
                      const isMine = msg.senderId === currentUserId;
                      return (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex",
                            isMine ? "justify-end" : "justify-start",
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[75%] rounded-2xl px-4 py-2.5",
                              isMine
                                ? "rounded-br-md bg-espresso-800 text-ivory-100"
                                : "rounded-bl-md bg-ivory-200 text-espresso-800",
                            )}
                          >
                            <p className="whitespace-pre-wrap break-words text-[0.875rem] leading-relaxed">
                              {msg.text}
                            </p>
                            <p
                              className={cn(
                                "mt-1 text-[0.6875rem]",
                                isMine
                                  ? "text-ivory-100/60"
                                  : "text-espresso-400",
                              )}
                            >
                              {formatTimestamp(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={bottomRef} />
                  </div>
                )}
              </div>

              {/* Compose bar */}
              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 border-t border-espresso-200/60 bg-ivory-50 px-4 py-3"
              >
                <Input
                  ref={inputRef}
                  placeholder="Type a message..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  disabled={sending}
                  className="h-10 flex-1 border-espresso-200/60 bg-ivory-100 text-[0.875rem] placeholder:text-espresso-300"
                />
                <Button
                  type="submit"
                  variant="arc"
                  size="icon"
                  disabled={sending || !draft.trim()}
                  className="h-10 w-10 shrink-0"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

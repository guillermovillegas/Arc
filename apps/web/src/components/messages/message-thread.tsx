"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2, MessageSquare } from "lucide-react";
import Link from "next/link";
import {
  getConversationMessages,
  markConversationRead,
  sendMessage,
  type MessageItem,
} from "@/lib/data-client";
import { useAuth } from "@/lib/auth";

const POLL_INTERVAL_MS = 8_000;

function messageTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export interface MessageThreadProps {
  conversationId: string;
  recipientId: string;
  recipientName: string;
  /** Link back to the role's inbox. */
  backHref: string;
}

export function MessageThread({
  conversationId,
  recipientId,
  recipientName,
  backHref,
}: MessageThreadProps) {
  const { accessToken } = useAuth();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    try {
      const rows = await getConversationMessages(conversationId);
      setMessages(rows);
      setError(null);
    } catch (reason: unknown) {
      setError(
        reason instanceof Error ? reason.message : "Messages are unavailable.",
      );
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  // Initial load + read receipt + visible-only polling (R4, R5).
  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    refresh();
    markConversationRead(conversationId).catch(() => undefined);

    const startPolling = () => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(() => {
        if (document.visibilityState === "visible") {
          refresh();
          markConversationRead(conversationId).catch(() => undefined);
        }
      }, POLL_INTERVAL_MS);
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        refresh();
        markConversationRead(conversationId).catch(() => undefined);
      }
    };

    startPolling();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [accessToken, conversationId, refresh]);

  async function submit() {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setSendError(null);
    try {
      const created = await sendMessage({ recipientId, text });
      setDraft("");
      setMessages((current) => {
        const next = [...current, created];
        return next.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      });
    } catch (reason: unknown) {
      setSendError(
        reason instanceof Error ? reason.message : "Could not send the message.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="px-5 md:px-10 lg:px-14 py-8 md:py-12 flex flex-col gap-8">
      <header className="flex flex-col gap-4 pb-5 border-b border-smoke-700">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-label uppercase tracking-[0.28em] text-taupe-300 font-medium text-[10px] hover:text-bone-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Inbox
        </Link>
        <h2 className="font-display text-[clamp(1.75rem,5vw,2.625rem)] leading-none text-bone-100">
          <em className="font-editorial italic font-light text-champagne-400">
            {recipientName}.
          </em>
        </h2>
      </header>

      {error ? (
        <p role="alert" className="border border-oxblood-500/60 px-5 py-4 text-oxblood-400">
          {error}
        </p>
      ) : loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-taupe-300" />
        </div>
      ) : messages.length === 0 ? (
        <section className="flex flex-col items-center text-center py-16 px-6 border border-smoke-700 bg-smoke-900">
          <MessageSquare className="h-12 w-12 text-smoke-700" strokeWidth={1} aria-hidden="true" />
          <p className="mt-6 font-editorial italic text-body-lg text-bone-200 max-w-[420px] leading-snug">
            No messages yet. Open with something kind.
          </p>
        </section>
      ) : (
        <ol className="flex flex-col gap-4">
          {messages.map((item) => {
            const own = item.senderId === recipientId ? false : true;
            return (
              <li
                key={item.id}
                data-alignment={own ? "self" : "other"}
                className={`flex flex-col gap-1 max-w-[85%] ${
                  own ? "self-end items-end" : "self-start items-start"
                }`}
              >
                <p
                  className={`px-4 py-3 border ${
                    own
                      ? "border-champagne-400/60 bg-smoke-800 text-bone-100"
                      : "border-smoke-700 bg-smoke-900 text-bone-200"
                  } font-editorial italic text-body-md leading-snug`}
                >
                  {item.text}
                </p>
                <time className="font-mono text-mono uppercase tracking-[0.12em] text-taupe-300">
                  {messageTime(item.createdAt)}
                </time>
              </li>
            );
          })}
        </ol>
      )}

      <form
        className="mt-auto flex flex-col gap-3 border-t border-smoke-700 pt-5"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        {sendError ? (
          <p role="alert" className="border border-oxblood-500/60 px-4 py-3 text-oxblood-400">
            {sendError}
          </p>
        ) : null}
        <div className="flex flex-col sm:flex-row gap-3">
          <label htmlFor="message-draft" className="sr-only">
            Write a message
          </label>
          <textarea
            id="message-draft"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write a note. Keep it warm."
            rows={2}
            maxLength={2000}
            disabled={sending}
            className="w-full bg-smoke-900 border border-smoke-700 px-3 py-2 font-editorial italic text-body-md text-bone-100 placeholder:text-taupe-300 focus-visible:outline-none focus-visible:border-champagne-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={sending || draft.trim().length === 0}
            className="px-5 py-2.5 border border-champagne-400 text-label uppercase tracking-[0.28em] text-champagne-400 font-medium text-[10px] hover:bg-champagne-400 hover:text-smoke-900 disabled:opacity-50 self-start sm:self-auto"
          >
            {sending ? "Sending…" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
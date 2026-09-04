"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { sendMessage } from "@/lib/data-client";
import { sendMessageSchema } from "@faineant/shared";
import { useAuth } from "@/lib/auth";

export interface NewConversationComposerProps {
  recipientId: string;
  recipientName: string;
  /** Where the first message should land after the conversation is created. */
  threadHrefFor: (conversationId: string) => string;
  backHref: string;
}

export function NewConversationComposer({
  recipientId,
  recipientName,
  threadHrefFor,
  backHref,
}: NewConversationComposerProps) {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const trimmed = draft.trim();
  const valid =
    sendMessageSchema.safeParse({ recipientId, text: trimmed }).success;

  async function submit() {
    if (!valid || sending || !accessToken) return;
    setSending(true);
    setSendError(null);
    try {
      const created = await sendMessage({ recipientId, text: trimmed });
      router.push(threadHrefFor(created.conversationId));
    } catch (reason: unknown) {
      setSendError(
        reason instanceof Error ? reason.message : "Could not send the message.",
      );
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
          Write to{" "}
          <em className="font-editorial italic font-light text-champagne-400">
            {recipientName}.
          </em>
        </h2>
      </header>

      <form
        className="flex flex-col gap-3"
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
        <label htmlFor="message-draft" className="sr-only">
          Write a message
        </label>
        <textarea
          id="message-draft"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Open the conversation. Something kind works."
          rows={5}
          maxLength={2000}
          disabled={sending}
          className="w-full bg-smoke-900 border border-smoke-700 px-3 py-2 font-editorial italic text-body-md text-bone-100 placeholder:text-taupe-300 focus-visible:outline-none focus-visible:border-champagne-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={sending || !valid}
          className="px-5 py-2.5 border border-champagne-400 text-label uppercase tracking-[0.28em] text-champagne-400 font-medium text-[10px] hover:bg-champagne-400 hover:text-smoke-900 disabled:opacity-50 self-start"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </form>
    </div>
  );
}
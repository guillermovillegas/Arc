"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getConversation, type ConversationDetail } from "@/lib/data-client";
import { MessageThread } from "@/components/messages/message-thread";
import { useAuth } from "@/lib/auth";

export function ConversationPageView({ role }: { role: "client" | "provider" }) {
  const { accessToken } = useAuth();
  const params = useParams<{ conversationId: string }>();
  const conversationId = params.conversationId;
  const [detail, setDetail] = useState<ConversationDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken || !conversationId) return;
    getConversation(conversationId)
      .then(setDetail)
      .catch((reason: unknown) =>
        setError(
          reason instanceof Error ? reason.message : "Conversation is unavailable.",
        ),
      );
  }, [accessToken, conversationId]);

  if (error) {
    return (
      <div className="px-5 md:px-10 lg:px-14 py-8 md:py-12">
        <p role="alert" className="border border-oxblood-500/60 px-5 py-4 text-oxblood-400">
          {error}
        </p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="px-5 md:px-10 lg:px-14 py-8 md:py-12">
        <p className="border border-smoke-700 px-5 py-12 text-center font-mono text-mono uppercase tracking-[0.24em] text-taupe-300">
          Opening the conversation…
        </p>
      </div>
    );
  }

  const name = detail.otherParticipant
    ? `${detail.otherParticipant.firstName} ${detail.otherParticipant.lastName}`.trim() ||
      "Faineant member"
    : "Faineant member";

  return (
    <MessageThread
      conversationId={detail.id}
      recipientId={detail.otherParticipantId}
      recipientName={name}
      backHref={`/dashboard/${role}/messages`}
    />
  );
}